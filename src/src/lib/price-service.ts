export interface PricePoint {
  date: string;
  price: number;
  volume?: number;
}

export interface PriceHistory {
  productId: string;
  points: PricePoint[];
  summary: {
    current: number;
    change24h: number;
    change7d: number;
    change30d: number;
    high52w: number;
    low52w: number;
  };
}

// Mock price history generator for demonstration
export async function getPriceHistory(
  productId: string,
  productSlug: string,
  productType: "wine" | "spirits"
): Promise<PriceHistory> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Generate mock price data
  const basePrice = getBasePriceForProduct(productId);
  const points: PricePoint[] = [];
  const today = new Date();
  
  // Generate 60 days of price history
  for (let i = 59; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some realistic price volatility
    const volatility = productType === "wine" ? 0.02 : 0.03; // Wine more stable than spirits
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const trendFactor = Math.sin(i / 10) * 0.01; // Slight trend component
    
    const priceMultiplier = 1 + randomChange + trendFactor;
    const price = Math.round(basePrice * priceMultiplier * 100) / 100;
    
    points.push({
      date: date.toISOString().split('T')[0],
      price,
      volume: Math.floor(Math.random() * 10) + 1
    });
  }

  // Calculate summary statistics
  const prices = points.map(p => p.price);
  const current = prices[prices.length - 1];
  const price24hAgo = prices[prices.length - 2] || current;
  const price7dAgo = prices[prices.length - 8] || current;
  const price30dAgo = prices[prices.length - 31] || current;
  
  return {
    productId,
    points,
    summary: {
      current,
      change24h: ((current - price24hAgo) / price24hAgo) * 100,
      change7d: ((current - price7dAgo) / price7dAgo) * 100,
      change30d: ((current - price30dAgo) / price30dAgo) * 100,
      high52w: Math.max(...prices),
      low52w: Math.min(...prices)
    }
  };
}

export function calculatePriceChange(current: number, previous: number): {
  amount: number;
  percentage: number;
  direction: 'up' | 'down' | 'flat';
} {
  const amount = current - previous;
  const percentage = previous !== 0 ? (amount / previous) * 100 : 0;
  
  let direction: 'up' | 'down' | 'flat' = 'flat';
  if (amount > 0) direction = 'up';
  else if (amount < 0) direction = 'down';
  
  return {
    amount,
    percentage,
    direction
  };
}

export function formatPriceChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

export function getPriceChangeColor(change: number): string {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-gray-600';
}

// Helper function to get base price for mock data
function getBasePriceForProduct(productId: string): number {
  // Use product ID to generate consistent base prices
  const hash = productId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Generate prices between $50-$5000 based on hash
  const min = 50;
  const max = 5000;
  return min + (Math.abs(hash) % (max - min));
}

// Market analysis functions
export function analyzeMarketTrend(priceHistory: PriceHistory): {
  trend: 'bullish' | 'bearish' | 'sideways';
  strength: 'weak' | 'moderate' | 'strong';
  recommendation: string;
} {
  const { summary } = priceHistory;
  const change30d = summary.change30d;
  
  let trend: 'bullish' | 'bearish' | 'sideways' = 'sideways';
  let strength: 'weak' | 'moderate' | 'strong' = 'weak';
  
  if (change30d > 5) {
    trend = 'bullish';
    strength = change30d > 15 ? 'strong' : change30d > 10 ? 'moderate' : 'weak';
  } else if (change30d < -5) {
    trend = 'bearish';
    strength = change30d < -15 ? 'strong' : change30d < -10 ? 'moderate' : 'weak';
  }
  
  let recommendation = '';
  if (trend === 'bullish' && strength !== 'weak') {
    recommendation = 'Consider buying - strong upward momentum';
  } else if (trend === 'bearish' && strength !== 'weak') {
    recommendation = 'Consider waiting - downward pressure detected';
  } else {
    recommendation = 'Monitor closely - price consolidating';
  }
  
  return { trend, strength, recommendation };
}

export function calculateVolatility(priceHistory: PriceHistory): {
  volatility: number;
  riskLevel: 'low' | 'medium' | 'high';
} {
  const prices = priceHistory.points.map(p => p.price);
  const returns = [];
  
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized volatility
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (volatility > 30) riskLevel = 'high';
  else if (volatility > 15) riskLevel = 'medium';
  
  return { volatility, riskLevel };
} 