import { View, Text, Button, Switch, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  changeMode,
  logout,
  resetAuthState,
  toggleDarkMode,
} from "../../store/auth/authSlice";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isSuccess } = useSelector((state) => state.auth);

  // Save color scheme to local storage
  // const saveColorScheme = async (scheme) => {
  //   try {
  //     await AsyncStorage.setItem("colorScheme", scheme);
  //   } catch (error) {
  //     console.error("Failed to save color scheme:", error);
  //   }
  // };

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

  const handlePress = () => {
    const data = {
      mode: "seller",
    };

    if (user?.seller_tab === "inactive") {
      router.push("/seller_auth");
    } else if (user?.seller_tab === "waiting") {
      router.push("/waiting");
    } else if (user?.seller_tab === "active") {
      dispatch(changeMode(data));
      router.push("/seller_tabs");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/sign-in");
  };

  return (
    <View className={`flex-1 p-5 bg-slate-300 dark:bg-gray-800`}>
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
        title={
          user?.seller_tab === "inactive"
            ? "Become a Seller"
            : "Seller Dashboard"
        }
        onPress={handlePress}
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
