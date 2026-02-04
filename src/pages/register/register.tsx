import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import {
  registerUserApp,
  resetRegisterChecked
} from '../../services/auth/registerUser';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { error, loading, user, isRegisterChecked } = useSelector(
    (state) => state.register
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      registerUserApp({
        email: email,
        name: userName,
        password: password
      })
    );
  };

  useEffect(() => {
    if (user && !loading && !isRegisterChecked) {
      dispatch(resetRegisterChecked());
      navigate('/');
    }
  }, [user, loading, navigate]);

  return (
    <RegisterUI
      errorText={error as string}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
