import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';
import { RootState } from './store';

interface OrdersState {
  loading: boolean;
  error: string | null;
  listOrder: TOrder[];
  targetOrder: TOrder | null;
  selectOrderByNumber: TOrder | null;
}

export const initialOrders: OrdersState = {
  loading: false,
  error: null,
  listOrder: [],
  targetOrder: null,
  selectOrderByNumber: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res;
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async () => {
    const res = await getOrdersApi();
    return res;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
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
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.selectOrderByNumber = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? (action.error.message as string)
          : 'failed';
      })
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
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.listOrder = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? (action.error.message as string)
          : 'Unknown error';
      });
  }
});

export const { clearTargetOrder } = ordersSlice.actions;

export const selectUserOrders = (state: RootState) => state.orders.listOrder;
export const selectOrderByNumber = (state: RootState) =>
  state.orders.selectOrderByNumber;
export const selecTargetOrder = (state: RootState) => state.orders.targetOrder;
export const selecLoadingOrder = (state: RootState) => state.orders.loading;
