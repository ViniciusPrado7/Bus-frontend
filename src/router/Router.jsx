// src/router/Router.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashBoardAdmin from '../pages/DashBoardAdmin';
import CadastroEvento from '../pages/CadastroEvento';
import EditarEvento from '../pages/EditarEvento';
import Login from '../pages/Login';
import CadastroUsuario from '../pages/CadastroUsuario';
import CadastroOnibus from '../pages/CadastroOnibus'; 
import DashBoard from '../pages/DashBoard';
import CadastroMotorista from '../pages/CadastroMotorista';
import EditarUsuario from '../pages/EditarUsuario';
import EditarOnibus from '../pages/EditarOnibus';
import EditarMotorista from '../pages/EditarMotorista';


function Router() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/dashboard' element={<DashBoard />} />
      <Route path='/dashboard-admin' element={<DashBoardAdmin />} />
      <Route path='/editar/onibus/:id' element={<EditarOnibus />} />
      <Route path='/editar/motorista/:id' element={<EditarMotorista/>} />
      <Route path='/cadastro-evento' element={<CadastroEvento />} />
      <Route path='/cadastro-usuario' element={<CadastroUsuario />} />
      <Route path='/cadastro-onibus' element={<CadastroOnibus />} /> 
      <Route path='/cadastro-motorista' element={<CadastroMotorista />} />
      <Route path='/editar/events/:id' element={<EditarEvento />} />
      <Route path='/editar/users/:id' element={<EditarUsuario />} />
    </Routes>
  );
}

export default Router;
