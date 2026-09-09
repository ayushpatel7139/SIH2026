import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  firstName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface SavedAssessment {
  id: string;
  userId: string;
  name: string; 
  location: string;
  status: 'Draft' | 'In Progress' | 'Completed';
  lastStepRoute: string; 
  completionPercentage: number;
  data: any; 
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  savedAssessments: SavedAssessment[];
  isLoading: boolean;
  error: string | null;
  
  // Auth flows
  login: (email: string, firstName: string) => Promise<void>;
  signup: (email: string, firstName: string) => Promise<void>;
  googleAuth: () => Promise<void>;
  logout: () => void;
  
  // OTP Simulation
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  
  // Account
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  
  // Assessments
  saveAssessment: (
    id: string, 
    data: any, 
    name: string, 
    location: string, 
    status: 'Draft' | 'In Progress' | 'Completed',
    lastStepRoute: string,
    completionPercentage: number
  ) => void;
  getAssessment: (id: string) => SavedAssessment | undefined;
}

// Helper to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      savedAssessments: [],
      isLoading: false,
      error: null,
      
      login: async (email, firstName) => {
        set({ isLoading: true, error: null });
        await delay(800); // Simulate network
        // Basic mock failure handling
        if (email === 'fail@test.com') {
          set({ isLoading: false, error: 'That email or password doesn\'t look right. Please try again.' });
          throw new Error('Auth failed');
        }
        set({ 
          isLoading: false,
          user: { 
            id: `usr_${Math.random().toString(36).substring(2, 11)}`, 
            email, 
            firstName,
            createdAt: new Date().toISOString()
          } 
        });
      },

      signup: async (email, firstName) => {
        set({ isLoading: true, error: null });
        await delay(1200); 
        set({ 
          isLoading: false,
          user: { 
            id: `usr_${Math.random().toString(36).substring(2, 11)}`, 
            email, 
            firstName,
            createdAt: new Date().toISOString()
          } 
        });
      },

      googleAuth: async () => {
        set({ isLoading: true, error: null });
        await delay(1500); // simulate OAuth redirect flow
        set({ 
          isLoading: false,
          user: { 
            id: `usr_g_${Math.random().toString(36).substring(2, 11)}`, 
            email: 'google.user@gmail.com', 
            firstName: 'Google User',
            createdAt: new Date().toISOString()
          } 
        });
      },
      
      logout: () => set({ user: null, error: null }),

      sendOtp: async (email: string) => {
        set({ isLoading: true, error: null });
        await delay(1000);
        set({ isLoading: false });
        console.log(`Mock OTP sent to ${email}`);
      },

      verifyOtp: async (email: string, otp: string) => {
        set({ isLoading: true, error: null });
        await delay(1500);
        set({ isLoading: false });
        if (otp === '000000') {
           set({ error: 'Invalid verification code.' });
           return false;
        }
        return true;
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        await delay(1500);
        set({ isLoading: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        }));
      },
      
      saveAssessment: (id, data, name, location, status, lastStepRoute, completionPercentage) => set((state) => {
        if (!state.user) return state; 

        const existing = state.savedAssessments.findIndex(a => a.id === id);
        const newAssessment: SavedAssessment = {
          id,
          userId: state.user.id,
          name,
          location,
          status,
          lastStepRoute,
          completionPercentage,
          data,
          updatedAt: new Date().toISOString()
        };

        if (existing >= 0) {
          const newArray = [...state.savedAssessments];
          newArray[existing] = newAssessment;
          return { savedAssessments: newArray };
        } else {
          return { savedAssessments: [newAssessment, ...state.savedAssessments] };
        }
      }),

      getAssessment: (id) => {
        return get().savedAssessments.find(a => a.id === id);
      }
    }),
    {
      name: 'rural-biz-auth-storage', 
    }
  )
);
