import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store/auth/authSlice";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileManagement = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const saveChanges = useCallback(() => {
    const data = {
      name: formData.name,
      email: formData.email,
    };

    dispatch(updateUser(data))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "Profile updated successfully", [
          { text: "OK", onPress: () => router.back() },
        ]);
      })
      .catch((error) => {
        Alert.alert("Error", error.message || "Failed to update profile");
      });
  }, [formData, dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          Profile Management
        </Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View className="items-center mb-6">
          <View className="bg-orange-100 dark:bg-orange-700 w-24 h-24 rounded-full items-center justify-center mb-2">
            <Text className="text-orange-600 dark:text-orange-400 text-4xl font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
            <Text className="text-white">Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-600 dark:text-gray-300 mb-1 text-base font-medium">
              Full Name
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              className="bg-white dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View>
            <Text className="text-gray-600 dark:text-gray-300 mb-1 text-base font-medium">
              Email Address
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              className="bg-white dark:bg-gray-800 p-4 rounded-xl text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="p-4 border-t border-gray-200 dark:border-gray-800">
        <TouchableOpacity
          onPress={saveChanges}
          className="bg-blue-500 p-4 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileManagement;
