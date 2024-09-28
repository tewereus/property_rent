// import { View, Text } from "react-native";
// import React from "react";
// import { useColorScheme } from "nativewind";

// const Home = () => {
//   const { colorScheme, setColorScheme } = useColorScheme();
//   const loadColorScheme = async () => {
//     try {
//       const userData = JSON.parse(await AsyncStorage.getItem("user"));
//       if (userData && userData.preference) {
//         const storedMode = userData.preference.mode;
//         setColorScheme(storedMode); // Set the color scheme based on stored preference
//       }
//     } catch (error) {
//       console.error("Failed to load user data:", error);
//     }
//   };

//   useEffect(() => {
//     loadColorScheme(); // Load color scheme on mount
//   }, []);

//   return (
//     <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen">
//       <Text className="dark:text-slate-300">Home</Text>
//     </View>
//   );
// };

// export default Home;

import { View, Text, Switch } from "react-native";
import React, { useEffect } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const { colorScheme, setColorScheme } = useColorScheme();

  const loadColorScheme = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("user"));
      if (userData && userData.preference) {
        const storedMode = userData.preference.mode;
        setColorScheme(storedMode);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  useEffect(() => {
    loadColorScheme();
  }, []);

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
      <Text className="text-lg dark:text-slate-300">Home</Text>
      {/* <SliderBox
        images={images}
        sliderBoxHeight={200}
        onCurrentImagePressed={(index) => console.warn(`image ${index} pressed`)}
        dotColor="#FFEE58"
        inactiveDotColor="#90A4AE"
        paginationBoxStyle={{
          position: 'absolute',
          bottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          margin: 0,
        }}
      /> */}
    </View>
  );
};

export default Home;
