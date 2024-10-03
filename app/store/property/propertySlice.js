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

// export const getAllPropertyTypes = createAsyncThunk(
//   "property/all-properties",
//   async (data, thunkAPI) => {
//     try {
//       return propertyService.getAllPropertyTypes();
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

export const propertyTypeSlice = createSlice({
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
        state.message = "success";
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllPropertyTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPropertyTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "success";
        state.propertyTypes = action.payload;
      })
      .addCase(getAllPropertyTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetAuthState } = propertyTypeSlice.actions;
export default propertyTypeSlice.reducer;
