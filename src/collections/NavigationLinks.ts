import type { CollectionConfig } from "payload";

export const NavigationLinks: CollectionConfig = {
    slug: "navigationLinks",
    admin: {
        useAsTitle: "label",
        defaultColumns: ["label", "href", "category", "order", "updatedAt"],
    },
    access: {
        read: () => true, // Allow public reading for frontend access
        create: ({ req }) => !!req.user, // Only authenticated users can create
        update: ({ req }) => !!req.user, // Only authenticated users can update
        delete: ({ req }) => !!req.user, // Only authenticated users can delete
    },
    fields: [
        {
            name: "label",
            type: "text",
            required: true,
            label: "Link Text",
            admin: {
                description: "Text to display for this navigation link (e.g., 'About', 'Projects', 'Contact')",
            },
        },
        {
            name: "href",
            type: "text",
            required: true,
            label: "Link URL",
            admin: {
                description: "URL or anchor link (e.g., '#about', '/contact', 'https://github.com/username')",
                placeholder: "#about",
            },
        },
        {
            name: "category",
            type: "select",
            required: true,
            label: "Link Category",
            options: [
                {
                    label: "Main Navigation",
                    value: "main",
                },
                {
                    label: "Social Links",
                    value: "social",
                },
            ],
            defaultValue: "main",
            admin: {
                description: "Categorize this link to organize how it's used across your portfolio",
            },
        },
        {
            name: "icon",
            type: "text",
            label: "Icon Name (Optional)",
            admin: {
                description: "Optional icon name from Lucide icons library (e.g., 'user', 'github', 'mail')",
                placeholder: "user",
            },
        },
        {
            name: "order",
            type: "number",
            label: "Display Order",
            defaultValue: 0,
            admin: {
                description: "Order in which this link appears in navigation (lower numbers appear first)",
            },
        },
        {
            name: "external",
            type: "checkbox",
            label: "External Link",
            defaultValue: false,
            admin: {
                description: "Check if this link opens in a new tab (for external URLs)",
            },
        },
        {
            name: "description",
            type: "textarea",
            label: "Description (Optional)",
            admin: {
                description: "Optional description or notes about this link for your reference",
                placeholder: "e.g., Links to my GitHub profile, Contact form page...",
            },
        },
    ],
};