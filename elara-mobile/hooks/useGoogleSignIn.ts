import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Platform } from "react-native";

import { supabase } from "@/.env";

const AUTH_PATH = "callback";
const SCHEME = "elaramobile";

export function useGoogleSignIn() {
  const [googleLoading, setGoogleLoading] = useState(false);

  const signInWithGoogle = async () => {
    if (googleLoading) {
      return;
    }

    setGoogleLoading(true);

    try {
      const redirectTo = makeRedirectUri({
        scheme: SCHEME,
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
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }
        }
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return { signInWithGoogle, googleLoading };
}
