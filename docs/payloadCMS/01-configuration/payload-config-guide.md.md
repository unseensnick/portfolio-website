# Payload CMS Comprehensive Configuration Guide

## Table of Contents
- [The Payload Config](#the-payload-config)
- [Collections](#collections)
- [Globals](#globals)
- [Environment Variables](#environment-variables)
- [Localization](#localization)
- [Internationalization (I18n)](#internationalization-i18n)

## The Payload Config

Payload is a config-based, code-first CMS and application framework. The Payload Config is central to everything that Payload does, allowing for deep configuration of your application through a simple and intuitive API. The Payload Config is a fully-typed JavaScript object that can be infinitely extended upon.

Everything from your Database choice to the appearance of the Admin Panel is fully controlled through the Payload Config. From here you can define Fields, add Localization, enable Authentication, configure Access Control, and so much more.

The Payload Config is a `payload.config.ts` file typically located in the root of your project:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // Your config goes here
})
```

The Payload Config is strongly typed and ties directly into Payload's TypeScript codebase. This means your IDE (such as VSCode) will provide helpful information like type-ahead suggestions while you write your config.

### Basic Config Example

Here is one of the simplest possible Payload configs:

```typescript
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  collections: [
    {
      slug: 'pages',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
  ],
})
```

### Config Options

The following options are available:

| Option | Description |
|--------|-------------|
| **admin** | The configuration options for the Admin Panel, including Custom Components, Live Preview, etc. |
| **bin** | Register custom bin scripts for Payload to execute. |
| **editor** | The Rich Text Editor which will be used by richText fields. |
| **db** * | The Database Adapter which will be used by Payload. |
| **serverURL** | A string used to define the absolute URL of your app. This includes the protocol, for example https://example.com. No paths allowed, only protocol, domain and (optionally) port. |
| **collections** | An array of Collections for Payload to manage. |
| **compatibility** | Compatibility flags for earlier versions of Payload. |
| **globals** | An array of Globals for Payload to manage. |
| **cors** | Cross-origin resource sharing (CORS) is a mechanism that accept incoming requests from given domains. You can also customize the Access-Control-Allow-Headers header. |
| **localization** | Opt-in to translate your content into multiple locales. |
| **logger** | Logger options, logger options with a destination stream, or an instantiated logger instance. |
| **loggingLevels** | An object to override the level to use in the logger for Payload's errors. |
| **graphQL** | Manage GraphQL-specific functionality, including custom queries and mutations, query complexity limits, etc. |
| **cookiePrefix** | A string that will be prefixed to all cookies that Payload sets. |
| **csrf** | A whitelist array of URLs to allow Payload to accept cookies from. |
| **defaultDepth** | If a user does not specify depth while requesting a resource, this depth will be used. |
| **defaultMaxTextLength** | The maximum allowed string length to be permitted application-wide. Helps to prevent malicious public document creation. |
| **folders** | An optional object to configure global folder settings. |
| **queryPresets** | An object that to configure Collection Query Presets. |
| **maxDepth** | The maximum allowed depth to be permitted application-wide. This setting helps prevent against malicious queries. Defaults to 10. |
| **indexSortableFields** | Automatically index all sortable top-level fields in the database to improve sort performance and add database compatibility for Azure Cosmos and similar. |
| **upload** | Base Payload upload configuration. |
| **routes** | Control the routing structure that Payload binds itself to. |
| **email** | Configure the Email Adapter for Payload to use. |
| **onInit** | A function that is called immediately following startup that receives the Payload instance as its only argument. |
| **debug** | Enable to expose more detailed error information. |
| **telemetry** | Disable Payload telemetry by passing false. |
| **hooks** | An array of Root Hooks. |
| **plugins** | An array of Plugins. |
| **endpoints** | An array of Custom Endpoints added to the Payload router. |
| **custom** | Extension point for adding custom data (e.g. for plugins). |
| **i18n** | Internationalization configuration. Pass all i18n languages you'd like the admin UI to support. Defaults to English-only. |
| **secret** * | A secure, unguessable string that Payload will use for any encryption workflows - for example, password salt / hashing. |
| **sharp** | If you would like Payload to offer cropping, focal point selection, and automatic media resizing, install and pass the Sharp module to the config here. |
| **typescript** | Configure TypeScript settings here. |

*An asterisk denotes that a property is required.*

### TypeScript Config

Payload exposes a variety of TypeScript settings that you can leverage. These settings are used to auto-generate TypeScript interfaces for your Collections and Globals, and to ensure that Payload uses your Generated Types for all Local API methods.

To customize the TypeScript settings, use the typescript property in your Payload Config:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  typescript: {
    // ...
  },
})
```

The following options are available:

| Option | Description |
|--------|-------------|
| **autoGenerate** | By default, Payload will auto-generate TypeScript interfaces for all collections and globals that your config defines. Opt out by setting typescript.autoGenerate: false. |
| **declare** | By default, Payload adds a declare block to your generated types, which makes sure that Payload uses your generated types for all Local API methods. Opt out by setting typescript.declare: false. |
| **outputFile** | Control the output path and filename of Payload's auto-generated types by defining the typescript.outputFile property to a full, absolute path. |

### Config Location

For Payload command-line scripts, we need to be able to locate your Payload Config. We'll check a variety of locations for the presence of `payload.config.ts` by default, including:

- The root current working directory
- The compilerOptions in your `tsconfig`
- The dist directory

**Important:** Ensure your tsconfig.json is properly configured for Payload to auto-detect your config location. If it does not exist, or does not specify the proper compilerOptions, Payload will default to the current working directory.

#### Development Mode

In development mode, if the configuration file is not found at the root, Payload will attempt to read your tsconfig.json, and attempt to find the config file specified in the rootDir:

```json
{
  "compilerOptions": {
    "rootDir": "src"
  }
}
```

#### Production Mode

In production mode, Payload will first attempt to find the config file in the outDir of your tsconfig.json, and if not found, will fallback to the rootDir directory:

```json
{
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

### Customizing the Config Location

In addition to the above automated detection, you can specify your own location for the Payload Config. This can be useful in situations where your config is not in a standard location, or you wish to switch between multiple configurations. To do this, Payload exposes an Environment Variable to bypass all automatic config detection.

To use a custom config location, set the PAYLOAD_CONFIG_PATH environment variable:

```json
{
  "scripts": {
    "payload": "PAYLOAD_CONFIG_PATH=/path/to/custom-config.ts payload"
  }
}
```

**Tip:** PAYLOAD_CONFIG_PATH can be either an absolute path, or path relative to your current working directory.

### Telemetry

Payload collects completely anonymous telemetry data about general usage. This data is super important to us and helps us accurately understand how we're growing and what we can do to build the software into everything that it can possibly be. The telemetry that we collect also help us demonstrate our growth in an accurate manner, which helps us as we seek investment to build and scale our team. If we can accurately demonstrate our growth, we can more effectively continue to support Payload as free and open-source software. To opt out of telemetry, you can pass `telemetry: false` within your Payload Config.

For more information about what we track, take a look at our privacy policy.

### Cross-origin resource sharing (CORS)

Cross-origin resource sharing (CORS) can be configured with either a whitelist array of URLS to allow CORS requests from, a wildcard string (*) to accept incoming requests from any domain, or an object with the following properties:

| Option | Description |
|--------|-------------|
| **origins** | Either a whitelist array of URLS to allow CORS requests from, or a wildcard string ('*') to accept incoming requests from any domain. |
| **headers** | A list of allowed headers that will be appended in Access-Control-Allow-Headers. |

Here's an example showing how to allow incoming requests from any domain:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  cors: '*',
})
```

Here's an example showing how to append a new header (x-custom-header) in Access-Control-Allow-Headers:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  cors: {
    origins: ['http://localhost:3000'],
    headers: ['x-custom-header'],
  },
})
```

### Custom bin scripts

Using the bin configuration property, you can inject your own scripts to npx payload. Example for `pnpm payload seed`:

**Step 1:** create seed.ts file in the same folder with payload.config.ts with:

```typescript
import type { SanitizedConfig } from 'payload'

