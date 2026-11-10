import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Handshake, 
  Compass, 
  UserCheck, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Plane,
  FileCheck
} from 'lucide-react';

export const PartnershipsModule: React.FC = () => {
  const { 
    activeSubtab, 
    setActiveSubtab, 
    partnerships, 
    campsAndTours, 
    approveCampSafeguarding,
    canAccessSafeguarding 
  } = useApp();

  const totalPartnershipValue = partnerships.reduce((acc, curr) => acc + curr.annualValueEstimate, 0);

  return (
    <div className="space-y-6">
      {/* Module Navigation Header */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F2740]">
              Partnerships, Camps &amp; Tours
            </h1>
            <p className="text-xs text-[#6B7480]">
              Professional club academies, commercial sponsorships, educational overseas sports tours, and safeguarding sign-offs.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#CBD5E1] px-3 py-1.5 rounded-lg text-xs self-start sm:self-auto">
            <DollarSign className="w-4 h-4 text-[#1E8A5A]" />
            <span className="text-[#6B7480]">Annual Value Delivered:</span>
            <span className="font-mono font-bold text-[#0F2740]">£{totalPartnershipValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 border-t border-[#F1F5F9] pt-3 overflow-x-auto">
          {[
            { id: 'registry', label: 'Partnership Registry & Value Tracker' },
            { id: 'camps', label: 'Camps & Tours (Safeguarding Gate)' },
            { id: 'visitors', label: 'Visiting Specialists Log' }
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

      {/* Subtab 1: Partnership Registry */}
      {activeSubtab === 'registry' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partnerships.map(p => {
              const isDue = p.status === 'Review Due';

              return (
                <div key={p.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#F26B1D] uppercase tracking-wider">
                        {p.type} · {p.scope}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isDue ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#0F2740] mt-1">{p.name}</h3>
                    <p className="text-xs text-[#6B7480]">Value Type: <b>{p.valueType}</b></p>
                  </div>

                  <div className="pt-2 border-t border-[#F1F5F9] space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#6B7480]">Annual Valuation:</span>
                      <span className="font-mono font-bold text-base text-[#0F2740]">£{p.annualValueEstimate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-[#6B7480]">
                      <span>Contact: {p.contactPerson}</span>
                      <span className="font-mono">Renewal: {p.renewalDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Camps & Tours (With mandatory risk assessment & safeguarding sign-off!) */}
      {activeSubtab === 'camps' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#3F4B5A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F26B1D] shrink-0" />
              <span>
                <b>Statutory Tour Safeguarding Policy:</b> No camp or overseas tour can open for student registrations without verified risk assessment and Head of Sports safeguarding sign-off.
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {campsAndTours.map(c => {
              const isLocked = !c.safeguardingApproved;

              return (
                <div key={c.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#F26B1D] uppercase">{c.type} · {c.sport}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {c.campuses.join(', ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#0F2740]">{c.title}</h4>
                      <p className="text-xs text-[#6B7480]">Dates: {c.dates} · Cost per pupil: £{c.costPerParticipant.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[#0F2740]">{c.signUps} / {c.capacity}</span>
                        <span className="block text-[10px] text-[#6B7480]">Sign-Ups</span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                        c.approvalStatus === 'Approved & Open' ? 'bg-emerald-100 text-emerald-800' :
                        c.approvalStatus === 'Completed' ? 'bg-slate-100 text-slate-800' :
                        'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {c.approvalStatus}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4 text-[#6B7480]">
                      <span className="flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Risk Assessment Complete
                      </span>
                      <span className="flex items-center gap-1">
                        {c.safeguardingApproved ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Safeguarding Authorized
                          </span>
                        ) : (
                          <span className="text-amber-700 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Safeguarding Authorization Pending
                          </span>
                        )}
                      </span>
                    </div>

                    {isLocked && canAccessSafeguarding && (
                      <button
                        onClick={() => approveCampSafeguarding(c.id)}
                        className="px-3 py-1.5 bg-[#0F2740] text-white hover:bg-[#1E3A5A] rounded font-bold text-xs transition-colors self-start"
                      >
                        Grant Safeguarding Sign-Off &amp; Open
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 3: Visiting Specialists Log */}
      {activeSubtab === 'visitors' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3">
            <h3 className="font-bold text-sm text-[#0F2740]">Visiting Masterclass Specialists &amp; Clinicians</h3>
            <p className="text-xs text-[#6B7480]">All external visitors escorted and DBS checked in advance</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Maggie Alphonsi MBE', role: 'World Cup Winner (Rugby)', session: 'Senior Breakdown Masterclass & Leadership Q&A', date: '2026-10-15', campus: 'North Campus' },
              { name: 'Adam Peaty Clinic Coach', role: 'Olympic Swimming Performance', session: 'Breaststroke Underwater Pullout Mechanics', date: '2026-11-02', campus: 'North Campus' },
              { name: 'Geva Mentor CBE', role: 'International Netball Defender', session: 'Defensive Circle Intercept Positioning', date: '2026-11-20 (Scheduled)', campus: 'South Campus' }
            ].map((v, idx) => (
              <div key={idx} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-[#0F2740]">{v.name} ({v.role})</h4>
                  <p className="text-[#6B7480]">{v.session}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-semibold text-[#0F2740]">{v.date}</span>
                  <span className="block text-[10px] text-[#9AA3B0]">{v.campus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
