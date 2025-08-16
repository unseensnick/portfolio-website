# Payload CMS Admin Panel Complete Guide

## Table of Contents

1. [Admin Panel Overview](#admin-panel-overview)
2. [Project Structure](#project-structure)
3. [Admin Configuration Options](#admin-configuration-options)
4. [Customizing CSS & SCSS](#customizing-css--scss)
5. [Page Metadata](#page-metadata)
6. [Preview Feature](#preview-feature)
7. [Document Locking](#document-locking)
8. [User Preferences](#user-preferences)
9. [React Hooks](#react-hooks)

---

## Admin Panel Overview

Payload dynamically generates a beautiful, fully type-safe Admin Panel to manage your users and data. It is highly performant, even with 100+ fields, and is translated in over 30 languages. Within the Admin Panel you can manage content, render your site, preview drafts, diff versions, and so much more.

The Admin Panel is designed to white-label your brand. You can endlessly customize and extend the Admin UI by swapping in your own Custom Components—everything from simple field labels to entire views can be modified or replaced to perfectly tailor the interface for your editors.

The Admin Panel is written in TypeScript and built with React using the Next.js App Router. It supports React Server Components, enabling the use of the Local API on the front-end. You can install Payload into any existing Next.js app in just one line and deploy it anywhere.

### Key Features

- **Redesigned Admin Panel**: Collapsible sidebar that's open by default, providing greater extensibility and enhanced horizontal real estate
- **Internationalization**: Translated in over 30 languages with automatic language detection
- **Theme Support**: Light and dark modes with user preference persistence
- **Performance**: Highly optimized even with 100+ fields

---

## Project Structure

The Admin Panel serves as the entire HTTP layer for Payload, providing a full CRUD interface for your app. This means that both the REST and GraphQL APIs are simply Next.js Routes that exist directly alongside your front-end application.

Once you install Payload, the following files and directories will be created in your app:

```
app
├── (payload)
│   ├── admin
│   │   └── [[...segments]]
│   │       ├── page.tsx
│   │       └── not-found.tsx
│   ├── api
│   │   └── [...slug]
│   │       └── route.ts
│   ├── graphql
│   │   └── route.ts
│   ├── graphql-playground
│   │   └── route.ts
│   ├── custom.scss
│   └── layout.tsx
```

### Route Organization

All Payload routes are nested within the `(payload)` route group. This creates a boundary between the Admin Panel and the rest of your application by scoping all layouts and styles. The `layout.tsx` file within this directory is where Payload manages the html tag of the document to set proper lang and dir attributes, etc.

- **admin directory**: Contains all the pages related to the interface itself
- **api and graphql directories**: Contains all the routes related to the REST API and GraphQL API
- **custom.scss file**: Where you can add or override globally-oriented styles in the Admin Panel

### Auto-generated Files

All auto-generated files will contain the following comments at the top of each file:

```javascript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */,
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
```

**Note**: If you don't intend to use the Admin Panel, REST API, or GraphQL API, you can opt-out by simply deleting their corresponding directories within your Next.js app.

---

## Admin Configuration Options

All root-level options for the Admin Panel are defined in your Payload Config under the admin property:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    // ...
  },
})
```

### Available Options

| Option | Description |
|--------|-------------|
| `avatar` | Set account profile picture. Options: gravatar, default or a custom React component |
| `autoLogin` | Used to automate log-in for dev and demonstration convenience |
| `components` | Component overrides that affect the entirety of the Admin Panel |
| `custom` | Any custom properties you wish to pass to the Admin Panel |
| `dateFormat` | The date format that will be used for all dates within the Admin Panel. Any valid date-fns format pattern can be used |
| `livePreview` | Enable real-time editing for instant visual feedback of your front-end application |
| `meta` | Base metadata to use for the Admin Panel |
| `routes` | Replace built-in Admin Panel routes with your own custom routes |
| `suppressHydrationWarning` | If set to true, suppresses React hydration mismatch warnings during the hydration of the root `<html>` tag. Defaults to false |
| `theme` | Restrict the Admin Panel theme to use only one of your choice. Default is all |
| `timezones` | Configure the timezone settings for the admin panel |
| `user` | The slug of the Collection that you want to allow to login to the Admin Panel |

### The Admin User Collection

To specify which Collection to allow to login to the Admin Panel, pass the `admin.user` key equal to the slug of any auth-enabled Collection:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    user: 'admins', 
  },
})
```

**Important Notes:**

- The Admin Panel can only be used by a single auth-enabled Collection
- To enable authentication for a Collection, simply set `auth: true` in the Collection's configuration
- By default, if you have not specified a Collection, Payload will automatically provide a User Collection with access to the Admin Panel

### Role-based Access Control

It is possible to allow multiple user types into the Admin Panel with limited permissions, known as role-based access control (RBAC). For example:

- `super-admin` - full access to the Admin Panel to perform any action
- `editor` - limited access to the Admin Panel to only manage content

To implement this, add a roles or similar field to your auth-enabled Collection, then use the `access.admin` property to grant or deny access based on the value of that field.

### Customizing Routes

You have full control over the routes that Payload binds itself to. This includes both Root-level Routes and Admin-level Routes.

#### Root-level Routes

Root-level routes are those that are not behind the `/admin` path:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  routes: {
    admin: '/custom-admin-route', 
  },
})
```

Available root-level route options:

| Option | Default route | Description |
|--------|---------------|-------------|
| `admin` | `/admin` | The Admin Panel itself |
| `api` | `/api` | The REST API base path |
| `graphQL` | `/graphql` | The GraphQL API base path |
| `graphQLPlayground` | `/graphql-playground` | The GraphQL Playground |

#### Admin-level Routes

Admin-level routes are those behind the `/admin` path:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    routes: {
      account: '/my-account', 
    },
  },
})
```

Available admin-level route options:

| Option | Default route | Description |
|--------|---------------|-------------|
| `account` | `/account` | The user's account page |
| `createFirstUser` | `/create-first-user` | The page to create the first user |
| `forgot` | `/forgot` | The password reset page |
| `inactivity` | `/logout-inactivity` | The page to redirect to after inactivity |
| `login` | `/login` | The login page |
| `logout` | `/logout` | The logout page |
| `reset` | `/reset` | The password reset page |
| `unauthorized` | `/unauthorized` | The unauthorized page |

### Timezones

The `admin.timezones` configuration allows you to configure timezone settings for the Admin Panel:

| Option | Description |
|--------|-------------|
| `supportedTimezones` | An array of label/value options for selectable timezones where the value is the IANA name eg. America/Detroit |
| `defaultTimezone` | The value of the default selected timezone. eg. America/Los_Angeles |

Timezones are validated by checking the value against the list of IANA timezones supported via the Intl API, specifically `Intl.supportedValuesOf('timeZone')`.

**Important**: You must enable timezones on each individual date field via `timezone: true`.

---

## Customizing CSS & SCSS

Customizing the Payload Admin Panel through CSS alone is one of the easiest and most powerful ways to customize the look and feel of the dashboard. To allow for this level of customization, Payload:

- Exposes a root-level stylesheet for you to inject custom selectors
- Provides a CSS library that can be easily overridden or extended
- Uses BEM naming conventions so that class names are globally accessible

### Global CSS

Global CSS refers to the CSS that is applied to the entire Admin Panel. You can add your own global CSS through the root `custom.scss` file of your app. This file is loaded into the root of the Admin Panel and can be used to inject custom selectors or styles however needed.

Example of targeting the Dashboard View:

```scss
.dashboard {
  background-color: red; 
}
```

**Note**: If you are building Custom Components, it is best to import your own stylesheets directly into your components, rather than using the global stylesheet.

### Specificity Rules

All Payload CSS is encapsulated inside CSS layers under `@layer payload-default`. Any custom css will now have the highest possible specificity.

A layer `@layer payload` is also provided if you want to use layers and ensure that your styles are applied after payload.

To override existing styles while respecting previous specificity rules:

```scss
@layer payload-default {
  // my styles within the Payload specificity
}
```

### Re-using Payload SCSS Variables and Utilities

You can re-use Payload's SCSS variables and utilities in your own stylesheets by importing from the UI package:

```scss
@import '~@payloadcms/ui/scss';
```

### CSS Library

Payload uses BEM naming conventions for all CSS within the Admin UI. You can override any built-in styles easily, including targeting nested components and their various component states.

You can also override Payload's built-in CSS Variables. These variables are widely consumed by the Admin Panel, so modifying them has a significant impact on the look and feel of the Admin UI.

#### Available Variables

The following types of variables are defined and can be overridden:

- **Breakpoints**
- **Colors**
  - Base color shades (white to black by default)
  - Success / warning / error color shades
  - Theme-specific colors (background, input background, text color, etc.)
  - Elevation colors (used to determine how "bright" something should be when compared to the background)
- **Sizing**
  - Horizontal gutter
- **Transition speeds**
- **Font sizes**
- **Etc.**

**Warning**: If you're overriding colors or theme elevations, make sure to consider how your changes will affect dark mode.

### Dark Mode

Colors are designed to automatically adapt to theme of the Admin Panel. By default, Payload automatically overrides all `--theme-elevation` colors and inverts all success / warning / error shades to suit dark mode. Base theme variables like `--theme-bg`, `--theme-text`, etc. are also updated.

---

## Page Metadata

Every page within the Admin Panel automatically receives dynamic, auto-generated metadata derived from live document data, the user's current locale, and more. This includes the page title, description, og:image, etc. and requires no additional configuration.

Metadata is fully configurable at the root level and cascades down to individual collections, documents, and custom views. All metadata is injected into Next.js' `generateMetadata` function.

### Metadata Levels

Within the Admin Panel, metadata can be customized at the following levels:

- **Root Metadata**
- **Collection Metadata**
- **Global Metadata**
- **View Metadata**

### Root Metadata

Root Metadata is applied to all pages within the Admin Panel. This controls things like the suffix appended onto each page's title, the favicon, and Open Graph data.

```javascript
{
  // ...
  admin: {
    meta: {
      title: 'My Admin Panel',
      description: 'The best admin panel in the world',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        },
      ],
    },
  },
}
```

#### Root Metadata Options

| Key | Type | Description |
|-----|------|-------------|
| `defaultOGImageType` | dynamic (default), static, or off | The type of default OG image to use. If set to dynamic, Payload will use Next.js image generation to create an image with the title of the page. If set to static, Payload will use the defaultOGImage URL. If set to off, Payload will not generate an OG image |
| `titleSuffix` | string | A suffix to append to the end of the title of every page. Defaults to "- Payload" |
| `[keyof Metadata]` | unknown | Any other properties that Next.js supports within the generateMetadata function |

### Icons Configuration

The Icons Config corresponds to the `<link>` tags used to specify icons for the Admin Panel:

```javascript
{
  // ...
  admin: {
    meta: {
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          url: '/apple-touch-icon.png',
        },
      ],
    },
  },
}
```

### Open Graph

Open Graph metadata controls how URLs are displayed when shared on social media platforms:

```javascript
{
  // ...
  admin: {
    meta: {
      openGraph: {
        description: 'The best admin panel in the world',
        images: [
          {
            url: 'https://example.com/image.jpg',
            width: 800,
            height: 600,
          },
        ],
        siteName: 'Payload',
        title: 'My Admin Panel',
      },
    },
  },
}
```

### Robots

Control the robots meta tag within the `<head>` of the Admin Panel:

```javascript
{
  // ...
  admin: {
    meta: {
      robots: 'noindex, nofollow',
    },
  },
}
```

By default, the Admin Panel is set to prevent search engines from indexing pages.

#### Prevent Crawling

To prevent pages from being crawled altogether, add a `robots.txt` file to your root directory:

```
User-agent: *
Disallow: /admin/
```

**Note**: If you've customized the path to your Admin Panel via `config.routes`, update the Disallow directive accordingly.

### Collection Metadata

Collection Metadata is applied to all pages within any given Collection:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    meta: {
      title: 'My Collection',
      description: 'The best collection in the world',
    },
  },
}
```

### Global Metadata

Global Metadata is applied to all pages within any given Global:

```javascript
import { GlobalConfig } from 'payload'

export const MyGlobal: GlobalConfig = {
  // ...
  admin: {
    meta: {
      title: 'My Global',
      description: 'The best admin panel in the world',
    },
  },
}
```

### View Metadata

View Metadata is applied to specific Views within the Admin Panel:

```javascript
{
  // ...
  admin: {
    views: {
      dashboard: {
        meta: {
          title: 'My Dashboard',
          description: 'The best dashboard in the world',
        }
      },
    },
  },
}
```

---

## Preview Feature

Preview is a feature that allows you to generate a direct link to your front-end application. When enabled, a "preview" button will appear on the Edit View within the Admin Panel with an href pointing to the URL you provide.

**Note**: Preview is different than Live Preview. Live Preview loads your app within an iframe and renders it in the Admin Panel. Preview generates a direct link to your front-end application.

### Basic Usage

To add Preview, pass a function to the `admin.preview` property in any Collection Config or Global Config:

```javascript
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    preview: ({ slug }) => `http://localhost:3000/${slug}`,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
    },
  ],
}
```

### Preview Function Options

The preview function resolves to a string that points to your front-end application. This can be an absolute URL or a relative path, and can run async if needed.

#### Arguments

| Path | Description |
|------|-------------|
| `doc` | The data of the Document being edited. This includes changes that have not yet been saved |
| `options` | An object with additional properties |

#### Options Object Properties

| Path | Description |
|------|-------------|
| `locale` | The current locale of the Document being edited |
| `req` | The Payload Request object |
| `token` | The JWT token of the currently authenticated in user |

#### Fully Qualified URLs

For applications requiring fully qualified URLs (such as Vercel Preview Deployments):

```javascript
preview: (doc, { req }) => `${req.protocol}//${req.host}/${doc.slug}` 
```

### Draft Preview

The Preview feature can be used to achieve "Draft Preview". After clicking the preview button, you can enter "draft mode" within your front-end application to view draft content instead of published content.

#### Next.js Implementation

**Step 1: Format the Preview URL**

```javascript
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    preview: ({ slug, collection }) => {
      const encodedParams = new URLSearchParams({
        slug,
        collection,
        path: `/${slug}`,
        previewSecret: process.env.PREVIEW_SECRET || '',
      })

      return `/preview?${encodedParams.toString()}` 
    },
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
    },
  ],
}
```

**Step 2: Create the Preview Route**

Create an API route that verifies the preview secret, authenticates the user, and enters draft mode:

```typescript
// /app/preview/route.ts

