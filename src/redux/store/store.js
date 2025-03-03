import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import categoryReducer from '../slices/categorySlice';
import productReducer from '../slices/productSlice';
import favoriteReducer from '../slices/favoriteSlice';
import reviewResponsesReducer from '../slices/reviewSlice';
import variantReducer from '../slices/variantSlice';
import addressReducer from '../slices/addressSlice';
import cartReducer from '../slices/cartSlice';
import shippingReducer from '../slices/shippingSlice';
import paymentReducer from '../slices/paymentSlice';
import oderReducer from '../slices/oderSlice';

import searchReducer from '../slices/searchSlice';

import momoPaymentReducer from '../slices/paymentmomoSlice'; // sửa tên để nhất quán
import messageRepliesReducer from '../slices/messageSlice';
import notificationReducer from '../slices/notificationSlice'


const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoryReducer,
    products: productReducer,
    favorites: favoriteReducer,
    reviewResponses: reviewResponsesReducer,
    variants: variantReducer,
    addresses: addressReducer,
    cart: cartReducer,
    shipping: shippingReducer,  // Thêm reducer này
    payment: paymentReducer,  // Thêm reducer này
    order: oderReducer,  // Thêm reducer này

    search: searchReducer,


    momoPayment: momoPaymentReducer, // đổi tên từ `momoPaymentUrl`
    messageReplies: messageRepliesReducer,  // Đảm bảo tên này đồng nhất
    notification:notificationReducer

  },
});

export default store;
