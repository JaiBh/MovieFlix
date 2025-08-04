import { toggleSaveMovie } from "@/services/appwrite";
import {
  fetchSavedMoviesAtom,
  savedMoviesAtom,
} from "@/services/savedMoviesAtom";
import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

const ToggleSave = ({ movie }: { movie: Movie | MovieDetails }) => {
  const [savedMovies] = useAtom(savedMoviesAtom);
  const [, fetchSavedMovies] = useAtom(fetchSavedMoviesAtom);
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const handlePress = async () => {
    if (!userId) {
      router.push("/sign-in");
    } else {
      try {
        setSaved(!saved);
        await toggleSaveMovie(movie, userId);
        fetchSavedMovies(userId);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    const func = async () => {
      if (savedMovies.some((savedMovie) => savedMovie.id === movie.id)) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    };
    if (userId) {
      func();
    } else if (isLoaded && !userId) {
      setSaved(false);
    }
  }, [userId, savedMovies]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <FontAwesome
        name={saved ? "heart" : "heart-o"}
        color={saved ? "red" : "white"}
        size={24}
      ></FontAwesome>
    </TouchableOpacity>
  );
};
export default ToggleSave;
