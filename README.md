# Modern Portfolio Website

A sleek, responsive portfolio website built with Next.js and PayloadCMS for developers to showcase their skills and projects.

## Features

- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Dark/Light Mode**: Built-in theme switching with user preference detection
- **CMS Integration**: Edit all content through PayloadCMS admin panel
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
```

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
├── app/          # Next.js app router pages and API routes
├── components/   # Reusable React components
│   ├── shared/   # Common components used across sections
│   └── ui/       # Base UI components (buttons, cards, etc.)
├── collections/  # PayloadCMS collection definitions
├── hooks/        # Custom React hooks
├── lib/          # Utility functions and helpers
├── payload/      # PayloadCMS configuration
└── types/        # TypeScript type definitions
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

    - Click "Project" → "Add" → Name your project
    - Click "Production" → "Add New Resource"
    - Choose between "Public Repository", "Private Repository (with Github App)" or "Private Repository (with Deploy Key)"
    - If you choose Private Repository (with Github App) then select your github app
    - Then choose your repository and click "Load Repository"
    - Enter the branch you want to deploy and the port number (default is 3000) but you can change it if needed
    - Click "Continue"
    - Fill the "Domain" field with your domain name (e.g., `portfolio.example.com`)
    - Fill the "Ports Exposed" and "Ports Mappings" field with the same port number you entered earlier (default is 3000)
    - Optionally, you can set a custom name for the service under "Name"
    - Optionally, if you have environment variables, you can add them under "Environment Variables" by clicking "Add" and entering the key-value pairs
    - Click "Deploy" and the service will be created

3. **Configure environment variables**:

    - Add all variables from your `.env` file
    - Make sure to set `NODE_ENV=production`
    - Configure the database connection string to your production database

4. **Configure build settings**:

    - Build Command: `npm run build`
    - Start Command: `npm start`
    - Port: 3000

5. **Deploy**:

    - Click "Save & Deploy"
    - Coolify will build and deploy your application
    - Monitor the build logs for any issues

6. **Set up reverse proxy**:
    - Configure your domain to point to your Coolify server
    - Set up SSL certificates using Coolify's built-in tools

## License

MIT
