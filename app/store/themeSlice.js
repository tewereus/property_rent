import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: "light" },
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      const newMode = state.mode === "light" ? "dark" : "light";
      state.mode = newMode;
      AsyncStorage.setItem("theme", newMode); // Save to local storage
    },
  },
});

// Load theme from AsyncStorage
export const loadThemeFromStorage = () => async (dispatch) => {
  const storedTheme = await AsyncStorage.getItem("theme");
  if (storedTheme) {
    dispatch(setTheme(storedTheme));
  }
};

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
