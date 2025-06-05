import type { PayloadRequest } from "payload";

import { generateEmailHTML } from "./generateEmailHTML";

type ForgotPasswordEmailArgs =
    | {
          req?: PayloadRequest;
          token?: string;
          user?: any;
      }
    | undefined;

export const generateForgotPasswordEmail = async (
    args: ForgotPasswordEmailArgs
): Promise<string> => {
    const baseUrl =
        process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${args?.token}`;

    // Get user name if available
    const userName =
        args?.user?.name || args?.user?.email?.split("@")[0] || "there";

    return generateEmailHTML({
        headline: "Reset Your Password",
        preheader: "You requested a password reset for your portfolio account",
        userName,
        content: `
            <p>Hi ${userName},</p>
            <p>We received a request to reset the password for your portfolio account. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click the button below. This link will expire in 1 hour for security reasons.</p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #7c3aed; word-break: break-all;">${resetUrl}</a></p>
        `,
        cta: {
            buttonLabel: "Reset Password",
            url: resetUrl,
        },
    });
};
