import { Ionicons } from "@expo/vector-icons";
import { Link, Redirect, Stack, useRouter } from "expo-router";
import {
  Alert,
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
import { supabase } from "@/supabase";

export default function SignUpScreen() {
  const router = useRouter();
  const toast = useToast();
  const { session, loading } = useAuth();
  const { signInWithGoogle, googleLoading } = useGoogleSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const containerBg = useColorModeValue("background.50", "surface.100");
  const cardBg = useColorModeValue("white", "surface.200");
  const border = useColorModeValue("coolGray.200", "surface.500");
  const subtitle = useColorModeValue("coolGray.600", "coolGray.300");

  if (loading) {
    return (
      <Center flex={1} bg={containerBg}>
        <VStack space={3} alignItems="center">
          <Spinner color="primary.400" accessibilityLabel="Loading session state" />
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
    setInfo(null);

    if (!email.trim() || !password || !confirmPassword) {
      setFormError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (error) {
      const description = error.message ?? "We were unable to create your account.";
      setFormError(description);
      toast.show({
        title: "Sign-up failed",
        description,
        bgColor: "error.600",
      });
      return;
    }

    const existingUser =
      data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0;

    if (existingUser) {
      const message = "That email is already registered. Try logging in instead.";
      setFormError(message);
      toast.show({
        title: "Email already in use",
        description: message,
        bgColor: "error.600",
      });
      return;
    }

    if (data.session) {
      router.replace("/(tabs)");
      return;
    }

    const message =
      "Your vault is almost ready. Check your inbox to confirm your email and activate your Elara account.";
    setInfo(message);
    toast.show({
      title: "Confirm your email",
      description: message,
      bgColor: "success.600",
    });
  };

  return (
    <KeyboardAvoidingView
      flex={1}
      bg={containerBg}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Stack.Screen options={{ title: "Create Account" }} />
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
                <Heading size="xl">Create your Elara account</Heading>
                <Text fontSize="md" color={subtitle}>
                  Join the movement toward gold-backed financial sovereignty in minutes.
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
                    placeholder="Create a password"
                    secureTextEntry
                    returnKeyType="next"
                  />
                </FormControl>

                <FormControl isInvalid={Boolean(formError)}>
                  <FormControl.Label>Confirm password</FormControl.Label>
                  <Input
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter password"
                    secureTextEntry
                    returnKeyType="done"
                  />
                  {formError ? (
                    <FormControl.ErrorMessage>{formError}</FormControl.ErrorMessage>
                  ) : null}
                </FormControl>
              </VStack>

              {info ? (
                <Alert status="success" variant="left-accent" rounded="lg">
                  <VStack space={1}>
                    <Alert.Icon />
                    <Text color="coolGray.50" fontWeight="600">
                      Confirmation sent
                    </Text>
                    <Text color="coolGray.100">{info}</Text>
                  </VStack>
                </Alert>
              ) : null}

              <Button
                onPress={handleSubmit}
                isLoading={submitting}
                leftIcon={<Icon as={Ionicons} name="sparkles-outline" size="sm" />}
              >
                Create account
              </Button>

              <Button
                variant="ghost"
                colorScheme="primary"
                onPress={() => router.push("/login")}
                leftIcon={<Icon as={Ionicons} name="log-in-outline" size="sm" />}
              >
                I already have an account
              </Button>

              <Link href="/login" asChild>
                <Button variant="link" colorScheme="primary">
                  Return to login
                </Button>
              </Link>
            </VStack>

            <VStack space={3} mt={2}>
              <HStack alignItems="center" space={2}>
                <Divider flex={1} bg={border} />
                <Text fontSize="xs" color="coolGray.400" textTransform="uppercase">
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
