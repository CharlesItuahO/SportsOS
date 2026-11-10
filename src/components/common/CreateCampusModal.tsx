import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, X, Plus, ShieldCheck, MapPin, User, Users, Hash } from 'lucide-react';

export const CreateCampusModal: React.FC = () => {
  const { 
    createCampusModalOpen, 
    setCreateCampusModalOpen, 
    addCampus, 
    setSelectedCampus,
    navigateTo 
  } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [leadName, setLeadName] = useState('');
  const [studentCount, setStudentCount] = useState<number | string>(550);
  const [facilitiesNote, setFacilitiesNote] = useState('');

  if (!createCampusModalOpen) return null;

  // Auto-generate a clean code when name changes if user hasn't typed custom code
  const handleNameChange = (val: string) => {
    setName(val);
    if (!code || code === autoCode(name)) {
      setCode(autoCode(val));
    }
  };

  const autoCode = (str: string) => {
    const parts = str.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}-${parts[parts.length - 1].slice(0, 3)}`.toUpperCase();
    } else if (parts.length === 1 && parts[0].length >= 3) {
      return `${parts[0].slice(0, 2)}-${parts[0].slice(2, 5)}`.toUpperCase();
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !leadName.trim()) return;

    const finalCode = code.trim() || autoCode(name) || 'CMP-NEW';
    const newCampus = addCampus({
      name: name.trim(),
      code: finalCode,
      address: address.trim(),
      leadName: leadName.trim(),
      studentCount: Number(studentCount) || 500,
    });

    // Optionally set as active campus and navigate to Settings campuses
    setSelectedCampus(newCampus.id);
    navigateTo('settings', 'campuses');

    // Reset form & close
    setName('');
    setCode('');
    setAddress('');
    setLeadName('');
    setStudentCount(550);
    setFacilitiesNote('');
    setCreateCampusModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#CBD5E1] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F2740] flex items-center justify-center text-[#F26B1D]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#F26B1D] uppercase tracking-wider block">
                Multi-Campus Architecture
              </span>
              <h3 className="font-bold text-base text-[#0F2740] leading-tight">
                Provision New School Campus
              </h3>
            </div>
          </div>
          <button
            onClick={() => setCreateCampusModalOpen(false)}
            className="p-1 rounded text-[#9AA3B0] hover:text-[#0F2740] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 leading-relaxed">
            <p>
              Provisioning a new campus integrates it into global scoping, the master fixture calendar, facility conflict detectors, and board scorecards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-[#0F2740] flex items-center gap-1">
                Campus Official Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. West Campus (Battersea Reach)"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full pl-2.5 pr-2 py-2 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F2740] placeholder-[#9AA3B0] focus:outline-none focus:border-[#0F2740]"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0F2740] flex items-center gap-1">
                <Hash className="w-3 h-3 text-[#6B7480]" />
                Campus Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. WC-BTR"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-2.5 py-2 text-xs font-mono font-bold bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F2740] uppercase focus:outline-none focus:border-[#0F2740]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#0F2740] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#6B7480]" />
              Physical Address &amp; Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. York Road, Battersea, London SW11 3RA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F2740] placeholder-[#9AA3B0] focus:outline-none focus:border-[#0F2740]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-[#0F2740] flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#6B7480]" />
                Campus Sports Lead <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Victoria Sterling"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F2740] placeholder-[#9AA3B0] focus:outline-none focus:border-[#0F2740]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#0F2740] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#6B7480]" />
                Student Body Size (Pupils)
              </label>
              <input
                type="number"
                min="50"
                max="5000"
                value={studentCount}
                onChange={(e) => setStudentCount(e.target.value)}
                className="w-full px-2.5 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded-md text-[#0F2740] focus:outline-none focus:border-[#0F2740]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#0F2740]">
              Initial Facilities &amp; Sporting Focus Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 4-Court Sports Hall, 25m Swimming Pool, 3G Pitch. Focus on Rowing and Netball."
              value={facilitiesNote}
              onChange={(e) => setFacilitiesNote(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F2740] placeholder-[#9AA3B0] focus:outline-none focus:border-[#0F2740]"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-[#F1F5F9] flex justify-end items-center gap-2">
            <button
              type="button"
              onClick={() => setCreateCampusModalOpen(false)}
              className="px-3 py-2 rounded-md text-xs font-medium text-[#6B7480] hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !address.trim() || !leadName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0F2740] hover:bg-[#1E3A5A] text-white text-xs font-bold rounded-md shadow-xs transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5 text-[#F26B1D]" />
              <span>Provision &amp; Activate Campus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
