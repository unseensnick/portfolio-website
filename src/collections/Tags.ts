import type { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
    slug: "tags",
    admin: {
        useAsTitle: "name",
        defaultColumns: ["name", "category", "updatedAt"],
    },
    access: {
        read: () => true, // Allow public reading for frontend access
        create: ({ req }) => !!req.user, // Only authenticated users can create
        update: ({ req }) => !!req.user, // Only authenticated users can update
        delete: ({ req }) => !!req.user, // Only authenticated users can delete
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
            unique: true,
            label: "Tag Name",
            admin: {
                description: "The name of the technology, skill, or interest (e.g., 'React', 'UI Design', 'Photography')",
            },
        },
        {
            name: "category",
            type: "select",
            required: true,
            label: "Category",
            options: [
                {
                    label: "Technology & Tools",
                    value: "technology & tools",
                },
                {
                    label: "Hobbies",
                    value: "hobbies",
                },
            ],
            admin: {
                description: "Categorize this tag to organize how it's used across your portfolio",
            },
        },
        {
            name: "description",
            type: "textarea",
            label: "Description (Optional)",
            admin: {
                description: "Optional description or notes about this tag for your reference",
                placeholder: "e.g., Frontend JavaScript framework, Design methodology, Outdoor activity...",
            },
        },
        {
            name: "color",
            type: "select",
            label: "Display Color (Optional)",
            options: [
                { label: "Default", value: "default" },
                { label: "Blue", value: "blue" },
                { label: "Green", value: "green" },
                { label: "Purple", value: "purple" },
                { label: "Orange", value: "orange" },
                { label: "Red", value: "red" },
                { label: "Yellow", value: "yellow" },
                { label: "Pink", value: "pink" },
            ],
            defaultValue: "default",
            admin: {
                description: "Optional color theme for displaying this tag on your portfolio",
            },
        },
    ],
};