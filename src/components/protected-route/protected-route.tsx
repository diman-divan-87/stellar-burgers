import { FC } from 'react';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { useLocation, Navigate } from 'react-router-dom';
import { selectUser, isAuthChecked } from '../../services/auth/loginUser';

export type TProtectedRouteProps = {
  children: React.ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth,
  children
}) => {
  const user = useSelector(selectUser);
  const isAuth = useSelector(isAuthChecked);
  const location = useLocation();
  if (!isAuth) {
    return <Preloader />;
  }

  if (!user && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (user && onlyUnAuth) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate replace to={from} />;
  }

  return children;
};
