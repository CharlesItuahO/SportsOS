import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  CampusId, 
  TermId, 
  RoleType, 
  Student, 
  AthleteProfile, 
  Team, 
  Coach, 
  Fixture, 
  Facility, 
  Incident, 
  InjuryRecord, 
  ReturnToPlayStatus, 
  ScorecardKPI, 
  CampTour, 
  AuditLogItem, 
  Partnership, 
  StoryItem, 
  ObservationLog,
  OperatingPlanItem,
  StrategicPillar,
  BudgetLine
} from '../types';
import { 
  campuses, 
  terms, 
  students as initialStudents, 
  athleteProfiles as initialAthletes, 
  teams as initialTeams, 
  coaches as initialCoaches, 
  fixtures as initialFixtures, 
  facilities as initialFacilities, 
  equipmentList as initialEquipment, 
  incidents as initialIncidents, 
  injuries as initialInjuries, 
  scorecardKPIs as initialScorecardKPIs, 
  partnerships as initialPartnerships, 
  campsAndTours as initialCamps, 
  storyBank as initialStories, 
  auditLogs as initialAuditLogs, 
  observations as initialObservations,
  operatingPlan as initialOperatingPlan,
  strategicPillars as initialStrategicPillars,
  budgetLines as initialBudgetLines
} from '../data/mockData';

export type ActiveModule = 
  | 'command-center'
  | 'strategy'
  | 'participation'
  | 'performance'
  | 'coaching'
  | 'competitions'
  | 'partnerships'
  | 'facilities'
  | 'safeguarding'
  | 'insights'
  | 'settings';

interface AppContextType {
  // Navigation & Scoping
  selectedCampus: CampusId;
  setSelectedCampus: (campus: CampusId) => void;
  selectedTerm: TermId;
  setSelectedTerm: (term: TermId) => void;
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  density: 'compact' | 'comfortable';
  setDensity: (d: 'compact' | 'comfortable') => void;
  activeModule: ActiveModule;
  setActiveModule: (m: ActiveModule) => void;
  activeSubtab: string;
  setActiveSubtab: (s: string) => void;
  navigateTo: (module: ActiveModule, subtab?: string) => void;

  // Search & Modals
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;

  // Domain Data States
  campuses: typeof campuses;
  terms: typeof terms;
  students: Student[];
  athletes: AthleteProfile[];
  teams: Team[];
  coaches: Coach[];
  fixtures: Fixture[];
  facilities: Facility[];
  equipmentList: typeof initialEquipment;
  incidents: Incident[];
  injuries: InjuryRecord[];
  scorecardKPIs: ScorecardKPI[];
  partnerships: Partnership[];
  campsAndTours: CampTour[];
  storyBank: StoryItem[];
  auditLogs: AuditLogItem[];
  observations: ObservationLog[];
  operatingPlan: OperatingPlanItem[];
  strategicPillars: StrategicPillar[];
  budgetLines: BudgetLine[];

  // Mutative Actions & Workflows
  signOffMedicalClearance: (injuryId: string, notes: string) => boolean;
  advanceReturnToPlayStage: (injuryId: string) => boolean;
  overrideFixtureClash: (fixtureId: string, reason: string) => void;
  moveAthletePathway: (athleteId: string, newStage: AthleteProfile['stage'], reason: string) => void;
  updateScorecardKPI: (id: string, updates: Partial<ScorecardKPI>) => void;
  approveCampSafeguarding: (campId: string) => void;
  publishScorecardVersion: (versionName: string) => void;
  addIncident: (newIncident: Omit<Incident, 'id' | 'incidentRef'>) => void;
  addAuditEntry: (action: AuditLogItem['action'], module: string, targetRef: string, details: string) => void;

  // Filtered views by Campus
  filteredStudents: Student[];
  filteredTeams: Team[];
  filteredCoaches: Coach[];
  filteredFixtures: Fixture[];
  filteredFacilities: Facility[];
  filteredInjuries: InjuryRecord[];
  filteredIncidents: Incident[];
  filteredBudget: BudgetLine[];

