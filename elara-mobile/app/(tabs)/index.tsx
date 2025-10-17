import { useEffect, useRef, useState } from "react";
import { VStack, Text, HStack, Icon, useToast } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ScreenContainer from "@/components/ScreenContainer";
import AppButton from "@/components/AppButton";
import { useGoldDelta } from "@/hooks/useGoldDelta";
import { useGoldPrice } from "@/hooks/useGoldPrice";
import { useAuth } from "@/hooks/useAuth";
import { createWalletIfNeeded, getWalletBalance } from "@/utils/manageWallet";

export default function HomeScreen() {
  const router = useRouter();
  const toast = useToast();
  const { user, session } = useAuth();

  const walletInitRef = useRef<string | null>(null);

  // New: balance state
  const [balanceUsd, setBalanceUsd] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const {
    pctChange30d,
    loading: deltaLoading,
    error: deltaError,
  } = useGoldDelta();

  const {
    priceUsdPerOz,
    loading: priceLoading,
    error: priceError,
  } = useGoldPrice();

  const isUp = (pctChange30d ?? 0) >= 0;
  const colorToken = deltaError
    ? "semantic.textSecondary"
    : isUp
    ? "brand.500"
    : "rose.500";
  const iconName = deltaError
    ? "alert-circle-outline"
    : isUp
    ? "trending-up-outline"
    : "trending-down-outline";
  const deltaText = deltaLoading
    ? "Updating…"
    : deltaError
    ? "Unavailable"
    : `Gold ${isUp ? "+" : ""}${(pctChange30d ?? 0).toFixed(
        1
      )}% (over 30 days)`;

  // Convert USD → ounces using current gold price (USD/oz)
  const ounces =
    priceUsdPerOz && typeof balanceUsd === "number"
      ? balanceUsd / priceUsdPerOz
      : null;

  // Ensure a wallet exists (once per user id)
  useEffect(() => {
    const token = session?.access_token;
    const userId = user?.id;
    if (!token || !userId) return;

    if (walletInitRef.current === userId) return;
    walletInitRef.current = userId;

    void createWalletIfNeeded(token, (message) =>
      toast.show({
        title: "Wallet setup failed",
        description: message,
        bgColor: "error.600",
      })
    );
  }, [session?.access_token, user?.id, toast]);

  // Fetch balance when we have a session (and after wallet creation attempt)
  const ranBalanceOnceRef = useRef(false);

  useEffect(() => {
    const token = session?.access_token;
    if (!token) return;

    if (ranBalanceOnceRef.current) return; // guard Strict Mode double-run
    ranBalanceOnceRef.current = true;

    let cancelled = false;
    setBalanceLoading(true);
    setBalanceError(null);

    (async () => {
      const usd = await getWalletBalance(token, (message) =>
        toast.show({
          title: "Balance unavailable",
          description: message,
          bgColor: "error.600",
        })
      );

      if (cancelled) return;

      if (typeof usd === "number") {
        setBalanceUsd(usd);
      } else if (usd === null) {
        setBalanceError("Could not fetch wallet balance.");
      }
      setBalanceLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.access_token, toast]);

  return (
    <ScreenContainer
      edges={["top", "bottom"]}
      padding={6}
      statusBarStyle="light"
    >
      <VStack flex={1} alignItems="center" justifyContent="center" space={10}>
        {/* Account balance (USD + ounces) */}
        <VStack alignItems="center" space={2}>
          <Text color="semantic.textSecondary" fontSize="md" letterSpacing="md">
            Current Balance
          </Text>

          {/* USD value */}
          <Text
            color="semantic.textPrimary"
            fontFamily="heading"
            fontWeight="bold"
            fontSize="5xl"
            lineHeight="4xl"
          >
            {balanceLoading
              ? "…"
              : typeof balanceUsd === "number"
              ? `$${balanceUsd.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`
              : "—"}
          </Text>

          {/* Ounces equivalent */}
          <Text color="semantic.textSecondary" fontSize="md">
            {balanceLoading || priceLoading
              ? "Calculating ounces…"
              : balanceError || priceError || ounces == null
              ? "Ounces unavailable"
              : `≈ ${ounces.toFixed(
                  3
                )} oz XAU ($${priceUsdPerOz?.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}/oz)`}
          </Text>

          {/* Gold change badge */}
          <HStack alignItems="center" space={1} mt={1}>
            <Icon as={Ionicons} name={iconName} size="sm" color={colorToken} />
            <Text color={colorToken} fontSize="sm">
              {deltaText}
            </Text>
          </HStack>
        </VStack>

        {/* Action buttons */}
        <HStack space={4}>
          <AppButton
            leftIcon={
              <Icon
                as={Ionicons}
                name="add-outline"
                size="md"
                color="semantic.background"
              />
            }
            onPress={() => console.log("Add funds")}
          >
            Add
          </AppButton>

          <AppButton
            variant="outline"
            colorScheme="brand"
            borderColor="brand.500"
            _text={{ color: "brand.500" }}
            leftIcon={
              <Icon
                as={Ionicons}
                name="swap-horizontal-outline"
                size="md"
                color="brand.500"
              />
            }
            onPress={() => router.push("/(tabs)/transfer")}
          >
            Transfer
          </AppButton>
        </HStack>
      </VStack>
    </ScreenContainer>
  );
}
