import { loginUserApi, TLoginData, getUserApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser | null;
  loading: boolean;
  error: string | null;
};

export const initialState: TUserState = {
  user: null,
  loading: false,
  error: null
};

export const loginUserApp = createAsyncThunk(
  'auth/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    if (res.refreshToken)
      localStorage.setItem('refreshToken', res.refreshToken);
    if (res.accessToken) setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const fetchUserApp = createAsyncThunk(
  'auth/user',
  async () => {
    const data = await getUserApi();
    return data.user;
  }
);

export const loginUserAppSlice = createSlice({
  name: 'loginUserApp',
  initialState,
  reducers: {
    resetErr: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserApp.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.loading = false;
          state.user = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchUserApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? (action.error.message as string)
          : 'Login failed';
      })
      .addCase(loginUserApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUserApp.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.loading = false;
          state.user = action.payload;
          state.error = null;
        }
      )
      .addCase(loginUserApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? (action.error.message as string)
          : 'Login failed';
      });
  }
});

export const { resetErr } = loginUserAppSlice.actions;
export const userReducer = loginUserAppSlice.reducer;
