import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";
import "intl-pluralrules";
import { I18nextProvider } from "react-i18next";
import i18n from "../locals/i18n";
import ToastProvider from "react-native-toast-message";
import React, { memo } from "react";
import "./index.css";
// make it so that the routes are accessable for authenticated users, if user logged out and clicked back it goes back to the page
const _layout = memo(() => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="seller_tabs" options={{ headerShown: false }} />
          <Stack.Screen name="seller_auth" options={{ headerShown: false }} />
          <Stack.Screen name="notification" options={{ headerShown: false }} />
          <Stack.Screen
            name="create_property"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="profile_management"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="payment_post" options={{ headerShown: false }} />
          <Stack.Screen name="boost_payment" options={{ headerShown: false }} />
          <Stack.Screen name="edit_property" options={{ headerShown: false }} />
          <Stack.Screen
            name="payment_success"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="payment-webview"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="transaction_history"
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen name="map_component" options={{ headerShown: false }} /> */}
        </Stack>
        <ToastProvider />
      </I18nextProvider>
    </Provider>
  );
});

export default _layout;
