// redux/slices/favoriteSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toggleFavorite, fetchFavoriteList } from '../actions/actionFavorite';

const initialState = {
  favoriteList: [], // Lưu danh sách productId để dễ kiểm tra
  isLoading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoriteList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFavoriteList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteList = action.payload;
      })
      .addCase(fetchFavoriteList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavorite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteList = action.payload; // Cập nhật danh sách yêu thích
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default favoriteSlice.reducer;