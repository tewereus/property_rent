import { View, Text } from "react-native";
import React from "react";

const Create = () => {
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
