import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { verifyPayment } from "../store/payment/paymentSlice";

export default function PaymentSuccess() {
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (params.tx_ref) {
      dispatch(verifyPayment(params.tx_ref))
        .unwrap()
        .then(() => {
          // Handle success
          router.replace("/transaction_history");
        })
        .catch((error) => {
          // Handle error
          console.error("Payment verification failed:", error);
        });
    }
  }, [params.tx_ref]);

  return (
    <View>
      <Text>Verifying your payment...</Text>
    </View>
  );
}
