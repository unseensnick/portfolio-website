import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for combining CSS class names with Tailwind optimizations
 *
 * @param inputs - Any number of class name arguments (strings, objects, arrays)
 * @returns A single merged class string with Tailwind conflicts resolved
 *
 * Features:
 * - Combines multiple class sources (like conditional classes)
 * - Resolves Tailwind conflicts by keeping the last one
 * - Handles arrays, objects with boolean values, and nested structures
 *
 * Example:
 * ```
 * cn(
 *   "text-red-500",
 *   isMobile && "text-sm",
 *   isActive && "bg-blue-500"
 * )
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
