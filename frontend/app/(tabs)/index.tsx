import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  Stack as NBStack,
  ScrollView,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
  VStack,
} from "native-base";
import { useMemo, useState } from "react";

import { useAuth } from "@/hooks/use-auth";

const features = [
  {
    title: "Vault-grade reserves",
    description:
      "Every Elara unit is fully one-to-one backed by audited gold reserves held in secure vaults.",
    icon: "shield-checkmark-outline",
  },
  {
    title: "Real-time valuation",
    description:
      "Track the live value of your holdings and understand how they respond to market shifts instantly.",
    icon: "trending-up-outline",
  },
  {
    title: "Spend from gold",
    description:
      "Use your Elara card or transfers to spend directly from your gold-backed balance anywhere.",
    icon: "card-outline",
  },
  {
    title: "Global hedging",
    description:
      "Move between currencies without friction and keep your wealth anchored against volatility.",
    icon: "globe-outline",
  },
];

const insights = [
  { label: "Gold spot price", value: "$2,384 / oz", change: "+0.6%" },
  { label: "Elara yield pool", value: "3.2% APY", change: "+0.2%" },
  { label: "Stability reserve", value: "100% collateralized", change: "on track" },
];

const actions = [
  {
    label: "Vault top-up",
    icon: "download-outline",
    message: "Connect your funding source to increase your gold-backed balance.",
  },
  {
    label: "Instant transfer",
    icon: "swap-horizontal-outline",
    message: "Peer-to-peer transfers between Elara members are launching soon.",
  },
  {
    label: "Convert to cash",
    icon: "cash-outline",
    message: "Settle part of your gold position to local currency in seconds.",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const surface = useColorModeValue("primary.lightest", "primary.darkest");
  const panel = useColorModeValue("primary.light", "primary.dark");
  const border = useColorModeValue("primary.dark", "primary.medium");
  const insightColumns = useBreakpointValue({ base: 1, md: 3 }) ?? 1;
  const actionColumns = useBreakpointValue({ base: 1, md: 3 }) ?? 1;
  const featureRows = useMemo(() => {
    const rows: ((typeof features)[number])[][] = [];
    for (let i = 0; i < features.length; i += 2) {
      rows.push(features.slice(i, i + 2));
    }
    return rows;
  }, []);

  const welcomeHeading = useMemo(
    () => (user?.email ? `Welcome back, ${user.email.split("@")[0]}` : "Welcome to Elara"),
    [user?.email],
  );

  const handleSignOut = async () => {
    if (signingOut) {
      return;
    }

    setSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "We ran into an issue signing you out.";
      toast.show({
        title: "Sign-out failed",
        description,
        bgColor: "primary.dark",
      });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <ScrollView flex={1} bg={surface} contentContainerStyle={{ paddingBottom: 48 }}>
      <VStack px={{ base: 5, md: 12 }} py={{ base: 8, md: 12 }} space={8}>
        <Box
          bg={{
            linearGradient: {
              colors: ["primary.darkest", "primary.light"],
              start: [0, 0],
              end: [1, 1],
            },
          }}
          borderRadius="2xl"
          px={{ base: 6, md: 10 }}
          py={{ base: 8, md: 12 }}
          borderWidth={1}
          borderColor="primary.dark"
          shadow={8}
        >
          <VStack space={6}>
            <Badge
              alignSelf="flex-start"
              variant="outline"
              borderColor="primary.light"
              _text={{ color: "primary.lightest", fontSize: "xs" }}
              rounded="full"
              px={3}
              py={1}
            >
              Gold-backed sovereignty
            </Badge>
            <VStack space={3}>
              <Text color="primary.darkest" fontSize="md">
                {user?.email ? "Account owner" : "You’re moments away from financial calm"}
              </Text>
              <Heading size="xl" color="primary.darkest">
                {welcomeHeading}
              </Heading>
              <Text fontSize="md" color="primary.darkest">
                See how your gold-backed balance is performing, and take action with confidence in
                a single tap.
              </Text>
            </VStack>
            <HStack space={3} flexWrap="wrap">
              <Button onPress={() => router.push("/(tabs)/explore")}>Explore platform</Button>
              <Button
                variant="outline"
                colorScheme="primary"
                onPress={handleSignOut}
                isLoading={signingOut}
              >
                Sign out
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Box
          bg={panel}
          borderRadius="xl"
          px={{ base: 5, md: 8 }}
          py={{ base: 5, md: 6 }}
          borderWidth={1}
          borderColor={border}
        >
          <VStack space={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="md">Vault snapshot</Heading>
              <Button
                variant="ghost"
                colorScheme="primary"
                onPress={() =>
                  toast.show({
                    title: "Vault insights",
                    description: "Detailed analytics are coming soon to the Elara dashboard.",
                    bgColor: "primary.dark",
                  })
                }
                rightIcon={<Icon as={Ionicons} name="arrow-forward-outline" size="sm" />}
              >
                View details
              </Button>
            </HStack>
            <Divider />
            <SimpleGrid columns={insightColumns} space={4}>
              {insights.map((item) => (
                <Box
                  key={item.label}
                  borderWidth={1}
                  borderColor={border}
                  borderRadius="lg"
                  px={4}
                  py={5}
                  bg="primary.light"
                >
                  <Text fontSize="sm" color="primary.darkest">
                    {item.label}
                  </Text>
                  <Heading size="lg" mt={2} color="primary.lightest">
                    {item.value}
                  </Heading>
                  <Text fontSize="sm" color="primary.light" mt={1}>
                    {item.change}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>

        <Box
          bg={panel}
          borderRadius="xl"
          px={{ base: 5, md: 8 }}
          py={{ base: 6, md: 8 }}
          borderWidth={1}
          borderColor={border}
        >
          <VStack space={6}>
            <VStack space={2}>
              <Heading size="md">Why members choose Elara</Heading>
              <Text fontSize="md" color="primary.darkest">
                A platform that marries the certainty of physical gold with the dynamism of modern
                finance.
              </Text>
            </VStack>
            <VStack space={4} w="100%">
              {featureRows.map((row, rowIndex) => (
                <NBStack
                  key={`feature-row-${rowIndex}`}
                  direction={{ base: "column", md: "row" }}
                  space={4}
                  w="100%"
                >
                  {row.map((feature) => (
                    <Box
                      key={feature.title}
                      borderWidth={1}
                      borderColor={border}
                      borderRadius="lg"
                      px={4}
                      py={5}
                      bg="primary.light"
                      flex={1}
                      minW={0}
                    >
                      <HStack space={3} alignItems="flex-start">
                        <Box
                          bg="primary.medium"
                          borderRadius="full"
                          p={3}
                          shadow={4}
                          borderWidth={1}
                          borderColor="primary.light"
                        >
                          <Icon as={Ionicons} name={feature.icon} color="primary.darkest" size="md" />
                        </Box>
                        <VStack space={2} flex={1}>
                          <Heading size="sm">{feature.title}</Heading>
                          <Text fontSize="sm" color="primary.darkest">
                            {feature.description}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                  {row.length === 1 ? <Box flex={1} display={{ base: "none", md: "flex" }} /> : null}
                </NBStack>
              ))}
            </VStack>
          </VStack>
        </Box>

        <Box
          bg={panel}
          borderRadius="xl"
          px={{ base: 5, md: 8 }}
          py={{ base: 5, md: 6 }}
          borderWidth={1}
          borderColor={border}
        >
          <VStack space={4}>
            <Heading size="md">Take action</Heading>
            <Text fontSize="sm" color="primary.darkest">
              Move with the market, without sacrificing the integrity of your holdings.
            </Text>
            <SimpleGrid columns={actionColumns} space={3}>
              {actions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  borderColor="primary.light"
                  colorScheme="primary"
                  leftIcon={<Icon as={Ionicons} name={action.icon} size="sm" />}
                  onPress={() =>
                    toast.show({
                      title: action.label,
                      description: action.message,
                      bgColor: "primary.dark",
                    })
                  }
                >
                  {action.label}
                </Button>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>
      </VStack>
    </ScrollView>
  );
}
