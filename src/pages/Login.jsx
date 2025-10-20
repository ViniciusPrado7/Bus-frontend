import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../services/Api';
import '../styles/Login.css';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/auth/login', {
        login,
        password,
      });

      const usuario = response.data;
      const tipo = usuario.userType.toUpperCase();

      const credentials = btoa(`${login}:${password}`);
      localStorage.setItem('tipoUsuario', tipo);
      localStorage.setItem('usuarioLogado', usuario.fullName);
      localStorage.setItem('authHeader', `Basic ${credentials}`);
      api.defaults.headers.common['Authorization'] = `Basic ${credentials}`;

      if (tipo === 'GERENTE') {
        navigate('/dashboard-admin');
      } else {
        navigate('/dashboard');
      }

      window.location.reload();
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Login inválido. Verifique seu usuário e senha.');
    }
  };

  return (
    <div>
      <title>Entrar</title>
      <div className='ContainerLogin'>
        <form className='FormLogin' onSubmit={handleLogin}>
          <div className='DivLogo'>
            <h1 className='loginText'>Login</h1>
          </div>

          <div className='DivInpt'>
            <input
              className='InptLogin'
              type="text"
              required
              placeholder='Login'
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />

            <input
              className='InptLogin'
              type="password"
              required
              placeholder='Senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button className='BtnLogin' type="submit">Entrar</button>
          </div>
        </form>
      </div>


      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}

export default Login;
