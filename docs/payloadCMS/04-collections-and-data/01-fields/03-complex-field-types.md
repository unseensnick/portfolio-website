# Payload Complex Data Fields

This document covers the complex data fields in Payload CMS that handle structured data, relationships, and advanced content types.

## Array Field

The Array Field is used when you need a set of "repeating" fields. It stores an array of objects containing fields that you define. These fields can be of any type, including other arrays, to achieve infinitely nested data structures.

```typescript
import type { Field } from "payload";

export const MyArrayField: Field = {
    type: "array",
    name: "slider",
    fields: [
        // ...
    ],
};
```

### Array Field Use Cases

Arrays are useful for many different types of content from simple to complex, such as:

- A "slider" with an image (upload field) and a caption (text field)
- Navigational structures where editors can specify nav items containing pages (relationship field), an "open in new tab" checkbox field
- Event agenda "timeslots" where you need to specify start & end time (date field), label (text field), and Learn More page relationship

### Array Field Config Options

| Option             | Description                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                                                                                                                 |
| `label`            | Text used as the heading in the Admin Panel or an object with keys for each language. Auto-generated from name if not defined                                                                                                               |
| `fields`           | Array of field types to correspond to each row of the Array                                                                                                                                                                                 |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                                                                                                                          |
| `minRows`          | A number for the fewest allowed items during validation when a value is present                                                                                                                                                             |
| `maxRows`          | A number for the most allowed items during validation when a value is present                                                                                                                                                               |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                                                                                                               |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                                                                                                                         |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                                                                                                                     |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel                                                                                             |
| `defaultValue`     | Provide an array of row data to be used for this field's default value                                                                                                                                                                      |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config. If enabled, a separate, localized set of all data within this Array will be kept, so there is no need to specify each nested field as localized |
| `required`         | Require this field to have a value                                                                                                                                                                                                          |
| `labels`           | Customize the row labels appearing in the Admin dashboard                                                                                                                                                                                   |
| `admin`            | Admin-specific configuration                                                                                                                                                                                                                |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                                   |
| `interfaceName`    | Create a top level, reusable Typescript interface & GraphQL type                                                                                                                                                                            |
| `dbName`           | Custom table name for the field when using SQL Database Adapter (Postgres). Auto-generated from name if not defined                                                                                                                         |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                                                                                                                 |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                                                                                                               |

### Array Field Admin Options

| Option                | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `initCollapsed`       | Set the initial collapsed state                              |
| `components.RowLabel` | React component to be rendered as the label on the array row |
| `isSortable`          | Disable order sorting by setting this value to false         |

### Array Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "slider",
            type: "array",
            label: "Image Slider",
            minRows: 2,
            maxRows: 10,
            interfaceName: "CardSlider",
            labels: {
                singular: "Slide",
                plural: "Slides",
            },
            fields: [
                {
                    name: "title",
                    type: "text",
                },
                {
                    name: "image",
                    type: "upload",
                    relationTo: "media",
                    required: true,
                },
                {
                    name: "caption",
                    type: "text",
                },
            ],
        },
    ],
};
```

### Array Field Row Label Component

```typescript
'use client'
import { useRowLabel } from '@payloadcms/ui'

export const ArrayRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()

  const customLabel = `${data.title || 'Slide'} ${String(rowNumber).padStart(2, '0')} `

  return <div>Custom Label: {customLabel}</div>
}
```

## Blocks Field

The Blocks Field is incredibly powerful, storing an array of objects based on the fields that you define, where each item in the array is a "block" with its own unique schema.

```typescript
import type { Field } from "payload";

