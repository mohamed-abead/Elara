import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  Box,
  FormControl,
  Input,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";

import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";
import { useAuth } from "@/hooks/useAuth";

const API_BASE = "http://localhost:8000";

type FormState = {
  productUrl: string;
  email: string;
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  paymentCurrency: string;
};

const INITIAL_FORM: FormState = {
  productUrl: "",
  email: "",
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
  paymentMethod: "ethereum-sepolia",
  paymentCurrency: "eth",
};

function deriveProductLocator(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const asinOnly = trimmed.match(/^[A-Z0-9]{10}$/i);
  if (asinOnly) {
    return `amazon:${asinOnly[0].toUpperCase()}`;
  }

  try {
    const url = new URL(trimmed);
    const asinFromPath = url.pathname.match(
      /(?:dp|gp\/product|gp\/aw\/d|product)\/([A-Z0-9]{10})/i
    );
    if (asinFromPath) {
      return `amazon:${asinFromPath[1].toUpperCase()}`;
    }

    const asinFromQuery = url.searchParams.get("asin");
    if (asinFromQuery && /^[A-Z0-9]{10}$/i.test(asinFromQuery)) {
      return `amazon:${asinFromQuery.toUpperCase()}`;
    }
  } catch (err) {
    // Not a valid URL; fall through and fail validation below.
  }

  return null;
}

