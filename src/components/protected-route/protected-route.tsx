import { FC } from 'react';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { getCookie } from '../../utils/cookie';
import { useLocation, Navigate } from 'react-router-dom';

export type TProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({ children }) => {
  const { loading, user } = useSelector((state) => state.loginUser);
  const token = getCookie('accessToken');
  const location = useLocation();
  const isLoading = loading;

  if (isLoading) {
    return <Preloader />;
  }

  if (!token && !user) {
    return <Navigate to='/login' />;
  }

  if (user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate replace to={from} />;
  }

  return children;
};
