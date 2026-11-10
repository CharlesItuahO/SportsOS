import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';

// Module Components
import { CommandCenter } from './components/modules/CommandCenter/CommandCenter';
import { StrategyModule } from './components/modules/Strategy/StrategyModule';
import { ParticipationModule } from './components/modules/Participation/ParticipationModule';
import { PerformanceModule } from './components/modules/Performance/PerformanceModule';
import { CoachingModule } from './components/modules/Coaching/CoachingModule';
import { CompetitionsModule } from './components/modules/Competitions/CompetitionsModule';
import { PartnershipsModule } from './components/modules/Partnerships/PartnershipsModule';
import { FacilitiesModule } from './components/modules/Facilities/FacilitiesModule';
import { SafeguardingModule } from './components/modules/Safeguarding/SafeguardingModule';
import { DashboardsModule } from './components/modules/Dashboards/DashboardsModule';
import { SettingsModule } from './components/modules/Settings/SettingsModule';

const MainLayout: React.FC = () => {
  const { activeModule } = useApp();

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'command-center':
        return <CommandCenter />;
      case 'strategy':
        return <StrategyModule />;
      case 'participation':
        return <ParticipationModule />;
      case 'performance':
        return <PerformanceModule />;
      case 'coaching':
        return <CoachingModule />;
      case 'competitions':
        return <CompetitionsModule />;
      case 'partnerships':
        return <PartnershipsModule />;
      case 'facilities':
        return <FacilitiesModule />;
      case 'safeguarding':
        return <SafeguardingModule />;
      case 'insights':
        return <DashboardsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
          {renderActiveModule()}
        </main>
      </div>

      <CommandPalette />
      <NotificationsDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
