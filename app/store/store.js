import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import propertyTypeReducer from "./propertyType/propertyTypeSlice";
import propertyReducer from "./property/propertySlice";
// import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // theme: themeReducer,
    propertyType: propertyTypeReducer,
    property: propertyReducer,
  },
});
