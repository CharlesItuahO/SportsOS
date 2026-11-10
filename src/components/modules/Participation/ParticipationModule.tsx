import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Users, 
  UserCheck, 
  Heart, 
  Layers, 
  Download, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Smile, 
  BatteryCharging, 
  Activity 
} from 'lucide-react';

export const ParticipationModule: React.FC = () => {
  const { 
    activeSubtab, 
    setActiveSubtab, 
    filteredStudents, 
    selectedCampus,
    campuses 
  } = useApp();

  const [studentSearch, setStudentSearch] = useState('');
  const [filterYear, setFilterYear] = useState<string>('ALL');
  const [filterGender, setFilterGender] = useState<string>('ALL');

  // Filter students
  const displayedStudents = filteredStudents.filter(s => {
    if (studentSearch) {
      const q = studentSearch.toLowerCase();
      const match = `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.sports.some(sp => sp.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filterYear !== 'ALL' && s.yearGroup.toString() !== filterYear) return false;
    if (filterGender !== 'ALL' && s.gender !== filterGender) return false;
    return true;
  });

  const totalFiltered = filteredStudents.length;
  const meaningfulCount = filteredStudents.filter(s => s.isMeaningful).length;
  const meaningfulPercent = totalFiltered > 0 ? ((meaningfulCount / totalFiltered) * 100).toFixed(1) : '0';

  // Cohort participation breakdowns
  const yearCohorts = [
    { year: 7, boys: 88, girls: 86, overall: 87.0 },
    { year: 8, boys: 85, girls: 83, overall: 84.0 },
    { year: 9, boys: 84, girls: 71, overall: 77.5, gap: true }, // Gap detected!
    { year: 10, boys: 82, girls: 69, overall: 75.5, gap: true }, // Gap detected!
    { year: 11, boys: 80, girls: 74, overall: 77.0, gap: true }, // Gap detected!
    { year: 12, boys: 89, girls: 87, overall: 88.0 },
    { year: 13, boys: 91, girls: 88, overall: 89.5 },
  ];

  // Export to CSV functionality
  const handleExportCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Gender', 'Year Group', 'Campus', 'Ability Tier', 'Sports', 'Weekly Sessions', 'Attendance %', 'Meaningful'];
    const rows = displayedStudents.map(s => [
      s.id,
      s.firstName,
      s.lastName,
      s.gender,
      s.yearGroup,
      s.campusId,
      s.abilityTier,
      `"${s.sports.join(', ')}"`,
      s.weeklySessions,
      s.attendanceRate,
      s.isMeaningful ? 'Yes' : 'No'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SportsOS_Student_Participation_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Module Navigation Header */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F2740]">
              Student Participation, Curriculum &amp; Wellbeing
            </h1>
            <p className="text-xs text-[#6B7480]">
              Universal meaningful participation tracking (target ≥80%), cohort gap detection, and curriculum delivery.
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2740] hover:bg-[#1E3A5A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#F26B1D]" />
            <span>Export Roster CSV</span>
          </button>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 border-t border-[#F1F5F9] pt-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Participation Overview & Gap Detector' },
            { id: 'students', label: 'Student Roster Directory' },
            { id: 'curriculum', label: 'PE Curriculum Coverage Matrix' },
            { id: 'wellbeing', label: 'Post-Session Wellbeing Pulse' }
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

      {/* Subtab 1: Overview & Gap Detector */}
      {activeSubtab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-1">
              <span className="text-xs text-[#6B7480]">Overall Meaningful Participation</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-[#0F2740]">{meaningfulPercent}%</span>
                <span className="text-xs text-emerald-700 font-semibold font-mono">Target: ≥80%</span>
              </div>
              <p className="text-[11px] text-[#9AA3B0]">Definition: ≥2 sessions/wk OR in school squad</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-1">
              <span className="text-xs text-[#6B7480]">Identified Inclusivity Gaps</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-red-600">3</span>
                <span className="text-xs text-red-700 font-semibold">Cohorts &gt;10% below target</span>
              </div>
              <p className="text-[11px] text-[#9AA3B0]">Girls Year 9, Year 10, Year 11 flagged</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-1">
              <span className="text-xs text-[#6B7480]">Average Session Attendance</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-[#0F2740]">89.4%</span>
                <span className="text-xs text-[#6B7480] font-mono">Term-to-date</span>
              </div>
              <p className="text-[11px] text-[#9AA3B0]">Consolidated across Games, PE and Clubs</p>
            </div>
          </div>

          {/* Inclusivity Gap Detector Alert Banner */}
          <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <h3 className="font-bold text-sm text-red-950">
                Inclusivity Gap Detector: Action Required in Senior Girls Cohorts
              </h3>
            </div>
            <p className="text-xs text-red-900 leading-relaxed">
              Girls in <b>Year 9 (71%)</b> and <b>Year 10 (69%)</b> fall more than 10 percentage points below the 80% whole-school target. The primary attrition factor logged in pastoral reviews is disengagement from compulsory wet-weather cross country. Corrective action: launching elective climbing and padel tennis cohorts from Michaelmas Week 8.
            </p>
          </div>

          {/* Year Group Breakdown Table */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#F1F5F9]">
              <h3 className="font-bold text-sm text-[#0F2740]">Cohort Participation Breakdown by Year Group</h3>
              <p className="text-xs text-[#6B7480]">Red border outlines identify cohorts triggering the inclusivity gap threshold</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8FAFC] text-[#6B7480] uppercase tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Year Group</th>
                    <th className="px-4 py-2.5 font-semibold text-center">Boys (%)</th>
                    <th className="px-4 py-2.5 font-semibold text-center">Girls (%)</th>
                    <th className="px-4 py-2.5 font-semibold text-center">Overall Cohort (%)</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Inclusivity Gap Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {yearCohorts.map(c => (
                    <tr key={c.year} className={`hover:bg-[#F8FAFC] ${c.gap ? 'bg-red-50/20' : ''}`}>
                      <td className="px-4 py-3 font-bold text-[#0F2740]">Year {c.year}</td>
                      <td className="px-4 py-3 text-center font-mono font-medium">{c.boys}%</td>
                      <td className="px-4 py-3 text-center font-mono font-medium">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          c.girls < 75 ? 'bg-red-100 text-red-800 border border-red-300' : 'text-[#0F2740]'
                        }`}>
                          {c.girls}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-[#0F2740]">
                        {c.overall}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        {c.gap ? (
                          <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                            Gap Detected (-{80 - c.girls}%)
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            Target Met
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Student Roster Directory */}
      {activeSubtab === 'students' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#9AA3B0]" />
              <input
                type="text"
                placeholder="Search by student name or sport..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2.5 py-1.5 focus:outline-none text-[#0F2740]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2 py-1.5 text-[#0F2740]"
              >
                <option value="ALL">All Years (7-13)</option>
                {[7, 8, 9, 10, 11, 12, 13].map(y => (
                  <option key={y} value={y.toString()}>Year {y}</option>
                ))}
              </select>

              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded px-2 py-1.5 text-[#0F2740]"
              >
                <option value="ALL">All Genders</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] text-[#6B7480] uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Student</th>
                  <th className="px-3 py-2.5 font-semibold">Year</th>
                  <th className="px-3 py-2.5 font-semibold">Campus</th>
                  <th className="px-3 py-2.5 font-semibold">Ability Tier</th>
                  <th className="px-3 py-2.5 font-semibold">Sports Engaged</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Sessions/Wk</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Attendance</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Meaningful</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {displayedStudents.map(s => (
                  <tr key={s.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-3 py-2.5 font-semibold text-[#0F2740]">
                      {s.firstName} {s.lastName}
                      {s.hasSEND && (
                        <span className="ml-1.5 text-[9px] bg-purple-100 text-purple-800 font-bold px-1 rounded">
                          SEND
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-[#6B7480]">Y{s.yearGroup}</td>
                    <td className="px-3 py-2.5 text-[#6B7480] capitalize">{s.campusId.replace('campus-', '')}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        s.abilityTier === 'Elite' ? 'bg-orange-100 text-orange-900' :
                        s.abilityTier === 'Performance' ? 'bg-blue-100 text-blue-900' :
                        s.abilityTier === 'Development' ? 'bg-slate-100 text-slate-800' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {s.abilityTier}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[#3F4B5A]">{s.sports.join(', ')}</td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold">{s.weeklySessions}</td>
                    <td className="px-3 py-2.5 text-center font-mono">{s.attendanceRate}%</td>
                    <td className="px-3 py-2.5 text-right">
                      {s.isMeaningful ? (
                        <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold flex items-center justify-end gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Curriculum Coverage Heatmap */}
      {activeSubtab === 'curriculum' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">PE Curriculum Strand Delivery Matrix</h3>
              <p className="text-xs text-[#6B7480]">National Curriculum Physical Education statutory strand completion by year group</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-600 rounded"></span> Delivered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-amber-500 rounded"></span> Partial / In Progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-red-500 rounded"></span> Curriculum Gap
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#6B7480] uppercase">
                  <th className="p-3 text-left font-semibold">Year Group</th>
                  <th className="p-3 font-semibold">Invasion Games</th>
                  <th className="p-3 font-semibold">Net &amp; Wall</th>
                  <th className="p-3 font-semibold">Striking &amp; Fielding</th>
                  <th className="p-3 font-semibold">Aquatics &amp; Lifesaving</th>
                  <th className="p-3 font-semibold">Gymnastics &amp; Dance</th>
                  <th className="p-3 font-semibold">Athletics &amp; Conditioning</th>
                  <th className="p-3 font-semibold">Outdoor Adventurous (OAA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {[7, 8, 9, 10, 11].map(yr => (
                  <tr key={yr}>
                    <td className="p-3 text-left font-bold text-[#0F2740]">Year {yr}</td>
                    <td className="p-2"><div className="bg-emerald-500 text-white rounded py-1.5 font-semibold text-[11px]">Delivered</div></td>
                    <td className="p-2"><div className="bg-emerald-500 text-white rounded py-1.5 font-semibold text-[11px]">Delivered</div></td>
                    <td className="p-2"><div className="bg-emerald-500 text-white rounded py-1.5 font-semibold text-[11px]">Delivered</div></td>
                    <td className="p-2">
                      <div className={yr >= 10 ? 'bg-amber-400 text-amber-950 rounded py-1.5 font-semibold text-[11px]' : 'bg-emerald-500 text-white rounded py-1.5 font-semibold text-[11px]'}>
                        {yr >= 10 ? 'Partial' : 'Delivered'}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className={yr === 9 ? 'bg-red-400 text-white rounded py-1.5 font-semibold text-[11px]' : 'bg-emerald-500 text-white rounded py-1.5 font-semibold text-[11px]'}>
                        {yr === 9 ? 'Gap' : 'Delivered'}
                      </div>
                    </td>
                    <td className="p-2"><div className="bg-emerald-500 text-white rounded py-1.5 font-semibold text-[11px]">Delivered</div></td>
                    <td className="p-2">
                      <div className={yr >= 9 ? 'bg-amber-400 text-amber-950 rounded py-1.5 font-semibold text-[11px]' : 'bg-emerald-500 text-white rounded py-1.5 font-semibold text-[11px]'}>
                        {yr >= 9 ? 'Partial' : 'Delivered'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 4: Post-Session Wellbeing Pulse */}
      {activeSubtab === 'wellbeing' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-4 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Post-Session Pupil Wellbeing Pulse</h3>
              <p className="text-xs text-[#6B7480]">
                Logged by coaches and PE staff at the conclusion of training or fixtures (Mood, Energy, Physical Strain)
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              94% Response Capture Rate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
              <span className="text-xs font-bold uppercase text-[#6B7480] flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-emerald-600" /> Average Session Enjoyment
              </span>
              <p className="text-2xl font-bold font-mono text-[#0F2740]">4.6 / 5.0</p>
              <p className="text-[11px] text-[#6B7480]">Based on 1,420 pulse submissions this term</p>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
              <span className="text-xs font-bold uppercase text-[#6B7480] flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-amber-600" /> Subjective Energy Levels
              </span>
              <p className="text-2xl font-bold font-mono text-[#0F2740]">78% High Energy</p>
              <p className="text-[11px] text-[#6B7480]">18% Normal, 4% Elevated Fatigue</p>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
              <span className="text-xs font-bold uppercase text-[#6B7480] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" /> Pastoral System Sync
              </span>
              <p className="text-2xl font-bold font-mono text-emerald-700">Webhook Active</p>
              <p className="text-[11px] text-[#6B7480]">Automatic flag pushed to Head of Year when student rates ≤2</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
