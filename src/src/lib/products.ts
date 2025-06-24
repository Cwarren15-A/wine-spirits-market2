import { products } from '../../products';
import { type Product } from './api';

// Convert products to match the expected Product interface
export function getFeaturedProducts(): Product[] {
  return products.slice(0, 20).map((product): Product => ({
    id: product.id,
    name: product.name,
    type: product.category === 'wine' ? 'wine' : 'spirits',
    producer: product.producer,
    region: product.region,
    vintage: product.vintage ? Math.round(product.vintage) : undefined,
    varietal: product.subCategory,
    base_price: product.currentMarketPriceUSD,
    current_price: product.currentMarketPriceUSD,
    available_quantity: Math.floor(Math.random() * 20) + 1, // Random quantity 1-20
    primary_image_url: `/images/${product.category === 'wine' ? 'wines' : 'spirits'}/${product.slug}.jpg`,
    description: product.tastingNotes || 'Premium vintage with exceptional quality.',
    tasting_notes: product.tastingNotes,
    investment_potential: product.investmentPotential,
    featured: Math.random() > 0.7, // 30% chance of being featured
    investment_grade: Math.random() > 0.5,
    fiveYearPriceChangePct: product.fiveYearPriceChangePct || (Math.random() * 40 - 10), // Random -10% to +30%
    average_rating: Math.random() * 1.5 + 3.5, // Random 3.5-5.0 rating
    total_reviews: Math.floor(Math.random() * 500) + 50,
    wine_spectator_score: product.criticScore || undefined,
    robert_parker_score: undefined,
    james_suckling_score: undefined,
    price_change_24h: Math.random() * 6 - 3, // Random -3% to +3%
    last_traded_price: product.currentMarketPriceUSD * (1 + (Math.random() * 0.1 - 0.05)),
    price_range_52week: {
      low: product.currentMarketPriceUSD * 0.8,
      high: product.currentMarketPriceUSD * 1.3
    },
    volume_ml: 750,
    alcohol_content: product.category === 'wine' ? 
      Math.random() * 5 + 12 : // Wine: 12-17%
      Math.random() * 20 + 35, // Spirits: 35-55%
    rarity_score: Math.floor(Math.random() * 4) + 7, // 7-10
    food_pairings: product.category === 'wine' ? 
      ['Red meat', 'Aged cheese', 'Dark chocolate'] :
      ['Neat', 'On the rocks', 'Premium cigars'],
    serving_temperature: product.category === 'wine' ? '16-18°C' : 'Room temperature',
    aging_potential: product.category === 'wine' ? '10-20 years' : 'Ready to drink',
    vineyard_location: product.region,
    estate_history: `Established estate with generations of winemaking tradition in ${product.region}.`,
    production_methods: product.category === 'wine' ? 
      'Traditional fermentation with careful oak aging' :
      'Pot still distillation with premium aging',
    certifications: ['Organic', 'Sustainable'],
    seller: {
      business_name: 'Premium Wine Merchants',
      verification_status: 'verified' as const,
      seller_rating: 4.8,
      license_number: 'WM-' + Math.floor(Math.random() * 10000),
      license_state: 'CA',
      years_in_business: Math.floor(Math.random() * 20) + 5,
      total_sales: Math.floor(Math.random() * 5000) + 1000
    }
  }));
}

export function getProductById(id: string): Product | undefined {
  const allProducts = getFeaturedProducts();
  return allProducts.find(product => product.id === id);
}

export function searchProducts(
  query: string,
  filters: {
    type?: string;
    region?: string;
    priceMin?: number;
    priceMax?: number;
    vintage?: number;
  } = {}
): Product[] {
  let results = getFeaturedProducts();

  // Apply text search
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.producer.toLowerCase().includes(searchTerm) ||
      product.region.toLowerCase().includes(searchTerm) ||
      product.varietal?.toLowerCase().includes(searchTerm)
    );
  }

  // Apply filters
  if (filters.type) {
    results = results.filter(product => product.type === filters.type);
  }

  if (filters.region) {
    results = results.filter(product => 
      product.region.toLowerCase().includes(filters.region!.toLowerCase())
    );
  }

  if (filters.priceMin) {
    results = results.filter(product => 
      (product.current_price || product.base_price) >= filters.priceMin!
    );
  }

  if (filters.priceMax) {
    results = results.filter(product => 
      (product.current_price || product.base_price) <= filters.priceMax!
    );
  }

  if (filters.vintage) {
    results = results.filter(product => product.vintage === filters.vintage);
  }

  return results;
}

export function getFeaturedWines(): Product[] {
  return getFeaturedProducts().filter(product => product.type === 'wine');
}

export function getFeaturedSpirits(): Product[] {
  return getFeaturedProducts().filter(product => product.type === 'spirits');
}

export function getInvestmentGradeProducts(): Product[] {
  return getFeaturedProducts().filter(product => product.investment_grade);
}

export function getTopRatedProducts(): Product[] {
  return getFeaturedProducts()
    .filter(product => product.average_rating && product.average_rating > 4.5)
    .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
}

export function getRecentlyTradedProducts(): Product[] {
  return getFeaturedProducts()
    .filter(product => product.last_traded_price)
    .sort(() => Math.random() - 0.5) // Random order to simulate recent activity
    .slice(0, 10);
} 