import payload from 'payload'

// Script must define a "script" function export that accepts the sanitized config
export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })
  await payload.create({
    collection: 'pages',
    data: { title: 'my title' },
  })
  payload.logger.info('Successfully seeded!')
  process.exit(0)
}
```

**Step 2:** add the seed script to bin:

```typescript
export default buildConfig({
  bin: [
    {
      scriptPath: path.resolve(dirname, 'seed.ts'),
      key: 'seed',
    },
  ],
})
```

Now you can run the command using: `pnpm payload seed`

## Collections

A Collection is a group of records, called Documents, that all share a common schema. You can define as many Collections as your application needs. Each Document in a Collection is stored in the Database based on the Fields that you define, and automatically generates a Local API, REST API, and GraphQL API used to manage your Documents.

Collections are also used to achieve Authentication in Payload. By defining a Collection with auth options, that Collection receives additional operations to support user authentication.

Collections are the primary way to structure recurring data in your application, such as users, products, pages, posts, and other types of content that you might want to manage. Each Collection can have its own unique Access Control, Hooks, Admin Options, and more.

To define a Collection Config, use the collection property in your Payload Config:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  collections: [
    // Your Collections go here
  ],
})
```

**Tip:** If your Collection is only ever meant to contain a single Document, consider using a Global instead.

### Basic Collection Example

It's often best practice to write your Collections in separate files and then import them into the main Payload Config.

Here is what a simple Collection Config might look like:

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

### Collection Config Options

The following options are available:

