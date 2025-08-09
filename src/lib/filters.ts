import { isWithinInterval, parseISO } from 'date-fns';
import { Dataset, ReviewFact, Product } from './dataModel';

export type FilterState = {
  geoIds: string[];
  categoryIds: string[];
  brandIds: string[];
  productIds: string[];
  minRating?: number;
  minSentiment?: number;
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  productSearch: string; // include/exclude words
  attributes: string[]; // required attributes
};

export const DEFAULT_FILTERS: FilterState = {
  geoIds: [],
  categoryIds: [],
  brandIds: [],
  productIds: [],
  productSearch: '',
  attributes: [],
};

export type SearchQuery = {
  include: string[];
  exclude: string[];
};

export function parseProductSearch(query: string): SearchQuery {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  const include: string[] = [];
  const exclude: string[] = [];
  for (const token of tokens) {
    if (token.startsWith('-')) exclude.push(token.slice(1));
    else if (token.startsWith('+')) include.push(token.slice(1));
    else include.push(token);
  }
  return { include, exclude };
}

export function productMatchesSearch(product: Product, query: SearchQuery): boolean {
  const hay = `${product.productName} ${product.subBrand ?? ''} ${product.version ?? ''}`.toLowerCase();
  for (const neg of query.exclude) {
    if (hay.includes(neg)) return false;
  }
  for (const pos of query.include) {
    if (!hay.includes(pos)) return false;
  }
  return true;
}

export function applyFilters(dataset: Dataset, filters: FilterState): ReviewFact[] {
  const { facts, dimensions } = dataset;
  const { products } = dimensions;
  const search = parseProductSearch(filters.productSearch);
  const productIdSet = new Set(
    products
      .filter((p) => (filters.brandIds.length ? filters.brandIds.includes(p.brandId) : true))
      .filter((p) => (filters.categoryIds.length ? filters.categoryIds.includes(p.categoryId) : true))
      .filter((p) => (filters.productIds.length ? filters.productIds.includes(p.productId) : true))
      .filter((p) => (filters.attributes.length ? filters.attributes.every((a) => p.attributes.includes(a)) : true))
      .filter((p) => (filters.productSearch ? productMatchesSearch(p, search) : true))
      .map((p) => p.productId)
  );

  const geoSet = new Set(filters.geoIds);

  const dateFrom = filters.dateFrom ? parseISO(filters.dateFrom) : undefined;
  const dateTo = filters.dateTo ? parseISO(filters.dateTo) : undefined;

  return facts.filter((f) => {
    if (productIdSet.size && !productIdSet.has(f.productId)) return false;
    if (geoSet.size && !geoSet.has(f.geoId)) return false;
    if (filters.minRating && f.starRating < filters.minRating) return false;
    if (filters.minSentiment && f.sentiment < filters.minSentiment) return false;

    if (dateFrom && dateTo) {
      const d = parseISO(f.reviewDate);
      if (!isWithinInterval(d, { start: dateFrom, end: dateTo })) return false;
    }

    return true;
  });
}