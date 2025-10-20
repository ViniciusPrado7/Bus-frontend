import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/Api';
import { statusMotorista } from '../utils/statusLabels';
import '../styles/CadastroEvento.css';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CadastroEvento() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nomeResponsavel: '',
        telefoneResponsavel: '',
        localEvento: '',
        dataEvento: '',
        dataRetorno: '',
        horarioIda: '',
        horarioVolta: '',
        quantidadePassageiros: '',
        funcionarioId: '',
        valorEvento: '',
        motoristaId: '',
        onibusIds: '',
    });

    const [telefoneErro, setTelefoneErro] = useState('');
    const [funcionariosDisponiveis, setFuncionariosDisponiveis] = useState([]);
    const [motoristasDisponiveis, setMotoristasDisponiveis] = useState([]);
    const [onibusDisponiveis, setOnibusDisponiveis] = useState([]);

    useEffect(() => {
        async function fetchDados() {
            try {
                const [funcionariosRes, motoristasRes, onibusRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/drivers'),
                    api.get('/buses'),
                ]);
                setFuncionariosDisponiveis(funcionariosRes.data);
                setMotoristasDisponiveis(motoristasRes.data);
                setOnibusDisponiveis(onibusRes.data);
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                toast.error('Erro ao carregar dados do backend', { autoClose: 3000, position: 'top-center' });
            }
        }
        fetchDados();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'telefoneResponsavel') {
            let telefoneFormatado = value.replace(/\D/g, '');
            if (telefoneFormatado.length > 0) {
                telefoneFormatado = telefoneFormatado.replace(/^(\d{2})(\d)/g, '($1) $2');
                telefoneFormatado = telefoneFormatado.replace(/(\d{5})(\d)/, '$1-$2');
                if (telefoneFormatado.length > 15) {
                    telefoneFormatado = telefoneFormatado.substring(0, 15);
                }
            }
            setForm(prev => ({ ...prev, [name]: telefoneFormatado }));
        } else if (name === 'valorEvento') {
            let valorFormatado = value.replace(/\D/g, '');
            const valorEmCentavos = parseInt(valorFormatado, 10) || 0;
            valorFormatado = (valorEmCentavos / 100).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            setForm(prev => ({ ...prev, [name]: valorFormatado }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setTelefoneErro('');
        let erroEncontrado = false;

        const today = new Date();
        const dataEvento = new Date(form.dataEvento + "T00:00");
        const dataRetorno = new Date(form.dataRetorno + "T00:00");

        if (dataEvento < today.setHours(0, 0, 0, 0)) {
            toast.error('A data do evento não pode ser anterior à data atual.', { autoClose: 3000, position: 'top-center' });
            return;
        }

        if (dataRetorno < dataEvento) {
            toast.error('A data de retorno não pode ser anterior à data do evento.', { autoClose: 3000, position: 'top-center' });
            return;
        }

        const telefoneSomenteNumeros = form.telefoneResponsavel.replace(/\D/g, '');
        if (telefoneSomenteNumeros.length !== 11) {
            toast.error('O telefone do responsável deve conter exatamente 11 dígitos (DDD + número).', { autoClose: 3000, position: 'top-center' });
            erroEncontrado = true;
        }


        const onibusSelecionado = onibusDisponiveis.find(
            (o) => o.id.toString() === form.onibusIds.toString()
        );

        if (
            onibusSelecionado &&
            Number(form.quantidadePassageiros) > Number(onibusSelecionado.maxCapacity)
        ) {
            toast.error(`A quantidade de passageiros (${form.quantidadePassageiros}) excede a capacidade do ônibus selecionado (${onibusSelecionado.maxCapacity} lugares).`, { autoClose: 4000, position: 'top-center' });
            return;
        }

        if (!form.funcionarioId) {
            toast.error('Selecione o funcionário responsável pelo evento.', { autoClose: 3000, position: 'top-center' });
            return;
        }

        if (erroEncontrado) return;

        try {
            const telefoneSemMascara = form.telefoneResponsavel.replace(/\D/g, '');
            const valorSemFormatacao = form.valorEvento.replace(/\D/g, '') / 100;

            const payload = {
                responsibleName: form.nomeResponsavel,
                contactPhone: telefoneSemMascara,
                eventLocation: form.localEvento,
                eventDepartureDate: form.dataEvento,
                eventReturnDate: form.dataRetorno,
                departureTime: form.horarioIda,
                returnTime: form.horarioVolta,
                numberOfPassengers: form.quantidadePassageiros ? Number(form.quantidadePassageiros) : 0,
                employeeId: form.funcionarioId ? Number(form.funcionarioId) : null,
                statusPayment: 'Confirmado',
                eventValue: valorSemFormatacao || 0,
                driverId: form.motoristaId ? Number(form.motoristaId) : null,
                busId: form.onibusIds ? Number(form.onibusIds) : null,
            };

            console.log('Enviando payload para cadastro:', payload);
            console.log('Telefone original:', form.telefoneResponsavel);
            console.log('Telefone sem máscara:', telefoneSemMascara);

            const response = await api.post('/events', payload);
            console.log('Resposta do servidor:', response.data);
            toast.success('Evento cadastrado com sucesso!', { autoClose: 3000, position: 'top-center' });
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Erro desconhecido';
            console.error('Erro ao cadastrar evento:', errorMessage);
            console.error('Detalhes completos do erro:', error);
            toast.error(`Erro ao cadastrar evento: ${errorMessage}`, { autoClose: 4000, position: 'top-center' });
        }
    };

    const motoristasDisponiveisFiltrados = motoristasDisponiveis.filter(m => m.status === 'AVAILABLE');
    const onibusDisponiveisFiltrados = onibusDisponiveis.filter(o => o.status === 'AVAILABLE');

    return (
        <div className='ContainerCadastro'>
            <h2>Cadastrar Evento</h2>
            <form className='FormCadastro' id='form-evento' onSubmit={handleSubmit}>
                <div className="GridFormulario">
                    <div className="ColunaFormulario">

                        <div className="LinhaFormulario">
                            <label htmlFor="nomeResponsavel">Nome:</label>
                            <input
                                id='nomeResponsavel'
                                className='InputCadastroEvento'
                                name='nomeResponsavel'
                                value={form.nomeResponsavel}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="LinhaFormulario">
                            <label htmlFor="telefoneResponsavel">Telefone:</label>
                            <input
                                id='telefoneResponsavel'
                                className='InputCadastroEvento'
                                name='telefoneResponsavel'
                                type='text'
                                inputMode='numeric'
                                maxLength="15"
                                placeholder="(99) 99999-9999"
                                value={form.telefoneResponsavel}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="LinhaFormulario">
                            <label htmlFor="localEvento">Local:</label>
                            <input
                                id='localEvento'
                                className='InputCadastroEvento'
                                name='localEvento'
                                value={form.localEvento}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="LinhaFormulario">
                            <label htmlFor="dataEvento">Data:</label>
                            <input
                                id='dataEvento'
                                className='InputCadastroEvento'
                                name='dataEvento'
                                type='date'
                                value={form.dataEvento}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="LinhaFormulario">
                            <label htmlFor="dataRetorno">Data de Retorno:</label>
                            <input
                                id='dataRetorno'
                                className='InputCadastroEvento'
                                name='dataRetorno'
                                type='date'
                                value={form.dataRetorno}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="LinhaFormulario">
                            <label htmlFor="horarioIda">Horário Ida:</label>
                            <input
                                id='horarioIda'
                                className='InputCadastroEvento'
                                name='horarioIda'
                                type='time'
                                value={form.horarioIda}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="LinhaFormulario">
                            <label htmlFor="horarioVolta">Horário Volta:</label>
                            <input
                                id='horarioVolta'
                                className='InputCadastroEvento'
                                name='horarioVolta'
                                type='time'
                                value={form.horarioVolta}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="ColunaFormulario">
                        <div className="LinhaFormulario">
                            <label htmlFor="quantidadePassageiros">Passageiros:</label>
                            <input
                                id='quantidadePassageiros'
                                className="InputCadastroEvento"
                                name='quantidadePassageiros'
                                type='number'
                                min="1"
                                value={form.quantidadePassageiros}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="LinhaFormulario">
                            <label htmlFor="funcionarioId">Funcionário:</label>
                            <select
                                id='funcionarioId'
                                className='SelectCadastroEvento'
                                name='funcionarioId'
                                value={form.funcionarioId}
                                onChange={handleChange}
                                required
                            >
                                <option value=''>Selecione</option>
                                {funcionariosDisponiveis.map(f => (
                                    <option key={f.id} value={f.id}>
                                        {f.fullName || f.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="LinhaFormulario">
                            <label htmlFor="motoristaId">Motorista:</label>
                            <select
                                id='motoristaId'
                                className='SelectCadastroEvento'
                                name='motoristaId'
                                value={form.motoristaId}
                                onChange={handleChange}
                                required
                            >
                                <option value=''>Selecione</option>
                                {motoristasDisponiveisFiltrados.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.fullName || m.nome} ({statusMotorista[m.status]})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="LinhaFormulario">
                            <label htmlFor="onibusIds">Ônibus:</label>
                            <select
                                id='onibusIds'
                                className='SelectCadastroEvento'
                                name='onibusIds'
                                value={form.onibusIds}
                                onChange={handleChange}
                                required
                            >
                                <option value=''>Selecione</option>
                                {onibusDisponiveisFiltrados.map(o => (
                                    <option key={o.id} value={o.id}>
                                        {o.plate || o.placa} (Cap.: {o.maxCapacity || o.capacidade})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="LinhaFormulario">
                            <label htmlFor="valorEvento">Valor (R$):</label>
                            <input
                                id='valorEvento'
                                className='InputCadastroEvento'
                                name='valorEvento'
                                type='text'
                                inputMode="numeric"
                                placeholder="0,00"
                                value={form.valorEvento}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button className='ButtonCadastro' type='submit' form='form-evento'>
                        Salvar
                    </button>
                </div>
            </form>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        </div>
    );
}
