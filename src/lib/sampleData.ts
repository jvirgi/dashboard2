import { addDays, formatISO, subDays } from 'date-fns';
import { Dataset, Dimensions, ReviewFact, Product, Brand, Category, Geography } from './dataModel';

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ATTRIBUTE_POOL = [
  'whitening',
  'sensitive',
  'mint',
  'charcoal',
  'hydrating',
  'volumizing',
  'fragrance-free',
  'eco',
  'refill',
  'travel',
  'long-lasting',
  'quick-dry',
  'soft-bristle',
  'precision',
  'natural',
  'vegan',
];

const COUNTRIES = [
  { country: 'United States', region: 'North America' },
  { country: 'Canada', region: 'North America' },
  { country: 'United Kingdom', region: 'Europe' },
  { country: 'Germany', region: 'Europe' },
  { country: 'India', region: 'Asia' },
  { country: 'Japan', region: 'Asia' },
  { country: 'Australia', region: 'Oceania' },
  { country: 'Brazil', region: 'South America' },
];

export function generateSampleData(seed = 42, days = 180, reviewsPerDay = 40): Dataset {
  const rand = mulberry32(seed);

  const brands: Brand[] = [
    { brandId: 'b-our', brandName: 'OurBrand', parentCompany: 'OurCo' },
    { brandId: 'b-glow', brandName: 'GlowCo', parentCompany: 'Competitor' },
    { brandId: 'b-edge', brandName: 'EdgeLabs', parentCompany: 'Competitor' },
    { brandId: 'b-fresh', brandName: 'FreshMint', parentCompany: 'Competitor' },
  ];

  const categories: Category[] = [
    { categoryId: 'c-beauty', categoryName: 'Beauty Care' },
    { categoryId: 'c-groom', categoryName: 'Grooming' },
    { categoryId: 'c-oral', categoryName: 'Oral Care' },
    { categoryId: 'c-personal', categoryName: 'Personal Care' },
  ];

  const geographies: Geography[] = COUNTRIES.map((c, idx) => ({
    geoId: `g-${idx}`,
    country: c.country,
    region: c.region,
  }));

  const products: Product[] = [];

  const subBrands = ['Essentials', 'Pro', 'Ultra', 'Daily'];
  const versions = ['V1', 'V2', 'V3'];

  for (const brand of brands) {
    for (const category of categories) {
      const num = 3;
      for (let i = 0; i < num; i++) {
        const attrs = ATTRIBUTE_POOL.filter(() => rand() > 0.6).slice(0, 4);
        products.push({
          productId: `p-${brand.brandId}-${category.categoryId}-${i}`,
          productName: `${brand.brandName} ${category.categoryName} ${subBrands[Math.floor(rand() * subBrands.length)]} ${i + 1}`,
          brandId: brand.brandId,
          subBrand: subBrands[Math.floor(rand() * subBrands.length)],
          version: versions[Math.floor(rand() * versions.length)],
          categoryId: category.categoryId,
          attributes: attrs.length ? attrs : [ATTRIBUTE_POOL[Math.floor(rand() * ATTRIBUTE_POOL.length)]],
        });
      }
    }
  }

  const startDate = subDays(new Date(), days);
  const facts: ReviewFact[] = [];

  for (let d = 0; d < days; d++) {
    const date = addDays(startDate, d);
    const isoDate = formatISO(date, { representation: 'date' });

    const todayReviews = Math.floor(reviewsPerDay * (0.7 + rand()));
    for (let r = 0; r < todayReviews; r++) {
      const product = products[Math.floor(rand() * products.length)];
      const geo = geographies[Math.floor(rand() * geographies.length)];

      // Bias: OurBrand slightly better ratings, some categories trend differently
      const brandBias = product.brandId === 'b-our' ? 0.4 : 0;
      const catBias = product.categoryId === 'c-oral' ? 0.1 : product.categoryId === 'c-groom' ? -0.05 : 0;
      const base = rand() + brandBias + catBias;

      const starRating = ((): 1 | 2 | 3 | 4 | 5 => {
        if (base > 1.2) return 5;
        if (base > 0.95) return 4;
        if (base > 0.65) return 3;
        if (base > 0.4) return 2;
        return 1;
      })();

      const sentiment = Math.max(-1, Math.min(1, (starRating - 3) / 2 + (rand() - 0.5) * 0.4));

      const attrs = product.attributes.filter(() => rand() > 0.5);
      const mention = attrs.length ? attrs : [product.attributes[Math.floor(rand() * product.attributes.length)]];

      const textPoolPos = [
        'Love the feel and results',
        'Great value and quality',
        'Exceeded expectations',
        'Noticed improvement in a week',
        'Smells wonderful and lasts',
      ];
      const textPoolNeg = [
        'Disappointed with durability',
        'Irritated my skin',
        'Flavor was too strong',
        'Messy and leaks',
        'Not worth the price',
      ];

      const positive = sentiment >= 0;
      const text = `${positive ? textPoolPos[Math.floor(rand() * textPoolPos.length)] : textPoolNeg[Math.floor(rand() * textPoolNeg.length)]}. ` +
        `Features: ${mention.join(', ')}.`;

      facts.push({
        reviewId: `r-${d}-${r}`,
        productId: product.productId,
        geoId: geo.geoId,
        reviewDate: isoDate,
        starRating,
        sentiment: Number(sentiment.toFixed(2)),
        title: positive ? 'Amazing!' : 'Not great',
        text,
        attributesMentioned: mention,
      });
    }
  }

  const dimensions: Dimensions = { brands, categories, geographies, products };
  return { dimensions, facts };
}

export const DATASET: Dataset = generateSampleData();