  // Role Scoping & Permissions helpers
  canAccessSafeguarding: boolean;
  canEditStrategy: boolean;
  canSignMedical: boolean;
  isReadOnlyLeadership: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCampus, setSelectedCampus] = useState<CampusId>('ALL');
  const [selectedTerm, setSelectedTerm] = useState<TermId>('2026-T1');
  const [currentRole, setCurrentRole] = useState<RoleType>('HEAD_OF_SPORTS');
  const [density, setDensity] = useState<'compact' | 'comfortable'>('compact');
  const [activeModule, setActiveModule] = useState<ActiveModule>('command-center');
  const [activeSubtab, setActiveSubtab] = useState<string>('overview');

  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mutable Collections
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [athletes, setAthletes] = useState<AthleteProfile[]>(initialAthletes);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [coaches, setCoaches] = useState<Coach[]>(initialCoaches);
  const [fixtures, setFixtures] = useState<Fixture[]>(initialFixtures);
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [equipmentList, setEquipmentList] = useState(initialEquipment);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [injuries, setInjuries] = useState<InjuryRecord[]>(initialInjuries);
  const [scorecardKPIs, setScorecardKPIs] = useState<ScorecardKPI[]>(initialScorecardKPIs);
  const [partnerships, setPartnerships] = useState<Partnership[]>(initialPartnerships);
  const [campsAndTours, setCampsAndTours] = useState<CampTour[]>(initialCamps);
  const [storyBank, setStoryBank] = useState<StoryItem[]>(initialStories);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [observations, setObservations] = useState<ObservationLog[]>(initialObservations);
  const [operatingPlan, setOperatingPlan] = useState<OperatingPlanItem[]>(initialOperatingPlan);
  const [strategicPillars, setStrategicPillars] = useState<StrategicPillar[]>(initialStrategicPillars);
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>(initialBudgetLines);

  const navigateTo = (module: ActiveModule, subtab?: string) => {
    setActiveModule(module);
    if (subtab) {
      setActiveSubtab(subtab);
    } else {
      // Default subtabs per module
      switch (module) {
        case 'command-center': setActiveSubtab('overview'); break;
        case 'strategy': setActiveSubtab('canvas'); break;
        case 'participation': setActiveSubtab('overview'); break;
        case 'performance': setActiveSubtab('teams'); break;
        case 'coaching': setActiveSubtab('roster'); break;
        case 'competitions': setActiveSubtab('fixtures'); break;
        case 'partnerships': setActiveSubtab('registry'); break;
        case 'facilities': setActiveSubtab('inventory'); break;
        case 'safeguarding': setActiveSubtab('returns'); break;
        case 'insights': setActiveSubtab('command-center'); break;
        case 'settings': setActiveSubtab('roles'); break;
        default: setActiveSubtab('overview');
      }
    }
  };

  const addAuditEntry = (
    action: AuditLogItem['action'], 
    module: string, 
    targetRef: string, 
    details: string
  ) => {
    const newEntry: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: currentRole === 'HEAD_OF_SPORTS' ? 'Alastair Vance (Head of Sports)' : currentRole,
      userRole: currentRole,
      action,
      module,
      targetRef,
      details,
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // Workflow: Return to Play state machine
  const signOffMedicalClearance = (injuryId: string, notes: string) => {
    const record = injuries.find(i => i.id === injuryId);
    if (!record) return false;

    setInjuries(prev => prev.map(inj => {
      if (inj.id === injuryId) {
        return {
          ...inj,
          returnToPlayStatus: 'GRADUATED_RETURN',
          graduatedStage: 3,
          medicalSignOffDate: new Date().toISOString().substring(0, 10),
          medicalSignOffBy: currentRole === 'MEDICAL' ? 'Dr. Fiona Henderson (Medical Officer)' : 'Clinical Lead (Approved)',
          medicalOfficerNotes: notes || inj.medicalOfficerNotes,
        };
      }
      return inj;
    }));

    addAuditEntry(
      'MEDICAL_CLEARANCE',
      'Return-to-Play State Machine',
      `${record.studentName} (${record.injuryType})`,
      `Granted clinical clearance to enter Graduated Return (Stage 3). Notes: ${notes || 'Cleared for controlled training'}`
    );
    return true;
  };

  const advanceReturnToPlayStage = (injuryId: string) => {
    const record = injuries.find(i => i.id === injuryId);
    if (!record) return false;

    setInjuries(prev => prev.map(inj => {
      if (inj.id === injuryId) {
        const nextStage = inj.graduatedStage + 1;
        if (nextStage >= 5) {
          return {
            ...inj,
            graduatedStage: 5,
            returnToPlayStatus: 'CLEARED_FULL_PLAY',
            headOfSportsSignOffDate: new Date().toISOString().substring(0, 10),
            headOfSportsSignOffBy: 'Alastair Vance (Head of Sports)',
          };
        }
        return {
          ...inj,
          graduatedStage: nextStage,
          coachSignOffDate: new Date().toISOString().substring(0, 10),
          coachSignOffBy: 'Lead Coach Confirmed',
        };
      }
      return inj;
    }));

    addAuditEntry(
      'UPDATE',
      'Return-to-Play State Machine',
      `${record.studentName}`,
      `Advanced to Graduated Stage ${record.graduatedStage + 1}`
    );
    return true;
  };

  const overrideFixtureClash = (fixtureId: string, reason: string) => {
    setFixtures(prev => prev.map(f => {
      if (f.id === fixtureId) {
        return {
          ...f,
          clashOverridden: true,
          clashOverrideReason: reason,
        };
      }
      return f;
    }));

    addAuditEntry('OVERRIDE_CLASH', 'Competitions & Fixtures', `Fixture ${fixtureId}`, `Clash overridden with rationale: ${reason}`);
  };

  const moveAthletePathway = (athleteId: string, newStage: AthleteProfile['stage'], reason: string) => {
    const ath = athletes.find(a => a.id === athleteId);
    if (!ath) return;

    setAthletes(prev => prev.map(a => {
      if (a.id === athleteId) {
        return {
          ...a,
          stage: newStage,
          history: [
            {
              fromStage: a.stage,
              toStage: newStage,
              date: new Date().toISOString().substring(0, 10),
              reason,
              decidedBy: currentRole === 'HEAD_OF_SPORTS' ? 'Alastair Vance (Head of Sports)' : currentRole,
            },
            ...a.history,
          ]
        };
      }
      return a;
    }));

    addAuditEntry('UPDATE', 'Talent Pathways', `${ath.studentName} (${ath.sport})`, `Moved from ${ath.stage} to ${newStage}. Mandatory reason: ${reason}`);
  };

  const updateScorecardKPI = (id: string, updates: Partial<ScorecardKPI>) => {
    setScorecardKPIs(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
  };

  const approveCampSafeguarding = (campId: string) => {
    const camp = campsAndTours.find(c => c.id === campId);
    if (!camp) return;

    setCampsAndTours(prev => prev.map(c => {
      if (c.id === campId) {
        return {
          ...c,
          safeguardingApproved: true,
          approvalStatus: 'Approved & Open',
        };
      }
      return c;
    }));

    addAuditEntry('UPDATE', 'Partnerships & Camps', camp.title, 'Completed safeguarding sign-off and opened registration');
  };

  const publishScorecardVersion = (versionName: string) => {
    addAuditEntry('PUBLISH_SCORECARD', 'Strategy & Leadership Scorecard', versionName, 'Published official performance snapshot to School Leadership and Board of Governors');
  };

  const addIncident = (newIncident: Omit<Incident, 'id' | 'incidentRef'>) => {
    const ref = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const fullItem: Incident = {
      ...newIncident,
      id: `inc-${Date.now()}`,
      incidentRef: ref,
    };
    setIncidents(prev => [fullItem, ...prev]);
    addAuditEntry('CREATE', 'Safeguarding Incidents', ref, `Logged ${fullItem.severity} ${fullItem.type} at ${fullItem.location}`);
  };

  // Scoped filters based on selectedCampus
  const filteredStudents = useMemo(() => {
    if (selectedCampus === 'ALL') return students;
    return students.filter(s => s.campusId === selectedCampus);
  }, [students, selectedCampus]);

  const filteredTeams = useMemo(() => {
    if (selectedCampus === 'ALL') return teams;
    return teams.filter(t => t.campusId === selectedCampus);
  }, [teams, selectedCampus]);

  const filteredCoaches = useMemo(() => {
    if (selectedCampus === 'ALL') return coaches;
    return coaches.filter(c => c.campusId === selectedCampus);
  }, [coaches, selectedCampus]);

  const filteredFixtures = useMemo(() => {
    if (selectedCampus === 'ALL') return fixtures;
    return fixtures.filter(f => f.campusId === selectedCampus);
  }, [fixtures, selectedCampus]);

  const filteredFacilities = useMemo(() => {
    if (selectedCampus === 'ALL') return facilities;
    return facilities.filter(fac => fac.campusId === selectedCampus);
  }, [facilities, selectedCampus]);

  const filteredInjuries = useMemo(() => {
    if (selectedCampus === 'ALL') return injuries;
    return injuries.filter(i => i.campusId === selectedCampus);
  }, [injuries, selectedCampus]);

  const filteredIncidents = useMemo(() => {
    if (selectedCampus === 'ALL') return incidents;
    return incidents.filter(i => i.campusId === selectedCampus);
  }, [incidents, selectedCampus]);

  const filteredBudget = useMemo(() => {
    if (selectedCampus === 'ALL') return budgetLines;
    return budgetLines.filter(b => b.campusId === selectedCampus);
  }, [budgetLines, selectedCampus]);

  // Role Permissions
  const canAccessSafeguarding = ['HEAD_OF_SPORTS', 'CAMPUS_SPORTS_LEAD', 'MEDICAL', 'PASTORAL', 'ADMIN'].includes(currentRole);
  const canEditStrategy = ['HEAD_OF_SPORTS', 'ADMIN'].includes(currentRole);
  const canSignMedical = ['MEDICAL', 'HEAD_OF_SPORTS'].includes(currentRole);
  const isReadOnlyLeadership = currentRole === 'LEADERSHIP';

  return (
    <AppContext.Provider
      value={{
        selectedCampus,
        setSelectedCampus,
        selectedTerm,
        setSelectedTerm,
        currentRole,
        setCurrentRole,
        density,
        setDensity,
        activeModule,
        setActiveModule,
        activeSubtab,
        setActiveSubtab,
        navigateTo,

        searchOpen,
        setSearchOpen,
        notificationsOpen,
        setNotificationsOpen,

        campuses,
        terms,
        students,
        athletes,
        teams,
        coaches,
        fixtures,
        facilities,
        equipmentList,
        incidents,
        injuries,
        scorecardKPIs,
        partnerships,
        campsAndTours,
        storyBank,
        auditLogs,
        observations,
        operatingPlan,
        strategicPillars,
        budgetLines,

        signOffMedicalClearance,
        advanceReturnToPlayStage,
        overrideFixtureClash,
        moveAthletePathway,
        updateScorecardKPI,
        approveCampSafeguarding,
        publishScorecardVersion,
        addIncident,
        addAuditEntry,

        filteredStudents,
        filteredTeams,
        filteredCoaches,
        filteredFixtures,
        filteredFacilities,
        filteredInjuries,
        filteredIncidents,
        filteredBudget,

        canAccessSafeguarding,
        canEditStrategy,
        canSignMedical,
        isReadOnlyLeadership,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