| Option | Description |
|--------|-------------|
| **admin** | The configuration options for the Admin Panel. |
| **access** | Provide Access Control functions to define exactly who should be able to do what with Documents in this Collection. |
| **auth** | Specify options if you would like this Collection to feature authentication. |
| **custom** | Extension point for adding custom data (e.g. for plugins) |
| **disableDuplicate** | When true, do not show the "Duplicate" button while editing documents within this Collection and prevent duplicate from all APIs. |
| **defaultSort** | Pass a top-level field to sort by default in the Collection List View. Prefix the name of the field with a minus symbol ("-") to sort in descending order. Multiple fields can be specified by using a string array. |
| **dbName** | Custom table or Collection name depending on the Database Adapter. Auto-generated from slug if not defined. |
| **endpoints** | Add custom routes to the REST API. Set to false to disable routes. |
| **fields** * | Array of field types that will determine the structure and functionality of the data stored within this Collection. |
| **graphQL** | Manage GraphQL-related properties for this collection. |
| **hooks** | Entry point for Hooks. |
| **orderable** | If true, enables custom ordering for the collection, and documents can be reordered via drag and drop. Uses fractional indexing for efficient reordering. |
| **labels** | Singular and plural labels for use in identifying this Collection throughout Payload. Auto-generated from slug if not defined. |
| **enableQueryPresets** | Enable query presets for this Collection. |
| **lockDocuments** | Enables or disables document locking. By default, document locking is enabled. Set to an object to configure, or set to false to disable locking. |
| **slug** * | Unique, URL-friendly string that will act as an identifier for this Collection. |
| **timestamps** | Set to false to disable documents' automatically generated createdAt and updatedAt timestamps. |
| **trash** | A boolean to enable soft deletes for this collection. Defaults to false. |
| **typescript** | An object with property interface as the text used in schema generation. Auto-generated from slug if not defined. |
| **upload** | Specify options if you would like this Collection to support file uploads. For more, consult the Uploads documentation. |
| **versions** | Set to true to enable default options, or configure with object properties. |
| **defaultPopulate** | Specify which fields to select when this Collection is populated from another document. |
| **indexes** | Define compound indexes for this collection. This can be used to either speed up querying/sorting by 2 or more fields at the same time or to ensure uniqueness between several fields. |
| **forceSelect** | Specify which fields should be selected always, regardless of the select query which can be useful that the field exists for access control / hooks |
| **disableBulkEdit** | Disable the bulk edit operation for the collection in the admin panel and the REST API |

*An asterisk denotes that a property is required.*

### Admin Options

The behavior of Collections within the Admin Panel can be fully customized to fit the needs of your application. This includes grouping or hiding their navigation links, adding Custom Components, selecting which fields to display in the List View, and more.

To configure Admin Options for Collections, use the admin property in your Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    // ...
  },
}
```

The following options are available:

| Option | Description |
|--------|-------------|
| **group** | Text or localization object used to group Collection and Global links in the admin navigation. Set to false to hide the link from the navigation while keeping its routes accessible. |
| **hidden** | Set to true or a function, called with the current user, returning true to exclude this Collection from navigation and admin routing. |
| **hooks** | Admin-specific hooks for this Collection. |
| **useAsTitle** | Specify a top-level field to use for a document title throughout the Admin Panel. If no field is defined, the ID of the document is used as the title. |
| **description** | Text to display below the Collection label in the List View to give editors more information. Alternatively, you can use the admin.components.Description to render a React component. |
| **defaultColumns** | Array of field names that correspond to which columns to show by default in this Collection's List View. |
| **disableCopyToLocale** | Disables the "Copy to Locale" button while editing documents within this Collection. Only applicable when localization is enabled. |
| **groupBy** | Beta. Enable grouping by a field in the list view. |
| **hideAPIURL** | Hides the "API URL" meta field while editing documents within this Collection. |
| **enableRichTextLink** | The Rich Text field features a Link element which allows for users to automatically reference related documents within their rich text. Set to true by default. |
| **enableRichTextRelationship** | The Rich Text field features a Relationship element which allows for users to automatically reference related documents within their rich text. Set to true by default. |
| **folders** | A boolean to enable folders for a given collection. Defaults to false. |
| **meta** | Page metadata overrides to apply to this Collection within the Admin Panel. |
| **preview** | Function to generate preview URLs within the Admin Panel that can point to your app. |
| **livePreview** | Enable real-time editing for instant visual feedback of your front-end application. |
| **components** | Swap in your own React components to be used within this Collection. |
| **listSearchableFields** | Specify which fields should be searched in the List search view. |
| **pagination** | Set pagination-specific options for this Collection. |
| **baseListFilter** | You can define a default base filter for this collection's List view, which will be merged into any filters that the user performs. |

**Note:** If you set useAsTitle to a relationship or join field, it will use only the ID of the related document(s) as the title. To display a specific field (i.e. title) from the related document instead, create a virtual field that extracts the desired data, and set useAsTitle to that virtual field.

### Custom Components

Collections can set their own Custom Components which only apply to Collection-specific UI within the Admin Panel. This includes elements such as the Save Button, or entire layouts such as the Edit View.

To override Collection Components, use the admin.components property in your Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      // ...
    },
  },
}
```

