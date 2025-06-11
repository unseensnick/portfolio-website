import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines CSS classes with Tailwind conflict resolution
 * 
 * Merges multiple class sources and resolves Tailwind conflicts
 * by keeping the last conflicting class.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}