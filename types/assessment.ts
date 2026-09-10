export type EntrepreneurType = 'Existing Business Owner' | 'First-time Entrepreneur';
export type SocialCategory = 'SC' | 'ST' | 'OBC' | 'Other' | 'Prefer not to say';
export type Gender = 'Woman' | 'Man' | 'Other' | 'Prefer not to say';
export type AgeGroup = '18–25' | '26–35' | '36–50' | '51+';
export type PreviousExperience = 'Yes' | 'No';

export interface UserProfile {
  entrepreneurType: EntrepreneurType | null;
  socialCategory: SocialCategory | null;
  gender: Gender | null;
  ageGroup: AgeGroup | null;
  previousBusinessExperience: PreviousExperience | null;
  previousBusinessDetails: string | null;
}

export type BusinessCategory = 'Agriculture & Allied' | 'Food & Processing' | 'Retail & Local Services' | 'Manufacturing' | 'Transport & Logistics' | 'Digital & Professional Services' | 'Other';
export type BusinessStage = 'Just exploring' | 'Planning to start' | 'Already running';
export type BusinessDuration = 'Less than 1 year' | '1–3 years' | '3+ years';
export type BusinessGoal = 'Start a new business' | 'Expand my existing business' | 'Improve an existing business' | 'Explore a better business opportunity';

export interface BusinessProfile {
  businessCategory: BusinessCategory | null;
  businessIdea: string | null;
  businessStage: BusinessStage | null;
  existingBusinessDuration: BusinessDuration | null;
  businessGoal: BusinessGoal | null;
}

export type ExistingCommitments = 'Yes' | 'No';

export interface CapitalProfile {
  ownInvestment: string | null;
  hasExistingLoan: ExistingCommitments | null;
  existingLoanPayment: string | null;
}
