import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { logout } from "../../store/auth/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleBecomePress = () => {
    router.push("/home");
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/sign-in");
  };

  return (
    <View className="bg-[#09092B] w-full min-h-screen">
      <Text>Profile</Text>
      <Button
        title="Back to Buyer"
        onPress={handleBecomePress}
        color="#FFA001"
      />
      <Button title="Logout" onPress={handleLogout} color="#CC5005" />
    </View>
  );
};
export default Profile;
