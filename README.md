# Loyalty Frontend Alpha

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the environment variables in `.env` with your API endpoints

3. For Vercel deployment:
   - Go to your project settings
   - Navigate to the Environment Variables section
   - Add each variable from your `.env` file

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Environment Variables

- `VITE_COMPETITOR_API_URL`: Competitor analysis API endpoint
- `VITE_CUSTOMER_API_URL`: Customer analysis API endpoint
- `VITE_OBJECTIVES_API_URL`: Loyalty objectives API endpoint
- `VITE_PROGRAM_DESIGN_API_URL`: Program design API endpoint
- `VITE_FINANCIAL_API_URL`: Financial model API endpoint
- `VITE_ROADMAP_API_URL`: Roadmap API endpoint
- `VITE_BUSINESS_CASE_API_URL`: Business case API endpoint
