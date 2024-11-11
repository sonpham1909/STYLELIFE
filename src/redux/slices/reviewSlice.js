// redux/slices/reviewSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchProductReviewResponses } from '../actions/actionsReview'; // Đảm bảo đường dẫn chính xác

// Khởi tạo state ban đầu
const initialState = {
  reviewResponses: {}, // Lưu trữ danh sách đánh giá và phản hồi cho mỗi sản phẩm
  isLoading: false,
  error: null,
};

// Tạo reviewResponsesSlice để quản lý state của đánh giá và phản hồi
const reviewResponsesSlice = createSlice({
  name: 'reviewResponses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviewResponses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductReviewResponses.fulfilled, (state, action) => {
        state.isLoading = false;
        const { productId, reviews } = action.payload;
        state.reviewResponses[productId] = reviews; // Lưu đánh giá và phản hồi theo productId
      })
      .addCase(fetchProductReviewResponses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default reviewResponsesSlice.reducer;