The following options are available:

| Option | Description |
|--------|-------------|
| **afterList** | An array of components to inject after the built-in List View. |
| **afterListTable** | An array of components to inject after the built-in List View's table. |
| **beforeList** | An array of components to inject before the built-in List View. |
| **beforeListTable** | An array of components to inject before the built-in List View's table. |
| **listMenuItems** | An array of components to render within a menu next to the List Controls (after the Columns and Filters options) |
| **Description** | A component to render below the Collection label in the List View. An alternative to the admin.description property. |
| **edit** | Override specific components within the Edit View. |
| **views** | Override or create new views within the Admin Panel. |

#### Edit View Options

```typescript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      edit: {
        // ...
      },
    },
  },
}
```

The following options are available:

| Option | Description |
|--------|-------------|
| **beforeDocumentControls** | Inject custom components before the Save / Publish buttons. |
| **editMenuItems** | Inject custom components within the 3-dot menu dropdown located in the document controls bar. |
| **SaveButton** | Replace the default Save Button within the Edit View. Drafts must be disabled. |
| **SaveDraftButton** | Replace the default Save Draft Button within the Edit View. Drafts must be enabled and autosave must be disabled. |
| **PublishButton** | Replace the default Publish Button within the Edit View. Drafts must be enabled. |
| **PreviewButton** | Replace the default Preview Button within the Edit View. Preview must be enabled. |
| **Upload** | Replace the default Upload component within the Edit View. Upload must be enabled. |

### Pagination

All Collections receive their own List View which displays a paginated list of documents that can be sorted and filtered. The pagination behavior of the List View can be customized on a per-Collection basis, and uses the same Pagination API that Payload provides.

To configure pagination options, use the admin.pagination property in your Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  // ...
  admin: {
    pagination: {
      defaultLimit: 10,
      limits: [10, 20, 50],
    },
  },
}
```

The following options are available:

| Option | Description |
|--------|-------------|
| **defaultLimit** | Integer that specifies the default per-page limit that should be used. Defaults to 10. |
| **limits** | Provide an array of integers to use as per-page options for admins to choose from in the List View. |

### List Searchable Fields

In the List View, there is a "search" box that allows you to quickly find a document through a simple text search. By default, it searches on the ID field. If defined, the admin.useAsTitle field is used. Or, you can explicitly define which fields to search based on the needs of your application.

To define which fields should be searched, use the admin.listSearchableFields property in your Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  // ...
  admin: {
    listSearchableFields: ['title', 'slug'],
  },
}
```

**Tip:** If you are adding listSearchableFields, make sure you index each of these fields so your admin queries can remain performant.

### GraphQL

You can completely disable GraphQL for this collection by passing `graphQL: false` to your collection config. This will completely disable all queries, mutations, and types from appearing in your GraphQL schema.

You can also pass an object to the collection's graphQL property, which allows you to define the following properties:

| Option | Description |
|--------|-------------|
| **singularName** | Override the "singular" name that will be used in GraphQL schema generation. |
| **pluralName** | Override the "plural" name that will be used in GraphQL schema generation. |
| **disableQueries** | Disable all GraphQL queries that correspond to this collection by passing true. |
| **disableMutations** | Disable all GraphQL mutations that correspond to this collection by passing true. |

### TypeScript

You can import types from Payload to help make writing your Collection configs easier and type-safe. There are two main types that represent the Collection Config, `CollectionConfig` and `SanitizedCollectionConfig`.

The `CollectionConfig` type represents a raw Collection Config in its full form, where only the bare minimum properties are marked as required. The `SanitizedCollectionConfig` type represents a Collection Config after it has been fully sanitized. Generally, this is only used internally by Payload.

```typescript
import type { CollectionConfig, SanitizedCollectionConfig } from 'payload'
```

## Globals

Globals are in many ways similar to Collections, except that they correspond to only a single Document. You can define as many Globals as your application needs. Each Global Document is stored in the Database based on the Fields that you define, and automatically generates a Local API, REST API, and GraphQL API used to manage your Documents.

Globals are the primary way to structure singletons in Payload, such as a header navigation, site-wide banner alerts, or app-wide localized strings. Each Global can have its own unique Access Control, Hooks, Admin Options, and more.

To define a Global Config, use the globals property in your Payload Config:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  globals: [
    // Your Globals go here
  ],
})
```

**Tip:** If you have more than one Global that share the same structure, consider using a Collection instead.

### Basic Global Example

It's often best practice to write your Globals in separate files and then import them into the main Payload Config.

Here is what a simple Global Config might look like:

```typescript
import { GlobalConfig } from 'payload'

