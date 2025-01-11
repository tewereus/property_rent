import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { verifyPayment } from "../store/payment/paymentSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

export default function PaymentWebView() {
  const { paymentUrl, tx_ref } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    console.log("here at web view");
    console.log("Payment URL:", paymentUrl); // Log the payment URL for debugging
  }, [paymentUrl]);

  const handleNavigationStateChange = async (navState) => {
    console.log("Navigated to:", navState.url); // Log navigation state changes

    if (navState.url.includes("test-payment-receipt")) {
      // Handle receipt processing here
      console.log("Handling receipt:", navState.url);
      console.log("tx_ref", tx_ref);
      // You can call your verification logic here
      await dispatch(verifyPayment(tx_ref)).unwrap();
      // router.back();
      router.replace("/payment_success");
      return; // Prevent further processing
    }

    if (
      navState.url.includes("success") ||
      navState.url.includes("completed")
    ) {
      console.log("Payment successful");
      try {
        await dispatch(verifyPayment(tx_ref)).unwrap();
        router.replace("/transaction_history");
      } catch (error) {
        console.error("Payment verification failed:", error);
        router.replace("/(tabs)/home");
      }
    } else if (
      navState.url.includes("cancel") ||
      navState.url.includes("failed")
    ) {
      console.log("Payment failed or canceled");
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
