import { logger } from "@/lib/utils";
import ejs from "ejs";
import fs from "fs";
import juice from "juice";
import path from "path";

interface EmailData {
    headline: string;
    content: string;
    cta?: {
        buttonLabel: string;
        url: string;
    };
    preheader?: string;
    userName?: string;
}

/**
 * Generates HTML email from EJS template with inlined CSS
 * Falls back to simple HTML if template compilation fails
 */
export const generateEmailHTML = async (data: EmailData): Promise<string> => {
    try {
        const templatePath = path.join(process.cwd(), "src/email/template.ejs");

        if (!fs.existsSync(templatePath)) {
            const emailLogger = logger.createFeatureLogger("Email");
            emailLogger.error(`Email template not found at: ${templatePath}`);
            throw new Error("Email template file not found");
        }

        const templateContent = fs.readFileSync(templatePath, "utf8");

        const preInlinedCSS = ejs.render(templateContent, {
            ...data,
            cta: data.cta || null,
            currentYear: new Date().getFullYear(),
            baseUrl:
                process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000",
        });

        // Inline CSS for email client compatibility
        const html = juice(preInlinedCSS);

        return Promise.resolve(html);
    } catch (error) {
        const emailLogger = logger.createFeatureLogger("Email");
        emailLogger.error("Error generating email HTML:", error);

        // Fallback HTML email
        const fallbackHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${data.headline}</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #7c3aed;">${data.headline}</h1>
                <div style="margin: 20px 0;">${data.content}</div>
                ${
                    data.cta
                        ? `
                    <a href="${data.cta.url}" style="display: inline-block; background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        ${data.cta.buttonLabel}
                    </a>
                `
                        : ""
                }
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                    If you have any questions, feel free to contact us.<br><br>
                    Best regards,<br>
                    The Portfolio Team
                </p>
            </body>
            </html>
        `;

        return Promise.resolve(fallbackHtml);
    }
};