import type { CollectionSlug, PayloadRequest } from 'payload'
import { getPayload } from 'payload'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import configPromise from '@payload-config'

export async function GET(
  req: {
    cookies: {
      get: (name: string) => {
        value: string
      }
    }
  } & Request,
): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  const { searchParams } = new URL(req.url)

  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug
  const slug = searchParams.get('slug')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('You are not allowed to preview this page', {
      status: 403,
    })
  }

  if (!path || !collection || !slug) {
    return new Response('Insufficient search params', { status: 404 })
  }

  if (!path.startsWith('/')) {
    return new Response(
      'This endpoint can only be used for relative previews',
      { status: 500 },
    )
  }

  let user

  try {
    user = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    })
  } catch (error) {
    payload.logger.error(
      { err: error },
      'Error verifying token for live preview',
    )
    return new Response('You are not allowed to preview this page', {
      status: 403,
    })
  }

  const draft = await draftMode()

  if (!user) {
    draft.disable()
    return new Response('You are not allowed to preview this page', {
      status: 403,
    })
  }

  // You can add additional checks here to see if the user is allowed to preview this page

  draft.enable()

  redirect(path)
}
```

**Step 3: Query Draft Content**

In your front-end application, detect draft mode and adjust your queries to include drafts:

```typescript
// /app/[slug]/page.tsx

