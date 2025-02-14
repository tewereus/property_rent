import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import React, { useEffect, useCallback, memo, useState } from "react";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  changeMode,
  logout,
  resetAuthState,
  toggleDarkMode,
  updateUser,
} from "../../store/auth/authSlice";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  getAllRegions,
  getAllSubRegions,
  getAllLocations,
} from "../../store/address/addressSlice";
import { Picker } from "@react-native-picker/picker";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_PIXEL_8_WIDTH = 393; // Base width of Pixel 8
const SCALE_FACTOR = SCREEN_WIDTH / BASE_PIXEL_8_WIDTH;

// Memoize the ProfileOption component
const ProfileOption = memo(({ icon, label, value, onPress, rightElement }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between bg-white dark:bg-gray-700 rounded-2xl mb-4 shadow-sm"
    style={{ padding: 16 * SCALE_FACTOR }}
  >
    <View className="flex-row items-center">
      <View
        className="bg-orange-100 dark:bg-orange-800 rounded-full mr-4"
        style={{ padding: 8 * SCALE_FACTOR }}
      >
        <Ionicons name={icon} size={24 * SCALE_FACTOR} color="#F97316" />
      </View>
      <Text
        className="text-gray-700 dark:text-gray-200"
        style={{ fontSize: 18 * SCALE_FACTOR }}
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
));

const Profile = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isSuccess } = useSelector((state) => state.auth);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    region: user?.address?.region || "",
    subregion: user?.address?.subregion || "",
    location: user?.address?.location || "",
  });
  const [filteredSubRegions, setFilteredSubRegions] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const { regions, subregions, locations } = useSelector(
    (state) => state.address
  );

  useEffect(() => {
    dispatch(getAllRegions());
    dispatch(getAllSubRegions());
    dispatch(getAllLocations());
  }, []);

  useEffect(() => {
    if (formData.region) {
      const regionSubRegions = subregions.filter(
        (subRegion) => subRegion.region_id?._id === formData.region
      );
      setFilteredSubRegions(regionSubRegions);
      setFormData((prev) => ({
        ...prev,
        subregion: "",
        location: "",
      }));
      setFilteredLocations([]);
    }
  }, [formData.region, subregions]);

  useEffect(() => {
    if (formData.subregion) {
      const subRegionLocations = locations.filter(
        (location) => location?.subregion_id?._id === formData.subregion
      );
      setFilteredLocations(subRegionLocations);
      setFormData((prev) => ({
        ...prev,
        location: "",
      }));
    }
  }, [formData.subregion, locations]);

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

  const saveChanges = useCallback(() => {
    const data = {
      name: formData.name,
      email: formData.email,
      address: {
        region: formData.region,
        subregion: formData.subregion,
        location: formData.location,
      },
    };

    dispatch(updateUser(data))
      .unwrap()
      .then(() => {
        setModalVisible(false);
        setEditMode(false);
      })
      .catch((error) => {
        Alert.alert("Error", error.message || "Failed to update profile");
      });
  }, [formData, dispatch]);

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Profile Header */}
      <View
        className="bg-white dark:bg-gray-800 rounded-b-3xl shadow-sm mb-6"
        style={{ padding: 24 * SCALE_FACTOR }}
      >
        <View className="items-center">
          <View
            className="bg-orange-100 dark:bg-orange-700 rounded-full items-center justify-center mb-4"
            style={{
              width: 96 * SCALE_FACTOR,
              height: 96 * SCALE_FACTOR,
            }}
          >
            <Text
              className="text-orange-600 dark:text-orange-400 font-bold"
              style={{ fontSize: 40 * SCALE_FACTOR }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text
            className="font-bold text-gray-800 dark:text-white mb-1"
            style={{ fontSize: 24 * SCALE_FACTOR }}
          >
            {user?.name || "User"}
          </Text>
          <Text
            className="text-gray-500 dark:text-gray-400"
            style={{ fontSize: 16 * SCALE_FACTOR }}
          >
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
              style={{ transform: [{ scale: SCALE_FACTOR }] }}
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

        {/* Transaction History Option */}
        <ProfileOption
          icon="receipt-outline"
          label="Transaction History"
          onPress={() => router.push("/transaction_history")}
        />

        {/* Account Settings */}
        <ProfileOption
          icon="settings-outline"
          label="Account Settings"
          onPress={() => router.push("/profile_management")}
        />

        {/* Help & Support */}
        {/* <ProfileOption
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => {
          }}
        /> */}

        {/* Privacy Policy */}
        <ProfileOption
          icon="shield-outline"
          label="Privacy Policy"
          onPress={() => {
            /* Add navigation to privacy policy */
          }}
        />

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 rounded-2xl mt-4 mb-6 flex-row items-center justify-center"
          style={{ padding: 16 * SCALE_FACTOR }}
        >
          <Ionicons
            name="log-out-outline"
            size={24 * SCALE_FACTOR}
            color="white"
          />
          <Text
            className="text-white font-medium ml-2"
            style={{ fontSize: 18 * SCALE_FACTOR }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Update Modal if you have one */}
      {modalVisible && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View
              className="bg-white dark:bg-gray-800 rounded-t-3xl"
              style={{ padding: 20 * SCALE_FACTOR }}
            >
              {/* Modal content with scaled text and input sizes */}
              <TextInput
                style={{
                  fontSize: 16 * SCALE_FACTOR,
                  padding: 12 * SCALE_FACTOR,
                  marginBottom: 12 * SCALE_FACTOR,
                }}
                // ... other props
              />
              {/* ... other modal content ... */}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default memo(Profile);
