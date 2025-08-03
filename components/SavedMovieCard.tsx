import { icons } from "@/constants/icons";
import { toggleSaveMovie } from "@/services/appwrite";
import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  movie: Movie;
  fetchSavedMovies: (userId: string) => Promise<void>;
}

const SavedMovieCard = ({ movie, fetchSavedMovies }: Props) => {
  const { id, title, poster_path, vote_average, release_date } = movie;

  const rating = Array.from(
    { length: Math.round(vote_average / 2) },
    () => null
  );
  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity className="w-[30%] relative">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/ffffff.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        ></Image>
        <Text className="mt-2 text-sm font-bold text-white" numberOfLines={1}>
          {title}
        </Text>
        <View className="flex-row items-center justify-start gap-x-1">
          {rating.map((_, index) => (
            <Image source={icons.star} className="size-4" key={index}></Image>
          ))}
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-light-300 font-medium mt-1">
            {release_date?.split("-")[0]}
          </Text>
          <Text className="text-xs font-medium text-light-300">Movie</Text>
        </View>
        <View className="absolute top-2 right-2">
          <ToggleSave
            movie={movie}
            fetchSavedMovies={fetchSavedMovies}
          ></ToggleSave>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
export default SavedMovieCard;

const ToggleSave = ({
  movie,
  fetchSavedMovies,
}: {
  movie: Movie | MovieDetails;
  fetchSavedMovies: (userId: string) => Promise<void>;
}) => {
  const { userId, isLoaded } = useAuth();
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    try {
      setLoading(true);
      setSaved(false);
      await toggleSaveMovie(movie, userId!);
      await fetchSavedMovies(userId!);
    } catch (err) {
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={loading || !isLoaded}>
      <FontAwesome
        name={saved ? "heart" : "heart-o"}
        color={saved ? "red" : "white"}
        size={24}
      ></FontAwesome>
    </TouchableOpacity>
  );
};
