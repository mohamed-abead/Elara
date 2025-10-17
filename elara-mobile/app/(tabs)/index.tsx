// app/(tabs)/index.tsx
import { useEffect, useRef } from "react";
import ScreenContainer from "@/components/ScreenContainer";
import { Heading, Text, VStack, Box, Button, useToast } from "native-base";
import { useRouter } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { createWalletIfNeeded } from "@/utils/wallet";

export default function TabOne() {
  const router = useRouter();
  const toast = useToast();
  const { user, session, signOut } = useAuth();
  const walletInitRef = useRef<string | null>(null);

  useEffect(() => {
    const token = session?.access_token;
    const userId = user?.id;

    if (!token || !userId) {
      return;
    }

    if (walletInitRef.current === userId) {
      return;
    }

    walletInitRef.current = userId;

    void createWalletIfNeeded(token, (message) =>
      toast.show({
        title: "Wallet setup failed",
        description: message,
        bgColor: "error.600",
      })
    );
  }, [session?.access_token, user?.id, toast]);

  return (
    <ScreenContainer>
      <VStack flex={1} space={8} px={6} py={10}>
        <VStack space={2}>
          <Heading size="lg" color="semantic.textSecondary">
            Vault balance
          </Heading>
          <Heading size="3xl" color="semantic.textPrimary">
            $12,345.67
          </Heading>
          <Text color="semantic.textSecondary">
            Placeholder balance — live data coming soon.
          </Text>
        </VStack>

        <Box
          bg="semantic.surface"
          borderRadius="2xl"
          px={6}
          py={8}
          borderWidth="1"
          borderColor="semantic.border"
          shadow={3}
        >
          <VStack space={5}>
            <Heading size="md" color="semantic.textPrimary">
              Account overview
            </Heading>
            <Text color="semantic.textSecondary">
              Track holdings, recent activity, and spending once the vault is
              wired into real data.
            </Text>
            <Button
              variant="outline"
              onPress={async () => {
                try {
                  await signOut();
                  router.replace("/(auth)");
                } catch (error) {
                  const message =
                    error instanceof Error
                      ? error.message
                      : "We could not sign you out. Please try again.";
                  toast.show({
                    title: "Sign-out failed",
                    description: message,
                    bgColor: "error.600",
                  });
                }
              }}
            >
              Sign out
            </Button>
          </VStack>
        </Box>
      </VStack>
    </ScreenContainer>
  );
}