export const MyBlocksField: Field = {
    type: "blocks",
    name: "layout",
    blocks: [
        // ...
    ],
};
```

### Blocks Field Use Cases

Blocks are a great way to create a flexible content model that can be used to build a wide variety of content types, including:

- A layout builder tool that grants editors to design highly customizable page or post layouts. Blocks could include configs such as Quote, CallToAction, Slider, Content, Gallery, or others
- A form builder tool where available block configs might be Text, Select, or Checkbox
- Virtual event agenda "timeslots" where a timeslot could either be a Break, a Presentation, or a BreakoutSession

### Blocks Field Config Options

| Option             | Description                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                                                                                                                 |
| `label`            | Text used as the heading in the Admin Panel or an object with keys for each language. Auto-generated from name if not defined                                                                                                               |
| `blocks`           | Array of block configs to be made available to this field                                                                                                                                                                                   |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                                                                                                                          |
| `minRows`          | A number for the fewest allowed items during validation when a value is present                                                                                                                                                             |
| `maxRows`          | A number for the most allowed items during validation when a value is present                                                                                                                                                               |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                                                                                                               |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                                                                                                                         |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                                                                                                                     |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API response or the Admin Panel                                                                                    |
| `defaultValue`     | Provide an array of block data to be used for this field's default value                                                                                                                                                                    |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config. If enabled, a separate, localized set of all data within this field will be kept, so there is no need to specify each nested field as localized |
| `unique`           | Enforce that each entry in the Collection has a unique value for this field                                                                                                                                                                 |
| `labels`           | Customize the block row labels appearing in the Admin dashboard                                                                                                                                                                             |
| `admin`            | Admin-specific configuration                                                                                                                                                                                                                |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                                   |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                                                                                                                 |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                                                                                                               |

### Blocks Field Admin Options

| Option             | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| `group`            | Text or localization object used to group this Block in the Blocks Drawer |
| `initCollapsed`    | Set the initial collapsed state                                           |
| `isSortable`       | Disable order sorting by setting this value to false                      |
| `disableBlockName` | Hide the blockName field by setting this value to true                    |

### Block Configs

Blocks are defined as separate configs of their own:

| Option                 | Description                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `slug`                 | Identifier for this block type. Will be saved on each block as the blockType property                                                     |
| `fields`               | Array of fields to be stored in this block                                                                                                |
| `labels`               | Customize the block labels that appear in the Admin dashboard. Auto-generated from slug if not defined                                    |
| `imageURL`             | Provide a custom image thumbnail to help editors identify this block in the Admin UI                                                      |
| `imageAltText`         | Customize this block's image thumbnail alt text                                                                                           |
| `interfaceName`        | Create a top level, reusable Typescript interface & GraphQL type                                                                          |
| `graphQL.singularName` | Text to use for the GraphQL schema name. Auto-generated from slug if not defined. NOTE: this is set for deprecation, prefer interfaceName |
| `dbName`               | Custom table name for this block type when using SQL Database Adapter (Postgres). Auto-generated from slug if not defined                 |
| `custom`               | Extension point for adding custom data (e.g. for plugins)                                                                                 |

### Auto-generated Block Data

In addition to the field data that you define on each block, Payload will store two additional properties on each block:

- **blockType**: The blockType is saved as the slug of the block that has been selected
- **blockName**: The Admin Panel provides each block with a blockName field which optionally allows editors to label their blocks for better editability and readability. This can be visually hidden via admin.disableBlockName

### Blocks Field Example

```typescript
import { Block, CollectionConfig } from "payload";

const QuoteBlock: Block = {
    slug: "Quote",
    imageURL: "https://google.com/path/to/image.jpg",
    imageAltText: "A nice thumbnail image to show what this block looks like",
    interfaceName: "QuoteBlock",
    fields: [
        {
            name: "quoteHeader",
            type: "text",
            required: true,
        },
        {
            name: "quoteText",
            type: "text",
        },
    ],
};

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "layout",
            type: "blocks",
            minRows: 1,
            maxRows: 20,
            blocks: [QuoteBlock],
        },
    ],
};
```

### Block References

If you have multiple blocks used in multiple places, your Payload Config can grow in size, potentially sending more data to the client and requiring more processing on the server. However, you can optimize performance by defining each block once in your Payload Config and then referencing its slug wherever it's used instead of passing the entire block config.

To do this, define the block in the blocks array of the Payload Config. Then, in the Blocks Field, pass the block slug to the blockReferences array - leaving the blocks array empty for compatibility reasons.

```typescript
import { buildConfig } from "payload";
import { lexicalEditor, BlocksFeature } from "@payloadcms/richtext-lexical";

