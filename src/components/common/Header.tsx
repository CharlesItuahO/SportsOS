import React from 'react';
import { useApp } from '../../context/AppContext';
import { CampusId, RoleType, TermId } from '../../types';
import { 
  Building2, 
  Calendar, 
  UserCheck, 
  Search, 
  Bell, 
  Sliders, 
  ShieldAlert,
  ChevronDown,
  Layers,
  Plus
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    selectedCampus, 
    setSelectedCampus, 
    campuses,
    selectedTerm, 
    setSelectedTerm, 
    terms,
    currentRole, 
    setCurrentRole,
    density,
    setDensity,
    setSearchOpen,
    notificationsOpen,
    setNotificationsOpen,
    setCreateCampusModalOpen,
    injuries,
    coaches,
    fixtures
  } = useApp();

  // Calculate urgent notification count
  const pendingVetting = coaches.filter(c => c.vettingStatus === 'Expiring Soon').length;
  const pendingMedical = injuries.filter(i => i.returnToPlayStatus === 'MEDICAL_CLEARANCE_REQUIRED').length;
  const pendingClash = fixtures.filter(f => f.hasClash && !f.clashOverridden).length;
  const totalAlerts = pendingVetting + pendingMedical + pendingClash;

  const roleLabels: Record<RoleType, string> = {
    HEAD_OF_SPORTS: 'Head of Sports (School)',
    CAMPUS_SPORTS_LEAD: 'Campus Sports Lead',
    COACH: 'Lead Coach',
    PE_TEACHER: 'PE Curriculum Teacher',
    MEDICAL: 'Lead Medical Officer',
    PASTORAL: 'Pastoral / Safeguarding',
    OPERATIONS: 'Facilities & Ops',
    LEADERSHIP: 'School Leadership (Read-Only)',
    STUDENT: 'Student Portal',
    PARENT: 'Parent Portal',
    ADMIN: 'System Admin'
  };

  return (
    <header className="h-16 bg-[#0F2740] text-white border-b border-[#1E3A5A] px-5 flex items-center justify-between gap-4 sticky top-0 z-40 select-none">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-[#F26B1D] flex items-center justify-center font-bold text-lg text-white shadow-sm tracking-tight">
          S
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white">SportsOS</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#1E3A5A] text-[#9AA3B0] px-1.5 py-0.5 rounded">
              Command
            </span>
          </div>
          <p className="text-[11px] text-[#9AA3B0] leading-none">Head of Sports Operations</p>
        </div>
      </div>

      {/* Zone 2: Global Scoping Selectors */}
      <div className="hidden lg:flex items-center gap-2.5">
        {/* Campus Switcher */}
        <div className="flex items-center gap-1.5 bg-[#173250] border border-[#23456B] rounded-md px-2.5 py-1.5 text-xs">
          <Building2 className="w-3.5 h-3.5 text-[#F26B1D]" />
          <span className="text-[#9AA3B0] font-medium">Campus:</span>
          <select 
            value={selectedCampus}
            onChange={(e) => {
              if (e.target.value === '__NEW__') {
                setCreateCampusModalOpen(true);
              } else {
                setSelectedCampus(e.target.value as CampusId);
              }
            }}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="ALL" className="bg-[#0F2740] text-white">All Campuses (Consolidated)</option>
            {campuses.map(c => (
              <option key={c.id} value={c.id} className="bg-[#0F2740] text-white">
                {c.name}
              </option>
            ))}
            <option value="__NEW__" className="bg-[#0F2740] text-[#F26B1D] font-bold">
              + Provision New Campus...
            </option>
          </select>
          <button
            onClick={() => setCreateCampusModalOpen(true)}
            className="ml-1 p-0.5 rounded text-[#9AA3B0] hover:text-[#F26B1D] hover:bg-[#204268] transition-colors"
            title="Provision New Campus"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Term Switcher */}
        <div className="flex items-center gap-1.5 bg-[#173250] border border-[#23456B] rounded-md px-2.5 py-1.5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-[#9AA3B0]" />
          <span className="text-[#9AA3B0] font-medium">Term:</span>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value as TermId)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
          >
            {terms.map(t => (
              <option key={t.id} value={t.id} className="bg-[#0F2740] text-white">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Role Persona Switcher (For live testing and verification) */}
        <div className="flex items-center gap-1.5 bg-[#173250] border border-[#23456B] rounded-md px-2.5 py-1.5 text-xs">
          <UserCheck className="w-3.5 h-3.5 text-[#1E8A5A]" />
          <span className="text-[#9AA3B0] font-medium">Role:</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as RoleType)}
            className="bg-transparent text-[#E2E8F0] font-medium focus:outline-none cursor-pointer pr-1"
          >
            {Object.entries(roleLabels).map(([roleKey, label]) => (
              <option key={roleKey} value={roleKey} className="bg-[#0F2740] text-white">
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zone 3: Interactive Affordances */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Command Search Button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 bg-[#173250] hover:bg-[#204268] text-[#9AA3B0] hover:text-white border border-[#23456B] rounded-md px-2.5 py-1.5 text-xs transition-colors"
          title="Quick search across all modules"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Quick Find</span>
          <kbd className="hidden md:inline font-mono text-[10px] bg-[#0F2740] px-1.5 py-0.5 rounded text-[#9AA3B0]">
            ⌘K
          </kbd>
        </button>

        {/* Density Toggle */}
        <button
          onClick={() => setDensity(density === 'compact' ? 'comfortable' : 'compact')}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-md border flex items-center gap-1.5 transition-colors ${
            density === 'compact' 
              ? 'bg-[#173250] border-[#F26B1D] text-[#F26B1D]' 
              : 'bg-[#173250] border-[#23456B] text-[#9AA3B0] hover:text-white'
          }`}
          title="Toggle Comfort / Compact density"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline capitalize">{density}</span>
        </button>

        {/* Notifications & Urgent Alerts */}
        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="relative p-2 bg-[#173250] hover:bg-[#204268] border border-[#23456B] rounded-md text-[#9AA3B0] hover:text-white transition-colors"
          title="Urgent Alerts & Action Items"
        >
          <Bell className="w-4 h-4" />
          {totalAlerts > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D14343] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {totalAlerts}
            </span>
          )}
        </button>

        {/* Profile Chip */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#23456B]">
          <div className="w-7 h-7 rounded-full bg-[#1E3A5A] border border-[#3F4B5A] flex items-center justify-center text-xs font-bold text-white">
            AV
          </div>
          <div className="text-left hidden xl:block leading-tight">
            <p className="text-xs font-medium text-white">Alastair Vance</p>
            <p className="text-[10px] text-[#9AA3B0]">Head of Sports</p>
          </div>
        </div>
      </div>
    </header>
  );
};
