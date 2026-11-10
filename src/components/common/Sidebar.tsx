import React, { useState } from 'react';
import { useApp, ActiveModule } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  Trophy, 
  Award, 
  Swords, 
  Handshake, 
  Building, 
  ShieldCheck, 
  BarChart3, 
  Settings as SettingsIcon,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';

interface NavItem {
  id: ActiveModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subtabs: { id: string; label: string }[];
  badgeCount?: number;
}

export const Sidebar: React.FC = () => {
  const { 
    activeModule, 
    activeSubtab, 
    navigateTo, 
    currentRole,
    injuries,
    coaches,
    fixtures,
    campsAndTours
  } = useApp();

  const [collapsed, setCollapsed] = useState(false);

  // Dynamic alert badges
  const vettingAtRisk = coaches.filter(c => c.vettingStatus === 'Expiring Soon').length;
  const pendingRTP = injuries.filter(i => i.returnToPlayStatus === 'MEDICAL_CLEARANCE_REQUIRED').length;
  const clashCount = fixtures.filter(f => f.hasClash && !f.clashOverridden).length;
  const pendingCamps = campsAndTours.filter(c => !c.safeguardingApproved).length;

  const navItems: NavItem[] = [
    {
      id: 'command-center',
      label: 'Command Center',
      icon: LayoutDashboard,
      subtabs: [
        { id: 'overview', label: 'Executive Overview' },
        { id: 'risks-movers', label: 'Risks & Movers' }
      ]
    },
    {
      id: 'strategy',
      label: 'Strategy & Leadership',
      icon: Target,
      subtabs: [
        { id: 'canvas', label: 'Strategy Canvas' },
        { id: 'operating-plan', label: 'Operating Plan' },
        { id: 'calendar', label: 'Master Sports Calendar' },
        { id: 'budget', label: 'Budget & Variance' },
        { id: 'scorecard', label: 'Performance Scorecard' }
      ]
    },
    {
      id: 'participation',
      label: 'Participation & Wellbeing',
      icon: Users,
      subtabs: [
        { id: 'overview', label: 'Participation Overview' },
        { id: 'students', label: 'Student Roster' },
        { id: 'curriculum', label: 'PE Curriculum Matrix' },
        { id: 'wellbeing', label: 'Wellbeing Pulse' }
      ]
    },
    {
      id: 'performance',
      label: 'Performance & Pathways',
      icon: Trophy,
      subtabs: [
        { id: 'teams', label: 'Squad Directory' },
        { id: 'athletes', label: 'Athlete Profiles' },
        { id: 'pathways', label: 'Talent Pathway Board' },
        { id: 'benchmarks', label: 'Physical Benchmarks' },
        { id: 'links', label: 'Scouts & External Links' }
      ]
    },
    {
      id: 'coaching',
      label: 'Coaching & Culture',
      icon: Award,
      badgeCount: vettingAtRisk > 0 ? vettingAtRisk : undefined,
      subtabs: [
        { id: 'roster', label: 'Coach Roster' },
        { id: 'standards', label: 'Standards Framework' },
        { id: 'observations', label: 'Observations & Rubrics' },
        { id: 'pd', label: 'CPD & Certifications' },
        { id: 'recruitment', label: 'Recruitment Pipeline' }
      ]
    },
    {
      id: 'competitions',
      label: 'Competitions & Events',
      icon: Swords,
      badgeCount: clashCount > 0 ? clashCount : undefined,
      subtabs: [
        { id: 'fixtures', label: 'Fixtures & Clash Detector' },
        { id: 'calendar', label: 'Competition Calendar' },
        { id: 'hosting', label: 'Hosting Plans' },
        { id: 'results', label: 'Results & Match Reports' },
        { id: 'showcases', label: 'Showcases & Run-Sheets' }
      ]
    },
    {
      id: 'partnerships',
      label: 'Partnerships & Camps',
      icon: Handshake,
      badgeCount: pendingCamps > 0 ? pendingCamps : undefined,
      subtabs: [
        { id: 'registry', label: 'Partnership Registry' },
        { id: 'camps', label: 'Camps & Tours' },
        { id: 'visitors', label: 'Visiting Specialists' }
      ]
    },
    {
      id: 'facilities',
      label: 'Facilities & Operations',
      icon: Building,
      subtabs: [
        { id: 'inventory', label: 'Facility Inventory' },
        { id: 'booking', label: 'Booking Matrix' },
        { id: 'equipment', label: 'Equipment Register' },
        { id: 'risks', label: 'Risk Assessments' }
      ]
    },
    {
      id: 'safeguarding',
      label: 'Safeguarding & Returns',
      icon: ShieldCheck,
      badgeCount: pendingRTP > 0 ? pendingRTP : undefined,
      subtabs: [
        { id: 'returns', label: 'Return-to-Play Protocol' },
        { id: 'vetting', label: 'Vetting Register' },
        { id: 'incidents', label: 'Incident Log' },
        { id: 'injuries', label: 'Injury Surveillance' }
      ]
    },
    {
      id: 'insights',
      label: 'Insights & Dashboards',
      icon: BarChart3,
      subtabs: [
        { id: 'command-center', label: '1. Executive Scorecard' },
        { id: 'participation', label: '2. Participation Heatmap' },
        { id: 'performance', label: '3. Athlete Progression' },
        { id: 'facilities', label: '4. Facility Utilization' },
        { id: 'coaching', label: '5. Coach Load & Performance' },
        { id: 'safeguarding', label: '6. Risk & Safeguarding' },
        { id: 'financial', label: 'Financial & ROI' },
        { id: 'benchmarks', label: 'Peer Benchmarking' },
        { id: 'stories', label: 'Stories & Admissions Bank' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings & Audit Log',
      icon: SettingsIcon,
      subtabs: [
        { id: 'roles', label: 'Roles & Governance' },
        { id: 'campuses', label: 'Campus Provisioning' },
        { id: 'retention', label: 'Data Retention' },
        { id: 'audit-log', label: 'Live Audit Log' }
      ]
    }
  ];

  return (
    <aside 
      className={`h-[calc(100vh-4rem)] bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 select-none transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Top: Collapse toggle */}
      <div className="p-3 border-b border-[#F1F5F9] flex items-center justify-between">
        {!collapsed && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7480]">
            Command Modules
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-[#F1F5F9] text-[#6B7480] hover:text-[#0F2740] ml-auto transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <div key={item.id} className="space-y-0.5">
              <button
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors text-left relative ${
                  isActive 
                    ? 'bg-[#0F2740] text-white shadow-xs' 
                    : 'text-[#3F4B5A] hover:bg-[#F8FAFC] hover:text-[#0F2740]'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F26B1D]' : 'text-[#6B7480]'}`} />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    {item.badgeCount && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-[#F26B1D] text-white' : 'bg-[#D14343] text-white'
                      }`}>
                        {item.badgeCount}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Subtabs rendered if this module is active and sidebar is expanded */}
              {isActive && !collapsed && item.subtabs.length > 0 && (
                <div className="ml-6 pl-2 border-l border-[#CBD5E1] my-1 space-y-0.5">
                  {item.subtabs.map(sub => {
                    const isSubActive = activeSubtab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => navigateTo(item.id, sub.id)}
                        className={`w-full text-left py-1 px-2 rounded text-[11px] truncate block transition-colors ${
                          isSubActive 
                            ? 'font-semibold text-[#F26B1D] bg-[#F26B1D]/5' 
                            : 'text-[#6B7480] hover:text-[#0F2740] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-[#F1F5F9] bg-[#F8FAFC] text-[11px] text-[#6B7480]">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#0F2740]">SportsOS Core v4.2</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
              Live
            </span>
          </div>
          <p className="text-[10px] text-[#9AA3B0] mt-0.5">Connected: 3 Campuses · 400+ Pupils</p>
        </div>
      )}
    </aside>
  );
};
