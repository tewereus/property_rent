import { View, Text, Button, TouchableOpacity } from "react-native";
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

  const handleMap = () => {
    router.push("/map_component");
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/sign-in");
  };

  return (
    <View className="bg-[#09092B] w-full min-h-screen">
      <Text>Profile</Text>
      <Button
        title="Back to Buyer Dashboard"
        onPress={handleBecomePress}
        color="#FFA001"
      />
      <Button title="Logout" onPress={handleLogout} color="#CC5005" />
      <TouchableOpacity>
        <Text onPress={handleMap}>Go To Map</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Profile;
