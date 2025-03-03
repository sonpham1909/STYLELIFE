import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import tokenService from '../../services/tokenService';

// URL API
import { API_URL } from '@env';

// Lấy tất cả phản hồi của một tin nhắn
export const fetchRepliesByMessage = createAsyncThunk(
  'replies/fetchRepliesByMessage',
  async (messageId, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const response = await axios.get(`${API_URL}/reply/messages/${messageId}/replies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Replies fetched:', response.data); // Kiểm tra cấu trúc dữ liệu
      return { messageId, replies: response.data }; // Trả về object với messageId và danh sách phản hồi
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message,
      );
    }
  },
);

// Lấy tin nhắn theo ID
export const fetchMessageById = createAsyncThunk(
  'messages/fetchMessageById',
  async (_, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const response = await axios.get(`${API_URL}/message/messages/getmessageByuserid`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Trả về dữ liệu tin nhắn
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message,
      );
    }
  },
);

// Tạo tin nhắn mới
export const createMessage = createAsyncThunk(
  'messages/createMessage',
  async (messageData, thunkAPI) => {
    try {
      const token = await tokenService.getToken();
      const response = await axios.post(`${API_URL}/message/messages`, messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Trả về dữ liệu tin nhắn đã tạo
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : error.message,
      );
    }
  },
);
