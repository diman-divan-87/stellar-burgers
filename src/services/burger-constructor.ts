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
    addAllingredientsArr: (
      state,
      action: PayloadAction<TConstructorIngredient[]>
    ) => {
      state.ingredientsArr = action.payload;
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const item = state.ingredientsArr.splice(from, 1)[0];
      state.ingredientsArr.splice(to, 0, item);
    },
    clearBurgerConstructor(state) {
      state.ingredientsArr = [];
    }
  }
});

export const { addIngredient } = burgerConstructorSlice.actions;
export const { addBun } = burgerConstructorSlice.actions;
export const { addAllingredientsArr } = burgerConstructorSlice.actions;
export const { moveIngredient } = burgerConstructorSlice.actions;
export const { clearBurgerConstructor } = burgerConstructorSlice.actions;

// Функции для получения конкретных частей состояния из Redux store.
export const getIngredients = (state: RootState) =>
  state.getIngredients.ingredientsArr;
export const getBun = (state: RootState) => state.getIngredients.bun;
