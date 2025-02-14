import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  Dimensions,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import {
  createProperty,
  updateProperty,
} from "../store/property/propertySlice";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { initializePayment } from "../store/payment/paymentSlice";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_PIXEL_8_WIDTH = 393; // Base width of Pixel 8
const SCALE_FACTOR = SCREEN_WIDTH / BASE_PIXEL_8_WIDTH;

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  const methods = [
    { id: "telebirr", name: "TeleBirr", icon: "phone-portrait-outline" },
    { id: "cbe", name: "CBE Birr", icon: "card-outline" },
    { id: "cash", name: "Cash", icon: "cash-outline" },
  ];

  return (
    <View style={{ marginBottom: 24 * SCALE_FACTOR }}>
      {methods.map((method) => (
        <TouchableOpacity
          key={method.id}
          onPress={() => onSelect(method.id)}
          className={`flex-row items-center mb-3 rounded-xl border ${
            selectedMethod === method.id
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
              : "border-gray-200 dark:border-gray-700"
          }`}
          style={{ padding: 16 * SCALE_FACTOR }}
        >
          <View
            className="bg-blue-100 dark:bg-blue-900 rounded-full mr-3"
            style={{ padding: 8 * SCALE_FACTOR }}
          >
            <Ionicons
              name={method.icon}
              size={24 * SCALE_FACTOR}
              color="#3B82F6"
            />
          </View>
          <Text
            className={`flex-1 ${
              selectedMethod === method.id
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
            style={{ fontSize: 18 * SCALE_FACTOR }}
          >
            {method.name}
          </Text>
          <View
            className={`rounded-full border-2 ${
              selectedMethod === method.id
                ? "border-blue-500 bg-blue-500"
                : "border-gray-300 dark:border-gray-600"
            } items-center justify-center`}
            style={{
              width: 24 * SCALE_FACTOR,
              height: 24 * SCALE_FACTOR,
            }}
          >
            {selectedMethod === method.id && (
              <Ionicons
                name="checkmark"
                size={14 * SCALE_FACTOR}
                color="white"
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const PaymentPost = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const propertyData = params.propertyData
    ? JSON.parse(params.propertyData)
    : null;
  const isEdit = params.isEdit === "true";

  const handlePayment = useCallback(async () => {
    if (!paymentMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    if (!propertyData) {
      Alert.alert("Error", "Property data is missing");
      return;
    }

    setIsProcessing(true);
    try {
      // First create/update the property
      let property;
      // if (isEdit) {
      //   property = await dispatch(updateProperty(propertyData)).unwrap();
      // } else {
      //   property = await dispatch(createProperty(propertyData)).unwrap();
      // }

      // if (!property?._id) {
      //   throw new Error("Failed to create/update property");
      // }

      const paymentData = {
        amount: 100,
        propertyId: propertyData._id,
        paymentMethod: paymentMethod,
        transactionType: "rent",
      };

      console.log("Initiating payment with data:", paymentData);

      const response = await dispatch(initializePayment(paymentData)).unwrap();
      console.log("Payment initialization response:", response);

      if (!response?.paymentUrl) {
        throw new Error("Payment URL not received from server");
      }

      router.push({
        pathname: "/payment-webview",
        params: {
          paymentUrl: response.paymentUrl,
          tx_ref: response.tx_ref,
        },
      });

      // Clear state
      setPaymentMethod("");
      setIsProcessing(false);

      Alert.alert(
        "Payment Initiated",
        "Complete the payment in your browser. Your property will be listed once payment is confirmed.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to process payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  }, [paymentMethod, propertyData, isEdit, dispatch, router]);

  if (!propertyData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
        <View className="flex-1 justify-center items-center">
          <Text
            className="text-red-500 text-center"
            style={{
              fontSize: 18 * SCALE_FACTOR,
              marginBottom: 16 * SCALE_FACTOR,
            }}
          >
            Error: Property data is missing
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#FF8E01] rounded-xl"
            style={{
              paddingHorizontal: 24 * SCALE_FACTOR,
              paddingVertical: 12 * SCALE_FACTOR,
            }}
          >
            <Text
              className="text-white font-medium"
              style={{ fontSize: 16 * SCALE_FACTOR }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="flex-1">
        {/* Header */}
        <View
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
          style={{ padding: 24 * SCALE_FACTOR }}
        >
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 16 * SCALE_FACTOR }}
            >
              <Ionicons
                name="arrow-back"
                size={24 * SCALE_FACTOR}
                color="#6B7280"
              />
            </TouchableOpacity>
            <Text
              className="font-bold text-gray-800 dark:text-white"
              style={{ fontSize: 20 * SCALE_FACTOR }}
            >
              Payment for {isEdit ? "Updating" : "Listing"}
            </Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24 * SCALE_FACTOR }}
        >
          {/* Amount Section */}
          <View
            className="bg-white dark:bg-gray-800 rounded-xl mb-6"
            style={{ padding: 24 * SCALE_FACTOR }}
          >
            <Text
              className="text-gray-500 dark:text-gray-400 mb-2"
              style={{ fontSize: 16 * SCALE_FACTOR }}
            >
              Amount to Pay
            </Text>
            <Text
              className="font-bold text-gray-800 dark:text-white"
              style={{ fontSize: 32 * SCALE_FACTOR }}
            >
              ETB {"100.00"}
            </Text>
            <Text
              className="text-gray-500 dark:text-gray-400 mt-2"
              style={{ fontSize: 14 * SCALE_FACTOR }}
            >
              {isEdit ? "Property update fee" : "Rental listing fee"}
            </Text>
          </View>

          {/* Payment Method Selection */}
          <Text
            className="font-semibold text-gray-800 dark:text-white mb-4"
            style={{ fontSize: 18 * SCALE_FACTOR }}
          >
            Select Payment Method
          </Text>
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </ScrollView>

        {/* Payment Button */}
        <View
          className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          style={{ padding: 24 * SCALE_FACTOR }}
        >
          <TouchableOpacity
            onPress={handlePayment}
            disabled={isProcessing || !paymentMethod}
            className={`${
              isProcessing || !paymentMethod ? "bg-gray-400" : "bg-[#FF8E01]"
            } rounded-xl`}
            style={{ padding: 16 * SCALE_FACTOR }}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                className="text-white text-center font-semibold"
                style={{ fontSize: 18 * SCALE_FACTOR }}
              >
                Pay & List Property
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentPost;
