import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyTypeService from "./propertyTypeService";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const createPropertyType = createAsyncThunk(
  "property-type/create-type",
  async (data, thunkAPI) => {
    try {
      return propertyTypeService.createPropertyType(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllPropertyTypes = createAsyncThunk(
  "property-type/all-types",
  async (data, thunkAPI) => {
    try {
      return propertyTypeService.getAllPropertyTypes();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const propertyTypeSlice = createSlice({
  name: "propertyType",
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
      .addCase(createPropertyType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPropertyType.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "success";
      })
      .addCase(createPropertyType.rejected, (state, action) => {
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
