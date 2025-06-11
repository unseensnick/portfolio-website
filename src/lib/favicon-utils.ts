/**
 * Server-side SVG generation that matches your HexagonLogo component exactly
 */
export function generateHexagonFaviconSVG({
    size = 32,
    primaryColor = "#7c3aed",
    backgroundColor = "#ffffff",
    textColor,
}: {
    size?: number;
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
} = {}): string {
    const finalTextColor = textColor || primaryColor;
    const fontSize = size * 0.3;
    const insetAmount = size * 0.125; // Matches inset-1 from HexagonLogo
    
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="hexagon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${primaryColor}"/>
            <stop offset="100%" style="stop-color:${primaryColor}cc"/>
        </linearGradient>
    </defs>
    
    <polygon 
        points="${size/2},0 ${size},${size*0.25} ${size},${size*0.75} ${size/2},${size} 0,${size*0.75} 0,${size*0.25}"
        fill="url(#hexagon-gradient)"
    />
    
    <polygon 
        points="${size/2},${insetAmount} ${size-insetAmount},${size*0.25+insetAmount*0.5} ${size-insetAmount},${size*0.75-insetAmount*0.5} ${size/2},${size-insetAmount} ${insetAmount},${size*0.75-insetAmount*0.5} ${insetAmount},${size*0.25+insetAmount*0.5}"
        fill="${backgroundColor}"
    />
    
    <text 
        x="${size/2}" 
        y="${size/2}" 
        text-anchor="middle" 
        dominant-baseline="central"
        font-family="monospace"
        font-weight="bold"
        font-size="${fontSize}"
        fill="${finalTextColor}"
    >&lt;/&gt;</text>
</svg>`.replace(/\s+/g, ' ').trim();
}

/**
 * Generate base64 data URL for favicon
 */
export function generateFaviconDataURL(size: number = 32): string {
    const svg = generateHexagonFaviconSVG({ 
        size,
        primaryColor: "#7c3aed",
        backgroundColor: "#ffffff",
        textColor: "#7c3aed"
    });
    
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Complete favicon metadata for Next.js
 */
export function generateFaviconMetadata() {
    const faviconSvg = generateHexagonFaviconSVG({ 
        size: 32,
        primaryColor: "#7c3aed",
        backgroundColor: "#ffffff"
    });
    
    const faviconDataUrl = `data:image/svg+xml;base64,${Buffer.from(faviconSvg).toString('base64')}`;

    return {
        icon: [
            {
                url: faviconDataUrl,
                type: 'image/svg+xml',
                sizes: 'any',
            },
            {
                url: faviconDataUrl,
                type: 'image/svg+xml',
                sizes: '16x16',
            },
            {
                url: faviconDataUrl,
                type: 'image/svg+xml', 
                sizes: '32x32',
            },
        ],
        apple: [
            {
                url: faviconDataUrl,
                type: 'image/svg+xml',
                sizes: '180x180',
            },
        ],
        other: [
            {
                rel: 'mask-icon',
                url: faviconDataUrl,
                color: '#7c3aed',
            },
        ],
    };
}

/**
 * Dark mode favicon variant
 */
export function generateDarkModeFavicon(size: number = 32): string {
    return generateHexagonFaviconSVG({
        size,
        primaryColor: "#7c3aed",
        backgroundColor: "#0a0a0a",
        textColor: "#7c3aed"
    });
}

/**
 * Theme-aware favicon metadata (advanced)
 */
export function generateThemeAwareFaviconMetadata() {
    const lightFaviconSvg = generateHexagonFaviconSVG({ 
        size: 32,
        primaryColor: "#7c3aed",
        backgroundColor: "#ffffff"
    });
    
    const darkFaviconSvg = generateHexagonFaviconSVG({ 
        size: 32,
        primaryColor: "#7c3aed",
        backgroundColor: "#0a0a0a"
    });
    
    const lightDataUrl = `data:image/svg+xml;base64,${Buffer.from(lightFaviconSvg).toString('base64')}`;
    const darkDataUrl = `data:image/svg+xml;base64,${Buffer.from(darkFaviconSvg).toString('base64')}`;

    return {
        icon: [
            {
                url: lightDataUrl,
                type: 'image/svg+xml',
                sizes: 'any',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: darkDataUrl,
                type: 'image/svg+xml',
                sizes: 'any',
                media: '(prefers-color-scheme: dark)',
            },
        ],
        apple: [
            {
                url: lightDataUrl,
                type: 'image/svg+xml',
                sizes: '180x180',
            },
        ],
        other: [
            {
                rel: 'mask-icon',
                url: lightDataUrl,
                color: '#7c3aed',
            },
        ],
    };
}

export const FaviconSizes = {
    small: 16,
    medium: 32,
    large: 48,
    apple: 180,
    android: 192,
    androidLarge: 512,
} as const;

/**
 * Generate multiple favicon sizes
 */
export function generateAllFaviconSizes() {
    return Object.entries(FaviconSizes).map(([key, size]) => ({
        size,
        name: key,
        svg: generateHexagonFaviconSVG({ size }),
        dataUrl: generateFaviconDataURL(size),
    }));
}