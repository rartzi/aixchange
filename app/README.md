This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Changelog

### 2025-02-17 - Solution Schema and Import Process Updates

#### Schema Changes
- Removed resource configuration fields (CPU, Memory, GPU, Storage) from solution schema
- Added optional GitHub source code URL field with database index
- Migration: `20250217165526_add_source_code_url`

#### Import Process Improvements
- Updated solution import schema to match new database structure
- Removed resource configuration requirement from import validation
- Added sourceCodeUrl support in bulk imports
- Updated sample import JSON format
- Improved error handling and validation messages

#### UI/UX Improvements
- Enhanced dark mode styling with gradient purple backgrounds for cards
- Improved text contrast in dark mode for better readability
- Added GitHub repository link button with icon
- Updated form fields for better visibility

#### Authentication Updates
- Temporarily disabled auth checks for development
- Direct access to bulk import functionality
- Simplified testing process

#### Documentation
- Updated schema documentation
- Added example JSON format for imports
- Documented authentication bypass for development
- Added technical implementation details

#### Technical Details
- Reset and migrated database to ensure clean state
- Updated all related components and APIs
- Added TypeScript types for new fields
- Improved error handling across the application
