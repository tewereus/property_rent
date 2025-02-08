import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getRejectionMessages } from "../store/property/propertySlice";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: screenWidth } = Dimensions.get("window");

const NotificationItem = ({ message, time, type = "info" }) => {
  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case "success":
        return "checkmark-circle-outline";
      case "error":
        return "alert-circle-outline";
      case "warning":
        return "warning-outline";
      default:
        return "information-circle-outline";
    }
  };

  // Get color based on notification type
  const getColor = () => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-3 mx-4 shadow-sm">
      <View className="flex-row items-start space-x-3">
        <View className={`${getColor()} mt-1`}>
          <Ionicons name={getIcon()} size={24} color="#f00" />
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text className=" font-medium text-lg text-gray-800 dark:text-white flex-1 mr-2">
              {message}
            </Text>
            {/* <Text className="text-xs text-gray-500 dark:text-gray-400">
              {time || "Just now"}
            </Text> */}
          </View>
        </View>
      </View>
    </View>
  );
};

const Notification = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRejectionMessages());
  }, []);

  const { rejectedMessage } = useSelector((state) => state.property);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 p-4 flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-gray-800 dark:text-white">
            Notifications
          </Text>
        </View>

        <TouchableOpacity className="p-2">
          <Ionicons name="ellipsis-horizontal" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
      >
        {rejectedMessage?.message ? (
          <>
            <NotificationItem message={rejectedMessage.message} type="error" />
          </>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
              <Ionicons
                name="notifications-off-outline"
                size={40}
                color="#6B7280"
              />
            </View>
            <Text className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              No Notifications
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mx-10">
              You're all caught up! We'll notify you when there's something new.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Notification;
