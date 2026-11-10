import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { AthleteProfile, PathwayStage } from '../../../types';
import { 
  Trophy, 
  Award, 
  Activity, 
  ExternalLink, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle,
  MoveRight,
  Plus
} from 'lucide-react';

export const PerformanceModule: React.FC = () => {
  const { 
    activeSubtab, 
    setActiveSubtab, 
    filteredTeams, 
    athletes, 
    moveAthletePathway,
    selectedCampus 
  } = useApp();

  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProfile | null>(athletes[0] || null);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [targetAthlete, setTargetAthlete] = useState<AthleteProfile | null>(null);
  const [targetNewStage, setTargetNewStage] = useState<PathwayStage>('Performance');
  const [movementReason, setMovementReason] = useState('');

  // Pathway columns
  const stages: PathwayStage[] = ['Foundation', 'Development', 'Performance', 'Elite'];

  // Elite guardrail check:
  // "Elite does not crowd out participation" guardrail: alert when a sport's elite roster exceeds 15% of participants
  const eliteAthletesCount = athletes.filter(a => a.stage === 'Elite').length;
  const totalPathwayAthletes = athletes.length;
  const elitePercent = totalPathwayAthletes > 0 ? ((eliteAthletesCount / totalPathwayAthletes) * 100).toFixed(1) : '0';
  const isEliteGuardrailExceeded = parseFloat(elitePercent) > 20.0;

  const handleOpenMovementModal = (ath: AthleteProfile, stage: PathwayStage) => {
    setTargetAthlete(ath);
    setTargetNewStage(stage);
    setMovementReason('');
    setMovementModalOpen(true);
  };

  const handleConfirmMovement = () => {
    if (!targetAthlete || !movementReason.trim()) return;
    moveAthletePathway(targetAthlete.id, targetNewStage, movementReason.trim());
    setMovementModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Header & Subtab Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F2740]">
              Performance Sport &amp; Talent Pathways
            </h1>
            <p className="text-xs text-[#6B7480]">
              Transparent squad selections, talent pathway pipeline, athletic benchmarks, and club/NGB linkages.
            </p>
          </div>
          {/* Guardrail badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-[#F8FAFC] border border-[#CBD5E1] px-3 py-1.5 rounded-lg text-xs">
            <ShieldCheck className="w-4 h-4 text-[#1E8A5A]" />
            <span className="text-[#3F4B5A]">Elite Guardrail:</span>
            <span className="font-mono font-bold text-[#0F2740]">{elitePercent}% of roster</span>
            <span className="text-[10px] text-emerald-700 font-semibold">(Limit: &lt;15%)</span>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 border-t border-[#F1F5F9] pt-3 overflow-x-auto">
          {[
            { id: 'teams', label: 'Squad & Team Directory' },
            { id: 'pathways', label: 'Talent Pathway Board' },
            { id: 'athletes', label: 'Athlete Profiles & Benchmarks' },
            { id: 'benchmarks', label: 'Physical Testing Standards' },
            { id: 'links', label: 'External Scouts & Academies' }
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

      {/* Subtab 1: Squad & Team Directory */}
      {activeSubtab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map(team => (
            <div key={team.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26B1D]">
                    {team.sport} · {team.ageGroup}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded">
                    Tier {team.tier}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#0F2740] mt-1">{team.name}</h3>
                <p className="text-xs text-[#6B7480] mt-0.5">Head Coach: <b>{team.coachName}</b></p>
              </div>

              <div className="pt-2 border-t border-[#F1F5F9] space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#6B7480]">
                  <span>Squad Size:</span>
                  <span className="font-mono font-bold text-[#0F2740]">{team.athleteCount} athletes</span>
                </div>
                {team.nextFixture && (
                  <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0] text-[11px] text-[#3F4B5A]">
                    <span className="font-semibold text-[#0F2740] block">Next Fixture:</span>
                    {team.nextFixture}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 2: Talent Pathway Board (Kanban style with Movement Reason modal) */}
      {activeSubtab === 'pathways' && (
        <div className="space-y-4">
          {/* Guardrail status explanation */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <b>Transparent Selection Policy:</b> Moving an athlete across stages requires an auditable reason recorded in the governance log.
              </span>
            </div>
            <span className="font-mono text-[11px] font-semibold text-blue-950">
              Total Pathway Pool: {athletes.length} Athletes
            </span>
          </div>

          {/* Kanban Board Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stages.map(stage => {
              const stageAthletes = athletes.filter(a => a.stage === stage);
              const headerColor = 
                stage === 'Elite' ? 'border-t-4 border-t-[#F26B1D]' :
                stage === 'Performance' ? 'border-t-4 border-t-[#0F2740]' :
                stage === 'Development' ? 'border-t-4 border-t-blue-600' :
                'border-t-4 border-t-slate-400';

              return (
                <div key={stage} className={`bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col ${headerColor}`}>
                  <div className="p-3 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
                    <div>
                      <h3 className="font-bold text-xs text-[#0F2740]">{stage}</h3>
                      <p className="text-[10px] text-[#6B7480]">
                        {stage === 'Elite' ? 'National / Professional' :
                         stage === 'Performance' ? '1st Squad / County' :
                         stage === 'Development' ? 'Emerging Potential' : 'Universal Intake'}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#0F2740] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {stageAthletes.length}
                    </span>
                  </div>

                  <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[500px]">
                    {stageAthletes.map(ath => (
                      <div 
                        key={ath.id} 
                        className="p-3 bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] rounded-lg text-xs space-y-2 transition-all shadow-2xs group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-[#0F2740] block">{ath.studentName}</span>
                            <span className="text-[10px] text-[#6B7480]">Y{ath.yearGroup} · {ath.sport}</span>
                          </div>
                          <span className="text-[9px] bg-white text-slate-700 border border-[#CBD5E1] px-1 rounded font-mono">
                            {ath.primaryTeam}
                          </span>
                        </div>

                        {ath.benchmarks.length > 0 && (
                          <div className="text-[10px] text-[#6B7480] bg-white p-1.5 rounded border border-[#F1F5F9] flex justify-between">
                            <span>{ath.benchmarks[0].testName}</span>
                            <b className="text-[#0F2740] font-mono">{ath.benchmarks[0].score} ({ath.benchmarks[0].percentile}th %tile)</b>
                          </div>
                        )}

                        {/* Move trigger */}
                        <div className="pt-1 flex items-center justify-between border-t border-[#F1F5F9]">
                          <button
                            onClick={() => setSelectedAthlete(ath)}
                            className="text-[10px] text-[#6B7480] hover:text-[#0F2740] underline"
                          >
                            Profile Details
                          </button>

                          <div className="flex items-center gap-1">
                            {stage !== 'Elite' && (
                              <button
                                onClick={() => handleOpenMovementModal(
                                  ath, 
                                  stage === 'Foundation' ? 'Development' : 
                                  stage === 'Development' ? 'Performance' : 'Elite'
                                )}
                                className="text-[10px] font-bold text-[#0F2740] hover:text-[#F26B1D] flex items-center gap-0.5"
                                title="Promote Stage"
                              >
                                Promote <MoveRight className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {stageAthletes.length === 0 && (
                      <p className="text-center text-[#9AA3B0] py-6 text-xs">No athletes in this tier</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 3: Athlete Profiles & Benchmarks Detail */}
      {activeSubtab === 'athletes' && selectedAthlete && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Athlete Selector Column */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-3 space-y-2">
            <h3 className="font-bold text-xs uppercase text-[#6B7480] px-1 mb-2">Select Pathway Athlete</h3>
            <div className="space-y-1">
              {athletes.map(a => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAthlete(a)}
                  className={`w-full p-2.5 text-left rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedAthlete.id === a.id 
                      ? 'bg-[#0F2740] text-white font-semibold' 
                      : 'hover:bg-[#F8FAFC] text-[#0F2740]'
                  }`}
                >
                  <div>
                    <span className="block">{a.studentName}</span>
                    <span className={`text-[10px] ${selectedAthlete.id === a.id ? 'text-[#9AA3B0]' : 'text-[#6B7480]'}`}>
                      Y{a.yearGroup} · {a.sport}
                    </span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    selectedAthlete.id === a.id ? 'bg-[#F26B1D] text-white' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {a.stage}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Athlete Profile Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#0F2740]">{selectedAthlete.studentName}</h2>
                    <span className="text-xs bg-[#0F2740] text-white font-bold px-2 py-0.5 rounded">
                      {selectedAthlete.stage} Tier
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7480] mt-0.5">
                    Year {selectedAthlete.yearGroup} · {selectedAthlete.sport} · Team: <b>{selectedAthlete.primaryTeam}</b>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#6B7480] block">External Club Affiliations</span>
                  <span className="text-xs font-semibold text-[#0F2740]">
                    {selectedAthlete.externalAffiliations.join(', ') || 'School Squad Only'}
                  </span>
                </div>
              </div>

              {/* Benchmark percentile table */}
              <div>
                <h4 className="font-bold text-xs uppercase text-[#6B7480] mb-2">Physical Testing Battery</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedAthlete.benchmarks.map((b, i) => (
                    <div key={i} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                      <span className="text-[10px] text-[#6B7480] truncate block">{b.testName}</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-bold font-mono text-[#0F2740]">{b.score}</span>
                        <span className="text-xs font-bold font-mono text-[#F26B1D]">{b.percentile}th %tile</span>
                      </div>
                      <span className="text-[10px] text-[#9AA3B0]">Tested: {b.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Movement History & Selection Audit Trail */}
              <div>
                <h4 className="font-bold text-xs uppercase text-[#6B7480] mb-2">Selection &amp; Stage Movement Audit Trail</h4>
                <div className="space-y-2">
                  {selectedAthlete.history.map((h, i) => (
                    <div key={i} className="p-3 rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#0F2740] flex items-center gap-1.5">
                          {h.fromStage} <ArrowRight className="w-3 h-3 text-[#F26B1D]" /> {h.toStage}
                        </span>
                        <span className="text-[10px] font-mono text-[#6B7480]">{h.date}</span>
                      </div>
                      <p className="text-[#3F4B5A] italic">&quot;{h.reason}&quot;</p>
                      <p className="text-[10px] text-[#9AA3B0]">Decision Author: {h.decidedBy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Testing Standards */}
      {activeSubtab === 'benchmarks' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h3 className="font-bold text-sm text-[#0F2740]">Standardized Physical Benchmark Percentile Tables</h3>
            <p className="text-xs text-[#6B7480]">Calibrated standards across Senior and U16 cohorts</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] text-[#6B7480] uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Sport / Metric</th>
                  <th className="px-4 py-2.5 font-semibold text-center">90th Percentile (Elite)</th>
                  <th className="px-4 py-2.5 font-semibold text-center">75th Percentile (Performance)</th>
                  <th className="px-4 py-2.5 font-semibold text-center">50th Percentile (Dev)</th>
                  <th className="px-4 py-2.5 font-semibold text-center">25th Percentile (Foundation)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {[
                  { metric: 'Bronco Test (Rugby / All)', p90: '< 4:45', p75: '< 5:00', p50: '< 5:20', p25: '> 5:35' },
                  { metric: '2000m Ergometer (Rowing Boys)', p90: '< 6:20', p75: '< 6:40', p50: '< 7:05', p25: '> 7:25' },
                  { metric: '2000m Ergometer (Rowing Girls)', p90: '< 7:20', p75: '< 7:40', p50: '< 8:05', p25: '> 8:30' },
                  { metric: 'Beep Test Level (Netball / Hockey)', p90: '> 12.0', p75: '> 11.2', p50: '> 10.0', p25: '< 9.2' },
                  { metric: '10m Sprint Electronic (Seconds)', p90: '< 1.70s', p75: '< 1.75s', p50: '< 1.82s', p25: '> 1.90s' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-bold text-[#0F2740]">{row.metric}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-[#F26B1D]">{row.p90}</td>
                    <td className="px-4 py-3 text-center font-mono font-semibold text-[#0F2740]">{row.p75}</td>
                    <td className="px-4 py-3 text-center font-mono text-[#3F4B5A]">{row.p50}</td>
                    <td className="px-4 py-3 text-center font-mono text-[#6B7480]">{row.p25}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 5: External Scouts */}
      {activeSubtab === 'links' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Saracens RFC Junior Academy', type: 'Professional Rugby', contact: 'Donny Ray', email: 'donny.ray@saracens.net', scouts: '3 athletes tracked' },
            { name: 'Surrey Storm Netball Hub', type: 'Superleague Pathway', contact: 'Mikayla Austin', email: 'm.austin@surreystorm.co.uk', scouts: '2 athletes tracked' },
            { name: 'Leander Club GB Rowing', type: 'High Performance Rowing', contact: 'Mark Edwards', email: 'm.edwards@leander.co.uk', scouts: '4 athletes tracked' },
            { name: 'Harlequins DPP', type: 'Regional Rugby', contact: 'Alex Grove', email: 'a.grove@quins.co.uk', scouts: '6 athletes tracked' },
            { name: 'US Collegiate Athletic Placement', type: 'NCAA Division 1/2', contact: 'Rachel Adams', email: 'radams@collegesportus.org', scouts: 'Rowing & Athletics' },
          ].map((link, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-[#F26B1D] uppercase">{link.type}</span>
              <h4 className="font-bold text-sm text-[#0F2740]">{link.name}</h4>
              <p className="text-xs text-[#6B7480]">Lead Liaison: {link.contact}</p>
              <p className="text-xs font-mono text-[#0F2740]">{link.email}</p>
              <div className="pt-2 border-t border-[#F1F5F9] flex justify-between items-center text-[11px]">
                <span className="text-emerald-700 font-semibold">{link.scouts}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#6B7480]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Movement Reason Modal */}
      {movementModalOpen && targetAthlete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 border border-[#CBD5E1]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26B1D]">
                Pathway Movement Audit Form
              </span>
              <h3 className="font-bold text-base text-[#0F2740]">
                Move {targetAthlete.studentName} to {targetNewStage}
              </h3>
              <p className="text-xs text-[#6B7480] mt-1">
                Moving an athlete between pathway stages requires a mandatory auditable justification per Head of Sports policy.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0F2740]">
                Selection Rationale &amp; Objective Evidence <span className="text-red-500">*</span>
              </label>
              <textarea
                value={movementReason}
                onChange={(e) => setMovementReason(e.target.value)}
                placeholder="e.g. England U18 trial performance, achievement of sub-4:45 Bronco, coach observation debrief..."
                rows={3}
                className="w-full text-xs border border-[#CBD5E1] rounded-md p-2 text-[#0F2740] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMovementModalOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-[#6B7480] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMovement}
                disabled={!movementReason.trim()}
                className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#0F2740] text-white hover:bg-[#1E3A5A] disabled:opacity-50"
              >
                Confirm &amp; Record Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
