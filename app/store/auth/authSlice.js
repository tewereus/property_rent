import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const loadUser = createAsyncThunk("auth/loadUser", async () => {
  const userData = await AsyncStorage.getItem("user");
  return userData ? JSON.parse(userData) : null; // Parse and return user data or null
});

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    return await authService.login(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      return await authService.register(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const toggleDarkMode = createAsyncThunk(
  "user/dark-mode",
  async (data, thunkAPI) => {
    try {
      return await authService.toggleDarkMode(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      AsyncStorage.removeItem("user");
    },
    resetAuthState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSuccess = true;
        // console.log("load user: ", state.user);
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "error";
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.user = action.payload;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "error";
      })
      .addCase(toggleDarkMode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleDarkMode.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isError = false;
        // state.isSuccess = true;
        // state.message = "mode changed successfully";
        if (action.payload.preference) {
          state.user.preference.mode = action.payload.preference.mode;
        }
      })
      .addCase(toggleDarkMode.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message;
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
