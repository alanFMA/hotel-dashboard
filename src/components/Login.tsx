import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthGoogleContext } from '../context/authGoogle';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthGoogleContext);

  if (!authContext) {
    throw new Error(
      'AuthGoogleContext must be used within an AuthGoogleProvider',
    );
  }

  const { signInGoogle } = authContext;

  const handleLogin = () => {
    signInGoogle(() => navigate('/')); // Redireciona para a página principal após o login
  };

  return <button onClick={handleLogin}>Logar com o Google</button>;
};

export default Login;
