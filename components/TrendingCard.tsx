import { images } from "@/constants/images";
import { fetchMovieById } from "@/services/api";
import useFetch from "@/services/useFetch";
import MaskedView from "@react-native-masked-view/masked-view";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ToggleSave from "./ToggleSave";

interface Props {
  trendingMovie: TrendingMovie;
  index: number;
}
const TrendingCard = ({ trendingMovie, index }: Props) => {
  const { data, loading } = useFetch(() =>
    fetchMovieById(trendingMovie.movie_id)
  );
  return (
    <Link href={`/movie/${trendingMovie.movie_id}`} asChild>
      <TouchableOpacity className="w-32 relative pl-5">
        <View className="relative">
          <Image
            source={{ uri: trendingMovie.poster_path }}
            resizeMode="cover"
            className="h-48 w-32 rounded-lg"
          ></Image>
          {data && (
            <View className="absolute top-2 -right-3">
              <ToggleSave movie={data as Movie}></ToggleSave>
            </View>
          )}
        </View>
        <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
          <MaskedView
            maskElement={
              <Text className="font-bold text-white text-6xl">{index + 1}</Text>
            }
          >
            <Image
              source={images.rankingGradient}
              className="size-14"
              resizeMode="cover"
            ></Image>
          </MaskedView>
        </View>
        <Text
          className="text-sm font-bold mt-2 text-light-200"
          numberOfLines={2}
        >
          {trendingMovie.title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};
export default TrendingCard;
