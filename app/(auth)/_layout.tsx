import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="sign-up"
        options={{ headerShown: false }}
      ></Stack.Screen>
    </Stack>
  );
}
