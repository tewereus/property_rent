import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyService from "./propertyService";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const createProperty = createAsyncThunk(
  "property/create-property",
  async (data, thunkAPI) => {
    try {
      return propertyService.createProperty(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllProperties = createAsyncThunk(
  "property/all-properties",
  async (thunkAPI) => {
    try {
      return propertyService.getAllProperties();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllSellProperties = createAsyncThunk(
  "property/all-sell-properties",
  async (thunkAPI) => {
    try {
      return propertyService.getAllSellProperties();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllRentProperties = createAsyncThunk(
  "property/all-rent-properties",
  async (thunkAPI) => {
    try {
      return propertyService.getAllRentProperties();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllUsersProperties = createAsyncThunk(
  "property/users-properties",
  async (thunkAPI) => {
    try {
      return propertyService.getAllUsersProperties();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProperty.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "property added successfully";
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllUsersProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsersProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "success";
        state.userProperties = action.payload;
      })
      .addCase(getAllUsersProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "success";
        state.properties = action.payload;
      })
      .addCase(getAllProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllSellProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSellProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "success";
        state.sellProperties = action.payload;
      })
      .addCase(getAllSellProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllRentProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRentProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "success";
        state.rentProperties = action.payload;
      })
      .addCase(getAllRentProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetAuthState } = propertySlice.actions;
export default propertySlice.reducer;
