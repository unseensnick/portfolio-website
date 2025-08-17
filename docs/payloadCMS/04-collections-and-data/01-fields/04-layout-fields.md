# Payload Layout & Presentational Fields

This document covers the layout and presentational fields in Payload CMS that organize and present other fields in the Admin Panel without storing data in the database.

## Row Field

The Row Field is presentational-only and only affects the Admin Panel. By using it, you can arrange fields next to each other horizontally.

```typescript
import type { Field } from "payload";

export const MyRowField: Field = {
    type: "row",
    fields: [
        // ...
    ],
};
```

### Row Field Config Options

| Option   | Description                                                                |
| -------- | -------------------------------------------------------------------------- |
| `fields` | Array of field types to nest within this Row                               |
| `admin`  | Admin-specific configuration (excluding description, readOnly, and hidden) |
| `custom` | Extension point for adding custom data (e.g. for plugins)                  |

### Row Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            type: "row",
            fields: [
                {
                    name: "label",
                    type: "text",
                    required: true,
                    admin: {
                        width: "50%",
                    },
                },
                {
                    name: "value",
                    type: "text",
                    required: true,
                    admin: {
                        width: "50%",
                    },
                },
            ],
        },
    ],
};
```

**Key Points:**

- Use the `admin.width` property on nested fields to control their horizontal sizing
- Useful for organizing related fields side by side
- Does not affect data structure, only visual layout

## Tabs Field

The Tabs Field is presentational-only (unless a tab is named) and only affects the Admin Panel. By using it, you can place fields within a nice layout component that separates certain sub-fields by a tabbed interface.

```typescript
import type { Field } from "payload";

export const MyTabsField: Field = {
    type: "tabs",
    tabs: [
        // ...
    ],
};
```

### Tabs Field Config Options

| Option   | Description                                               |
| -------- | --------------------------------------------------------- |
| `tabs`   | Array of tabs to render within this Tabs field            |
| `admin`  | Admin-specific configuration                              |
| `custom` | Extension point for adding custom data (e.g. for plugins) |

### Tab-specific Config

Each tab must have either a `name` or `label` and the required `fields` array:

| Option          | Description                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| `name`          | Groups field data into an object when stored and retrieved from the database (optional)                       |
| `label`         | The label to render on the tab itself. Required when name is undefined, defaults to name converted to words   |
| `fields`        | The fields to render within this tab                                                                          |
| `description`   | Optionally render a description within this tab to describe the contents of the tab itself                    |
| `interfaceName` | Create a top level, reusable Typescript interface & GraphQL type (name must be present)                       |
| `virtual`       | Provide true to disable field in the database, or provide a string path to link the field with a relationship |

### Tabs Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            type: "tabs",
            tabs: [
                {
                    label: "Tab One Label",
                    description:
                        "This will appear within the tab above the fields.",
                    fields: [
                        {
                            name: "someTextField",
                            type: "text",
                            required: true,
                        },
                    ],
                },
                {
                    name: "tabTwo",
                    label: "Tab Two Label",
                    interfaceName: "TabTwo", // optional (name must be present)
                    fields: [
                        {
                            name: "numberField", // accessible via tabTwo.numberField
                            type: "number",
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
};
```

**Key Points:**

- **Unnamed tabs** are presentational only and don't affect data structure
- **Named tabs** group field data into an object (similar to Group field)
- Use `description` to provide context about tab contents
- Perfect for separating different sections of content (Hero, Page Layout, SEO, etc.)

## Collapsible Field

The Collapsible Field is presentational-only and only affects the Admin Panel. By using it, you can place fields within a nice layout component that can be collapsed / expanded.

```typescript
import type { Field } from "payload";

export const MyCollapsibleField: Field = {
    type: "collapsible",
    label: "Advanced Settings",
    fields: [
        // ...
    ],
};
```

### Collapsible Field Config Options

| Option   | Description                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`  | A label to render within the header of the collapsible component. This can be a string, function or react component. Function/components receive ({ data, path }) as args |
| `fields` | Array of field types to nest within this Collapsible                                                                                                                      |
| `admin`  | Admin-specific configuration                                                                                                                                              |
| `custom` | Extension point for adding custom data (e.g. for plugins)                                                                                                                 |

### Collapsible Field Admin Options

| Option          | Description                     |
| --------------- | ------------------------------- |
| `initCollapsed` | Set the initial collapsed state |

### Collapsible Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            label: ({ data }) => data?.title || "Untitled",
            type: "collapsible",
            fields: [
                {
                    name: "title",
                    type: "text",
                    required: true,
                },
                {
                    name: "someTextField",
                    type: "text",
                    required: true,
                },
            ],
        },
    ],
};
```

**Key Points:**

- The `label` can be a string, function, or React component
- Label functions/components receive `({ data, path })` as arguments
- Useful for grouping advanced or optional settings
- Does not affect data structure, only visual organization

## UI Field

