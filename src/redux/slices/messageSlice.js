import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRepliesByMessage,
  fetchMessageById,
  createMessage,
} from '../actions/actionMessage';

// Khởi tạo state ban đầu
const initialState = {
  userMessages: [], // Lưu trữ danh sách tin nhắn của người dùng
  messageReplies: {}, // Lưu trữ danh sách phản hồi cho mỗi tin nhắn
  isLoading: false,
  error: null,
};

// Tạo messageRepliesSlice để quản lý state của tin nhắn và phản hồi
const messageRepliesSlice = createSlice({
  name: 'messageReplies',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Xử lý lấy phản hồi của tin nhắn
      .addCase(fetchRepliesByMessage.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRepliesByMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { messageId, replies } = action.payload;
        state.messageReplies[messageId] = replies; // Lưu phản hồi theo messageId
      })
      .addCase(fetchRepliesByMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Xử lý lấy tin nhắn của người dùng
      .addCase(fetchMessageById.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessageById.fulfilled, (state, action) => {
        state.isLoading = false;
        // Kiểm tra và xử lý nếu dữ liệu không phải là mảng
        if (Array.isArray(action.payload)) {
          state.userMessages = action.payload; // Cập nhật danh sách tin nhắn từ API
        } else {
          state.userMessages = []; // Đảm bảo userMessages là một mảng rỗng nếu dữ liệu không hợp lệ
        }
      })
      .addCase(fetchMessageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Xử lý tạo tin nhắn mới
      .addCase(createMessage.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userMessages.push(action.payload); // Thêm tin nhắn mới vào danh sách userMessages
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default messageRepliesSlice.reducer;
