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

export const updateUser = createAsyncThunk(
  "auth/update-user",
  async (data, thunkAPI) => {
    try {
      return await authService.updateUser(data);
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

export const verifySeller = createAsyncThunk(
  "user/verify-seller",
  async (thunkAPI) => {
    try {
      return await authService.verifySeller();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "user/add-wishlist",
  async (data, thunkAPI) => {
    try {
      return await authService.addToWishlist(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getWishlists = createAsyncThunk(
  "user/all-wishlists",
  async (thunkAPI) => {
    try {
      return await authService.getWishlists();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const changeMode = createAsyncThunk(
  "user/change-mode",
  async (data, thunkAPI) => {
    try {
      return await authService.changeMode(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const changeLanguageMode = createAsyncThunk(
  "user/change-language",
  async (data, thunkAPI) => {
    try {
      return await authService.changeLanguageMode(data);
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
        state.message = "Logged in Successfully";
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
        state.message = "Registered Successfully";
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "error";
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "updated Successfully";
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state) => {
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
      })
      .addCase(verifySeller.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifySeller.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isError = false;
        // state.isSuccess = true;
        // state.message = "Seller Verified Successfully";
        // console.log("output:", action.payload.seller_tab);
        if (action.payload.seller_tab) {
          state.user.seller_tab = action.payload.seller_tab;
        }
        console.log(state.user);
      })
      .addCase(verifySeller.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "wishlist modified successfully";
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message;
      })
      .addCase(getWishlists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWishlists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        // state.isSuccess = true;
        state.message = "success";
        state.wishlist = action.payload;
      })
      .addCase(getWishlists.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message;
      })
      .addCase(changeMode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeMode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "success";
        state.mode = action.payload;
        console.log(state.mode);
      })
      .addCase(changeMode.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message;
      })
      .addCase(changeLanguageMode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeLanguageMode.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isError = false;
        // state.isSuccess = true;
        // state.message = "mode changed successfully";
        if (action.payload.preference) {
          state.user.preference.language = action.payload.preference.language;
        }
      })
      .addCase(changeLanguageMode.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error.message;
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
