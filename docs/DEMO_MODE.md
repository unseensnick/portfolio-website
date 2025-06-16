# Demo Mode

Showcase mode with comprehensive sample data instead of PayloadCMS content. Perfect for demonstrations, presentations, and quick setup without database configuration.

## Use Cases

- **Portfolio Demonstrations**: Show potential clients realistic content
- **Development Testing**: Test appearance with realistic data
- **Presentations**: Present without live CMS connection
- **Quick Setup**: Get running immediately without database

## Enable Demo Mode

### Environment Variable (Recommended)

```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=true
```

### URL Parameter (Quick Testing)

```bash
http://localhost:3000?demo=true
```

### NPM Scripts (Development)

```bash
npm run demo          # Start dev server in demo mode
npm run demo:build    # Build for production in demo mode
npm run demo:start    # Start production in demo mode
```

## Demo Data Features

- **Complete Portfolio Content**: Professional developer profile
- **Multiple Projects**: Featured project plus 3 additional projects
- **Rich About Section**: Multi-paragraph bio and comprehensive tech stack
- **Professional Contact**: Sample contact information
- **Realistic Navigation**: Proper logo, subtitle, and navigation

## Visual Indicators

When active, you'll see:

- **Blue "Demo Mode"** indicator in top-right corner
- Console logs in development showing demo status

## Priority Order

1. **Environment Variable** (`NEXT_PUBLIC_DEMO_MODE=true`) - highest priority
2. **URL Parameter** (`?demo=true`) - if environment not set
3. **PayloadCMS Data** - if neither demo option enabled
4. **Fallback Data** - if PayloadCMS unavailable

## Customization

Edit demo content in `src/lib/demo-data.ts`:

```typescript
export const demoData: PortfolioData = {
    hero: {
        title: "Your Name Here",
        description: "Your custom description...",
        // ... other fields
    },
    // ... other sections
};
```

## Deployment Examples

### Vercel

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

### Netlify

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

### Docker

```dockerfile
ENV NEXT_PUBLIC_DEMO_MODE=true
```

## Quick Start

```bash
# Clone repository
git clone [your-repo-url]
cd portfolio-website

# Install dependencies
npm install

# Start in demo mode (no database required!)
npm run demo
```

Your portfolio runs at `http://localhost:3000` with beautiful demo content!

## FAQ

**Q: Can I use demo mode in production?**
A: Yes! Perfect for showcasing your portfolio template.

**Q: Will demo mode affect my PayloadCMS data?**
A: No, demo mode only changes displayed data, not CMS content.

**Q: How do I disable demo mode?**
A: Remove the environment variable or set to `false`, and remove URL parameters.
