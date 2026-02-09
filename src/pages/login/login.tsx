import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUserApp, resetErr } from '../../services/auth/loginUser';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { error, loading, user } = useSelector((state) => state.loginUser);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserApp({ email: email, password: password }));
    dispatch(resetErr());
  };

  useEffect(() => {
    if (!error && user) {
      navigate('/profile');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
