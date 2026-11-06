/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Componente de Camadas de Conclusão / Evidência
 * Diferenciação visual clara e acessível entre Fato, Indício, Verificação e Desconformidade
 */

import React from 'react';
import { EvidenceLevel } from '../../types';
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle } from 'lucide-react';

interface EvidenceBadgeProps {
  level: EvidenceLevel;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ 
  level, 
  size = 'md',
  showIcon = true 
}) => {
  const config = {
    'Fato confirmado': {
      text: 'Fato confirmado',
      icon: CheckCircle2,
      style: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
      description: 'Comprovado por logs, registros biométricos ou validação física.'
    },
    'Indício de desconformidade': {
      text: 'Indício de desconformidade',
      icon: AlertTriangle,
      style: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20',
      description: 'Sinalizador operacional que requer checagem; não constitui falta culposa.'
    },
    'Verificação necessária': {
      text: 'Verificação necessária',
      icon: HelpCircle,
      style: 'text-sky-700 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20',
      description: 'Informação pendente de protocolo externo ou retorno de terceiros.'
    },
    'Desconformidade confirmada': {
      text: 'Desconformidade confirmada',
      icon: XCircle,
      style: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20',
      description: 'Violação objetiva documentada das regras POP-TIN vigentes.'
    }
  }[level];

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded ${sizeClasses} ${config.style}`}
      title={config.description}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{config.text}</span>
    </span>
  );
};
