import { icons } from "@/constants/icons";
import { cn } from "@/lib/utils";
import { useSignUp, useSSO } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  useWarmUpBrowser();

  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [verifyError, setVerifyError] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
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
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!code) {
      setVerifyError("Verification code is required to proceed");
      return;
    }

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      if (err.status === 422) {
        setVerifyError("This code is incorrect");
      }
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onProviderLogin = React.useCallback(
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
          router.reload();
        } else {
        }
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
      }
    },
    []
  );

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-primary justify-center">
        <View className="bg-purple-950/60 rounded-2xl w-[90vw] mx-auto py-10 px-3 gap-6">
          <Text className="text-white text-center font-bold text-xl">
            Verify your email
          </Text>
          <Text
            className={cn(
              "text-red-500 text-sm text-center",
              !verifyError && "hidden"
            )}
          >
            {verifyError}
          </Text>
          <TextInput
            value={code}
            placeholder="Enter your verification code"
            inputMode="numeric"
            onChangeText={(code) => setCode(code)}
            className=" bg-light-100 rounded-2xl px-3"
          />
          <TouchableOpacity
            onPress={onVerifyPress}
            className="bg-purple-500 py-3 rounded-2xl"
          >
            <Text className="text-white text-center">Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary justify-center">
      <View className="py-10 px-3 w-[90vw] mx-auto gap-6 rounded-2xl bg-purple-950/60">
        <Text className="text-white text-center font-bold text-2xl">
          Sign Up
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
          onPress={onSignUpPress}
          className="bg-purple-500 py-3 rounded-2xl"
        >
          <Text className="text-center font-semibold">Sign Up</Text>
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
          Already have an account?{" "}
          <Link href={"/sign-up"} className="underline text-blue-400">
            Sign in
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
