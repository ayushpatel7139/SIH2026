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
  assessmentId: string | null;
  setAssessmentId: (id: string) => void;
  setLocation: (data: Partial<LocationState>) => void;
  setProfile: (data: Partial<UserProfile>) => void;
  setBusiness: (data: Partial<BusinessProfile>) => void;
  setCapital: (data: Partial<CapitalProfile>) => void;
  loadAssessmentData: (data: any) => void;
  resetAssessment: () => void;
}

const initialState = {
  assessmentId: null,
  latitude: null,
  longitude: null,
  village: null,
  district: null,
  state: null,
  entrepreneurType: null,
  socialCategory: null,
  gender: null,
  ageGroup: null,
  previousBusinessExperience: null,
  previousBusinessDetails: null,
  businessCategory: null,
  businessIdea: null,
  businessStage: null,
  existingBusinessDuration: null,
  businessGoal: null,
  ownInvestment: null,
  hasExistingLoan: null,
  existingLoanPayment: null,
};

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  ...initialState,
  
  setAssessmentId: (id) => set({ assessmentId: id }),
  setLocation: (data) => set((state) => ({ ...state, ...data })),
  setProfile: (data) => set((state) => ({ ...state, ...data })),
  setBusiness: (data) => set((state) => ({ ...state, ...data })),
  setCapital: (data) => set((state) => ({ ...state, ...data })),
  
  loadAssessmentData: (data) => set({ ...data }),
  
  resetAssessment: () => set({ 
    ...initialState, 
    assessmentId: `ast_${Math.random().toString(36).substr(2, 9)}` 
  }),
}));
