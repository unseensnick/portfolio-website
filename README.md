This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```bash
PAYLOAD_SECRET=your-secret-key-change-me
DATABASE_URI=postgres://postgres:postgres@localhost/portfolio
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
```

### Next.js Development Server

Run the Next.js development server:

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

### PayloadCMS Development Server

To run the PayloadCMS development server:

```bash
npm run payload:dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the PayloadCMS admin panel.

### Editing Portfolio Content

You can edit all sections of your portfolio through the PayloadCMS admin panel:

1. **Hero Section**: Edit the greeting, title, description, GitHub URL, and hero image
2. **Projects Section**: Edit the featured project, add/remove projects, and update project details
3. **About Section**: Edit your bio paragraphs, technologies, interests, and about image
4. **Contact Section**: Edit contact information, email, GitHub, and call-to-action text
5. **Site Header**: Edit the logo, subtitle, and navigation links
6. **Footer**: Edit the copyright text

After making changes in the admin panel, they will automatically appear on your website.

### Generate Types

To generate TypeScript types from your PayloadCMS collections:

```bash
npm run payload:generate:types
```

## Project Structure

- `src/app`: Next.js application
- `src/components`: React components
- `src/collections`: PayloadCMS collections
- `src/data`: Default data for the portfolio (used as fallback)
- `src/lib`: Utility functions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

For PayloadCMS:

- [PayloadCMS Documentation](https://payloadcms.com/docs) - learn about PayloadCMS features and API.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
