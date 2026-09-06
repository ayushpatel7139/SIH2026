export interface SchemeMatch {
  id: string;
  name: string;
  reasonToFit: string;
  financingCategory: string;
  eligibilitySignal: 'Potential match' | 'May be relevant';
  url: string;
}