export default async function Page({ params: paramsPromise }) {
  const { slug = 'home' } = await paramsPromise

  const { isEnabled: isDraftMode } = await draftMode()

  const payload = await getPayload({ config })

  const page = await payload.find({
    collection: 'pages',
    depth: 0,
    draft: isDraftMode, 
    limit: 1,
    overrideAccess: isDraftMode,
    where: {
      slug: {
        equals: slug,
      },
    },
  })?.then(({ docs }) => docs?.[0])

  if (page === null) {
    return notFound()
  }

  return (
    <main>
      <h1>{page?.title}</h1>
    </main>
  )
}
```

---

## Document Locking

Document locking in Payload ensures that only one user at a time can edit a document, preventing data conflicts and accidental overwrites. When a document is locked, other users are prevented from making changes until the lock is released.

### How It Works

When a user starts editing a document, Payload locks it for that user. If another user attempts to access the same document, they will be notified that it is currently being edited and can choose from:

- **View in Read-Only**: View the document without the ability to make changes
- **Take Over**: Take over editing from the current user, which locks the document for the new editor and notifies the original user
- **Return to Dashboard**: Navigate away from the locked document

The lock automatically expires after a set period of inactivity, configurable using the `duration` property.

### Configuration

Document locking is enabled by default, but you can customize or disable it for any collection or global.

#### Basic Configuration

```javascript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    // other fields...
  ],
  lockDocuments: {
    duration: 600, // Duration in seconds
  },
}
```

#### Locking Options

| Option | Description |
|--------|-------------|
| `lockDocuments` | Enables or disables document locking for the collection or global. By default, document locking is enabled. Set to an object to configure, or set to `false` to disable locking |
| `duration` | Specifies the duration (in seconds) for how long a document remains locked without user interaction. The default is 300 seconds (5 minutes) |

### Impact on APIs

Document locking affects both the Local and REST APIs. If a document is locked, concurrent users will not be able to perform updates or deletes on that document (including globals). Attempts to update or delete a locked document will receive an error.

### Overriding Locks

For operations like update and delete, Payload includes an `overrideLock` option. This boolean flag, when set to `false`, enforces document locks.

By default, `overrideLock` is set to `true`, which means document locks are ignored. To enforce locks:

```javascript
const result = await payload.update({
  collection: 'posts',
  id: '123',
  data: {
    title: 'New title',
  },
  overrideLock: false, // Enforces the document lock
})
```

This is useful in scenarios where administrative privileges or specific workflows require you to override the lock.

---

## User Preferences

As users interact with the Admin Panel, you might want to store their preferences persistently, so when they revisit the Admin Panel in a different session or from a different device, they can pick right back up where they left off.

### Out-of-the-Box Preferences

Payload handles the persistence of user preferences in several ways:

- Columns in the Collection List View: their active state and order
- The user's last active Locale
- The "collapsed" state of blocks, array, and collapsible fields
- The last-known state of the Nav component

**Important**: All preferences are stored on an individual user basis. Payload automatically recognizes the user via all provided authentication methods.

### Use Cases

This API is used significantly for internal operations of the Admin Panel, but you can build your own React components that allow users to set preferences:

- **Color picker**: "Remember" the last used colors for easy access
- **Custom Nav component**: Store collapsed state of accordion-style UI elements
- **Recently accessed documents**: Provide shortcuts to recently accessed documents
- **Custom dashboard preferences**: Store user-specific dashboard configurations

### Database Structure

Payload automatically creates an internally used `payload-preferences` Collection:

| Key | Value |
|-----|-------|
| `id` | A unique ID for each preference stored |
| `key` | A unique key that corresponds to the preference |
| `user.value` | The ID of the user that is storing its preference |
| `user.relationTo` | The slug of the Collection that the user is logged in as |
| `value` | The value of the preference. Can be any data shape that you need |
| `createdAt` | A timestamp of when the preference was created |
| `updatedAt` | A timestamp set to the last time the preference was updated |

### Using Preferences in Components

The Payload Admin Panel offers a `usePreferences` hook for use within the Admin Panel:

#### Available Methods

**getPreference**
Async method to retrieve a user's preferences by key. Returns a promise containing the resulting preference value.

**Arguments:**
- `key`: the key of your preference to retrieve

**setPreference**
Async method to set a user preference. Returns void.

**Arguments:**
- `key`: the key of your preference to set
- `value`: the value of your preference that you're looking to set

#### Example Implementation

```javascript
'use client'
import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { usePreferences } from '@payloadcms/ui'

