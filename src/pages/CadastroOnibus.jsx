import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/Api'; 
import '../styles/CadastroUsuario.css'; 

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CadastroOnibus() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    plate: '',           
    maxCapacity: '',     
    status: 'AVAILABLE',    
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'plate') {
      let placaFormatada = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

      if (placaFormatada.length > 7) {
        placaFormatada = placaFormatada.substring(0, 7);
      }
      
      if (placaFormatada.length > 0) {
        const isFormatoAntigo = /^[A-Z]{3}\d{4}$/.test(placaFormatada);
        const isFormatoNovo = /^[A-Z]{3}\d[A-Z]\d{2}$/.test(placaFormatada);
        
        if (placaFormatada.length >= 3 && (isFormatoAntigo || (!isFormatoNovo && placaFormatada.length <= 7))) {
          placaFormatada = placaFormatada.substring(0, 3) + '-' + placaFormatada.substring(3);
        }
      }
      
      setForm(prev => ({ ...prev, [name]: placaFormatada }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!form.plate.trim()) {
      toast.error('Placa é obrigatória.', { autoClose: 3000, position: "top-center" });
      return false;
    }

    if (!form.maxCapacity || isNaN(form.maxCapacity) || Number(form.maxCapacity) <= 0) {
      toast.error('Capacidade deve ser um número maior que zero.', { autoClose: 3000, position: "top-center" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const placaSemHifen = form.plate.replace(/-/g, '');
      
      await api.post('/buses', {
        plate: placaSemHifen,
        maxCapacity: Number(form.maxCapacity),
        status: form.status,
      });

      toast.success('Ônibus cadastrado com sucesso!', { autoClose: 3000, position: "top-center" });
      navigate('/dashboard-admin'); 
    } catch (err) {
      toast.error('Está placa ja existe. Por favor altere.', { autoClose: 3000, position: "top-center" });
      console.error('Erro na requisição:', err.response?.data || err.message);
    }
  };

  return (
    <div className="ContainerCadastro">
      <h2>Cadastro de Ônibus</h2>
      <form className="FormCadastro" onSubmit={handleSubmit}>
        <input
          className="InputCadastro"
          name="plate"
          placeholder="Placa do Ônibus"
          value={form.plate}
          onChange={handleChange}
          required
        />
        
        <input
          className="InputCadastro"
          name="maxCapacity"
          type="number"
          placeholder="Capacidade Máxima"
          value={form.maxCapacity}
          onChange={handleChange}
          required
        />
        
        <select
          className="SelectCadastro"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="AVAILABLE">Ativo</option>
          <option value="IN_USE">Inativo</option>
          <option value="MAINTENANCE">Manutenção</option>
          <option value="IN_TRANSIT">Em Trânsito</option>
          <option value="IN_SERVICE">Em Serviço</option>
        </select>

        <button className="ButtonCadastro" type="submit">Cadastrar</button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}
