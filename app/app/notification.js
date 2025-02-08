import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, memo } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getRejectionMessages } from "../store/property/propertySlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getIconForField, getUnitForField } from "../assets/utils";

const notification = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRejectionMessages());
  }, []);
  const { rejectedMessage } = useSelector((state) => state.property);
  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 p-4 flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text
          className="text-xl font-semibold text-gray-800 dark:text-white"
          onPress={() => console.log(rejectedMessage?.message)}
        >
          Notifications
        </Text>
      </View>

      {/* Transactions List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-4">
          {rejectedMessage?.message !== "" ? (
            // rejectedMessage.map((transaction) => (
            //   <TransactionHistoryItem
            //     key={transaction._id}
            //     transaction={transaction}
            //   />
            // ))
            <Text
              className="text-center text-gray-500 dark:text-gray-400 mt-4"
              onPress={() => console.log(rejectedMessage)}
            >
              {rejectedMessage?.message}
            </Text>
          ) : (
            <Text className="text-center text-gray-500 dark:text-gray-400 mt-4">
              No Notification yet
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default notification;
