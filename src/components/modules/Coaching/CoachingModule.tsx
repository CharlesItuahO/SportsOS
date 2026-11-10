import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Coach } from '../../../types';
import { 
  Award, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  UserCheck, 
  Briefcase,
  Search,
  ExternalLink
} from 'lucide-react';

export const CoachingModule: React.FC = () => {
  const { 
    activeSubtab, 
    setActiveSubtab, 
    filteredCoaches, 
    observations, 
    selectedCampus 
  } = useApp();

  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(filteredCoaches[0] || null);
  const [coachSearch, setCoachSearch] = useState('');

  const displayedCoaches = filteredCoaches.filter(c => {
    if (coachSearch) {
      const q = coachSearch.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.sports.some(s => s.toLowerCase().includes(q));
    }
    return true;
  });

  const expiringCount = filteredCoaches.filter(c => c.vettingStatus === 'Expiring Soon').length;
  const overdueTrainingCount = filteredCoaches.filter(c => !c.mandatoryTrainingCompleted).length;

  return (
    <div className="space-y-6">
      {/* Module Header & Subtab Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F2740]">
              Coaching, People &amp; Culture
            </h1>
            <p className="text-xs text-[#6B7480]">
              Coach deployment, pedagogical observation rubrics, safeguarding vetting compliance, and CPD hours.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {expiringCount > 0 && (
              <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>{expiringCount} Vetting At Risk (&lt;30d)</span>
              </span>
            )}
            {overdueTrainingCount > 0 && (
              <span className="text-xs font-semibold bg-red-100 text-red-900 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                <span>{overdueTrainingCount} Mandatory Training Overdue</span>
              </span>
            )}
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 border-t border-[#F1F5F9] pt-3 overflow-x-auto">
          {[
            { id: 'roster', label: 'Coach Roster & Workload' },
            { id: 'observations', label: 'Observation Logs & Rubrics' },
            { id: 'standards', label: 'Coaching Standards Framework' },
            { id: 'pd', label: 'CPD & Certifications Tracker' },
            { id: 'recruitment', label: 'Recruitment Pipeline' }
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

      {/* Subtab 1: Coach Roster & Workload */}
      {activeSubtab === 'roster' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table List Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#9AA3B0]" />
                  <input
                    type="text"
                    placeholder="Search coach by name or sport..."
                    value={coachSearch}
                    onChange={(e) => setCoachSearch(e.target.value)}
                    className="w-full text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2.5 py-1.5 text-[#0F2740] focus:outline-none"
                  />
                </div>
                <span className="text-xs text-[#6B7480]">{displayedCoaches.length} coaches on roster</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F8FAFC] text-[#6B7480] uppercase tracking-wider border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-3 py-2.5 font-semibold">Coach</th>
                      <th className="px-3 py-2.5 font-semibold">Role</th>
                      <th className="px-3 py-2.5 font-semibold">Sports</th>
                      <th className="px-3 py-2.5 font-semibold text-center">Load (hrs)</th>
                      <th className="px-3 py-2.5 font-semibold text-center">Obs Score</th>
                      <th className="px-3 py-2.5 font-semibold text-right">Vetting Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {displayedCoaches.map(c => {
                      const isSelected = selectedCoach?.id === c.id;
                      const isOverloaded = c.weeklyHours >= c.maxWeeklyHours;

                      return (
                        <tr 
                          key={c.id} 
                          onClick={() => setSelectedCoach(c)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-orange-50/50' : 'hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <td className="px-3 py-2.5 font-bold text-[#0F2740]">
                            {c.name}
                            {!c.mandatoryTrainingCompleted && (
                              <span className="ml-1 text-[9px] bg-red-100 text-red-800 font-bold px-1 rounded">
                                Training Overdue
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-[#6B7480]">{c.roleType}</td>
                          <td className="px-3 py-2.5 text-[#3F4B5A]">{c.sports.join(', ')}</td>
                          <td className="px-3 py-2.5 text-center font-mono">
                            <span className={`font-bold ${isOverloaded ? 'text-amber-700' : 'text-[#0F2740]'}`}>
                              {c.weeklyHours}h
                            </span>
                            <span className="text-[#9AA3B0] text-[10px]"> / {c.maxWeeklyHours}h</span>
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-[#0F2740]">
                            {c.observationScore.toFixed(1)} / 4.0
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              c.vettingStatus === 'Valid' ? 'bg-emerald-100 text-emerald-800' :
                              c.vettingStatus === 'Expiring Soon' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                              'bg-red-100 text-red-900'
                            }`}>
                              {c.vettingStatus} ({c.vettingExpiryDate})
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Coach Profile Card Column */}
          {selectedCoach && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
              <div className="border-b border-[#F1F5F9] pb-3">
                <span className="text-[10px] font-bold uppercase text-[#F26B1D]">{selectedCoach.roleType}</span>
                <h3 className="text-lg font-bold text-[#0F2740]">{selectedCoach.name}</h3>
                <p className="text-xs text-[#6B7480]">{selectedCoach.email} · {selectedCoach.phone}</p>
              </div>

              {/* Workload Metric */}
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7480]">Weekly Coaching Load</span>
                  <span className="font-mono font-bold text-[#0F2740]">
                    {selectedCoach.weeklyHours} / {selectedCoach.maxWeeklyHours} hours
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      selectedCoach.weeklyHours >= selectedCoach.maxWeeklyHours ? 'bg-amber-500' : 'bg-[#0F2740]'
                    }`}
                    style={{ width: `${(selectedCoach.weeklyHours / selectedCoach.maxWeeklyHours) * 100}%` }}
                  />
                </div>
              </div>

              {/* Vetting & Safeguarding */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#6B7480] uppercase text-[10px] block">
                  DBS Enhanced Vetting &amp; Compliance
                </span>
                <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-[#0F2740]">Status: {selectedCoach.vettingStatus}</p>
                    <p className="text-[10px] text-[#6B7480]">Expiry Date: {selectedCoach.vettingExpiryDate}</p>
                  </div>
                  {selectedCoach.vettingStatus === 'Expiring Soon' && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Renewal In Progress
                    </span>
                  )}
                </div>
              </div>

              {/* Assigned Teams */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#6B7480] uppercase text-[10px] block">
                  Assigned Squads
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCoach.assignedTeams.map((tm, i) => (
                    <span key={i} className="bg-slate-100 text-[#0F2740] font-medium px-2 py-1 rounded text-[11px]">
                      {tm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#6B7480] uppercase text-[10px] block">
                  Certified Qualifications
                </span>
                <div className="space-y-1">
                  {selectedCoach.qualifications.map((q, i) => (
                    <div key={i} className="p-1.5 bg-[#F8FAFC] rounded border border-[#F1F5F9] text-[11px] text-[#3F4B5A]">
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              {/* CPD Hours */}
              <div className="pt-2 border-t border-[#F1F5F9] flex justify-between items-center text-xs">
                <span className="text-[#6B7480]">PD Hours This Term:</span>
                <span className="font-bold font-mono text-[#0F2740]">{selectedCoach.pdHoursThisTerm} hours</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: Observations & Rubrics */}
      {activeSubtab === 'observations' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Formal Pedagogical Observation Logs</h3>
              <p className="text-xs text-[#6B7480]">
                Rubric evaluations scored 1.0 - 4.0 across session architecture, questioning, and student autonomy
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              Department Avg: 3.68 / 4.0
            </span>
          </div>

          <div className="space-y-3">
            {observations.map(obs => (
              <div key={obs.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-[#0F2740]">{obs.coachName}</h4>
                    <p className="text-xs text-[#6B7480]">Observed by: {obs.observerName} on {obs.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-[#0F2740] text-white px-2 py-0.5 rounded">
                      Score: {obs.overallScore} / 4.0
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      {obs.status}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded border border-[#E2E8F0] text-xs space-y-1">
                  <p className="font-semibold text-[#0F2740]">Focus Area: {obs.focusArea}</p>
                  <p className="text-[#3F4B5A]"><b>Observed Strengths:</b> {obs.strengths}</p>
                  <p className="text-[#D97706]"><b>Actionable Development Item:</b> {obs.actionItems}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Coaching Standards Framework */}
      {activeSubtab === 'standards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              level: 'Level 1: Universal & Participation Coaching',
              audience: 'Year 7-9 PE & Recreational Clubs',
              focus: 'Maximum ball-rolling time, psychological safety, positive reinforcement, inclusive game formats',
              rubricTarget: '≥ 3.2 / 4.0'
            },
            {
              level: 'Level 2: Squad Development Coaching',
              audience: 'Junior School Teams (U13-U15 A/B)',
              focus: 'Tactical decision-making, small-sided gameplay, structured warm-ups and injury prevention (FIFA 11+ / Activate)',
              rubricTarget: '≥ 3.5 / 4.0'
            },
            {
              level: 'Level 3: High-Performance Specialist Coaching',
              audience: '1st Squads & National Pathways',
              focus: 'Periodized conditioning, video analysis integration, tactical press frameworks, elite athlete wellbeing balance',
              rubricTarget: '≥ 3.8 / 4.0'
            }
          ].map((std, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
              <span className="text-[10px] font-bold uppercase text-[#F26B1D]">Standard {i + 1}</span>
              <h4 className="font-bold text-sm text-[#0F2740]">{std.level}</h4>
              <p className="text-xs text-[#6B7480]"><b>Target Cohort:</b> {std.audience}</p>
              <p className="text-xs text-[#3F4B5A] leading-relaxed">{std.focus}</p>
              <div className="pt-2 border-t border-[#F1F5F9] text-xs text-[#0F2740] font-semibold">
                Rubric Benchmark: {std.rubricTarget}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 4: CPD & Certifications Tracker */}
      {activeSubtab === 'pd' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h3 className="font-bold text-sm text-[#0F2740]">Professional Development &amp; Mandatory Certifications</h3>
            <p className="text-xs text-[#6B7480]">
              Annual target: 12 PD hours per coach. Tracking Safeguarding in Sport, Level 3 First Aid, Concussion SCAT6, and NGB badges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2 text-xs">
              <h4 className="font-bold text-[#0F2740]">Upcoming Mandatory Workshops</h4>
              <div className="space-y-1.5">
                <div className="p-2 bg-white rounded border border-[#E2E8F0] flex justify-between">
                  <span>RFU Headcase Concussion Management 2026</span>
                  <span className="font-mono text-[#6B7480]">Thu 26 Nov</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E2E8F0] flex justify-between">
                  <span>Pedagogical Questioning in Games Play</span>
                  <span className="font-mono text-[#6B7480]">Wed 09 Dec</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-2 text-xs">
              <h4 className="font-bold text-[#0F2740]">Department Compliance Summary</h4>
              <div className="space-y-1 text-[11px] text-[#3F4B5A]">
                <p>• Enhanced DBS Cleared: <b>100%</b> (2 expiring in &lt;30d)</p>
                <p>• Safeguarding Level 2 Certified: <b>96%</b></p>
                <p>• Pitchside First Aid in Sport: <b>92%</b></p>
                <p>• Average PD Hours logged: <b>11.8 hours / coach</b></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: Recruitment Pipeline */}
      {activeSubtab === 'recruitment' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Active Coaching Recruitment Roles</h3>
              <p className="text-xs text-[#6B7480]">Hiring pipeline for upcoming Lent &amp; Trinity terms</p>
            </div>
            <span className="text-xs font-mono text-[#6B7480]">2 Open Positions</span>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Graduate Assistant Coach (Cricket & Hockey)', campus: 'North Campus', applicants: 14, stage: 'Final Interview', targetStart: 'Jan 2027' },
              { title: 'Lead Strength & Conditioning Coach (Junior Pathways)', campus: 'South Campus', applicants: 22, stage: 'Shortlisting', targetStart: 'Jan 2027' }
            ].map((role, i) => (
              <div key={i} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#0F2740]">{role.title}</h4>
                  <p className="text-[#6B7480]">{role.campus} · Target Start: {role.targetStart}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#0F2740]">{role.applicants} Applicants</span>
                  <span className="block text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold mt-0.5">
                    {role.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