const lastUsedColorsPreferenceKey = 'last-used-colors'

export function CustomComponent() {
  const { getPreference, setPreference } = usePreferences()

  // Store the last used colors in local state
  const [lastUsedColors, setLastUsedColors] = useState([])

  // Callback to add a color to the last used colors
  const updateLastUsedColors = useCallback(
    (color) => {
      // First, check if color already exists in last used colors.
      // If it already exists, there is no need to update preferences
      const colorAlreadyExists = lastUsedColors.indexOf(color) > -1

      if (!colorAlreadyExists) {
        const newLastUsedColors = [...lastUsedColors, color]

        setLastUsedColors(newLastUsedColors)
        setPreference(lastUsedColorsPreferenceKey, newLastUsedColors)
      }
    },
    [lastUsedColors, setPreference],
  )

  // Retrieve preferences on component mount
  // This will only be run one time, because the `getPreference` method never changes
  useEffect(() => {
    const asyncGetPreference = async () => {
      const lastUsedColorsFromPreferences = await getPreference(
        lastUsedColorsPreferenceKey,
      )
      setLastUsedColors(lastUsedColorsFromPreferences)
    }

    asyncGetPreference()
  }, [getPreference])

  return (
    <div>
      <button type="button" onClick={() => updateLastUsedColors('red')}>
        Use red
      </button>
      <button type="button" onClick={() => updateLastUsedColors('blue')}>
        Use blue
      </button>
      <button type="button" onClick={() => updateLastUsedColors('purple')}>
        Use purple
      </button>
      <button type="button" onClick={() => updateLastUsedColors('yellow')}>
        Use yellow
      </button>
      {lastUsedColors && (
        <Fragment>
          <h5>Last used colors:</h5>
          <ul>
            {lastUsedColors?.map((color) => <li key={color}>{color}</li>)}
          </ul>
        </Fragment>
      )}
    </div>
  )
}
```

---

## React Hooks

Payload provides a variety of powerful React Hooks that can be used within your own Custom Components, such as Custom Fields. With them, you can interface with Payload itself to build just about any type of complex customization.

**Reminder**: All Custom Components are React Server Components by default. Hooks are only available in client-side environments. To use hooks, ensure your component is a client component.

### useField

The `useField` hook is used internally within all field components. It manages sending and receiving a field's state from its parent form. When you build a Custom Field Component, you'll be responsible for sending and receiving the field's value to and from the form.

```javascript
'use client'
import type { TextFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'

export const CustomTextField: TextFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField({ path }) 

  return (
    <div>
      <p>{path}</p>
      <input
        onChange={(e) => {
          setValue(e.target.value)
        }}
        value={value}
      />
    </div>
  )
}
```

#### Arguments

| Property | Description |
|----------|-------------|
| `path` | If you do not provide a path, name will be used instead. This is the path to the field in the form data |
| `validate` | A validation function executed client-side before submitting the form to the server |
| `disableFormData` | If true, the field will not be included in the form data when the form is submitted |
| `hasRows` | If true, the field will be treated as a field with rows. This is useful for fields like array and blocks |

#### Return Value

```typescript
type FieldType<T> = {
  errorMessage?: string
  errorPaths?: string[]
  filterOptions?: FilterOptionsResult
  formInitializing: boolean
  formProcessing: boolean
  formSubmitted: boolean
  initialValue?: T
  path: string
  permissions: FieldPermissions
  readOnly?: boolean
  rows?: Row[]
  schemaPath: string
  setValue: (val: unknown, disableModifyingForm?: boolean) => void
  showError: boolean
  valid?: boolean
  value: T
}
```

### useFormFields

The `useFormFields` hook is a powerful and highly performant way to retrieve a form's field state. It ensures that it will only cause a rerender when the items that you ask for change.

You can pass a Redux-like selector into the hook, which will ensure that you retrieve only the field that you want:

```javascript
'use client'
import { useFormFields } from '@payloadcms/ui'