export const Nav: GlobalConfig = {
  slug: 'nav',
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      maxRows: 8,
      fields: [
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages', // "pages" is the slug of an existing collection
          required: true,
        },
      ],
    },
  ],
}
```

### Global Config Options

The following options are available:

| Option | Description |
|--------|-------------|
| **access** | Provide Access Control functions to define exactly who should be able to do what with this Global. |
| **admin** | The configuration options for the Admin Panel. |
| **custom** | Extension point for adding custom data (e.g. for plugins) |
| **dbName** | Custom table or collection name for this Global depending on the Database Adapter. Auto-generated from slug if not defined. |
| **description** | Text or React component to display below the Global header to give editors more information. |
| **endpoints** | Add custom routes to the REST API. |
| **fields** * | Array of field types that will determine the structure and functionality of the data stored within this Global. |
| **graphQL** | Manage GraphQL-related properties related to this global. |
| **hooks** | Entry point for Hooks. |
| **label** | Text for the name in the Admin Panel or an object with keys for each language. Auto-generated from slug if not defined. |
| **lockDocuments** | Enables or disables document locking. By default, document locking is enabled. Set to an object to configure, or set to false to disable locking. |
| **slug** * | Unique, URL-friendly string that will act as an identifier for this Global. |
| **typescript** | An object with property interface as the text used in schema generation. Auto-generated from slug if not defined. |
| **versions** | Set to true to enable default options, or configure with object properties. |
| **forceSelect** | Specify which fields should be selected always, regardless of the select query which can be useful that the field exists for access control / hooks |

*An asterisk denotes that a property is required.*

### Admin Options

The behavior of Globals within the Admin Panel can be fully customized to fit the needs of your application. This includes grouping or hiding their navigation links, adding Custom Components, setting page metadata, and more.

To configure Admin Options for Globals, use the admin property in your Global Config:

```typescript
import { GlobalConfig } from 'payload'

export const MyGlobal: GlobalConfig = {
  // ...
  admin: {
    // ...
  },
}
```

The following options are available:

| Option | Description |
|--------|-------------|
| **group** | Text or localization object used to group Collection and Global links in the admin navigation. Set to false to hide the link from the navigation while keeping its routes accessible. |
| **hidden** | Set to true or a function, called with the current user, returning true to exclude this Global from navigation and admin routing. |
| **components** | Swap in your own React components to be used within this Global. |
| **preview** | Function to generate a preview URL within the Admin Panel for this Global that can point to your app. |
| **livePreview** | Enable real-time editing for instant visual feedback of your front-end application. |
| **hideAPIURL** | Hides the "API URL" meta field while editing documents within this collection. |
| **meta** | Page metadata overrides to apply to this Global within the Admin Panel. |

### Custom Components

Globals can set their own Custom Components which only apply to Global-specific UI within the Admin Panel. This includes elements such as the Save Button, or entire layouts such as the Edit View.

To override Global Components, use the admin.components property in your Global Config:

```typescript
import type { SanitizedGlobalConfig } from 'payload'

export const MyGlobal: SanitizedGlobalConfig = {
  // ...
  admin: {
    components: {
      // ...
    },
  },
}
```

The following options are available:

#### General

| Option | Description |
|--------|-------------|
| **elements** | Override or create new elements within the Edit View. |
| **views** | Override or create new views within the Admin Panel. |

#### Edit View Options

```typescript
import type { SanitizedGlobalConfig } from 'payload'

export const MyGlobal: SanitizedGlobalConfig = {
  // ...
  admin: {
    components: {
      elements: {
        // ...
      },
    },
  },
}
```

The following options are available:

| Option | Description |
|--------|-------------|
| **SaveButton** | Replace the default Save Button with a Custom Component. Drafts must be disabled. |
| **SaveDraftButton** | Replace the default Save Draft Button with a Custom Component. Drafts must be enabled and autosave must be disabled. |
| **PublishButton** | Replace the default Publish Button with a Custom Component. Drafts must be enabled. |
| **PreviewButton** | Replace the default Preview Button with a Custom Component. Preview must be enabled. |

### GraphQL

You can completely disable GraphQL for this global by passing `graphQL: false` to your global config. This will completely disable all queries, mutations, and types from appearing in your GraphQL schema.

You can also pass an object to the global's graphQL property, which allows you to define the following properties:

| Option | Description |
|--------|-------------|
| **name** | Override the name that will be used in GraphQL schema generation. |
| **disableQueries** | Disable all GraphQL queries that correspond to this global by passing true. |
| **disableMutations** | Disable all GraphQL mutations that correspond to this global by passing true. |

### TypeScript

You can import types from Payload to help make writing your Global configs easier and type-safe. There are two main types that represent the Global Config, `GlobalConfig` and `SanitizedGlobalConfig`.

The `GlobalConfig` type represents a raw Global Config in its full form, where only the bare minimum properties are marked as required. The `SanitizedGlobalConfig` type represents a Global Config after it has been fully sanitized. Generally, this is only used internally by Payload.

```typescript
import type { GlobalConfig, SanitizedGlobalConfig } from 'payload'
```

## Environment Variables

Environment Variables are a way to store sensitive information that your application needs to function. This could be anything from API keys to Database credentials. Payload allows you to easily use Environment Variables within your config and throughout your application.

### Next.js Applications

If you are using Next.js, no additional setup is required other than creating your `.env` file.

To use Environment Variables, add a `.env` file to the root of your project:

```
project-name/
├─ .env
├─ package.json
├─ payload.config.ts
```

Here is an example of what an `.env` file might look like:

```
SERVER_URL=localhost:3000
DATABASE_URI=mongodb://localhost:27017/my-database
```

To use Environment Variables in your Payload Config, you can access them directly from `process.env`:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  serverURL: process.env.SERVER_URL, 
  // ...
})
```