The UI (user interface) Field gives you a ton of power to add your own React components directly into the Admin Panel, nested directly within your other fields. It has absolutely no effect on the data of your documents. It is presentational-only.

```typescript
import type { Field } from "payload";

export const MyUIField: Field = {
    type: "ui",
    name: "myCustomUIField",
    admin: {
        components: {
            Field: "/path/to/MyCustomUIField",
        },
    },
};
```

### UI Field Use Cases

With the UI Field, you can:

- Add a custom message or block of text within the body of an Edit View to describe the purpose of surrounding fields
- Add a "Refund" button to an Order's Edit View sidebar, which might make a fetch call to a custom refund endpoint
- Add a "view page" button into a Pages List View to give editors a shortcut to view a page on the frontend of the site
- Build a "clear cache" button or similar mechanism to manually clear caches of specific documents

### UI Field Config Options

| Option                    | Description                                                                                           |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| `name`                    | A unique identifier for this field                                                                    |
| `label`                   | Human-readable label for this UI field                                                                |
| `admin.components.Field`  | React component to be rendered for this field within the Edit View                                    |
| `admin.components.Cell`   | React component to be rendered as a Cell within collection List views                                 |
| `admin.disableListColumn` | Set disableListColumn to true to prevent the UI field from appearing in the list view column selector |
| `custom`                  | Extension point for adding custom data (e.g. for plugins)                                             |

### UI Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "myCustomUIField",
            type: "ui",
            admin: {
                components: {
                    Field: "/path/to/MyCustomUIField",
                    Cell: "/path/to/MyCustomUICell",
                },
            },
        },
    ],
};
```

### Creating Custom UI Components

**Field Component Example:**

```typescript
'use client'
import React from 'react'
import { useFormFields } from '@payloadcms/ui'

export const MyCustomUIField: React.FC = () => {
  const [fields, dispatchFields] = useFormFields()

  const handleClick = () => {
    // Custom logic here
    console.log('Current form data:', fields)
  }

  return (
    <div>
      <h3>Custom UI Component</h3>
      <p>This is a custom component in your form!</p>
      <button onClick={handleClick}>
        Perform Custom Action
      </button>
    </div>
  )
}
```

**Cell Component Example:**

```typescript
'use client'
import React from 'react'

export const MyCustomUICell: React.FC = ({ rowData }) => {
  return (
    <div>
      <button onClick={() => window.open(`/preview/${rowData.id}`)}>
        Preview
      </button>
    </div>
  )
}
```

### UI Field Component Props

UI Field components receive the same props as other field components:

| Property      | Description                        |
| ------------- | ---------------------------------- |
| `field`       | The field configuration object     |
| `path`        | Path to the field in the form      |
| `readOnly`    | Whether the field is read-only     |
| `user`        | Currently authenticated user       |
| `permissions` | Field permissions for current user |

For Cell components:

| Property   | Description                                     |
| ---------- | ----------------------------------------------- |
| `rowData`  | Complete row data for the list item             |
| `cellData` | Specific cell data (usually null for UI fields) |

### Advanced UI Field Examples

**Custom Action Button:**

```typescript
'use client'
import React, { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export const RefundButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { id } = useDocumentInfo()

  const handleRefund = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${id}/refund`, {
        method: 'POST',
      })
      if (response.ok) {
        alert('Refund processed successfully!')
      }
    } catch (error) {
      alert('Error processing refund')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleRefund}
      disabled={loading}
      style={{
        padding: '10px 20px',
        backgroundColor: '#ff6b6b',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: loading ? 'not-allowed' : 'pointer'
      }}
    >
      {loading ? 'Processing...' : 'Process Refund'}
    </button>
  )
}
```

**Information Display:**

```typescript
'use client'
import React from 'react'
import { useFormFields } from '@payloadcms/ui'

export const PostWordCount: React.FC = () => {
  const [fields] = useFormFields()

  const content = fields?.content?.value || ''
  const wordCount = content
    .split(' ')
    .filter(word => word.length > 0)
    .length

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      marginBottom: '20px'
    }}>
      <h4>Content Statistics</h4>
      <p><strong>Word Count:</strong> {wordCount}</p>
      <p><strong>Character Count:</strong> {content.length}</p>
      {wordCount > 500 && (
        <p style={{ color: '#28a745' }}>✓ Good length for SEO</p>
      )}
    </div>
  )
}
```

### UI Field Best Practices

1. **Performance**: Keep UI components lightweight as they re-render with form changes
2. **Accessibility**: Ensure custom components follow accessibility guidelines
3. **Styling**: Use consistent styling with Payload's design system when possible
4. **Error Handling**: Always handle errors gracefully in custom actions
5. **User Feedback**: Provide clear feedback for user interactions

**Key Points:**

- UI Fields are completely custom and presentational
- Perfect for extending the Admin Panel with custom functionality
- Can access form data and interact with external APIs
- Should not affect document data structure
- Useful for workflow enhancements and custom business logic
