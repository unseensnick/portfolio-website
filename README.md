# Portfolio Website

A modern, responsive portfolio website built with Next.js, featuring a clean design and responsive layout for showcasing work and skills.

## Features

-   **Responsive Design** - Optimized for desktop and mobile with dedicated layouts
-   **Dark/Light Mode** - Theme switching with system preference detection
-   **Modern UI** - Clean, accessible interface with smooth animations
-   **Component-Based** - Modular architecture for easy customization
-   **Section Navigation** - Easy scrolling between portfolio sections
-   **Dynamic Content** - Data-driven content management from `src/data/portfolio.js`

## Project Structure

```
src/
├── app/               # Next.js app router files
├── components/        # Reusable UI components
│   ├── ui/            # Base UI components
│   └── ...            # Feature components (hero, projects, etc.)
├── data/              # Portfolio content and configuration
├── hooks/             # Custom React hooks
└── lib/               # Utility functions and helpers
```

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customization

To customize the portfolio content, edit the data files in `src/data/` directory. The main configuration is in `portfolio.js`.

### Styling

The project uses Tailwind CSS for styling. Customize the theme in `components.json` and `global.css`.

## Technology Stack

-   [Next.js](https://nextjs.org/) - React framework
-   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
-   [Lucide Icons](https://lucide.dev/) - SVG icon library
-   [Radix UI](https://www.radix-ui.com/) - Headless UI components

## Deployment

The site can be easily deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fportfolio-website)

## License

MIT
