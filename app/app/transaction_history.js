import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getUserTransactions } from "../store/property/propertySlice";
import Ionicons from "react-native-vector-icons/Ionicons";

const TransactionHistoryItem = ({ transaction }) => (
  <TouchableOpacity
    className="bg-white dark:bg-gray-700 p-4 rounded-2xl mb-4 shadow-sm mx-4"
    onPress={() => {
      /* TODO: Add transaction detail modal */
    }}
  >
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-lg font-semibold text-gray-800 dark:text-white">
        {transaction.property?.title || "Property"}
      </Text>
      <View
        className={`px-3 py-1 rounded-full ${
          transaction.status === "completed"
            ? "bg-green-100 dark:bg-green-800"
            : transaction.status === "pending"
            ? "bg-yellow-100 dark:bg-yellow-800"
            : "bg-red-100 dark:bg-red-800"
        }`}
      >
        <Text
          className={`text-sm capitalize ${
            transaction.status === "completed"
              ? "text-green-800 dark:text-green-200"
              : transaction.status === "pending"
              ? "text-yellow-800 dark:text-yellow-200"
              : "text-red-800 dark:text-red-200"
          }`}
        >
          {transaction.status}
        </Text>
      </View>
    </View>

    <View className="flex-row items-center mb-2">
      <Ionicons name="cash-outline" size={16} color="#6B7280" />
      <Text className="text-gray-600 dark:text-gray-300 ml-2">
        ${transaction.amount.toLocaleString()}
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 ml-4 text-sm">
        via {transaction.paymentMethod.replace("_", " ")}
      </Text>
    </View>

    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center">
        <Ionicons
          name={
            transaction.transactionType === "rent"
              ? "key-outline"
              : "home-outline"
          }
          size={16}
          color="#6B7280"
        />
        <Text className="text-gray-500 dark:text-gray-400 ml-2 capitalize">
          {transaction.transactionType}
        </Text>
      </View>
      <Text className="text-gray-500 dark:text-gray-400 text-sm">
        {new Date(transaction.createdAt).toLocaleDateString()}
      </Text>
    </View>

    {transaction.notes && (
      <Text className="text-gray-500 dark:text-gray-400 mt-2 text-sm italic">
        {transaction.notes}
      </Text>
    )}
  </TouchableOpacity>
);

const TransactionHistory = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.property);

  useEffect(() => {
    dispatch(getUserTransactions());
  }, [dispatch]);

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 p-4 flex-row items-center shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-800 dark:text-white">
          Transaction History
        </Text>
      </View>

      {/* Transactions List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-4">
          {transactions?.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionHistoryItem
                key={transaction._id}
                transaction={transaction}
              />
            ))
          ) : (
            <Text className="text-center text-gray-500 dark:text-gray-400 mt-4">
              No transactions yet
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default TransactionHistory;
