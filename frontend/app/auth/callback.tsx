import { useEffect } from "react";
import { Center, Spinner, Text, VStack } from "native-base";
import { useLocalSearchParams, useRouter } from "expo-router";

import { supabase } from "@/.env";

export default function AuthCallback() {
  const params = useLocalSearchParams<{
    code?: string;
    error?: string;
    error_description?: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    const handleExchange = async () => {
      if (params.error) {
        return;
      }

      const codeParam = Array.isArray(params.code)
        ? params.code[0]
        : params.code;

      if (codeParam) {
        const { error } = await supabase.auth.exchangeCodeForSession(codeParam);

        if (!error) {
          router.replace("/(tabs)");
        }
      }
    };

    void handleExchange();
  }, [params.code, params.error, router]);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted && data.session) {
        router.replace("/(tabs)");
      }
    };

    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.replace("/(tabs)");
      }
    });

    void syncSession();

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [router]);

  const isError = Array.isArray(params.error) ? params.error[0] : params.error;
  const errorDescription = Array.isArray(params.error_description)
    ? params.error_description[0]
    : params.error_description;

  const message = isError
    ? (errorDescription as string | undefined) ?? "Unable to authenticate."
    : "Finalising sign-in…";

  return (
    <Center flex={1} bg="primary.light">
      <VStack space={4} alignItems="center">
        {!params.error ? <Spinner color="primary.light" /> : null}
        <Text color="primary.darkest" textAlign="center">
          {message}
        </Text>
      </VStack>
    </Center>
  );
}
