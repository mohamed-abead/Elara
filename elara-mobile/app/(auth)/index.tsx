import ScreenContainer from "@/components/ScreenContainer";
import AppButton from "@/components/AppButton";
import { Redirect, useRouter } from "expo-router";
import { Center, Heading, Spinner, Text, VStack } from "native-base";

import { useAuth } from "@/hooks/useAuth";

export default function AuthIndex() {
  const router = useRouter();
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <ScreenContainer>
        <Center flex={1}>
          <VStack space={3} alignItems="center">
            <Spinner color="brand.400" accessibilityLabel="Loading session state" />
            <Text color="semantic.textSecondary">
              Preparing your secure vault…
            </Text>
          </VStack>
        </Center>
      </ScreenContainer>
    );
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <ScreenContainer>
      <VStack flex={1} justifyContent="center" space={8} px={6}>
        <VStack space={3}>
          <Heading
            size="2xl"
            color="semantic.textPrimary"
            lineHeight="2xl"
            letterSpacing="md"
          >
            Money you can trust
          </Heading>
          <Text color="semantic.textSecondary" fontSize="lg" lineHeight="lg">
            Elara turns every deposit into real gold holdings. Log in or create
            an account to manage your vault-backed balance.
          </Text>
        </VStack>

        <VStack space={3}>
          <AppButton onPress={() => router.push("/(auth)/login")}>
            Log in
          </AppButton>
          <AppButton
            variant="outline"
            onPress={() => router.push("/(auth)/signup")}
          >
            Create account
          </AppButton>
        </VStack>
      </VStack>
    </ScreenContainer>
  );
}
