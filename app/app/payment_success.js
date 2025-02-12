// import { useRouter } from "expo-router";
// import React from "react";
// import { View, Text, Image, TouchableOpacity } from "react-native";
// import { useColorScheme } from "react-native";

// const PaymentSuccess = ({ navigation }) => {
//   const colorScheme = useColorScheme(); // Detect current color scheme (light or dark)
//   const router = useRouter();

//   return (
//     <View
//       className={`flex-1 justify-center items-center p-4 ${
//         colorScheme === "dark" ? "bg-gray-900" : "bg-white"
//       }`}
//     >
//       {/* <Image
//         source={require("../assets/success.png")} // Add your success image here
//         className="w-32 h-32 mb-6"
//       /> */}
//       <Text
//         className={`text-2xl font-bold ${
//           colorScheme === "dark" ? "text-white" : "text-black"
//         }`}
//       >
//         Payment Successful!
//       </Text>
//       <Text
//         className={`text-lg text-center mt-2 ${
//           colorScheme === "dark" ? "text-gray-300" : "text-gray-700"
//         }`}
//       >
//         Thank you for your payment. Your transaction has been completed
//         successfully.
//       </Text>

//       <TouchableOpacity
//         onPress={() => navigation.navigate("transaction_history")}
//         className={`mt-8 px-6 py-3 rounded-full ${
//           colorScheme === "dark" ? "bg-orange-500" : "bg-blue-500"
//         } `}
//       >
//         <Text className={`text-white text-lg font-semibold`}>
//           View Transaction History
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.back()} className="mt-4">
//         <Text
//           className={`text-lg underline ${
//             colorScheme === "dark" ? "text-orange-300" : "text-blue-700"
//           }`}
//         >
//           Back to Home
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default PaymentSuccess;

import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_PIXEL_8_WIDTH = 393; // Base width of Pixel 8
const SCALE_FACTOR = SCREEN_WIDTH / BASE_PIXEL_8_WIDTH;

const PaymentSuccess = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const generateTransactionID = () => {
    return `#TXN${Math.floor(Math.random() * 900000000) + 100000000}`;
  };

  return (
    <SafeAreaView className="flex-1">
      <View
        className={`flex-1 justify-between items-center ${
          colorScheme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
        style={{ padding: 24 * SCALE_FACTOR }}
      >
        <View className="flex-1 justify-center items-center">
          <View
            className={`mb-8 rounded-full items-center justify-center ${
              colorScheme === "dark" ? "bg-green-800" : "bg-green-100"
            }`}
            style={{
              width: 120 * SCALE_FACTOR,
              height: 120 * SCALE_FACTOR,
              marginTop: -40 * SCALE_FACTOR,
            }}
          >
            <Ionicons
              name="checkmark-circle"
              size={80 * SCALE_FACTOR}
              color={colorScheme === "dark" ? "#4ADE80" : "#22C55E"}
            />
          </View>

          {/* Success Message */}
          <Text
            className={`text-center font-bold mb-3 ${
              colorScheme === "dark" ? "text-white" : "text-gray-900"
            }`}
            style={{ fontSize: 28 * SCALE_FACTOR }}
          >
            Payment Successful!
          </Text>

          <Text
            className={`text-center mb-8 ${
              colorScheme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
            style={{
              fontSize: 16 * SCALE_FACTOR,
              maxWidth: 300 * SCALE_FACTOR,
              lineHeight: 24 * SCALE_FACTOR,
            }}
          >
            Your transaction has been completed successfully. Thank you for your
            payment.
          </Text>

          {/* Transaction Details Card */}
          <View
            className={`rounded-3xl w-full max-w-xs shadow-sm ${
              colorScheme === "dark" ? "bg-gray-800" : "bg-gray-50"
            }`}
            style={{ padding: 24 * SCALE_FACTOR }}
          >
            {/* Amount */}
            <View className="mb-4 items-center">
              <Text
                className={`mb-2 ${
                  colorScheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
                style={{ fontSize: 14 * SCALE_FACTOR }}
              >
                Amount Paid
              </Text>
              <Text
                className={`font-bold ${
                  colorScheme === "dark" ? "text-white" : "text-gray-900"
                }`}
                style={{ fontSize: 36 * SCALE_FACTOR }}
              >
                ETB 100.00
              </Text>
            </View>

            {/* Divider */}
            <View
              className={`w-full h-[1px] mb-4 ${
                colorScheme === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
            />

            {/* Transaction ID */}
            <View className="items-center">
              <Text
                className={`mb-1 ${
                  colorScheme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
                style={{ fontSize: 14 * SCALE_FACTOR }}
              >
                Transaction ID
              </Text>
              <Text
                className={`font-medium ${
                  colorScheme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
                style={{ fontSize: 15 * SCALE_FACTOR }}
              >
                {generateTransactionID()}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Buttons */}
        <View className="w-full max-w-sm space-y-4">
          <TouchableOpacity
            onPress={() => router.push("/transaction_history")}
            className={`rounded-2xl flex-row items-center justify-center ${
              colorScheme === "dark" ? "bg-orange-500" : "bg-[#FF8E01]"
            }`}
            style={{
              padding: 16 * SCALE_FACTOR,
              elevation: 2,
            }}
          >
            <Ionicons
              name="receipt-outline"
              size={24 * SCALE_FACTOR}
              color="white"
              style={{ marginRight: 8 * SCALE_FACTOR }}
            />
            <Text
              className="text-white font-semibold"
              style={{ fontSize: 16 * SCALE_FACTOR }}
            >
              View Transaction History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/home")}
            className={`rounded-2xl flex-row items-center justify-center ${
              colorScheme === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}
            style={{ padding: 16 * SCALE_FACTOR }}
          >
            <Ionicons
              name="home-outline"
              size={24 * SCALE_FACTOR}
              color={colorScheme === "dark" ? "#F97316" : "#FF8E01"}
              style={{ marginRight: 8 * SCALE_FACTOR }}
            />
            <Text
              className={`font-semibold ${
                colorScheme === "dark" ? "text-orange-500" : "text-[#FF8E01]"
              }`}
              style={{ fontSize: 16 * SCALE_FACTOR }}
            >
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSuccess;
