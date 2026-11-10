import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Building, 
  Calendar as CalendarIcon, 
  Wrench, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { facilityBookings } from '../../../data/mockData';

export const FacilitiesModule: React.FC = () => {
  const { 
    activeSubtab, 
    setActiveSubtab, 
    filteredFacilities, 
    equipmentList, 
    selectedCampus 
  } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');

  const displayedFacilities = filteredFacilities.filter(f => {
    if (filterType !== 'ALL' && f.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Module Header & Subtab Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F2740]">
              Facilities &amp; Operations
            </h1>
            <p className="text-xs text-[#6B7480]">
              Multi-campus sports infrastructure, peak and off-peak utilization telemetry, equipment logs, and activity risk registers.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#0F2740] bg-[#F8FAFC] border border-[#CBD5E1] px-3 py-1.5 rounded-lg">
            {filteredFacilities.length} Core Sporting Facilities
          </span>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 border-t border-[#F1F5F9] pt-3 overflow-x-auto">
          {[
            { id: 'inventory', label: 'Facility Inventory' },
            { id: 'booking', label: 'Booking Matrix & Community Lettings' },
            { id: 'equipment', label: 'Equipment & Safety Register' },
            { id: 'risks', label: 'Activity Risk Assessments' }
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

      {/* Subtab 1: Facility Inventory */}
      {activeSubtab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#6B7480]">Showing facilities across selected campus scope</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white border border-[#CBD5E1] rounded px-2.5 py-1 text-[#0F2740]"
            >
              <option value="ALL">All Facility Types</option>
              <option value="Swimming Pool">Swimming Pools</option>
              <option value="Astroturf Pitch">Astroturf Pitches</option>
              <option value="Sports Hall">Sports Halls</option>
              <option value="Athletics Track">Athletics Tracks</option>
              <option value="Fitness Suite">Fitness Suites</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedFacilities.map(f => {
              const conditionColor = 
                f.condition === 'Excellent' ? 'bg-emerald-100 text-emerald-800' :
                f.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-900 border border-amber-300';

              return (
                <div key={f.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#F26B1D] uppercase tracking-wider">{f.type}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${conditionColor}`}>
                        {f.condition}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#0F2740] mt-1">{f.name}</h3>
                    <p className="text-xs text-[#6B7480] capitalize">Campus: {f.campusId.replace('campus-', '')}</p>
                  </div>

                  <div className="pt-2 border-t border-[#F1F5F9] space-y-2 text-xs">
                    <div className="flex justify-between text-[#6B7480]">
                      <span>Spectator / Athlete Capacity:</span>
                      <span className="font-mono font-bold text-[#0F2740]">{f.capacity}</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#6B7480]">Peak Utilization</span>
                        <span className="font-mono font-bold text-[#0F2740]">{f.peakUtilization}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${f.peakUtilization > 90 ? 'bg-[#F26B1D]' : 'bg-[#0F2740]'}`}
                          style={{ width: `${f.peakUtilization}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-[11px] text-[#6B7480]">
                      <span>Off-Peak Utilization:</span>
                      <span className="font-mono font-semibold text-[#0F2740]">{f.offPeakUtilization}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Booking Matrix */}
      {activeSubtab === 'booking' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Weekly Facility Allocation &amp; Community Lettings</h3>
              <p className="text-xs text-[#6B7480]">Consolidated scheduling across Games, PE, and commercial community hires</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              Community Letting Revenue: £42,000 / term
            </span>
          </div>

          <div className="space-y-3">
            {facilityBookings.map(b => (
              <div key={b.id} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-[#0F2740]">{b.facilityName}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      b.bookingType === 'External Letting' ? 'bg-purple-100 text-purple-800' :
                      b.bookingType === 'School Team' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {b.bookingType}
                    </span>
                  </div>
                  <p className="text-[#6B7480]">{b.organizer}</p>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-[#0F2740] block">{b.dayOfWeek}</span>
                  <span className="text-[11px] text-[#6B7480] font-mono">{b.timeSlot}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Equipment & Safety Register */}
      {activeSubtab === 'equipment' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="border-b border-[#F1F5F9] pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-[#0F2740]">Equipment Maintenance &amp; Safety Inspection Log</h3>
              <p className="text-xs text-[#6B7480]">AED defibrillators, Olympic lifting bars, high jump crash mats, tackle shields</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0F2740]">
              {equipmentList.length} Monitored Items
            </span>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {equipmentList.map(eq => (
              <div key={eq.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-[#0F2740]">{eq.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                      Qty: {eq.quantity}
                    </span>
                  </div>
                  <p className="text-[#6B7480]">{eq.facilityName} · Category: {eq.category}</p>
                </div>

                <div className="text-right space-y-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    eq.condition === 'Optimal' ? 'bg-emerald-100 text-emerald-800' :
                    eq.condition === 'Satisfactory' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-900 border border-red-200'
                  }`}>
                    {eq.condition}
                  </span>
                  <p className="text-[10px] text-[#9AA3B0] font-mono">
                    Last Inspected: {eq.lastInspected} · Due: {eq.replacementDue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Risk Assessments */}
      {activeSubtab === 'risks' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { activity: 'Rowing on the Thames Tideway', rating: 'High Controlled', reviewDate: '2026-12-01', lead: 'Eleanor Campbell', mitigations: 'Coaching launch with safety kit, throw lines, VHF radio, lifejackets mandatory' },
            { activity: 'Contact Rugby Fixtures & Training', rating: 'Moderate Controlled', reviewDate: '2027-01-15', lead: 'Gareth Thorne', mitigations: 'World Rugby Activate warm-up, pitchside paramedic with spinal board and AED Unit A' },
            { activity: 'Swimming & Lifesaving In Deep Water', rating: 'Low Controlled', reviewDate: '2027-02-10', lead: 'Helena Berg', mitigations: 'NRASTC certified lifeguard stationed on pool deck at all times' },
          ].map((ra, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-[#F26B1D] uppercase">Activity Risk Protocol</span>
              <h4 className="font-bold text-sm text-[#0F2740]">{ra.activity}</h4>
              <p className="text-xs text-[#6B7480]">Risk Level: <b>{ra.rating}</b></p>
              <p className="text-xs text-[#3F4B5A] bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
                {ra.mitigations}
              </p>
              <div className="pt-1 flex justify-between text-[11px] text-[#6B7480]">
                <span>Lead: {ra.lead}</span>
                <span className="font-mono">Review: {ra.reviewDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
