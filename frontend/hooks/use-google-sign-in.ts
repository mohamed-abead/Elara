import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Platform } from "react-native";

import { supabase } from "@/.env";
import { createWalletIfNeeded } from "@/utils/wallet";

const AUTH_PATH = "auth/callback";

type UseGoogleSignInOptions = {
  onWalletMessage?: (msg: string) => void;
};

export function useGoogleSignIn(options: UseGoogleSignInOptions = {}) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { onWalletMessage } = options;

  const ensureWallet = async () => {
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;

    if (accessToken) {
      await createWalletIfNeeded(accessToken, onWalletMessage);
    }
  };

  const signInWithGoogle = async () => {
    if (googleLoading) {
      return;
    }

    setGoogleLoading(true);

    try {
      const redirectTo = makeRedirectUri({
        scheme: "frontend",
        path: AUTH_PATH,
        preferLocalhost: true,
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        throw error;
      }

      const authUrl = data?.url;

      if (!authUrl) {
        throw new Error("Unable to start Google sign-in.");
      }

      if (Platform.OS === "web") {
        window.location.href = authUrl;
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectTo);

      if (result.type === "success" && result.url) {
        const url = new URL(result.url);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        const errorDescription = url.searchParams.get("error_description");

        if (error) {
          throw new Error(errorDescription ?? "Google sign-in failed.");
        }

        if (code) {
          const { data: exchangeData, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }

          const exchangeAccessToken = exchangeData?.session?.access_token;

          if (exchangeAccessToken) {
            await createWalletIfNeeded(exchangeAccessToken, onWalletMessage);
          } else {
            await ensureWallet();
          }
        }
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return { signInWithGoogle, googleLoading };
}
