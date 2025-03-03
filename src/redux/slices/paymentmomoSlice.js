import { createSlice } from '@reduxjs/toolkit';
import { initiateMoMoPayment } from '../actions/actionPaymentMomo';

const initialState = {
  momoPaymentUrl: null,
  isLoading: false,
  error: null,
};

const momoPaymentSlice = createSlice({
  name: 'momoPayment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initiateMoMoPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initiateMoMoPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.momoPaymentUrl = action.payload.payUrl;
      })
      .addCase(initiateMoMoPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default momoPaymentSlice.reducer;
