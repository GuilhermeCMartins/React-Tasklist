import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from '../../config/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

import './Login.css';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) return navigate('/login');

    navigate('/dashboard');
    toast.success('Entrou com sucesso');
  }, [user, loading]);

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />
        <button
          className="login__btn"
          onClick={() => registerWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login com Google
        </button>
        <div className="link-styled">
          <Link to="/reset">Esqueceu a senha?</Link>
        </div>
        <div className="link-styled">
          Não possui uma conta? <Link to="/register">Crie agora.</Link>
        </div>
      </div>
    </div>
  );
}
export default Login;
