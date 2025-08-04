import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchSavedMoviesAtom } from "@/services/savedMoviesAtom";
import { useAuth } from "@clerk/clerk-expo";
import { Tabs } from "expo-router";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Image, ImageBackground, Text, View } from "react-native";

interface TabIconProps {
  route: string;
  icon: any;
  focused?: boolean;
}

const TabIcon = ({ route, icon, focused }: TabIconProps) => {
  const { userId } = useAuth();
  const [, fetchSavedMovies] = useAtom(fetchSavedMoviesAtom);

  useEffect(() => {
    if (userId) {
      fetchSavedMovies(userId);
    }
  }, [userId]);

  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image source={icon} tintColor="#151312" className="size-5"></Image>
        <Text className="text-secondary text-base font-semibold ml-2">
          {route}
        </Text>
      </ImageBackground>
    );
  } else {
    return (
      <View className="size-full justify-center items-center mt-4 rounded-full">
        <Image source={icon} tintColor="#A8B5DB" className="size-5"></Image>
      </View>
    );
  }
};
const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0f0D23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0f0d23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              route={"Home"}
              icon={icons.home}
              focused={focused}
            ></TabIcon>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              route={"Search"}
              icon={icons.search}
              focused={focused}
            ></TabIcon>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              route={"Saved"}
              icon={icons.save}
              focused={focused}
            ></TabIcon>
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              route={"Profile"}
              icon={icons.person}
              focused={focused}
            ></TabIcon>
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
};
export default _layout;
