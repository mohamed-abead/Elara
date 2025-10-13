import { Redirect } from "expo-router";
import { Center, Spinner, useColorModeValue } from "native-base";

import { useAuth } from "@/hooks/use-auth";

export default function Index() {
  const { session, loading } = useAuth();
  const bg = useColorModeValue("background.50", "surface.100");

  if (loading) {
    return (
      <Center flex={1} bg={bg}>
        <Spinner color="primary.400" />
      </Center>
    );
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
