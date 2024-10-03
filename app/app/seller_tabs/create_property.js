import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const create_property = () => {
  const { propertyType, action } = useLocalSearchParams();
  const handlePress = () => {
    console.log("type: ", propertyType);
    console.log("action: ", action);
  };
  return (
    <View>
      <Text onPress={handlePress}>create_property</Text>
      {/* {propertyType === "house" &&
        {
          // propertyUse === "rent" ? {} : {}
        }}
      {propertyType === "car" &&
        {
          // propertyUse === "rent" ? {} : {}
        }} */}
    </View>
  );
};

export default create_property;
