import { FC } from 'react';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';

export type TProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({ children }) => {
  const isLoading = false;
  const isAccess = true;

  if (isLoading) {
    return <Preloader />;
  }

  if (isAccess) {
    return <Navigate to='/login' />;
  }

  return children;
};
