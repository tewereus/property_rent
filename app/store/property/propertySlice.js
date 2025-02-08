import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyService from "./propertyService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  transactions: [],
};

// export const createProperty = createAsyncThunk(
//   "property/create-property",
//   async (data, thunkAPI) => {
//     try {
//       return propertyService.createProperty(data);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

export const createProperty = createAsyncThunk(
  "properties/create",
  async (propertyData, thunkAPI) => {
    try {
      // const token = thunkAPI.getState().auth.user.token;
      return await propertyService.createProperty(propertyData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getAllProperties = createAsyncThunk(
  "property/all-properties",
  async (data, thunkAPI) => {
    try {
      return propertyService.getAllProperties(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getPropertiesByUse = createAsyncThunk(
  "property/by-use",
  async (use, thunkAPI) => {
    try {
      return await propertyService.getPropertiesByUse(use);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserProperties = createAsyncThunk(
  "property/users-properties",
  async (thunkAPI) => {
    try {
      return propertyService.getUserProperties();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateProperty = createAsyncThunk(
  "property/update",
  async (propertyData, thunkAPI) => {
    try {
      return await propertyService.updateProperty(propertyData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const buyProperty = createAsyncThunk(
  "property/buy",
  async (propertyData, thunkAPI) => {
    try {
      return await propertyService.buyProperty(propertyData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Failed to purchase property";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserTransactions = createAsyncThunk(
  "property/transactions",
  async (_, thunkAPI) => {
    try {
      return await propertyService.getUserTransactions();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const changeView = createAsyncThunk(
  "property/change-view",
  async (data, thunkAPI) => {
    try {
      return await propertyService.changeView(data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllViews = createAsyncThunk(
  "property/all-views",
  async (_, thunkAPI) => {
    try {
      return await propertyService.getAllViews();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const changeFeatured = createAsyncThunk(
  "property/change-featured",
  async (data, thunkAPI) => {
    try {
      return await propertyService.changeFeatured(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getRejectionMessages = createAsyncThunk(
  "property/reject-message",
  async (_, thunkAPI) => {
    try {
      return await propertyService.getRejectionMessages();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllFeatured = createAsyncThunk(
  "property/featured",
  async (_, thunkAPI) => {
    try {
      return await propertyService.getAllFeatured();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const propertySlice = createSlice({
  name: "property",
  initialState: {
    ...initialState,
    featuredProperties: [],
    propertiesByUse: {
      sell: [],
      rent: [],
    },
  },
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
        state.message = "Property Added Successfully";
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        console.log("error: ", action.payload);
      })
      .addCase(getUserProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "success";
        state.userProperties = {
          properties: action.payload.properties,
          totalProperties: action.payload.totalProperties,
          totalViews: action.payload.totalViews,
          activeProperties: action.payload.activeProperties,
          totalFavorites: action.payload.totalFavorites,
        };
      })
      .addCase(getUserProperties.rejected, (state, action) => {
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
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Property updated successfully";
        // Update the property in the list
        state.userProperties.properties = state.userProperties.properties.map(
          (prop) => (prop._id === action.payload._id ? action.payload : prop)
        );
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPropertiesByUse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPropertiesByUse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        const use = action.meta.arg;
        state.propertiesByUse[use] = action.payload;
      })
      .addCase(getPropertiesByUse.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(buyProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(buyProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Property purchased successfully";

        // Update the property in the state
        const updatedProperty = action.payload.property;
        state.propertiesByUse = {
          ...state.propertiesByUse,
          sell: state.propertiesByUse.sell.map((prop) =>
            prop._id === updatedProperty._id ? updatedProperty : prop
          ),
          rent: state.propertiesByUse.rent.map((prop) =>
            prop._id === updatedProperty._id ? updatedProperty : prop
          ),
        };
      })
      .addCase(buyProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getUserTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.transactions = action.payload;
      })
      .addCase(getUserTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(changeView.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeView.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.viewCount = action.payload;
      })
      .addCase(changeView.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to update view";
      })
      .addCase(getAllViews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllViews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.views = action.payload;
      })
      .addCase(getAllViews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(changeFeatured.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeFeatured.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(changeFeatured.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllFeatured.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllFeatured.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.featuredProperties = action.payload;
      })
      .addCase(getAllFeatured.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRejectionMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRejectionMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rejectedMessage = action.payload;
        console.log(action.payload);
      })
      .addCase(getRejectionMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetAuthState } = propertySlice.actions;
export default propertySlice.reducer;
