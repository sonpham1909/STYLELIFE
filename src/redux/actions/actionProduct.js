// redux/actions/productActions.js
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import tokenService from '../../services/tokenService';

import {API_URL} from '@env';

// Action để lấy đánh giá và điểm trung bình cho một sản phẩm
export const fetchProductReviews = createAsyncThunk(
  'products/fetchProductReviews',
  async (productId, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const response = await axios.get(
        `${API_URL}/products/reviews/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return {
        productId,
        totalReviews: response.data.totalReviews,
        averageRating: response.data.averageRating,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message,
      );
    }
  },
);

// Action để lấy danh sách sản phẩm mới nhất
export const fetchLatestProducts = createAsyncThunk(
  'products/fetchLatestProducts',
  async (_, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const response = await axios.get(`${API_URL}/products/latest`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message,
      );
    }
  },
);

export const fetchPopularProducts = createAsyncThunk(
  'products/fetchPopularProducts',
  async (_, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const response = await axios.get(`${API_URL}/products/popular`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message,
      );
    }
  },
);

export const fetchProductsByVariant = createAsyncThunk(
  'products/fetchProductsByVariant',
  async ({subCategoryId, size, color_code, minPrice, maxPrice}, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const params = {
        sub_category_id: subCategoryId,
        size,
        color_code,
        minPrice,
        maxPrice,
      };

      const response = await axios.get(`${API_URL}/products/by-variant`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message,
      );
    }
  },

 
);

export const fetchtProductById1 = createAsyncThunk(
  'products/fetchtProductById',
  async (productId, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const response = await axios.get(`${API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message,
      );
    }
  },
);


export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const response = await axios.get(`${API_URL}/products/${productId}/by-id`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        productId,
        productDetails: response.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const searchProduct = createAsyncThunk(
  'products/searchProduct',
  async (keyword, thunkAPI) => {
    try {

      console.log(keyword);
      
      const token = await tokenService.getToken();
      const response = await axios.get(`${API_URL}/products/search_similar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          keyword: keyword,
        },
      });
      return response.data
      console.log(response.data);
      
      
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);
