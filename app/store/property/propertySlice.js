import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyService from "./propertyService";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
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

export const buyProperty = createAsyncThunk(
  "property/buy",
  async (propertyId, thunkAPI) => {
    try {
      return await propertyService.buyProperty(propertyId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const propertySlice = createSlice({
  name: "property",
  initialState: {
    ...initialState,
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
        state.userProperties = action.payload;
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
      });
  },
});

export const { resetAuthState } = propertySlice.actions;
export default propertySlice.reducer;
