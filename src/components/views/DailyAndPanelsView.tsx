/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Daily e Painéis (Biblioteca & Histórico de Artefatos Gerados)
 * REGRA MANDATÓRIA: Exclusivamente catálogo e visualização dos painéis homologados.
 * Criação sob demanda é realizada estritamente pelo Agente Gerencial.
 */

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Sparkles, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft,
  Printer,
  Share2,
  FileText,
  Info
} from 'lucide-react';
import { ArtifactPanel, PanelTemplateType } from '../../types';
import { EvidenceBadge } from '../common/EvidenceBadge';

interface DailyAndPanelsViewProps {
  savedPanels: ArtifactPanel[];
  onNavigateToAgente: () => void;
  onOpenTicketById: (ticketId: number) => void;
}

export const DailyAndPanelsView: React.FC<DailyAndPanelsViewProps> = ({
  savedPanels,
  onNavigateToAgente,
  onOpenTicketById
}) => {
  const [selectedPanel, setSelectedPanel] = useState<ArtifactPanel | null>(null);
  const [templateFilter, setTemplateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'summary' | 'detail'>('summary');

  const filteredPanels = savedPanels.filter(p => {
    if (templateFilter !== 'all' && p.templateType !== templateFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchOwner = p.ownerName.toLowerCase().includes(q);
      const matchRef = p.referenceDate.toLowerCase().includes(q);
      if (!matchTitle && !matchOwner && !matchRef) return false;
    }
    return true;
  });

  return (
    <div className="p-2.5 sm:p-4 max-w-7xl w-full mx-auto space-y-3">
      {/* SE NÃO HOUVER PAINEL SELECIONADO: EXIBIR O CATÁLOGO (NÍVEL 1 SINTÉTICO) */}
      {!selectedPanel ? (
        <>
          {/* Banner de Governança da Biblioteca */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileSpreadsheet className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Biblioteca Oficial de Painéis e Dailies Operacionais
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Catálogo histórico de artefatos homologados · Versões auditadas e congeladas
              </p>
            </div>

            {/* Aviso e Botão Mandatório: Criação é no Agente Gerencial */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-slate-400">
                Novo painel sob demanda?
              </span>
              <button
                type="button"
                onClick={onNavigateToAgente}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Solicitar ao Agente Gerencial</span>
              </button>
            </div>
          </div>

          {/* Barra de Filtros e Busca do Catálogo */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar no histórico por título, autor ou data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={templateFilter}
                onChange={(e) => setTemplateFilter(e.target.value)}
                className="text-xs px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">Todos os Modelos</option>
                <option value="TPL-01">TPL-01 — Daily Operacional</option>
                <option value="TPL-02">TPL-02 — Alinhamento Semanal</option>
                <option value="TPL-03">TPL-03 — Feedback Individual</option>
                <option value="TPL-04">TPL-04 — Gestão de Projetos</option>
              </select>
            </div>

            <div className="text-slate-400 text-[11px] font-mono">
              {filteredPanels.length} artefatos catalogados
            </div>
          </div>

          {/* GRADE DE ARTEFATOS SALVOS (NÍVEL 1 SINTÉTICO) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPanels.map(panel => (
              <div
                key={panel.id}
                onClick={() => {
                  setSelectedPanel(panel);
                  setActiveTab('summary');
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-blue-500/50 cursor-pointer transition-all group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="font-mono font-bold text-[#134F9F] dark:text-blue-400">
                      {panel.templateType}
                    </span>
                    <span className="font-mono text-slate-400 text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {panel.source}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#134F9F] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {panel.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 italic">
                    "{panel.summary.headline}"
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div>
                      <span>Referência:</span>
                      <strong className="block text-slate-700 dark:text-slate-300 font-mono">{panel.referenceDate}</strong>
                    </div>
                    <div>
                      <span>Autor:</span>
                      <strong className="block text-slate-700 dark:text-slate-300 truncate">{panel.ownerName}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  <span>Abrir Painel Salvo</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* VISUALIZAÇÃO COMPLETA DO PAINEL SELECIONADO (NÍVEL 2 / ROLÁVEL COM AMBAS AS CAMADAS) */
        <div className="space-y-4">
          {/* Top Bar de Navegação do Painel */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSelectedPanel(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Catálogo de Painéis</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Exportar</span>
              </button>
            </div>
          </div>

          {/* Header Executivo do Painel Salvo */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#134F9F] dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {selectedPanel.templateName}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-mono text-emerald-500 font-semibold">
                    {selectedPanel.status}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 font-mono">
                    Versão {selectedPanel.version}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedPanel.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Data de Referência: <strong className="text-slate-700 dark:text-slate-300">{selectedPanel.referenceDate}</strong> · Gerado em: {selectedPanel.generationDate} · Fonte: {selectedPanel.source}
                </p>
              </div>

              {/* Seletor de Camada Semântica (Summary vs Detail) */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'summary'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Síntese Executiva (Summary)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('detail')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'detail'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Visão Analítica Completa (Detail)
                </button>
              </div>
            </div>

            {/* CONTEÚDO DA CAMADA SUMMARY (SINTÉTICA) */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Conclusão Sintética Principal
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    "{selectedPanel.summary.headline}"
                  </p>
                </div>

                {/* Métricas Sintéticas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedPanel.summary.metricsBrief.map((m, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-center">
                      <span className="text-[10px] text-slate-400 block">{m.label}</span>
                      <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5 block">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* As 3 Prioridades Principais */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    As 3 Prioridades Mandatórias
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {selectedPanel.summary.topPriorities.map((pri, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-mono font-bold text-[#134F9F] dark:text-blue-400">0{idx + 1}.</span>
                        <span>{pri}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decisões e Encaminhamentos */}
                <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-md text-xs text-blue-950 dark:text-blue-200">
                  <strong className="block mb-1">Decisões Registradas:</strong>
                  {selectedPanel.summary.keyDecisionsSummary}
                </div>
              </div>
            )}

            {/* CONTEÚDO DA CAMADA DETAIL (ANALÍTICA E ROLÁVEL) */}
            {activeTab === 'detail' && (
              <div className="space-y-6 pt-2">
                {selectedPanel.detail.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    <div className="pb-1.5 border-b border-slate-200 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {section.title}
                      </h3>
                      {section.description && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {section.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      {section.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="p-3 rounded bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {item.title}
                            </span>
                            {item.evidenceLevel && (
                              <EvidenceBadge level={item.evidenceLevel} size="sm" />
                            )}
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {item.description}
                          </p>
                          {(item.responsible || item.deadline || item.relatedTicketId) && (
                            <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                              {item.responsible && <span>Responsável: <strong className="text-slate-700 dark:text-slate-300">{item.responsible}</strong></span>}
                              {item.deadline && <span>Prazo: <strong className="text-slate-700 dark:text-slate-300 font-mono">{item.deadline}</strong></span>}
                              {item.relatedTicketId && (
                                <button
                                  type="button"
                                  onClick={() => onOpenTicketById(item.relatedTicketId!)}
                                  className="text-blue-600 dark:text-blue-400 font-semibold underline font-mono"
                                >
                                  Ver Chamado #{item.relatedTicketId}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {selectedPanel.detail.governanceNotes && (
                  <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                    <strong>Notas de Governança Institucional:</strong> {selectedPanel.detail.governanceNotes}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
