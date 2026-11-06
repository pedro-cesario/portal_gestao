/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Pendências & Backlog Canônico
 * Estados canônicos, 4 camadas de evidência, regras POP-TIN-017 vigentes
 * Apresentação em CARDS SEM SCROLL com Paginação Conectada
 */

import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  History, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Clock,
  Filter,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { PendingItem, CanonicalPendingStatus, EvidenceLevel } from '../../types';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { DetailDrawer } from '../common/DetailDrawer';
import { Modal } from '../common/Modal';

interface PendingsViewProps {
  pendings: PendingItem[];
  onOpenTicket: (ticketId: number) => void;
  popVersion?: string;
}

export const PendingsView: React.FC<PendingsViewProps> = ({
  pendings,
  onOpenTicket,
  popVersion = 'v2.4'
}) => {
  const [selectedPending, setSelectedPending] = useState<PendingItem | null>(null);
  const [quickPreviewPending, setQuickPreviewPending] = useState<PendingItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [evidenceFilter, setEvidenceFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6; // 6 cards para garantia de zero scroll vertical

  // Contadores por estado canônico
  const countByStatus: Record<CanonicalPendingStatus, number> = useMemo(() => ({
    NEW: pendings.filter(p => p.status === 'NEW').length,
    PERSISTENT: pendings.filter(p => p.status === 'PERSISTENT').length,
    REOPENED: pendings.filter(p => p.status === 'REOPENED').length,
    WAITING_EXTERNAL: pendings.filter(p => p.status === 'WAITING_EXTERNAL').length,
    INCONCLUSIVE: pendings.filter(p => p.status === 'INCONCLUSIVE').length,
    RESOLVED_WITH_EVIDENCE: pendings.filter(p => p.status === 'RESOLVED_WITH_EVIDENCE').length,
  }), [pendings]);

  const filtered = useMemo(() => {
    return pendings.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (evidenceFilter !== 'all' && p.evidenceLevel !== evidenceFilter) return false;
      return true;
    });
  }, [pendings, statusFilter, evidenceFilter]);

  // Paginação
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPendings = filtered.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  return (
    <div className="h-full flex flex-col p-2.5 sm:p-3.5 max-w-7xl w-full mx-auto lg:overflow-hidden overflow-y-auto gap-2">
      {/* NÍVEL 1 SINTÉTICO: RESUMO DO BACKLOG CANÔNICO (COMPACTO) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 shadow-xs shrink-0 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Backlog Canônico de Não-Conformidades & Auditoria (POP-TIN-017 {popVersion})
            </h2>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Total: {pendings.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">Camadas:</span>
            <div className="flex items-center gap-1">
              <EvidenceBadge level="Fato confirmado" size="sm" />
              <EvidenceBadge level="Indício de desconformidade" size="sm" />
              <EvidenceBadge level="Verificação necessária" size="sm" />
              <EvidenceBadge level="Desconformidade confirmada" size="sm" />
            </div>
          </div>
        </div>

        {/* Distribuição por Estado Canônico (Filtros Rápidos) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === 'NEW' ? 'all' : 'NEW');
              setCurrentPage(1);
            }}
            className={`p-1.5 rounded border text-left transition-colors cursor-pointer ${
              statusFilter === 'NEW'
                ? 'bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[9px] text-slate-400 uppercase font-mono block">NEW (Novas)</span>
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{countByStatus.NEW}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === 'PERSISTENT' ? 'all' : 'PERSISTENT');
              setCurrentPage(1);
            }}
            className={`p-1.5 rounded border text-left transition-colors cursor-pointer ${
              statusFilter === 'PERSISTENT'
                ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[9px] text-slate-400 uppercase font-mono block">PERSISTENT (&gt;24h)</span>
            <span className="text-sm font-bold font-mono text-amber-500">{countByStatus.PERSISTENT}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === 'REOPENED' ? 'all' : 'REOPENED');
              setCurrentPage(1);
            }}
            className={`p-1.5 rounded border text-left transition-colors cursor-pointer ${
              statusFilter === 'REOPENED'
                ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-bold'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[9px] text-slate-400 uppercase font-mono block">REOPENED</span>
            <span className="text-sm font-bold font-mono text-rose-500">{countByStatus.REOPENED}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === 'WAITING_EXTERNAL' ? 'all' : 'WAITING_EXTERNAL');
              setCurrentPage(1);
            }}
            className={`p-1.5 rounded border text-left transition-colors cursor-pointer ${
              statusFilter === 'WAITING_EXTERNAL'
                ? 'bg-indigo-500/15 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[9px] text-slate-400 uppercase font-mono block">EXTERNO</span>
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{countByStatus.WAITING_EXTERNAL}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === 'INCONCLUSIVE' ? 'all' : 'INCONCLUSIVE');
              setCurrentPage(1);
            }}
            className={`p-1.5 rounded border text-left transition-colors cursor-pointer ${
              statusFilter === 'INCONCLUSIVE'
                ? 'bg-slate-500/15 border-slate-500 text-slate-600 dark:text-slate-300 font-bold'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[9px] text-slate-400 uppercase font-mono block">INCONCLUSIVO</span>
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{countByStatus.INCONCLUSIVE}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter(statusFilter === 'RESOLVED_WITH_EVIDENCE' ? 'all' : 'RESOLVED_WITH_EVIDENCE');
              setCurrentPage(1);
            }}
            className={`p-1.5 rounded border text-left transition-colors cursor-pointer ${
              statusFilter === 'RESOLVED_WITH_EVIDENCE'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="text-[9px] text-slate-400 uppercase font-mono block">RESOLVIDO (EVID.)</span>
            <span className="text-sm font-bold font-mono text-emerald-500">{countByStatus.RESOLVED_WITH_EVIDENCE}</span>
          </button>
        </div>
      </div>

      {/* GRADE DE CARDS DE PENDÊNCIAS (2x3 SEM SCROLL NO DESKTOP, RESPONSIVO EM TABLET/CELULAR) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 content-start overflow-y-auto lg:overflow-hidden">
        {paginatedPendings.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
            Nenhuma pendência encontrada para o filtro selecionado.
          </div>
        ) : (
          paginatedPendings.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedPending(item)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-col justify-between hover:border-blue-500/60 cursor-pointer transition-all group shadow-xs"
            >
              <div>
                {/* Linha Superior: Fingerprint, Estado e Botão Aumentar */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded truncate">
                      {item.stableFingerprint}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      item.status === 'RESOLVED_WITH_EVIDENCE' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : item.status === 'PERSISTENT' 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickPreviewPending(item);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      title="Aumentar Visualização da Pendência"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Título e Chamado Relacionado */}
                <div className="flex items-center gap-1 text-[11px] mb-1">
                  <span className="font-mono font-bold text-[#134F9F] dark:text-blue-400">
                    Chamado #{item.ticketId}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 truncate">{item.groupName}</span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#134F9F] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {item.ticketTitle}
                </h3>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Camada de Evidência & Regra */}
                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <EvidenceBadge level={item.evidenceLevel} size="sm" />
                  <span className="font-mono text-slate-500 font-semibold">{item.popRule}</span>
                </div>
              </div>

              {/* Rodapé do Card */}
              <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate max-w-[150px]">
                  Resp: <strong className="text-slate-700 dark:text-slate-300">{item.assignedTechnicianName || 'Sem técnico'}</strong>
                </span>

                <span className="font-semibold text-[#134F9F] dark:text-blue-400 group-hover:underline flex items-center gap-1 shrink-0">
                  <span>Auditar</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BARRA DE PAGINAÇÃO CONECTADA (SEM SCROLL) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 flex items-center justify-between text-xs text-slate-500 shadow-xs shrink-0">
        <div>
          Mostrando <strong className="text-slate-900 dark:text-slate-100 font-mono">{paginatedPendings.length}</strong> de <strong className="font-mono">{filtered.length}</strong> pendências
          <span className="hidden sm:inline text-slate-400"> · Visualização em cards sem scroll vertical</span>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Página <strong className="text-slate-900 dark:text-slate-100 font-mono">{safeCurrentPage}</strong> de <strong className="font-mono">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Próxima</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE AUMENTAR VISUALIZAÇÃO RÁPIDA DE UM CARD */}
      {quickPreviewPending && (
        <Modal
          isOpen={true}
          onClose={() => setQuickPreviewPending(null)}
          title={`Visualização Ampliada — Pendência ${quickPreviewPending.stableFingerprint}`}
          subtitle={`Referente ao Chamado #${quickPreviewPending.ticketId}`}
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1.5">
                <EvidenceBadge level={quickPreviewPending.evidenceLevel} />
                <span className="font-mono text-[10px] text-slate-400">Regra: {quickPreviewPending.popRule}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {quickPreviewPending.ticketTitle}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {quickPreviewPending.description}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Fundamentação e Evidências:</h4>
              <p className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                {quickPreviewPending.evidenceNotes}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setQuickPreviewPending(null)}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = quickPreviewPending;
                  setQuickPreviewPending(null);
                  setSelectedPending(p);
                }}
                className="px-3.5 py-1.5 text-white bg-[#134F9F] hover:bg-blue-800 font-semibold rounded cursor-pointer"
              >
                Abrir Gaveta Completa de Trilha
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* DRAWER DE EVIDÊNCIA E TRILHA DE TRANSIÇÃO (NÍVEL 3) */}
      {selectedPending && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedPending(null)}
          title={`Auditoria da Pendência ${selectedPending.stableFingerprint}`}
          subtitle={`Referente ao Chamado #${selectedPending.ticketId}`}
          badge={<EvidenceBadge level={selectedPending.evidenceLevel} />}
          footerActions={
            <>
              <button
                type="button"
                onClick={() => setSelectedPending(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                Voltar à Lista
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = selectedPending.ticketId;
                  setSelectedPending(null);
                  onOpenTicket(id);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Abrir Chamado #{selectedPending.ticketId}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Regra Aplicada da Auditoria
              </span>
              <p className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                {selectedPending.popRule}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Notas de Evidência e Fundamentação
              </h4>
              <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 leading-relaxed">
                {selectedPending.evidenceNotes}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-blue-500" />
                <span>Trilha de Transições de Estado</span>
              </h4>
              <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                {selectedPending.transitionHistory.map((tr, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-200">
                        {tr.from} → {tr.to}
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">{tr.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                      {tr.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DetailDrawer>
      )}
    </div>
  );
};
