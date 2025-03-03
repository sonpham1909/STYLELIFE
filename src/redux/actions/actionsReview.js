// redux/actions/reviewActions.js
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import tokenService from '../../services/tokenService';

// URL API
import {API_URL} from '@env';

export const fetchProductReviewResponses = createAsyncThunk(
  'reviewResponses/fetchProductReviewResponses',
  async (productId, thunkAPI) => {
    try {
      const token = await tokenService.getToken();

      const response = await axios.get(
        `${API_URL}/Review/product/${productId}/reviews_with_responses`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return {productId, reviews: response.data};
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message,
      );
    }
  },
);

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async (_, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      if (!token) {
        throw new Error("User token is not available or has expired.");
      }

      const response = await axios.get(`${API_URL}/Review/reviews_ByUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);
export const addProductReview = createAsyncThunk(
  'reviews/addProductReview',
    async (reviewData, thunkAPI) => {
      try {
        const token = await tokenService.getToken();
        const response = await axios.post(`${API_URL}/Review/addReviewByApp`, reviewData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response ? error.response.data.message : error.message
        );
      }
    }
  );