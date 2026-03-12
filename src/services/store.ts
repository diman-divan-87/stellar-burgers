import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { loginUserAppSlice } from './auth/loginUser';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsSlice } from './ingredients/ingredients';
import { burgerConstructorSlice } from './burger-constructor/burger-constructor';
import { feedSlice } from './feeds/feeds';
import { ordersSlice } from './orders/orders';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  getIngredients: burgerConstructorSlice.reducer,
  feeds: feedSlice.reducer,
  loginUser: loginUserAppSlice.reducer,
  orders: ordersSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
