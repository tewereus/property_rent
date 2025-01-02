import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { changeFeatured } from "../store/property/propertySlice";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  const methods = [
    { id: "telebirr", name: "TeleBirr", icon: "phone-portrait-outline" },
    { id: "cbe", name: "CBE Birr", icon: "card-outline" },
    { id: "cash", name: "Cash", icon: "cash-outline" },
  ];

  return (
    <View className="mb-6">
      {methods.map((method) => (
        <TouchableOpacity
          key={method.id}
          onPress={() => onSelect(method.id)}
          className={`flex-row items-center p-4 mb-3 rounded-xl border ${
            selectedMethod === method.id
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <View className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
            <Ionicons name={method.icon} size={24} color="#3B82F6" />
          </View>
          <Text
            className={`flex-1 text-lg ${
              selectedMethod === method.id
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {method.name}
          </Text>
          <View
            className={`w-6 h-6 rounded-full border-2 ${
              selectedMethod === method.id
                ? "border-blue-500 bg-blue-500"
                : "border-gray-300 dark:border-gray-600"
            } items-center justify-center`}
          >
            {selectedMethod === method.id && (
              <Ionicons name="checkmark" size={14} color="white" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const BoostPayment = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = useCallback(async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    try {
      // Boost the property after payment
      await dispatch(changeFeatured(params.propertyId)).unwrap();
      alert("Property boosted successfully!");
      router.back();
    } catch (error) {
      alert(error.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  }, [paymentMethod, params.propertyId, dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800 dark:text-white">
              Boost Your Property
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 p-6">
          {/* Amount Section */}
          <View className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-6">
            <Text className="text-gray-500 dark:text-gray-400 mb-2">
              Boost Fee
            </Text>
            <Text className="text-3xl font-bold text-gray-800 dark:text-white">
              ETB 50.00
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-2">
              Your property will be featured and shown to more users
            </Text>
          </View>

          {/* Benefits Section */}
          <View className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-6">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Boost Benefits
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="star" size={24} color="#F59E0B" />
                <Text className="ml-3 text-gray-700 dark:text-gray-300">
                  Featured in search results
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="trending-up" size={24} color="#10B981" />
                <Text className="ml-3 text-gray-700 dark:text-gray-300">
                  Increased visibility
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="people" size={24} color="#3B82F6" />
                <Text className="ml-3 text-gray-700 dark:text-gray-300">
                  Reach more potential buyers
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Method Selection */}
          <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Select Payment Method
          </Text>
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </ScrollView>

        {/* Payment Button */}
        <View className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            onPress={handlePayment}
            disabled={isProcessing || !paymentMethod}
            className={`${
              isProcessing || !paymentMethod ? "bg-gray-400" : "bg-[#FF8E01]"
            } rounded-xl py-4`}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Pay & Boost Property
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BoostPayment;
