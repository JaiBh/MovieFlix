import ToggleSave from "@/components/ToggleSave";
import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-200 mt-2 font-bold text-sm">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  if (loading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size={48}></ActivityIndicator>
      </View>
    );
  }

  if (!loading && !movie) {
    return (
      <View>
        <Text>Something went wrong...</Text>
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="relative">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          ></Image>
          <View className="absolute bottom-3 right-3">
            <ToggleSave movie={movie!}></ToggleSave>
          </View>
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>
          <View className="flex-row items-center bg-dark-200 py-1 px-2 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4"></Image>
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>
          <MovieInfo label="Overview" value={movie?.overview}></MovieInfo>
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"}
          ></MovieInfo>
          <View className="flex flex-row gap-12">
            <MovieInfo
              label="Budget"
              value={
                movie!.budget > 0
                  ? `$${(movie?.budget || 0) / 1_000_000} million`
                  : "TBD"
              }
            ></MovieInfo>
            <MovieInfo
              label="Revenue"
              value={
                movie!.revenue > 0
                  ? `$${(Math.round(movie?.revenue || 0) / 1_000_000).toFixed(
                      2
                    )} million`
                  : "TBD"
              }
            ></MovieInfo>
          </View>
          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies.map((c) => c.name).join(" - ") ||
              "TBD"
            }
          ></MovieInfo>
        </View>
      </ScrollView>
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
};
export default MovieDetails;
