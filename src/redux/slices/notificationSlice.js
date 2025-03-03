import {createSlice} from '@reduxjs/toolkit';
import { fetchNotification } from '../actions/actionNotification';



const initialState = {
  notification: [],
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchNotification.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notification = action.payload;
      
      })
      .addCase(fetchNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
  },
});

export default notificationSlice.reducer;
