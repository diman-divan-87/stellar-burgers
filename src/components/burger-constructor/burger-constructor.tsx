import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useSelector, useDispatch } from '../../services/store';
import {
  getIngredients,
  getBun,
  clearBurgerConstructor
} from '../../services/burger-constructor';
import {
  clearTargetOrder,
  createOrder,
  selecTargetOrder,
  selecLoadingOrder
} from '../../services/orders';
import { selectUser } from '../../services/auth/loginUser';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedIngredients = useSelector(getIngredients);
  const selectedBun = useSelector(getBun);

  const constructorItems = {
    bun: selectedBun,
    ingredients: selectedIngredients.filter((sf) => sf.type !== 'bun')
  };

  const orderRequest = useSelector(selecLoadingOrder);

  const orderModalData = useSelector(selecTargetOrder);
  const user = useSelector(selectUser);
  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    dispatch(
      createOrder([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((ing) => ing._id)
      ])
    ).then(() => {
      dispatch(clearBurgerConstructor());
    });
  };
  const closeOrderModal = () => {
    dispatch(clearTargetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
