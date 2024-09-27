import { View, Text, Button, Switch, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/auth/authSlice";
import Toast from "react-native-toast-message";

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleBecomePress = () => {
    router.push("/seller_tabs");
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/sign-in"); // Redirect to login page after logout
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <View
      className={`flex-1 p-5 ${isDarkMode ? "bg-gray-900" : "bg-gray-800"}`}
    >
      <Text
        className={`text-2xl text-white text-center mb-5 ${
          isDarkMode ? "text-yellow-300" : ""
        }`}
      >
        Profile
      </Text>

      <View className="flex-row items-center justify-between mb-5">
        <Text
          className={`text-lg text-white ${
            isDarkMode ? "text-yellow-300" : ""
          }`}
        >
          Dark Mode
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      <Button
        title={
          user?.seller_tab === "inactive"
            ? "Become a Seller"
            : "Seller Dashboard"
        }
        onPress={handleBecomePress}
        color="#FFA001"
      />

      <TouchableOpacity
        className="mt-5 bg-red-600 rounded p-3 items-center"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
