import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/Api';
import '../styles/DashBoard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashBoardEventos() {
    const [eventos, setEventos] = useState([]);
    const [motoristas, setMotoristas] = useState([]);
    const [onibus, setOnibus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState(null);

    useEffect(() => {
        setTipoUsuario(localStorage.getItem('tipoUsuario'));
        fetchDados();
    }, []);

    const fetchDados = async () => {
        setLoading(true);
        try {
            const [eventosRes, motoristasRes, onibusRes] = await Promise.all([
                api.get('/events'),
                api.get('/drivers'),
                api.get('/buses'),
            ]);
            setEventos(eventosRes.data);
            setMotoristas(motoristasRes.data);
            setOnibus(onibusRes.data);
        } catch (error) {
            toast.error('Erro ao carregar dados');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deletar = async (id) => {
        if (!window.confirm('Deseja realmente excluir este evento?')) return;

        try {
            await api.delete(`/events/${id}`);
            toast.success('Evento excluído com sucesso!');
            setEventos(eventos.filter(e => e.id !== id));
        } catch (error) {
            toast.error('Erro ao excluir evento');
            console.error(error);
        }
    };

    const formatarData = (dataString) => {
        if (!dataString) return '—';

        let dataObj;
        if (Array.isArray(dataString)) {
            const [ano, mes, dia] = dataString;
            dataObj = new Date(ano, mes - 1, dia);
        } else {
            dataObj = new Date(dataString);
        }
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    const formatarHora = (hora) => {
        if (!hora) return '—';

        if (Array.isArray(hora) && hora.length >= 2) {
            const horaStr = String(hora[0]).padStart(2, '0');
            const minutoStr = String(hora[1]).padStart(2, '0');
            return `${horaStr}:${minutoStr}`;
        }

        if (typeof hora === 'string') {
            const partes = hora.split(':');
            if (partes.length >= 2) {
                const horaStr = partes[0].padStart(2, '0');
                const minutoStr = partes[1].padStart(2, '0');
                return `${horaStr}:${minutoStr}`;
            }
        }

        return '—';
    };

    const encontrarMotorista = (driverId) => {
        if (!driverId) return '—';
        const m = motoristas.find(m => m.id === driverId);
        return m ? m.fullName || '—' : '—';
    };

    const encontrarOnibus = (busId) => {
        if (!busId) return '—';
        const o = onibus.find(o => o.id === busId);
        return o ? (o.plate || o.placa || '—') : '—';
    };

    // Função que formata telefone
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

    return (
        <div className='ContainerCadastro'>
            <h2 className='H2Lista'>Lista de Eventos</h2>
            {loading ? (
                <p>Carregando eventos...</p>
            ) : eventos.length === 0 ? (
                <p>Nenhum evento cadastrado.</p>
            ) : (
                <div className='DivTable'>
                    <table>
                        <thead>
                            <tr>
                                <th className='ThTable'>Responsável</th>
                                <th className='ThTable'>Telefone</th>
                                <th className='ThTable'>Local</th>
                                <th className='ThTable'>Data (Ida / Volta)</th>
                                <th className='ThTable'>Horário (Ida / Volta)</th>
                                <th className='ThTable'>Passageiros</th>
                                <th className='ThTable'>Funcionário</th>
                                <th className='ThTable'>Motorista</th>
                                <th className='ThTable'>Ônibus</th>
                                <th className='ThTable'>Valor (R$)</th>
                                {tipoUsuario === 'GERENTE' && <th className='ThTable'>Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {eventos.map(e => (
                                <tr key={e.id}>
                                    <td>{e.responsibleName}</td>
                                    <td>{formatarTelefone(e.contactPhone)}</td>
                                    <td>{e.eventLocation}</td>
                                    <td>{formatarData(e.eventDepartureDate)} / {formatarData(e.eventReturnDate)}</td>
                                    <td>{formatarHora(e.departureTime)} / {formatarHora(e.returnTime)}</td>
                                    <td>{e.numberOfPassengers}</td>
                                    <td>
                                        {typeof e.employee === 'object'
                                            ? e.employee.fullName || '—'
                                            : e.employee || '—'
                                        }
                                    </td>
                                    <td>{encontrarMotorista(e.driverId)}</td>
                                    <td>{encontrarOnibus(e.busId)}</td>
                                    <td>{Number(e.eventValue).toFixed(2)}</td>
                                    {tipoUsuario === 'GERENTE' && (
                                        <td>
                                            <Link to={`/editar/events/${e.id}`}>
                                                <button className='ButtonAcao'>Editar</button>
                                            </Link>
                                            <button className='ButtonAcao' onClick={() => deletar(e.id)}>Excluir</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        </div>
    );
}
