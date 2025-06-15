# Guided Tour

This portfolio website includes a **Guided Tour** feature powered by [driver.js](https://driverjs.com/) that provides interactive walkthroughs of the website's features. The tour is perfect for user onboarding, demonstrations, and creating showcase videos.

## 🎯 Features

- **Interactive Highlighting**: Highlights specific sections with smooth animations
- **Informative Popovers**: Contextual information about each section
- **Automated Mode**: Perfect for creating showcase videos
- **Manual Mode**: User-controlled tour with navigation buttons
- **Responsive Design**: Works seamlessly on all devices
- **Progress Tracking**: Shows current step and total steps
- **Keyboard Navigation**: Arrow keys and ESC support

## 🚀 Tour Modes

### 1. Manual Tour (Interactive)

- User controls the pace with Next/Previous buttons
- Can be paused or stopped at any time
- Perfect for user onboarding
- Shows progress indicator

### 2. Automated Tour (Demo)

- Automatically progresses through all steps
- Configurable timing (default: 4 seconds per step)
- Perfect for showcase videos and presentations
- No user interaction required

## 🎮 How to Access Tour Controls

### Development Mode

Tour controls are automatically visible in development mode:

```bash
npm run dev
```

Look for the floating buttons in the bottom-right corner.

### Production Mode

Add `?tour=true` to any URL to show tour controls:

```
https://yourwebsite.com?tour=true
```

### Tour Control Buttons

- **Start Tour**: Begin interactive manual tour
- **Auto Demo**: Start automated tour (3 seconds per step)
- **Reset**: Clear tour completion status

## 📋 Tour Steps

The guided tour covers these sections in order:

1. **Hero Section** - Introduction and main call-to-action
2. **CTA Buttons** - GitHub and Projects navigation
3. **Main Header Navigation** - Site navigation and responsive design
4. **Desktop Navigation Menu** - Smooth scrolling links with active states
5. **Theme Toggle** - Dark/light mode switching functionality
6. **Section Navigation Dots** - Right-side dot navigation with tooltips
7. **Instagram-Style Mobile Navigation** - Interactive browser resize demonstration for mobile navigation
8. **Projects Showcase** - Featured project and portfolio grid overview
9. **Featured Project** - Highlighted main project with detailed display
10. **Project Grid** - Additional projects in responsive layout
11. **About Section** - Personal background and skills overview
12. **Personal Story** - Professional journey and experience
13. **Technology Stack** - Skills and tools showcase with interactive badges
14. **Personal Interests** - Interests and passions outside of work
15. **Contact Section** - Contact information and connection options
16. **Footer** - Site completion and copyright information

### Special Features

- **Browser Resize Detection**: The tour automatically detects when you resize your browser window to demonstrate responsive features
- **Mobile Navigation Demo**: Step 7 pauses the tour and instructs you to resize your browser to ≤765px to see the mobile navigation, then automatically continues when the resize is detected
- **Responsive Adaptation**: All tour steps automatically adapt to different screen sizes for optimal viewing

## 🛠️ Customization

### Modifying Tour Content

Edit the tour steps in `src/lib/guided-tour.ts`:

```typescript
const tourSteps = [
    {
        element: '[data-tour="hero-section"]',
        popover: {
            title: "Your Custom Title",
            description: "Your custom description...",
            side: "bottom" as const,
            align: "center" as const,
        },
    },
    // ... more steps
];
```

### Adjusting Timing

Change the automated tour timing:

```typescript
// In tour-controls.tsx
const driverObj = tourControls.startAutomated(5000); // 5 seconds per step
```

### Adding New Tour Steps

1. Add `data-tour="your-element"` attribute to your component
2. Add a new step to the `tourSteps` array in `guided-tour.ts`
3. Configure the popover content and positioning

Example:

```tsx
// In your component
<div data-tour="new-section">Your content</div>

// In guided-tour.ts
{
    element: '[data-tour="new-section"]',
    popover: {
        title: 'New Section',
        description: 'Description of this new section...',
        side: 'top' as const,
        align: 'center' as const,
    }
}
```

## 🎨 Styling

### Custom CSS Classes

The tour uses these CSS classes that you can customize:

```css
/* Main tour overlay */
.driver-overlay {
    background: rgba(0, 0, 0, 0.7);
}

/* Highlighted element */
.driver-highlighted-element {
    border-radius: 8px;
}

/* Popover container */
.tour-popover {
    /* Your custom styles */
}
```

### Popover Positioning

Available positions:

- `side`: `'top'`, `'bottom'`, `'left'`, `'right'`
- `align`: `'start'`, `'center'`, `'end'`

## 📱 Responsive Behavior

The tour automatically adapts to different screen sizes:

- **Mobile**: Optimized popover positioning and sizing
- **Tablet**: Balanced layout for touch interaction
- **Desktop**: Full feature set with keyboard navigation

## 🎬 Creating Showcase Videos

### Automated Tour for Videos

1. **Start Recording**: Begin screen recording
2. **Load Page**: Navigate to your portfolio
3. **Start Auto Demo**: Click "Auto Demo" button or use URL parameter
4. **Let it Run**: The tour will automatically progress through all sections
5. **Stop Recording**: Tour completes automatically

### URL Parameters for Videos

```
# Start with demo mode and tour controls
https://yourwebsite.com?demo=true&tour=true

# Then click "Auto Demo" to begin automated tour
```

### Timing Recommendations

- **Quick Overview**: 2-3 seconds per step
- **Detailed Showcase**: 4-5 seconds per step
- **Presentation**: 6-8 seconds per step

## 🔧 Development Tips

### Testing Tours

```typescript
// Reset tour status for testing
tourControls.reset();

// Check if tour should show
const shouldShow = tourControls.shouldShow();

// Start specific tour mode
tourControls.start(); // Manual
tourControls.startAutomated(3000); // Automated
```

### Debugging

Tour events are logged to console in development:

```
[Tour] Highlighted step: Welcome to My Portfolio
[Tour] Deselected step: Welcome to My Portfolio
[Tour] Automated tour completed
```

### Adding Tour to New Components

1. Add the data attribute:

    ```tsx
    <section data-tour="my-section">
    ```

2. Update the tour steps array
3. Test the positioning and content

## 🚀 Production Deployment

### Environment Variables

No additional environment variables needed. Tour controls show based on:

- Development mode (automatic)
- URL parameter `?tour=true` (manual)

### Performance

The tour library is only loaded when needed:

- Lazy loaded on first tour start
- Minimal bundle size impact
- No performance impact when not in use

## 📖 API Reference

### Tour Controls

```typescript
import { tourControls } from "@/lib/guided-tour";

// Start manual tour
tourControls.start();

// Start automated tour (optional duration in ms)
tourControls.startAutomated(4000);

// Reset tour status
tourControls.reset();

// Check if tour should show
tourControls.shouldShow();

// Mark tour as seen
tourControls.markSeen();
```

### Tour Configuration

```typescript
interface TourStep {
    element: string; // CSS selector
    popover: {
        title: string; // Step title
        description: string; // Step description
        side: "top" | "bottom" | "left" | "right";
        align: "start" | "center" | "end";
    };
}
```

## ❓ FAQ

**Q: Can I disable the tour for certain users?**
A: Yes, the tour respects localStorage. Once completed, it won't show again unless reset.

**Q: How do I change the tour timing?**
A: Modify the `stepDuration` parameter in the `startAutomatedTour` function.

**Q: Can I add custom animations?**
A: Yes, driver.js supports custom CSS animations. Add them to your stylesheet.

**Q: Does the tour work on mobile?**
A: Yes, the tour is fully responsive and optimized for touch devices.

**Q: How do I create a tour for a specific user flow?**
A: Create a new tour configuration with different steps and selectors.

## 🎉 Quick Start

1. **Development**: Tour controls appear automatically
2. **Click "Start Tour"**: Begin interactive walkthrough
3. **Click "Auto Demo"**: Perfect for screen recording
4. **Customize**: Edit `src/lib/guided-tour.ts` for your needs

The guided tour makes your portfolio more engaging and helps visitors understand all the features you've built! 🚀
