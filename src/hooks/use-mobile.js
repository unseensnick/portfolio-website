import * as React from "react";

// Mobile viewport breakpoint in pixels
const MOBILE_BREAKPOINT = 768;

/**
 * Hook that returns whether the current viewport is mobile width
 * Uses media query to detect viewport width < 768px
 */
export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(undefined);

    React.useEffect(() => {
        // Set up media query listener for mobile breakpoint
        const mql = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
        );
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return !!isMobile;
}
