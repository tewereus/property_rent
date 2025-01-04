import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { verifyPayment } from "../store/payment/paymentSlice";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentWebView() {
  const { paymentUrl, tx_ref } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleNavigationStateChange = async (navState) => {
    // Check if the URL contains success indicators
    if (
      navState.url.includes("success") ||
      navState.url.includes("completed")
    ) {
      try {
        await dispatch(verifyPayment(tx_ref)).unwrap();
        // Payment verified successfully
        router.replace("/transaction_history");
      } catch (error) {
        console.error("Payment verification failed:", error);
        router.replace("/(tabs)/home");
      }
    }
    // Handle cancellation or failure
    else if (
      navState.url.includes("cancel") ||
      navState.url.includes("failed")
    ) {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View className="absolute inset-0 justify-center items-center bg-white">
            <ActivityIndicator size="large" color="#FF8E01" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
