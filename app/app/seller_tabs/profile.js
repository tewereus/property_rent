import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Dimensions,
} from "react-native";
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_PIXEL_8_WIDTH = 393; // Base width of Pixel 8
const SCALE_FACTOR = SCREEN_WIDTH / BASE_PIXEL_8_WIDTH;

const ProfileOption = ({ icon, label, value, onPress, rightElement }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between bg-white dark:bg-gray-700 rounded-2xl mb-4 shadow-sm mx-4"
    style={{ padding: 16 * SCALE_FACTOR }}
  >
    <View className="flex-row items-center">
      <View
        className="bg-orange-100 dark:bg-orange-900 rounded-full mr-4"
        style={{ padding: 8 * SCALE_FACTOR }}
      >
        <Ionicons name={icon} size={24 * SCALE_FACTOR} color="#F97316" />
      </View>
      <Text
        className="text-gray-700 dark:text-gray-200"
        style={{ fontSize: 16 * SCALE_FACTOR }}
      >
        {label}
      </Text>
    </View>
    {rightElement || (
      <Ionicons
        name="chevron-forward"
        size={24 * SCALE_FACTOR}
        color="#6B7280"
      />
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
    dispatch(changeMode(data))
      .unwrap()
      .then((response) => {
        console.log("response", response);
        router.push("/home");
      })
      .catch((error) => {
        console.log(error);
      });
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 24 * SCALE_FACTOR,
        }}
      >
        {/* Profile Header */}
        <View
          className="bg-white dark:bg-gray-800 rounded-b-3xl shadow-sm mb-6"
          style={{ padding: 24 * SCALE_FACTOR }}
        >
          <View className="items-center">
            <View
              className="bg-orange-100 dark:bg-orange-900 rounded-full items-center justify-center mb-4"
              style={{
                width: 96 * SCALE_FACTOR,
                height: 96 * SCALE_FACTOR,
              }}
            >
              <Text
                className="text-orange-600 dark:text-orange-400 font-bold"
                style={{ fontSize: 40 * SCALE_FACTOR }}
              >
                {user?.name?.[0]?.toUpperCase() || "S"}
              </Text>
            </View>
            <Text
              className="text-2xl font-bold text-gray-800 dark:text-white mb-1"
              style={{ fontSize: 24 * SCALE_FACTOR }}
            >
              Seller Dashboard
            </Text>
            <Text
              className="text-gray-500 dark:text-gray-400"
              style={{ fontSize: 16 * SCALE_FACTOR }}
            >
              {user?.email || "seller@example.com"}
            </Text>
          </View>
        </View>

        {/* Profile Options */}
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
                style={{ transform: [{ scale: SCALE_FACTOR }] }}
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
            onPress={() => {
              router.push("/profile_management");
            }}
          />

          <ProfileOption
            icon="bar-chart-outline"
            label="Analytics"
            onPress={() => {
              router.push("/seller_tabs/dashboard");
            }}
          />

          <ProfileOption
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => {}}
          />

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 rounded-2xl mt-2 flex-row items-center justify-center mx-4"
            style={{ padding: 16 * SCALE_FACTOR }}
          >
            <Ionicons
              name="log-out-outline"
              size={24 * SCALE_FACTOR}
              color="white"
              style={{ marginRight: 8 * SCALE_FACTOR }}
            />
            <Text
              className="text-white font-medium"
              style={{ fontSize: 16 * SCALE_FACTOR }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
