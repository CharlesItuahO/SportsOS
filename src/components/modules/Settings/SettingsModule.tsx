import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Building2, 
  FileText, 
  Lock, 
  Download, 
  History,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { 
    activeSubtab, 
    setActiveSubtab, 
    auditLogs, 
    campuses, 
    currentRole, 
    setCurrentRole 
  } = useApp();

  const [retentionDays, setRetentionDays] = useState(2555); // 7 years statutory for pupil records

  const handleExportAuditCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Target Reference', 'Details'];
    const rows = auditLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.module}"`,
      `"${l.targetRef}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SportsOS_Audit_Log_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Module Header & Subtab Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F2740]">
              System Settings, Governance &amp; Audit Trail
            </h1>
            <p className="text-xs text-[#6B7480]">
              Multi-campus parameters, role-based access control, statutory retention policies, and immutable audit logs.
            </p>
          </div>
          <button
            onClick={handleExportAuditCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2740] hover:bg-[#1E3A5A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#F26B1D]" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 border-t border-[#F1F5F9] pt-3 overflow-x-auto">
          {[
            { id: 'audit-log', label: 'Live Immutable Audit Log' },
            { id: 'roles', label: 'Role Governance & Policy Matrix' },
            { id: 'campuses', label: 'Multi-Campus Directory' },
            { id: 'retention', label: 'Data Retention & GDPR Policies' }
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

      {/* Subtab 1: Live Audit Log */}
      {activeSubtab === 'audit-log' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Immutable System Audit Trail</h3>
              <p className="text-xs text-[#6B7480]">
                Every sensitive data view, clinical clearance, clash override, and scorecard publication is cryptographically logged.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0F2740]">
              {auditLogs.length} Recorded Entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] text-[#6B7480] uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Timestamp</th>
                  <th className="px-3 py-2.5 font-semibold">User</th>
                  <th className="px-3 py-2.5 font-semibold">Role</th>
                  <th className="px-3 py-2.5 font-semibold">Action</th>
                  <th className="px-3 py-2.5 font-semibold">Module</th>
                  <th className="px-3 py-2.5 font-semibold">Target Ref</th>
                  <th className="px-3 py-2.5 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] font-mono text-[11px]">
                {auditLogs.map(log => {
                  const badgeColor = 
                    log.action === 'MEDICAL_CLEARANCE' ? 'bg-red-100 text-red-900 border-red-300' :
                    log.action === 'OVERRIDE_CLASH' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                    log.action === 'PUBLISH_SCORECARD' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                    'bg-slate-100 text-slate-800 border-slate-300';

                  return (
                    <tr key={log.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-3 py-2.5 text-[#6B7480] whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-3 py-2.5 font-semibold text-[#0F2740] font-sans">{log.userName}</td>
                      <td className="px-3 py-2.5 text-[#6B7480]">{log.userRole}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-[#3F4B5A] font-sans">{log.module}</td>
                      <td className="px-3 py-2.5 font-bold text-[#0F2740]">{log.targetRef}</td>
                      <td className="px-3 py-2.5 text-[#6B7480] font-sans max-w-sm truncate">{log.details}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Role Governance */}
      {activeSubtab === 'roles' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h3 className="font-bold text-sm text-[#0F2740]">Role Scoping &amp; Capability Matrix</h3>
            <p className="text-xs text-[#6B7480]">
              Policy rules governing student data privacy, medical clearance authority, and whole-school strategy publishing.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] text-[#6B7480] uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Role</th>
                  <th className="px-4 py-2.5 font-semibold">Scope</th>
                  <th className="px-4 py-2.5 font-semibold">Key Capabilities &amp; Access Boundaries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {[
                  { role: 'Head of Sports', scope: 'Whole-School', cap: 'Full CRUD on all modules; publish scorecards; approve partnerships, camps, return-to-play overrides' },
                  { role: 'Campus Sports Lead', scope: 'Campus', cap: 'CRUD on participation, fixtures, coaches, facilities within campus; read safeguarding' },
                  { role: 'Lead Coach', scope: 'Assigned Squads', cap: 'Read athlete profiles for assigned teams; log attendance, wellbeing pulse, injuries; view own PD' },
                  { role: 'PE Teacher', scope: 'Campus', cap: 'Read participation; log curriculum coverage; record wellbeing pulse' },
                  { role: 'Medical Officer', scope: 'Campus', cap: 'Read/write injuries and return-to-play within campus; sign clinical clearances' },
                  { role: 'Pastoral Staff', scope: 'Campus', cap: 'Read wellbeing pulse, incident histories, graduated return status' },
                  { role: 'Operations', scope: 'Campus', cap: 'Read/write facilities, equipment, booking matrix, lettings' },
                  { role: 'School Leadership', scope: 'Whole-School', cap: 'Read-only access to published scorecards & high-level dashboards' },
                  { role: 'Student', scope: 'Self', cap: 'Read own profile, fixtures, physical benchmarks' },
                  { role: 'Parent', scope: 'Child', cap: 'Read own child profile, fixtures, physical benchmarks' },
                  { role: 'Admin', scope: 'System', cap: 'User management, SSO integrations, retention policy, full audit logs' },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-bold text-[#0F2740]">{r.role}</td>
                    <td className="px-4 py-3 text-[#6B7480] font-mono">{r.scope}</td>
                    <td className="px-4 py-3 text-[#3F4B5A]">{r.cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Multi-Campus Directory */}
      {activeSubtab === 'campuses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campuses.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
              <span className="text-[10px] font-bold text-[#F26B1D] font-mono">{c.code}</span>
              <h4 className="font-bold text-base text-[#0F2740]">{c.name}</h4>
              <p className="text-xs text-[#6B7480]">{c.address}</p>
              <div className="pt-2 border-t border-[#F1F5F9] text-xs flex justify-between">
                <span className="text-[#6B7480]">Campus Sports Lead:</span>
                <span className="font-semibold text-[#0F2740]">{c.leadName}</span>
              </div>
              <div className="flex justify-between text-xs text-[#6B7480]">
                <span>Student Body:</span>
                <span className="font-mono font-bold text-[#0F2740]">{c.studentCount} pupils</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 4: Data Retention & GDPR */}
      {activeSubtab === 'retention' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h3 className="font-bold text-sm text-[#0F2740]">Statutory Data Retention &amp; GDPR Compliance</h3>
            <p className="text-xs text-[#6B7480]">
              Automated data purging policies for student safeguarding, medical incident records, and consent forms.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-3 max-w-lg">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#0F2740]">Safeguarding &amp; Injury Record Retention Window:</span>
              <span className="font-mono font-bold text-[#0F2740]">{retentionDays} Days (7 Years)</span>
            </div>
            <p className="text-[11px] text-[#6B7480]">
              Statutory UK Department for Education compliance requires athletic injury and accident records involving minors to be retained until the student reaches age 25.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Retention policy active &amp; automated daily purge worker enabled</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