const MyComponent: React.FC = () => {
  // Get only the `amount` field state, and only cause a rerender when that field changes
  const amount = useFormFields(([fields, dispatch]) => fields.amount)

  // Do the same thing as above, but to the `feePercentage` field
  const feePercentage = useFormFields(
    ([fields, dispatch]) => fields.feePercentage,
  )

  if (
    typeof amount?.value !== 'undefined' &&
    typeof feePercentage?.value !== 'undefined'
  ) {
    return <span>The fee is ${(amount.value * feePercentage.value) / 100}</span>
  }
}
```

### useAllFormFields

To retrieve more than one field, you can use the `useAllFormFields` hook. Unlike the `useFormFields` hook, this hook does not accept a "selector", and it always returns an array with type of `[fields: Fields, dispatch: React.Dispatch<Action>]`.

**Warning**: Your component will re-render when any field changes, so use this hook only if you absolutely need to.

```javascript
'use client'
import { useAllFormFields } from '@payloadcms/ui'
import { reduceFieldsToValues, getSiblingData } from 'payload/shared'

const ExampleComponent: React.FC = () => {
  // the `fields` const will be equal to all fields' state,
  // and the `dispatchFields` method is usable to send field state up to the form
  const [fields, dispatchFields] = useAllFormFields();

  // Pass in fields, and indicate if you'd like to "unflatten" field data.
  // The result below will reflect the data stored in the form at the given time
  const formData = reduceFieldsToValues(fields, true);

  // Pass in field state and a path,
  // and you will be sent all sibling data of the path that you've specified
  const siblingData = getSiblingData(fields, 'someFieldName');

  return (
    // return some JSX here if necessary
  )
};
```

### Updating Other Fields' Values

If you're building a Custom Component and need to update another field's value, you can use `dispatchFields` returned from `useAllFormFields`.

#### Available Actions

| Action | Description |
|--------|-------------|
| `ADD_ROW` | Adds a row of data (useful in array / block field data) |
| `DUPLICATE_ROW` | Duplicates a row of data (useful in array / block field data) |
| `MODIFY_CONDITION` | Updates a field's conditional logic result (true / false) |
| `MOVE_ROW` | Moves a row of data (useful in array / block field data) |
| `REMOVE` | Removes a field from form state |
| `REMOVE_ROW` | Removes a row of data from form state (useful in array / block field data) |
| `REPLACE_STATE` | Completely replaces form state |
| `UPDATE` | Update any property of a specific field's state |

### useForm

The `useForm` hook can be used to interact with the form itself, and sends back many methods that can be used to reactively fetch form state without causing rerenders within your components each time a field is changed.

**Warning**: This hook is optimized to avoid causing rerenders when fields change. Its fields property will be out of date and should not be relied upon.

#### Return Properties

| Action | Description |
|--------|-------------|
| `fields` | **Deprecated.** This property cannot be relied on as up-to-date |
| `submit` | Method to trigger the form to submit |
| `dispatchFields` | Dispatch actions to the form field state |
| `validateForm` | Trigger a validation of the form state |
| `createFormData` | Create a multipart/form-data object from the current form's state |
| `disabled` | Boolean denoting whether or not the form is disabled |
| `getFields` | Gets all fields from state |
| `getField` | Gets a single field from state by path |
| `getData` | Returns the data stored in the form |
| `getSiblingData` | Returns form sibling data for the given field path |
| `setModified` | Set the form's modified state |
| `setProcessing` | Set the form's processing state |
| `setSubmitted` | Set the form's submitted state |
| `formRef` | The ref from the form HTML element |
| `reset` | Method to reset the form to its initial state |
| `addFieldRow` | Method to add a row on an array or block field |
| `removeFieldRow` | Method to remove a row from an array or block field |
| `replaceFieldRow` | Method to replace a row from an array or block field |

### useDocumentForm

The `useDocumentForm` hook works the same way as the `useForm` hook, but it always gives you access to the top-level Form of a document. This is useful if you need to access the document's Form context from within a child Form.

```javascript
'use client'

