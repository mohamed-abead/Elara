import { Ionicons } from "@expo/vector-icons";
import { Link, Redirect, Stack, useRouter } from "expo-router";
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  Heading,
  HStack,
  Icon,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "native-base";
import { useState } from "react";
import { Platform } from "react-native";

import { useAuth } from "@/hooks/use-auth";
import { useGoogleSignIn } from "@/hooks/use-google-sign-in";
import { supabase } from "@/.env";

export default function LoginScreen() {
  const router = useRouter();
  const toast = useToast();
  const { session, loading } = useAuth();
  const { signInWithGoogle, googleLoading } = useGoogleSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const containerBg = useColorModeValue("background.50", "surface.100");
  const cardBg = useColorModeValue("white", "surface.200");
  const border = useColorModeValue("coolGray.200", "surface.500");
  const subtitle = useColorModeValue("coolGray.600", "coolGray.300");

  if (loading) {
    return (
      <Center flex={1} bg={containerBg}>
        <VStack space={3} alignItems="center">
          <Spinner
            color="primary.400"
            accessibilityLabel="Loading session state"
          />
          <Text color="coolGray.400">Preparing your secure vault...</Text>
        </VStack>
      </Center>
    );
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    setFormError(null);

    if (!email.trim() || !password) {
      setFormError("Please provide both email and password.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (error) {
      const description =
        error?.message ??
        "We could not verify your credentials. Please try again.";
      setFormError(description);
      toast.show({
        title: "Unable to sign in",
        description,
        bgColor: "error.600",
      });
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      flex={1}
      bg={containerBg}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Stack.Screen options={{ title: "Log In" }} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center flex={1} px={6} py={{ base: 12, md: 16 }}>
          <Box
            w="100%"
            maxW="lg"
            bg={cardBg}
            borderRadius="2xl"
            px={{ base: 6, md: 10 }}
            py={{ base: 8, md: 12 }}
            borderWidth={1}
            borderColor={border}
            shadow={6}
          >
            <VStack space={6}>
              <VStack space={3}>
                <Heading size="xl">Welcome back to Elara</Heading>
                <Text fontSize="md" color={subtitle}>
                  Sign in to access your gold-backed balance and portfolio
                  controls.
                </Text>
              </VStack>

              <VStack space={5}>
                <FormControl isInvalid={Boolean(formError)}>
                  <FormControl.Label>Email</FormControl.Label>
                  <Input
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@elara.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </FormControl>

                <FormControl isInvalid={Boolean(formError)}>
                  <FormControl.Label>Password</FormControl.Label>
                  <Input
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    secureTextEntry
                    returnKeyType="done"
                  />
                  {formError ? (
                    <FormControl.ErrorMessage>
                      {formError}
                    </FormControl.ErrorMessage>
                  ) : null}
                </FormControl>
              </VStack>

              <Button
                onPress={handleSubmit}
                isLoading={submitting}
                leftIcon={
                  <Icon as={Ionicons} name="log-in-outline" size="sm" />
                }
              >
                Log in
              </Button>

              <Button
                variant="ghost"
                colorScheme="primary"
                onPress={() => router.push("/signup")}
                leftIcon={
                  <Icon as={Ionicons} name="person-add-outline" size="sm" />
                }
              >
                Create an Elara account
              </Button>

              <Link href="/signup" asChild>
                <Button variant="link" colorScheme="primary">
                  Need help? Create a new account instead.
                </Button>
              </Link>
            </VStack>

            <VStack space={3} mt={2}>
              <HStack alignItems="center" space={2}>
                <Divider flex={1} bg={border} />
                <Text
                  fontSize="xs"
                  color="coolGray.400"
                  textTransform="uppercase"
                >
                  or continue with
                </Text>
                <Divider flex={1} bg={border} />
              </HStack>
              <Button
                variant="outline"
                borderColor="primary.400"
                onPress={signInWithGoogle}
                isLoading={googleLoading}
                leftIcon={<Icon as={Ionicons} name="logo-google" size="sm" />}
              >
                Continue with Google
              </Button>
            </VStack>
          </Box>
        </Center>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
