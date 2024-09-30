import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";
import ToastProvider from "react-native-toast-message";
import "./index.css";
const _layout = () => {
  // make it so that the routes are accessable for authenticated users, if user logged out and clicked back it goes back to the page
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="seller_tabs" options={{ headerShown: false }} />
        <Stack.Screen name="seller_auth" options={{ headerShown: false }} />
        <Stack.Screen name="waiting" options={{ headerShown: false }} />
      </Stack>
      <ToastProvider />
    </Provider>
  );
};

export default _layout;
