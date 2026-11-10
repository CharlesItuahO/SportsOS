import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Fixture } from '../../../types';
import { 
  Swords, 
  Calendar as CalendarIcon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Bus, 
  Trophy, 
  FileText, 
  Search,
  Check,
  ShieldAlert
} from 'lucide-react';

export const CompetitionsModule: React.FC = () => {
  const { 
    activeSubtab, 
    setActiveSubtab, 
    filteredFixtures, 
    overrideFixtureClash,
    selectedCampus 
  } = useApp();

  const [fixtureFilterStatus, setFixtureFilterStatus] = useState<string>('ALL');
  const [clashModalFixture, setClashModalFixture] = useState<Fixture | null>(null);
  const [overrideReason, setOverrideReason] = useState('');

  const displayedFixtures = filteredFixtures.filter(f => {
    if (fixtureFilterStatus !== 'ALL' && f.status !== fixtureFilterStatus) return false;
    return true;
  });

  const handleOpenOverride = (f: Fixture) => {
    setClashModalFixture(f);
    setOverrideReason('');
  };

  const handleConfirmOverride = () => {
    if (!clashModalFixture || !overrideReason.trim()) return;
    overrideFixtureClash(clashModalFixture.id, overrideReason.trim());
    setClashModalFixture(null);
  };

  return (
    <div className="space-y-6">
      {/* Module Header & Subtab Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F2740]">
              Competitions, Fixtures &amp; Showcases
            </h1>
            <p className="text-xs text-[#6B7480]">
              Interschool fixtures, facility clash conflict resolution, tournament hosting plans, and run-sheet builder.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#0F2740] bg-[#F8FAFC] border border-[#CBD5E1] px-3 py-1.5 rounded-lg">
            {filteredFixtures.length} Total Fixtures Scheduled
          </span>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 border-t border-[#F1F5F9] pt-3 overflow-x-auto">
          {[
            { id: 'fixtures', label: 'Fixtures & Clash Detector' },
            { id: 'results', label: 'Results & Match Reports' },
            { id: 'hosting', label: 'External Competition Hosting' },
            { id: 'showcases', label: 'Showcase Run-Sheet Builder' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubtab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                activeSubtab === tab.id
                  ? 'bg-[#0F2740] text-white'
                  : 'text-[#6B7480] hover:text-[#0F2740] hover:bg-[#F8FAFC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subtab 1: Fixtures & Clash Detector */}
      {activeSubtab === 'fixtures' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#6B7480]">
              Upcoming &amp; Scheduled Fixtures
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6B7480]">Status Filter:</span>
              <select
                value={fixtureFilterStatus}
                onChange={(e) => setFixtureFilterStatus(e.target.value)}
                className="bg-white border border-[#CBD5E1] rounded px-2 py-1 text-[#0F2740]"
              >
                <option value="ALL">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {displayedFixtures.map(f => {
              const isClash = f.hasClash && !f.clashOverridden;

              return (
                <div 
                  key={f.id} 
                  className={`bg-white rounded-xl border p-4 shadow-xs transition-colors ${
                    isClash ? 'border-red-300 bg-red-50/20' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#F26B1D] uppercase">
                          {f.sport} · {f.type}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded">
                          {f.isHome ? 'Home Fixture' : 'Away Fixture'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          f.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {f.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-[#0F2740]">
                        {f.teamName} <span className="text-[#6B7480] font-normal">vs</span> {f.opponent}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#6B7480]">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#3F4B5A]" /> {f.date} at {f.time}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#3F4B5A]" /> {f.venue}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Bus className="w-3.5 h-3.5 text-[#3F4B5A]" /> {f.transportDetails}
                        </span>
                      </div>
                    </div>

                    {/* Clash warning or actions */}
                    <div className="shrink-0 flex items-center gap-2">
                      {isClash ? (
                        <div className="p-2.5 bg-red-100 border border-red-300 rounded-lg text-xs space-y-1 text-right">
                          <div className="flex items-center gap-1 text-red-900 font-bold justify-end">
                            <ShieldAlert className="w-4 h-4 text-red-600" />
                            <span>FACILITY CLASH DETECTED</span>
                          </div>
                          <p className="text-[11px] text-red-800 max-w-xs">{f.clashReason}</p>
                          <button
                            onClick={() => handleOpenOverride(f)}
                            className="mt-1 px-3 py-1 bg-red-700 text-white rounded font-bold text-[11px] hover:bg-red-800"
                          >
                            Resolve or Override Clash
                          </button>
                        </div>
                      ) : f.clashOverridden ? (
                        <div className="text-right text-[11px]">
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Clash Overridden &amp; Approved
                          </span>
                          <p className="text-[#6B7480] text-[10px] mt-0.5">Rationale: {f.clashOverrideReason}</p>
                        </div>
                      ) : f.result ? (
                        <div className="text-right">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            f.result.outcome === 'Won' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {f.result.outcome} {f.result.schoolScore} - {f.result.opponentScore}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Results & Match Reports */}
      {activeSubtab === 'results' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Completed Results &amp; Match Reports</h3>
              <p className="text-xs text-[#6B7480]">Auto-feeds whole-school scorecard KPIs and athlete progression timelines</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Win Rate: 68.2%
            </span>
          </div>

          <div className="space-y-4">
            {filteredFixtures.filter(f => f.result).map(f => (
              <div key={f.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#F26B1D]">{f.sport} · {f.date}</span>
                    <h4 className="font-bold text-sm text-[#0F2740]">{f.teamName} vs {f.opponent}</h4>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold font-mono px-2.5 py-1 rounded ${
                      f.result?.outcome === 'Won' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {f.result?.outcome}: {f.result?.schoolScore} - {f.result?.opponentScore}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#3F4B5A] bg-white p-3 rounded-lg border border-[#E2E8F0] leading-relaxed">
                  {f.result?.matchReport}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-[#6B7480]">
                  <span className="font-semibold text-[#0F2740]">Standout Performances:</span>
                  <span>{f.result?.standoutAthletes.join(' · ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Competition Hosting Plan */}
      {activeSubtab === 'hosting' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h3 className="font-bold text-sm text-[#0F2740]">Major Event Hosting Dossier: London Schools Invitational 2026</h3>
            <p className="text-xs text-[#6B7480]">16 Visiting Schools · 340 Competitors · St. Jude&apos;s Highgate Campus</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
              <h4 className="font-bold text-[#0F2740] uppercase text-[11px]">Staffing &amp; Medical Marshals</h4>
              <p>• Lead Medical Officer: <b>Dr. Fiona Henderson</b> (Pitchside Unit A)</p>
              <p>• St. John Ambulance Paramedic Quad on standby at North Gate</p>
              <p>• 14 Student Sports Leaders deployed for scorekeeping and hospitality</p>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
              <h4 className="font-bold text-[#0F2740] uppercase text-[11px]">Spectator &amp; Parking Plan</h4>
              <p>• North Lawn Designated Spectator Zone (capacity 450)</p>
              <p>• Visiting coaches instructed to use Gate 2 drop-off zone only</p>
              <p>• Refreshment tent managed by School Parents Sports Association</p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Run-Sheet Builder */}
      {activeSubtab === 'showcases' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Showcase Event Run-Sheet: Sports Day 2027</h3>
              <p className="text-xs text-[#6B7480]">Minute-by-minute responsibilities and track assignments</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0F2740]">Full Campus Tri-Event</span>
          </div>

          <div className="space-y-2">
            {[
              { time: '08:30', item: 'Grounds team line inspection and PA audio sound check', lead: 'Mark Roberts (Estates)' },
              { time: '09:00', item: 'Pupil briefing & house parade at the 400m Tartan Track', lead: 'Alastair Vance (Head of Sports)' },
              { time: '09:30', item: 'Track Heats: 100m, 200m, 300m (Years 7-10)', lead: 'David Kalu & PE Staff' },
              { time: '11:15', item: 'Field Finals: High Jump, Long Jump, Javelin, Shotput', lead: 'Sarah Jenkins & Rachel Green' },
              { time: '14:30', item: 'Championship 4x100m Relay Finals & Staff vs 6th Form Relay', lead: 'Gareth Thorne' },
              { time: '15:30', item: 'Trophy Presentation by Chair of Governors', lead: 'Arthur Pendelton' }
            ].map((entry, idx) => (
              <div key={idx} className="p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#0F2740] w-16">{entry.time}</span>
                <span className="flex-1 text-[#3F4B5A] font-medium px-2">{entry.item}</span>
                <span className="text-[#6B7480] text-[11px] font-semibold">{entry.lead}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clash Override Reason Modal */}
      {clashModalFixture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 border border-[#CBD5E1]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                Facility Clash Resolution Protocol
              </span>
              <h3 className="font-bold text-base text-[#0F2740]">
                Override Clash: {clashModalFixture.teamName}
              </h3>
              <p className="text-xs text-red-800 bg-red-50 p-2 rounded mt-2 border border-red-200">
                Conflict: {clashModalFixture.clashReason}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0F2740]">
                Resolution Action &amp; Head of Sports Override Rationale <span className="text-red-500">*</span>
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="e.g. Badminton GCSE PE moved to Court 3/4 partition; Netball fixture allocated Court 1 with agreement of Deputy Head PE..."
                rows={3}
                className="w-full text-xs border border-[#CBD5E1] rounded-md p-2 text-[#0F2740] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setClashModalFixture(null)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-[#6B7480] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOverride}
                disabled={!overrideReason.trim()}
                className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#0F2740] text-white hover:bg-[#1E3A5A] disabled:opacity-50"
              >
                Confirm Resolution &amp; Unblock Fixture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
