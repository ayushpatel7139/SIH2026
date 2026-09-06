export interface SwotInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  text: string;
}

export interface RiskAction {
  risk: string;
  reason: string;
  action: string;
}

export interface RiskAnalysis {
  marketOpportunity: string;
  competitionLevel: string;
  repaymentBurden: string;
  capitalGap: number;
  
  swot: {
    strengths: SwotInsight[];
    weaknesses: SwotInsight[];
    opportunities: SwotInsight[];
    threats: SwotInsight[];
  };
  
  topRisks: RiskAction[];
  overallRisk: 'LOW RISK' | 'MODERATE RISK' | 'HIGHER RISK';
}

export interface FeasibilityResult {
  score: number;
  outcome: 'PROMISING TO PROCEED' | 'PROCEED WITH CAUTION' | 'NEEDS MORE VALIDATION';
  reasons: string[];
  breakdown: {
    marketOpportunity: number;
    financialReadiness: number;
    repaymentComfort: number;
    businessRisk: number;
    entrepreneurFit: number;
  };
  topAdvantage: string;
  topConcern: {
    risk: string;
    action: string;
  };
}

export function generateRiskAnalysis(
  businessCategory: string | null,
  businessIdea: string | null,
  previousExperience: string | null,
  opportunityLevel: string,
  competitionLvl: string,
  repaymentRisk: string,
  fundingGap: number
): RiskAnalysis {
  
  const strengths: SwotInsight[] = [];
  const weaknesses: SwotInsight[] = [];
  const opportunities: SwotInsight[] = [];
  const threats: SwotInsight[] = [];
  const topRisks: RiskAction[] = [];

  if (previousExperience === 'Yes') {
    strengths.push({ type: 'strength', text: 'Entrepreneur has relevant experience' });
  }
  if (opportunityLevel === 'Promising') {
    strengths.push({ type: 'strength', text: 'Existing local demand is strong' });
  }
  strengths.push({ type: 'strength', text: 'Manageable initial investment' });

  if (fundingGap > 100000) {
    weaknesses.push({ type: 'weakness', text: 'Limited initial capital requiring external finance' });
  }
  weaknesses.push({ type: 'weakness', text: 'Dependence on seasonal demand' });
  if (competitionLvl === 'High') {
    weaknesses.push({ type: 'weakness', text: 'High competition in the immediate area' });
  }

  opportunities.push({ type: 'opportunity', text: 'Underserved nearby customers outside the main village' });
  opportunities.push({ type: 'opportunity', text: 'Scope to expand through digital/local channels' });
  opportunities.push({ type: 'opportunity', text: 'Relevant government support may reduce financing pressure' });

  threats.push({ type: 'threat', text: 'New competitors entering the same market' });
  if (businessCategory === 'Agriculture & Allied') {
    threats.push({ type: 'threat', text: 'Weather and seasonal price fluctuations' });
  } else {
    threats.push({ type: 'threat', text: 'Unpredictable local supply chain costs' });
  }
  threats.push({ type: 'threat', text: 'Lower-than-expected sales affecting repayment' });

  if (businessCategory === 'Agriculture & Allied' || weaknesses.some(w => w.text.includes('seasonal'))) {
    topRisks.push({
      risk: 'SEASONAL DEMAND',
      reason: 'Revenue may fall during off-season months.',
      action: 'Keep a working-capital buffer and avoid over-borrowing.'
    });
  }

  if (competitionLvl === 'High' || competitionLvl === 'Moderate') {
    topRisks.push({
      risk: 'COMPETITION',
      reason: 'Several similar businesses operate nearby.',
      action: 'Differentiate through pricing, better service, or product selection.'
    });
  }

  if (repaymentRisk === 'HIGHER RISK' || repaymentRisk === 'MODERATE') {
    topRisks.push({
      risk: 'REPAYMENT PRESSURE',
      reason: 'Monthly EMI may become difficult if actual sales are lower than expected.',
      action: 'Review repayment capacity before taking the loan. Consider scaling down initially.'
    });
  }
  
  if (topRisks.length < 3) {
    topRisks.push({
      risk: 'SUPPLY CHAIN COSTS',
      reason: 'Material costs can fluctuate unexpectedly.',
      action: 'Build relationships with multiple local suppliers to negotiate better rates.'
    });
  }

  let overallRisk: 'LOW RISK' | 'MODERATE RISK' | 'HIGHER RISK' = 'MODERATE RISK';
  if (repaymentRisk === 'HIGHER RISK' && competitionLvl === 'High') {
    overallRisk = 'HIGHER RISK';
  } else if (repaymentRisk === 'LOWER RISK' && opportunityLevel === 'Promising') {
    overallRisk = 'LOW RISK';
  }

  return {
    marketOpportunity: opportunityLevel,
    competitionLevel: competitionLvl,
    repaymentBurden: repaymentRisk.replace(' RISK', ''),
    capitalGap: fundingGap,
    swot: {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      opportunities: opportunities.slice(0, 3),
      threats: threats.slice(0, 3)
    },
    topRisks: topRisks.slice(0, 3),
    overallRisk
  };
}