const config = buildConfig({
    // Define the block once
    blocks: [
        {
            slug: "TextBlock",
            fields: [
                {
                    name: "text",
                    type: "text",
                },
            ],
        },
    ],
    collections: [
        {
            slug: "collection1",
            fields: [
                {
                    name: "content",
                    type: "blocks",
                    blockReferences: ["TextBlock"],
                    blocks: [], // Required to be empty, for compatibility reasons
                },
            ],
        },
    ],
});
```

**Important:** Blocks referenced in the blockReferences array are treated as isolated from the collection / global config. This has the following implications:

- The block config cannot be modified or extended in the collection config. It will be identical everywhere it's referenced
- Access control for blocks referenced in the blockReferences are run only once - data from the collection will not be available in the block's access control

### Lexical Integration

When using blocks within Lexical editor, you can customize how the block is rendered in the Lexical editor itself by specifying custom components:

- `admin.components.Label` - pass a custom React component here to customize the way that the label is rendered for this block
- `admin.components.Block` - pass a component here to completely override the way the block is rendered in Lexical with your own component

This is super handy if you'd like to present your editors with a very deliberate and nicely designed block "preview" right in your rich text.

For example, if you have a gallery block, you might want to actually render the gallery of images directly in your Lexical block. With the admin.components.Block property, you can do exactly that!

**Tip:** If you customize the way your block is rendered in Lexical, you can import utility components to easily edit / remove your block - so that you don't have to build all of this yourself.

To import these utility components for one of your custom blocks, you can import the following:

```typescript
// Utility components available for custom blocks
import {
    // Edit block buttons (choose the one that corresponds to your usage)
    // When clicked, this will open a drawer with your block's fields
    // so your editors can edit them
    InlineBlockEditButton,
    BlockEditButton,

    // Buttons that will remove this block from Lexical
    // (choose the one that corresponds to your usage)
    InlineBlockRemoveButton,
    BlockRemoveButton,

    // The label that should be rendered for an inline block
    InlineBlockLabel,

    // The default "container" that is rendered for an inline block
    // if you want to re-use it
    InlineBlockContainer,

    // The default "collapsible" UI that is rendered for a regular block
    // if you want to re-use it
    BlockCollapsible,
} from "@payloadcms/richtext-lexical/client";
```

## Group Field

The Group Field allows Fields to be nested under a common property name. It also groups fields together visually in the Admin Panel.

```typescript
import type { Field } from "payload";

export const MyGroupField: Field = {
    type: "group",
    name: "pageMeta",
    fields: [
        // ...
    ],
};
```

### Group Field Config Options

| Option             | Description                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                                                                                                                 |
| `fields`           | Array of field types to nest within this Group                                                                                                                                                                                              |
| `label`            | Used as a heading in the Admin Panel and to name the generated GraphQL type. Defaults to the field name, if defined                                                                                                                         |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                                                                                                                          |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                                                                                                               |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                                                                                                                         |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                                                                                                                     |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel                                                                                             |
| `defaultValue`     | Provide an object of data to be used for this field's default value                                                                                                                                                                         |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config. If enabled, a separate, localized set of all data within this Group will be kept, so there is no need to specify each nested field as localized |
| `admin`            | Admin-specific configuration                                                                                                                                                                                                                |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                                   |
| `interfaceName`    | Create a top level, reusable Typescript interface & GraphQL type                                                                                                                                                                            |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                                                                                                                 |
| `virtual`          | Provide true to disable field in the database                                                                                                                                                                                               |

### Group Field Admin Options

| Option       | Description                                                                                                                                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hideGutter` | Set this property to true to hide this field's gutter within the Admin Panel. The field gutter is rendered as a vertical line and padding, but often if this field is nested within a Group, Block, or Array, you may want to hide the gutter |

