import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import tokenService from '../../services/tokenService';

import {API_URL} from '@env'


export const fetchNotification = createAsyncThunk(
    'order/fetchOrdersByStatus',
    async ( thunkAPI) => {
      try {
        const token = await tokenService.getToken();
        const response = await axios.get(`${API_URL}/notification/getNotificationUser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("notification:: ",response.data);
        return response.data;
       
        
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response ? error.response.data.message : error.message
        );
      }
    }
  );