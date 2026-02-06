import { orderBurgerApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';
import { RootState } from './store';

interface OrdersState {
  loading: boolean;
  error: string | null;
  listOrder: TOrder[];
  targetOrder: TOrder | null;
}

export const initialOrders: OrdersState = {
  loading: false,
  error: null,
  listOrder: [],
  targetOrder: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialOrders,
  reducers: {
    clearTargetOrder(state) {
      state.targetOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.targetOrder = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? (action.error.message as string)
          : 'failed';
      });
  }
});

export const { clearTargetOrder } = ordersSlice.actions;

export const selectUserOrders = (state: RootState) => state.orders.listOrder;
export const selecTargetOrder = (state: RootState) => state.orders.targetOrder;
export const selecLoadingOrder = (state: RootState) => state.orders.loading;
