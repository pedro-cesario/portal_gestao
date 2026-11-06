/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — StatusTag (Tipografia limpa e sem pílulas estáticas conforme Constituição de Design)
 */

import React from 'react';
import { TicketStatus, GLPIPriority, ManagerialPriority } from '../../types';

export const TicketStatusText: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const map: Record<TicketStatus, { label: string; color: string }> = {
    novo: { label: 'Novo', color: 'text-sky-600 dark:text-sky-400' },
    em_atendimento: { label: 'Em Atendimento', color: 'text-amber-600 dark:text-amber-400' },
    planejado: { label: 'Planejado', color: 'text-indigo-600 dark:text-indigo-400' },
    pendente: { label: 'Pendente', color: 'text-rose-600 dark:text-rose-400' },
    solucionado: { label: 'Solucionado', color: 'text-emerald-600 dark:text-emerald-400' },
    fechado: { label: 'Fechado', color: 'text-slate-500 dark:text-slate-400' },
  };

  const item = map[status] || { label: status, color: 'text-slate-500' };

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${item.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{item.label}</span>
    </span>
  );
};

export const PriorityTag: React.FC<{ priority: GLPIPriority }> = ({ priority }) => {
  const map: Record<GLPIPriority, { label: string; color: string }> = {
    muito_baixa: { label: 'Muito Baixa', color: 'text-slate-500' },
    baixa: { label: 'Baixa', color: 'text-slate-600 dark:text-slate-400' },
    media: { label: 'Média', color: 'text-blue-600 dark:text-blue-400' },
    alta: { label: 'Alta', color: 'text-amber-600 dark:text-amber-400' },
    muito_alta: { label: 'Muito Alta', color: 'text-rose-600 dark:text-rose-400' },
  };

  const item = map[priority] || { label: priority, color: 'text-slate-500' };

  return (
    <span className={`text-xs font-medium ${item.color}`}>
      {item.label}
    </span>
  );
};

export const ManagerialPriorityTag: React.FC<{ priority: ManagerialPriority }> = ({ priority }) => {
  const map: Record<ManagerialPriority, { label: string; color: string; bg: string }> = {
    P1_CRITICA: { label: 'P1 Crítica (Gestão)', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-500/10 border-rose-500/20' },
    P2_ALTA: { label: 'P2 Alta (Gestão)', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20' },
    P3_MEDIA: { label: 'P3 Média (Gestão)', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-500/10 border-blue-500/20' },
    P4_PADRAO: { label: 'P4 Padrão (Gestão)', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-500/10 border-slate-500/20' },
  };

  const item = map[priority];

  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded border ${item.bg} ${item.color}`}>
      {item.label}
    </span>
  );
};
