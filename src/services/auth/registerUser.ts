import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUserApi, TRegisterData } from '../../utils/burger-api';
import { TUser } from '@utils-types';

export const registerUserApp = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    return res.user;
  }
);

type TUserState = {
  isRegisterChecked: boolean;
  user: TUser | null;
  loading: boolean;
  error: string | null;
};

export const initialState: TUserState = {
  isRegisterChecked: true,
  user: null,
  loading: false,
  error: null
};

export const registerUserAppSlice = createSlice({
  name: 'registerUserApp',
  initialState,
  reducers: {
    resetErr: (state) => {
      state.error = '';
    },
    resetRegisterChecked: (state) => {
      state.isRegisterChecked = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserApp.pending, (state) => {
        state.loading = true;
        state.isRegisterChecked = false;
        state.error = null;
      })
      .addCase(registerUserApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
        state.isRegisterChecked = true;
      })
      .addCase(registerUserApp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isRegisterChecked = false;
      });
  }
});
export const { resetRegisterChecked } = registerUserAppSlice.actions;

export const userReducer = registerUserAppSlice.reducer;
