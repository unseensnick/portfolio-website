import type { CollectionConfig } from "payload";

export const Portfolio: CollectionConfig = {
    slug: "portfolio",
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "updatedAt"],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
            defaultValue: "Portfolio",
        },
        {
            name: "nav",
            type: "group",
            fields: [
                {
                    name: "logo",
                    type: "text",
                    required: true,
                    defaultValue: "unseensnick",
                },
                {
                    name: "subtitle",
                    type: "text",
                    required: true,
                    defaultValue: "Full Stack Developer",
                },
                {
                    name: "links",
                    type: "array",
                    fields: [
                        {
                            name: "href",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "label",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "icon",
                            type: "text",
                        },
                    ],
                },
            ],
        },
        {
            name: "hero",
            type: "group",
            fields: [
                {
                    name: "greeting",
                    type: "text",
                    required: true,
                    defaultValue: "Hello There!",
                },
                {
                    name: "title",
                    type: "text",
                    required: true,
                    defaultValue: "Full Stack Developer",
                },
                {
                    name: "description",
                    type: "textarea",
                    required: true,
                },
                {
                    name: "githubUrl",
                    type: "text",
                    required: true,
                    defaultValue: "https://github.com/unseensnick",
                },
                {
                    name: "image",
                    type: "upload",
                    relationTo: "media",
                },
            ],
        },
        {
            name: "projects",
            type: "group",
            fields: [
                {
                    name: "title",
                    type: "text",
                    required: true,
                    defaultValue: "Projects",
                },
                {
                    name: "description",
                    type: "textarea",
                    required: true,
                },
                {
                    name: "viewMoreText",
                    type: "text",
                },
                {
                    name: "featured",
                    type: "group",
                    fields: [
                        {
                            name: "title",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "description",
                            type: "textarea",
                            required: true,
                        },
                        {
                            name: "projectUrl",
                            type: "text",
                        },
                        {
                            name: "codeUrl",
                            type: "text",
                        },
                        {
                            name: "image",
                            type: "upload",
                            relationTo: "media",
                        },
                    ],
                },
                {
                    name: "items",
                    type: "array",
                    fields: [
                        {
                            name: "title",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "description",
                            type: "textarea",
                            required: true,
                        },
                        {
                            name: "projectUrl",
                            type: "text",
                        },
                        {
                            name: "codeUrl",
                            type: "text",
                        },
                        {
                            name: "image",
                            type: "upload",
                            relationTo: "media",
                        },
                    ],
                },
                {
                    name: "viewAllLink",
                    type: "text",
                },
            ],
        },
        {
            name: "about",
            type: "group",
            fields: [
                {
                    name: "title",
                    type: "text",
                    required: true,
                    defaultValue: "About",
                },
                {
                    name: "technologiesHeading",
                    type: "text",
                    required: true,
                    defaultValue: "Technologies & Tools",
                },
                {
                    name: "interestsHeading",
                    type: "text",
                    required: true,
                    defaultValue: "When I'm Not Coding",
                },
                {
                    name: "paragraphs",
                    type: "array",
                    fields: [
                        {
                            name: "text",
                            type: "textarea",
                            required: true,
                        },
                    ],
                },
                {
                    name: "technologies",
                    type: "array",
                    fields: [
                        {
                            name: "name",
                            type: "text",
                            required: true,
                        },
                    ],
                },
                {
                    name: "interests",
                    type: "array",
                    fields: [
                        {
                            name: "name",
                            type: "text",
                            required: true,
                        },
                    ],
                },
                {
                    name: "image",
                    type: "upload",
                    relationTo: "media",
                },
            ],
        },
        {
            name: "contact",
            type: "group",
            fields: [
                {
                    name: "title",
                    type: "text",
                    required: true,
                    defaultValue: "Contact",
                },
                {
                    name: "description",
                    type: "textarea",
                    required: true,
                },
                {
                    name: "email",
                    type: "email",
                    required: true,
                },
                {
                    name: "emailSubtitle",
                    type: "text",
                    required: true,
                    defaultValue: "Drop me a line",
                },
                {
                    name: "github",
                    type: "text",
                    required: true,
                },
                {
                    name: "githubSubtitle",
                    type: "text",
                    required: true,
                    defaultValue: "Check out my code",
                },
                {
                    name: "ctaTitle",
                    type: "text",
                    required: true,
                    defaultValue: "Ready to start a project?",
                },
                {
                    name: "ctaDescription",
                    type: "textarea",
                    required: true,
                },
            ],
        },
        {
            name: "footer",
            type: "group",
            fields: [
                {
                    name: "copyright",
                    type: "text",
                    required: true,
                    defaultValue: "© 2024 UnseenSnick. All rights reserved.",
                },
            ],
        },
    ],
};