### Client-side Environments

For security and safety reasons, the Admin Panel does not include Environment Variables in its client-side bundle by default. But, Next.js provides a mechanism to expose Environment Variables to the client-side bundle when needed.

If you are building a Custom Component and need to access Environment Variables from the client-side, you can do so by prefixing them with `NEXT_PUBLIC_`.

**Important:** Be careful about what variables you provide to your client-side code. Analyze every single one to make sure that you're not accidentally leaking sensitive information. Only ever include keys that are safe for the public to read in plain text.

For example, if you've got the following Environment Variable:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXX
```

This key will automatically be made available to the client-side Payload bundle and can be referenced in your Custom Component as follows:

```typescript
'use client'
import React from 'react'

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 

const MyClientComponent = () => {
  // do something with the key

  return <div>My Client Component</div>
}
```

For more information, check out the Next.js documentation.

### Outside of Next.js

If you are using Payload outside of Next.js, we suggest using the dotenv package to handle Environment Variables from `.env` files. This will automatically load your Environment Variables into `process.env`.

To do this, import the package as high up in your application as possible:

```typescript
import dotenv from 'dotenv'
dotenv.config() 

import { buildConfig } from 'payload'

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  // ...
})
```

**Tip:** Be sure that dotenv can find your `.env` file. By default, it will look for a file named `.env` in the root of your project. If you need to specify a different file, pass the path into the config options.

## Localization

Localization is one of the most important features of a modern CMS. It allows you to manage content in multiple languages, then serve it to your users based on their requested language. This is similar to I18n, but instead of managing translations for your application's interface, you are managing translations for the data itself.

With Localization, you can begin to serve personalized content to your users based on their specific language preferences, such as a multilingual website or multi-site application. There are no limits to the number of locales you can add to your Payload project.

To configure Localization, use the localization key in your Payload Config:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  localization: {
    // ...
  },
})
```

### Config Options

Add the localization property to your Payload Config to enable Localization project-wide. You'll need to provide a list of all locales that you'd like to support as well as set a few other options.

To configure locales, use the localization.locales property in your Payload Config:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  localization: {
    locales: ['en', 'es', 'de'], // required
    defaultLocale: 'en', // required
  },
})
```

You can also define locales using full configuration objects:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [
    // collections go here
  ],
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Arabic',
        code: 'ar',
        // opt-in to setting default text-alignment on Input fields to rtl (right-to-left)
        // when current locale is rtl
        rtl: true,
      },
    ],
    defaultLocale: 'en', // required
    fallback: true, // defaults to true
  },
})
```

**Tip:** Localization works very well alongside I18n.

The following options are available:

| Option | Description |
|--------|-------------|
| **locales** | Array of all the languages that you would like to support. |
| **defaultLocale** | Required string that matches one of the locale codes from the array provided. By default, if no locale is specified, documents will be returned in this locale. |
| **fallback** | Boolean enabling "fallback" locale functionality. If a document is requested in a locale, but a field does not have a localized value corresponding to the requested locale, then if this property is enabled, the document will automatically fall back to the fallback locale value. If this property is not enabled, the value will not be populated unless a fallback is explicitly provided in the request. True by default. |
| **filterAvailableLocales** | A function that is called with the array of locales and the req, it should return locales to show in admin UI selector. |

### Locales

The locales array is a list of all the languages that you would like to support. This can be strings for each language code, or full configuration objects for more advanced options.

The locale codes do not need to be in any specific format. It's up to you to define how to represent your locales. Common patterns are to use two-letter ISO 639 language codes or four-letter language and country codes (ISO 3166‑1) such as en-US, en-UK, es-MX, etc.

#### Locale Object

| Option | Description |
|--------|-------------|
| **code** * | Unique code to identify the language throughout the APIs for locale and fallbackLocale |
| **label** | A string to use for the selector when choosing a language, or an object keyed on the i18n keys for different languages in use. |
| **rtl** | A boolean that when true will make the admin UI display in Right-To-Left. |
| **fallbackLocale** | The code for this language to fallback to when properties of a document are not present. |

*An asterisk denotes that a property is required.*

