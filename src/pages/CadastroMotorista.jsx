import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/Api';
import '../styles/CadastroUsuario.css';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CadastroMotorista() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    contact: '',
    identificationNumber: '',
    status: 'AVAILABLE',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'contact') {
      let telefone = value.replace(/\D/g, '').slice(0, 11);
      if (telefone.length > 0) {
        telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2');
        telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
      }
      setForm(prev => ({ ...prev, [name]: telefone }));

    } else if (name === 'identificationNumber') {
      let cnh = value.replace(/\D/g, '').slice(0, 11);
      if (cnh.length > 3) cnh = cnh.replace(/^(\d{3})(\d)/, '$1.$2');
      if (cnh.length > 6) cnh = cnh.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      if (cnh.length > 9) cnh = cnh.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
      setForm(prev => ({ ...prev, [name]: cnh }));

    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const telefoneLimpo = form.contact.replace(/\D/g, '');
    const cnhLimpa = form.identificationNumber.replace(/\D/g, '');

    if (telefoneLimpo.length !== 11) {
      toast.error('O telefone deve conter exatamente 11 dígitos (incluindo DDD).');
      return;
    }

    if (cnhLimpa.length !== 11) {
      toast.error('A CNH deve conter exatamente 11 dígitos.');
      return;
    }

    try {
      const payload = {
        ...form,
        contact: telefoneLimpo,
        identificationNumber: cnhLimpa,
      };

      await api.post('/drivers', payload);
      toast.success('Motorista cadastrado com sucesso!');
      navigate('/dashboard-admin');
    } catch (err) {
      toast.error('Erro ao cadastrar motorista');
      console.error(err);
    }
  };

  return (
    <div className="ContainerCadastro">
      <h2>Cadastro de Motorista</h2>
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
          name="contact"
          placeholder="Telefone com DDD"
          value={form.contact}
          onChange={handleChange}
          required
          maxLength={15}
          inputMode="numeric"
        />

        <input
          className="InputCadastro"
          name="identificationNumber"
          placeholder="Número da CNH"
          value={form.identificationNumber}
          onChange={handleChange}
          required
          maxLength={18}
          inputMode="numeric"
        />

        <select
          className="SelectCadastro"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="AVAILABLE">Ativo</option>
          <option value="ON_VACATION">De férias</option>
          <option value="ON_LEAVE">Licença</option>
          <option value="ASSIGNED_TO_EVENT">Atribuído a Evento</option>
        </select>

        <button className="ButtonCadastro" type="submit">
          Cadastrar
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}
