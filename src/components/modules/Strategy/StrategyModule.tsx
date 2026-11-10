import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Sparkline } from '../../common/Sparkline';
import { 
  Target, 
  Calendar as CalendarIcon, 
  FileSpreadsheet, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Upload, 
  Download,
  Share2,
  ChevronRight
} from 'lucide-react';

export const StrategyModule: React.FC = () => {
  const { 
    activeSubtab, 
    setActiveSubtab, 
    strategicPillars, 
    operatingPlan, 
    budgetLines, 
    scorecardKPIs,
    publishScorecardVersion,
    canEditStrategy,
    selectedCampus
  } = useApp();

  const [publishedModalOpen, setPublishedModalOpen] = useState(false);
  const [newVersionName, setNewVersionName] = useState('v4.3 — Autumn Michaelmas Formal Review');
  const [budgetFilterCategory, setBudgetFilterCategory] = useState<string>('ALL');

  // Filter budget lines
  const filteredBudget = budgetLines.filter(b => {
    if (selectedCampus !== 'ALL' && b.campusId !== selectedCampus) return false;
    if (budgetFilterCategory !== 'ALL' && b.category !== budgetFilterCategory) return false;
    return true;
  });

  const totalPlanned = filteredBudget.reduce((acc, curr) => acc + curr.planned, 0);
  const totalActual = filteredBudget.reduce((acc, curr) => acc + curr.actual, 0);
  const totalVariance = totalPlanned > 0 ? ((totalActual - totalPlanned) / totalPlanned) * 100 : 0;

  const handlePublish = () => {
    publishScorecardVersion(newVersionName);
    setPublishedModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Header & Subtab Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F2740]">
              Strategy &amp; Whole-School Leadership
            </h1>
            <p className="text-xs text-[#6B7480]">
              Multi-year sports strategy, operating plans, fiscal budgets, and published governance scorecards.
            </p>
          </div>
          {canEditStrategy && (
            <button
              onClick={() => setPublishedModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2740] hover:bg-[#1E3A5A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start md:self-auto"
            >
              <Share2 className="w-3.5 h-3.5 text-[#F26B1D]" />
              <span>Publish Scorecard Version</span>
            </button>
          )}
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 border-t border-[#F1F5F9] pt-3 overflow-x-auto">
          {[
            { id: 'canvas', label: '3-5 Year Strategy Canvas' },
            { id: 'operating-plan', label: 'Annual Operating Plan & Gantt' },
            { id: 'calendar', label: 'Whole-School Calendar' },
            { id: 'budget', label: 'Budget & Variance Tracking' },
            { id: 'scorecard', label: 'Published Scorecard' }
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

      {/* Subtab 1: Strategy Canvas */}
      {activeSubtab === 'canvas' && (
        <div className="space-y-4">
          <div className="bg-[#0F2740] text-white p-5 rounded-xl border border-[#1E3A5A] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26B1D]">
                School Strategic Vision 2025–2030
              </span>
              <span className="text-xs text-[#9AA3B0]">Adopted by Board of Governors</span>
            </div>
            <h2 className="text-lg font-bold">
              &quot;Sport as the Catalyst for Whole-School Character, Health &amp; High-Performance Excellence&quot;
            </h2>
            <p className="text-xs text-[#9AA3B0] mt-1 max-w-3xl leading-relaxed">
              Establishing a national blueprint where participation breadth and elite athlete development reinforce one another across all campuses without exclusion or compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategicPillars.map(pillar => {
              const ragBadge = 
                pillar.ragStatus === 'Green' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                pillar.ragStatus === 'Amber' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                'bg-red-50 text-red-800 border-red-200';

              return (
                <div key={pillar.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#F26B1D]">
                        Pillar 0{pillar.number}
                      </span>
                      <h3 className="font-bold text-sm text-[#0F2740]">{pillar.title}</h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${ragBadge}`}>
                      {pillar.ragStatus}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B7480] leading-relaxed">{pillar.vision}</p>

                  <div className="pt-2 border-t border-[#F1F5F9]">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#6B7480]">Strategic Progress</span>
                      <span className="font-bold text-[#0F2740] font-mono">{pillar.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#0F2740] h-full rounded-full transition-all" 
                        style={{ width: `${pillar.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold uppercase text-[#9AA3B0]">Key Milestones</p>
                    {pillar.goals.map(g => (
                      <div key={g.id} className="flex items-center justify-between text-xs p-2 bg-[#F8FAFC] rounded border border-[#F1F5F9]">
                        <span className="text-[#3F4B5A] font-medium">{g.title}</span>
                        <span className="font-mono text-[10px] text-[#6B7480] shrink-0 ml-2">{g.metric}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-[#9AA3B0]">Lead Owner: {pillar.owner}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Operating Plan */}
      {activeSubtab === 'operating-plan' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Annual Operating Plan (Michaelmas to Trinity)</h3>
              <p className="text-xs text-[#6B7480]">Initiatives linked directly to strategic pillars with dependencies</p>
            </div>
            <span className="text-xs font-mono text-[#6B7480]">5 Active Initiatives</span>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {operatingPlan.map(item => (
              <div key={item.id} className="p-4 hover:bg-[#F8FAFC] transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-[#F26B1D] uppercase tracking-wider">
                        {item.pillarTitle}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {item.campusScope}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#0F2740]">{item.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-[#6B7480]">Due: {item.dueDate}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-600' : 'bg-[#F26B1D]'}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#0F2740]">{item.progress}%</span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#6B7480]">
                  <span>Lead: <b>{item.owner}</b></span>
                  <span>·</span>
                  <span>Dependencies: {item.dependencies.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Master Sports Calendar */}
      {activeSubtab === 'calendar' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Whole-School Master Sports Calendar</h3>
              <p className="text-xs text-[#6B7480]">
                Fixtures, tournaments, inter-house galas, showcase dates, and academic exam blocks overlay.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> Fixtures
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F26B1D] inline-block"></span> Showcases
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span> Exam Block
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              {
                date: 'Sat 14 Nov',
                events: [
                  { title: '1st XV Rugby vs Wellington College', type: 'Fixture', time: '14:30', tag: 'Away' },
                  { title: '1st XI Football vs Charterhouse', type: 'Fixture', time: '14:00', tag: 'Away' },
                  { title: 'U16A Rugby vs Dulwich College', type: 'Fixture', time: '14:30', tag: 'Home' }
                ]
              },
              {
                date: 'Wed 18 Nov',
                events: [
                  { title: '1st VII Netball vs Brighton College', type: 'Fixture', time: '15:15', tag: 'Home' },
                  { title: 'GCSE PE Moderation Practical Assessment', type: 'Curriculum', time: '13:00 - 16:00', tag: 'Sports Hall' }
                ]
              },
              {
                date: 'Sun 22 Nov',
                events: [
                  { title: 'Fours Head of the River Race (Chiswick to Putney)', type: 'Showcase', time: '11:00', tag: 'Thames Tideway' },
                  { title: 'Inter-House Swimming Gala (North vs South vs East)', type: 'Inter-House', time: '14:00', tag: 'Olympic Pool' }
                ]
              },
              {
                date: '30 Nov – 04 Dec',
                events: [
                  { title: 'Year 11 & 13 Mock Examination Block (Games Protected)', type: 'Exam Block', time: 'All Day', tag: 'Academic Overlay' }
                ]
              }
            ].map((col, idx) => (
              <div key={idx} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2">
                <p className="font-bold text-xs text-[#0F2740] border-b border-[#CBD5E1] pb-1 font-mono">
                  {col.date}
                </p>
                <div className="space-y-2">
                  {col.events.map((ev, i) => (
                    <div key={i} className="p-2 bg-white rounded border border-[#E2E8F0] text-xs space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-[#0F2740] leading-tight">{ev.title}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#6B7480]">
                        <span>{ev.time}</span>
                        <span className="bg-slate-100 text-slate-800 px-1 py-0.2 rounded font-mono">
                          {ev.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Budget & Variance */}
      {activeSubtab === 'budget' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs text-[#6B7480]">Total Planned Budget</span>
              <p className="text-xl font-bold font-mono text-[#0F2740]">£{totalPlanned.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs text-[#6B7480]">Total Actual Committed</span>
              <p className="text-xl font-bold font-mono text-[#0F2740]">£{totalActual.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs">
              <span className="text-xs text-[#6B7480]">Net Budget Variance</span>
              <p className={`text-xl font-bold font-mono ${totalVariance > 5 ? 'text-red-700' : 'text-emerald-700'}`}>
                {totalVariance >= 0 ? `+${totalVariance.toFixed(1)}%` : `${totalVariance.toFixed(1)}%`}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#6B7480]">
                Budget Line Item Variance Tracker
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B7480]">Category:</span>
                <select
                  value={budgetFilterCategory}
                  onChange={(e) => setBudgetFilterCategory(e.target.value)}
                  className="text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2 py-1 text-[#0F2740]"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Coaching Staff">Coaching Staff</option>
                  <option value="Transport & Travel">Transport & Travel</option>
                  <option value="Equipment & Kit">Equipment & Kit</option>
                  <option value="Facility Leases & Maintenance">Facility Leases</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8FAFC] text-[#6B7480] uppercase tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Category</th>
                    <th className="px-4 py-2.5 font-semibold">Campus</th>
                    <th className="px-4 py-2.5 font-semibold">Sport</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Planned (£)</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Actual (£)</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Variance (%)</th>
                    <th className="px-4 py-2.5 font-semibold">Auditor Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredBudget.map(b => {
                    const variance = ((b.actual - b.planned) / b.planned) * 100;
                    const isAlert = Math.abs(variance) >= 10;

                    return (
                      <tr key={b.id} className="hover:bg-[#F8FAFC]">
                        <td className="px-4 py-3 font-semibold text-[#0F2740]">{b.category}</td>
                        <td className="px-4 py-3 text-[#6B7480] capitalize">{b.campusId.replace('campus-', '')}</td>
                        <td className="px-4 py-3 text-[#3F4B5A]">{b.sport}</td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums">£{b.planned.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums font-semibold text-[#0F2740]">
                          £{b.actual.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums font-bold">
                          <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                            isAlert 
                              ? 'bg-red-100 text-red-900 border border-red-200' 
                              : variance > 0 ? 'text-amber-700' : 'text-emerald-700'
                          }`}>
                            {variance > 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#6B7480] max-w-xs truncate">{b.notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: Published Scorecard */}
      {activeSubtab === 'scorecard' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26B1D]">
                Official Board of Governors Report
              </span>
              <h3 className="text-lg font-bold text-[#0F2740]">Term 1 Mid-Term Scorecard (Version 4.2)</h3>
              <p className="text-xs text-[#6B7480]">
                Published 2026-11-08 by Alastair Vance (Head of Sports). Archived and diffable.
              </p>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#0F2740] hover:bg-slate-50 transition-colors self-start"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Executive Brief (PDF)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scorecardKPIs.map(kpi => (
              <div key={kpi.id} className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[#6B7480] uppercase">{kpi.pillarTitle}</span>
                    <h4 className="font-bold text-xs text-[#0F2740]">{kpi.title}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    kpi.rag === 'Green' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {kpi.rag}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-[#0F2740]">{kpi.currentValue}{kpi.unit}</span>
                  <span className="text-xs text-[#6B7480]">Target: {kpi.targetValue}{kpi.unit}</span>
                </div>

                <p className="text-[11px] text-[#3F4B5A] bg-white p-2 rounded border border-[#F1F5F9] leading-relaxed">
                  {kpi.riskNotes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publish Scorecard Modal */}
      {publishedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 border border-[#CBD5E1]">
            <h3 className="font-bold text-base text-[#0F2740]">Publish New Scorecard Version</h3>
            <p className="text-xs text-[#6B7480]">
              Freezes current telemetry metrics into an immutable version snapshot accessible to School Leadership.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0F2740]">Version Title / Notes</label>
              <input
                type="text"
                value={newVersionName}
                onChange={(e) => setNewVersionName(e.target.value)}
                className="w-full text-xs border border-[#CBD5E1] rounded-md p-2 text-[#0F2740]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPublishedModalOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-[#6B7480] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#0F2740] text-white hover:bg-[#1E3A5A]"
              >
                Publish &amp; Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
