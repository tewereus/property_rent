import { View, Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";

const Explore = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen p-5">
      <Text
        className="text-lg dark:text-slate-300"
        onPress={() => {
          console.log(user);
        }}
      >
        Favourite
      </Text>
    </View>
  );
};

export default Explore;
