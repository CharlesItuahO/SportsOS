export type CampusId = string;

export interface Campus {
  id: string;
  name: string;
  code: string;
  address: string;
  studentCount: number;
  leadName: string;
}

export type RoleType = 
  | 'HEAD_OF_SPORTS'
  | 'CAMPUS_SPORTS_LEAD'
  | 'COACH'
  | 'PE_TEACHER'
  | 'MEDICAL'
  | 'PASTORAL'
  | 'OPERATIONS'
  | 'LEADERSHIP'
  | 'STUDENT'
  | 'PARENT'
  | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  campusId: CampusId;
  avatar?: string;
  title: string;
}

export type TermId = '2026-T1' | '2026-T2' | '2026-T3';

export interface TermInfo {
  id: TermId;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export type SportType = 
  | 'Rugby'
  | 'Netball'
  | 'Football'
  | 'Cricket'
  | 'Hockey'
  | 'Swimming'
  | 'Athletics'
  | 'Rowing'
  | 'Tennis'
  | 'Basketball'
  | 'Badminton'
  | 'Cross Country';

export type AgeGroup = 'U12' | 'U13' | 'U14' | 'U15' | 'U16' | 'U18' | 'Senior';

export type AbilityTier = 'Recreational' | 'Development' | 'Performance' | 'Elite';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'Female' | 'Male' | 'Non-Binary';
  yearGroup: number; // 7 to 13
  campusId: string;
  abilityTier: AbilityTier;
  sports: SportType[];
  weeklySessions: number;
  attendanceRate: number; // percentage 0-100
  isMeaningful: boolean; // >= 2 sessions or in school team
  hasSEND: boolean;
  medicalNotes?: string;
}

export type PathwayStage = 'Foundation' | 'Development' | 'Performance' | 'Elite';

export interface AthleteProfile {
  id: string;
  studentId: string;
  studentName: string;
  yearGroup: number;
  gender: 'Female' | 'Male';
  campusId: string;
  sport: SportType;
  stage: PathwayStage;
  primaryTeam: string;
  benchmarks: {
    testName: string;
    score: string;
    percentile: number;
    date: string;
  }[];
  history: {
    fromStage: PathwayStage;
    toStage: PathwayStage;
    date: string;
    reason: string;
    decidedBy: string;
  }[];
  externalAffiliations: string[];
}

export interface Team {
  id: string;
  name: string;
  sport: SportType;
  ageGroup: AgeGroup;
  campusId: string;
  gender: 'Boys' | 'Girls' | 'Mixed';
  coachId: string;
  coachName: string;
  athleteCount: number;
  tier: 'A' | 'B' | 'C' | '1st XI' | '2nd XI' | 'Dev';
  nextFixture?: string;
}

export interface Coach {
  id: string;
  name: string;
  roleType: 'Internal Staff' | 'External Specialist' | 'Graduate Assistant';
  sports: SportType[];
  campusId: string;
  qualifications: string[];
  vettingStatus: 'Valid' | 'Expiring Soon' | 'Expired';
  vettingExpiryDate: string; // YYYY-MM-DD
  mandatoryTrainingCompleted: boolean;
  weeklyHours: number;
  maxWeeklyHours: number;
  observationScore: number; // 1.0 to 4.0
  pdHoursThisTerm: number;
  assignedTeams: string[];
  email: string;
  phone: string;
}

export interface ObservationLog {
  id: string;
  coachId: string;
  coachName: string;
  observerName: string;
  date: string;
  focusArea: string;
  overallScore: number; // 1-4
  strengths: string;
  actionItems: string;
  status: 'Completed' | 'Pending Review';
}

export interface Fixture {
  id: string;
  sport: SportType;
  teamName: string;
  opponent: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: 'Inter-School' | 'League' | 'Tournament' | 'Inter-House' | 'Showcase';
  venue: string;
  campusId: string;
  isHome: boolean;
  transportDetails: string;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
  result?: {
    schoolScore: number;
    opponentScore: number;
    outcome: 'Won' | 'Lost' | 'Drawn';
    standoutAthletes: string[];
    matchReport?: string;
  };
  hasClash?: boolean;
  clashReason?: string;
  clashOverridden?: boolean;
  clashOverrideReason?: string;
}

export interface Facility {
  id: string;
  name: string;
  campusId: string;
  type: 'Swimming Pool' | 'Astroturf Pitch' | 'Sports Hall' | 'Athletics Track' | 'Fitness Suite' | 'Tennis Courts' | 'Grass Pitch';
  capacity: number;
  condition: 'Excellent' | 'Good' | 'Requires Attention';
  isAccessible: boolean;
  peakUtilization: number; // percentage
  offPeakUtilization: number; // percentage
}

export interface FacilityBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  campusId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string; // e.g. "16:00 - 17:30"
  bookingType: 'School Team' | 'PE Curriculum' | 'External Letting' | 'Maintenance';
  organizer: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: 'Safety & First Aid' | 'Field Equipment' | 'Balls & Nets' | 'Gym Tech';
  facilityId: string;
  facilityName: string;
  quantity: number;
  condition: 'Optimal' | 'Satisfactory' | 'Needs Replacement';
  lastInspected: string;
  replacementDue: string;
}

