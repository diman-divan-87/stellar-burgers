import { TOrder } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { RootState } from './store';

export interface FeedsState {
  isLoading: boolean;
  orders: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
  error: string | null;
}

const initialState: FeedsState = {
  isLoading: false,
  orders: [],
  feed: {
    total: 0,
    totalToday: 0
  },
  error: null
};

export const getFeeds = createAsyncThunk('feed/get-feeds', getFeedsApi);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message as string;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
        state.error = null;
      });
  },
  selectors: {
    feedStateSelector: (state) => state,
    feedDataSelector: (state) => state.orders,
    feedTotalSelector: (state) => state.feed.total,
    feedTotalTodaySelector: (state) => state.feed.totalToday
  }
});

export const {} = feedSlice.actions;

export const selectFeedsIsLoading = (state: RootState) => state.feeds.isLoading;
export const selectFeedsOrders = (state: RootState) => state.feeds.orders;
export const selectFeedsfeed = (state: RootState) => state.feeds.feed;
export const selectFeedsError = (state: RootState) => state.feeds.error;
