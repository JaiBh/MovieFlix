import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "./globals.css";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <StatusBar hidden={true}></StatusBar>

      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="movie/[id]"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
    </ClerkProvider>
  );
}
