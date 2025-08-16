# Field Hooks Reference

Field Hooks are Hooks that run on Documents on a per-field basis. They allow you to execute your own logic during specific events of the Document lifecycle. Field Hooks offer incredible potential for isolating your logic from the rest of your Collection Hooks and Global Hooks.

## Configuration

To add Hooks to a Field, use the `hooks` property in your Field Config:

```typescript
import type { Field } from 'payload'

export const FieldWithHooks: Field = {
  // ...
  hooks: {
    beforeValidate: [(args) => {...}],
    beforeChange: [(args) => {...}],
    beforeDuplicate: [(args) => {...}],
    afterChange: [(args) => {...}],
    afterRead: [(args) => {...}],
  }
}
```

## Config Options

All Field Hooks accept an array of synchronous or asynchronous functions. These functions can optionally modify the return value of the field before the operation continues. All Field Hooks are formatted to accept the same arguments, although some arguments may be undefined based on the specific hook type.

> **Important:** Due to GraphQL's typed nature, changing the type of data that you return from a field will produce errors in the GraphQL API. If you need to change the shape or type of data, consider Collection Hooks or Global Hooks instead.

## Common Arguments

The following arguments are provided to all Field Hooks:

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against. If the field belongs to a Global, this will be null |
| context | Custom context passed between Hooks |
| data | In the afterRead hook this is the full Document. In create and update operations, this is the incoming data passed through the operation |
| field | The Field which the Hook is running against |
| findMany | Boolean to denote if this hook is running against finding one, or finding many within the afterRead hook |
| global | The Global in which this Hook is running against. If the field belongs to a Collection, this will be null |
| operation | The name of the operation that this hook is running within. Useful within beforeValidate, beforeChange, and afterChange hooks to differentiate between create and update operations |
| originalDoc | In the update operation, this is the Document before changes were applied. In the afterChange hook, this is the resulting Document |
| overrideAccess | A boolean to denote if the current operation is overriding Access Control |
| path | The path to the Field in the schema |
| previousDoc | In the afterChange Hook, this is the Document before changes were applied |
| previousSiblingDoc | The sibling data of the Document before changes being applied, only in beforeChange and afterChange hook |
| previousValue | The previous value of the field, before changes, only in beforeChange and afterChange hooks |
| req | The Web Request object (mocked for Local API operations) |
| schemaPath | The path of the Field in the schema |
| siblingData | The data of sibling fields adjacent to the field that the Hook is running against |
| siblingDocWithLocales | The sibling data of the Document with all Locales |
| siblingFields | The sibling fields of the field which the hook is running against |
| value | The value of the Field |

> **Tip:** It's a good idea to conditionally scope your logic based on which operation is executing. For example, if you are writing a beforeChange hook, you may want to perform different logic based on if the current operation is `create` or `update`.

## Available Hooks

### beforeValidate

Runs during the `create` and `update` operations. This hook allows you to add or format data before the incoming data is validated server-side.

**Note:** This does not run before client-side validation. Validation order:
1. `validate` runs on the client
2. if successful, `beforeValidate` runs on the server
3. `validate` runs on the server

```typescript
import type { Field } from 'payload'

const usernameField: Field = {
  name: 'username',
  type: 'text',
  hooks: {
    beforeValidate: [
      ({ value }) => {
        // Trim whitespace and convert to lowercase
        return value.trim().toLowerCase()
      },
    ],
  },
}
```

In this example, the beforeValidate hook is used to process the username field. The hook takes the incoming value of the field and transforms it by trimming whitespace and converting it to lowercase. This ensures that the username is stored in a consistent format in the database.

### beforeChange

Immediately following validation, beforeChange hooks will run within `create` and `update` operations. At this stage, you can be confident that the field data that will be saved to the document is valid in accordance to your field validations.

```typescript
import type { Field } from 'payload'

const emailField: Field = {
  name: 'email',
  type: 'email',
  hooks: {
    beforeChange: [
      ({ value, operation }) => {
        if (operation === 'create') {
          // Perform additional validation or transformation for 'create' operation
        }
        return value
      },
    ],
  },
}
```

In the emailField, the beforeChange hook checks the operation type. If the operation is `create`, it performs additional validation or transformation on the email field value. This allows for operation-specific logic to be applied to the field.

### afterChange

The afterChange hook is executed after a field's value has been changed and saved in the database. This hook is useful for post-processing or triggering side effects based on the new value of the field.

