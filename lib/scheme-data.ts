import { SchemeMatch } from '@/types/scheme';

export function getMatchingSchemes(
  entrepreneurType: string | null,
  socialCategory: string | null,
  gender: string | null,
  businessCategory: string | null,
  fundingGap: number
): SchemeMatch[] {
  // Demo scheme matching logic
  const schemes: SchemeMatch[] = [];

  if (socialCategory === 'SC' || socialCategory === 'ST') {
    schemes.push({
      id: 'nsfdc',
      name: 'NSFDC Term Loan Scheme',
      reasonToFit: 'Targeted support for SC/ST entrepreneurs starting new ventures.',
      financingCategory: 'Term Loan with Subsidized Interest',
      eligibilitySignal: 'Potential match',
      url: '#'
    });
  }

  if (gender === 'Woman' || socialCategory === 'SC' || socialCategory === 'ST') {
    schemes.push({
      id: 'standup',
      name: 'Stand-Up India',
      reasonToFit: 'Supports greenfield enterprises for women and SC/ST individuals.',
      financingCategory: 'Bank Loan (₹10L - ₹1Cr)',
      eligibilitySignal: 'May be relevant',
      url: '#'
    });
  }

  if (schemes.length === 0 || businessCategory === 'Agriculture & Allied') {
    schemes.push({
      id: 'pmegp',
      name: 'PMEGP (Prime Minister Employment Generation Programme)',
      reasonToFit: 'General subsidy for micro-enterprises in rural areas.',
      financingCategory: 'Margin Money Subsidy (up to 35%)',
      eligibilitySignal: 'Potential match',
      url: '#'
    });
  }
  
  if (schemes.length < 2) {
    schemes.push({
      id: 'mudra',
      name: 'Pradhan Mantri MUDRA Yojana',
      reasonToFit: 'Micro-credit facility for non-farm income generating activities.',
      financingCategory: 'Micro Loan (up to ₹10L)',
      eligibilitySignal: 'Potential match',
      url: '#'
    });
  }

  return schemes.slice(0, 3);
}
