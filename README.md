# Modern Portfolio Website

A sleek, responsive portfolio website built with Next.js and PayloadCMS for developers to showcase their skills and projects.

## Features

- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Dark/Light Mode**: Built-in theme switching with user preference detection
- **CMS Integration**: Edit all content through PayloadCMS admin panel
- **Live Preview**: Real-time content preview with multiple device breakpoints in the admin panel
- **TypeScript**: Type-safe codebase with enhanced developer experience
- **Modular Components**: Reusable UI components with Tailwind CSS
- **Animation Effects**: Subtle animations and transitions for modern UX

## Technology Stack

- [Next.js](https://nextjs.org) - React framework with App Router
- [PayloadCMS](https://payloadcms.com) - Headless CMS for content management
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Component library for styled components
- [TypeScript](https://www.typescriptlang.org) - Static type checking
- [PostgreSQL](https://www.postgresql.org) - Database for CMS content

## Getting Started

### Environment Setup

Create a `.env` file in the root directory:

```bash
PAYLOAD_SECRET=your-secret-key-change-me
DATABASE_URI=postgres://postgres:postgres@localhost/portfolio
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000

# Email Configuration (for password resets and notifications)
EMAIL_FROM=noreply@yourportfolio.com
EMAIL_FROM_NAME=Portfolio Website
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

For detailed email setup instructions, see [Email Configuration](./docs/email-setup.md).

### Development

1. Install dependencies:

    ```bash
    npm install
    ```

2. Start the development server:

    ```bash
    npm run dev
    ```

3. Open [http://localhost:3000](http://localhost:3000) to view the website
4. Access the CMS at [http://localhost:3000/admin](http://localhost:3000/admin)

### Content Management

Edit all website sections through the PayloadCMS admin panel:

- **Navigation**: Logo, subtitle, and navigation links
- **Hero**: Greeting, title, description, and main image
- **Projects**: Featured project, project grid, and technologies
- **About**: Bio paragraphs, skills, interests, and profile image
- **Contact**: Email, GitHub, and call-to-action text
- **Footer**: Copyright information

## Project Structure

```
src/
├── app/             # Next.js app router pages and API routes
│   ├── (frontend)/  # Main website pages using frontend layout
│   └── (payload)/   # PayloadCMS admin routes and API
├── components/      # Reusable React components (flattened structure)
├── collections/     # PayloadCMS collection definitions
│   ├── Media.ts     # Media collection for images and files
│   ├── Portfolio.ts # Portfolio content collection
│   └── Users.ts     # User authentication collection
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and helpers
└── types/           # TypeScript type definitions
```

## Customization

- **Theme**: Modify colors in `src/app/(frontend)/styles.css`
- **Layout**: Adjust responsive breakpoints in the useIsMobile hook
- **Components**: Extend or modify components in the components directory
- **Content Model**: Update PayloadCMS collections to add new fields

## Deployment

### Vercel Deployment

1. **Connect your repository**:

    - Create a [Vercel account](https://vercel.com/signup) if you don't have one
    - Go to the [Vercel dashboard](https://vercel.com/dashboard)
    - Click "Add New" → "Project"
    - Import your GitHub/GitLab/Bitbucket repository

2. **Configure project settings**:

    - Set the Framework Preset to "Next.js"
    - Add environment variables from your `.env` file
    - Configure the build settings:
        - Build Command: `npm run build`
        - Output Directory: `.next`

3. **Deploy**:

    - Click "Deploy"
    - Vercel will build and deploy your project automatically
    - Once deployed, you'll get a production URL

4. **Connect custom domain** (optional):
    - From your project dashboard, go to "Settings" → "Domains"
    - Add your custom domain and follow verification steps

### Coolify Deployment

1. **Setup Coolify server**:

    - Set up a [Coolify instance](https://coolify.io/) on your server
    - Login to your Coolify dashboard

2. **Create a new service**:

    - Navigate to your Coolify dashboard
    - Click "Project" → "Add" and give your project a name
    - Select "Production" → "Add New Resource"
    - Select repository access type:
        - "Public Repository" (for open source projects)
        - "Private Repository with Github App" (requires Github App setup)
        - "Private Repository with Deploy Key" (manual SSH key setup)
    - For Github App option: select your connected Github App
    - Select your repository and click "Load Repository"
    - Configure deployment settings:
        - Branch: Select the branch to deploy (e.g., "main")
        - Port: Enter the port number (default: 3000)
    - Click "Continue"
    - Configure service settings:
        - Domain: Enter your domain (e.g., `portfolio.example.com`)
        - Ports: Set both "Exposed" and "Mappings" to match your port (e.g., 3000)
        - Name: (Optional) Set a custom service name
        - Environment Variables: (Optional) Add your .env variables
    - Click "Deploy" to create and deploy your service

3. **Configure environment variables**:

    - Add all variables from your `.env` file are added in the "Production Environment Variables"
    - Configure the database connection string to your production database
