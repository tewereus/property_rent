import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import propertyTypeReducer from "./propertyType/propertyTypeSlice";
import propertyReducer from "./property/propertySlice";
import addressReducer from "./address/addressSlice";
import paymentReducer from "./payment/paymentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    propertyType: propertyTypeReducer,
    property: propertyReducer,
    address: addressReducer,
    payment: paymentReducer,
  },
});
