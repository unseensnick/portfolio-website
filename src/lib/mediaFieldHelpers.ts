import type { Field } from "payload";

// ===== SHARED VALIDATION UTILITIES =====
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

// ===== SHARED OPTION ARRAYS =====
export const IMAGE_POSITION_OPTIONS = [
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

export const ASPECT_RATIO_OPTIONS = [
    { label: "Landscape (16:9)", value: "landscape" },
    { label: "Portrait (4:5)", value: "portrait" },
    { label: "Square (1:1)", value: "square" },
    { label: "Cinematic (21:9)", value: "21/9" },
    { label: "Classic (4:3)", value: "4/3" },
    { label: "Golden Ratio (1.618:1)", value: "1.618/1" },
];

// ===== MEDIA FIELD FACTORY FUNCTIONS =====

interface MediaFieldOptions {
    fieldNamePrefix: string;
    defaultPosition?: string;
    defaultAspectRatio?: string;
    includeZoom?: boolean;
    includeFinePosition?: boolean;
    useFinePositionCollapsible?: boolean;
    useCollapsibleWrapper?: boolean;
    customDescription?: {
        upload?: string;
        position?: string;
        aspectRatio?: string;
        zoom?: string;
        finePosition?: string;
    };
}

/**
 * Creates a complete set of media control fields for a single image
 * Reduces ~90 lines of duplicated code to a single function call
 */
export const createImageFields = (options: MediaFieldOptions): Field[] => {
    const {
        fieldNamePrefix,
        defaultPosition = "center",
        defaultAspectRatio = "landscape",
        includeZoom = true,
        includeFinePosition = true,
        useFinePositionCollapsible = true,
        useCollapsibleWrapper = false,
        customDescription = {}
    } = options;

    // Main image upload field (always outside collapsible)
    const uploadField: Field = {
        name: `${fieldNamePrefix}Image`,
        type: "upload",
        relationTo: "media",
        label: `${fieldNamePrefix.charAt(0).toUpperCase() + fieldNamePrefix.slice(1)} Image`,
        admin: {
            description: customDescription.upload || `Featured image for the ${fieldNamePrefix} section`,
        },
    };

    // Control fields that can be wrapped in collapsible
    const controlFields: Field[] = [
        // Image position field
        {
            name: `${fieldNamePrefix}ImagePosition`,
            type: "select",
            label: "Image Position",
            defaultValue: defaultPosition,
            dbName: `${fieldNamePrefix}_img_pos`,
            options: IMAGE_POSITION_OPTIONS,
            admin: {
                description: customDescription.position || `Controls how the ${fieldNamePrefix} image is positioned within its container when cropped`,
            },
        },
        // Aspect ratio field
        {
            name: `${fieldNamePrefix}AspectRatio`,
            type: "select",
            label: "Image Aspect Ratio",
            defaultValue: defaultAspectRatio,
            dbName: `${fieldNamePrefix}_aspect_ratio`,
            options: ASPECT_RATIO_OPTIONS,
            admin: {
                description: customDescription.aspectRatio || `Controls the aspect ratio (width to height ratio) of the ${fieldNamePrefix} image. This applies to both mobile and desktop views.`,
            },
        },
    ];

    // Conditionally add zoom field
    if (includeZoom) {
        controlFields.push({
            name: `${fieldNamePrefix}ImageZoom`,
            type: "number",
            label: "Image Zoom (%)",
            min: 50,
            max: 200,
            admin: {
                description: customDescription.zoom || "Scale the image (50-200%). Leave empty for default size. Useful for fitting images better within the aspect ratio.",
                placeholder: "Leave empty for default (100%)",
            },
            validate: createZoomValidator(),
        });
    }

    // Conditionally add fine position control
    if (includeFinePosition) {
        const finePositionFields: Field[] = [
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
        ];

        if (useFinePositionCollapsible) {
            controlFields.push({
                type: "collapsible",
                label: "Fine Position Control (Advanced)",
                admin: {
                    initCollapsed: true,
                    description: customDescription.finePosition || "Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.",
                },
                fields: finePositionFields,
            });
        } else {
            controlFields.push({
                name: `${fieldNamePrefix}ImageFinePosition`,
                type: "group",
                label: "Fine Position Control (Advanced)",
                admin: {
                    description: customDescription.finePosition || "Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.",
                },
                fields: finePositionFields,
            });
        }
    }

    // Return fields based on collapsible wrapper option
    if (useCollapsibleWrapper) {
        return [
            uploadField,
            {
                type: "collapsible",
                label: `${fieldNamePrefix.charAt(0).toUpperCase() + fieldNamePrefix.slice(1)} Image Settings`,
                admin: {
                    initCollapsed: true,
                    description: `Configure position, aspect ratio, and zoom settings for the ${fieldNamePrefix} image`,
                    condition: (data, siblingData) => !!siblingData?.[`${fieldNamePrefix}Image`],
                },
                fields: controlFields,
            },
        ];
    } else {
        return [uploadField, ...controlFields];
    }
};

/**
 * Creates media fields for use within arrays (like project media)
 * Handles different naming conventions and structure for array contexts
 */
export const createArrayMediaFields = (): Field[] => [
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
        options: IMAGE_POSITION_OPTIONS,
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
        options: ASPECT_RATIO_OPTIONS,
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
            condition: (data, siblingData) => !!siblingData?.image,
        },
        validate: createZoomValidator(),
    },
    {
        name: "imageFinePosition",
        type: "group",
        label: "Fine Position Control (Advanced)",
        admin: {
            description: "Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.",
            condition: (data, siblingData) => !!siblingData?.image,
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
];

/**
 * Creates a single media group (like project media but for single items)
 * Perfect for hero and about sections that need one image with controls
 */
export const createSingleMediaGroup = (options: {
    fieldNamePrefix: string;
    label: string;
    description: string;
    defaultPosition?: string;
    defaultAspectRatio?: string;
}): Field => {
    const {
        fieldNamePrefix,
        label,
        description,
        defaultPosition = "center",
        defaultAspectRatio = "landscape"
    } = options;

    return {
        type: "collapsible",
        label: label,
        admin: {
            initCollapsed: true,
            description: description,
        },
        fields: [
            {
                name: `${fieldNamePrefix}Media`,
                type: "group",
                label: "Media Settings",
                fields: [
                    {
                        name: "image",
                        type: "upload",
                        relationTo: "media",
                        label: "Image",
                        admin: {
                            description: "Upload the image for this section",
                        },
                    },
                    {
                        name: "imagePosition",
                        type: "select",
                        label: "Image Position",
                        defaultValue: defaultPosition,
                        dbName: "img_pos",
                        options: IMAGE_POSITION_OPTIONS,
                        admin: {
                            description: "Controls how the image is positioned within its container when cropped",
                            condition: (data, siblingData) => !!siblingData?.image,
                        },
                    },
                    {
                        name: "aspectRatio",
                        type: "select",
                        label: "Image Aspect Ratio",
                        defaultValue: defaultAspectRatio,
                        dbName: "aspect_ratio",
                        options: ASPECT_RATIO_OPTIONS,
                        admin: {
                            description: "Controls the aspect ratio of the image",
                            condition: (data, siblingData) => !!siblingData?.image,
                        },
                    },
                    {
                        name: "imageZoom",
                        type: "number",
                        label: "Image Zoom (%)",
                        min: 50,
                        max: 200,
                        admin: {
                            description: "Scale the image (50-200%). Leave empty for default size.",
                            placeholder: "Leave empty for default (100%)",
                            condition: (data, siblingData) => !!siblingData?.image,
                        },
                        validate: createZoomValidator(),
                    },
                    {
                        type: "collapsible",
                        label: "Fine Position Control (Advanced)",
                        admin: {
                            initCollapsed: true,
                            description: "Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.",
                            condition: (data, siblingData) => !!siblingData?.image,
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
        ],
    };
};

/**
 * Creates the video field group for project media arrays
 */
export const createVideoFields = (): Field => ({
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
});