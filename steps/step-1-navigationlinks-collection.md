# Step 1: Create NavigationLinks Collection

## Objective
Replace the inline navigation links array in Portfolio.ts with a reusable NavigationLinks collection, following the pattern established by Tags.ts.

## Current Problem
- Navigation links are hardcoded inline (lines 124-158 in Portfolio.ts)
- Cannot reuse links across different contexts
- Difficult to manage and validate link data
- Inconsistent with the relationship pattern used for technologies/skills

## Solution Overview
Create a new `NavigationLinks.ts` collection similar to `Tags.ts` that can be referenced via relationships.

---

## Implementation Steps

### 1. Create NavigationLinks Collection

**File**: `src/collections/NavigationLinks.ts`

```typescript
import type { CollectionConfig } from "payload";

export const NavigationLinks: CollectionConfig = {
    slug: "navigationLinks",
    admin: {
        useAsTitle: "label",
        defaultColumns: ["label", "href", "category", "order", "updatedAt"],
    },
    access: {
        read: () => true, // Allow public reading for frontend access
        create: ({ req }) => !!req.user, // Only authenticated users can create
        update: ({ req }) => !!req.user, // Only authenticated users can update
        delete: ({ req }) => !!req.user, // Only authenticated users can delete
    },
    fields: [
        {
            name: "label",
            type: "text",
            required: true,
            label: "Link Text",
            admin: {
                description: "Text to display for this navigation link (e.g., 'About', 'Projects', 'Contact')",
            },
        },
        {
            name: "href",
            type: "text",
            required: true,
            label: "Link URL",
            admin: {
                description: "URL or anchor link (e.g., '#about', '/contact', 'https://github.com/username')",
                placeholder: "#about",
            },
        },
        {
            name: "category",
            type: "select",
            required: true,
            label: "Link Category",
            options: [
                {
                    label: "Main Navigation",
                    value: "main",
                },
                {
                    label: "Footer Links",
                    value: "footer",
                },
                {
                    label: "Social Links",
                    value: "social",
                },
            ],
            defaultValue: "main",
            admin: {
                description: "Categorize this link to organize how it's used across your portfolio",
            },
        },
        {
            name: "icon",
            type: "text",
            label: "Icon Name (Optional)",
            admin: {
                description: "Optional icon name from Lucide icons library (e.g., 'user', 'github', 'mail')",
                placeholder: "user",
            },
        },
        {
            name: "order",
            type: "number",
            label: "Display Order",
            defaultValue: 0,
            admin: {
                description: "Order in which this link appears in navigation (lower numbers appear first)",
            },
        },
        {
            name: "external",
            type: "checkbox",
            label: "External Link",
            defaultValue: false,
            admin: {
                description: "Check if this link opens in a new tab (for external URLs)",
            },
        },
        {
            name: "description",
            type: "textarea",
            label: "Description (Optional)",
            admin: {
                description: "Optional description or notes about this link for your reference",
                placeholder: "e.g., Links to my GitHub profile, Contact form page...",
            },
        },
    ],
};
```

### 2. Register NavigationLinks Collection

**File**: `src/payload.config.ts`

Find the `collections` array and add the new collection:

```typescript
// Add to imports
import { NavigationLinks } from './collections/NavigationLinks'

// Add to collections array
export default buildConfig({
  // ... other config
  collections: [
    Media,
    Portfolio,
    Tags,
    NavigationLinks, // Add this line
    Users,
  ],
  // ... rest of config
})
```

### 3. Update Portfolio Collection

**File**: `src/collections/Portfolio.ts`

Replace the current navigation links array (lines 124-158) with a relationship field:

**Remove this block:**
```typescript
{
    name: "links",
    type: "array",
    label: "Navigation Links",
    admin: {
        description: "Links to display in the navigation menu",
    },
    fields: [
        {
            name: "href",
            type: "text",
            required: true,
            label: "Link URL",
            admin: {
                description: "URL or anchor link (e.g., #about) for this navigation item",
            },
        },
        {
            name: "label",
            type: "text",
            required: true,
            label: "Link Text",
            admin: {
                description: "Text to display for this navigation link",
            },
        },
        {
            name: "icon",
            type: "text",
            label: "Icon Name",
            admin: {
                description: "Optional icon name (from Lucide icons library)",
            },
        },
    ],
},
```

**Replace with:**
```typescript
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

3. **Test Admin Panel**:
   - Navigate to `/admin/collections/navigationLinks`
   - Create a few test navigation links:
     - Label: "About", Href: "#about", Category: "main", Order: 1
     - Label: "Projects", Href: "#projects", Category: "main", Order: 2
     - Label: "Contact", Href: "#contact", Category: "main", Order: 3

4. **Test Portfolio Navigation**:
   - Go to `/admin/collections/portfolio`
   - Edit your portfolio document
   - In the Navigation & Logo section, select the navigation links you created
   - Save and verify the relationship works

5. **Frontend Testing**:
   - Check that the frontend still renders navigation correctly
   - Verify live preview functionality

---

## Frontend Code Updates Required

**File**: `src/components/nav.tsx` (or similar navigation component)

Update the component to use the new relationship structure:

**Before:**
```typescript
// Accessing: portfolio.nav.links[0].label
portfolio.nav.links?.map((link) => (
  <a href={link.href}>{link.label}</a>
))
```

**After:**
```typescript
// Accessing: portfolio.nav.navigationLinks[0].label  
portfolio.nav.navigationLinks?.map((link) => (
  <a href={link.href}>{link.label}</a>
))
```

---

## Data Migration Notes

- **Existing Data**: Current navigation links data will remain in the database but won't display until you recreate them as NavigationLinks records and select them in the Portfolio
- **No Data Loss**: The old `links` field data remains intact as a backup
- **Manual Migration**: You'll need to manually recreate navigation links in the new collection

---

## Verification Checklist

- [ ] NavigationLinks collection appears in admin panel
- [ ] Can create/edit/delete navigation links
- [ ] Portfolio collection shows relationship field instead of array
- [ ] Can select navigation links in Portfolio editor
- [ ] Frontend navigation renders correctly
- [ ] Live preview still works
- [ ] TypeScript types are updated
- [ ] No console errors in browser/server

---

## Rollback Plan

If issues arise:

1. **Restore Portfolio.ts**: Revert the changes to restore the original `links` array field
2. **Remove Collection**: Delete `NavigationLinks.ts` and remove from `payload.config.ts`
3. **Regenerate Types**: Run `npm run generate:types`

---

## Next Steps

Once Step 1 is complete and verified:
- Proceed to **Step 2: Media Field Factories**
- Consider creating additional navigation link categories (footer, social) for future use