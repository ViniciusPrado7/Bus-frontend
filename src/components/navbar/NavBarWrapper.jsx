import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import NavBarAdmin from './NavBarAdmin';

function NavBarWrapper() {
  const [tipoUsuario, setTipoUsuario] = useState(null);

  useEffect(() => {
    const tipo = localStorage.getItem('tipoUsuario');
    if (tipo) {
      setTipoUsuario(tipo.toUpperCase());
    }
  }, []);

  if (!tipoUsuario) return null;

  if (tipoUsuario === 'GERENTE') return <NavBarAdmin />;
  if (tipoUsuario === 'ATENDENTE') return <NavBar />;
  return null;
}

export default NavBarWrapper;
