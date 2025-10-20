import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/Api';
import '../styles/DashBoard.css';
import { statusOnibus } from '../utils/statusLabels';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashBoardOnibus() {
  const [onibus, setOnibus] = useState([]);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  
  // Função para formatar a placa com hífen
  const formatarPlaca = (placa) => {
    if (!placa) return '';
    const placaSemHifen = placa.replace(/-/g, '');
    if (placaSemHifen.length >= 3) {
      return placaSemHifen.substring(0, 3) + '-' + placaSemHifen.substring(3);
    }
    return placaSemHifen;
  };

  useEffect(() => {
    setTipoUsuario(localStorage.getItem('tipoUsuario'));
    fetchOnibus();
  }, []);

  const fetchOnibus = async () => {
    try {
      const response = await api.get('/buses');
      setOnibus(response.data);
    } catch (error) {
      console.error('Erro ao buscar ônibus:', error);
      toast.error('Erro ao buscar ônibus');
    }
  };

  const deletar = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este ônibus?')) return;
    try {
      await api.delete(`/buses/${id}`);
      setOnibus((prev) => prev.filter((o) => o.id !== id));
      toast.success('Ônibus excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir ônibus:', error);
      toast.error('Erro ao excluir ônibus');
    }
  };

  return (
    <div className='ContainerCadastro'>
      <h2 className='H2Lista'>Lista de Ônibus</h2>
      <div className='DivTable'>
        <table>
          <thead>
            <tr>
              <th className='ThTable'>Placa</th>
              <th className='ThTable'>Capacidade</th>
              <th className='ThTable'>Status</th>
              {tipoUsuario === 'GERENTE' && <th className='ThTable'>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {onibus.map((o) => (
              <tr key={o.id}>
                <td>{formatarPlaca(o.plate)}</td>
                <td>{o.maxCapacity}</td>
                <td>{statusOnibus[o.status]}</td>
                {tipoUsuario === 'GERENTE' && (
                  <td>
                    <Link to={`/editar/onibus/${o.id}`}>
                      <button className='ButtonAcao'>Editar</button>
                    </Link>
                    <button className='ButtonAcao' onClick={() => deletar(o.id)}>
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
