import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "@/components/ScreenContainer";
import AppButton from "@/components/AppButton";
import { Redirect, useRouter } from "expo-router";
import {
  Box,
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
  VStack,
  useToast,
} from "native-base";
import { useState } from "react";
import { Platform } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
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

  if (loading) {
    return (
      <ScreenContainer>
        <VStack flex={1} justifyContent="center" alignItems="center" space={3}>
          <Spinner
            color="brand.400"
            accessibilityLabel="Loading session state"
          />
          <Text color="semantic.textSecondary">
            Preparing your secure vault…
          </Text>
        </VStack>
      </ScreenContainer>
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (error) {
      const description =
        error.message ??
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
    <ScreenContainer padding={0}>
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <VStack flex={1} px={6} py={12} space={8}>
            <VStack space={2}>
              <Heading size="2xl" color="semantic.textPrimary">
                Welcome back to Elara
              </Heading>
              <Text color="semantic.textSecondary">
                Sign in to access your gold-backed balance and portfolio
                controls.
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
                <FormControl isInvalid={Boolean(formError)}>
                  <FormControl.Label>Email</FormControl.Label>
                  <Input
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@elara.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    color="black"
                    placeholderTextColor="coolGray.400"
                    bg="semantic.surface"
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
                    color="black"
                    placeholderTextColor="coolGray.400"
                    bg="semantic.surface"
                  />
                  {formError ? (
                    <FormControl.ErrorMessage>
                      {formError}
                    </FormControl.ErrorMessage>
                  ) : null}
                </FormControl>

                <AppButton
                  onPress={handleSubmit}
                  isLoading={submitting}
                  leftIcon={
                    <Icon as={Ionicons} name="log-in-outline" size="sm" />
                  }
                >
                  Log in
                </AppButton>

                <AppButton
                  variant="outline"
                  onPress={() => router.push("/(auth)/signup")}
                  leftIcon={
                    <Icon as={Ionicons} name="person-add-outline" size="sm" />
                  }
                >
                  Create an Elara account
                </AppButton>
              </VStack>

              <VStack space={3} mt={8}>
                <HStack alignItems="center" space={2}>
                  <Divider flex={1} bg="semantic.border" />
                  <Text
                    fontSize="xs"
                    color="semantic.textSecondary"
                    textTransform="uppercase"
                  >
                    or continue with
                  </Text>
                  <Divider flex={1} bg="semantic.border" />
                </HStack>
                <AppButton
                  variant="outline"
                  onPress={signInWithGoogle}
                  isLoading={googleLoading}
                  leftIcon={<Icon as={Ionicons} name="logo-google" size="sm" />}
                >
                  Continue with Google
                </AppButton>
              </VStack>
            </Box>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
