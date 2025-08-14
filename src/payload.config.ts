import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { uploadthingStorage } from "@payloadcms/storage-uploadthing";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Media } from "./collections/Media";
import { Portfolio } from "./collections/Portfolio";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
        // PayloadCMS 3.0 Live Preview Configuration
        livePreview: {
            // Dynamic URL generation for live preview
            url: ({ collectionConfig, locale }) => {
                const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000";
                
                // All collections use the root path with draft parameter
                return `${baseUrl}/?draft=true${locale ? `&locale=${locale}` : ''}`;
            },
            // Specify which collections should have live preview
            collections: ['portfolio'],
            // Device breakpoints for responsive preview
            breakpoints: [
                {
                    label: "Mobile",
                    name: "mobile", 
                    width: 375,
                    height: 667,
                },
                {
                    label: "Tablet",
                    name: "tablet",
                    width: 768,
                    height: 1024,
                },
                {
                    label: "Desktop",
                    name: "desktop",
                    width: 1440,
                    height: 900,
                },
            ],
        },
    },
    collections: [Users, Media, Portfolio],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URI || "",
        },
    }),
    sharp,
    email: nodemailerAdapter({
        defaultFromAddress:
            process.env.EMAIL_FROM || "info@portfolio-website.com",
        defaultFromName: process.env.EMAIL_FROM_NAME || "Portfolio Website",
        transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        },
    }),
    plugins: [
        payloadCloudPlugin(),
        uploadthingStorage({
            collections: {
                media: true,
            },
            options: {
                token: process.env.UPLOADTHING_TOKEN,
                acl: "public-read",
            },
            clientUploads: true,
        }),
    ],
});