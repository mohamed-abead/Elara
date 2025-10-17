import ScreenContainer from "@/components/ScreenContainer";
import AppButton from "@/components/AppButton";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import {
  FormControl,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
  useToast,
} from "native-base";
import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/.env";

type Params = {
  email?: string | string[];
};

export default function VerifyOtpScreen() {
  const router = useRouter();
  const toast = useToast();
  const { session, loading } = useAuth();
  const params = useLocalSearchParams<Params>();

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const email = useMemo(() => {
    const raw = params.email;
    if (Array.isArray(raw)) {
      return raw[0]?.toString().trim() ?? "";
    }
    return raw?.toString().trim() ?? "";
  }, [params.email]);

  useEffect(() => {
    if (!email) {
      router.replace("/(auth)/signup");
    }
  }, [email, router]);

  if (loading) {
    return (
      <ScreenContainer>
        <VStack flex={1} justifyContent="center" alignItems="center" space={3}>
          <Spinner color="brand.400" accessibilityLabel="Loading session state" />
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

  const handleVerify = async () => {
    if (submitting) {
      return;
    }

    if (!email) {
      setFormError("Missing email address for verification.");
      return;
    }

    if (!code.trim()) {
      setFormError("Enter the one-time passcode from your email.");
      return;
    }

    setFormError(null);
    setSubmitting(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "signup",
    });
    setSubmitting(false);

    if (error) {
      const description =
        error.message ?? "We could not verify that passcode. Please try again.";
      setFormError(description);
      toast.show({
        title: "Verification failed",
        description,
        bgColor: "error.600",
      });
      return;
    }

    if (data.session) {
      toast.show({
        title: "Account confirmed",
        description: "Your vault is ready. Jumping into Elara now.",
        bgColor: "success.600",
      });
      router.replace("/(tabs)");
      return;
    }

    toast.show({
      title: "Code accepted",
      description: "Sign in to continue.",
      bgColor: "success.600",
    });
    router.replace("/(auth)/login");
  };

  const handleResend = async () => {
    if (resending || !email) {
      return;
    }

    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setResending(false);

    if (error) {
      toast.show({
        title: "Unable to resend",
        description: error.message ?? "Please try again.",
        bgColor: "error.600",
      });
      return;
    }

    toast.show({
      title: "Passcode resent",
      description: `Check ${email} for the latest one-time passcode.`,
      bgColor: "success.600",
    });
  };

  return (
    <ScreenContainer padding={0}>
      <VStack
        flex={1}
        px={6}
        py={Platform.select({ ios: 16, android: 12, default: 16 })}
        space={8}
        justifyContent="center"
      >
        <VStack space={2}>
          <Heading size="2xl" color="semantic.textPrimary">
            Verify your email
          </Heading>
          <Text color="semantic.textSecondary">
            Enter the one-time passcode we sent to{" "}
            <Text fontWeight="600" color="semantic.textPrimary">
              {email}
            </Text>{" "}
            to confirm your Elara account.
          </Text>
        </VStack>

        <VStack
          bg="semantic.surface"
          borderRadius="2xl"
          px={6}
          py={8}
          borderWidth="1"
          borderColor="semantic.border"
          shadow={3}
          space={5}
        >
          <FormControl isInvalid={Boolean(formError)}>
            <FormControl.Label>One-time passcode</FormControl.Label>
            <Input
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              keyboardType="number-pad"
              autoCapitalize="none"
              returnKeyType="done"
              color="black"
              placeholderTextColor="coolGray.400"
              bg="semantic.surface"
            />
            {formError ? (
              <FormControl.ErrorMessage>{formError}</FormControl.ErrorMessage>
            ) : null}
          </FormControl>

          <AppButton isLoading={submitting} onPress={handleVerify}>
            Confirm account
          </AppButton>
          <AppButton
            variant="outline"
            onPress={handleResend}
            isLoading={resending}
          >
            Resend passcode
          </AppButton>
          <AppButton
            variant="ghost"
            onPress={() => router.replace("/(auth)/signup")}
          >
            Start over
          </AppButton>
        </VStack>
      </VStack>
    </ScreenContainer>
  );
}