import { useDocumentForm } from '@payloadcms/ui'

const MyComponent: React.FC = () => {
  const { fields: parentDocumentFields } = useDocumentForm()

  return (
    <p>
      The document's Form has ${Object.keys(parentDocumentFields).length} fields
    </p>
  )
}
```

### useCollapsible

The `useCollapsible` hook allows you to control parent collapsibles:

| Property | Description |
|----------|-------------|
| `isCollapsed` | State of the collapsible. true if open, false if collapsed |
| `isVisible` | If nested, determine if the nearest collapsible is visible. true if no parent is closed, false otherwise |
| `toggle` | Toggles the state of the nearest collapsible |
| `isWithinCollapsible` | Determine when you are within another collapsible |

```javascript
'use client'
import React from 'react'

import { useCollapsible } from '@payloadcms/ui'

const CustomComponent: React.FC = () => {
  const { isCollapsed, toggle } = useCollapsible()

  return (
    <div>
      <p className="field-type">I am {isCollapsed ? 'closed' : 'open'}</p>
      <button onClick={toggle} type="button">
        Toggle
      </button>
    </div>
  )
}
```

### useDocumentInfo

The `useDocumentInfo` hook provides information about the current document being edited:

| Property | Description |
|----------|-------------|
| `action` | The URL attached to the action attribute on the underlying form element |
| `apiURL` | The API URL for the current document |
| `collectionSlug` | The slug of the collection if editing a collection document |
| `currentEditor` | The user currently editing the document |
| `docConfig` | Either the Collection or Global config of the document, depending on what is being edited |
| `docPermissions` | The current document's permissions. Fallback to collection permissions when no id is present |
| `documentIsLocked` | Whether the document is currently locked by another user |
| `getDocPermissions` | Method to retrieve document-level permissions |
| `getDocPreferences` | Method to retrieve document-level user preferences |
| `globalSlug` | The slug of the global if editing a global document |
| `hasPublishedDoc` | Whether the document has a published version |
| `hasPublishPermission` | Whether the current user has permission to publish the document |
| `hasSavePermission` | Whether the current user has permission to save the document |
| `id` | If the doc is a collection, its ID will be returned |
| `incrementVersionCount` | Method to increment the version count of the document |
| `initialData` | The initial data of the document |
| `isEditing` | Whether the document is being edited (as opposed to created) |
| `isInitializing` | Whether the document info is still initializing |
| `isLocked` | Whether the document is locked |
| `lastUpdateTime` | Timestamp of the last update to the document |
| `mostRecentVersionIsAutosaved` | Whether the most recent version is an autosaved version |
| `preferencesKey` | The preferences key to use when interacting with document-level user preferences |
| `savedDocumentData` | The saved data of the document |
| `setDocFieldPreferences` | Method to set preferences for a specific field |
| `setDocumentTitle` | Method to set the document title |
| `setHasPublishedDoc` | Method to update whether the document has been published |
| `title` | The title of the document |
| `unlockDocument` | Method to unlock a document |
| `unpublishedVersionCount` | The number of unpublished versions of the document |
| `updateDocumentEditor` | Method to update who is currently editing the document |
| `updateSavedDocumentData` | Method to update the saved document data |
| `uploadStatus` | Status of any uploads in progress ('idle', 'uploading', or 'failed') |
| `versionCount` | The current version count of the document |

```javascript
'use client'
import { useDocumentInfo } from '@payloadcms/ui'

