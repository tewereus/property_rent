import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();
  const handleBecomePress = () => {
    router.push("/seller_tabs");
  };
  return (
    <View className="bg-[#09092B] w-full min-h-screen">
      <Text>Profile</Text>
      <Button
        title="Become a Seller"
        onPress={handleBecomePress}
        color="#FFA001" // Customize button color if needed
      />
    </View>
  );
};

export default Profile;
