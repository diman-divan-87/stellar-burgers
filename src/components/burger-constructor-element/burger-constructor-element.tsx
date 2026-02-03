import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/burger-constructor';
import { TConstructorIngredient } from '@utils-types';

import { useDispatch } from '../../services/store';
import { addAllingredientsArr } from '../../services/burger-constructor';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const selectedIngredients = useSelector(getIngredients);

    const handleMoveDown = () => {
      moveElement([...selectedIngredients], index, index + 1);
    };

    const handleMoveUp = () => {
      moveElement([...selectedIngredients], index, index - 1);
    };

    const handleClose = () => {
      let arr = [...selectedIngredients];
      arr.splice(index, 1); // удалит
      dispatch(addAllingredientsArr(arr));
    };

    const moveElement = (
      arr: TConstructorIngredient[],
      fromIndex: number,
      toIndex: number
    ) => {
      // Удаляем элемент и сохраняем его
      const element = arr.splice(fromIndex, 1)[0];
      // Вставляем элемент на новую позицию
      arr.splice(toIndex, 0, element);
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
