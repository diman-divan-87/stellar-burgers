import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  selecLoadingOrder,
  selectUserOrders,
  fetchUserOrders
} from '../../services/orders';

import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);
  const isOrdersLoading = useSelector(selecLoadingOrder);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
