import { View, Text, TouchableOpacity, Switch } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  changeMode,
  logout,
  resetAuthState,
  toggleDarkMode,
} from "../../store/auth/authSlice";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const ProfileOption = ({ icon, label, value, onPress, rightElement }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-2xl mb-4 shadow-sm mx-4"
  >
    <View className="flex-row items-center">
      <View className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full mr-4">
        <Ionicons name={icon} size={24} color="#F97316" />
      </View>
      <Text className="text-gray-700 dark:text-gray-200 text-lg">{label}</Text>
    </View>
    {rightElement || (
      <Ionicons name="chevron-forward" size={24} color="#6B7280" />
    )}
  </TouchableOpacity>
);

const Profile = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isSuccess } = useSelector((state) => state.auth);

  const handleBecomePress = () => {
    const data = {
      mode: "customer",
    };
    dispatch(changeMode(data));
    router.push("/home");
  };

  const saveColorScheme = async (scheme) => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("user"));
      if (userData) {
        userData.preference.mode = scheme;
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        return dispatch(toggleDarkMode({ preference: { mode: scheme } }))
          .unwrap()
          .then(() => {
            if (isSuccess) {
              console.log("Color scheme updated successfully");
              dispatch(resetAuthState());
            }
          })
          .catch((error) => {
            console.error("Failed to update dark mode:", error);
          });
      }
    } catch (error) {
      console.error("Failed to save color scheme:", error);
    }
  };

  const handleToggleColorScheme = () => {
    toggleColorScheme();
    saveColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="bg-white dark:bg-gray-800 p-6 rounded-b-3xl shadow-sm mb-6">
        <View className="items-center">
          <View className="bg-orange-100 dark:bg-orange-900 w-24 h-24 rounded-full items-center justify-center mb-4">
            <Text className="text-orange-600 dark:text-orange-400 text-4xl font-bold">
              {user?.name?.[0]?.toUpperCase() || "S"}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Seller Dashboard
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            {user?.email || "seller@example.com"}
          </Text>
        </View>
      </View>

      <View>
        <ProfileOption
          icon="moon-outline"
          label="Dark Mode"
          rightElement={
            <Switch
              value={colorScheme === "dark"}
              onValueChange={handleToggleColorScheme}
              trackColor={{ false: "#CBD5E1", true: "#F97316" }}
              thumbColor={colorScheme === "dark" ? "#F3F4F6" : "#FFFFFF"}
              ios_backgroundColor="#CBD5E1"
            />
          }
        />

        <ProfileOption
          icon="home-outline"
          label="Switch to Buyer Dashboard"
          onPress={handleBecomePress}
        />

        <ProfileOption
          icon="settings-outline"
          label="Account Settings"
          onPress={() => {}}
        />

        <ProfileOption
          icon="bar-chart-outline"
          label="Analytics"
          onPress={() => {}}
        />
        <ProfileOption
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => {}}
        />

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 p-4 rounded-2xl mt-2 flex-row items-center justify-center mx-4"
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color="white"
            className="mr-2"
          />
          <Text className="text-white text-lg font-medium ml-2">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
