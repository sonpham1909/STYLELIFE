// Redux action for initiating MoMo payment
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@env';
import tokenService from '../../services/tokenService';

export const initiateMoMoPayment = createAsyncThunk(
    'payment/initiateMoMoPayment',
    async ({ orderId, amount }, thunkAPI) => {
      try {
        const token = await tokenService.getToken();
        const response = await axios.post(
          `${API_URL}/Payment_Momo/CreateMomo_Byapp`,
          { orderId, amount },
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
  