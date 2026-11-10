import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Sparkline } from '../../common/Sparkline';
import { 
  BarChart3, 
  Flame, 
  TrendingUp, 
  ShieldAlert, 
  Building2, 
  Users, 
  DollarSign, 
  BookOpen, 
  Compass, 
  ArrowRight, 
  Download,
  AlertTriangle,
  CheckCircle2,
  Filter
} from 'lucide-react';

export const DashboardsModule: React.FC = () => {
  const { 
    activeSubtab, 
    setActiveSubtab, 
    scorecardKPIs, 
    students, 
    athletes, 
    facilities, 
    coaches, 
    injuries, 
    incidents,
    storyBank,
    selectedCampus 
  } = useApp();

  // State for Heatmap drill-down
  const [selectedCell, setSelectedCell] = useState<{ year: number; sport: string; pct: number } | null>(null);
  const [heatmapGender, setHeatmapGender] = useState<'All' | 'Female' | 'Male'>('All');

  // State for Athlete progression chart
  const [selectedAthleteProgression, setSelectedAthleteProgression] = useState(athletes[0] || null);

  // Sports list for heatmap
  const sportsList = ['Rugby', 'Netball', 'Football', 'Cricket', 'Hockey', 'Swimming', 'Athletics', 'Rowing', 'Tennis', 'Basketball'];
  const yearList = [7, 8, 9, 10, 11, 12, 13];

  // Mock deterministic participation matrix (% participation per year × sport)
  const getMatrixPct = (year: number, sport: string): number => {
    let base = 60 + ((year * 7 + sport.length * 13) % 36);
    if (heatmapGender === 'Female') {
      if (['Rugby', 'Football'].includes(sport)) base -= 15;
      if (['Netball', 'Hockey'].includes(sport)) base += 22;
      if (year >= 9 && year <= 11) base -= 12; // Inclusivity gap reflection!
    } else if (heatmapGender === 'Male') {
      if (['Netball'].includes(sport)) base -= 40;
      if (['Rugby', 'Football'].includes(sport)) base += 20;
    }
    return Math.max(10, Math.min(95, base));
  };

  // Funnel calculations
  const foundationCount = athletes.filter(a => a.stage === 'Foundation').length + 28;
  const devCount = athletes.filter(a => a.stage === 'Development').length + 18;
  const perfCount = athletes.filter(a => a.stage === 'Performance').length + 8;
  const eliteCount = athletes.filter(a => a.stage === 'Elite').length + 4;

  return (
    <div className="space-y-6">
      {/* Module Header & Subtab Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F2740]">
              Insights, Dashboards &amp; Peer Benchmarks
            </h1>
            <p className="text-xs text-[#6B7480]">
              The six core first-class analytical dashboards: scorecards, participation matrix, talent funnels, facility utilization, coach load, and safeguarding.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2740] hover:bg-[#1E3A5A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#F26B1D]" />
            <span>Export Analytics Digest</span>
          </button>
        </div>

        {/* Subtabs for the 6 Core Dashboards + Stories */}
        <div className="flex items-center gap-1 border-t border-[#F1F5F9] pt-3 overflow-x-auto">
          {[
            { id: 'command-center', label: '1. Executive Scorecard' },
            { id: 'participation', label: '2. Participation Heatmap' },
            { id: 'performance', label: '3. Athlete Progression Tracker' },
            { id: 'facilities', label: '4. Facility Utilization Heatmap' },
            { id: 'coaching', label: '5. Coach Performance & Load' },
            { id: 'safeguarding', label: '6. Risk & Safeguarding Dashboard' },
            { id: 'benchmarks', label: 'Peer School Benchmarking' },
            { id: 'stories', label: 'Story Bank & Admissions' }
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

      {/* DASHBOARD 1: Executive Scorecard */}
      {activeSubtab === 'command-center' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {scorecardKPIs.map(kpi => (
              <div key={kpi.id} className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-2">
                <div className="flex justify-between items-start text-[11px] text-[#6B7480]">
                  <span className="truncate">{kpi.pillarTitle}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    kpi.rag === 'Green' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {kpi.rag}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-[#0F2740] line-clamp-1">{kpi.title}</h4>
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-2xl font-bold font-mono text-[#0F2740]">{kpi.currentValue}</span>
                    <span className="text-xs text-[#6B7480] ml-1">{kpi.unit}</span>
                  </div>
                  <Sparkline data={kpi.trend} color={kpi.rag === 'Green' ? '#1E8A5A' : '#E0A500'} />
                </div>
                <p className="text-[10px] text-[#6B7480] border-t border-[#F1F5F9] pt-1.5 line-clamp-2">
                  {kpi.riskNotes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DASHBOARD 2: Participation Heatmap Matrix */}
      {activeSubtab === 'participation' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#0F2740]">
                  Whole-School Participation Heatmap Matrix
                </h3>
                <p className="text-xs text-[#6B7480]">
                  Rows = Year Groups · Columns = Sports · Cell = % Participation · Cells below 70% outlined in red
                </p>
              </div>

              {/* Filter by gender */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#6B7480]">Cohort Filter:</span>
                {(['All', 'Female', 'Male'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setHeatmapGender(g)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      heatmapGender === g ? 'bg-[#0F2740] text-white' : 'bg-[#F8FAFC] text-[#6B7480] border border-[#CBD5E1]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="p-2 text-left font-bold text-[#6B7480] uppercase text-[10px]">Year</th>
                    {sportsList.map(sp => (
                      <th key={sp} className="p-2 font-bold text-[#0F2740] text-[11px] truncate max-w-[80px]">
                        {sp}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {yearList.map(yr => (
                    <tr key={yr}>
                      <td className="p-2 text-left font-bold text-[#0F2740] whitespace-nowrap">Year {yr}</td>
                      {sportsList.map(sp => {
                        const pct = getMatrixPct(yr, sp);
                        const isUnderTarget = pct < 65; // Gap overlay!
                        
                        // Heatmap color intensity
                        const bgStyle = 
                          pct >= 85 ? 'bg-emerald-600 text-white' :
                          pct >= 75 ? 'bg-emerald-500 text-white' :
                          pct >= 65 ? 'bg-emerald-400 text-slate-900' :
                          pct >= 50 ? 'bg-amber-300 text-slate-900' :
                          'bg-amber-100 text-slate-900';

                        return (
                          <td key={sp} className="p-0.5">
                            <button
                              onClick={() => setSelectedCell({ year: yr, sport: sp, pct })}
                              className={`w-full py-2 px-1 rounded font-mono font-bold text-[11px] transition-transform hover:scale-105 ${bgStyle} ${
                                isUnderTarget ? 'ring-2 ring-red-600 ring-offset-1' : ''
                              }`}
                              title={`Year ${yr} ${sp}: ${pct}% participation ${isUnderTarget ? '(Inclusivity Gap)' : ''}`}
                            >
                              {pct}%
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend & Drill-down modal/drawer */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#6B7480]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-emerald-600 rounded"></span> ≥85% High Engagement
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-emerald-400 rounded"></span> 65-84% On Target
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-amber-200 rounded"></span> &lt;65% Below Target
                </span>
                <span className="flex items-center gap-1 font-semibold text-red-600">
                  <span className="w-3 h-3 rounded ring-2 ring-red-600 inline-block"></span> Inclusivity Gap Alert
                </span>
              </div>
              <span className="font-mono text-[#0F2740]">Click cell to drill down into cohort roster</span>
            </div>

            {/* Drilldown Drawer when cell clicked */}
            {selectedCell && (
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#CBD5E1] space-y-3 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#F26B1D]">Cohort Drill-Down</span>
                    <h4 className="font-bold text-sm text-[#0F2740]">
                      Year {selectedCell.year} · {selectedCell.sport} ({selectedCell.pct}% Active)
                    </h4>
                  </div>
                  <button 
                    onClick={() => setSelectedCell(null)}
                    className="text-xs text-[#6B7480] hover:text-[#0F2740] font-semibold"
                  >
                    Close Drawer
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {students
                    .filter(s => s.yearGroup === selectedCell.year && s.sports.includes(selectedCell.sport as any))
                    .slice(0, 6)
                    .map(s => (
                      <div key={s.id} className="p-2 bg-white rounded border border-[#E2E8F0] text-xs">
                        <span className="font-semibold text-[#0F2740] block">{s.firstName} {s.lastName}</span>
                        <span className="text-[#6B7480] text-[10px]">{s.abilityTier} · {s.attendanceRate}% attendance</span>
                      </div>
                    ))}
                  {students.filter(s => s.yearGroup === selectedCell.year && s.sports.includes(selectedCell.sport as any)).length === 0 && (
                    <p className="text-xs text-[#9AA3B0] col-span-3 py-2">
                      Representative cohort data: 28 pupils in Year {selectedCell.year} currently participating in weekly {selectedCell.sport} sessions.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DASHBOARD 3: Athlete Progression Tracker & Funnel */}
      {activeSubtab === 'performance' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-5">
          <div className="border-b border-[#F1F5F9] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">
                Talent Pathway Funnel &amp; Athlete Benchmark Percentile Tracker
              </h3>
              <p className="text-xs text-[#6B7480]">
                Conversion rates from Foundation intake through to National Elite, with elite crowd-out guardrail check.
              </p>
            </div>
            {/* Elite Guardrail Indicator */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-950 font-medium">Elite Guardrail Status:</span>
              <span className="font-mono font-bold text-emerald-800">11.4% of total (Limit &lt;15%)</span>
            </div>
          </div>

          {/* Funnel Display */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { stage: 'Foundation', count: 184, conversion: 'Universal Intake', color: 'bg-slate-700' },
              { stage: 'Development', count: 82, conversion: '44.5% Conversion', color: 'bg-blue-700' },
              { stage: 'Performance', count: 34, conversion: '41.4% Conversion', color: 'bg-[#0F2740]' },
              { stage: 'Elite', count: 12, conversion: '35.2% Conversion', color: 'bg-[#F26B1D]' },
            ].map((f, i) => (
              <div key={i} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center space-y-1">
                <span className="text-[10px] font-bold text-[#6B7480] uppercase tracking-wider">{f.stage}</span>
                <p className="text-3xl font-bold font-mono text-[#0F2740]">{f.count}</p>
                <div className={`h-1.5 rounded-full ${f.color} mx-auto w-3/4`} />
                <span className="text-[10px] text-[#6B7480] font-mono block pt-1">{f.conversion}</span>
              </div>
            ))}
          </div>

          {/* Individual Athlete Progression Line Chart */}
          <div className="pt-3 border-t border-[#F1F5F9] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="font-bold text-xs uppercase text-[#6B7480]">
                Individual Athlete Benchmark Percentile Over Time
              </h4>
              <select
                value={selectedAthleteProgression.id}
                onChange={(e) => {
                  const found = athletes.find(a => a.id === e.target.value);
                  if (found) setSelectedAthleteProgression(found);
                }}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2.5 py-1 text-xs text-[#0F2740]"
              >
                {athletes.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.studentName} ({a.sport} · {a.stage})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-[#0F2740]">{selectedAthleteProgression.studentName}</span>
                  <span className="text-[#6B7480] ml-2">Tier: {selectedAthleteProgression.stage}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#F26B1D]">
                  Current Benchmark: {selectedAthleteProgression.benchmarks[0]?.score || 'N/A'} ({selectedAthleteProgression.benchmarks[0]?.percentile}th %tile)
                </span>
              </div>

              {/* Trajectory visualization */}
              <div className="h-32 flex items-end gap-6 pt-4 pb-2 border-b border-[#CBD5E1]">
                {[
                  { label: 'Year 9 Entry', score: 62 },
                  { label: 'Year 10 Mid', score: 74 },
                  { label: 'Year 11 Pre-Season', score: 86 },
                  { label: 'Term 1 Current', score: selectedAthleteProgression.benchmarks[0]?.percentile || 94 },
                ].map((pt, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="font-mono text-xs font-bold text-[#0F2740]">{pt.score}th</span>
                    <div 
                      className="w-8 bg-[#0F2740] rounded-t transition-all hover:bg-[#F26B1D]"
                      style={{ height: `${pt.score}%` }}
                    />
                    <span className="text-[10px] text-[#6B7480] truncate">{pt.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD 4: Facility Utilization Heatmap */}
      {activeSubtab === 'facilities' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">
                Facility Utilization Matrix &amp; Underutilized Slots
              </h3>
              <p className="text-xs text-[#6B7480]">
                Heatmap across active facilities × hour-of-week (Peak 16:00 - 18:30 / Community 18:30 - 21:00)
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Department Peak Avg: 89.2%
            </span>
          </div>

          {/* Underutilized Slots Callout */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Top 3 Underutilized Prime Slots
            </span>
            <p className="text-amber-900">
              1. Oakridge Tartan Track (Mornings 07:00-08:15 — 38% idle) · 2. Sports Hall Court 4 (Fridays 16:00-17:30 — 42% idle) · 3. Riverside Hockey Astroturf (Tuesdays 17:00-18:00 — 50% idle). Opportunity for new junior clubs or external letting revenue.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] text-[#6B7480] uppercase border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Facility</th>
                  <th className="px-3 py-2.5 font-semibold">Campus</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Peak (16:00-18:30)</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Off-Peak / Community</th>
                  <th className="px-3 py-2.5 font-semibold text-right">7-Day Booking Density</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {facilities.map(fac => (
                  <tr key={fac.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-3 py-3 font-bold text-[#0F2740]">{fac.name}</td>
                    <td className="px-3 py-3 text-[#6B7480] capitalize">{fac.campusId.replace('campus-', '')}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {fac.peakUtilization}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center font-mono">{fac.offPeakUtilization}%</td>
                    <td className="px-3 py-3 text-right">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden ml-auto">
                        <div className="bg-[#0F2740] h-full rounded-full" style={{ width: `${fac.peakUtilization}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DASHBOARD 5: Coach Performance & Load */}
      {activeSubtab === 'coaching' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Coach Performance, Workload &amp; Vetting Compliance Matrix</h3>
              <p className="text-xs text-[#6B7480]">Sortable by load hours, observation score, and CPD compliance</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0F2740]">
              {coaches.length} Monitored Coaches
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] text-[#6B7480] uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Coach</th>
                  <th className="px-3 py-2.5 font-semibold">Role</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Load Hours</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Obs Score</th>
                  <th className="px-3 py-2.5 font-semibold text-center">PD Hours</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Vetting Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {coaches.map(c => (
                  <tr key={c.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-3 py-2.5 font-bold text-[#0F2740]">{c.name}</td>
                    <td className="px-3 py-2.5 text-[#6B7480]">{c.roleType}</td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-[#0F2740]">{c.weeklyHours}h / {c.maxWeeklyHours}h</td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-emerald-800">{c.observationScore}</td>
                    <td className="px-3 py-2.5 text-center font-mono">{c.pdHoursThisTerm}h</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.vettingStatus === 'Valid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {c.vettingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DASHBOARD 6: Risk & Safeguarding Dashboard */}
      {activeSubtab === 'safeguarding' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Risk &amp; Clinical Safeguarding Governance</h3>
              <p className="text-xs text-[#6B7480]">Three-panel executive surveillance: Open Incidents, Injury Trends, Compliance Horizon</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              Department Status: Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Panel 1: Open Incidents */}
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
              <span className="text-xs font-bold text-[#0F2740] uppercase block">Panel 1: Open Incidents</span>
              <p className="text-2xl font-bold font-mono text-[#0F2740]">{incidents.filter(i => i.status !== 'Resolved').length}</p>
              <p className="text-[11px] text-[#6B7480]">
                1 Major concussion under investigation (SCAT6 Day 11); 0 critical safeguarding disclosures.
              </p>
            </div>

            {/* Panel 2: Injury Rate Trend */}
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-bold text-[#0F2740] uppercase block">Panel 2: Injury Surveillance</span>
              <p className="text-2xl font-bold font-mono text-emerald-700">14.2 / 1000 hrs</p>
              <p className="text-[11px] text-[#6B7480]">
                Well beneath ceiling limit of 18.0. Zero return-to-play protocol breaches.
              </p>
            </div>

            {/* Panel 3: Compliance Status */}
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-bold text-[#0F2740] uppercase block">Panel 3: Vetting Compliance Horizon</span>
              <p className="text-2xl font-bold font-mono text-amber-700">2 Due in &lt;30d</p>
              <p className="text-[11px] text-[#6B7480]">
                Sarah Jenkins (28 Nov), Tyrone Bailey (05 Dec). Both renewal checks initiated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Benchmarks & Story Bank Subtabs */}
      {activeSubtab === 'benchmarks' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h3 className="font-bold text-sm text-[#0F2740]">Independent Schools Peer Benchmarking 2026</h3>
            <p className="text-xs text-[#6B7480]">Comparison against leading UK athletic schools (Eton, Harrow, Wellington, Millfield, Brighton)</p>
          </div>

          <div className="space-y-3">
            {[
              { metric: 'Meaningful Weekly Participation', ourSchool: '83.4%', peerAverage: '76.8%', rank: 'Upper Quartile' },
              { metric: 'Injury Rate per 1000 Exposure Hours', ourSchool: '14.2', peerAverage: '16.8', rank: 'Top 10% (Lowest Injury)' },
              { metric: 'Elite Squad Roster Proportion', ourSchool: '11.4%', peerAverage: '14.2%', rank: 'Protected Breadth' },
              { metric: 'Coaches with Level 3+ Qualifications', ourSchool: '62.5%', peerAverage: '48.0%', rank: 'Upper Quartile' },
            ].map((b, i) => (
              <div key={i} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-[#0F2740]">{b.metric}</h4>
                  <p className="text-[#6B7480]">Peer Independent Benchmark: {b.peerAverage}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-[#0F2740]">{b.ourSchool}</span>
                  <span className="block text-[10px] text-emerald-800 font-semibold">{b.rank}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubtab === 'stories' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h3 className="font-bold text-sm text-[#0F2740]">Story Bank for Admissions &amp; Marketing</h3>
            <p className="text-xs text-[#6B7480]">Curated student journeys with verified parental GDPR consent flags</p>
          </div>

          <div className="space-y-3">
            {storyBank.map(st => (
              <div key={st.id} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#F26B1D] uppercase">{st.sport} · {st.date}</span>
                    <h4 className="font-bold text-sm text-[#0F2740]">{st.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Parental Consent Confirmed
                  </span>
                </div>
                <p className="text-[#3F4B5A]">{st.summary}</p>
                <p className="text-[#0F2740] italic bg-white p-2.5 rounded border border-[#E2E8F0]">
                  {st.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
