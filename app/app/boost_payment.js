// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Linking,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import React, { useState, useCallback } from "react";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useDispatch } from "react-redux";
// import { changeFeatured } from "../store/property/propertySlice";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { initializePayment } from "../store/payment/paymentSlice";

// const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
//   const methods = [
//     { id: "telebirr", name: "TeleBirr", icon: "phone-portrait-outline" },
//     { id: "cbe", name: "CBE Birr", icon: "card-outline" },
//     { id: "cash", name: "Cash", icon: "cash-outline" },
//   ];

//   return (
//     <View className="mb-6">
//       {methods.map((method) => (
//         <TouchableOpacity
//           key={method.id}
//           onPress={() => onSelect(method.id)}
//           className={`flex-row items-center p-4 mb-3 rounded-xl border ${
//             selectedMethod === method.id
//               ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
//               : "border-gray-200 dark:border-gray-700"
//           }`}
//         >
//           <View className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
//             <Ionicons name={method.icon} size={24} color="#3B82F6" />
//           </View>
//           <Text
//             className={`flex-1 text-lg ${
//               selectedMethod === method.id
//                 ? "text-blue-600 dark:text-blue-400"
//                 : "text-gray-700 dark:text-gray-300"
//             }`}
//           >
//             {method.name}
//           </Text>
//           <View
//             className={`w-6 h-6 rounded-full border-2 ${
//               selectedMethod === method.id
//                 ? "border-blue-500 bg-blue-500"
//                 : "border-gray-300 dark:border-gray-600"
//             } items-center justify-center`}
//           >
//             {selectedMethod === method.id && (
//               <Ionicons name="checkmark" size={14} color="white" />
//             )}
//           </View>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// const BoostPayment = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const params = useLocalSearchParams();
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handlePayment = useCallback(async () => {
//     if (!paymentMethod) {
//       Alert.alert("Error", "Please select a payment method");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const paymentData = {
//         amount: 50,
//         propertyId: params.propertyId,
//         paymentMethod: paymentMethod,
//         transactionType: "boost",
//       };

//       console.log("Initiating payment with data:", paymentData);

//       const response = await dispatch(initializePayment(paymentData)).unwrap();
//       console.log("Payment initialization response:", response);

//       if (!response?.paymentUrl) {
//         throw new Error("Payment URL not received from server");
//       }

//       // Navigate to WebView with payment URL
//       router.push({
//         pathname: "/payment-webview",
//         params: {
//           paymentUrl: response.paymentUrl,
//           tx_ref: response.tx_ref,
//         },
//       });

//       // Clear state
//       setPaymentMethod("");
//       setIsProcessing(false);
//     } catch (error) {
//       console.error("Payment error:", error);
//       Alert.alert(
//         "Payment Error",
//         error?.message || "Failed to initiate payment. Please try again."
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [paymentMethod, params.propertyId, dispatch, router]);

//   return (
//     <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
//       <View className="flex-1">
//         {/* Header */}
//         <View className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
//           <View className="flex-row items-center">
//             <TouchableOpacity onPress={() => router.back()} className="mr-4">
//               <Ionicons name="arrow-back" size={24} color="#6B7280" />
//             </TouchableOpacity>
//             <Text className="text-xl font-bold text-gray-800 dark:text-white">
//               Boost Your Property
//             </Text>
//           </View>
//         </View>

//         <ScrollView className="flex-1 p-6">
//           {/* Amount Section */}
//           <View className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-6">
//             <Text className="text-gray-500 dark:text-gray-400 mb-2">
//               Boost Fee
//             </Text>
//             <Text className="text-3xl font-bold text-gray-800 dark:text-white">
//               ETB 50.00
//             </Text>
//             <Text className="text-gray-500 dark:text-gray-400 mt-2">
//               Your property will be featured and shown to more users
//             </Text>
//           </View>

//           {/* Benefits Section */}
//           <View className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-6">
//             <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//               Boost Benefits
//             </Text>
//             <View className="space-y-3">
//               <View className="flex-row items-center">
//                 <Ionicons name="star" size={24} color="#F59E0B" />
//                 <Text className="ml-3 text-gray-700 dark:text-gray-300">
//                   Featured in search results
//                 </Text>
//               </View>
//               <View className="flex-row items-center">
//                 <Ionicons name="trending-up" size={24} color="#10B981" />
//                 <Text className="ml-3 text-gray-700 dark:text-gray-300">
//                   Increased visibility
//                 </Text>
//               </View>
//               <View className="flex-row items-center">
//                 <Ionicons name="people" size={24} color="#3B82F6" />
//                 <Text className="ml-3 text-gray-700 dark:text-gray-300">
//                   Reach more potential buyers
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Payment Method Selection */}
//           <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//             Select Payment Method
//           </Text>
//           <PaymentMethodSelector
//             selectedMethod={paymentMethod}
//             onSelect={setPaymentMethod}
//           />
//         </ScrollView>

