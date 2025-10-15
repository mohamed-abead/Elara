import { Redirect } from "expo-router";
import { Center, Spinner, useColorModeValue } from "native-base";

import { useAuth } from "@/hooks/use-auth";

export default function Index() {
  const { session, loading } = useAuth();
  const bg = useColorModeValue("primary.lightest", "primary.darkest");

  if (loading) {
    return (
      <Center flex={1} bg={bg}>
        <Spinner color="primary.light" />
      </Center>
    );
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
