/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Portal de Gestão Operacional da TI do Instituto HEAL
 * Aplicação Central Integrada com Princípio UX "Sintético Primeiro, Analítico sob Demanda"
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationRoute, 
  CurrentUser, 
  Ticket, 
  Technician, 
  PendingItem, 
  AuditSnapshot, 
  ArtifactPanel,
  PopSpecification,
  OperationalCalculationSettings,
  NavMenuItemConfig
} from './types';
import { 
  MOCK_USERS, 
  MOCK_TICKETS, 
  MOCK_TECHNICIANS, 
  MOCK_PENDINGS, 
  MOCK_AUDITS, 
  MOCK_SAVED_PANELS 
} from './data/mockData';
import {
  DEFAULT_POP_SPEC,
  DEFAULT_CALCULATION_SETTINGS,
  DEFAULT_MENU_CONFIG
} from './data/settingsDefaults';

// Componentes de Layout
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Visualizações dos Módulos
import { OverviewView } from './components/views/OverviewView';
import { TicketsView } from './components/views/TicketsView';
import { TeamView } from './components/views/TeamView';
import { PendingsView } from './components/views/PendingsView';
import { AuditsView } from './components/views/AuditsView';
import { IndicatorsView } from './components/views/IndicatorsView';
import { AgenteGerencialView } from './components/views/AgenteGerencialView';
import { DailyAndPanelsView } from './components/views/DailyAndPanelsView';
import { TemplatesGuideView } from './components/views/TemplatesGuideView';
import { SettingsView } from './components/views/SettingsView';
import { LoginView } from './components/views/LoginView';

