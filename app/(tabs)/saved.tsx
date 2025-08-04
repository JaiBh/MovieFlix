import SavedMovieCard from "@/components/SavedMovieCard";
import { icons } from "@/constants/icons";
import {
  fetchSavedMoviesAtom,
  savedMoviesAtom,
} from "@/services/savedMoviesAtom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
const saved = () => {
  const [savedMovies] = useAtom(savedMoviesAtom);
  const [, fetchSavedMovies] = useAtom(fetchSavedMoviesAtom);
  const { userId } = useAuth();
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  useEffect(() => {
    if (userId) {
      fetchSavedMovies(userId);
    }
  }, [userId]);

  return (
    <View className="bg-primary flex-1 px-3">
      <SignedOut>
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image
            source={icons.save}
            className="size-10"
            tintColor={"#fff"}
          ></Image>
          <Text className="text-gray-500 text-base">Saved</Text>
          <Text className="text-sm text-gray-500 text-center max-w-[240px] font-semibold">
            Once signed in, you can see all your saved movies here.
          </Text>
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
        </View>
      </SignedOut>
      <SignedIn>
        <Image
          source={icons.logo}
          className="w-12 h-10 mt-20 mb-10 mx-auto"
        ></Image>
        <Text className="text-white text-center font-semibold mb-10">
          Saved Movies
        </Text>

        <FlatList
          data={savedMovies}
          ListEmptyComponent={
            <Text className="mt-40 text-center text-gray-500">
              No saved movies
            </Text>
          }
          renderItem={({ item }) => (
            <SavedMovieCard
              movie={item}
              fetchSavedMovies={fetchSavedMovies}
            ></SavedMovieCard>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            paddingRight: 5,
            gap: 20,
            marginBottom: 10,
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
        ></FlatList>
      </SignedIn>
    </View>
  );
};
export default saved;
