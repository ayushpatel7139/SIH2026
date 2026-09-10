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
  schemeName: string;
  interestRate: number;
  moratoriumMonths: number;
  maxLoanAmount: number;
  isEligible: boolean;
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
  
  const ownContribution = parseAmount(ownInvestmentStr);
  const existingEmi = parseAmount(existingEmiStr);

  // 1. Project Cost = Available Margin Capital / 10%
  const projectCost = ownContribution * 10;
  
  // 2. Scheme parameters based on Project Cost
  let schemeName = 'Outside Scheme Range';
  let interestRate = 0;
  let tenureYears = 0;
  let moratoriumMonths = 0;
  let maxLoanAmount = 0;
  let isEligible = false;

  if (projectCost > 0 && projectCost <= 140000) {
    schemeName = 'Micro Finance Scheme';
    interestRate = 6.5; // 6.5%
    tenureYears = 3;
    moratoriumMonths = 3;
    maxLoanAmount = Math.min(projectCost * 0.9, 125000);
    isEligible = true;
  } else if (projectCost > 140000 && projectCost <= 5000000) {
    schemeName = 'Term Loan Scheme';
    interestRate = 8.0; // 8%
    tenureYears = 7;
    moratoriumMonths = 6;
    maxLoanAmount = Math.min(projectCost * 0.9, 4500000);
    isEligible = true;
  }

  // 3. Breakdown (Arbitrary for demo, based on projectCost)
  const equipment = Math.round(projectCost * 0.4);
  const inventory = Math.round(projectCost * 0.3);
  const workingCapital = Math.round(projectCost * 0.2);
  const other = projectCost - equipment - inventory - workingCapital;

  // 4. Funding Gap & Loan
  const fundingGap = Math.max(0, projectCost - ownContribution);
  // Loan is bounded by the maxLoanAmount
  const indicativeLoan = isEligible ? Math.min(fundingGap, maxLoanAmount) : 0;
  
  // 5. EMI Calculation using the scheme tenure and interest rate
  let estimatedEmi = 0;
  if (isEligible && indicativeLoan > 0) {
    const ratePerMonth = (interestRate / 100) / 12;
    const numPayments = tenureYears * 12;
    
    // Note: The prompt states "EMI calculation MUST use the tenure selected by the scheme."
    // If the standard EMI formula applies to the full tenure, it is:
    estimatedEmi = Math.round(
      (indicativeLoan * ratePerMonth * Math.pow(1 + ratePerMonth, numPayments)) / 
      (Math.pow(1 + ratePerMonth, numPayments) - 1)
    );
  }

  // 6. Risk Calculation
  const totalMonthlyObligation = estimatedEmi + existingEmi;
  let repaymentRisk: 'LOWER RISK' | 'MODERATE' | 'HIGHER RISK' = 'MODERATE';
  
  if (totalMonthlyObligation > 15000) {
    repaymentRisk = 'HIGHER RISK';
  } else if (totalMonthlyObligation < 5000) {
    repaymentRisk = 'LOWER RISK';
  }

  return {
    projectCost,
    breakdown: { equipment, inventory, workingCapital, other },
    ownContribution,
    fundingGap,
    indicativeLoan,
    estimatedEmi,
    tenureYears,
    repaymentRisk,
    schemeName,
    interestRate,
    moratoriumMonths,
    maxLoanAmount,
    isEligible
  };
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    // Format to max 2 decimal places, removing trailing zeros
    const formattedLakhs = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2
    }).format(lakhs);
    return `₹${formattedLakhs} lakh`;
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
