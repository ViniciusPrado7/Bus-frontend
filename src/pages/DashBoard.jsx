import React, { useState } from 'react';
import DashBoardMotorista from './DashBoardMotorista';
import DashBoardOnibus from './DashBoardOnibus';
import DashBoardEventos from './DashBoardEventos';
import '../styles/DashBoard.css';

export default function DashBoard() {
    const [abaAtiva, setAbaAtiva] = useState('eventos');

    return (
        <div className='ContainerCadastro'>
            <h2 className='H2Lista'>Painel Administrativo</h2>

            <div className='DivAdministrativo'>
                <button
                    className={`ButtonAcaoAdministrativo ${abaAtiva === 'eventos' ? 'ativo' : ''}`}
                    onClick={() => setAbaAtiva('eventos')}
                >
                    Eventos
                </button>
                
                <button
                    className={`ButtonAcaoAdministrativo ${abaAtiva === 'usuarios' ? 'ativo' : ''}`}
                    onClick={() => setAbaAtiva('usuarios')}
                >
                    Usuários
                </button>
                
                <button
                    className={`ButtonAcaoAdministrativo ${abaAtiva === 'motoristas' ? 'ativo' : ''}`}
                    onClick={() => setAbaAtiva('motoristas')}
                >
                    Motoristas
                </button>
                <button
                    className={`ButtonAcaoAdministrativo ${abaAtiva === 'onibus' ? 'ativo' : ''}`}
                    onClick={() => setAbaAtiva('onibus')}
                >
                    Ônibus
                </button>
            </div>

            {abaAtiva === 'eventos' && <DashBoardEventos />}
            {abaAtiva === 'usuarios' && <DashBoardUsuario />}
            {abaAtiva === 'motoristas' && <DashBoardMotorista />}
            {abaAtiva === 'onibus' && <DashBoardOnibus />}
        </div>
    );
}
