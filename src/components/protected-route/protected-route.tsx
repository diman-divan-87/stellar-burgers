import { FC } from 'react';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';

export type TProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({ children }) => {
  const { user } = useSelector((state) => state.loginUser);
  const isLoading = false;
  const isAccess = !user;

  if (isLoading) {
    return <Preloader />;
  }

  if (isAccess) {
    return <Navigate to='/login' />;
  }

  return children;
};
