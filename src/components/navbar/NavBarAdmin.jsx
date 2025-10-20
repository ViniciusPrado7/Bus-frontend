import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/NavBarStyles.css';

function NavBarAdmin() {
  return (
    <nav className='Nav'>
      <ul className='UListaNav'>
        <li><Link to="/dashboard-admin" className='LinkItemNav'>Dashboard Admin</Link></li>
        <li><Link to="/cadastro-evento" className='LinkItemNav'>Cadastrar Evento</Link></li>
        <li><Link to="/cadastro-usuario" className='LinkItemNav'>Cadastro Usuário</Link></li>
        <li><Link to="/cadastro-onibus" className='LinkItemNav'>Cadastro Ônibus</Link></li> 
        <li><Link to="/cadastro-motorista" className='LinkItemNav'>Cadastro Motorista</Link></li>
      </ul>
      <button
        className='BtnLogout'
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
      >
        Sair
      </button>
    </nav>
  );
}

export default NavBarAdmin;
