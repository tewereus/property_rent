import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import addressService from "./addressService";
// import toast from "react-hot-toast";

const initialState = {
  locations: [],
  regions: [],
  subregions: [],
  totalLocations: 0,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getAllLocations = createAsyncThunk(
  "address/all-location",
  async (thunkAPI) => {
    try {
      return await addressService.getAllLocations();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllRegions = createAsyncThunk(
  "address/all-region",
  async (thunkAPI) => {
    try {
      return await addressService.getAllRegions();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllSubRegions = createAsyncThunk(
  "address/all-subregion",
  async (thunkAPI) => {
    try {
      return await addressService.getAllSubRegions();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: [],
  extraReducers: (builder) => {
    builder
      .addCase(getAllLocations.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "";
        state.locations = action.payload;
      })
      .addCase(getAllLocations.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error;
      })
      .addCase(getAllRegions.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllRegions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "";
        state.regions = action.payload;
      })
      .addCase(getAllRegions.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error;
      })
      .addCase(getAllSubRegions.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllSubRegions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "";
        state.subregions = action.payload;
      })
      .addCase(getAllSubRegions.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.error;
      });
  },
});

export default addressSlice.reducer;
