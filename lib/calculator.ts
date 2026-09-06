export interface FinancialRoadmap {
  projectCost: number;
  breakdown: {
    equipment: number;
    inventory: number;
    workingCapital: number;
    other: number;
  };
  ownContribution: number;
  fundingGap: number;
  indicativeLoan: number;
  estimatedEmi: number;
  tenureYears: number;
  repaymentRisk: 'LOWER RISK' | 'MODERATE' | 'HIGHER RISK';
}

function parseAmount(amountStr: string | null): number {
  if (!amountStr) return 0;
  const numStr = amountStr.replace(/[^0-9]/g, '');
  const num = parseInt(numStr, 10);
  return isNaN(num) ? 0 : num;
}

export function calculateFinancials(
  businessCategory: string | null,
  ownInvestmentStr: string | null,
  existingEmiStr: string | null
): FinancialRoadmap {
  // 1. Estimate project cost based on category
  let baseCost = 500000; // default 5L
  
  if (businessCategory === 'Retail & Local Services') baseCost = 300000;
  if (businessCategory === 'Manufacturing') baseCost = 800000;
  if (businessCategory === 'Agriculture & Allied') baseCost = 400000;
  
  // 2. Breakdown
  const equipment = Math.round(baseCost * 0.4);
  const inventory = Math.round(baseCost * 0.3);
  const workingCapital = Math.round(baseCost * 0.2);
  const other = baseCost - equipment - inventory - workingCapital;

  // 3. User contribution
  const ownContribution = parseAmount(ownInvestmentStr);
  const existingEmi = parseAmount(existingEmiStr);
  
  // 4. Funding Gap & Loan
  const fundingGap = Math.max(0, baseCost - ownContribution);
  const indicativeLoan = fundingGap; // assuming 100% of gap is loan for demo
  
  // 5. EMI Calculation (Assume 9% interest over 5 years)
  const tenureYears = 5;
  const ratePerMonth = 0.09 / 12;
  const numPayments = tenureYears * 12;
  let estimatedEmi = 0;
  
  if (indicativeLoan > 0) {
    estimatedEmi = Math.round(
      (indicativeLoan * ratePerMonth * Math.pow(1 + ratePerMonth, numPayments)) / 
      (Math.pow(1 + ratePerMonth, numPayments) - 1)
    );
  }

  // 6. Risk Calculation
  // Very simplistic risk model for demo
  const totalMonthlyObligation = estimatedEmi + existingEmi;
  let repaymentRisk: 'LOWER RISK' | 'MODERATE' | 'HIGHER RISK' = 'MODERATE';
  
  if (totalMonthlyObligation > 15000) {
    repaymentRisk = 'HIGHER RISK';
  } else if (totalMonthlyObligation < 5000) {
    repaymentRisk = 'LOWER RISK';
  }

  return {
    projectCost: baseCost,
    breakdown: { equipment, inventory, workingCapital, other },
    ownContribution,
    fundingGap,
    indicativeLoan,
    estimatedEmi,
    tenureYears,
    repaymentRisk
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