export function calculateFeasibilityScore(
  riskAnalysis: RiskAnalysis,
  previousExperience: string | null
): FeasibilityResult {
  
  // 1. Convert qualitative to quantitative (0-100)
  let marketOpportunity = 50;
  if (riskAnalysis.marketOpportunity === 'Promising') marketOpportunity = 85;
  if (riskAnalysis.marketOpportunity === 'Limited') marketOpportunity = 30;
  
  let financialReadiness = 50;
  if (riskAnalysis.capitalGap < 50000) financialReadiness = 80;
  if (riskAnalysis.capitalGap > 200000) financialReadiness = 35;
  
  let repaymentComfort = 50;
  if (riskAnalysis.repaymentBurden === 'LOWER') repaymentComfort = 90;
  if (riskAnalysis.repaymentBurden === 'HIGHER') repaymentComfort = 30;
  
  let businessRisk = 50;
  if (riskAnalysis.overallRisk === 'LOW RISK') businessRisk = 85;
  if (riskAnalysis.overallRisk === 'HIGHER RISK') businessRisk = 30;
  
  let entrepreneurFit = 50;
  if (previousExperience === 'Yes') entrepreneurFit = 85;
  
  // 2. Weight the factors
  const score = Math.round(
    (marketOpportunity * 0.25) +
    (financialReadiness * 0.15) +
    (repaymentComfort * 0.25) +
    (businessRisk * 0.20) +
    (entrepreneurFit * 0.15)
  );
  
  // 3. Determine Outcome
  let outcome: FeasibilityResult['outcome'] = 'PROCEED WITH CAUTION';
  if (score >= 75 && repaymentComfort > 40) {
    outcome = 'PROMISING TO PROCEED';
  } else if (score < 55 || repaymentComfort < 40) {
    outcome = 'NEEDS MORE VALIDATION';
  }

  // 4. Generate Reasons
  const reasons: string[] = [];
  if (marketOpportunity > 60) reasons.push('✓ Local demand looks promising in this area');
  else reasons.push('⚠ Local demand appears limited and needs validation');
  
  if (repaymentComfort > 60) reasons.push('✓ Estimated repayment burden is manageable');
  else reasons.push('⚠ Repayment burden needs careful review against expected income');
  
  if (businessRisk > 60) reasons.push('✓ Overall business risk is relatively low');
  else reasons.push('⚠ Significant competitive or operational risks identified');
  
  if (financialReadiness > 60) reasons.push('✓ Initial investment aligns well with indicated capital');

  // 5. Highlight Advantage & Concern
  let topAdvantage = "Strong local demand with manageable competition gives this business a good starting position.";
  if (entrepreneurFit > 80) topAdvantage = "Your previous business experience provides a strong foundation for managing operational challenges.";
  
  const topConcern = {
    risk: riskAnalysis.topRisks[0]?.risk || "MARKET VALIDATION",
    action: riskAnalysis.topRisks[0]?.action || "Validate demand with local customers before proceeding."
  };

  return {
    score,
    outcome,
    reasons: reasons.slice(0, 4),
    breakdown: {
      marketOpportunity,
      financialReadiness,
      repaymentComfort,
      businessRisk,
      entrepreneurFit
    },
    topAdvantage,
    topConcern
  };
}
