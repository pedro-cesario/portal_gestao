/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Login Institucional Executivo
 * Perfis rápidos (Gestor, Equipe Técnica, Administrador) e compromisso de segurança
 */

import React, { useState } from 'react';
import { Hospital, ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
import { CurrentUser, UserRole } from '../../types';
import { MOCK_USERS } from '../../data/mockData';

interface LoginViewProps {
  onLoginSuccess: (user: CurrentUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [selectedUser, setSelectedUser] = useState<CurrentUser>(MOCK_USERS[0]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-[#134F9F] selection:text-white">
      {/* Container Central */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#134F9F] mx-auto flex items-center justify-center text-white shadow-lg">
            <Hospital className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            HEAL Ops | Gestão TI
          </h1>
          <p className="text-xs text-slate-400">
            Portal de Gestão Operacional da TI do Instituto HEAL
          </p>
        </div>

        {/* Aviso de Prototipação e Segurança */}
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Ambiente Demonstrativo Homologado</span>
          </div>
          <p className="text-[11px] text-blue-300/80 leading-relaxed">
            Dados fictícios para validação de fluxos UX e decisões operacionais. Nenhum dado sensível de paciente ou credencial real.
          </p>
        </div>

        {/* Seleção Rápida de Perfil para Demonstração */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Selecione o Perfil Institucional para Acesso:
          </label>

          <div className="space-y-2">
            {MOCK_USERS.map((user) => {
              const isSelected = selectedUser.id === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#134F9F]/20 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 font-bold font-mono text-xs flex items-center justify-center">
                      {user.avatarUrl}
                    </div>
                    <div>
                      <strong className="block text-slate-200">{user.name}</strong>
                      <span className="text-[11px] text-slate-400">{user.department}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    user.role === 'GESTOR' ? 'bg-blue-500/20 text-blue-400' :
                    user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {user.role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botão de Entrar */}
        <button
          type="button"
          onClick={() => onLoginSuccess(selectedUser)}
          className="w-full py-3 bg-[#134F9F] hover:bg-blue-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <span>Acessar Portal Operacional</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Rodapé Institucional */}
        <div className="text-center text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
          Diretriz de Segurança DTI / LGPD · Acesso auditado e monitorado
        </div>
      </div>
    </div>
  );
};
