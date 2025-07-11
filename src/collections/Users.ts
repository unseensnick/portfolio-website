import type { CollectionConfig } from "payload";

import { generateForgotPasswordEmail } from "../email/generateForgotPasswordEmail";

export const Users: CollectionConfig = {
    slug: "users",
    admin: {
        useAsTitle: "email",
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
