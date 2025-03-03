import {createSlice} from '@reduxjs/toolkit';
import { addSearch, deleteAllSearchTerm, deleteSearchTerm, fetchSearchHistories } from '../actions/actionSearch';


const initialState = {
  searchHistories: [],
  isLoading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'searchHistories',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchSearchHistories.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchSearchHistories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchHistories = action.payload;
      
      })
      .addCase(fetchSearchHistories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteSearchTerm.pending, state => {
        state.error = null;
      })
      .addCase(deleteSearchTerm.fulfilled, (state, action) => {
        state.searchHistories = state.searchHistories.filter(search => search._id !== action.payload);
        
        state.error = null;
      })
      .addCase(deleteSearchTerm.rejected, (state, action) => {
        
        state.error = action.error.message;
      })
      .addCase(addSearch.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchHistories.push(action.payload);
        state.error = null;
      })
      .addCase(addSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteAllSearchTerm.pending, state => {
        state.error = null;
      })
      .addCase(deleteAllSearchTerm.fulfilled, state => {
        state.searchHistories = [];
       
        state.error = null;
      })
      .addCase(deleteAllSearchTerm.rejected, (state, action) => {
        state.error = action.error.message;
      });
      
  },
});

export default searchSlice.reducer;
