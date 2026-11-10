import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Sparkline } from '../../common/Sparkline';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  Edit3, 
  Save, 
  Trophy, 
  Users, 
  Activity, 
  Building2,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const { 
    scorecardKPIs, 
    density, 
    selectedCampus, 
    campuses, 
    selectedTerm, 
    terms,
    injuries,
    coaches,
    fixtures,
    navigateTo,
    canEditStrategy,
    isReadOnlyLeadership
  } = useApp();

  // Risks & Opportunities local editable state
  const [isEditingRisks, setIsEditingRisks] = useState(false);
  const [risks, setRisks] = useState<string[]>([
    'Year 9 & 10 Girls participation at South Campus is 71.8% (lagging 80% target); alternative sports electives kicking off next week.',
    '2 coaches (Sarah Jenkins & Tyrone Bailey) have DBS certifications expiring in under 30 days.',
    'Oakridge Athletics Track bend (Lane 2-3) requires remedial resurfacing after severe autumn rain.',
    'Transport budget line has experienced a 15% variance due to extended national cup away runs.'
  ]);
  const [opportunities, setOpportunities] = useState<string[]>([
    'Castore apparel commercial sponsorship renewal scheduled for December: estimated uplift to £75,000.',
    'Sophia Vane-Tempest (Rowing) and Callum MacKenzie (Rugby) selected for Junior National squads.',
    'Prime floodlit 3G facility utilization at 98% with community letting revenue pacing at £42k this term.',
    '100% adherence to digital SCAT6 Concussion Return-to-Play clinical protocol with zero breaches.'
  ]);

  const activeCampusName = selectedCampus === 'ALL' 
    ? 'All Campuses (Consolidated Whole-School)' 
    : campuses.find(c => c.id === selectedCampus)?.name || selectedCampus;

  const currentTermObj = terms.find(t => t.id === selectedTerm);

  // Top movers calculation
  const topMovers = [
    { title: 'Girls Rowing Ergometer Benchmark', change: '+8.4%', trend: 'up', note: 'Post-autumn aerobic block gains' },
    { title: 'Year 7 Physical Literacy Screening', change: '+12.1%', trend: 'up', note: 'Universal baseline tests completed' },
    { title: 'Coach Observation Rubric Average', change: '+0.18', trend: 'up', note: 'Now 3.68 / 4.0 across all campuses' },
    { title: 'Transport Expenditure Variance', change: '+15.0%', trend: 'down', note: 'National cup away travel fuel surcharge' },
  ];

  const pendingMedical = injuries.filter(i => i.returnToPlayStatus === 'MEDICAL_CLEARANCE_REQUIRED');
  const expiringCoaches = coaches.filter(c => c.vettingStatus === 'Expiring Soon');
  const clashCount = fixtures.filter(f => f.hasClash && !f.clashOverridden).length;

  return (
    <div className={`space-y-6 ${density === 'compact' ? 'text-xs' : 'text-sm'}`}>
      {/* Top Banner / Breadcrumb & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6B7480] mb-1">
            <span>Executive Command Center</span>
            <span>/</span>
            <span className="font-semibold text-[#0F2740]">{activeCampusName}</span>
            <span>/</span>
            <span className="text-[#F26B1D] font-medium">{currentTermObj?.name}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#0F2740]">
            Sports Operational Health &amp; Strategy
          </h1>
          <p className="text-xs text-[#6B7480] mt-0.5">
            Real-time telemetry across participation, performance pathways, coaching quality, facilities, and safeguarding.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => navigateTo('strategy', 'scorecard')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2740] hover:bg-[#1E3A5A] text-white rounded-lg font-medium text-xs transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#F26B1D]" />
            <span>Official Scorecard</span>
          </button>
          <button
            onClick={() => navigateTo('insights', 'participation')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-[#0F2740] border border-[#CBD5E1] rounded-lg font-medium text-xs transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-[#3F4B5A]" />
            <span>Analytics Suite</span>
          </button>
        </div>
      </div>

      {/* Urgent Operational Gateways Banner */}
      {(pendingMedical.length > 0 || expiringCoaches.length > 0 || clashCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pendingMedical.length > 0 && (
            <div 
              onClick={() => navigateTo('safeguarding', 'returns')}
              className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-red-100/70 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold text-red-950 text-xs">
                    {pendingMedical.length} Medical Clearance Required
                  </p>
                  <p className="text-[11px] text-red-800">
                    Concussion protocol: {pendingMedical[0]?.studentName}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-red-600" />
            </div>
          )}

          {expiringCoaches.length > 0 && (
            <div 
              onClick={() => navigateTo('coaching', 'roster')}
              className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold text-amber-950 text-xs">
                    {expiringCoaches.length} Vetting Checks Expiring Soon
                  </p>
                  <p className="text-[11px] text-amber-800">
                    {expiringCoaches[0]?.name} expires within 30 days
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600" />
            </div>
          )}

          {clashCount > 0 && (
            <div 
              onClick={() => navigateTo('competitions', 'fixtures')}
              className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-orange-100/70 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#F26B1D] shrink-0" />
                <div>
                  <p className="font-bold text-orange-950 text-xs">
                    {clashCount} Fixture / Facility Clash
                  </p>
                  <p className="text-[11px] text-orange-800">
                    Court 1 Netball vs GCSE PE
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#F26B1D]" />
            </div>
          )}
        </div>
      )}

      {/* KPI Tiles with 12-Week Sparklines & RAG Status */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7480]">
            Core Performance Scorecard (12-Week Trajectory)
          </h2>
          <span className="text-[11px] text-[#9AA3B0]">Target compliance benchmark</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {scorecardKPIs.map((kpi) => {
            const isTargetMet = kpi.rag === 'Green';
            const ragColor = 
              kpi.rag === 'Green' ? '#1E8A5A' : 
              kpi.rag === 'Amber' ? '#E0A500' : '#D14343';

            return (
              <div
                key={kpi.id}
                className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#6B7480] mb-1">
                    <span className="truncate">{kpi.pillarTitle}</span>
                    <span 
                      className="inline-flex items-center gap-1 font-semibold text-[10px] uppercase px-1.5 py-0.2 rounded"
                      style={{ 
                        backgroundColor: `${ragColor}15`, 
                        color: ragColor 
                      }}
                    >
                      {kpi.rag}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xs text-[#0F2740] line-clamp-1">{kpi.title}</h3>
                </div>

                <div className="my-2.5 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold font-mono text-[#0F2740] tabular-nums tracking-tight">
                      {kpi.currentValue}
                    </span>
                    <span className="text-xs text-[#6B7480] ml-1 font-mono">{kpi.unit}</span>
                  </div>

                  {/* Sparkline visualization */}
                  <Sparkline 
                    data={kpi.trend} 
                    color={ragColor} 
                    height={26} 
                    width={72} 
                  />
                </div>

                <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                  <span className="text-[#6B7480]">
                    Target: <b className="font-mono text-[#0F2740]">{kpi.targetValue}{kpi.unit}</b>
                  </span>
                  <span className={`font-mono text-[10px] ${isTargetMet ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}`}>
                    {isTargetMet ? 'On Target' : 'Under Review'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Risks & Opportunities + Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risks & Opportunities Panel (Editable by Head of Sports) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Risks &amp; Strategic Opportunities</h3>
              <p className="text-xs text-[#6B7480]">Executive commentary briefed to Board of Governors &amp; Headmaster</p>
            </div>
            {canEditStrategy && (
              <button
                onClick={() => setIsEditingRisks(!isEditingRisks)}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F2740] hover:bg-[#F1F5F9] transition-colors"
              >
                {isEditingRisks ? (
                  <>
                    <Save className="w-3.5 h-3.5 text-[#1E8A5A]" /> Save Notes
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5 text-[#F26B1D]" /> Edit Notes
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Risks */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#D14343] uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> High-Priority Operational Risks
              </span>
              <div className="space-y-2">
                {risks.map((risk, idx) => (
                  <div key={idx} className="p-2.5 bg-red-50/50 border border-red-100 rounded-lg text-xs text-[#3F4B5A]">
                    {isEditingRisks ? (
                      <textarea
                        value={risk}
                        onChange={(e) => {
                          const updated = [...risks];
                          updated[idx] = e.target.value;
                          setRisks(updated);
                        }}
                        className="w-full bg-white border border-red-200 rounded p-1 text-xs text-[#0F2740]"
                        rows={2}
                      />
                    ) : (
                      <p className="leading-relaxed">{risk}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1E8A5A] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Value Creation &amp; Opportunities
              </span>
              <div className="space-y-2">
                {opportunities.map((opp, idx) => (
                  <div key={idx} className="p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs text-[#3F4B5A]">
                    {isEditingRisks ? (
                      <textarea
                        value={opp}
                        onChange={(e) => {
                          const updated = [...opportunities];
                          updated[idx] = e.target.value;
                          setOpportunities(updated);
                        }}
                        className="w-full bg-white border border-emerald-200 rounded p-1 text-xs text-[#0F2740]"
                        rows={2}
                      />
                    ) : (
                      <p className="leading-relaxed">{opp}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Movers Panel */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h3 className="font-bold text-sm text-[#0F2740]">Top Movers (Week-over-Week)</h3>
            <p className="text-xs text-[#6B7480]">Biggest statistical fluctuations across campuses</p>
          </div>

          <div className="space-y-3">
            {topMovers.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#0F2740]">{m.title}</span>
                  <span className={`font-mono font-bold text-xs flex items-center gap-0.5 ${
                    m.trend === 'up' ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {m.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {m.change}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7480]">{m.note}</p>
              </div>
            ))}
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-[#F1F5F9] space-y-2">
            <p className="text-[11px] font-bold uppercase text-[#9AA3B0]">Fast Actions</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => navigateTo('participation', 'students')}
                className="p-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F2740] rounded border border-[#E2E8F0] font-medium text-left truncate"
              >
                Inspect Cohorts
              </button>
              <button 
                onClick={() => navigateTo('facilities', 'booking')}
                className="p-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F2740] rounded border border-[#E2E8F0] font-medium text-left truncate"
              >
                Facility Grid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
