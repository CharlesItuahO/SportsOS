import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { InjuryRecord, Incident, ReturnToPlayStatus } from '../../../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Activity, 
  Lock, 
  Plus,
  ArrowRight,
  Stethoscope
} from 'lucide-react';

export const SafeguardingModule: React.FC = () => {
  const { 
    activeSubtab, 
    setActiveSubtab, 
    filteredInjuries, 
    filteredIncidents, 
    coaches, 
    signOffMedicalClearance, 
    advanceReturnToPlayStage, 
    addIncident,
    canAccessSafeguarding,
    canSignMedical,
    currentRole 
  } = useApp();

  const [medicalModalOpen, setMedicalModalOpen] = useState(false);
  const [selectedInjury, setSelectedInjury] = useState<InjuryRecord | null>(null);
  const [medicalNotes, setMedicalNotes] = useState('');

  const [incidentModalOpen, setIncidentModalOpen] = useState(false);
  const [newIncType, setNewIncType] = useState<Incident['type']>('Physical Injury');
  const [newIncSeverity, setNewIncSeverity] = useState<Incident['severity']>('Minor');
  const [newIncLocation, setNewIncLocation] = useState('');
  const [newIncPeople, setNewIncPeople] = useState('');
  const [newIncDesc, setNewIncDesc] = useState('');
  const [newIncAction, setNewIncAction] = useState('');

  // Safeguarding access control check
  if (!canAccessSafeguarding) {
    return (
      <div className="bg-white p-12 rounded-xl border border-red-200 text-center space-y-3">
        <Lock className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-[#0F2740]">Safeguarding &amp; Clinical Data Restricted</h2>
        <p className="text-xs text-[#6B7480] max-w-md mx-auto">
          Access to student injury histories, concussion protocols, and safeguarding incident records is strictly role-gated to Head of Sports, Medical Officers, Designated Safeguarding Leads, and Campus Leads.
        </p>
        <p className="text-[11px] font-mono text-[#9AA3B0]">Current Role: {currentRole}</p>
      </div>
    );
  }

  const handleOpenMedicalClearance = (inj: InjuryRecord) => {
    setSelectedInjury(inj);
    setMedicalNotes('');
    setMedicalModalOpen(true);
  };

  const handleConfirmMedicalClearance = () => {
    if (!selectedInjury) return;
    signOffMedicalClearance(selectedInjury.id, medicalNotes);
    setMedicalModalOpen(false);
  };

  const handleCreateIncident = () => {
    if (!newIncLocation || !newIncDesc) return;
    addIncident({
      date: new Date().toISOString().substring(0, 10),
      time: '15:30',
      type: newIncType,
      severity: newIncSeverity,
      campusId: 'campus-north',
      location: newIncLocation,
      peopleInvolved: newIncPeople ? newIncPeople.split(',').map(p => p.trim()) : ['Pupil'],
      description: newIncDesc,
      actionTaken: newIncAction,
      status: 'Open',
      followUpRequired: true,
      loggedBy: currentRole,
    });
    setIncidentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Navigation Header */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded uppercase">
                Confidential &amp; Audited
              </span>
              <span className="text-xs text-[#6B7480]">GDPR &amp; Medical Governance Scoped</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F2740]">
              Safeguarding, Injuries &amp; Return-to-Play Protocol
            </h1>
            <p className="text-xs text-[#6B7480]">
              State-machine Return-to-Play clinical clearance, pupil incident records, and staff DBS vetting compliance.
            </p>
          </div>

          <button
            onClick={() => setIncidentModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2740] hover:bg-[#1E3A5A] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-[#F26B1D]" />
            <span>Log Formal Incident</span>
          </button>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 border-t border-[#F1F5F9] pt-3 overflow-x-auto">
          {[
            { id: 'returns', label: 'Return-to-Play Clinical Protocol (RTP)' },
            { id: 'vetting', label: 'Coach Vetting (DBS) Register' },
            { id: 'incidents', label: 'Safeguarding Incident Log' },
            { id: 'injuries', label: 'Injury Surveillance' }
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

      {/* Subtab 1: Return-to-Play Protocol (State Machine with Medical Enforcement) */}
      {activeSubtab === 'returns' && (
        <div className="space-y-4">
          {/* Clinical Banner */}
          <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-red-950">
                  Strict Clinical Gate: No Return-to-Play Can Bypass Medical Clearance
                </h3>
                <p className="text-xs text-red-900 mt-0.5">
                  Stages: 1. Injury Logged → 2. Clinical Medical Clearance Required → 3. Graduated Sport-Specific Return → 4. Full Match Play. Every clearance generates an unalterable audit log entry.
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-red-900 bg-red-100 px-3 py-1.5 rounded-lg border border-red-300 self-start md:self-auto">
              {filteredInjuries.filter(i => i.returnToPlayStatus !== 'CLEARED_FULL_PLAY').length} Active RTP Cases
            </span>
          </div>

          <div className="space-y-3">
            {filteredInjuries.map(inj => {
              const isMedicalRequired = inj.returnToPlayStatus === 'MEDICAL_CLEARANCE_REQUIRED';
              const isGraduated = inj.returnToPlayStatus === 'GRADUATED_RETURN';
              const isCleared = inj.returnToPlayStatus === 'CLEARED_FULL_PLAY';

              return (
                <div 
                  key={inj.id} 
                  className={`bg-white rounded-xl border p-4 shadow-xs space-y-3 ${
                    isMedicalRequired ? 'border-red-300 bg-red-50/10' : 'border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#F26B1D] uppercase">
                          {inj.sport} · Year {inj.yearGroup}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded">
                          {inj.severity}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#0F2740]">
                        {inj.studentName} — <span className="font-normal text-xs text-[#3F4B5A]">{inj.injuryType}</span>
                      </h4>
                      <p className="text-xs text-[#6B7480]">Date of Injury: {inj.dateOfInjury}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isCleared ? 'bg-emerald-100 text-emerald-800' :
                        isGraduated ? 'bg-blue-100 text-blue-900' :
                        'bg-red-100 text-red-900 border border-red-300'
                      }`}>
                        {inj.returnToPlayStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* 5-Stage Visual Progress Machine */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-semibold text-[#6B7480]">
                      <span>Stage 1: Rest &amp; Diagnosis</span>
                      <span>Stage 2: Medical Assessment</span>
                      <span>Stage 3: Light Aerobic</span>
                      <span>Stage 4: Sport Drills</span>
                      <span>Stage 5: Cleared Full Play</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 h-2">
                      {[1, 2, 3, 4, 5].map(step => (
                        <div
                          key={step}
                          className={`rounded-full ${
                            step <= inj.graduatedStage
                              ? isCleared ? 'bg-emerald-600' : 'bg-[#0F2740]'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Clinical Sign-Off Status */}
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs space-y-1.5">
                    <p className="text-[#3F4B5A]">
                      <b>Medical Officer Notes:</b> {inj.medicalOfficerNotes || 'Awaiting initial physician consultation.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#6B7480] pt-1 border-t border-[#E2E8F0]">
                      <span>Medical Clearance: <b>{inj.medicalSignOffBy || 'Pending Doctor Sign-Off'}</b></span>
                      <span>·</span>
                      <span>Coach Sign-Off: <b>{inj.coachSignOffBy || 'Pending'}</b></span>
                      <span>·</span>
                      <span>Head of Sports Clearance: <b>{inj.headOfSportsSignOffBy || 'Pending'}</b></span>
                    </div>
                  </div>

                  {/* Action Gateway */}
                  <div className="flex justify-end gap-2 pt-1">
                    {isMedicalRequired && canSignMedical && (
                      <button
                        onClick={() => handleOpenMedicalClearance(inj)}
                        className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Sign Off Clinical Medical Clearance</span>
                      </button>
                    )}

                    {isGraduated && (
                      <button
                        onClick={() => advanceReturnToPlayStage(inj.id)}
                        className="px-3.5 py-1.5 bg-[#0F2740] hover:bg-[#1E3A5A] text-white rounded font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F26B1D]" />
                        <span>Advance to Next Stage ({inj.graduatedStage + 1} of 5)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Vetting Register */}
      {activeSubtab === 'vetting' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Enhanced DBS &amp; Safeguarding Vetting Register</h3>
              <p className="text-xs text-[#6B7480]">Mandatory 30-day pre-expiry warning threshold</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0F2740]">
              {coaches.length} Monitored Personnel
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] text-[#6B7480] uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Staff Member</th>
                  <th className="px-3 py-2.5 font-semibold">Role</th>
                  <th className="px-3 py-2.5 font-semibold">Campus</th>
                  <th className="px-3 py-2.5 font-semibold">Vetting Expiry Date</th>
                  <th className="px-3 py-2.5 font-semibold text-center">Mandatory Training</th>
                  <th className="px-3 py-2.5 font-semibold text-right">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {coaches.map(c => (
                  <tr key={c.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-3 py-2.5 font-bold text-[#0F2740]">{c.name}</td>
                    <td className="px-3 py-2.5 text-[#6B7480]">{c.roleType}</td>
                    <td className="px-3 py-2.5 text-[#6B7480] capitalize">{c.campusId.replace('campus-', '')}</td>
                    <td className="px-3 py-2.5 font-mono text-[#0F2740]">{c.vettingExpiryDate}</td>
                    <td className="px-3 py-2.5 text-center">
                      {c.mandatoryTrainingCompleted ? (
                        <span className="text-emerald-700 font-bold">Completed</span>
                      ) : (
                        <span className="text-red-700 font-bold bg-red-100 px-1.5 py-0.5 rounded">Overdue</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.vettingStatus === 'Valid' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-amber-100 text-amber-900 border border-amber-300'
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

      {/* Subtab 3: Incident Log */}
      {activeSubtab === 'incidents' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Statutory Incident Log</h3>
              <p className="text-xs text-[#6B7480]">
                All records encrypted and audit-logged on every view.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0F2740]">
              {filteredIncidents.length} Logged Incidents
            </span>
          </div>

          <div className="space-y-3">
            {filteredIncidents.map(inc => (
              <div key={inc.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#0F2740]">{inc.incidentRef}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        inc.severity === 'Major' ? 'bg-red-100 text-red-900 border border-red-300' :
                        inc.severity === 'Moderate' ? 'bg-amber-100 text-amber-900' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {inc.severity} Severity
                      </span>
                      <span className="text-xs text-[#6B7480]">{inc.type}</span>
                    </div>
                    <p className="text-xs text-[#6B7480]">Location: <b>{inc.location}</b> on {inc.date} at {inc.time}</p>
                  </div>
                  <span className="text-xs bg-white text-slate-800 border border-[#CBD5E1] px-2 py-1 rounded font-semibold self-start sm:self-auto">
                    Status: {inc.status}
                  </span>
                </div>

                <p className="text-xs text-[#3F4B5A] bg-white p-2.5 rounded border border-[#E2E8F0] leading-relaxed">
                  {inc.description}
                </p>

                <div className="text-[11px] text-[#6B7480] flex justify-between pt-1">
                  <span>Action: <b>{inc.actionTaken}</b></span>
                  <span>Logged by: {inc.loggedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Injury Surveillance */}
      {activeSubtab === 'injuries' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Injury Rate Epidemiology &amp; Exposure Hours</h3>
              <p className="text-xs text-[#6B7480]">Calculated per 1000 athletic exposure hours</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Current Rate: 14.2 / 1000 hrs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
              <span className="text-xs text-[#6B7480]">Highest Incidence Sport</span>
              <p className="text-lg font-bold text-[#0F2740]">Rugby Union</p>
              <p className="text-[11px] text-[#6B7480]">18.4 injuries / 1000 hrs (within RFU benchmark)</p>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
              <span className="text-xs text-[#6B7480]">Most Common Anatomical Site</span>
              <p className="text-lg font-bold text-[#0F2740]">Hamstring / Lower Limb</p>
              <p className="text-[11px] text-[#6B7480]">Followed by Concussion (2 cases this term)</p>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1">
              <span className="text-xs text-[#6B7480]">SCAT6 Digital Baseline Sync</span>
              <p className="text-lg font-bold text-emerald-700">100% Pre-Season Verified</p>
              <p className="text-[11px] text-[#6B7480]">All Senior contact squad athletes completed</p>
            </div>
          </div>
        </div>
      )}

      {/* Medical Clearance Modal */}
      {medicalModalOpen && selectedInjury && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 border border-[#CBD5E1]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                Clinical Medical Officer Authorization
              </span>
              <h3 className="font-bold text-base text-[#0F2740]">
                Grant Medical Clearance: {selectedInjury.studentName}
              </h3>
              <p className="text-xs text-[#6B7480] mt-1">
                Injury: {selectedInjury.injuryType} ({selectedInjury.sport}). Granting clearance unlocks Stage 3 Graduated Return to play.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0F2740]">
                Physician Consultation Notes &amp; Activity Restrictions <span className="text-red-500">*</span>
              </label>
              <textarea
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="e.g. SCAT6 baseline restored, asymptomatic at rest and light cardio; cleared for non-contact skill drills (max 30 mins)..."
                rows={3}
                className="w-full text-xs border border-[#CBD5E1] rounded-md p-2 text-[#0F2740] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMedicalModalOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-[#6B7480] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMedicalClearance}
                disabled={!medicalNotes.trim()}
                className="px-4 py-1.5 rounded-md text-xs font-bold bg-red-700 text-white hover:bg-red-800 disabled:opacity-50"
              >
                Sign Off &amp; Unlock Graduated Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Incident Modal */}
      {incidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 border border-[#CBD5E1]">
            <h3 className="font-bold text-base text-[#0F2740]">Log Formal Safeguarding Incident</h3>

            <div className="space-y-2 text-xs">
              <div>
                <label className="font-semibold text-[#0F2740]">Incident Type</label>
                <select
                  value={newIncType}
                  onChange={(e) => setNewIncType(e.target.value as Incident['type'])}
                  className="w-full mt-1 border border-[#CBD5E1] rounded p-1.5 text-[#0F2740]"
                >
                  <option value="Physical Injury">Physical Injury</option>
                  <option value="Facility Hazard">Facility Hazard</option>
                  <option value="Behavioral">Behavioral / Code of Conduct</option>
                  <option value="Safeguarding Disclosure">Safeguarding Disclosure</option>
                  <option value="Transport Delay">Transport Delay</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#0F2740]">Severity Level</label>
                <select
                  value={newIncSeverity}
                  onChange={(e) => setNewIncSeverity(e.target.value as Incident['severity'])}
                  className="w-full mt-1 border border-[#CBD5E1] rounded p-1.5 text-[#0F2740]"
                >
                  <option value="Minor">Minor</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Major">Major</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#0F2740]">Location / Pitch</label>
                <input
                  type="text"
                  placeholder="e.g. North Field Pitch 1"
                  value={newIncLocation}
                  onChange={(e) => setNewIncLocation(e.target.value)}
                  className="w-full mt-1 border border-[#CBD5E1] rounded p-1.5 text-[#0F2740]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0F2740]">People Involved (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Student Name, Coach Name, Medical Marshal"
                  value={newIncPeople}
                  onChange={(e) => setNewIncPeople(e.target.value)}
                  className="w-full mt-1 border border-[#CBD5E1] rounded p-1.5 text-[#0F2740]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0F2740]">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed factual statement..."
                  value={newIncDesc}
                  onChange={(e) => setNewIncDesc(e.target.value)}
                  className="w-full mt-1 border border-[#CBD5E1] rounded p-1.5 text-[#0F2740]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#0F2740]">Immediate Action Taken</label>
                <input
                  type="text"
                  placeholder="e.g. First aid administered, parents notified..."
                  value={newIncAction}
                  onChange={(e) => setNewIncAction(e.target.value)}
                  className="w-full mt-1 border border-[#CBD5E1] rounded p-1.5 text-[#0F2740]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIncidentModalOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-[#6B7480] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateIncident}
                disabled={!newIncLocation || !newIncDesc}
                className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#0F2740] text-white hover:bg-[#1E3A5A] disabled:opacity-50"
              >
                Submit Incident Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
