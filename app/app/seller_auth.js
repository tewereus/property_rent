import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { verifySeller } from "../store/auth/authSlice";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

const SellerAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const { message } = useSelector((state) => state.auth);

  const handleAgree = async () => {
    if (agreed) {
      try {
        const result = await dispatch(verifySeller());
        if (result.payload.seller_tab) {
          console.log(result.payload.seller_tab);
          router.push("/seller_tabs/dashboard");
        } else {
          console.error("Verification failed");
        }
      } catch (error) {
        console.error("An error occurred during verification", error);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <View className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Terms and Conditions
        </Text>
        <Text className="text-gray-500 dark:text-gray-400">
          Please read and agree to our terms before becoming a seller
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={true}
      >
        <View className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <Text className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Property Marketplace Terms of Service
          </Text>

          <View className="space-y-6">
            <View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                1. Seller Eligibility
              </Text>
              <Text className="text-gray-600 dark:text-gray-300">
                • Must be at least 18 years old{"\n"}• Must provide valid
                identification{"\n"}• Must have legal authority to sell/rent the
                listed property{"\n"}• Must maintain accurate and up-to-date
                property information
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                2. Property Listings
              </Text>
              <Text className="text-gray-600 dark:text-gray-300">
                • All listings must be accurate and truthful{"\n"}• Images must
                be current and represent the actual property{"\n"}• Pricing must
                be transparent with all fees clearly stated{"\n"}• Property
                status must be promptly updated when changes occur
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                3. Fees and Payments
              </Text>
              <Text className="text-gray-600 dark:text-gray-300">
                • Rental listing fee: ETB 100 per listing{"\n"}• Property boost
                fee: ETB 50 per boost{"\n"}• Commission on successful sales: 2%
                {"\n"}• Payment processing fees may apply
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                4. Property Types
              </Text>
              <Text className="text-gray-600 dark:text-gray-300">
                Allowed listings include:{"\n"}• Residential properties{"\n"}•
                Commercial properties{"\n"}• Land{"\n"}• Vehicles{"\n"}•
                Warehouses
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                5. Seller Responsibilities
              </Text>
              <Text className="text-gray-600 dark:text-gray-300">
                • Respond to inquiries within 24 hours{"\n"}• Maintain property
                availability status{"\n"}• Provide accurate property
                documentation{"\n"}• Comply with local real estate laws and
                regulations
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                6. Prohibited Activities
              </Text>
              <Text className="text-gray-600 dark:text-gray-300">
                • False advertising{"\n"}• Discriminatory practices{"\n"}•
                Illegal property listings{"\n"}• Spam or fraudulent activities
              </Text>
            </View>

            <View>
              <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                7. Account Suspension
              </Text>
              <Text className="text-gray-600 dark:text-gray-300">
                We reserve the right to suspend seller accounts for:{"\n"}•
                Terms of service violations{"\n"}• User complaints{"\n"}•
                Fraudulent activities{"\n"}• Non-compliance with local laws
              </Text>
            </View>

            <View style={{ height: 20 }} />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={() => setAgreed(!agreed)}
          className="flex-row items-center mb-4"
        >
          <View
            className={`w-6 h-6 rounded-md border-2 mr-2 items-center justify-center ${
              agreed
                ? "bg-[#FF8E01] border-[#FF8E01]"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {agreed && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text className="text-gray-700 dark:text-gray-300">
            I agree to the terms and conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAgree}
          disabled={!agreed}
          className={`p-4 rounded-xl ${
            agreed ? "bg-[#FF8E01]" : "bg-gray-400"
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Become a Seller
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SellerAuth;
