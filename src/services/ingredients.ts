import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from './store';

interface IngredientsState {
  data: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: IngredientsState = {
  data: [],
  isLoading: false,
  error: null
};

export const getIngredients = createAsyncThunk(
  'ingredient/get',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    ingredientsStateSelector: (state) => state,
    ingredientsDataSelector: (state) => state.data
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message as string;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      });
  }
});

export const {} = ingredientsSlice.actions;

export const selectIngredients = (state: RootState) => state.ingredients.data;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
