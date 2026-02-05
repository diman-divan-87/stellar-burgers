import {
  loginUserApi,
  registerUserApi,
  TLoginData,
  getUserApi,
  logoutApi,
  TRegisterData
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie } from '../../utils/cookie';

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

export const registerUserApp = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    if (res.refreshToken)
      localStorage.setItem('refreshToken', res.refreshToken);
    if (res.accessToken) setCookie('accessToken', res.accessToken);
    return res;
  }
);

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

export const fetchUserApp = createAsyncThunk('auth/user', async () => {
  const data = await getUserApi();
  return data.user;
});

export const logoutUserApp = createAsyncThunk('auth/logout', async () => {
  const res = await logoutApi();
  return res;
});

export const loginUserAppSlice = createSlice({
  name: 'loginUserApp',
  initialState,
  reducers: {
    resetErr: (state) => {
      state.error = null;
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
        state.user = action.payload.user;
        state.isRegisterChecked = false;
      })
      .addCase(logoutUserApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserApp.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUserApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? (action.error.message as string)
          : 'Logout failed';
      })
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

export const { resetRegisterChecked } = loginUserAppSlice.actions;
export const { resetErr } = loginUserAppSlice.actions;
export const userReducer = loginUserAppSlice.reducer;
