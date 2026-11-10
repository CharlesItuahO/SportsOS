import React, { useState, useEffect } from 'react';
import { useApp, ActiveModule } from '../../context/AppContext';
import { 
  Search, 
  X, 
  Users, 
  Trophy, 
  Building, 
  ShieldCheck, 
  Target, 
  ArrowRight,
  User
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { 
    searchOpen, 
    setSearchOpen, 
    students, 
    coaches, 
    teams, 
    facilities, 
    navigateTo 
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedStudents = trimmed
    ? students.filter(s => 
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(trimmed) ||
        s.sports.some(sp => sp.toLowerCase().includes(trimmed))
      ).slice(0, 4)
    : [];

  const matchedCoaches = trimmed
    ? coaches.filter(c => 
        c.name.toLowerCase().includes(trimmed) ||
        c.sports.some(sp => sp.toLowerCase().includes(trimmed))
      ).slice(0, 3)
    : [];

  const matchedTeams = trimmed
    ? teams.filter(t => 
        t.name.toLowerCase().includes(trimmed) ||
        t.sport.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const matchedFacilities = trimmed
    ? facilities.filter(f => 
        f.name.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const quickNav: { label: string; module: ActiveModule; subtab?: string; category: string }[] = [
    { label: 'Executive Scorecard Dashboard', module: 'command-center', category: 'Dashboards' },
    { label: 'Participation Heatmap & Cohorts', module: 'insights', subtab: 'participation', category: 'Dashboards' },
    { label: 'Athlete Progression Tracker & Funnel', module: 'insights', subtab: 'performance', category: 'Dashboards' },
    { label: 'Facility Utilization Matrix', module: 'insights', subtab: 'facilities', category: 'Dashboards' },
    { label: 'Return-to-Play Medical Clearances', module: 'safeguarding', subtab: 'returns', category: 'Safeguarding' },
    { label: 'Strategy Canvas (3-5 Year Plan)', module: 'strategy', subtab: 'canvas', category: 'Strategy' },
    { label: 'Coach Vetting & Compliance', module: 'coaching', subtab: 'roster', category: 'Coaching' },
    { label: 'Fixtures & Clash Detector', module: 'competitions', subtab: 'fixtures', category: 'Competitions' },
  ];

  const filteredQuickNav = trimmed
    ? quickNav.filter(n => n.label.toLowerCase().includes(trimmed))
    : quickNav.slice(0, 5);

  const handleSelectNav = (mod: ActiveModule, sub?: string) => {
    navigateTo(mod, sub);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[#CBD5E1] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="p-3.5 border-b border-[#E2E8F0] flex items-center gap-3 bg-[#F8FAFC]">
          <Search className="w-5 h-5 text-[#6B7480]" />
          <input
            type="text"
            placeholder="Search pupils, coaches, squads, facilities, or command modules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#0F2740] placeholder-[#9AA3B0] text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded text-[#9AA3B0] hover:text-[#0F2740]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Module Navigation */}
          {filteredQuickNav.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9AA3B0] px-2 mb-1.5">
                Navigation & Views
              </p>
              <div className="space-y-1">
                {filteredQuickNav.map((n, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectNav(n.module, n.subtab)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#F1F5F9] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Target className="w-3.5 h-3.5 text-[#F26B1D]" />
                      <span className="font-medium text-[#0F2740]">{n.label}</span>
                    </div>
                    <span className="text-[10px] text-[#6B7480] flex items-center gap-1 group-hover:text-[#F26B1D]">
                      {n.category} <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pupils */}
          {matchedStudents.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9AA3B0] px-2 mb-1.5">
                Students
              </p>
              <div className="space-y-1">
                {matchedStudents.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectNav('participation', 'students')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#F1F5F9] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#3F4B5A]" />
                      <div>
                        <span className="font-medium text-[#0F2740]">{s.firstName} {s.lastName}</span>
                        <span className="text-[#6B7480] ml-2">Year {s.yearGroup} · {s.sports.join(', ')}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      {s.abilityTier}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coaches */}
          {matchedCoaches.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9AA3B0] px-2 mb-1.5">
                Coaches & Staff
              </p>
              <div className="space-y-1">
                {matchedCoaches.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectNav('coaching', 'roster')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#F1F5F9] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#1E8A5A]" />
                      <div>
                        <span className="font-medium text-[#0F2740]">{c.name}</span>
                        <span className="text-[#6B7480] ml-2">{c.roleType} ({c.sports.join(', ')})</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#3F4B5A]">{c.weeklyHours}h/wk</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teams */}
          {matchedTeams.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9AA3B0] px-2 mb-1.5">
                Squads & Teams
              </p>
              <div className="space-y-1">
                {matchedTeams.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectNav('performance', 'teams')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#F1F5F9] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3.5 h-3.5 text-[#F26B1D]" />
                      <span className="font-medium text-[#0F2740]">{t.name}</span>
                    </div>
                    <span className="text-[10px] text-[#6B7480]">Coach: {t.coachName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {matchedFacilities.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#9AA3B0] px-2 mb-1.5">
                Facilities
              </p>
              <div className="space-y-1">
                {matchedFacilities.map(f => (
                  <button
                    key={f.id}
                    onClick={() => handleSelectNav('facilities', 'inventory')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#F1F5F9] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-[#3F4B5A]" />
                      <span className="font-medium text-[#0F2740]">{f.name}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {f.peakUtilization}% peak
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {trimmed && matchedStudents.length === 0 && matchedCoaches.length === 0 && matchedTeams.length === 0 && matchedFacilities.length === 0 && filteredQuickNav.length === 0 && (
            <p className="py-6 text-center text-[#9AA3B0]">No results matching &quot;{query}&quot;</p>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#9AA3B0]">
          <span>Use <b>↑</b> <b>↓</b> to navigate, <b>ESC</b> to exit</span>
          <span className="font-mono">SportsOS Omnibox</span>
        </div>
      </div>
    </div>
  );
};
