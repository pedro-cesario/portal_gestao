/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — SyntheticMetricCard (Cartão Sintético de Nível 1 com Acionador para Nível 2)
 */

import React from 'react';
import { ChevronRight, Info } from 'lucide-react';

interface SyntheticMetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  alertLevel?: 'none' | 'warning' | 'critical' | 'info';
  formulaExplanation?: string;
  onClickDetail?: () => void;
  ctaText?: string;
}

export const SyntheticMetricCard: React.FC<SyntheticMetricCardProps> = ({
  label,
  value,
  subtext,
  trend,
  alertLevel = 'none',
  formulaExplanation,
  onClickDetail,
  ctaText = 'Detalhar'
}) => {
  const borderStyles = {
    none: 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
    info: 'border-blue-500/30 hover:border-blue-500/50',
    warning: 'border-amber-500/40 hover:border-amber-500/60 bg-amber-500/[0.02]',
    critical: 'border-rose-500/40 hover:border-rose-500/60 bg-rose-500/[0.03]',
  }[alertLevel];

  return (
    <div 
      className={`relative flex flex-col justify-between p-4 rounded-lg bg-white dark:bg-slate-900 border transition-all duration-150 ${borderStyles} group`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
            {label}
          </span>
          {formulaExplanation && (
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              title={formulaExplanation}
              aria-label={`Explicação da fórmula para ${label}`}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-mono tabular-nums">
            {value}
          </span>
          {trend && (
            <span className={`text-xs font-medium ${
              trend.isNeutral 
                ? 'text-slate-500 dark:text-slate-400' 
                : trend.isPositive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-amber-600 dark:text-amber-400'
            }`}>
              {trend.value}
            </span>
          )}
        </div>

        {subtext && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {subtext}
          </p>
        )}
      </div>

      {onClickDetail && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Nível 1 Sintético
          </span>
          <button
            type="button"
            onClick={onClickDetail}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#134F9F] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>{ctaText}</span>
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
};
