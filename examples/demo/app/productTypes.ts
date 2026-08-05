export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
};

export type DirectPrice = {
  currencyCode: string;
  priceBeforeDiscount: number;
  discountValue: number;
  finalPrice: number;
};

export type ProductAttribute = {
  id: string;
  title: string;
  value: string;
  type: string;
  hex?: string;
};

export type ProductOption = {
  id: string;
  title: string;
  images?: string[];
  gallery?: string[];
  stockCount: number;
  soldOut: number;
  totalStock: number;
  priceBeforeDiscount: number;
  discountValue: number;
  finalPrice: number;
  attributes: ProductAttribute[];
  banner?: { isPromo: boolean; title: string; description: string; image: string; endDate: string };
  flashSale?: { isSale: boolean; id: string | null; data: unknown | null };
};

export type Product = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  description: string;
  category: { id: string; name: string; description: string; slug: string } | null;
  images: string[];
  options: ProductOption[];
  directPrices: DirectPrice[];
  stockCount: number;
  soldOut: number;
  totalStock: number;
  averageRating: number;
  reviewCount: number;
  isWishlist: boolean;
  badges: string[];
  freeShipping: boolean;
  ratingBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  highlights: string[];
  shipping?: { freeThreshold: number; etaDays: string };
  reviews: Review[];
};
