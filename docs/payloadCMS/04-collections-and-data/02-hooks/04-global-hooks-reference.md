# Global Hooks Reference

Global Hooks are Hooks that run on Global Documents. They allow you to execute your own logic during specific events of the Document lifecycle.

## Configuration

To add Hooks to a Global, use the `hooks` property in your Global Config:

```typescript
import type { GlobalConfig } from 'payload'

export const GlobalWithHooks: GlobalConfig = {
  // ...
  hooks: {
    beforeValidate: [(args) => {...}],
    beforeChange: [(args) => {...}],
    beforeRead: [(args) => {...}],
    afterChange: [(args) => {...}],
    afterRead: [(args) => {...}],
  }
}
```

> **Tip:** You can also set hooks on the field-level to isolate hook logic to specific fields.

## Config Options

All Global Hooks accept an array of synchronous or asynchronous functions. Each Global Hook receives specific arguments based on its own type, and has the ability to modify specific outputs.

## Available Hooks

### beforeValidate

Runs during the `update` operation. This hook allows you to add or format data before the incoming data is validated server-side.

**Note:** This does not run before client-side validation. Validation order:
1. `validate` runs on the client
2. if successful, `beforeValidate` runs on the server
3. `validate` runs on the server

```typescript
import type { GlobalBeforeValidateHook } from 'payload'

const beforeValidateHook: GlobalBeforeValidateHook = async ({
  data,
  req,
  originalDoc,
}) => {
  return data
}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| global | The Global in which this Hook is running against |
| context | Custom context passed between Hooks |
| data | The incoming data passed through the operation |
| originalDoc | The Document before changes are applied |
| req | The Web Request object (mocked for Local API operations) |

### beforeChange

Immediately following validation, beforeChange hooks will run within the `update` operation. At this stage, you can be confident that the data that will be saved to the document is valid in accordance to your field validations. You can optionally modify the shape of data to be saved.

```typescript
import type { GlobalBeforeChangeHook } from 'payload'

const beforeChangeHook: GlobalBeforeChangeHook = async ({
  data,
  req,
  originalDoc,
}) => {
  return data
}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| global | The Global in which this Hook is running against |
| context | Custom context passed between hooks |
| data | The incoming data passed through the operation |
| originalDoc | The Document before changes are applied |
| req | The Web Request object (mocked for Local API operations) |

### afterChange

After a global is updated, the afterChange hook runs. Use this hook to purge caches of your applications, sync site data to CRMs, and more.

```typescript
import type { GlobalAfterChangeHook } from 'payload'

const afterChangeHook: GlobalAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  return data
}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| global | The Global in which this Hook is running against |
| context | Custom context passed between hooks |
| data | The incoming data passed through the operation |
| doc | The resulting Document after changes are applied |
| previousDoc | The Document before changes were applied |
| req | The Web Request object (mocked for Local API operations) |

### beforeRead

Runs before `findOne` global operation is transformed for output by afterRead. This hook fires before hidden fields are removed and before localized fields are flattened into the requested locale. Using this Hook will provide you with all locales and all hidden fields via the doc argument.

```typescript
import type { GlobalBeforeReadHook } from 'payload'

const beforeReadHook: GlobalBeforeReadHook = async ({
  doc,
  req,
}) => {...}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| global | The Global in which this Hook is running against |
| context | Custom context passed between hooks |
| doc | The resulting Document after changes are applied |
| req | The Web Request object (mocked for Local API operations) |

### afterRead

Runs as the last step before a global is returned. Flattens locales, hides protected fields, and removes fields that users do not have access to.

```typescript
import type { GlobalAfterReadHook } from 'payload'

const afterReadHook: GlobalAfterReadHook = async ({
  doc,
  req,
  findMany,
}) => {...}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| global | The Global in which this Hook is running against |
| context | Custom context passed between hooks |
| findMany | Boolean to denote if this hook is running against finding one, or finding many (useful in versions) |
| doc | The resulting Document after changes are applied |
| query | The Query of the request |
| req | The Web Request object (mocked for Local API operations) |

## TypeScript

Payload exports a type for each Global hook:

```typescript
import type {
  GlobalBeforeValidateHook,
  GlobalBeforeChangeHook,
  GlobalAfterChangeHook,
  GlobalBeforeReadHook,
  GlobalAfterReadHook,
} from 'payload'
```

## Example Usage

Here's a complete example of a Global with hooks:

```typescript
import type { GlobalConfig } from 'payload'

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        // Format data before validation
        if (data.siteName) {
          data.siteName = data.siteName.trim()
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        // Add timestamp for when settings were last modified
        data.lastModified = new Date().toISOString()
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // Purge cache when settings change
        if (doc.siteName !== previousDoc?.siteName) {
          await req.payload.logger.info('Site name changed, purging cache')
          // Implement cache purging logic here
        }
      },
    ],
    beforeRead: [
      async ({ doc, req }) => {
        // Log when settings are accessed
        await req.payload.logger.info('Site settings accessed')
        return doc
      },
    ],
    afterRead: [
      async ({ doc, req }) => {
        // Transform data for output
        return {
          ...doc,
          // Add computed fields or transform existing ones
          displayName: `${doc.siteName} | ${doc.tagline}`,
        }
      },
    ],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'lastModified',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}

export default SiteSettings
```