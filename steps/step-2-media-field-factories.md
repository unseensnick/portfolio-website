# Step 2: Create Media Field Factory Helpers

## Objective
Eliminate the massive duplication of media control fields (image position, aspect ratio, zoom, fine positioning) by creating reusable factory functions. This will reduce ~200+ lines of repeated code.

## Current Problem
Media controls are duplicated 6+ times across:
- Hero image (lines 218-286)
- Featured project media array (lines 398-533)
- Project items media array (lines 657-791)  
- About image (lines 938-1068)

Each duplication includes:
- Image position select (9 options, ~25 lines each)
- Aspect ratio select (6 options, ~25 lines each)
- Image zoom number field (~10 lines each)
- Fine position control group (~30 lines each)

## Solution Overview
Create factory functions that generate consistent media field configurations, reducing duplication while maintaining flexibility for different contexts.

---

## Implementation Steps

### 1. Create Media Field Helpers

**File**: `src/lib/mediaFieldHelpers.ts`

```typescript
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
        customDescription = {}
    } = options;

    const fields: Field[] = [
        // Main image upload field
        {
            name: `${fieldNamePrefix}Image`,
            type: "upload",
            relationTo: "media",
            label: `${fieldNamePrefix.charAt(0).toUpperCase() + fieldNamePrefix.slice(1)} Image`,
            admin: {
                description: customDescription.upload || `Featured image for the ${fieldNamePrefix} section`,
            },
        },
        // Image position field
        {
            name: `${fieldNamePrefix}ImagePosition`,
            type: "select",
            label: `${fieldNamePrefix.charAt(0).toUpperCase() + fieldNamePrefix.slice(1)} Image Position`,
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
            label: `${fieldNamePrefix.charAt(0).toUpperCase() + fieldNamePrefix.slice(1)} Image Aspect Ratio`,
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
        fields.push({
            name: `${fieldNamePrefix}ImageZoom`,
            type: "number",
            label: "Image Zoom (%)",
            min: 50,
            max: 200,
            admin: {
                description: customDescription.zoom || "Scale the image (50-200%). Leave empty for default size. Useful for fitting images better within the aspect ratio.",
                placeholder: "Leave empty for default (100%)",
                condition: (data, siblingData) => !!siblingData?.[`${fieldNamePrefix}Image`],
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
            fields.push({
                type: "collapsible",
                label: "Fine Position Control (Advanced)",
                admin: {
                    initCollapsed: true,
                    description: customDescription.finePosition || "Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.",
                    condition: (data, siblingData) => !!siblingData?.[`${fieldNamePrefix}Image`],
                },
                fields: finePositionFields,
            });
        } else {
            fields.push({
                name: `${fieldNamePrefix}ImageFinePosition`,
                type: "group",
                label: "Fine Position Control (Advanced)",
                admin: {
                    description: customDescription.finePosition || "Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.",
                    condition: (data, siblingData) => !!siblingData?.[`${fieldNamePrefix}Image`],
                },
                fields: finePositionFields,
            });
        }
    }

    return fields;
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
```

### 2. Update Portfolio Collection to Use Factories

**File**: `src/collections/Portfolio.ts`

**At the top, add import:**
```typescript
import { createImageFields, createArrayMediaFields, createVideoFields } from "../lib/mediaFieldHelpers";
```

**Remove the old validation utilities and option arrays** (lines 4-39):
```typescript
// DELETE THESE - they're now in mediaFieldHelpers.ts
const createPositionValidator = // ... 
const createZoomValidator = // ...
const imagePositionOptions = // ...
const aspectRatioOptions = // ...
```

**Replace Hero section image fields** (lines 208-286):

**Remove:**
```typescript
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
    // ... rest of duplicated fields
},
// ... all the duplicated position/zoom/aspect ratio fields
```

**Replace with:**
```typescript
...createImageFields({
    fieldNamePrefix: "hero",
    defaultPosition: "center",
    defaultAspectRatio: "landscape",
    includeZoom: true,
    includeFinePosition: true,
    useFinePositionCollapsible: true,
    customDescription: {
        upload: "Featured image for the hero section",
    },
}),
```

**Replace About section image fields** (lines 929-1068):

**Remove all the duplicated about image fields and replace with:**
```typescript
...createImageFields({
    fieldNamePrefix: "about",
    defaultPosition: "center", 
    defaultAspectRatio: "portrait",
    includeZoom: true,
    includeFinePosition: true,
    useFinePositionCollapsible: true,
    customDescription: {
        upload: "Image to display in the about section (e.g., your photo)",
    },
}),
```

**Replace Project Media Arrays** (lines 388-578 and 646-836):

In both the featured project media array and project items media array, replace the fields array:

**Remove the existing fields array and replace with:**
```typescript
fields: [
    ...createArrayMediaFields(),
    createVideoFields(),
],
```

---

## Testing Steps

1. **Generate Types**:
   ```bash
   npm run generate:types
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Test All Media Sections**:
   - **Hero Section**: Upload image, test position/aspect ratio/zoom controls
   - **Featured Project**: Add media items, test all controls
   - **Project Items**: Add project with media, test controls
   - **About Section**: Upload image, test all controls

4. **Verify Field Functionality**:
   - Position presets work correctly
   - Aspect ratio changes take effect
   - Zoom controls appear when image is uploaded
   - Fine position controls appear when image is uploaded
   - Advanced controls are collapsed by default

5. **Frontend Testing**:
   - Check that images render correctly
   - Verify positioning and aspect ratios apply
   - Test live preview functionality

---

## Code Size Comparison

**Before**: ~1,178 lines
**After**: ~600-700 lines (~40% reduction)

**Specific reductions**:
- Hero image fields: 78 lines → 8 lines (90% reduction)
- About image fields: 139 lines → 8 lines (94% reduction)  
- Project media arrays: 190 lines each → 4 lines each (98% reduction)

---

## Benefits Achieved

- ✅ **Massive code reduction** - Eliminated 400+ lines of duplication
- ✅ **Single source of truth** - All media controls defined once
- ✅ **Consistent behavior** - All image controls work identically
- ✅ **Easy maintenance** - Update media controls in one place
- ✅ **Flexible customization** - Factory options allow per-context customization
- ✅ **Type safety** - Full TypeScript support maintained

---

## Verification Checklist

- [ ] Portfolio.ts imports helper functions correctly
- [ ] Hero image fields render and function correctly
- [ ] About image fields render and function correctly
- [ ] Featured project media arrays work correctly
- [ ] Project items media arrays work correctly
- [ ] All position/zoom/aspect ratio controls work
- [ ] Fine positioning controls appear when images are uploaded
- [ ] Frontend image rendering unchanged
- [ ] Live preview functionality works
- [ ] File size reduced significantly
- [ ] No console errors
- [ ] TypeScript types updated

---

## Rollback Plan

If issues arise:

1. **Restore Validation Functions**: Add back the original validators at the top of Portfolio.ts
2. **Restore Option Arrays**: Add back `imagePositionOptions` and `aspectRatioOptions` 
3. **Restore Individual Fields**: Replace factory function calls with the original field definitions
4. **Remove Helper File**: Delete `src/lib/mediaFieldHelpers.ts`
5. **Regenerate Types**: Run `npm run generate:types`

---

## Next Steps

Once Step 2 is complete and verified:
- Proceed to **Step 3: Fix Field Organization**
- Consider creating additional factory functions for other repeated patterns
- Document the new helper functions for team use