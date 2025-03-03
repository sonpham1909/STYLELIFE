// Redux: actionOrder.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@env';
import tokenService from '../../services/tokenService';

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const response = await axios.get(`${API_URL}/orders/get_oder_byuser`, {
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


export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const response = await axios.post(`${API_URL}/orders/create_order_ByApp`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message
      );
    }
  }
);

export const fetchOrdersByStatus = createAsyncThunk(
    'order/fetchOrdersByStatus',
    async (status, thunkAPI) => {
      try {
        const token = await tokenService.getToken();
        const response = await axios.get(`${API_URL}/orders/status/${status}`, {
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

  export const fetchOrderDetails = createAsyncThunk(
    'order/fetchOrderDetails',
    async (orderId, thunkAPI) => {
      try {
        const token = await tokenService.getToken();
        const response = await axios.get(`${API_URL}/orders/${orderId}/byOrder`, {
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
  export const fetchPurchasedProducts = createAsyncThunk(
    'order/fetchPurchasedProducts',
    async (_, thunkAPI) => {
      try {
        const token = await tokenService.getToken();
        const response = await axios.get(`${API_URL}/orders/purchased`, {
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

  export const fetchOrderPaymentStatus = createAsyncThunk(
    'order/fetchOrderPaymentStatus',
    async (orderId, thunkAPI) => {
        try {
            const token = await tokenService.getToken();
            const response = await axios.get(`${API_URL}/orders/${orderId}/statusPayment`, {
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


  export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async ({ orderId, cancelReason }, thunkAPI) => {
      try {
        const token = await tokenService.getToken();
        const response = await axios.post(`${API_URL}/orders/cancelByApp/${orderId}`, { cancelReason }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return { orderId, ...response.data };
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response ? error.response.data.message : error.message
        );
      }
    }
  );
  
  

  

  