const LinkFromCategoryToPosts: React.FC = () => {
  const { id } = useDocumentInfo()

  // id will be undefined on the create form
  if (!id) {
    return null
  }

  return (
    <a
      href={`/admin/collections/posts?where[or][0][and][0][category][in][0]=[${id}]`}
    >
      View posts
    </a>
  )
}
```

### useListQuery

The `useListQuery` hook is used to subscribe to the data, current query, and other properties used within the List View:

| Property | Description |
|----------|-------------|
| `data` | The data that is being displayed in the List View |
| `defaultLimit` | The default limit of items to display in the List View |
| `defaultSort` | The default sort order of items in the List View |
| `handlePageChange` | A method to handle page changes in the List View |
| `handlePerPageChange` | A method to handle per page changes in the List View |
| `handleSearchChange` | A method to handle search changes in the List View |
| `handleSortChange` | A method to handle sort changes in the List View |
| `handleWhereChange` | A method to handle where changes in the List View |
| `modified` | Whether the query has been changed from its Query Preset |
| `query` | The current query that is being used to fetch the data in the List View |

```javascript
'use client'
import { useListQuery } from '@payloadcms/ui'

const MyComponent: React.FC = () => {
  const { data, query } = useListQuery()

  // ...
}
```

### useSelection

The `useSelection` hook provides information on the selected rows in the List view:

| Property | Description |
|----------|-------------|
| `count` | The number of currently selected rows |
| `getQueryParams` | A function that generates a query string based on the current selection state and optional additional filtering parameters |
| `selectAll` | An enum value representing the selection range: 'allAvailable', 'allInPage', 'none', and 'some' |
| `selected` | A map of document id keys and boolean values representing their selection status |
| `setSelection` | A function that toggles the selection status of a document row |
| `toggleAll` | A function that toggles selection for all documents on the current page or selects all available documents when passed true |
| `totalDocs` | The number of total documents in the collection |

```javascript
'use client'
import { useSelection } from '@payloadcms/ui'

const MyComponent: React.FC = () => {
  const { count, toggleAll, totalDocs } = useSelection()

  return (
    <>
      <span>
        Selected {count} out of {totalDocs} docs!
      </span>
      <button type="button" onClick={() => toggleAll(true)}>
        Toggle All Selections
      </button>
    </>
  )
}
```

### useLocale

Get the selected locale object with the `useLocale` hook. It gives you the full locale object, consisting of a label, rtl(right-to-left) property, and code:

```javascript
'use client'
import { useLocale } from '@payloadcms/ui'

const Greeting: React.FC = () => {
  const locale = useLocale()

  const trans = {
    en: 'Hello',
    es: 'Hola',
  }

  return <span> {trans[locale.code]} </span>
}
```

### useAuth

Retrieve info about the currently logged in user as well as methods for interacting with it:

| Property | Description |
|----------|-------------|
| `user` | The currently logged in user |
| `logOut` | A method to log out the currently logged in user |
| `refreshCookie` | A method to trigger the silent refreshing of a user's auth token |
| `setToken` | Set the token of the user, to be decoded and used to reset the user and token in memory |
| `token` | The logged in user's token (useful for creating preview links, etc.) |
| `refreshPermissions` | Load new permissions (useful when content that affects permissions has been changed) |
| `permissions` | The permissions of the current user |

```javascript
'use client'
import { useAuth } from '@payloadcms/ui'
import type { User } from '../payload-types.ts'

const Greeting: React.FC = () => {
  const { user } = useAuth<User>()

  return <span>Hi, {user.email}!</span>
}
```

### useConfig

Used to retrieve the Payload Client Config:

```javascript
'use client'
import { useConfig } from '@payloadcms/ui'

const MyComponent: React.FC = () => {
  const { config } = useConfig()

  return <span>{config.serverURL}</span>
}
```

To retrieve a specific collection or global config by its slug, `getEntityConfig` is the most efficient way:

```javascript
'use client'
import { useConfig } from '@payloadcms/ui'

const MyComponent: React.FC = () => {
  const { getEntityConfig } = useConfig()
  const mediaConfig = getEntityConfig({ collectionSlug: 'media' })

  return (
    <span>The media collection has {mediaConfig.fields.length} fields.</span>
  )
}
```

### useEditDepth

Sends back how many editing levels "deep" the current component is. Edit depth is relevant while adding new documents / editing documents in modal windows and other cases:

```javascript
'use client'
import { useEditDepth } from '@payloadcms/ui'

const MyComponent: React.FC = () => {
  const editDepth = useEditDepth()

  return <span>My component is {editDepth} levels deep</span>
}
```

### usePreferences

Returns methods to set and get user preferences. See the [User Preferences](#user-preferences) section for more information.

### useTheme

Returns the currently selected theme (light, dark or auto), a set function to update it and a boolean autoMode, used to determine if the theme value should be set automatically based on the user's device preferences:

```javascript
'use client'
import { useTheme } from '@payloadcms/ui'

const MyComponent: React.FC = () => {
  const { autoMode, setTheme, theme } = useTheme()

  return (
    <>
      <span>
        The current theme is {theme} and autoMode is {autoMode}
      </span>
      <button
        type="button"
        onClick={() =>
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
        }
      >
        Toggle theme
      </button>
    </>
  )
}
```

### useTableColumns

Returns properties and methods to manipulate table columns:

| Property | Description |
|----------|-------------|
| `columns` | The current state of columns including their active status and configuration |
| `LinkedCellOverride` | A component override for linked cells in the table |
| `moveColumn` | A method to reorder columns. Accepts `{ fromIndex: number, toIndex: number }` as arguments |
| `resetColumnsState` | A method to reset columns back to their default configuration as defined in the collection config |
| `setActiveColumns` | A method to set specific columns to active state while preserving the existing column order. Accepts an array of column names to activate |
| `toggleColumn` | A method to toggle a single column's visibility. Accepts a column name as string |

```javascript
'use client'
import { useTableColumns } from '@payloadcms/ui'

