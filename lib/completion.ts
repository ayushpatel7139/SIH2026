export const getCompletionPercentage = (pathname: string): number => {
  const percentageMap: Record<string, number> = {
    '/assessment/location': 12,
    '/assessment/profile': 25,
    '/assessment/business': 37,
    '/assessment/capital': 50,
    '/assessment/market': 62,
    '/assessment/roadmap': 75,
    '/assessment/swot': 87,
    '/assessment/result': 95,
    '/report': 100
  };

  // Find the exact match or the closest partial match
  for (const [route, percent] of Object.entries(percentageMap)) {
    if (pathname.includes(route)) {
      return percent;
    }
  }

  return 50; // fallback
};
