import {createSlice} from '@reduxjs/toolkit';
import {
  createOrder,
  fetchOrdersByStatus,
  fetchOrderDetails,
  fetchPurchasedProducts,
  cancelOrder,
  fetchOrderPaymentStatus,
  fetchOrders
} from '../actions/actionOder';

const initialState = {
  oderTotal:[],
  orders: [],
  orderDetails: [],
  purchasedProducts: [],
  paymentStatus: null,
  isLoading: false,
  error: null,
  isLoadingOrderDetails: false, // Loading riêng cho orderDetails
  isLoadingPaymentStatus: false, // Loading riêng cho paymentStatus
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createOrder.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload.order);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrdersByStatus.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderDetails.pending, state => {
        state.isLoadingOrderDetails = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isLoadingOrderDetails = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoadingOrderDetails = false;
        state.error = action.payload;
      })
      .addCase(fetchPurchasedProducts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPurchasedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchasedProducts = action.payload;
      })
      .addCase(fetchPurchasedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = state.orders.filter(
          order => order._id !== action.meta.arg.orderId,
        );
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch payment status
      .addCase(fetchOrderPaymentStatus.pending, state => {
        state.isLoadingPaymentStatus = true;
        state.error = null;
      })
      .addCase(fetchOrderPaymentStatus.fulfilled, (state, action) => {
        state.isLoadingPaymentStatus = false;
        state.paymentStatus = action.payload;
      })
      .addCase(fetchOrderPaymentStatus.rejected, (state, action) => {
        state.isLoadingPaymentStatus = false;
        state.error = action.payload;
      })

      .addCase(fetchOrders.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.oderTotal = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
