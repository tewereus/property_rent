import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();
  const handleBecomePress = () => {
    router.push("/home");
  };
  return (
    <View className="bg-[#09092B] w-full min-h-screen">
      <Text>Profile</Text>
      <Button
        title="Become a Buyer"
        onPress={handleBecomePress}
        color="#FFA001"
      />
    </View>
  );
};
export default Profile;