//         {/* Payment Button */}
//         <View className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
//           <TouchableOpacity
//             onPress={handlePayment}
//             disabled={isProcessing || !paymentMethod}
//             className={`${
//               isProcessing || !paymentMethod ? "bg-gray-400" : "bg-[#FF8E01]"
//             } rounded-xl py-4`}
//           >
//             {isProcessing ? (
//               <ActivityIndicator color="white" />
//             ) : (
//               <Text className="text-white text-center font-semibold text-lg">
//                 Pay & Boost Property
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default BoostPayment;

import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { changeFeatured } from "../store/property/propertySlice";
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

const BoostPayment = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = useCallback(async () => {
    if (!paymentMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    setIsProcessing(true);
    try {
      const paymentData = {
        amount: 50,
        propertyId: params.propertyId,
        paymentMethod: paymentMethod,
        transactionType: "boost",
      };

      console.log("Initiating payment with data:", paymentData);

      const response = await dispatch(initializePayment(paymentData)).unwrap();
      console.log("Payment initialization response:", response);

      if (!response?.paymentUrl) {
        throw new Error("Payment URL not received from server");
      }

      // Navigate to WebView with payment URL
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
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Payment Error",
        error?.message || "Failed to initiate payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  }, [paymentMethod, params.propertyId, dispatch, router]);

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
              className="text-gray-800 dark:text-white font-bold"
              style={{ fontSize: 20 * SCALE_FACTOR }}
            >
              Boost Your Property
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
              Boost Fee
            </Text>
            <Text
              className="font-bold text-gray-800 dark:text-white"
              style={{ fontSize: 32 * SCALE_FACTOR }}
            >
              ETB 50.00
            </Text>
            <Text
              className="text-gray-500 dark:text-gray-400 mt-2"
              style={{ fontSize: 14 * SCALE_FACTOR }}
            >
              Your property will be featured and shown to more users
            </Text>
          </View>

          {/* Benefits Section */}
          <View
            className="bg-white dark:bg-gray-800 rounded-xl mb-6"
            style={{ padding: 24 * SCALE_FACTOR }}
          >
            <Text
              className="font-semibold text-gray-800 dark:text-white mb-4"
              style={{ fontSize: 18 * SCALE_FACTOR }}
            >
              Boost Benefits
            </Text>
            <View style={{ gap: 12 * SCALE_FACTOR }}>
              <View className="flex-row items-center">
                <Ionicons
                  name="star"
                  size={24 * SCALE_FACTOR}
                  color="#F59E0B"
                />
                <Text
                  className="ml-3 text-gray-700 dark:text-gray-300"
                  style={{ fontSize: 16 * SCALE_FACTOR }}
                >
                  Featured in search results
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="trending-up"
                  size={24 * SCALE_FACTOR}
                  color="#10B981"
                />
                <Text
                  className="ml-3 text-gray-700 dark:text-gray-300"
                  style={{ fontSize: 16 * SCALE_FACTOR }}
                >
                  Increased visibility
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="people"
                  size={24 * SCALE_FACTOR}
                  color="#3B82F6"
                />
                <Text
                  className="ml-3 text-gray-700 dark:text-gray-300"
                  style={{ fontSize: 16 * SCALE_FACTOR }}
                >
                  Reach more potential buyers
                </Text>
              </View>
            </View>
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
