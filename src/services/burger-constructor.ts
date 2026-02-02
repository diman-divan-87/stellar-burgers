import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 } from 'uuid';

interface BurgerConstructorState {
  ingredientsArr: TConstructorIngredient[]; // выбранные ингридиенты
  bun: TConstructorIngredient | null;
}

export const initialConstructor: BurgerConstructorState = {
  ingredientsArr: [],
  bun: null
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialConstructor,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredientsArr.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const key = v4();
        return { payload: { ...ingredient, id: key } };
      }
    },
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredientsArr = state.ingredientsArr.filter(
        (b) => b.id !== action.payload
      );
    }
  }
});

export const { addIngredient } = burgerConstructorSlice.actions;
export const { addBun } = burgerConstructorSlice.actions;

// Функции для получения конкретных частей состояния из Redux store.
export const getIngredients = (state: RootState) =>
  state.getIngredients.ingredientsArr;
export const getBun = (state: RootState) => state.getIngredients.bun;