```typescript
import type { Field } from 'payload'

const membershipStatusField: Field = {
  name: 'membershipStatus',
  type: 'select',
  options: [
    { label: 'Standard', value: 'standard' },
    { label: 'Premium', value: 'premium' },
    { label: 'VIP', value: 'vip' },
  ],
  hooks: {
    afterChange: [
      ({ value, previousValue, req }) => {
        if (value !== previousValue) {
          // Log or perform an action when the membership status changes
          console.log(
            `User ID ${req.user.id} changed their membership status from ${previousValue} to ${value}.`,
          )
          // Here, you can implement actions that could track conversions from one tier to another
        }
      },
    ],
  },
}
```

In this example, the afterChange hook is used with a membershipStatusField, which allows users to select their membership level (Standard, Premium, VIP). The hook monitors changes in the membership status. When a change occurs, it logs the update and can be used to trigger further actions, such as tracking conversion from one tier to another or notifying them about changes in their membership benefits.

### afterRead

The afterRead hook is invoked after a field value is read from the database. This is ideal for formatting or transforming the field data for output.

```typescript
import type { Field } from 'payload'

const dateField: Field = {
  name: 'createdAt',
  type: 'date',
  hooks: {
    afterRead: [
      ({ value }) => {
        // Format date for display
        return new Date(value).toLocaleDateString()
      },
    ],
  },
}
```

Here, the afterRead hook for the dateField is used to format the date into a more readable format using `toLocaleDateString()`. This hook modifies the way the date is presented to the user, making it more user-friendly.

### beforeDuplicate

The beforeDuplicate field hook is called on each locale (when using localization), when duplicating a document. It may be used when documents having the exact same properties may cause issue. This gives you a way to avoid duplicate names on unique, required fields or when external systems expect non-repeating values on documents.

This hook gets called before the `beforeValidate` and `beforeChange` hooks are called.

By Default, unique and required text fields Payload will append "- Copy" to the original document value. The default is not added if your field has its own, you must return non-unique values from your beforeDuplicate hook to avoid errors or enable the disableDuplicate option on the collection.

Here is an example of a number field with a hook that increments the number to avoid unique constraint errors when duplicating a document:

```typescript
import type { Field } from 'payload'

const numberField: Field = {
  name: 'number',
  type: 'number',
  hooks: {
    // increment existing value by 1
    beforeDuplicate: [
      ({ value }) => {
        return (value ?? 0) + 1
      },
    ],
  },
}
```

## TypeScript

Payload exports a type for field hooks which can be accessed and used as follows:

```typescript
import type { FieldHook } from 'payload'

// Field hook type is a generic that takes three arguments:
// 1: The document type
// 2: The value type
// 3: The sibling data type

type ExampleFieldHook = FieldHook<ExampleDocumentType, string, SiblingDataType>

const exampleFieldHook: ExampleFieldHook = (args) => {
  const {
    value, // Typed as `string` as shown above
    data, // Typed as a Partial of your ExampleDocumentType
    siblingData, // Typed as a Partial of SiblingDataType
    originalDoc, // Typed as ExampleDocumentType
    operation,
    req,
  } = args

  // Do something here...

  return value // should return a string as typed above, undefined, or null
}
```

## Complete Example

Here's a complete example of a field with multiple hooks:

```typescript
import type { Field } from 'payload'

const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  hooks: {
    beforeValidate: [
      ({ value, siblingData }) => {
        // Auto-generate slug from title if not provided
        if (!value && siblingData.title) {
          return siblingData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return value
      },
    ],
    beforeChange: [
      ({ value, operation, originalDoc }) => {
        // Only allow slug changes on create, not update
        if (operation === 'update' && originalDoc?.slug) {
          return originalDoc.slug
        }
        return value
      },
    ],
    beforeDuplicate: [
      ({ value }) => {
        // Append timestamp to avoid duplicate slugs
        return `${value}-${Date.now()}`
      },
    ],
    afterChange: [
      ({ value, previousValue, req, siblingData }) => {
        // Log slug changes for SEO tracking
        if (value !== previousValue) {
          req.payload.logger.info(
            `Slug changed from "${previousValue}" to "${value}" for ${siblingData.title}`
          )
        }
      },
    ],
    afterRead: [
      ({ value, req }) => {
        // Add full URL for frontend convenience
        if (value && req.headers.host) {
          return {
            slug: value,
            fullUrl: `https://${req.headers.host}/${value}`,
          }
        }
        return value
      },
    ],
  },
}
```

This example demonstrates a comprehensive slug field that:
- Auto-generates slugs from titles
- Prevents slug changes after creation
- Handles duplicates during document duplication
- Logs changes for tracking
- Enhances output with full URLs