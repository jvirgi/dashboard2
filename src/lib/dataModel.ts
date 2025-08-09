export type Brand = {
  brandId: string;
  brandName: string;
  parentCompany: 'OurCo' | 'Competitor';
};

export type Category = {
  categoryId: string;
  categoryName: 'Beauty Care' | 'Grooming' | 'Oral Care' | 'Personal Care';
};

export type Geography = {
  geoId: string;
  country: string;
  region: string;
};

export type Product = {
  productId: string;
  productName: string;
  brandId: string;
  subBrand?: string;
  version?: string;
  categoryId: string;
  attributes: string[]; // e.g., ['whitening', 'sensitive', 'mint']
};

export type ReviewFact = {
  reviewId: string;
  productId: string;
  geoId: string;
  reviewDate: string; // ISO date
  starRating: 1 | 2 | 3 | 4 | 5;
  sentiment: number; // -1 to 1
  title?: string;
  text: string;
  attributesMentioned: string[]; // normalized attribute tokens
};

export type Dimensions = {
  brands: Brand[];
  categories: Category[];
  geographies: Geography[];
  products: Product[];
};

export type Dataset = {
  dimensions: Dimensions;
  facts: ReviewFact[];
};