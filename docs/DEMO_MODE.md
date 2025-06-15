# Demo Mode

This portfolio website includes a **Demo Mode** feature that allows you to showcase the website with comprehensive sample data instead of relying on PayloadCMS content. This is perfect for demonstrations, presentations, or when you want to show the website's capabilities without setting up the full CMS.

## 🎯 Use Cases

- **Portfolio Demonstrations**: Show potential clients or employers what the website looks like with real content
- **Development Testing**: Test the website's appearance and functionality with realistic data
- **Presentations**: Present the website without needing a live CMS connection
- **Quick Setup**: Get the website running immediately without database configuration

## 🚀 How to Enable Demo Mode

### Method 1: Environment Variable (Recommended for deployment)

1. **For Development:**

    ```bash
    # Create a .env.local file in your project root and add:
    NEXT_PUBLIC_DEMO_MODE=true
    ```

    **Windows Easy Method:** Create a file named `.env.local` in your project root with this content:

    ```
    NEXT_PUBLIC_DEMO_MODE=true
    ```

2. **For Production Deployment:**
   Set the environment variable in your hosting platform:
    ```
    NEXT_PUBLIC_DEMO_MODE=true
    ```

### Method 2: URL Parameter (Quick testing)

Add `?demo=true` to any URL:

```
http://localhost:3000?demo=true
https://yourwebsite.com?demo=true
```

### Method 3: NPM Scripts (Development convenience)

Use the pre-configured demo scripts:

```bash
# Start development server in demo mode
npm run demo

# Build for production in demo mode
npm run demo:build

# Start production server in demo mode
npm run demo:start
```

**Windows Alternative (if npm scripts don't work):**

```cmd
# For Windows Command Prompt
set NEXT_PUBLIC_DEMO_MODE=true && npm run dev

# For Windows PowerShell
$env:NEXT_PUBLIC_DEMO_MODE="true"; npm run dev
```

## 📊 Demo Data Features

The demo mode includes:

- **Complete Portfolio Content**: Professional developer profile with realistic information
- **Multiple Projects**: Featured project plus 3 additional projects with descriptions and tech stacks
- **Rich About Section**: Multi-paragraph bio, comprehensive technology list, and interests
- **Professional Contact Info**: Sample contact information and call-to-action
- **Realistic Navigation**: Proper logo, subtitle, and navigation structure

## 🎨 Visual Indicators

When demo mode is active, you'll see:

- A **blue "Demo Mode"** indicator in the top-right corner
- Console logs in development mode showing demo mode status

## 🔄 Priority Order

The system checks for demo mode in this order:

1. **Environment Variable** (`NEXT_PUBLIC_DEMO_MODE=true`) - highest priority
2. **URL Parameter** (`?demo=true`) - if environment variable is not set
3. **PayloadCMS Data** - if neither demo option is enabled
4. **Fallback Data** - if PayloadCMS is unavailable

## 🛠️ Customizing Demo Data

To customize the demo content:

1. Edit `src/lib/demo-data.ts`
2. Modify any section (nav, hero, about, projects, contact, footer)
3. The changes will be reflected immediately in demo mode

Example:

```typescript
// In src/lib/demo-data.ts
export const demoData: PortfolioData = {
    hero: {
        title: "Your Name Here",
        description: "Your custom description...",
        // ... other fields
    },
    // ... other sections
};
```

## 🚀 Deployment Examples

### Vercel

```bash
# Set environment variable in Vercel dashboard
NEXT_PUBLIC_DEMO_MODE=true
```

### Netlify

```bash
# In netlify.toml or dashboard
NEXT_PUBLIC_DEMO_MODE=true
```

### Docker

```dockerfile
ENV NEXT_PUBLIC_DEMO_MODE=true
```

## 🔧 Development Tips

1. **Testing Both Modes**: Use URL parameters to quickly switch between demo and real data during development
2. **Demo for Presentations**: Use `npm run demo` for client presentations
3. **Production Demos**: Deploy a separate demo version with `NEXT_PUBLIC_DEMO_MODE=true`
4. **Debugging**: Check browser console for demo mode status logs

## ❓ FAQ

**Q: Can I use demo mode in production?**
A: Yes! Demo mode is perfect for showcasing your portfolio template or for demonstration sites.

**Q: Will demo mode affect my PayloadCMS data?**
A: No, demo mode only changes what data is displayed. It doesn't modify your CMS content.

**Q: Can I have both draft mode and demo mode?**
A: Demo mode takes precedence over draft mode. If demo mode is enabled, it will be used regardless of draft mode settings.

**Q: How do I disable demo mode?**
A: Remove the environment variable or set it to `false`, and remove any `?demo=true` URL parameters.

## 🎉 Quick Start for Demos

For the fastest demo setup:

```bash
# Clone the repository
git clone [your-repo-url]
cd portfolio-website

# Install dependencies
npm install

# Start in demo mode (no database setup required!)
npm run demo
```

Your portfolio will be running at `http://localhost:3000` with beautiful demo content!
