import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Calendar, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const { 
    notificationsOpen, 
    setNotificationsOpen, 
    coaches, 
    injuries, 
    fixtures, 
    campsAndTours,
    navigateTo 
  } = useApp();

  if (!notificationsOpen) return null;

  const expiringCoaches = coaches.filter(c => c.vettingStatus === 'Expiring Soon');
  const pendingMedicalInjuries = injuries.filter(i => i.returnToPlayStatus === 'MEDICAL_CLEARANCE_REQUIRED');
  const clashingFixtures = fixtures.filter(f => f.hasClash && !f.clashOverridden);
  const pendingCamps = campsAndTours.filter(c => !c.safeguardingApproved);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#CBD5E1]">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#0F2740]">Operational Action Center</span>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                {expiringCoaches.length + pendingMedicalInjuries.length + clashingFixtures.length + pendingCamps.length} Urgent
              </span>
            </div>
            <p className="text-xs text-[#6B7480]">Items requiring Head of Sports or Staff sign-off</p>
          </div>
          <button
            onClick={() => setNotificationsOpen(false)}
            className="p-1 rounded-md text-[#6B7480] hover:text-[#0F2740] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Safeguarding & Medical RTP Clearances */}
          {pendingMedicalInjuries.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D14343] uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Return-to-Play Medical Clearance Required</span>
              </div>
              {pendingMedicalInjuries.map(inj => (
                <div key={inj.id} className="p-3 bg-red-50/70 border border-red-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[#0F2740]">{inj.studentName} (Y{inj.yearGroup})</span>
                    <span className="text-[10px] bg-red-200 text-red-900 font-medium px-1.5 py-0.5 rounded">
                      {inj.sport}
                    </span>
                  </div>
                  <p className="text-[#3F4B5A]">{inj.injuryType} — {inj.severity}</p>
                  <p className="text-[11px] text-[#6B7480]">{inj.medicalOfficerNotes}</p>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigateTo('safeguarding', 'returns');
                      }}
                      className="text-xs font-semibold text-[#D14343] hover:underline flex items-center gap-1"
                    >
                      Review & Sign Off <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vetting Expiry Alerts (<30 days) */}
          {expiringCoaches.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E0A500] uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Coach Vetting Expiring (&lt;30 Days)</span>
              </div>
              {expiringCoaches.map(c => (
                <div key={c.id} className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[#0F2740]">{c.name}</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-semibold px-1.5 py-0.5 rounded">
                      Expires: {c.vettingExpiryDate}
                    </span>
                  </div>
                  <p className="text-[#3F4B5A]">Role: {c.roleType} · Sports: {c.sports.join(', ')}</p>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigateTo('coaching', 'roster');
                      }}
                      className="text-xs font-semibold text-[#B45309] hover:underline flex items-center gap-1"
                    >
                      View in Coach Roster <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fixture Clashes */}
          {clashingFixtures.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F26B1D] uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Facility / Fixture Clash Detected</span>
              </div>
              {clashingFixtures.map(f => (
                <div key={f.id} className="p-3 bg-orange-50/70 border border-orange-200 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[#0F2740]">{f.teamName} vs {f.opponent}</span>
                    <span className="text-[10px] font-mono text-orange-800">{f.date} {f.time}</span>
                  </div>
                  <p className="text-orange-950 font-medium">{f.clashReason}</p>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigateTo('competitions', 'fixtures');
                      }}
                      className="text-xs font-semibold text-[#F26B1D] hover:underline flex items-center gap-1"
                    >
                      Resolve Clash <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Camp Sign-Offs */}
          {pendingCamps.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3F4B5A] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-[#F26B1D]" />
                <span>Camp Pending Safeguarding Sign-Off</span>
              </div>
              {pendingCamps.map(camp => (
                <div key={camp.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <div className="font-bold text-[#0F2740]">{camp.title}</div>
                  <p className="text-[#6B7480]">Dates: {camp.dates} · Cost: £{camp.costPerParticipant}</p>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigateTo('partnerships', 'camps');
                      }}
                      className="text-xs font-semibold text-[#0F2740] hover:underline flex items-center gap-1"
                    >
                      Review Tour Dossier <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {expiringCoaches.length === 0 && pendingMedicalInjuries.length === 0 && clashingFixtures.length === 0 && pendingCamps.length === 0 && (
            <div className="py-12 text-center text-[#6B7480] space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-medium text-sm text-[#0F2740]">All Operational Queues Clear</p>
              <p className="text-xs">No pending vetting lapses, RTP medical blocks, or fixture clashes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
