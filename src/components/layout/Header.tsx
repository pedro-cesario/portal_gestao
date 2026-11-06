/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Top Header Bar Contract
 * Totalmente responsivo para Desktop, Tablet e Celular
 */

import React from 'react';
import { Sparkles, RefreshCw, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { NavigationRoute } from '../../types';

interface HeaderProps {
  currentRoute: NavigationRoute;
  onOpenAgenteChat: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  dataSource: 'REALTIME' | 'SNAPSHOT_04H';
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onOpenAgenteChat,
  onRefreshData,
  isRefreshing,
  dataSource,
  isCollapsed = false,
  onToggleCollapse,
  onToggleMobileMenu
}) => {
  const routeTitles: Record<NavigationRoute, { title: string; subtitle: string }> = {
    'visao-geral': { title: 'Visão Geral Operacional', subtitle: 'Central de comando, riscos e prioridades do plantão' },
    'chamados': { title: 'Gestão de Chamados GLPI', subtitle: 'Atribuição nominal, evolução documentada e evidências' },
    'equipe': { title: 'Equipe Técnica & Carteiras', subtitle: 'Capacidade, distribuição de carga e feedback factual' },
    'pendencias': { title: 'Backlog Canônico de Pendências', subtitle: 'Auditoria de conformidade documental e regras POP-TIN-017' },
    'auditorias': { title: 'Auditorias & Snapshots Diários', subtitle: 'Controle de snapshot 04h e rastreabilidade temporal' },
    'indicadores': { title: 'Indicadores & Analytics', subtitle: 'Tendências de abertura, resolução observada e qualidade documental' },
    'agente-gerencial': { title: 'Agente Gerencial', subtitle: 'Copiloto de gestão operacional, análises e geração de painéis' },
    'daily-paineis': { title: 'Daily e Painéis (Biblioteca)', subtitle: 'Catálogo e consulta histórica dos artefatos gerados' },
    'templates': { title: 'Catálogo de Modelos & Templates', subtitle: 'Padrões institucionais HEAL para relatórios gerenciais' },
    'configuracoes': { title: 'Configurações & Parâmetros', subtitle: 'Parâmetros de governança, réplica GLPI e regras' },
  };

  const currentInfo = routeTitles[currentRoute] || { title: 'HEAL Ops', subtitle: 'Gestão TI' };

  return (
    <header className="h-14 px-3 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-3 sm:gap-6 shrink-0 select-none">
      {/* Zone 1: Hamburger Menu on Mobile/Tablet + Desktop Toggle + Breadcrumb and Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 -ml-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}

        <span className="text-xs font-semibold uppercase tracking-wider text-[#134F9F] dark:text-blue-400 shrink-0">
          HEAL Ops
        </span>
        <span className="text-slate-300 dark:text-slate-700 hidden xs:inline" aria-hidden="true">/</span>
        <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
          {currentInfo.title}
        </h1>
        <span className="hidden xl:inline text-xs text-slate-500 dark:text-slate-400 font-normal truncate">
          — {currentInfo.subtitle}
        </span>
      </div>

      {/* Zone 2: Contextual source marker (Tablet & Desktop) */}
      <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>GLPI MariaDB RO</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>Fonte: {dataSource}</span>
        </div>
      </div>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onRefreshData}
          disabled={isRefreshing}
          className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Sincronizar com réplica GLPI"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#134F9F]' : ''}`} />
        </button>

        <button
          type="button"
          onClick={onOpenAgenteChat}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-[#0d3873] rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline whitespace-nowrap">Agente Gerencial</span>
          <span className="sm:hidden">Agente</span>
        </button>
      </div>
    </header>
  );
};
