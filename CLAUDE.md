# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (includes PayloadCMS admin at /admin)
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run generate:types` - **CRITICAL**: Generate TypeScript types from PayloadCMS schema (run after any collection changes)
- `npm run demo` - Start in demo mode with sample data and guided tour
- `npm run demo:build` - Build in demo mode

## Architecture Overview

### Core Stack Integration
This is a **hybrid Next.js + PayloadCMS application** where PayloadCMS serves as both a headless CMS and provides admin UI. The frontend and CMS are tightly integrated in a single codebase.

### Data Flow Architecture
1. **PayloadCMS Collections** define content schema in `src/collections/`
2. **Type Generation**: `npm run generate:types` creates `src/payload-types.ts` from collections
3. **Data Fetching**: `getPortfolioData()` in `src/lib/payload-utils.ts` fetches from PayloadCMS API
4. **Data Transformation**: Raw PayloadCMS data is adapted to component-friendly format
5. **Component Rendering**: Frontend components receive typed, transformed data

### PayloadCMS Integration Patterns

#### Collection Architecture
- **Portfolio.ts**: Main content collection with grouped sections (nav, hero, projects, about, contact, footer)
- **NavigationLinks.ts**: Reusable navigation links with categories (main, social)
- **Tags.ts**: Categorized tags (technology & tools, hobbies) used across sections
- **Media.ts**: File uploads with UploadThing integration
- **Users.ts**: Admin authentication

#### Media Field Factory Pattern
The codebase uses **factory functions** to reduce duplication in media control fields:
- `src/lib/mediaFieldHelpers.ts` contains reusable field generators
- `createSingleMediaGroup()` - For single images (hero, about) with collapsible controls
- `createArrayMediaFields()` - For project media arrays
- All media controls include: upload, position, aspect ratio, zoom, fine positioning

#### Live Preview System
- Configured in `src/payload.config.ts` with device breakpoints
- Uses PayloadCMS draft system: `?draft=true` query parameter
- Frontend automatically handles draft vs published content
- Fast autosave (375ms) for responsive preview experience

### Frontend Architecture

#### App Router Structure
```
src/app/
├── (frontend)/          # Public website (grouped route)
│   ├── page.tsx        # Main portfolio page (renders all sections)
│   └── layout.tsx      # Site layout with theme provider
└── (payload)/          # PayloadCMS routes (grouped route)
    ├── admin/          # Admin panel integration
    └── api/            # Auto-generated API routes
```

#### Component Organization
- **Section Components**: `src/components/{hero,projects,about,contact}.tsx` - Main page sections
- **Shared Components**: `src/components/shared/` - Reusable UI elements
- **Base Components**: `src/components/ui/` - shadcn/ui components
- **Feature Components**: Navigation, demo mode, mobile wrapper, etc.

#### State Management
- **Theme**: next-themes for dark/light mode with system preference
- **Demo Mode**: Environment/URL-based toggle with guided tour integration
- **No Global State**: Data flows from server → page → components (server-side rendering)

### Key Integration Points

#### Type Safety Flow
1. Collections define schema → 2. `generate:types` creates TypeScript → 3. Components use typed interfaces
2. Always run `npm run generate:types` after collection changes
3. Type conflicts indicate schema changes need frontend updates

#### Media Processing Pipeline
1. **Upload**: UploadThing handles file storage
2. **Admin**: PayloadCMS provides upload UI with position/zoom controls
3. **Frontend**: `safelyExtractImageUrl()` safely extracts URLs with fallbacks
4. **Rendering**: Components handle aspect ratios, positioning, and responsive display

#### Demo Mode System
- `NEXT_PUBLIC_DEMO_MODE=true` or `?demo=true` URL parameter
- Enables guided tour (driver.js) and demo indicators
- Controlled by `src/lib/demo-utils.ts`
- Useful for showcasing features without real content

### PayloadCMS Configuration Patterns

#### Access Control
- Public read access for published content
- Draft access for live preview (no auth required for preview)
- Admin authentication required for CMS operations

#### Field Organization
- **Groups**: Related fields grouped logically (nav, hero, projects, etc.)
- **Relationships**: Links between collections (navigationLinks, tags)
- **Conditional Fields**: Media controls appear only when images uploaded
- **Collapsible**: Complex field groups start collapsed for better UX

#### Live Preview Configuration
- Breakpoints: Mobile (375px), Tablet (768px), Desktop (1440px)
- URL generation: `/?draft=true` for all collections
- Collections: `['portfolio']` enabled for preview

### Development Workflow

#### Content Changes
1. Edit schema in `src/collections/`
2. Run `npm run generate:types`
3. Update components if types changed
4. Test in admin panel with live preview

#### Component Development
1. Components receive typed data from `getPortfolioData()`
2. Use `src/types/portfolio.ts` for component prop types
3. Handle loading states and fallbacks gracefully
4. Test with both real and demo data

#### Media Field Development
1. Use existing factory functions from `mediaFieldHelpers.ts`
2. Follow collapsible pattern for complex controls
3. Include conditional display logic
4. Test position, zoom, and aspect ratio controls

### PayloadCMS Documentation

**Important**: This project includes comprehensive PayloadCMS documentation at `docs/payloadCMS/`. Reference these docs when:
- Making changes to collections or fields
- Implementing new PayloadCMS features
- Troubleshooting CMS functionality
- Refreshing memory on PayloadCMS concepts

Key documentation sections:
- `01-configuration/` - Configuration and setup
- `04-collections-and-data/01-fields/` - Field types and patterns
- `04-collections-and-data/02-hooks/` - Collection and field hooks
- `05-content-features/03-live-preview.md` - Live preview implementation
- `05-content-features/02-uploads-and-file-storage.md` - Media handling
- `07-security/01-access-control.md` - Access control patterns

### Critical Files for Understanding

- `src/payload.config.ts` - PayloadCMS configuration and live preview setup
- `src/collections/Portfolio.ts` - Main content schema with media field patterns
- `src/lib/payload-utils.ts` - Data fetching and transformation logic
- `src/lib/mediaFieldHelpers.ts` - Reusable field factory functions
- `src/app/(frontend)/page.tsx` - Main page composition and data flow
- `src/types/portfolio.ts` - Frontend data type definitions

### Environment Variables

Required for development:
- `PAYLOAD_SECRET` - PayloadCMS security key
- `DATABASE_URI` - PostgreSQL connection string
- `NEXT_PUBLIC_PAYLOAD_URL` - Base URL for live preview (usually http://localhost:3000)
- `UPLOADTHING_TOKEN` - File upload service token

Optional:
- `NEXT_PUBLIC_DEMO_MODE` - Enable demo mode globally
- Email configuration (SMTP_*) for contact forms