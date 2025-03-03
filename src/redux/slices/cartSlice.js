import {createSlice} from '@reduxjs/toolkit';
import {
  addTocCart,
  deleteCartItem,
  fetchCart,
  updatequantity,
  deleteAllCartItems,
} from '../actions/actionCart';

const initialState = {
  cart: [],
  cartLength: null,
  isLoading: false,
  isLoadingQuantity: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: state => {
      state.cart = [];
      state.cartLength = 0;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.cartLength = state.cart.length;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.cart = []; // Làm trống giỏ hàng nếu lỗi
        state.cartLength = 0;
        state.error = action.payload || 'Không thể tải giỏ hàng.';
      })      
      .addCase(addTocCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTocCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart.push(action.payload);
        state.error = null;
      })
      .addCase(addTocCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updatequantity.pending, state => {
        state.isLoadingQuantity = true;
        state.error = null;
      })
      
      .addCase(updatequantity.fulfilled, (state, action) => {
        state.isLoadingQuantity = false;
        const updatedCart = state.cart.map(item =>
          item._id === action.payload._id
            ? {...item, quantity: action.payload.quantity}
            : item,
        );
        state.cart = updatedCart;
        state.error = null;
      })
      .addCase(updatequantity.rejected, (state, action) => {
        state.isLoadingQuantity = false;
        state.error = action.error.message;
      })
      .addCase(deleteCartItem.pending, state => {
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cart = state.cart.filter(cart => cart._id !== action.payload);
        state.cartLength = state.cart.length;
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoadingQuantity = false;
        state.error = action.error.message;
      })
      .addCase(deleteAllCartItems.pending, state => {
        state.error = null;
      })
      .addCase(deleteAllCartItems.fulfilled, state => {
        state.cart = [];
        state.cartLength = 0;
        state.error = null;
      })
      .addCase(deleteAllCartItems.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
