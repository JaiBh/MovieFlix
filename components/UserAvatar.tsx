import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Image, TouchableOpacity } from "react-native";

export function UserAvatar() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded || !user) return null;

  return (
    <TouchableOpacity onPress={() => router.push("/profile")}>
      <Image
        source={{ uri: user.imageUrl }}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
    </TouchableOpacity>
  );
}