### Group Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "pageMeta",
            type: "group",
            interfaceName: "Meta",
            fields: [
                {
                    name: "title",
                    type: "text",
                    required: true,
                    minLength: 20,
                    maxLength: 100,
                },
                {
                    name: "description",
                    type: "textarea",
                    required: true,
                    minLength: 40,
                    maxLength: 160,
                },
            ],
        },
    ],
};
```

### Presentational Group Fields

You can also use the Group field to only visually group fields without affecting the data structure. Not defining a `name` will render just the grouped fields.

```typescript
{
  label: 'Page meta',
  type: 'group',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
  ],
}
```

## Relationship Field

The Relationship Field is one of the most powerful fields Payload features. It provides the ability to easily relate documents together.

```typescript
import type { Field } from "payload";

export const MyRelationshipField: Field = {
    type: "relationship",
    name: "category",
    relationTo: "categories",
};
```

### Relationship Field Use Cases

The Relationship field is used in a variety of ways, including:

- To add Product documents to an Order document
- To allow for an Order to feature a placedBy relationship to either an Organization or User collection
- To assign Category documents to Post documents

### Relationship Field Config Options

| Option             | Description                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                     |
| `relationTo`       | Provide one or many collection slugs to be able to assign relationships to                                                                      |
| `filterOptions`    | A query to filter which options appear in the UI and validate against                                                                           |
| `hasMany`          | Boolean when, if set to true, allows this field to have many relations instead of only one                                                      |
| `minRows`          | A number for the fewest allowed items during validation when a value is present. Used with hasMany                                              |
| `maxRows`          | A number for the most allowed items during validation when a value is present. Used with hasMany                                                |
| `maxDepth`         | Sets a maximum population depth for this field, regardless of the remaining depth when this field is reached                                    |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                          |
| `unique`           | Enforce that each entry in the Collection has a unique value for this field                                                                     |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                              |
| `index`            | Build an index for this field to produce faster queries. Set this field to true if your users will perform queries on this field's data often   |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                   |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                             |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                         |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel |
| `defaultValue`     | Provide data to be used for this field's default value                                                                                          |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                      |
| `required`         | Require this field to have a value                                                                                                              |
| `admin`            | Admin-specific configuration                                                                                                                    |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                       |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                     |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                   |
| `graphQL`          | Custom graphQL configuration for the field                                                                                                      |

### Relationship Field Admin Options

| Property      | Description                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `isSortable`  | Set to true if you'd like this field to be sortable within the Admin UI using drag and drop (only works when hasMany is set to true) |
| `allowCreate` | Set to false if you'd like to disable the ability to create new documents from within the relationship field                         |
| `allowEdit`   | Set to false if you'd like to disable the ability to edit documents from within the relationship field                               |
| `sortOptions` | Define a default sorting order for the options within a Relationship field's dropdown                                                |
| `placeholder` | Define a custom text or function to replace the generic default placeholder                                                          |
| `appearance`  | Set to drawer or select to change the behavior of the field. Defaults to select                                                      |

### Sort Options

You can specify sortOptions in two ways:

```typescript
// As a string (global default)
sortOptions: 'fieldName'

