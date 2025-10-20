import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/Api';
import '../styles/DashBoard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashBoardUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [tipoUsuario, setTipoUsuario] = useState(null);

    useEffect(() => {
        setTipoUsuario(localStorage.getItem('tipoUsuario'));
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await api.get('/users');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            toast.error('Erro ao buscar usuários');
        }
    };

    const deletar = async (id) => {
        const confirm = window.confirm('Tem certeza que deseja excluir este usuário?');
        if (!confirm) return;

        try {
            await api.delete(`/users/${id}`);
            setUsuarios((prev) => prev.filter((u) => u.id !== id));
            toast.success('Usuário excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            toast.error('Erro ao excluir usuário');
        }
    };

    return (
        <div className='ContainerCadastro'>
            <h2 className='H2Lista'>Lista de Usuários</h2>
            <div className='DivTable'>
                <table>
                    <thead>
                        <tr>
                            <th className='ThTable'>Nome</th>
                            <th className='ThTable'>Login</th>
                            <th className='ThTable'>Tipo</th>
                            {tipoUsuario === 'GERENTE' && <th className='ThTable'>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.id}>
                                <td>{u.fullName}</td>
                                <td>{u.login}</td>
                                <td>{u.userType}</td>
                                {tipoUsuario === 'GERENTE' && (
                                    <td>
                                        <Link to={`/editar/users/${u.id}`}>
                                            <button className='ButtonAcao'>Editar</button>
                                        </Link>
                                        <button className='ButtonAcao' onClick={() => deletar(u.id)}>
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
