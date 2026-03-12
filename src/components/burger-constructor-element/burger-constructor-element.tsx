import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

import { useSelector } from '../../services/store';
import {
  getIngredients,
  moveIngredient
} from '../../services/burger-constructor/burger-constructor';

import { useDispatch } from '../../services/store';
import { addAllingredientsArr } from '../../services/burger-constructor/burger-constructor';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const selectedIngredients = useSelector(getIngredients);

    const handleMoveDown = () => {
      dispatch(
        moveIngredient({
          from: index,
          to: index + 1
        })
      );
    };

    const handleMoveUp = () => {
      dispatch(
        moveIngredient({
          from: index,
          to: index - 1
        })
      );
    };

    const handleClose = () => {
      let arr = [...selectedIngredients];
      arr.splice(index, 1); // удалит
      dispatch(addAllingredientsArr(arr));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
