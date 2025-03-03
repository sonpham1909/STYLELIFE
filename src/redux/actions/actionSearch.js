import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import tokenService from '../../services/tokenService';

import {API_URL} from '@env';

// Action để lấy đánh giá và điểm trung bình cho một sản phẩm
export const fetchSearchHistories = createAsyncThunk(
  'search/fetchSearchHistories',
  async (thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const response = await axios.get(
        `${API_URL}/search/getHistoryUser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message,
      );
    }
  },
);

export const deleteSearchTerm = createAsyncThunk(
    'search/deleteSearchTerm',
    async (searchId,thunkAPI) => {
      try {
        const token = await tokenService.getToken();
        const response = await axios.delete(
          `${API_URL}/search/deleteSearch/${searchId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
  
        return response.data;
  
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response ? error.response.data.message : error.message,
        );
      }
    },
  );

  export const deleteAllSearchTerm = createAsyncThunk(
    'search/deleteAllSearchTerm',
    async (thunkAPI) => {
      try {
        const token = await tokenService.getToken();
        const response = await axios.delete(
          `${API_URL}/search/deleteAllSearch`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
  
        return response.data;
  
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response ? error.response.data.message : error.message,
        );
      }
    },
  );
  
  export const addSearch = createAsyncThunk(
    'search/addSearch',
    async (searchTerm,thunkAPI) => {
      try {
        const token = await tokenService.getToken();
        const response = await axios.post(
          `${API_URL}/search/search`,{searchTerm:searchTerm},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
  
        return response.data;
  
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response ? error.response.data.message : error.message,
        );
      }
    },
  );
