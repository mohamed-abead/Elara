import { Redirect } from "expo-router";
import ScreenContainer from "@/components/ScreenContainer";
import { Spinner, Text, VStack } from "native-base";

import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <ScreenContainer>
        <VStack flex={1} justifyContent="center" alignItems="center" space={3}>
          <Spinner color="brand.400" accessibilityLabel="Loading session state" />
          <Text color="semantic.textSecondary">Preparing your secure vault…</Text>
        </VStack>
      </ScreenContainer>
    );
  }

  return <Redirect href={session ? "/(tabs)" : "/(auth)"} />;
}