### Filter Available Options

In some projects you may want to filter the available locales shown in the admin UI selector. You can do this by providing a `filterAvailableLocales` function in your Payload Config. This is called on the server side and is passed the array of locales. This means that you can determine what locales are visible in the localizer selection menu at the top of the admin panel. You could do this per user, or implement a function that scopes these to tenants and more. Here is an example using request headers in a multi-tenant application:

```typescript
// ... rest of Payload config
localization: {
  defaultLocale: 'en',
  locales: ['en', 'es'],
  filterAvailableLocales: async ({ req, locales }) => {
    if (getTenantFromCookie(req.headers, 'text')) {
      const fullTenant = await req.payload.findByID({
        id: getTenantFromCookie(req.headers, 'text') as string,
        collection: 'tenants',
        req,
      })
      if (fullTenant && fullTenant.supportedLocales?.length) {
        return locales.filter((locale) => {
          return fullTenant.supportedLocales?.includes(locale.code as 'en' | 'es')
        })
      }
    }
    return locales
  },
}
```

Since the filtering happens at the root level of the application and its result is not calculated every time you navigate to a new page, you may want to call router.refresh in a custom component that watches when values that affect the result change. In the example above, you would want to do this when supportedLocales changes on the tenant document.

### Field Localization

Payload Localization works on a field level—not a document level. In addition to configuring the base Payload Config to support Localization, you need to specify each field that you would like to localize.

Here is an example of how to enable Localization for a field:

```typescript
{
  name: 'title',
  type: 'text',
  localized: true,
}
```

With the above configuration, the title field will now be saved in the database as an object of all locales instead of a single string.

All field types with a name property support the localized property—even the more complex field types like arrays and blocks.

**Note:** Enabling Localization for field types that support nested fields will automatically create localized "sets" of all fields contained within the field. For example, if you have a page layout using a blocks field type, you have the choice of either localizing the full layout, by enabling Localization on the top-level blocks field, or only certain fields within the layout.

**Important:** When converting an existing field to or from localized: true the data structure in the document will change for this field and so existing data for this field will be lost. Before changing the Localization setting on fields with existing data, you may need to consider a field migration strategy.

### Retrieving Localized Docs

When retrieving documents, you can specify which locale you'd like to receive as well as which fallback locale should be used.

#### REST API

REST API locale functionality relies on URL query parameters.

**?locale=**

Specify your desired locale by providing the locale query parameter directly in the endpoint URL.

**?fallback-locale=**

Specify fallback locale to be used by providing the fallback-locale query parameter. This can be provided as either a valid locale as provided to your base Payload Config, or 'null', 'false', or 'none' to disable falling back.

Example:

```javascript
fetch('https://localhost:3000/api/pages?locale=es&fallback-locale=none');
```

#### GraphQL API

In the GraphQL API, you can specify locale and fallbackLocale args to all relevant queries and mutations.

The locale arg will only accept valid locales, but locales will be formatted automatically as valid GraphQL enum values (dashes or special characters will be converted to underscores, spaces will be removed, etc.). If you are curious to see how locales are auto-formatted, you can use the GraphQL playground.

The fallbackLocale arg will accept valid locales as well as none to disable falling back.

Example:

```graphql
query {
  Posts(locale: de, fallbackLocale: none) {
    docs {
      title
    }
  }
}
```

In GraphQL, specifying the locale at the top level of a query will automatically apply it throughout all nested relationship fields. You can override this behavior by re-specifying locale arguments in nested related document queries.

#### Local API

You can specify locale as well as fallbackLocale within the Local API as well as properties on the options argument. The locale property will accept any valid locale, and the fallbackLocale property will accept any valid locale as well as 'null', 'false', false, and 'none'.

Example:

```typescript
const posts = await payload.find({
  collection: 'posts',
  locale: 'es',
  fallbackLocale: false,
})
```

**Tip:** The REST and Local APIs can return all Localization data in one request by passing 'all' or '*' as the locale parameter. The response will be structured so that field values come back as the full objects keyed for each locale instead of the single, translated value.

## Internationalization (I18n)

The Admin Panel is translated in over 30 languages and counting. With I18n, editors can navigate the interface and read API error messages in their preferred language. This is similar to Localization, but instead of managing translations for the data itself, you are managing translations for your application's interface.

By default, Payload comes preinstalled with English, but you can easily load other languages into your own application. Languages are automatically detected based on the request. If no language is detected, or if the user's language is not yet supported by your application, English will be chosen.

To add I18n to your project, you first need to install the `@payloadcms/translations` package:

```bash
pnpm install @payloadcms/translations
```

Once installed, it can be configured using the i18n key in your Payload Config:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  i18n: {
    // ...
  },
})
```

**Note:** If there is a language that Payload does not yet support, we accept code contributions.

### Config Options

You can easily customize and override any of the i18n settings that Payload provides by default. Payload will use your custom options and merge them in with its own.

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  i18n: {
    fallbackLanguage: 'en', // default
  },
})
```

