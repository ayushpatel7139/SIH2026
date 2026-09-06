export type OpportunityLevel = 'Promising' | 'Moderate' | 'Limited';
export type DemandLevel = 'High' | 'Medium' | 'Low';
export type CompetitionLevel = 'High' | 'Moderate' | 'Low';

export interface MarketSignal {
  type: 'positive' | 'warning' | 'neutral';
  message: string;
}

export interface MarketAnalysis {
  opportunityLevel: OpportunityLevel;
  estimatedReach: string;
  demandSignal: string;
  
  competitionLevel: CompetitionLevel;
  nearbyBusinesses: number;
  competitionExplanation: string;
  
  localDemandLevel: DemandLevel;
  demandExplanation: string;
  
  signals: MarketSignal[];
}
