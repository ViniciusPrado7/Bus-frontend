import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../services/Api';
import '../styles/CadastroUsuario.css';

export default function EditarOnibus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    plate: '',
    maxCapacity: '',
    status: 'AVAILABLE',
  });

  const [errors, setErrors] = useState({
    plate: '',
    maxCapacity: '',
  });

  useEffect(() => {
    async function fetchBus() {
      try {
        const response = await api.get(`/buses/${id}`);
        setForm({
          plate: response.data.plate,
          maxCapacity: response.data.maxCapacity.toString(),
          status: response.data.status,
        });
      } catch (error) {
        toast.error('Erro ao buscar ônibus');
        navigate('/dashboard-admin');
      }
    }

    fetchBus();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'plate') {
      let placaFormatada = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (placaFormatada.length > 7) {
        placaFormatada = placaFormatada.substring(0, 7);
      }
      if (placaFormatada.length >= 3) {
        placaFormatada = placaFormatada.substring(0, 3) + '-' + placaFormatada.substring(3);
      }
      setForm(prev => ({ ...prev, [name]: placaFormatada }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    let hasError = false;
    let newErrors = { plate: '', maxCapacity: '' };

    if (!form.plate.trim()) {
      newErrors.plate = 'Placa é obrigatória.';
      hasError = true;
    }

    if (!form.maxCapacity || isNaN(form.maxCapacity) || Number(form.maxCapacity) <= 0) {
      newErrors.maxCapacity = 'Capacidade deve ser um número maior que zero.';
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const placaSemHifen = form.plate.replace(/-/g, '');

      await api.put(`/buses/${id}`, {
        plate: placaSemHifen,
        maxCapacity: Number(form.maxCapacity),
        status: form.status,
      });

      toast.success('Ônibus atualizado com sucesso!');
      navigate('/dashboard-admin');
    } catch (err) {
      toast.error('Essa placa já está cadastrada. Por favor, insira uma placa diferente.');
      console.error('Erro na requisição:', err.response?.data || err.message);
    }
  };

  return (
    <div className="ContainerCadastro">
      <h2>Editar Ônibus</h2>
      <form className="FormCadastro" onSubmit={handleSubmit}>
        <input
          className="InputCadastro"
          name="plate"
          placeholder="Placa do Ônibus"
          value={form.plate}
          onChange={handleChange}
          required
        />
        {errors.plate && <p style={{ color: '#CCC', fontSize: '12px' }}>{errors.plate}</p>}

        <input
          className="InputCadastro"
          name="maxCapacity"
          type="number"
          placeholder="Capacidade Máxima"
          value={form.maxCapacity}
          onChange={handleChange}
          required
        />
        {errors.maxCapacity && <p style={{ color: '#CCC', fontSize: '12px' }}>{errors.maxCapacity}</p>}

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

        <button className="ButtonCadastro" type="submit">
          Salvar
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={4000} theme="colored" />
    </div>
  );
}