The following options are available:

| Option | Description |
|--------|-------------|
| **fallbackLanguage** | The language to fall back to if the user's preferred language is not supported. Default is 'en'. |
| **translations** | An object containing the translations. The keys are the language codes and the values are the translations. |
| **supportedLanguages** | An object containing the supported languages. The keys are the language codes and the values are the translations. |

### Adding Languages

You can easily add new languages to your Payload app by providing the translations for the new language. Payload maintains a number of built-in translations that can be imported from `@payloadcms/translations`, but you can also provide your own Custom Translations to support any language.

To add a new language, use the i18n.supportedLanguages key in your Payload Config:

```typescript
import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { de } from '@payloadcms/translations/languages/de'

export default buildConfig({
  // ...
  i18n: {
    supportedLanguages: { en, de },
  },
})
```

**Tip:** It's best to only support the languages that you need so that the bundled JavaScript is kept to a minimum for your project.

### Custom Translations

You can customize Payload's built-in translations either by extending existing languages or by adding new languages entirely. This can be done by injecting new translation strings into existing languages, or by providing an entirely new language keys altogether.

To add Custom Translations, use the i18n.translations key in your Payload Config:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  //...
  i18n: {
    translations: {
      en: {
        custom: {
          // namespace can be anything you want
          key1: 'Translation with {{variable}}', // translation
        },
        // override existing translation keys
        general: {
          dashboard: 'Home',
        },
      },
    },
  },
  //...
})
```

### Project Translations

While Payload's built-in features come fully translated, you may also want to translate parts of your own project. This is possible in places like Collections and Globals, such as on their labels and groups, field labels, descriptions or input placeholder text.

To do this, provide the translations wherever applicable, keyed to the language code:

```typescript
import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: {
      en: 'Article',
      es: 'Artículo',
    },
    plural: {
      en: 'Articles',
      es: 'Artículos',
    },
  },
  admin: {
    group: {
      en: 'Content',
      es: 'Contenido',
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: {
        en: 'Title',
        es: 'Título',
      },
      admin: {
        placeholder: {
          en: 'Enter title',
          es: 'Introduce el título',
        },
      },
    },
  ],
}
```

### Changing Languages

Users can change their preferred language in their account settings or by otherwise manipulating their User Preferences.

#### Node.js

Payload's backend sets the language on incoming requests before they are handled. This allows backend validation to return error messages in the user's own language or system generated emails to be sent using the correct translation. You can make HTTP requests with the accept-language header and Payload will use that language.

Anywhere in your Payload app that you have access to the req object, you can access Payload's extensive internationalization features assigned to `req.i18n`. To access text translations you can use `req.t('namespace:key')`.

### TypeScript

In order to use Custom Translations in your project, you need to provide the types for the translations.

Here we create a shareable translations object. We will import this in both our custom components and in our Payload config.

In this example we show how to extend English, but you can do the same for any language you want.

```typescript
// <rootDir>/custom-translations.ts

import { enTranslations } from '@payloadcms/translations/languages/en'
import type { NestedKeysStripped } from '@payloadcms/translations'

export const customTranslations = {
  en: {
    general: {
      myCustomKey: 'My custom english translation',
    },
    fields: {
      addLabel: 'Add!',
    },
  },
}

export type CustomTranslationsObject = typeof customTranslations.en &
  typeof enTranslations
export type CustomTranslationsKeys =
  NestedKeysStripped<CustomTranslationsObject>
```

Import the shared translations object into our Payload config so they are available for use:

```typescript
// <rootDir>/payload.config.ts

import { buildConfig } from 'payload'

import { customTranslations } from './custom-translations'

export default buildConfig({
  //...
  i18n: {
    translations: customTranslations,
  },
  //...
})
```

Import the shared translation types to use in your Custom Component:

```typescript
// <rootDir>/components/MyComponent.tsx

'use client'
import type React from 'react'
import { useTranslation } from '@payloadcms/ui'

import type {
  CustomTranslationsObject,
  CustomTranslationsKeys,
} from '../custom-translations'

export const MyComponent: React.FC = () => {
  const { i18n, t } = useTranslation<
    CustomTranslationsObject,
    CustomTranslationsKeys
  >() // These generics merge your custom translations with the default client translations

  return t('general:myCustomKey')
}
```

Additionally, Payload exposes the t function in various places, for example in labels. Here is how you would type those:

```typescript
// <rootDir>/fields/myField.ts

import type {
  DefaultTranslationKeys,
  TFunction,
} from '@payloadcms/translations'
import type { Field } from 'payload'

import { CustomTranslationsKeys } from '../custom-translations'

const field: Field = {
  name: 'myField',
  type: 'text',
  label: ({ t: defaultT }) => {
    const t = defaultT as TFunction<CustomTranslationsKeys>
    return t('fields:addLabel')
  },
}
```