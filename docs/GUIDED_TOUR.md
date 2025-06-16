# Guided Tour

Interactive tour system powered by [driver.js](https://driverjs.com/) for user onboarding and showcase videos.

## Features

- **Interactive Highlighting**: Smooth animations and contextual information
- **Dual Tour Modes**: Manual (user-controlled) and automated (video-ready)
- **Mobile Navigation Demo**: Special mobile step with responsive timing
- **Progress Tracking**: Step counter and keyboard navigation
- **Responsive Design**: Optimized for all device sizes

## Tour Modes

### Manual Tour (Interactive)

- User controls progression with Next/Previous buttons
- Mobile navigation step: 4-second demo when user clicks "Next"
- Perfect for user onboarding and exploration

### Automated Tour (Showcase)

- Auto-progresses through all steps (default: 4 seconds per step)
- Mobile navigation step: 3-second demo with seamless continuation
- Ideal for screen recordings and presentations

## Access Methods

### Demo Mode

Enable tour controls in production:

```bash
# URL parameter
https://yoursite.com?demo=true

# Environment variable
NEXT_PUBLIC_DEMO_MODE=true

# NPM script
npm run demo
```

## Tour Steps

1. **Hero Section** - Main introduction and call-to-action
2. **CTA Buttons** - GitHub and Projects navigation
3. **Header Navigation** - Site navigation and responsive design
4. **Desktop Menu** - Smooth scrolling links with active states
5. **Theme Toggle** - Dark/light mode switching
6. **Section Navigation** - Right-side dot navigation with tooltips
7. **Mobile Navigation** - Interactive mobile demo with timing
8. **Projects Showcase** - Featured project and grid overview
9. **Featured Project** - Main project highlight
10. **Project Grid** - Additional projects layout
11. **About Section** - Personal background and skills
12. **Personal Story** - Professional journey
13. **Technology Stack** - Interactive skills showcase
14. **Personal Interests** - Hobbies and passions
15. **Contact Section** - Connection information
16. **Footer** - Site completion

## Customization

### Tour Content

Edit steps in `src/lib/guided-tour.ts`:

```typescript
const tourSteps = [
    {
        element: '[data-tour="your-element"]',
        popover: {
            title: "Step Title",
            description: "Step description...",
            side: "bottom" as const,
            align: "center" as const,
        },
    },
];
```

### Timing Configuration

```typescript
// Automated tour timing
tourControls.startAutomated(5000); // 5 seconds per step
```

### Adding New Steps

1. Add `data-tour="element-name"` to your component
2. Add step configuration to `tourSteps` array
3. Test positioning and content

## API Reference

```typescript
import { tourControls } from "@/lib/guided-tour";

// Start manual tour
tourControls.start();

// Start automated tour with custom timing
tourControls.startAutomated(4000);

// Reset tour status
tourControls.reset();

// Check if tour should show
tourControls.shouldShow();
```

## Video Creation

### Automated Tour Setup

1. Start screen recording
2. Navigate to `?demo=true`
3. Click "Auto Demo" button
4. Tour runs automatically through all steps
5. Stop recording when complete

### Timing Recommendations

- **Quick Overview**: 2-3 seconds per step
- **Detailed Showcase**: 4-5 seconds per step
- **Presentation**: 6-8 seconds per step

## Development

### Testing

```typescript
// Reset for testing
tourControls.reset();

// Check demo mode
tourControls.isDemoMode();
```

### Debugging

Tour events are logged in development mode for troubleshooting.

### Performance

- Lazy loaded on first use
- Minimal bundle impact
- No performance cost when inactive

The guided tour enhances user engagement and showcases your portfolio's features effectively.
