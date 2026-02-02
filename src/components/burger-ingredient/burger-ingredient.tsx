import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredients,
  addIngredient
} from '../../services/burger-constructor';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const selectedIngredients = useSelector(getIngredients);
    // TODO удалить
    console.log('selectedIngredients = ', selectedIngredients);
    const location = useLocation();
    const dispatch = useDispatch();
    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