export default function AmazonScreen() {
  const toast = useToast();
  const { session } = useAuth();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [latestResponse, setLatestResponse] = useState<Record<string, any> | null>(
    null
  );

  const detectedLocator = useMemo(
    () => deriveProductLocator(form.productUrl),
    [form.productUrl]
  );

  const handleChange = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!detectedLocator) {
      nextErrors.productUrl = "Provide a valid Amazon link or ASIN";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Recipient email is required";
    }
    if (!form.fullName.trim()) {
      nextErrors.fullName = "Recipient name is required";
    }
    if (!form.line1.trim()) {
      nextErrors.line1 = "Address line 1 is required";
    }
    if (!form.city.trim()) {
      nextErrors.city = "City is required";
    }
    if (!form.state.trim()) {
      nextErrors.state = "State is required";
    }
    if (!form.postalCode.trim()) {
      nextErrors.postalCode = "Postal code is required";
    }
    if (!form.country.trim()) {
      nextErrors.country = "Country is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }
    if (!session?.access_token) {
      toast.show({
        title: "Not signed in",
        description: "Log in to place an order",
        bgColor: "error.600",
      });
      return;
    }
    if (!validate()) {
      return;
    }

    const payload = {
      recipient: {
        email: form.email.trim(),
        physicalAddress: {
          name: form.fullName.trim(),
          line1: form.line1.trim(),
          line2: form.line2.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country.trim().toUpperCase(),
        },
      },
      payment: {
        method: form.paymentMethod.trim(),
        currency: form.paymentCurrency.trim(),
      },
      lineItems: [
        {
          productLocator: detectedLocator,
        },
      ],
    };

    console.log("Crossmint order payload:", payload);
    setSubmitting(true);
    setLatestResponse(null);

    try {
      const response = await fetch(`${API_BASE}/api/2022-06-09/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("Crossmint order error:", data);
        throw new Error(
          (data?.detail?.error as string) || "Order request failed"
        );
      }

      console.log("Crossmint order response:", data);
      setLatestResponse(data);
      toast.show({
        title: "Order created",
        description: "Crossmint received your order.",
        bgColor: "success.600",
      });
      setForm(INITIAL_FORM);
    } catch (err: any) {
      toast.show({
        title: "Unable to place order",
        description: err?.message || "Unexpected error",
        bgColor: "error.600",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer padding={0}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <VStack flex={1} space={8}>
          <VStack space={1}>
            <Text color="semantic.textSecondary" fontSize="md">
              Amazon checkout
            </Text>
            <Text
              color="semantic.textPrimary"
              fontFamily="heading"
              fontSize="2xl"
              fontWeight="semibold"
            >
              Buy products with Crossmint
            </Text>
            <Text color="semantic.textSecondary">
              Paste an Amazon product link, confirm the shipping address, and we’ll
              forward it to the backend Crossmint order endpoint.
            </Text>
          </VStack>

          <Box
            bg="semantic.surface"
            borderRadius="2xl"
            px={6}
            py={8}
            borderWidth={1}
            borderColor="semantic.border"
            shadow={2}
          >
            <VStack space={5}>
              <FormControl isRequired isInvalid={Boolean(errors.productUrl)}>
                <FormControl.Label>Amazon product link</FormControl.Label>
                <Input
                  value={form.productUrl}
                  onChangeText={handleChange("productUrl")}
                  placeholder="https://www.amazon.com/..."
                  autoCapitalize="none"
                  color="black"
                  placeholderTextColor="coolGray.400"
                />
                <Text color="semantic.textSecondary" fontSize="xs" mt={1}>
                  {detectedLocator
                    ? `Detected product locator: ${detectedLocator}`
                    : "Paste any Amazon URL or ASIN"}
                </Text>
                {errors.productUrl ? (
                  <FormControl.ErrorMessage>
                    {errors.productUrl}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(errors.email)}>
                <FormControl.Label>Recipient email</FormControl.Label>
                <Input
                  value={form.email}
                  onChangeText={handleChange("email")}
                  placeholder="buyer@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  color="black"
                  placeholderTextColor="coolGray.400"
                />
                {errors.email ? (
                  <FormControl.ErrorMessage>
                    {errors.email}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(errors.fullName)}>
                <FormControl.Label>Recipient name</FormControl.Label>
                <Input
                  value={form.fullName}
                  onChangeText={handleChange("fullName")}
                  placeholder="John Doe"
                  color="black"
                  placeholderTextColor="coolGray.400"
                />
                {errors.fullName ? (
                  <FormControl.ErrorMessage>
                    {errors.fullName}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(errors.line1)}>
                <FormControl.Label>Address line 1</FormControl.Label>
                <Input
                  value={form.line1}
                  onChangeText={handleChange("line1")}
                  placeholder="123 Main St"
                  color="black"
                  placeholderTextColor="coolGray.400"
                />
                {errors.line1 ? (
                  <FormControl.ErrorMessage>
                    {errors.line1}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>

              <FormControl>
                <FormControl.Label>Address line 2</FormControl.Label>
                <Input
                  value={form.line2}
                  onChangeText={handleChange("line2")}
                  placeholder="Apt 4B"
                  color="black"
                  placeholderTextColor="coolGray.400"
                />
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(errors.city)}>
                <FormControl.Label>City</FormControl.Label>
                <Input
                  value={form.city}
                  onChangeText={handleChange("city")}
                  placeholder="San Francisco"
                  color="black"
                  placeholderTextColor="coolGray.400"
                />
                {errors.city ? (
                  <FormControl.ErrorMessage>
                    {errors.city}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(errors.state)}>
                <FormControl.Label>State / Region</FormControl.Label>
                <Input
                  value={form.state}
                  onChangeText={handleChange("state")}
                  placeholder="CA"
                  autoCapitalize="characters"
                  color="black"
                  placeholderTextColor="coolGray.400"
                />
                {errors.state ? (
                  <FormControl.ErrorMessage>
                    {errors.state}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(errors.postalCode)}>
                <FormControl.Label>Postal code</FormControl.Label>
                <Input
                  value={form.postalCode}
                  onChangeText={handleChange("postalCode")}
                  placeholder="94105"
                  keyboardType="numbers-and-punctuation"
                  color="black"
                  placeholderTextColor="coolGray.400"
                />
                {errors.postalCode ? (
                  <FormControl.ErrorMessage>
                    {errors.postalCode}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(errors.country)}>
                <FormControl.Label>Country</FormControl.Label>
                <Input
                  value={form.country}
                  onChangeText={handleChange("country")}
                  placeholder="US"
                  autoCapitalize="characters"
                  color="black"
                  placeholderTextColor="coolGray.400"
                />
                {errors.country ? (
                  <FormControl.ErrorMessage>
                    {errors.country}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>

              <FormControl>
                <FormControl.Label>Payment method</FormControl.Label>
                <Input
                  value={form.paymentMethod}
                  onChangeText={handleChange("paymentMethod")}
                  placeholder="ethereum-sepolia"
                  autoCapitalize="none"
                  color="black"
                  placeholderTextColor="coolGray.400"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Payment currency</FormControl.Label>
                <Input
                  value={form.paymentCurrency}
                  onChangeText={handleChange("paymentCurrency")}
                  placeholder="eth"
                  autoCapitalize="none"
                  color="black"
                  placeholderTextColor="coolGray.400"
                />
              </FormControl>

              <AppButton onPress={handleSubmit} isLoading={submitting}>
                Submit order
              </AppButton>
            </VStack>
          </Box>

          {latestResponse ? (
            <Box
              bg="semantic.surface"
              borderRadius="2xl"
              px={5}
              py={4}
              borderWidth={1}
              borderColor="semantic.border"
              shadow={1}
            >
              <Text color="semantic.textSecondary" fontSize="sm" mb={2}>
                Latest response
              </Text>
              <Text fontFamily="mono" fontSize="xs" color="semantic.textPrimary">
                {JSON.stringify(latestResponse, null, 2)}
              </Text>
            </Box>
          ) : null}
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