export default function App() {
  // Estado de Autenticação
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(MOCK_USERS[0]);

  // Estado de Rota Ativa
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>('visao-geral');

  // Estado de Tema Escuro / Claro
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Fonte de Dados Ativa (REALTIME vs SNAPSHOT_04H)
  const [dataSource, setDataSource] = useState<'REALTIME' | 'SNAPSHOT_04H'>('SNAPSHOT_04H');

  // Dados do Sistema
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [technicians, setTechnicians] = useState<Technician[]>(MOCK_TECHNICIANS);
  const [pendings, setPendings] = useState<PendingItem[]>(MOCK_PENDINGS);
  const [audits, setAudits] = useState<AuditSnapshot[]>(MOCK_AUDITS);
  const [savedPanels, setSavedPanels] = useState<ArtifactPanel[]>(MOCK_SAVED_PANELS);

  // Parâmetros de Governança, Regras POP-TIN-017 e Fórmulas de Cálculo
  const [popSpec, setPopSpec] = useState<PopSpecification>(DEFAULT_POP_SPEC);
  const [calculationSettings, setCalculationSettings] = useState<OperationalCalculationSettings>(DEFAULT_CALCULATION_SETTINGS);

  // Configuração e Ordem do Menu Lateral da Esquerda
  const [menuConfig, setMenuConfig] = useState<NavMenuItemConfig[]>(() => {
    try {
      const saved = localStorage.getItem('heal_ops_menu_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_MENU_CONFIG;
  });

  const handleUpdateMenuConfig = (newConfig: NavMenuItemConfig[]) => {
    setMenuConfig(newConfig);
    try {
      localStorage.setItem('heal_ops_menu_config', JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  // Estados de Transição e Parâmetros entre Módulos
  const [targetTicketId, setTargetTicketId] = useState<number | null>(null);
  const [agenteInitialPrompt, setAgenteInitialPrompt] = useState<string | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Estado de Sidebar Recolhida (auto-recolhimento inteligente ao acessar o Agente Gerencial)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Efeito para sincronizar a classe 'dark' no elemento raiz HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Alternância de Tema
  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Alternância de Fonte de Dados
  const handleToggleDataSource = () => {
    setDataSource(prev => (prev === 'REALTIME' ? 'SNAPSHOT_04H' : 'REALTIME'));
  };

  // Navegação entre rotas com auto-recolhimento no Agente
  const handleRouteChange = (route: NavigationRoute) => {
    setCurrentRoute(route);
    if (route === 'agente-gerencial') {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  };

  // Navegação direta para Chamado específico
  const handleNavigateToTicket = (ticketId: number) => {
    setTargetTicketId(ticketId);
    handleRouteChange('chamados');
  };

  // Solicitar ação no Agente vinda de outro módulo
  const handleOpenAgenteWithPrompt = (prompt: string) => {
    setAgenteInitialPrompt(prompt);
    handleRouteChange('agente-gerencial');
  };

  // Abrir chat do Agente Gerencial pelo Header
  const handleOpenAgenteChat = () => {
    handleRouteChange('agente-gerencial');
  };

  // Salvar artefato aprovado no catálogo de Daily e Painéis
  const handleSaveArtifact = (artifact: ArtifactPanel) => {
    setSavedPanels(prev => [artifact, ...prev]);
  };

  // Disparo de Auditoria Manual
  const handleTriggerManualAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const newAudit: AuditSnapshot = {
        id: `audit-${Date.now()}`,
        timestamp: '06/11/2026 10:10 (Manual)',
        type: 'MANUAL',
        totalTicketsEvaluated: 142,
        newPendingsCount: 3,
        persistentPendingsCount: 8,
        reopenedPendingsCount: 1,
        resolvedWithEvidenceCount: 12,
        rulesEvaluated: ['POP-TIN-017 v2.4', 'POP-TIN-008 v1.9', 'Instrução Normativa DTI 03/2026'],
        limitations: 'Varredura manual acionada pelo Gestor. Validação de hashes em andamento.',
        auditor: `${currentUser?.name || 'Gestor'} (Auditoria Manual)`,
        status: 'CONCLUIDO'
      };
      setAudits(prev => [newAudit, ...prev]);
      setIsAuditing(false);
    }, 1200);
  };

  // Sincronização manual com a réplica GLPI
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Se o usuário não estiver autenticado, exibir a tela de Login Institucional
  if (!currentUser) {
    return <LoginView onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  // Contadores para alertas de navegação
  const unassignedCount = tickets.filter(t => !t.hasNominalTech && t.status !== 'fechado' && t.status !== 'solucionado').length;
  const pendingAlertsCount = pendings.filter(p => p.status === 'PERSISTENT' || p.status === 'NEW').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar de Navegação Executiva (com suporte a Mobile/Tablet Off-Canvas, Ordem Personalizável e Auto-Recolhimento) */}
      <Sidebar
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
        currentUser={currentUser}
        onSwitchUser={(u) => setCurrentUser(u)}
        allUsers={MOCK_USERS}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onLogout={() => setCurrentUser(null)}
        unassignedCount={unassignedCount}
        pendingAlertsCount={pendingAlertsCount}
        dataSource={dataSource}
        onToggleDataSource={handleToggleDataSource}
        menuConfig={menuConfig}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar Contract */}
        <Header
          currentRoute={currentRoute}
          onOpenAgenteChat={handleOpenAgenteChat}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
          dataSource={dataSource}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* Viewport dos Módulos (Zero-Scroll para Desktop; rolagem nativa suave para Tablet e Celular) */}
        <main className={`flex-1 min-h-0 overflow-y-auto ${['chamados', 'equipe', 'pendencias', 'templates', 'agente-gerencial', 'daily-paineis', 'indicadores', 'configuracoes'].includes(currentRoute) ? 'lg:overflow-hidden lg:flex lg:flex-col' : 'overflow-y-auto'}`}>
          {currentRoute === 'visao-geral' && (
            <OverviewView
              tickets={tickets}
              latestAudit={audits[0]}
              onNavigateToTicket={handleNavigateToTicket}
              onNavigateToRoute={handleRouteChange}
              dataSource={dataSource}
            />
          )}

          {currentRoute === 'chamados' && (
            <TicketsView
              tickets={tickets}
              initialTicketId={targetTicketId}
              onClearInitialTicketId={() => setTargetTicketId(null)}
            />
          )}

          {currentRoute === 'equipe' && (
            <TeamView
              technicians={technicians}
              tickets={tickets}
              onOpenAgenteForFeedback={(name) => handleOpenAgenteWithPrompt(`Monte uma minuta de feedback individual fundamentado para ${name}.`)}
            />
          )}

          {currentRoute === 'pendencias' && (
            <PendingsView
              pendings={pendings}
              onOpenTicket={handleNavigateToTicket}
              popVersion={popSpec.version}
            />
          )}

          {currentRoute === 'auditorias' && (
            <AuditsView
              audits={audits}
              onTriggerManualAudit={handleTriggerManualAudit}
              isAuditing={isAuditing}
            />
          )}

          {currentRoute === 'indicadores' && (
            <IndicatorsView />
          )}

          {currentRoute === 'agente-gerencial' && (
            <AgenteGerencialView
              tickets={tickets}
              technicians={technicians}
              pendings={pendings}
              onSaveArtifactToCatalog={handleSaveArtifact}
              onNavigateToSavedPanels={() => handleRouteChange('daily-paineis')}
              initialPrompt={agenteInitialPrompt}
              onClearInitialPrompt={() => setAgenteInitialPrompt(undefined)}
            />
          )}

          {currentRoute === 'daily-paineis' && (
            <DailyAndPanelsView
              savedPanels={savedPanels}
              onNavigateToAgente={() => handleRouteChange('agente-gerencial')}
              onOpenTicketById={handleNavigateToTicket}
            />
          )}

          {currentRoute === 'templates' && (
            <TemplatesGuideView
              onOpenAgenteForTemplate={(code) => handleOpenAgenteWithPrompt(`Gere um relatório estruturado no modelo ${code} com base nas evidências atuais.`)}
            />
          )}

          {currentRoute === 'configuracoes' && (
            <SettingsView
              currentUser={currentUser}
              isDarkMode={isDarkMode}
              onToggleTheme={handleToggleTheme}
              dataSource={dataSource}
              onToggleDataSource={handleToggleDataSource}
              popSpec={popSpec}
              onUpdatePopSpec={(s) => setPopSpec(s)}
              calculationSettings={calculationSettings}
              onUpdateCalculationSettings={(c) => setCalculationSettings(c)}
              menuConfig={menuConfig}
              onUpdateMenuConfig={handleUpdateMenuConfig}
            />
          )}
        </main>
      </div>
    </div>
  );
}