// As an object (per collection)
sortOptions: {
  "pages": "fieldName1",
  "posts": "-fieldName2", // descending order
  "categories": "fieldName3"
}
```

### Filtering Relationship Options

Filter available options dynamically:

```typescript
{
  name: 'purchase',
  type: 'relationship',
  relationTo: ['products', 'services'],
  filterOptions: ({ relationTo, siblingData }) => {
    if (relationTo === 'products') {
      return {
        stock: { greater_than: siblingData.quantity },
      }
    }

    if (relationTo === 'services') {
      return {
        isAvailable: { equals: true },
      }
    }
  },
}
```

Filter function receives:

| Property      | Description                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blockData`   | The data of the nearest parent block. Will be undefined if the field is not within a block or when called on a Filter component within the list view                                  |
| `data`        | An object containing the full collection or global document currently being edited. Will be an empty object when called on a Filter component within the list view                    |
| `id`          | The id of the current document being edited. Will be undefined during the create operation or when called on a Filter component within the list view                                  |
| `relationTo`  | The collection slug to filter against, limited to this field's relationTo property                                                                                                    |
| `req`         | The Payload Request, which contains references to payload, user, locale, and more                                                                                                     |
| `siblingData` | An object containing document data that is scoped to only fields within the same parent of this field. Will be an empty object when called on a Filter component within the list view |
| `user`        | An object containing the currently authenticated user                                                                                                                                 |

### Relationship Data Shapes

**Has One:**

```typescript
// Configuration
{
  name: 'owner',
  type: 'relationship',
  relationTo: 'users',
  hasMany: false,
}

// Data saved
{
  "owner": "6031ac9e1289176380734024"
}

// Query
?where[owner][equals]=6031ac9e1289176380734024
```

**Has One - Polymorphic:**

```typescript
// Configuration
{
  name: 'owner',
  type: 'relationship',
  relationTo: ['users', 'organizations'],
  hasMany: false,
}

// Data saved
{
  "owner": {
    "relationTo": "organizations",
    "value": "6031ac9e1289176380734024"
  }
}

// Query by value
?where[owner.value][equals]=6031ac9e1289176380734024

// Query by collection
?where[owner.relationTo][equals]=organizations
```

**Has Many:**

```typescript
// Configuration
{
  name: 'owners',
  type: 'relationship',
  relationTo: 'users',
  hasMany: true,
}

// Data saved
{
  "owners": ["6031ac9e1289176380734024", "602c3c327b811235943ee12b"]
}

// Query
?where[owners][equals]=6031ac9e1289176380734024
```

**Has Many - Polymorphic:**

```typescript
// Configuration
{
  name: 'owners',
  type: 'relationship',
  relationTo: ['users', 'organizations'],
  hasMany: true,
}

// Data saved
{
  "owners": [
    {
      "relationTo": "users",
      "value": "6031ac9e1289176380734024"
    },
    {
      "relationTo": "organizations",
      "value": "602c3c327b811235943ee12b"
    }
  ]
}
```

### Linking Virtual Fields with Relationships

```typescript
{
  collections: [
    {
      slug: 'categories',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
    {
      slug: 'posts',
      fields: [
        {
          type: 'relationship',
          name: 'category',
          relationTo: 'categories',
        },
        {
          type: 'text',
          name: 'categoryTitle',
          virtual: 'category.title',
        },
      ],
    },
  ],
}
```

The `categoryTitle` field will always be populated with the corresponding value, even if the current depth is 0. You can also query and sort by this field. The relationship must not be hasMany: true or polymorphic. The path can be deeply nested into 2 or more relationship fields, for example post.category.title as long as all the relationship fields meet the above requirement.

## Upload Field

The Upload Field allows for the selection of a Document from a Collection supporting Uploads, and formats the selection as a thumbnail in the Admin Panel.

```typescript
import type { Field } from "payload";

export const MyUploadField: Field = {
    type: "upload",
    name: "backgroundImage",
    relationTo: "media",
};
```

**Important:** To use the Upload Field, you must have a Collection configured to allow Uploads.

### Upload Field Use Cases

Upload fields are useful for a variety of use cases, such as:

- To provide a Page with a featured image
- To allow for a Product to deliver a downloadable asset like PDF or MP3
- To give a layout building block the ability to feature a background image

### Upload Field Config Options

