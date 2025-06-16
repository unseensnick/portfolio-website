# Modern Portfolio Website

Sleek, responsive portfolio website built with Next.js and PayloadCMS for developers to showcase their skills and projects.

## Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark/Light Mode**: Theme switching with user preference detection
- **CMS Integration**: Edit content through PayloadCMS admin panel
- **Live Preview**: Real-time content preview with device breakpoints
- **TypeScript**: Type-safe codebase with enhanced developer experience
- **Modular Components**: Reusable UI components with Tailwind CSS
- **Guided Tour**: Interactive tour system for demos and onboarding
- **Demo Mode**: Showcase mode with sample data

## Technology Stack

- [Next.js](https://nextjs.org) - React framework with App Router
- [PayloadCMS](https://payloadcms.com) - Headless CMS for content management
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [TypeScript](https://www.typescriptlang.org) - Static type checking
- [PostgreSQL](https://www.postgresql.org) - Database for CMS content

## Getting Started

### Environment Setup

Create a `.env` file:

```bash
PAYLOAD_SECRET=your-secret-key-change-me
DATABASE_URI=postgres://postgres:postgres@localhost/portfolio
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000

# Demo Mode (optional)
NEXT_PUBLIC_DEMO_MODE=false

# Email Configuration
EMAIL_FROM=noreply@yourportfolio.com
EMAIL_FROM_NAME=Portfolio Website
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

See documentation for detailed setup:

- [Email Configuration](./docs/email-setup.md)
- [Demo Mode Guide](./docs/DEMO_MODE.md)
- [Guided Tour Guide](./docs/GUIDED_TOUR.md)

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
# Access CMS at http://localhost:3000/admin
```

### Demo Mode

Enable guided tour and demo features:

```bash
# URL parameter
http://localhost:3000?demo=true

# NPM script
npm run demo
```

### Content Management

Edit website sections through PayloadCMS admin:

- **Navigation**: Logo, subtitle, navigation links
- **Hero**: Greeting, title, description, main image
- **Projects**: Featured project, project grid, technologies
- **About**: Bio paragraphs, skills, interests, profile image
- **Contact**: Email, GitHub, call-to-action text
- **Footer**: Copyright information

## Project Structure

```
src/
├── app/             # Next.js app router pages and API routes
│   ├── (frontend)/  # Main website pages
│   └── (payload)/   # PayloadCMS admin routes and API
├── components/      # Reusable React components
├── collections/     # PayloadCMS collection definitions
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and helpers
└── types/           # TypeScript type definitions
```

## Customization

- **Theme**: Modify colors in `src/app/(frontend)/styles.css`
- **Layout**: Adjust responsive breakpoints in useIsMobile hook
- **Components**: Extend components in the components directory
- **Content Model**: Update PayloadCMS collections for new fields

## Deployment

### Vercel

1. Connect your repository to [Vercel](https://vercel.com)
2. Set Framework Preset to "Next.js"
3. Add environment variables from your `.env` file
4. Deploy automatically

### Coolify

1. Set up [Coolify instance](https://coolify.io/)
2. Create new service and connect repository
3. Configure environment variables
4. Set port to 3000 and deploy

For detailed deployment instructions, see the full documentation in each platform's setup guide.