export interface Incident {
  id: string;
  incidentRef: string;
  date: string;
  time: string;
  type: 'Physical Injury' | 'Behavioral' | 'Facility Hazard' | 'Safeguarding Disclosure' | 'Transport Delay';
  severity: 'Minor' | 'Moderate' | 'Major' | 'Critical';
  campusId: string;
  location: string;
  peopleInvolved: string[];
  description: string;
  actionTaken: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  followUpRequired: boolean;
  loggedBy: string;
}

export type ReturnToPlayStatus = 
  | 'INJURY_LOGGED' 
  | 'MEDICAL_CLEARANCE_REQUIRED' 
  | 'GRADUATED_RETURN' 
  | 'CLEARED_FULL_PLAY';

export interface InjuryRecord {
  id: string;
  studentId: string;
  studentName: string;
  yearGroup: number;
  campusId: string;
  sport: SportType;
  dateOfInjury: string;
  injuryType: string;
  severity: 'Grade 1 (Mild)' | 'Grade 2 (Moderate)' | 'Grade 3 (Severe)' | 'Concussion Protocol';
  exposureHours: number;
  returnToPlayStatus: ReturnToPlayStatus;
  medicalOfficerNotes?: string;
  graduatedStage: number; // 1-5 for concussion/musculoskeletal
  medicalSignOffDate?: string;
  medicalSignOffBy?: string;
  coachSignOffDate?: string;
  coachSignOffBy?: string;
  headOfSportsSignOffDate?: string;
  headOfSportsSignOffBy?: string;
}

export interface StrategicPillar {
  id: string;
  number: number;
  title: string;
  vision: string;
  owner: string;
  ragStatus: 'Green' | 'Amber' | 'Red';
  progressPercent: number;
  goals: {
    id: string;
    title: string;
    targetDate: string;
    status: 'On Track' | 'Delayed' | 'Completed';
    metric: string;
  }[];
}

export interface OperatingPlanItem {
  id: string;
  pillarId: string;
  pillarTitle: string;
  title: string;
  owner: string;
  campusScope: 'All Campuses' | 'North Campus' | 'South Campus' | 'East Campus';
  startDate: string;
  dueDate: string;
  progress: number; // 0-100
  status: 'Not Started' | 'In Progress' | 'Under Review' | 'Completed';
  dependencies: string[];
}

export interface BudgetLine {
  id: string;
  category: 'Coaching Staff' | 'Equipment & Kit' | 'Transport & Travel' | 'Entry Fees & Affiliations' | 'Facility Leases & Maintenance';
  campusId: string;
  sport: SportType | 'General Department';
  planned: number;
  actual: number;
  notes: string;
}

export interface ScorecardKPI {
  id: string;
  pillarTitle: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: number[]; // 12-week values
  rag: 'Green' | 'Amber' | 'Red';
  riskNotes: string;
}

export interface ScorecardVersion {
  id: string;
  versionNumber: string;
  publishedAt: string;
  publishedBy: string;
  term: TermId;
  academicYear: string;
  kpis: ScorecardKPI[];
  risksAndOpportunities: {
    risks: string[];
    opportunities: string[];
  };
}

export interface Partnership {
  id: string;
  name: string;
  type: 'Professional Club' | 'National Governing Body' | 'University Scout' | 'Commercial Sponsor' | 'Charity / Community';
  scope: 'All Campuses' | 'North Campus' | 'South Campus' | 'East Campus';
  annualValueEstimate: number; // in GBP
  valueType: 'Cash Sponsor' | 'Coaching In-Kind' | 'Scholarship Pathway' | 'Facility Access';
  contactPerson: string;
  contactEmail: string;
  renewalDate: string;
  status: 'Active' | 'Review Due' | 'In Negotiation';
}

export interface CampTour {
  id: string;
  title: string;
  type: 'Holiday Camp' | 'Masterclass Clinic' | 'Overseas Tour' | 'Pre-Season Residential';
  sport: SportType;
  campuses: string[];
  dates: string;
  costPerParticipant: number;
  capacity: number;
  signUps: number;
  riskAssessmentSigned: boolean;
  safeguardingApproved: boolean;
  approvalStatus: 'Draft' | 'Pending Safeguarding Sign-Off' | 'Approved & Open' | 'Completed';
}

export interface StoryItem {
  id: string;
  title: string;
  studentName: string;
  sport: SportType;
  campusId: string;
  date: string;
  summary: string;
  hasParentalConsent: boolean;
  status: 'Draft' | 'Approved for Admissions & Press' | 'Archived';
  quote: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: RoleType;
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH_SCORECARD' | 'OVERRIDE_CLASH' | 'MEDICAL_CLEARANCE' | 'CREATE_CAMPUS';
  module: string;
  targetRef: string;
  details: string;
}
