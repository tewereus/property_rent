import { useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";

const PaymentSuccess = ({ navigation }) => {
  const colorScheme = useColorScheme(); // Detect current color scheme (light or dark)
  const router = useRouter();

  return (
    <View
      className={`flex-1 justify-center items-center p-4 ${
        colorScheme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* <Image
        source={require("../assets/success.png")} // Add your success image here
        className="w-32 h-32 mb-6"
      /> */}
      <Text
        className={`text-2xl font-bold ${
          colorScheme === "dark" ? "text-white" : "text-black"
        }`}
      >
        Payment Successful!
      </Text>
      <Text
        className={`text-lg text-center mt-2 ${
          colorScheme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Thank you for your payment. Your transaction has been completed
        successfully.
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("transaction_history")}
        className={`mt-8 px-6 py-3 rounded-full ${
          colorScheme === "dark" ? "bg-orange-500" : "bg-blue-500"
        } `}
      >
        <Text className={`text-white text-lg font-semibold`}>
          View Transaction History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} className="mt-4">
        <Text
          className={`text-lg underline ${
            colorScheme === "dark" ? "text-orange-300" : "text-blue-700"
          }`}
        >
          Back to Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentSuccess;
