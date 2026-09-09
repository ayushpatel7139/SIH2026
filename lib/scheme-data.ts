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
      url: '#',
      potentialFit: ['SC/ST entrepreneur', 'Suitable for eligible income/business criteria'],
      whyItMatches: 'Your business profile and financing requirement appear aligned with the scheme criteria.',
      source: 'National Scheduled Castes Finance and Development Corporation',
      lastUpdated: 'September 2026'
    });
  }

  if (gender === 'Woman' || socialCategory === 'SC' || socialCategory === 'ST') {
    schemes.push({
      id: 'standup',
      name: 'Stand-Up India',
      reasonToFit: 'Supports greenfield enterprises for women and SC/ST individuals.',
      financingCategory: 'Bank Loan (₹10L - ₹1Cr)',
      eligibilitySignal: 'May be relevant',
      url: '#',
      potentialFit: ['First-time entrepreneur', 'Women or SC/ST applicant', 'Manufacturing, services, or trading sector'],
      whyItMatches: 'Based on the information provided, your profile aligns with the scheme’s goal to support new enterprises.',
      source: 'Stand-Up India Portal',
      lastUpdated: 'August 2026'
    });
  }

  if (schemes.length === 0 || businessCategory === 'Agriculture & Allied') {
    schemes.push({
      id: 'pmegp',
      name: 'PMEGP (Prime Minister Employment Generation Programme)',
      reasonToFit: 'General subsidy for micro-enterprises in rural areas.',
      financingCategory: 'Margin Money Subsidy (up to 35%)',
      eligibilitySignal: 'Potential match',
      url: '#',
      potentialFit: ['Micro-enterprise in rural area', 'Eligible project cost criteria'],
      whyItMatches: 'Your location and business category indicate a potential match for this central sector scheme.',
      source: 'KVIC Official Guidelines',
      lastUpdated: 'September 2026'
    });
  }
  
  if (schemes.length < 2) {
    schemes.push({
      id: 'mudra',
      name: 'Pradhan Mantri MUDRA Yojana',
      reasonToFit: 'Micro-credit facility for non-farm income generating activities.',
      financingCategory: 'Micro Loan (up to ₹10L)',
      eligibilitySignal: 'Potential match',
      url: '#',
      potentialFit: ['Non-farm enterprise', 'Income generating activity', 'Loan requirement under ₹10 Lakhs'],
      whyItMatches: 'Your estimated financing gap makes this micro-credit facility a highly relevant option to explore.',
      source: 'MUDRA Official Website',
      lastUpdated: 'July 2026'
    });
  }

  return schemes.slice(0, 3);
}
