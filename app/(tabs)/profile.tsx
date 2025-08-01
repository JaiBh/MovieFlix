import DeleteAccountButton from "@/components/DeleteAccountButton";
import { SignOutButton } from "@/components/SignOutButton";
import { UserAvatar } from "@/components/UserAvatar";
import { icons } from "@/constants/icons";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
const profile = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <View className="bg-primary flex-1 px-10">
      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <SignedOut>
          <Image
            source={icons.person}
            className="size-10"
            tintColor={"#fff"}
          ></Image>
          <Text className="text-gray-500 text-base">Profile</Text>
          <View className="items-center gap-6 flex-row">
            <TouchableOpacity
              className="bg-red-500 w-20 py-3 flex items-center  rounded-xl"
              onPress={handleSignIn}
            >
              <Text className="text-white">Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-dark-100 w-20 py-3 flex items-center  rounded-xl"
              onPress={handleSignUp}
            >
              <Text className="text-white">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </SignedOut>
        <SignedIn>
          {user ? (
            <UserAvatar></UserAvatar>
          ) : (
            <Image
              source={icons.person}
              className="size-10"
              tintColor={"#fff"}
            ></Image>
          )}
          <Text className="text-gray-500 text-base">
            Welcome, {isLoaded ? user?.firstName : "there"}!
          </Text>
          <View className="w-[90vw] max-w-[280px] gap-y-4">
            <SignOutButton></SignOutButton>
            <DeleteAccountButton></DeleteAccountButton>
          </View>
        </SignedIn>
      </View>
    </View>
  );
};
export default profile;
