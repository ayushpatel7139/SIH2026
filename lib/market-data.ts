import { MarketAnalysis } from '@/types/market';

// This is a placeholder function that will eventually connect to the backend ML/Data engine
export function analyzeLocalMarket(
  district: string | null,
  businessCategory: string | null,
  businessIdea: string | null
): MarketAnalysis {
  
  // For demo purposes, returning mock data. 
  // In reality, this would use the district and business category to fetch actual data.
  
  const isDemo = true;
  
  return {
    opportunityLevel: 'Promising',
    estimatedReach: isDemo ? 'Approx. 5,000 households' : '',
    demandSignal: 'Growing',
    
    competitionLevel: 'Moderate',
    nearbyBusinesses: 12,
    competitionExplanation: '12 similar businesses identified nearby.',
    
    localDemandLevel: 'High',
    demandExplanation: 'Demand appears stronger for affordable everyday services in this area.',
    
    signals: [
      { type: 'positive', message: 'Existing customer base nearby' },
      { type: 'positive', message: 'Moderate competitor density' },
      { type: 'warning', message: 'Seasonal demand may affect revenue' }
    ]
  };
}