const MyComponent: React.FC = () => {
  const { setActiveColumns, resetColumnsState } = useTableColumns()

  const activateSpecificColumns = () => {
    // Only activates the id and createdAt columns
    // Other columns retain their current active/inactive state
    // The original column order is preserved
    setActiveColumns(['id', 'createdAt'])
  }

  const resetToDefaults = () => {
    // Resets to the default columns defined in the collection config
    resetColumnsState()
  }

  return (
    <div>
      <button type="button" onClick={activateSpecificColumns}>
        Activate Specific Columns
      </button>
      <button type="button" onClick={resetToDefaults}>
        Reset To Defaults
      </button>
    </div>
  )
}
```

### useDocumentEvents

The `useDocumentEvents` hook provides a way of subscribing to cross-document events, such as updates made to nested documents within a drawer:

| Property | Description |
|----------|-------------|
| `mostRecentUpdate` | An object containing the most recently updated document. It contains the `entitySlug`, `id` (if collection), and `updatedAt` properties |
| `reportUpdate` | A method used to report updates to documents. It accepts the same arguments as the `mostRecentUpdate` property |

```javascript
'use client'
import { useDocumentEvents } from '@payloadcms/ui'

const ListenForUpdates: React.FC = () => {
  const { mostRecentUpdate } = useDocumentEvents()

  return <span>{JSON.stringify(mostRecentUpdate)}</span>
}
```

### useStepNav

The `useStepNav` hook provides a way to change the step-nav breadcrumb links in the app header:

| Property | Description |
|----------|-------------|
| `setStepNav` | A state setter function which sets the stepNav array |
| `stepNav` | A StepNavItem array where each StepNavItem has a label and optionally a url |

```javascript
'use client'
import { type StepNavItem, useStepNav } from '@payloadcms/ui'
import { useEffect } from 'react'

export const MySetStepNavComponent: React.FC<{
  nav: StepNavItem[]
}> = ({ nav }) => {
  const { setStepNav } = useStepNav()

  useEffect(() => {
    setStepNav(nav)
  }, [setStepNav, nav])

  return null
}
```

### usePayloadAPI

The `usePayloadAPI` hook is a useful tool for making REST API requests to your Payload instance and handling responses reactively:

```javascript
'use client'
import { usePayloadAPI } from '@payloadcms/ui'

const MyComponent: React.FC = () => {
  // Fetch data from a collection item using its ID
  const [{ data, isError, isLoading }, { setParams }] = usePayloadAPI(
    '/api/posts/123',
    {
      initialParams: { depth: 1 },
    },
  )

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error occurred while fetching data.</p>

  return (
    <div>
      <h1>{data?.title}</h1>
      <button onClick={() => setParams({ cacheBust: Date.now() })}>
        Refresh Data
      </button>
    </div>
  )
}
```

#### Arguments

| Property | Description |
|----------|-------------|
| `url` | The API endpoint to fetch data from. Relative URLs will be prefixed with the Payload API route |
| `options` | An object containing initial request parameters and initial state configuration |

#### Options Properties

| Property | Description |
|----------|-------------|
| `initialData` | Uses this data instead of making an initial request. If not provided, the request runs immediately |
| `initialParams` | Defines the initial parameters to use in the request. Defaults to an empty object `{}` |

#### Returned Value

The first item in the returned array contains:

| Property | Description |
|----------|-------------|
| `data` | The API response data |
| `isError` | A boolean indicating whether the request failed |
| `isLoading` | A boolean indicating whether the request is in progress |

The second item contains:

| Property | Description |
|----------|-------------|
| `setParams` | Updates request parameters, triggering a refetch if needed |

### useRouteTransition

Route transitions are useful in showing immediate visual feedback to the user when navigating between pages. This is especially useful on slow networks when navigating to data heavy or process intensive pages.

By default, any instances of `Link` from `@payloadcms/ui` will trigger route transitions:

```javascript
import { Link } from '@payloadcms/ui'

const MyComponent = () => {
  return <Link href="/somewhere">Go Somewhere</Link>
}
```

You can also trigger route transitions programmatically:

```javascript
'use client'
import React, { useCallback } from 'react'
import { useRouteTransition } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

const MyComponent: React.FC = () => {
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()

  const redirectSomewhere = useCallback(() => {
    startRouteTransition(() => router.push('/somewhere'))
  }, [startRouteTransition, router])

  // ...
}
```

---

## Additional Features

### I18n

The Payload Admin Panel is translated in over 30 languages and counting. Languages are automatically detected based on the user's browser and used by the Admin Panel to display all text in that language. If no language was detected, or if the user's language is not yet supported, English will be chosen. Users can easily specify their language by selecting one from their account page.

### Light and Dark Modes

Users in the Admin Panel have the ability to choose between light mode and dark mode for their editing experience. Users can select their preferred theme from their account page. Once selected, it is saved to their user's preferences and persisted across sessions and devices. If no theme was selected, the Admin Panel will automatically detect the operation system's theme and use that as the default.

---

*This document consolidates all the official Payload CMS documentation provided for your Next.js 15 project. For the most up-to-date information, always refer to the official Payload CMS documentation.*