import { View, Text, Button, Switch } from "react-native";
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

const Profile = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { isSuccess } = useSelector((state) => state.auth);

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
        userData.preference.mode = scheme; // Update mode in user data
        await AsyncStorage.setItem("user", JSON.stringify(userData)); // Save updated user data

        // Dispatch the action and handle then/catch
        return dispatch(toggleDarkMode({ preference: { mode: scheme } }))
          .unwrap() // If using Redux Toolkit, unwrap to get the promise
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
    saveColorScheme(colorScheme === "dark" ? "light" : "dark"); // Toggle and save the new scheme
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/sign-in");
  };

  return (
    <SafeAreaView>
      <View className="bg-slate-300 dark:bg-[#09092B] w-full min-h-screen pt-5">
        <Text className="text-2xl text-gray-600 dark:text-slate-300 text-center mb-5">
          Profile
        </Text>
        <View className="flex-row items-center justify-between mb-5">
          <Text className="text-lg text-gray-600 dark:text-slate-300">
            Dark Mode
          </Text>
          <Switch
            value={colorScheme === "dark"}
            onValueChange={handleToggleColorScheme}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={colorScheme === "dark" ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
        <Button
          title="Buyer Dashboard"
          onPress={handleBecomePress}
          color="#FFA001"
        />
        <Button title="Logout" onPress={handleLogout} color="#CC5005" />
      </View>
    </SafeAreaView>
  );
};
export default Profile;
