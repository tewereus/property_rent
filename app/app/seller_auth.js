import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { verifySeller } from "../store/auth/authSlice";

const seller_auth = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handlePress = () => {
    console.log("user in auth: ", user);
    dispatch(verifySeller());
    console.log("user in auth: ");
  };
  return (
    <SafeAreaView className="flex-1 p-5 bg-slate-300 dark:bg-gray-800">
      <View>
        <Text className="text-4xl text-center text-gray-800 dark:text-slate-300">
          seller_auth
        </Text>
        <TouchableOpacity
          className="items-center bg-[#FFA001] mt-5 p-4"
          onPress={handlePress}
        >
          <Text className="text-white text-lg">Select an Image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default seller_auth;
