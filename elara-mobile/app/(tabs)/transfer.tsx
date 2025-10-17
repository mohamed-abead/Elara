import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  FormControl,
  Icon,
  Input,
  KeyboardAvoidingView,
  Text,
  VStack,
  useToast,
} from "native-base";
import { Platform } from "react-native";

import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";

type TransferUnit = "usd" | "xau";

export default function TransferScreen() {
  const toast = useToast();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<TransferUnit>("usd");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>(
    {}
  );

  const handleSend = () => {
    if (submitting) {
      return;
    }

    const trimmedRecipient = recipient.trim();
    const nextErrors: { recipient?: string; amount?: string } = {};

    if (!trimmedRecipient || !trimmedRecipient.includes("@")) {
      nextErrors.recipient = "Provide a valid recipient email address.";
    }

    const numericAmount = Number(amount.replace(/,/g, ""));
    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = "Enter an amount greater than zero.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const formattedAmount =
      unit === "usd"
        ? `$${numericAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : `${numericAmount.toFixed(3)} oz XAU`;

    setTimeout(() => {
      toast.show({
        title: "Transfer submitted",
        description: `Sending ${formattedAmount} to ${trimmedRecipient}.`,
        bgColor: "success.600",
      });
      setRecipient("");
      setAmount("");
      setSubmitting(false);
    }, 500);
  };

  return (
    <ScreenContainer padding={0}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <VStack flex={1} px={6} py={10} space={8}>
          <VStack space={2}>
            <Text color="semantic.textSecondary" fontSize="md">
              Instant transfer
            </Text>
            <Text
              color="semantic.textPrimary"
              fontFamily="heading"
              fontSize="2xl"
              fontWeight="semibold"
            >
              Send funds or gold
            </Text>
            <Text color="semantic.textSecondary">
              Choose an amount, select the unit, and submit the transfer.
            </Text>
          </VStack>

          <Box
            bg="semantic.surface"
            borderRadius="2xl"
            px={6}
            py={8}
            borderWidth={1}
            borderColor="semantic.border"
            shadow={3}
          >
            <VStack space={6}>
              <FormControl isRequired isInvalid={Boolean(errors.recipient)}>
                <FormControl.Label>Recipient email</FormControl.Label>
                <Input
                  value={recipient}
                  onChangeText={setRecipient}
                  placeholder="investor@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  color="black"
                  placeholderTextColor="coolGray.400"
                  bg="semantic.surface"
                />
                {errors.recipient ? (
                  <FormControl.ErrorMessage>
                    {errors.recipient}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(errors.amount)}>
                <FormControl.Label>Amount</FormControl.Label>
                <Input
                  value={amount}
                  onChangeText={setAmount}
                  placeholder={unit === "usd" ? "2500.00" : "1.250"}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  color="black"
                  placeholderTextColor="coolGray.400"
                  bg="semantic.surface"
                />
                {errors.amount ? (
                  <FormControl.ErrorMessage>
                    {errors.amount}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>

              <VStack space={2}>
                <Text color="semantic.textSecondary" fontSize="sm">
                  Choose unit
                </Text>
                <Button.Group isAttached colorScheme="brand" size="sm">
                  <Button
                    variant={unit === "usd" ? "solid" : "outline"}
                    onPress={() => setUnit("usd")}
                  >
                    USD
                  </Button>
                  <Button
                    variant={unit === "xau" ? "solid" : "outline"}
                    onPress={() => setUnit("xau")}
                  >
                    XAU (oz)
                  </Button>
                </Button.Group>
              </VStack>

              <AppButton
                onPress={handleSend}
                isLoading={submitting}
                leftIcon={
                  <Icon
                    as={Ionicons}
                    name="paper-plane-outline"
                    size="sm"
                    color="semantic.background"
                  />
                }
              >
                Send now
              </AppButton>
            </VStack>
          </Box>
        </VStack>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
