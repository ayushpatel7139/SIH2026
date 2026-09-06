import { create } from 'zustand';
import { UserProfile, BusinessProfile, CapitalProfile } from '@/types/assessment';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  village: string | null;
  district: string | null;
  state: string | null;
}

interface AssessmentStore extends LocationState, UserProfile, BusinessProfile, CapitalProfile {
  setLocation: (data: Partial<LocationState>) => void;
  setProfile: (data: Partial<UserProfile>) => void;
  setBusiness: (data: Partial<BusinessProfile>) => void;
  setCapital: (data: Partial<CapitalProfile>) => void;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  // Location
  latitude: null,
  longitude: null,
  village: null,
  district: null,
  state: null,
  setLocation: (data) => set((state) => ({ ...state, ...data })),

  // Profile
  entrepreneurType: null,
  socialCategory: null,
  gender: null,
  ageGroup: null,
  previousBusinessExperience: null,
  previousBusinessDetails: null,
  setProfile: (data) => set((state) => ({ ...state, ...data })),

  // Business
  businessCategory: null,
  businessIdea: null,
  businessStage: null,
  existingBusinessDuration: null,
  businessGoal: null,
  setBusiness: (data) => set((state) => ({ ...state, ...data })),

  // Capital
  ownInvestment: null,
  hasExistingLoan: null,
  existingLoanPayment: null,
  setCapital: (data) => set((state) => ({ ...state, ...data })),
}));
