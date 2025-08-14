import type { CollectionConfig } from "payload";

import { generateForgotPasswordEmail } from "../email/generateForgotPasswordEmail";

export const Users: CollectionConfig = {
    slug: "users",
    admin: {
        useAsTitle: "email",
    },
    access: {
        // Prevent account creation by non-admin users (single-admin portfolio site)
        create: ({ req }) => Boolean(req.user),
    },
    auth: {
        forgotPassword: {
            generateEmailHTML: generateForgotPasswordEmail,
            generateEmailSubject: () => "Reset Your Password - Portfolio",
        },
    },
    fields: [
        {
            name: "name",
            type: "text",
            label: "Full Name",
            admin: {
                description: "Your full name for personalization",
            },
        },
    ],
};
