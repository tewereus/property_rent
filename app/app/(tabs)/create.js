import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";

const Create = () => {
  // const [localColorScheme, setLocalColorScheme] = useState("light");
  // const { setColorScheme } = useColorScheme();

  // const loadColorScheme = async () => {
  //   try {
  //     const user = await AsyncStorage.getItem("user");
  //     console.log(user.preference);
  //     const storedScheme = user;
  //     // if (storedScheme) {
  //     //   setLocalColorScheme(storedScheme);
  //     //   setColorScheme(storedScheme);
  //     // }
  //   } catch (error) {
  //     console.error("Failed to load color scheme:", error);
  //   }
  // };

  // useEffect(() => {
  //   loadColorScheme();
  // }, []);

  return (
    <View className={`bg-gray-300 dark:bg-[#09092B] w-full min-h-screen`}>
      <Text className="dark:text-slate-300">Create</Text>
      <Text className="dark:text-slate-300">
        {/* Current Color Scheme: {localColorScheme} */}
      </Text>
    </View>
  );
};

export default Create;
