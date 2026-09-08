import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding/index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="airtime/index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}