import type { CollectionConfig } from "payload";

// ===== VALIDATION UTILITIES =====
const createPositionValidator = (fieldName: string) => (value: number | null | undefined) => {
    if (value === null || value === undefined) return true;
    if (value < 0 || value > 100) {
        return `${fieldName} must be between 0% and 100%`;
    }
    return true;
};

const createZoomValidator = () => (value: number | null | undefined) => {
    if (value === null || value === undefined) return true;
    if (value < 50 || value > 200) {
        return "Zoom must be between 50% and 200%";
    }
    return true;
};

const imagePositionOptions = [
    { label: "Center", value: "center" },
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
    { label: "Top Left", value: "top-left" },
    { label: "Top Right", value: "top-right" },
    { label: "Bottom Left", value: "bottom-left" },
    { label: "Bottom Right", value: "bottom-right" },
];

const aspectRatioOptions = [
    { label: "Landscape (16:9)", value: "landscape" },
    { label: "Portrait (4:5)", value: "portrait" },
    { label: "Square (1:1)", value: "square" },
    { label: "Cinematic (21:9)", value: "21/9" },
    { label: "Classic (4:3)", value: "4/3" },
    { label: "Golden Ratio (1.618:1)", value: "1.618/1" },
];

export const Portfolio: CollectionConfig = {
    slug: "portfolio",
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "updatedAt"],
        // Live preview configuration moved to main payload.config.ts
    },
    access: {
        read: ({ req }) => {
            if (req.user) return true;

            // Allow draft access for live preview
            if (req.query && req.query.draft === "true") {
                return true;
            }

            return {
                _status: {
                    equals: "published",
                },
            };
        },
    },
    versions: {
        drafts: {
            autosave: {
                interval: 375, // Fast autosave for responsive live preview
            },
        },
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
            defaultValue: "Portfolio",
            label: "Portfolio Title",
        },
        {
            name: "nav",
            type: "group",
            label: "Navigation & Logo",
            admin: {
                description: "Configure your site navigation, logo, and main branding elements"
            },
            fields: [
                {
                    name: "logo",
                    type: "text",
                    required: true,
                    defaultValue: "YourName",
                    label: "Logo Text",
                    admin: {
                        description: "Main text for your hexagon logo",
                    },
                },
                {
                    name: "logoSplitAt",
                    type: "number",
                    label: "Logo Split Point (Optional)",
                    admin: {
                        description: "Character position where gradient effect starts",
                        placeholder: "Auto-split if empty",
                    },
                    validate: (val: number | null | undefined) => {
                        if (val !== undefined && val !== null) {
                            if (val < 0) return "Split point must be positive";
                            if (val > 50) return "Split point too large (max 50)";
                        }
                        return true;
                    },
                },
                {
                    name: "subtitle",
                    type: "text",
                    required: true,
                    defaultValue: "Full Stack Developer",
                    label: "Logo Subtitle",
                    admin: {
                        description: "Subtitle displayed below your logo",
                    },
                },
                {
                    name: "navigationLinks",
                    type: "relationship",
                    relationTo: "navigationLinks",
                    hasMany: true,
                    label: "Navigation Links",
                    filterOptions: {
                        category: {
                            equals: "main",
                        },
                    },
                    admin: {
                        description: "Select navigation links to display in the main menu",
                        allowCreate: true,
                        sortOptions: "order",
                    },
                },
            ],
        },
        {
            name: "hero",
            type: "group",
            label: "Hero Section",
            admin: {
                description: "Configure the main hero section at the top of your website - the first thing visitors see",
            },
            fields: [
                {
                    name: "greeting",
                    type: "text",
                    required: true,
                    defaultValue: "Hello There!",
                    label: "Greeting Text",
                    admin: {
                        description: "Small greeting text displayed above the main title",
                    },
                },
                {
                    name: "heroTitle",
                    type: "text",
                    required: true,
                    defaultValue: "Full Stack Developer",
                    label: "Hero Title",
                    admin: {
                        description: "Main title/headline of your hero section",
                    },
                },
                {
                    name: "heroDescription",
                    type: "richText",
                    required: true,
                    label: "Hero Description",
                    admin: {
                        description: "Brief description about yourself or your services",
                    },
                },
                {
                    name: "githubUrl",
                    type: "relationship",
                    relationTo: "navigationLinks",
                    label: "GitHub URL",
                    filterOptions: {
                        category: {
                            equals: "social",
                        },
                    },
                    admin: {
                        description: "Select your GitHub link from social navigation links",
                        allowCreate: true,
                    },
                },
                {
                    name: "heroImage",
                    type: "upload",
                    relationTo: "media",
                    label: "Hero Image",
                    admin: {
                        description: "Featured image for the hero section",
                    },
                },
                {
                    name: "heroImagePosition",
                    type: "select",
                    label: "Hero Image Position",
                    defaultValue: "center",
                    dbName: "hero_img_pos",
                    options: imagePositionOptions,
                    admin: {
                        description: "Controls how the hero image is positioned within its container when cropped",
                    },
                },
                {
                    name: "heroAspectRatio",
                    type: "select",
                    label: "Hero Image Aspect Ratio",
                    defaultValue: "landscape",
                    dbName: "hero_aspect_ratio",
                    options: aspectRatioOptions,
                    admin: {
                        description: "Controls the aspect ratio (width to height ratio) of the hero image. This applies to both mobile and desktop views.",
                    },
                },
                {
                    name: "heroImageZoom",
                    type: "number",
                    label: "Image Zoom (%)",
                    min: 50,
                    max: 200,
                    admin: {
                        description: "Scale the image (50-200%). Leave empty for default size. Useful for fitting images better within the aspect ratio.",
                        placeholder: "Leave empty for default (100%)",
                        condition: (data, siblingData) => !!siblingData?.heroImage,
                    },
                    validate: createZoomValidator(),
                },
                {
                    type: "collapsible",
                    label: "Fine Position Control (Advanced)",
                    admin: {
                        initCollapsed: true,
                        description: "Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.",
                        condition: (data, siblingData) => !!siblingData?.heroImage,
                    },
                    fields: [
                        {
                            name: "x",
                            type: "number",
                            label: "Horizontal Position (%)",
                            min: 0,
                            max: 100,
                            admin: {
                                description: "Horizontal position (0-100%). Leave empty to use preset position. 0 = left edge, 50 = center, 100 = right edge",
                                placeholder: "Leave empty for preset position",
                            },
                            validate: createPositionValidator("Horizontal position"),
                        },
                        {
                            name: "y",
                            type: "number",
                            label: "Vertical Position (%)",
                            min: 0,
                            max: 100,
                            admin: {
                                description: "Vertical position (0-100%). Leave empty to use preset position. 0 = top edge, 50 = center, 100 = bottom edge",
                                placeholder: "Leave empty for preset position",
                            },
                            validate: createPositionValidator("Vertical position"),
                        },
                    ],
                },
            ],
        },
        {
            name: "projects",
            type: "group",
            label: "Projects Section",
            admin: {
                description: "Configure your portfolio projects section - showcase your best work",
            },
            fields: [
                {
                    name: "projectsTitle",
                    type: "text",
                    required: true,
                    defaultValue: "Projects",
                    label: "Section Title",
                    admin: {
                        description: "Title for the projects section",
                    },
                },
                {
                    name: "projectsDescription",
                    type: "text",
                    required: true,
                    label: "Section Description",
                    admin: {
                        description: "Brief introduction to your projects section",
                    },
                },
                {
                    name: "viewMoreText",
                    type: "text",
                    label: "View More Text",
                    admin: {
                        description: "Text displayed above the 'View All on GitHub' button",
                    },
                },
                {
                    name: "featured",
                    type: "group",
                    label: "Featured Project",
                    admin: {
                        description: "Configure your main featured project (displayed prominently)",
                    },
                    fields: [
                        {
                            name: "featuredTitle",
                            type: "text",
                            required: true,
                            label: "Project Title",
                            admin: {
                                description: "Title of your featured project",
                            },
                        },
                        {
                            name: "content",
                            type: "richText",
                            label: "Project Description",
                            admin: {
                                description: "Detailed description of your featured project",
                            },
                        },
                        {
                            name: "projectUrl",
                            type: "relationship",
                            relationTo: "navigationLinks",
                            label: "Live Demo URL",
                            filterOptions: {
                                category: {
                                    equals: "social",
                                },
                            },
                            admin: {
                                description: "Select live demo link from social navigation links",
                                allowCreate: true,
                            },
                        },
                        {
                            name: "codeUrl",
                            type: "relationship",
                            relationTo: "navigationLinks",
                            label: "Source Code URL",
                            filterOptions: {
                                category: {
                                    equals: "social",
                                },
                            },
                            admin: {
                                description: "Select source code repository link from social navigation links",
                                allowCreate: true,
                            },
                        },
                        {
                            name: "technologies",
                            type: "relationship",
                            relationTo: "tags" as any,
                            hasMany: true,
                            label: "Technologies Used",
                            filterOptions: {
                                category: {
                                    equals: "technology & tools",
                                },
                            },
                            admin: {
                                description: "Select technologies used in this project from your tags list",
                                allowCreate: true,
                            },
                        },
                        {
                            name: "media",
                            type: "array",
                            label: "Project Media",
                            admin: {
                                description: "Add multiple images and/or videos for your featured project. If you add multiple items, they will be displayed in a carousel.",
                            },
                            fields: [
                                {
                                    name: "image",
                                    type: "upload",
                                    relationTo: "media",
                                    label: "Project Image",
                                    admin: {
                                        description: "Screenshot or thumbnail of your project (used as fallback or video poster)",
                                    },
                                },
                                {
                                    name: "imagePosition",
                                    type: "select",
                                    label: "Image Position",
                                    defaultValue: "center",
                                    dbName: "img_pos",
                                    options: [
                                        {
                                            label: "Center",
                                            value: "center",
                                        },
                                        {
                                            label: "Top",
                                            value: "top",
                                        },
                                        {
                                            label: "Bottom",
                                            value: "bottom",
                                        },
                                        {
                                            label: "Left",
                                            value: "left",
                                        },
                                        {
                                            label: "Right",
                                            value: "right",
                                        },
                                        {
                                            label: "Top Left",
                                            value: "top-left",
                                        },
                                        {
                                            label: "Top Right",
                                            value: "top-right",
                                        },
                                        {
                                            label: "Bottom Left",
                                            value: "bottom-left",
                                        },
                                        {
                                            label: "Bottom Right",
                                            value: "bottom-right",
                                        },
                                    ],
                                    admin: {
                                        description: "Controls how the image is positioned within its container when cropped",
                                    },
                                },
                                {
                                    name: "aspectRatio",
                                    type: "select",
                                    label: "Media Aspect Ratio",
                                    defaultValue: "landscape",
                                    dbName: "media_aspect_ratio",
                                    options: [
                                        {
                                            label: "Square (1:1)",
                                            value: "square",
                                        },
                                        {
                                            label: "Landscape (16:9)",
                                            value: "landscape",
                                        },
                                        {
                                            label: "Portrait (3:4)",
                                            value: "portrait",
                                        },
                                        {
                                            label: "Wide (21:9)",
                                            value: "21/9",
                                        },
                                        {
                                            label: "Classic (4:3)",
                                            value: "4/3",
                                        },
                                        {
                                            label: "Golden Ratio (1.618:1)",
                                            value: "1.618/1",
                                        },
                                    ],
                                    admin: {
                                        description: "Controls the aspect ratio of this media item. Applies to both images and videos.",
                                    },
                                },
                                {
                                    name: "imageZoom",
                                    type: "number",
                                    label: "Image Zoom (%)",
                                    min: 50,
                                    max: 200,
                                    admin: {
                                        description: "Scale the image (50-200%). Leave empty for default size. Useful for fitting images better within the aspect ratio.",
                                        placeholder: "Leave empty for default (100%)",
                                        condition: (data, siblingData) => {
                                            return !!siblingData?.image;
                                        },
                                    },
                                    validate: createZoomValidator(),
                                },
                                {
                                    name: "imageFinePosition",
                                    type: "group",
                                    label: "Fine Position Control (Advanced)",
                                    admin: {
                                        description: "Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.",
                                        condition: (data, siblingData) => {
                                            return !!siblingData?.image;
                                        },
                                    },
                                    fields: [
                                        {
                                            name: "x",
                                            type: "number",
                                            label: "Horizontal Position (%)",
                                            min: 0,
                                            max: 100,
                                            admin: {
                                                description: "Horizontal position (0-100%). Leave empty to use preset position. 0 = left edge, 50 = center, 100 = right edge",
                                                placeholder: "Leave empty for preset position",
                                            },
                                            validate: createPositionValidator("Horizontal position"),
                                        },
                                        {
                                            name: "y",
                                            type: "number",
                                            label: "Vertical Position (%)",
                                            min: 0,
                                            max: 100,
                                            admin: {
                                                description: "Vertical position (0-100%). Leave empty to use preset position. 0 = top edge, 50 = center, 100 = bottom edge",
                                                placeholder: "Leave empty for preset position",
                                            },
                                            validate: createPositionValidator("Vertical position"),
                                        },
                                    ],
                                },
                                {
                                    name: "video",
                                    type: "group",
                                    label: "Project Video (Optional)",
                                    admin: {
                                        description: "Video demo of your project - supports YouTube URLs, direct video files, and uploaded videos",
                                    },
                                    fields: [
                                        {
                                            name: "src",
                                            type: "text",
                                            label: "Video URL",
                                            admin: {
                                                description: "YouTube URL for embedding video demos of your projects.",
                                                placeholder: "https://youtube.com/watch?v=...",
                                            },
                                        },
                                        {
                                            name: "file",
                                            type: "upload",
                                            relationTo: "media",
                                            label: "Upload Video File",
                                            admin: {
                                                description: "Alternative: Upload a video file directly (will override URL if both provided)",
                                            },
                                        },
                                        {
                                            name: "title",
                                            type: "text",
                                            label: "Video Title",
                                            admin: {
                                                description: "Optional: Title displayed above the video player",
                                            },
                                        },
                                        {
                                            name: "description",
                                            type: "text",
                                            label: "Video Description",
                                            admin: {
                                                description: "Optional: Description displayed below the video title",
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "items",
                    type: "array",
                    label: "Project Items",
                    admin: {
                        description: "Additional projects to display in your portfolio",
                    },
                    fields: [
                        {
                            name: "itemTitle",
                            type: "text",
                            required: true,
                            label: "Project Title",
                            admin: {
                                description: "Title of this project",
                            },
                        },
                        {
                            name: "content",
                            type: "richText",
                            label: "Project Description",
                            admin: {
                                description: "Detailed description of this project",
                            },
                        },
                        {
                            name: "projectUrl",
                            type: "text",
                            label: "Live Demo URL",
                            admin: {
                                description: "URL to the live demo of this project (with or without https://)",
                            },
                        },
                        {
                            name: "codeUrl",
                            type: "relationship",
                            relationTo: "navigationLinks",
                            label: "Source Code URL",
                            filterOptions: {
                                category: {
                                    equals: "social",
                                },
                            },
                            admin: {
                                description: "Select source code repository link from social navigation links",
                                allowCreate: true,
                            },
                        },
                        {
                            name: "technologies",
                            type: "relationship",
                            relationTo: "tags" as any,
                            hasMany: true,
                            label: "Technologies Used",
                            filterOptions: {
                                category: {
                                    equals: "technology & tools",
                                },
                            },
                            admin: {
                                description: "Select technologies used in this project from your tags list",
                                allowCreate: true,
                            },
                        },
                        {
                            name: "media",
                            type: "array",
                            label: "Project Media",
                            admin: {
                                description: "Add multiple images and/or videos for this project. If you add multiple items, they will be displayed in a carousel.",
                            },
                            fields: [
                                {
                                    name: "image",
                                    type: "upload",
                                    relationTo: "media",
                                    label: "Project Image",
                                    admin: {
                                        description: "Screenshot or thumbnail of your project (used as fallback or video poster)",
                                    },
                                },
                                {
                                    name: "imagePosition",
                                    type: "select",
                                    label: "Image Position",
                                    defaultValue: "center",
                                    dbName: "img_pos",
                                    options: [
                                        {
                                            label: "Center",
                                            value: "center",
                                        },
                                        {
                                            label: "Top",
                                            value: "top",
                                        },
                                        {
                                            label: "Bottom",
                                            value: "bottom",
                                        },
                                        {
                                            label: "Left",
                                            value: "left",
                                        },
                                        {
                                            label: "Right",
                                            value: "right",
                                        },
                                        {
                                            label: "Top Left",
                                            value: "top-left",
                                        },
                                        {
                                            label: "Top Right",
                                            value: "top-right",
                                        },
                                        {
                                            label: "Bottom Left",
                                            value: "bottom-left",
                                        },
                                        {
                                            label: "Bottom Right",
                                            value: "bottom-right",
                                        },
                                    ],
                                    admin: {
                                        description: "Controls how the image is positioned within its container when cropped",
                                    },
                                },
                                {
                                    name: "aspectRatio",
                                    type: "select",
                                    label: "Media Aspect Ratio",
                                    defaultValue: "landscape",
                                    dbName: "media_aspect_ratio",
                                    options: [
                                        {
                                            label: "Square (1:1)",
                                            value: "square",
                                        },
                                        {
                                            label: "Landscape (16:9)",
                                            value: "landscape",
                                        },
                                        {
                                            label: "Portrait (3:4)",
                                            value: "portrait",
                                        },
                                        {
                                            label: "Wide (21:9)",
                                            value: "21/9",
                                        },
                                        {
                                            label: "Classic (4:3)",
                                            value: "4/3",
                                        },
                                        {
                                            label: "Golden Ratio (1.618:1)",
                                            value: "1.618/1",
                                        },
                                    ],
                                    admin: {
                                        description: "Controls the aspect ratio of this media item. Applies to both images and videos.",
                                    },
                                },
                                {
                                    name: "imageZoom",
                                    type: "number",
                                    label: "Image Zoom (%)",
                                    min: 50,
                                    max: 200,
                                    admin: {
                                        description: "Scale the image (50-200%). Leave empty for default size. Useful for fitting images better within the aspect ratio.",
                                        placeholder: "Leave empty for default (100%)",
                                        condition: (data, siblingData) => {
                                            return !!siblingData?.image;
                                        },
                                    },
                                    validate: createZoomValidator(),
                                },
                                {
                                    name: "imageFinePosition",
                                    type: "group",
                                    label: "Fine Position Control (Advanced)",
                                    admin: {
                                        description: "Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.",
                                        condition: (data, siblingData) => {
                                            return !!siblingData?.image;
                                        },
                                    },
                                    fields: [
                                        {
                                            name: "x",
                                            type: "number",
                                            label: "Horizontal Position (%)",
                                            min: 0,
                                            max: 100,
                                            admin: {
                                                description: "Horizontal position (0-100%). Leave empty to use preset position. 0 = left edge, 50 = center, 100 = right edge",
                                                placeholder: "Leave empty for preset position",
                                            },
                                            validate: createPositionValidator("Horizontal position"),
                                        },
                                        {
                                            name: "y",
                                            type: "number",
                                            label: "Vertical Position (%)",
                                            min: 0,
                                            max: 100,
                                            admin: {
                                                description: "Vertical position (0-100%). Leave empty to use preset position. 0 = top edge, 50 = center, 100 = bottom edge",
                                                placeholder: "Leave empty for preset position",
                                            },
                                            validate: createPositionValidator("Vertical position"),
                                        },
                                    ],
                                },
                                {
                                    name: "video",
                                    type: "group",
                                    label: "Project Video (Optional)",
                                    admin: {
                                        description: "Video demo of your project - supports YouTube URLs, direct video files, and uploaded videos",
                                    },
                                    fields: [
                                        {
                                            name: "src",
                                            type: "text",
                                            label: "Video URL",
                                            admin: {
                                                description: "YouTube URL for embedding video demos of your projects.",
                                                placeholder: "https://youtube.com/watch?v=...",
                                            },
                                        },
                                        {
                                            name: "file",
                                            type: "upload",
                                            relationTo: "media",
                                            label: "Upload Video File",
                                            admin: {
                                                description: "Alternative: Upload a video file directly (will override URL if both provided)",
                                            },
                                        },
                                        {
                                            name: "title",
                                            type: "text",
                                            label: "Video Title",
                                            admin: {
                                                description: "Optional: Title displayed above the video player",
                                            },
                                        },
                                        {
                                            name: "description",
                                            type: "text",
                                            label: "Video Description",
                                            admin: {
                                                description: "Optional: Description displayed below the video title",
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "viewAllLink",
                    type: "relationship",
                    relationTo: "navigationLinks",
                    label: "View All Projects URL",
                    filterOptions: {
                        category: {
                            equals: "social",
                        },
                    },
                    admin: {
                        description: "Select link to view all projects from social navigation links",
                        allowCreate: true,
                    },
                },
            ],
        },
        {
            name: "about",
            type: "group",
            label: "About Section",
            admin: {
                description: "Configure the about section of your portfolio - tell your story and showcase your skills",
            },
            fields: [
                {
                    name: "aboutTitle",
                    type: "text",
                    required: true,
                    defaultValue: "About",
                    label: "Section Title",
                    admin: {
                        description: "Title for the about section",
                    },
                },
                {
                    name: "technologiesHeading",
                    type: "text",
                    required: true,
                    defaultValue: "Technologies & Tools",
                    label: "Technologies Heading",
                    admin: {
                        description: "Heading for the technologies/skills subsection",
                    },
                },
                {
                    name: "interestsHeading",
                    type: "text",
                    required: true,
                    defaultValue: "When I'm Not Coding",
                    label: "Interests Heading",
                    admin: {
                        description: "Heading for the interests/hobbies subsection",
                    },
                },
                {
                    name: "content",
                    type: "richText",
                    label: "About Content",
                    admin: {
                        description: "Text content describing yourself and your background",
                    },
                },
                {
                    name: "technologies",
                    type: "relationship",
                    relationTo: "tags" as any,
                    hasMany: true,
                    label: "Technologies & Skills",
                    filterOptions: {
                        category: {
                            equals: "technology & tools",
                        },
                    },
                    admin: {
                        description: "Select technologies and skills you're proficient with from your tags list",
                        allowCreate: true,
                    },
                },
                {
                    name: "interests",
                    type: "relationship",
                    relationTo: "tags" as any,
                    hasMany: true,
                    label: "Interests & Hobbies",
                    filterOptions: {
                        category: {
                            equals: "hobbies",
                        },
                    },
                    admin: {
                        description: "Select your interests and hobbies from your tags list",
                        allowCreate: true,
                    },
                },
                {
                    name: "aboutImage",
                    type: "upload",
                    relationTo: "media",
                    label: "About Image",
                    admin: {
                        description: "Image to display in the about section (e.g., your photo)",
                    },
                },
                {
                    name: "aboutImagePosition",
                    type: "select",
                    label: "About Image Position",
                    defaultValue: "center",
                    dbName: "about_img_pos",
                    options: [
                        {
                            label: "Center",
                            value: "center",
                        },
                        {
                            label: "Top",
                            value: "top",
                        },
                        {
                            label: "Bottom",
                            value: "bottom",
                        },
                        {
                            label: "Left",
                            value: "left",
                        },
                        {
                            label: "Right",
                            value: "right",
                        },
                        {
                            label: "Top Left",
                            value: "top-left",
                        },
                        {
                            label: "Top Right",
                            value: "top-right",
                        },
                        {
                            label: "Bottom Left",
                            value: "bottom-left",
                        },
                        {
                            label: "Bottom Right",
                            value: "bottom-right",
                        },
                    ],
                    admin: {
                        description: "Controls how the about image is positioned within its container when cropped",
                    },
                },
                {
                    name: "aboutAspectRatio",
                    type: "select",
                    label: "About Image Aspect Ratio",
                    defaultValue: "portrait",
                    dbName: "about_aspect_ratio",
                    options: [
                        {
                            label: "Square (1:1)",
                            value: "square",
                        },
                        {
                            label: "Landscape (16:9)",
                            value: "landscape",
                        },
                        {
                            label: "Portrait (3:4)",
                            value: "portrait",
                        },
                        {
                            label: "Wide (21:9)",
                            value: "21/9",
                        },
                        {
                            label: "Classic (4:3)",
                            value: "4/3",
                        },
                        {
                            label: "Golden Ratio (1.618:1)",
                            value: "1.618/1",
                        },
                    ],
                    admin: {
                        description: "Controls the aspect ratio (width to height ratio) of the about image. This applies to both mobile and desktop views.",
                    },
                },
                {
                    name: "aboutImageZoom",
                    type: "number",
                    label: "Image Zoom (%)",
                    min: 50,
                    max: 200,
                    admin: {
                        description: "Scale the image (50-200%). Leave empty for default size. Useful for fitting images better within the aspect ratio.",
                        placeholder: "Leave empty for default (100%)",
                        condition: (data, siblingData) => !!siblingData?.aboutImage,
                    },
                    validate: createZoomValidator(),
                },
                {
                    type: "collapsible",
                    label: "Fine Position Control (Advanced)",
                    admin: {
                        initCollapsed: true,
                        description: "Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.",
                        condition: (data, siblingData) => !!siblingData?.aboutImage,
                    },
                    fields: [
                        {
                            name: "x",
                            type: "number",
                            label: "Horizontal Position (%)",
                            min: 0,
                            max: 100,
                            admin: {
                                description: "Horizontal position (0-100%). Leave empty to use preset position. 0 = left edge, 50 = center, 100 = right edge",
                                placeholder: "Leave empty for preset position",
                            },
                            validate: createPositionValidator("Horizontal position"),
                        },
                        {
                            name: "y",
                            type: "number",
                            label: "Vertical Position (%)",
                            min: 0,
                            max: 100,
                            admin: {
                                description: "Vertical position (0-100%). Leave empty to use preset position. 0 = top edge, 50 = center, 100 = bottom edge",
                                placeholder: "Leave empty for preset position",
                            },
                            validate: createPositionValidator("Vertical position"),
                        },
                    ],
                },
            ],
        },
        {
            name: "contact",
            type: "group",
            label: "Contact Section",
            admin: {
                description: "Configure the contact section of your portfolio - make it easy for people to reach you",
            },
            fields: [
                {
                    name: "contactTitle",
                    type: "text",
                    required: true,
                    defaultValue: "Contact",
                    label: "Section Title",
                    admin: {
                        description: "Title for the contact section",
                    },
                },
                {
                    name: "contactDescription",
                    type: "text",
                    required: true,
                    label: "Section Description",
                    admin: {
                        description: "Brief introduction to your contact section",
                    },
                },
                {
                    name: "email",
                    type: "relationship",
                    relationTo: "navigationLinks",
                    label: "Email Address",
                    filterOptions: {
                        category: {
                            equals: "social",
                        },
                    },
                    admin: {
                        description: "Select your email contact from social navigation links",
                        allowCreate: true,
                    },
                },
                {
                    name: "emailSubtitle",
                    type: "text",
                    required: true,
                    defaultValue: "Drop me a line",
                    label: "Email Card Subtitle",
                    admin: {
                        description: "Subtitle text displayed on the email contact card",
                    },
                },
                {
                    name: "github",
                    type: "relationship",
                    relationTo: "navigationLinks",
                    label: "GitHub Username",
                    filterOptions: {
                        category: {
                            equals: "social",
                        },
                    },
                    admin: {
                        description: "Select your GitHub profile from social navigation links",
                        allowCreate: true,
                    },
                },
                {
                    name: "githubSubtitle",
                    type: "text",
                    required: true,
                    defaultValue: "Check out my code",
                    label: "GitHub Card Subtitle",
                    admin: {
                        description: "Subtitle text displayed on the GitHub contact card",
                    },
                },
                {
                    name: "ctaTitle",
                    type: "text",
                    required: true,
                    defaultValue: "Ready to start a project?",
                    label: "CTA Title",
                    admin: {
                        description: "Title for the call-to-action card",
                    },
                },
                {
                    name: "ctaDescription",
                    type: "text",
                    required: true,
                    label: "CTA Description",
                    admin: {
                        description: "Description text for the call-to-action card",
                    },
                },
            ],
        },
        {
            name: "footer",
            type: "group",
            label: "Footer Section",
            admin: {
                description: "Configure the footer section of your portfolio - copyright and final details",
            },
            fields: [
                {
                    name: "copyright",
                    type: "text",
                    required: true,
                    defaultValue: "© 2024 Your Name. All rights reserved.",
                    label: "Copyright Text",
                    admin: {
                        description: "Copyright notice displayed in the footer",
                    },
                },
            ],
        },
    ],
};