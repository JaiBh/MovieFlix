import { icons } from "@/constants/icons";
import { cn } from "@/lib/utils";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  useWarmUpBrowser();

  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError("");

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailAddress || !password) {
      setError("A valid email address and password is required");
      return;
    }

    if (!emailRegex.test(emailAddress)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      if (err.status === 422) {
        setError("This email is not registered. Please sign up");
      }
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onProviderLogin = useCallback(
    async (provider: "oauth_google" | "oauth_github") => {
      try {
        // Start the authentication process by calling `startSSOFlow()`
        const { createdSessionId, setActive, signIn, signUp } =
          await startSSOFlow({
            strategy: provider,

            redirectUrl: AuthSession.makeRedirectUri(),
          });

        // If sign in was successful, set the active session
        if (createdSessionId) {
          setActive!({ session: createdSessionId });
        } else {
        }
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
      }
    },
    []
  );

  return (
    <View className="flex-1 bg-primary justify-center">
      <View className="py-10 px-3 w-[90vw] mx-auto gap-6 rounded-2xl bg-purple-950/60">
        <Text className="text-white text-center font-bold text-2xl">
          Sign in
        </Text>
        <Text
          className={cn("text-sm text-red-500 text-center", !error && "hidden")}
        >
          {error}
        </Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          className={cn(
            "bg-light-100 rounded-xl px-2  border-2 border-transparent",
            error && !emailAddress && "border-red-500"
          )}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          className={cn(
            "bg-light-100 rounded-xl px-2 border-2 border-transparent",
            error && !password && "border-red-500"
          )}
        />
        <TouchableOpacity
          onPress={onSignInPress}
          className="bg-purple-500 py-3 rounded-2xl"
        >
          <Text className="text-center font-semibold">Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onProviderLogin("oauth_github")}
          className="bg-dark-200 py-3 rounded-2xl flex flex-row items-center gap-2 justify-center"
        >
          <Text className="text-white text-center font-semibold">
            Continue with Github{" "}
          </Text>
          <FontAwesome name="github" size={16} color={"white"}></FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onProviderLogin("oauth_google")}
          className="bg-blue-700 py-3 rounded-2xl flex flex-row items-center gap-2 justify-center"
        >
          <Text className="text-white text-center font-semibold">
            Continue with Google
          </Text>
          <FontAwesome name="google" size={16} color={"white"}></FontAwesome>
        </TouchableOpacity>

        <Text className="text-center font-semibold text-white">
          Don't have an account?{" "}
          <Link href={"/sign-up"} className="underline text-blue-400">
            Sign up
          </Link>
        </Text>
      </View>

      <TouchableOpacity
        className="absolute bottom-10 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center x-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor={"#fff"}
        ></Image>
        <Text className="text-white font-semibold text-base">Go back</Text>
      </TouchableOpacity>
    </View>
  );
}
