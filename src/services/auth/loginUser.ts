import {
  loginUserApi,
  registerUserApi,
  TLoginData,
  getUserApi,
  logoutApi,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getCookie, setCookie } from '../../utils/cookie';
import { RootState } from '../store';

type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  loading: boolean;
  error: string | null;
};

export const initialState: TUserState = {
  isAuthChecked: false,
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

export const fetchUserApp = createAsyncThunk('user/getUser', async () => {
  const data = await getUserApi();
  return data.user;
});

export const logoutUserApp = createAsyncThunk('auth/logout', async () => {
  const res = await logoutApi();
  localStorage.removeItem('refreshToken');
  setCookie('accessToken', '');
  return res;
});

export const updateUserApp = createAsyncThunk(
  'auth/updateUser',
  async (data: TRegisterData) => {
    const res = await updateUserApi(data);
    return res;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    const token = getCookie('accessToken');
    if (token) {
      await dispatch(fetchUserApp()).finally(() => {
        dispatch(loginUserAppSlice.actions.authChecked());
      });
    } else {
      dispatch(loginUserAppSlice.actions.authChecked());
    }
  }
);

export const loginUserAppSlice = createSlice({
  name: 'loginUser',
  initialState,
  reducers: {
    resetErr: (state) => {
      state.error = null;
    },
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    resetRegisterChecked: (state) => {
      state.isAuthChecked = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUserApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserApp.fulfilled, (state) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(logoutUserApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? (action.error.message as string)
          : 'Logout failed';
      })
      .addCase(updateUserApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(updateUserApp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUserApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserApp.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.loading = false;
          state.isAuthChecked = true;
          state.user = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchUserApp.rejected, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.error = action.payload
          ? (action.error.message as string)
          : 'Login failed';
      })
      .addCase(registerUserApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(registerUserApp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })

      .addCase(loginUserApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUserApp.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.loading = false;
          state.isAuthChecked = true;
          state.user = action.payload;
          state.error = null;
        }
      )
      .addCase(loginUserApp.rejected, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.error = action.payload
          ? (action.error.message as string)
          : 'Login failed';
      });
  }
});

export const isAuthChecked = (state: RootState) =>
  state.loginUser.isAuthChecked;
export const selectUserAuthLoading = (state: RootState) =>
  state.loginUser.loading;
export const selectUser = (state: RootState) => state.loginUser.user;
export const { resetRegisterChecked } = loginUserAppSlice.actions;
export const { resetErr } = loginUserAppSlice.actions;

export const userReducer = loginUserAppSlice.reducer;
