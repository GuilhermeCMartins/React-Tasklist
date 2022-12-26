import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { auth, sendPasswordReset } from '../../config/firebaseConfig';

import './Reset.css';

function Reset() {
  const [email, setEmail] = useState('');
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate('/dashboard');
  }, [user, loading]);

  return (
    <div className="reset">
      <div className="reset__container">
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <button className="reset__btn" onClick={() => sendPasswordReset(email)}>
          Envie sua senha para seu e-mail
        </button>
        <div className="link-styled">
          Não possui uma conta? <Link to="/register">Crie sua conta agora</Link>
        </div>
      </div>
    </div>
  );
}
export default Reset;
