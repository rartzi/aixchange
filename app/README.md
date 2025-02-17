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

### 2025-02-17 - UI Improvements and Feature Updates

#### UI/UX Improvements
- Enhanced dark mode styling with gradient purple backgrounds for cards
- Improved text contrast in dark mode for better readability
- Updated input field styling for better visibility in dark mode
- Consistent color scheme across all interactive elements

#### Schema Changes
- Removed resource configuration fields (CPU, Memory, GPU, Storage) from solution schema
- Added optional GitHub source code URL field
- Migration: `20250217131321_remove_resource_config_add_source_code`

#### New Features
- Added GitHub repository link support for solutions
- Enhanced category management with support for custom classifications
- Improved solution card layout with better responsive design

#### Technical Details
- Updated Prisma schema and generated new client
- Modified solution form components to reflect schema changes
- Enhanced dark mode theming with Tailwind CSS classes
- Added proper TypeScript types for new fields
