import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadUser, resetAuthState } from "../store/auth/authSlice";
import { useDispatch } from "react-redux";
// import { loadThemeFromStorage } from "../store/themeSlice";
// import { useColorScheme } from "nativewind";

const index = () => {
  // const { colorScheme, toggleColorScheme } = useColorScheme();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
    // dispatch(loadThemeFromStorage());
  }, [dispatch]);

  const handlePress = async () => {
    const user = await AsyncStorage.getItem("user");
    // const theme = await AsyncStorage.getItem("theme");
    console.log("user: ", user);
    // console.log("theme: ", theme);
    dispatch(resetAuthState());
    if (user === null) {
      router.push("/sign-in");
    } else {
      router.push("/home");
    }
  };
  return (
    <SafeAreaView className="h-full bg-slate-400 dark:bg-[#09092B] ">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          {/* <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          /> */}

          <Image
            source={images.logo}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-secondary-200">Prime</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm font-normal text-gray-100 mt-7 text-center">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Prime
          </Text>
          {/* <CustomButton title="Continue with Email"/> */}
          <CustomButton
            title="Get Started"
            handlePress={handlePress}
            containerStyles="w-full mt-10"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default index;

// import { Pressable, Text } from "react-native";
// import { useColorScheme } from "nativewind";

// function index() {
//   const { colorScheme, toggleColorScheme } = useColorScheme();

//   return (
//     <Pressable
//       className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900"
//       onPress={toggleColorScheme}
//     >
//       <Text className="text-black dark:text-white">
//         {`Try clicking me! ${colorScheme === "dark" ? "🌙" : "🌞"}`}
//       </Text>
//       <Text className="text-6xl mt-40 dark:text-neutral-100">Get Started</Text>
//     </Pressable>
//   );
// }

// export default index;
