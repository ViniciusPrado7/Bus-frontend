import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../services/Api';
import '../styles/CadastroUsuario.css';

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    login: '',
    password: '',
    userType: 'ATENDENTE',
  });

  const [errors, setErrors] = useState({
    password: '',
  });

  useEffect(() => {
  async function fetchUser() {
    try {
      const response = await api.get(`/users/${id}`);
      const userData = response.data;
      setForm({
        fullName: userData.fullName || '',
        login: userData.login || '',
        password: '',  // senha não preenchida
        userType: userData.userType || 'ATENDENTE',
      });
    } catch (error) {
      toast.error('Erro ao buscar usuário');
      navigate('/');
    }
  }

  fetchUser();
}, [id, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasNumber || !hasSpecialChar) {
      return 'A senha deve conter pelo menos um número e um caractere especial.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(form.password);
if (passwordError) {
  toast.error(passwordError);
  return;
}


    try {
      await api.put(`/users/${id}`, form);
      toast.success('Usuário atualizado com sucesso!');
      navigate('/dashboard-admin');
    } catch (err) {
      toast.error('Erro ao atualizar usuário');
      console.error('Erro na requisição:', err);
    }
  };

  return (
    <div className="ContainerCadastro">
      <h2>Editar Usuário</h2>
      <form className="FormCadastro" onSubmit={handleSubmit}>
        <input
          className="InputCadastro"
          name="fullName"
          placeholder="Nome Completo"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          className="InputCadastro"
          name="login"
          type="text"
          placeholder="Login"
          value={form.login}
          onChange={handleChange}
          required
        />
        <input
          className="InputCadastro"
          name="password"
          type="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select
          className="SelectCadastro"
          name="userType"
          value={form.userType}
          onChange={handleChange}
          required
        >
          <option value="ATENDENTE">Atendente</option>
          <option value="GERENTE">Gerente</option>
        </select>
        <button className="ButtonCadastro" type="submit">
          Salvar
        </button>

       
      </form>
      <ToastContainer position="top-center" autoClose={4000} theme="colored" />
    </div>
  );
}
