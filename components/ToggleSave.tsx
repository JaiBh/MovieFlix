import { database, toggleSaveMovie } from "@/services/appwrite";
import { fetchSavedMoviesAtom } from "@/services/savedMoviesAtom";
import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Query } from "react-native-appwrite";

const ToggleSave = ({ movie }: { movie: Movie | MovieDetails }) => {
  const [, fetchSavedMovies] = useAtom(fetchSavedMoviesAtom);
  const { userId } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlePress = async () => {
    if (!userId) {
      router.push("/sign-in");
    } else {
      const currentState = saved;

      try {
        setLoading(true);
        setSaved(!currentState);
        await toggleSaveMovie(movie, userId);
        fetchSavedMovies(userId);
      } catch (err) {
        setSaved(currentState);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const func = async () => {
      const result = await database.listDocuments(
        process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!,
        [Query.equal("movie_id", movie.id), Query.equal("userId", userId!)]
      );
      if (result.documents.length > 0) {
        setSaved(true);
      } else {
        setSaved(false);
      }
      setLoading(false);
    };
    if (userId) {
      func();
    } else {
      setSaved(false);

      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size={24}></ActivityIndicator>;
  }
  return (
    <TouchableOpacity onPress={handlePress} disabled={loading}>
      <FontAwesome
        name={saved ? "heart" : "heart-o"}
        color={saved ? "red" : "white"}
        size={24}
      ></FontAwesome>
    </TouchableOpacity>
  );
};
export default ToggleSave;
