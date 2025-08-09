# VoC Analytics Dashboard

An interactive Voice of Consumer analytics dashboard for CPG online reviews, built with Next.js (App Router) + Tailwind CSS + Recharts. Includes sample data and a star-schema-like model.

## Run locally

```bash
npm install
npm run dev
```

- Market Compare: `/market`
- Product Trends: `/product-trends`
- Market Trends: `/market-trends`

## Features
- Collapsible, robust filters (geo, category, brand, product search with +include/-exclude, attributes, min rating/sentiment, date range)
- Cross-filtering by clicking in charts and tables
- Three use cases/pages with charts and review drill-in
- Sample deterministic dataset

## Notes
- This demo uses client-side state and generated data. Replace with your data warehouse and APIs.
- Data model follows star schema: `ReviewFact` with `Brand`, `Category`, `Geography`, `Product` dimensions.