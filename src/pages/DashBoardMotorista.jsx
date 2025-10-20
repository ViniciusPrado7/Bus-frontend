import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/Api';
import '../styles/DashBoard.css';
import { statusMotorista } from '../utils/statusLabels';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashBoardMotorista() {
  const [motoristas, setMotoristas] = useState([]);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  useEffect(() => {
    setTipoUsuario(localStorage.getItem('tipoUsuario'));
    fetchMotoristas();
  }, []);

  const fetchMotoristas = async () => {
    try {
      const response = await api.get('/drivers');
      setMotoristas(response.data);
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      toast.error('Erro ao buscar motoristas');
    }
  };

  const deletar = async (id) => {
    const confirm = window.confirm('Tem certeza que deseja excluir este motorista?');
    if (!confirm) return;

    try {
      await api.delete(`/drivers/${id}`);
      setMotoristas((prev) => prev.filter((m) => m.id !== id));
      toast.success('Motorista excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir motorista:', error);
      toast.error('Erro ao excluir motorista');
    }
  };

  // Função para formatar telefone
  function formatarTelefone(numero) {
    if (!numero) return '—';

    const numeros = numero.replace(/\D/g, '');

    if (numeros.length === 11) {
      return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (numeros.length === 10) {
      return numeros.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else {
      return numero;
    }
  }

  // Função para formatar CNH
  function formatarCNH(cnh) {
    if (!cnh) return '—';
    const numeros = cnh.replace(/\D/g, '');
    if (numeros.length === 11) {
      return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }
    return cnh;
  }

  return (
    <div className='ContainerCadastro'>
      <h2 className='H2Lista'>Lista de Motoristas</h2>
      <div className='DivTable'>
        <table>
          <thead>
            <tr>
              <th className='ThTable'>Nome</th>
              <th className='ThTable'>Contato</th>
              <th className='ThTable'>CNH</th>
              <th className='ThTable'>Status</th>
              {tipoUsuario === 'GERENTE' && <th className='ThTable'>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {motoristas.map((m) => (
              <tr key={m.id}>
                <td>{m.fullName}</td>
                <td>{formatarTelefone(m.contact)}</td>
                <td>{formatarCNH(m.identificationNumber)}</td>
                <td>{statusMotorista[m.status]}</td>
                {tipoUsuario === 'GERENTE' && (
                  <td>
                    <Link to={`/editar/motorista/${m.id}`}>
                      <button className='ButtonAcao'>Editar</button>
                    </Link>
                    <button className='ButtonAcao' onClick={() => deletar(m.id)}>
                      Excluir
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}
