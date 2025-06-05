import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
    slug: "users",
    admin: {
        useAsTitle: "email",
    },
    auth: {
        forgotPassword: {
            generateEmailHTML: (args: any) => {
                const { token, user } = args || {};
                if (!token || !user?.email) return "";

                // Create the reset URL with the token
                const resetURL = `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/admin/reset?token=${token}`;

                // Generate the HTML for the email
                const html = `
                <h2>Password Reset Request</h2>
                <p>We received a request to reset your password. Click the link below to set a new password:</p>
                <p><a href="${resetURL}" style="padding: 10px 15px; background-color: #4a6cf7; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
                <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
                <p>${resetURL}</p>
                `;

                return html;
            },
        },
    },
    fields: [
        // Email added by default
        // Add more fields as needed
    ],
};
