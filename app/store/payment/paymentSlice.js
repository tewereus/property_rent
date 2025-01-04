import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "./paymentService";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  paymentUrl: null,
  verificationStatus: null,
};

export const initializePayment = createAsyncThunk(
  "payment/initialize",
  async (data, thunkAPI) => {
    try {
      return await paymentService.initializePayment(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (reference, thunkAPI) => {
    try {
      return await paymentService.verifyPayment(reference);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializePayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.paymentUrl = action.payload.paymentUrl;
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Payment initialization failed";
      })
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.verificationStatus = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Payment verification failed";
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
