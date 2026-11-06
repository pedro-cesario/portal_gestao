/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Auditorias & Snapshots 04h
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Play, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  Info,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { AuditSnapshot } from '../../types';
import { DetailDrawer } from '../common/DetailDrawer';

interface AuditsViewProps {
  audits: AuditSnapshot[];
  onTriggerManualAudit: () => void;
  isAuditing: boolean;
}

export const AuditsView: React.FC<AuditsViewProps> = ({
  audits,
  onTriggerManualAudit,
  isAuditing
}) => {
  const [selectedAudit, setSelectedAudit] = useState<AuditSnapshot | null>(null);
  const latest = audits[0];
  const previous = audits[1];

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-4">
      {/* NÍVEL 1 SINTÉTICO: CARTÃO EXECUTIVO DO SNAPSHOT DAS 04H */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Snapshot Canônico Oficial
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-500 font-mono">Agendamento Diário às 04h00</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Snapshot de Auditoria Noturna: {latest.timestamp}
            </h2>
          </div>

          <button
            type="button"
            onClick={onTriggerManualAudit}
            disabled={isAuditing}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Executando Auditoria...' : 'Executar Auditoria Manual Controlada'}</span>
          </button>
        </div>

        {/* Métricas do Snapshot Atual vs Anterior */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            <span className="text-[11px] text-slate-400 block">Chamados Avaliados</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 block">
              {latest.totalTicketsEvaluated}
            </span>
            <span className="text-[10px] text-slate-500">
              {previous ? `vs ${previous.totalTicketsEvaluated} no anterior` : ''}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            <span className="text-[11px] text-slate-400 block">Novas Pendências</span>
            <span className="text-xl font-bold font-mono text-amber-500 mt-1 block">
              +{latest.newPendingsCount}
            </span>
            <span className="text-[10px] text-amber-600/80">Requerem triagem gerencial</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            <span className="text-[11px] text-slate-400 block">Persistentes (&gt;24h)</span>
            <span className="text-xl font-bold font-mono text-rose-500 mt-1 block">
              {latest.persistentPendingsCount}
            </span>
            <span className="text-[10px] text-slate-500">Sem evolução comprovada</span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
            <span className="text-[11px] text-slate-400 block">Resolvidas com Evidência</span>
            <span className="text-xl font-bold font-mono text-emerald-500 mt-1 block">
              {latest.resolvedWithEvidenceCount}
            </span>
            <span className="text-[10px] text-emerald-600/80">Conforme POP-TIN-017</span>
          </div>
        </div>

        {/* Limitações Técnicas & Rastreabilidade */}
        <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-700 dark:text-slate-300">Rastreabilidade e Limitações:</strong> {latest.limitations}
          </div>
        </div>
      </div>

      {/* HISTÓRICO COMPARATIVO DE AUDITORIAS (NÍVEL 2 ANALÍTICO) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>Histórico de Snapshots Diários & Auditorias Manuais</span>
          <span className="font-normal text-slate-400 text-[11px]">Clique em um registro para ver a trilha analítica</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {audits.map(audit => (
            <div
              key={audit.id}
              onClick={() => setSelectedAudit(audit)}
              className="p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-xs ${
                  audit.type === 'SNAPSHOT_04H' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  {audit.type === 'SNAPSHOT_04H' ? '04h' : 'MAN'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {audit.timestamp}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({audit.type})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Executor: {audit.auditor} · Avaliados: <strong className="text-slate-300 font-mono">{audit.totalTicketsEvaluated}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono">
                  <span className="text-amber-500 font-semibold">+{audit.newPendingsCount} novas</span>
                  <span className="text-rose-500 font-semibold">{audit.persistentPendingsCount} persistentes</span>
                  <span className="text-emerald-500 font-semibold">{audit.resolvedWithEvidenceCount} resolvidas</span>
                </div>

                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                  Ver Trilha →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DRAWER DE TRILHA ANALÍTICA DA AUDITORIA */}
      {selectedAudit && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedAudit(null)}
          title={`Auditoria ${selectedAudit.timestamp}`}
          subtitle={`Tipo: ${selectedAudit.type} · Executor: ${selectedAudit.auditor}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Regras Institucionais Validadas
              </span>
              <ul className="list-disc pl-4 mt-2 space-y-1 font-mono text-slate-800 dark:text-slate-200">
                {selectedAudit.rulesEvaluated.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                <span className="text-slate-400 text-[10px] block">Novas Pendências</span>
                <span className="text-lg font-bold font-mono text-amber-500">+{selectedAudit.newPendingsCount}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                <span className="text-slate-400 text-[10px] block">Resolvidas com Evidência</span>
                <span className="text-lg font-bold font-mono text-emerald-500">{selectedAudit.resolvedWithEvidenceCount}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Limitações Técnicas Declaradas
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedAudit.limitations}
              </p>
            </div>
          </div>
        </DetailDrawer>
      )}
    </div>
  );
};
