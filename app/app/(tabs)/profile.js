import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useCallback, memo } from "react";
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
import Ionicons from "react-native-vector-icons/Ionicons";

// Memoize the ProfileOption component
const ProfileOption = memo(({ icon, label, value, onPress, rightElement }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-2xl mb-4 shadow-sm"
  >
    <View className="flex-row items-center">
      <View className="bg-orange-100 dark:bg-orange-800 p-2 rounded-full mr-4">
        <Ionicons name={icon} size={24} color="#F97316" />
      </View>
      <Text className="text-gray-700 dark:text-gray-200 text-lg">{label}</Text>
    </View>
    {rightElement || (
      <Ionicons name="chevron-forward" size={24} color="#6B7280" />
    )}
  </TouchableOpacity>
));

const Profile = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isSuccess } = useSelector((state) => state.auth);

  const saveColorScheme = useCallback(
    async (scheme) => {
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
    },
    [dispatch, isSuccess]
  );

  const handleToggleColorScheme = useCallback(() => {
    toggleColorScheme();
    saveColorScheme(colorScheme === "dark" ? "light" : "dark");
  }, [colorScheme, saveColorScheme, toggleColorScheme]);

  const handlePress = useCallback(() => {
    const data = {
      mode: "seller",
    };

    if (user?.seller_tab === "inactive") {
      router.push("/seller_auth");
    } else if (user?.seller_tab === "waiting") {
      router.push("/waiting");
    } else if (user?.seller_tab === "active") {
      dispatch(changeMode(data))
        .unwrap()
        .then(() => {
          router.push("/seller_tabs");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user, router, dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    router.push("/sign-in");
  }, [dispatch, router]);

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Profile Header */}
      <View className="bg-white dark:bg-gray-800 p-6 rounded-b-3xl shadow-sm mb-6">
        <View className="items-center">
          <View className="bg-orange-100 dark:bg-orange-700 w-24 h-24 rounded-full items-center justify-center mb-4">
            <Text className="text-orange-600 dark:text-orange-400 text-4xl font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            {user?.name || "User"}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            {user?.email || "email@example.com"}
          </Text>
        </View>
      </View>

      {/* Profile Options */}
      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {/* Dark Mode Toggle */}
        <ProfileOption
          icon="moon-outline"
          label="Dark Mode"
          rightElement={
            <Switch
              value={colorScheme === "dark"}
              onValueChange={handleToggleColorScheme}
              trackColor={{ false: "#CBD5E1", true: "#3B82F6" }}
              thumbColor={colorScheme === "dark" ? "#F3F4F6" : "#FFFFFF"}
              ios_backgroundColor="#CBD5E1"
            />
          }
        />

        {/* Seller Dashboard */}
        <ProfileOption
          icon="briefcase-outline"
          label={
            user?.seller_tab === "inactive"
              ? "Become a Seller"
              : "Seller Dashboard"
          }
          onPress={handlePress}
        />

        {/* Account Settings */}
        <ProfileOption
          icon="settings-outline"
          label="Account Settings"
          onPress={() => {
            /* Add navigation to settings */
          }}
        />

        {/* Help & Support */}
        <ProfileOption
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => {
            /* Add navigation to help */
          }}
        />

        {/* Privacy Policy */}
        <ProfileOption
          icon="shield-outline"
          label="Privacy Policy"
          onPress={() => {
            /* Add navigation to privacy policy */
          }}
        />

        {/* Transaction History Option */}
        <ProfileOption
          icon="receipt-outline"
          label="Transaction History"
          onPress={() => router.push("/transaction_history")}
        />

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 p-4 rounded-2xl mt-4 mb-6 flex-row items-center justify-center"
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color="white"
            className="mr-2"
          />
          <Text className="text-white text-lg font-medium ml-2">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default memo(Profile);