| Option             | Description                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                      |
| `relationTo`       | Provide a single collection slug to allow this field to accept a relation to. Note: the related collection must be configured to support Uploads |
| `filterOptions`    | A query to filter which options appear in the UI and validate against                                                                            |
| `hasMany`          | Boolean which, if set to true, allows this field to have many relations instead of only one                                                      |
| `minRows`          | A number for the fewest allowed items during validation when a value is present. Used with hasMany                                               |
| `maxRows`          | A number for the most allowed items during validation when a value is present. Used with hasMany                                                 |
| `maxDepth`         | Sets a number limit on iterations of related documents to populate when queried                                                                  |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                           |
| `unique`           | Enforce that each entry in the Collection has a unique value for this field                                                                      |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                               |
| `index`            | Build an index for this field to produce faster queries. Set this field to true if your users will perform queries on this field's data often    |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                    |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                              |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                          |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel  |
| `defaultValue`     | Provide data to be used for this field's default value                                                                                           |
| `displayPreview`   | Enable displaying preview of the uploaded file. Overrides related Collection's displayPreview option                                             |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                       |
| `required`         | Require this field to have a value                                                                                                               |
| `admin`            | Admin-specific configuration                                                                                                                     |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                        |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                      |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                    |
| `graphQL`          | Custom graphQL configuration for the field                                                                                                       |

### Upload Field Admin Options

| Option             | Description                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `defaultColumns`   | Array of field names that correspond to which columns to show in the relationship table. Default is the collection config |
| `allowCreate`      | Set to false to remove the controls for making new related documents from this field                                      |
| `components.Label` | Override the default Label of the Field Component                                                                         |

### Upload Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "backgroundImage",
            type: "upload",
            relationTo: "media",
            required: true,
        },
    ],
};
```

### Filtering Upload Options

```typescript
const uploadField = {
    name: "image",
    type: "upload",
    relationTo: "media",
    filterOptions: {
        mimeType: { contains: "image" },
    },
};
```

**Note:** When an upload field has both filterOptions and a custom validate function, the api will not validate filterOptions unless you call the default upload field validation function imported from payload/shared in your validate function.

### Bi-directional relationships

The upload field on its own is used to reference documents in an upload collection. This can be considered a "one-way" relationship. If you wish to allow an editor to visit the upload document and see where it is being used, you may use the join field in the upload enabled collection. Read more about bi-directional relationships using the Join field.

**Note:** When a relationship field has both filterOptions and a custom validate function, the api will not validate filterOptions unless you call the default relationship field validation function imported from payload/shared in your validate function.

## Rich Text Field

The Rich Text Field lets editors write and format dynamic content in a familiar interface. The content is saved as JSON in the database and can be converted to HTML or any other format needed.

```typescript
import type { Field } from "payload";

export const MyRichTextField: Field = {
    type: "richText",
    name: "content",
};
```

### Rich Text Field Config Options

| Option             | Description                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                     |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                          |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                              |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                   |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                             |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                         |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel |
| `defaultValue`     | Provide data to be used for this field's default value                                                                                          |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                      |
| `required`         | Require this field to have a value                                                                                                              |
| `admin`            | Admin-specific configuration                                                                                                                    |
| `editor`           | Customize or override the rich text editor                                                                                                      |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                       |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                     |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                   |

### Rich Text Field Admin Options

The Rich Text Field inherits all default admin options from the base Field Admin Config. Further customization can be done with editor-specific options.

**Note:** For extensive editor-specific options and how to build custom rich text elements, refer to the rich text editor documentation.

### Rich Text Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "content",
            type: "richText",
            required: true,
        },
    ],
};
```

Consistent with Payload's goal of making you learn as little of Payload as possible, customizing and using the Rich Text Editor does not involve learning how to develop for a Payload rich text editor. Instead, you can invest your time and effort into learning the underlying open-source tools that will allow you to apply your learnings elsewhere as well.
