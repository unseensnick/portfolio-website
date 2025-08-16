# Payload CMS Live Preview - Complete Documentation

## Overview

With Live Preview you can render your front-end application directly within the Admin Panel. As you type, your changes take effect in real-time. No need to save a draft or publish your changes. This works in both Server-side as well as Client-side environments.

Live Preview works by rendering an iframe on the page that loads your front-end application. The Admin Panel communicates with your app through window.postMessage events. These events are emitted every time a change is made to the Document. Your app then listens for these events and re-renders itself with the data it receives.

## Implementation Methods

There are two ways to use Live Preview in your own application depending on whether your front-end framework supports Server Components:

1. **Server-side Live Preview (suggested)**
2. **Client-side Live Preview**

We suggest using server-side Live Preview if your framework supports Server Components, it is both simpler to setup and more performant to run than the client-side alternative.

## Configuration

To add Live Preview, use the admin.livePreview property in your Payload Config:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    // ...
    livePreview: {
      url: 'http://localhost:3000',
      collections: ['pages'],
    },
  },
})
```

**Reminder:** Alternatively, you can define the admin.livePreview property on individual Collection Admin Configs and Global Admin Configs. Settings defined here will be merged into the top-level as overrides.

### Configuration Options

Setting up Live Preview is easy. This can be done either globally through the Root Admin Config, or on individual Collection Admin Configs and Global Admin Configs. Once configured, a new "Live Preview" tab will appear at the top of enabled Documents. Navigating to this tab opens the preview window and loads your front-end application.

The following options are available:

| Path | Description |
|------|-------------|
| url | String, or function that returns a string, pointing to your front-end application. This value is used as the iframe src. |
| breakpoints | Array of breakpoints to be used as "device sizes" in the preview window. Each item appears as an option in the toolbar. |
| collections | Array of collection slugs to enable Live Preview on. |
| globals | Array of global slugs to enable Live Preview on. |

### URL Configuration

The url property resolves to a string that points to your front-end application. This value is used as the src attribute of the iframe rendering your front-end. Once loaded, the Admin Panel will communicate directly with your app through window.postMessage events.

To set the URL, use the admin.livePreview.url property in your Payload Config:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    // ...
    livePreview: {
      url: 'http://localhost:3000', 
      collections: ['pages'],
    },
  },
})
```

#### Dynamic URLs

You can also pass a function in order to dynamically format URLs. This is useful for multi-tenant applications, localization, or any other scenario where the URL needs to be generated based on the Document being edited.

To set dynamic URLs, set the admin.livePreview.url property in your Payload Config to a function:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    // ...
    livePreview: {
      url: ({ data, collectionConfig, locale }) =>
        `${data.tenant.url}${
          collectionConfig.slug === 'posts'
            ? `/posts/${data.slug}`
            : `${data.slug !== 'home' ? `/${data.slug}` : ''}`
        }${locale ? `?locale=${locale?.code}` : ''}`, // Localization query param
      collections: ['pages'],
    },
  },
})
```

The following arguments are provided to the url function:

| Path | Description |
|------|-------------|
| data | The data of the Document being edited. This includes changes that have not yet been saved. |
| locale | The locale currently being edited (if applicable). |
| collectionConfig | The Collection Admin Config of the Document being edited. |
| globalConfig | The Global Admin Config of the Document being edited. |
| req | The Payload Request object. |

You can return either an absolute URL or relative URL from this function. If you don't know the URL of your frontend at build-time, you can return a relative URL, and in that case, Payload will automatically construct an absolute URL by injecting the protocol, domain, and port from your browser window. Returning a relative URL is helpful for platforms like Vercel where you may have preview deployment URLs that are unknown at build time.

If your application requires a fully qualified URL, or you are attempting to preview with a frontend on a different domain, you can use the req property to build this URL:

```javascript
url: ({ data, req }) => `${req.protocol}//${req.host}/${data.slug}` 
```

### Breakpoints

The breakpoints property is an array of objects which are used as "device sizes" in the preview window. Each item will render as an option in the toolbar. When selected, the preview window will resize to the exact dimensions specified in that breakpoint.

To set breakpoints, use the admin.livePreview.breakpoints property in your Payload Config:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    // ...
    livePreview: {
      url: 'http://localhost:3000',
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
      ],
    },
  },
})
```

The following options are available for each breakpoint:

| Path | Description |
|------|-------------|
| label * | The label to display in the drop-down. This is what the user will see. |
| name * | The name of the breakpoint. |
| width * | The width of the breakpoint. This is used to set the width of the iframe. |
| height * | The height of the breakpoint. This is used to set the height of the iframe. |

*An asterisk denotes that a property is required.*

The "Responsive" option is always available in the drop-down and requires no additional configuration. This is the default breakpoint that will be used on initial load. This option styles the iframe with a width and height of 100% so that it fills the screen at its maximum size and automatically resizes as the window changes size.

You may also explicitly resize the Live Preview by using the corresponding inputs in the toolbar. This will temporarily override the breakpoint selection to "Custom" until a predefined breakpoint is selected once again.

If you prefer to freely resize the Live Preview without the use of breakpoints, you can open it in a new window by clicking the button in the toolbar. This will close the iframe and open a new window which can be resized as you wish. Closing it will automatically re-open the iframe.

## Server-side Live Preview

Server-side Live Preview is only for front-end frameworks that support the concept of Server Components, i.e. React Server Components. If your front-end application is built with a client-side framework like the Next.js Pages Router, React Router, Vue 3, etc., see client-side Live Preview.

Server-side Live Preview works by making a roundtrip to the server every time your document is saved, i.e. draft save, autosave, or publish. While using Live Preview, the Admin Panel emits a new window.postMessage event which your front-end application can use to invoke this process. In Next.js, this means simply calling router.refresh() which will hydrate the HTML using new data straight from the Local API.

It is recommended that you enable Autosave alongside Live Preview to make the experience feel more responsive.

If your front-end application is built with React, you can use the RefreshRouteOnSave component that Payload provides. In the future, all other major frameworks like Vue and Svelte will be officially supported. If you are using any of these frameworks today, you can still integrate with Live Preview yourself using the underlying tooling that Payload provides.

### React Implementation

If your front-end application is built with server-side React like Next.js App Router, you can use the RefreshRouteOnSave component that Payload provides.

First, install the @payloadcms/live-preview-react package:

```bash
npm install @payloadcms/live-preview-react
```

Then, render the RefreshRouteOnSave component anywhere in your page.tsx. Here's an example:

**page.tsx:**

```javascript
import { RefreshRouteOnSave } from './RefreshRouteOnSave.tsx'
import { getPayload } from 'payload'
import config from '../payload.config'

export default async function Page() {
  const payload = await getPayload({ config })

  const page = await payload.findByID({
    collection: 'pages',
    id: '123',
    draft: true,
    trash: true, // add this if trash is enabled in your collection and want to preview trashed documents
  })

  return (
    <Fragment>
      <RefreshRouteOnSave />
      <h1>{page.title}</h1>
    </Fragment>
  )
}
```

**RefreshRouteOnSave.tsx:**

```javascript
'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React from 'react'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()

  return (
    <PayloadLivePreview
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_PAYLOAD_URL}
    />
  )
}
```

### Building Your Own Router Refresh Component

No matter what front-end framework you are using, you can build your own component using the same underlying tooling that Payload provides.

First, install the base @payloadcms/live-preview package:

```bash
npm install @payloadcms/live-preview
```

This package provides the following functions:

| Path | Description |
|------|-------------|
| ready | Sends a window.postMessage event to the Admin Panel to indicate that the front-end is ready to receive messages. |
| isDocumentEvent | Checks if a MessageEvent originates from the Admin Panel and is a document-level event, i.e. draft save, autosave, publish, etc. |

With these functions, you can build your own hook using your front-end framework of choice:

```javascript
import { ready, isDocumentEvent } from '@payloadcms/live-preview'

// To build your own component:
// 1. Listen for document-level `window.postMessage` events sent from the Admin Panel
// 2. Tell the Admin Panel when it is ready to receive messages
// 3. Refresh the route every time a new document-level event is received
// 4. Unsubscribe from the `window.postMessage` events when it unmounts
```

Here is an example of what the same RefreshRouteOnSave React component from above looks like under the hood:

```javascript
'use client'

import type React from 'react'

import { isDocumentEvent, ready } from '@payloadcms/live-preview'
import { useCallback, useEffect, useRef } from 'react'

export const RefreshRouteOnSave: React.FC<{
  apiRoute?: string
  depth?: number
  refresh: () => void
  serverURL: string
}> = (props) => {
  const { apiRoute, depth, refresh, serverURL } = props
  const hasSentReadyMessage = useRef<boolean>(false)

  const onMessage = useCallback(
    (event: MessageEvent) => {
      if (isDocumentEvent(event, serverURL)) {
        if (typeof refresh === 'function') {
          refresh()
        }
      }
    },
    [refresh, serverURL],
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', onMessage)
    }

    if (!hasSentReadyMessage.current) {
      hasSentReadyMessage.current = true

      ready({
        serverURL,
      })
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', onMessage)
      }
    }
  }, [serverURL, onMessage, depth, apiRoute])

  return null
}
```

## Client-side Live Preview

If your front-end application supports Server Components like the Next.js App Router, etc., we suggest setting up server-side Live Preview instead.

While using Live Preview, the Admin Panel emits a new window.postMessage event every time your document has changed. Your front-end application can listen for these events and re-render accordingly.

If your front-end application is built with React or Vue, use the useLivePreview hooks that Payload provides. In the future, all other major frameworks like Svelte will be officially supported. If you are using any of these frameworks today, you can still integrate with Live Preview yourself using the underlying tooling that Payload provides.

### Hook Arguments and Return Values

By default, all hooks accept the following args:

| Path | Description |
|------|-------------|
| serverURL * | The URL of your Payload server. |
| initialData | The initial data of the document. The live data will be merged in as changes are made. |
| depth | The depth of the relationships to fetch. Defaults to 0. |
| apiRoute | The path of your API route as defined in routes.api. Defaults to /api. |

*An asterisk denotes that a property is required.*

And return the following values:

| Path | Description |
|------|-------------|
| data | The live data of the document, merged with the initial data. |
| isLoading | A boolean that indicates whether or not the document is loading. |

If your front-end is tightly coupled to required fields, you should ensure that your UI does not break when these fields are removed. For example, if you are rendering something like data.relatedPosts[0].title, your page will break once you remove the first related post. To get around this, use conditional logic, optional chaining, or default values in your UI where needed. For example, data?.relatedPosts?.[0]?.title.

It is important that the depth argument matches exactly with the depth of your initial page request. The depth property is used to populated relationships and uploads beyond their IDs.

### Supported Frameworks

Live Preview will work with any front-end framework that supports the native window.postMessage API. By default, Payload officially supports the most popular frameworks, including:

- React
- Vue

If your framework is not listed, you can still integrate with Live Preview using the underlying tooling that Payload provides.

### React Implementation

If your front-end application is built with client-side React like Next.js Pages Router, you can use the useLivePreview hook that Payload provides.

First, install the @payloadcms/live-preview-react package:

```bash
npm install @payloadcms/live-preview-react
```

Then, use the useLivePreview hook in your React component:

```javascript
'use client'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { Page as PageType } from '@/payload-types'

// Fetch the page in a server component, pass it to the client component, then thread it through the hook
// The hook will take over from there and keep the preview in sync with the changes you make
// The `data` property will contain the live data of the document
export const PageClient: React.FC<{
  page: {
    title: string
  }
}> = ({ page: initialPage }) => {
  const { data } = useLivePreview<PageType>({
    initialData: initialPage,
    serverURL: PAYLOAD_SERVER_URL,
    depth: 2,
  })

  return <h1>{data.title}</h1>
}
```

**Reminder:** If you are using React Server Components, we strongly suggest setting up server-side Live Preview instead.

### Vue Implementation

If your front-end application is built with Vue 3 or Nuxt 3, you can use the useLivePreview composable that Payload provides.

First, install the @payloadcms/live-preview-vue package:

```bash
npm install @payloadcms/live-preview-vue
```

Then, use the useLivePreview hook in your Vue component:

```vue
<script setup lang="ts">
import type { PageData } from '~/types';
import { defineProps } from 'vue';
import { useLivePreview } from '@payloadcms/live-preview-vue';

// Fetch the initial data on the parent component or using async state
const props = defineProps<{ initialData: PageData }>();

// The hook will take over from here and keep the preview in sync with the changes you make.
// The `data` property will contain the live data of the document only when viewed from the Preview view of the Admin UI.
const { data } = useLivePreview<PageData>({
  initialData: props.initialData,
  serverURL: "<PAYLOAD_SERVER_URL>",
  depth: 2,
});
</script>

<template>
  <h1>{{ data.title }}</h1>
</template>
```

### Building Your Own Hook

No matter what front-end framework you are using, you can build your own hook using the same underlying tooling that Payload provides.

First, install the base @payloadcms/live-preview package:

```bash
npm install @payloadcms/live-preview
```

This package provides the following functions:

| Path | Description |
|------|-------------|
| subscribe | Subscribes to the Admin Panel's window.postMessage events and calls the provided callback function. |
| unsubscribe | Unsubscribes from the Admin Panel's window.postMessage events. |
| ready | Sends a window.postMessage event to the Admin Panel to indicate that the front-end is ready to receive messages. |
| isLivePreviewEvent | Checks if a MessageEvent originates from the Admin Panel and is a Live Preview event, i.e. debounced form state. |

The subscribe function takes the following args:

| Path | Description |
|------|-------------|
| callback * | A callback function that is called with data every time a change is made to the document. |
| serverURL * | The URL of your Payload server. |
| initialData | The initial data of the document. The live data will be merged in as changes are made. |
| depth | The depth of the relationships to fetch. Defaults to 0. |

With these functions, you can build your own hook using your front-end framework of choice:

```javascript
import { subscribe, unsubscribe } from '@payloadcms/live-preview'

// To build your own hook, subscribe to Live Preview events using the `subscribe` function
// It handles everything from:
// 1. Listening to `window.postMessage` events
// 2. Merging initial data with active form state
// 3. Populating relationships and uploads
// 4. Calling the `onChange` callback with the result
// Your hook should also:
// 1. Tell the Admin Panel when it is ready to receive messages
// 2. Handle the results of the `onChange` callback to update the UI
// 3. Unsubscribe from the `window.postMessage` events when it unmounts
```

Here is an example of what the same useLivePreview React hook from above looks like under the hood:

```javascript
import { subscribe, unsubscribe, ready } from '@payloadcms/live-preview'
import { useCallback, useEffect, useState, useRef } from 'react'

export const useLivePreview = <T extends any>(props: {
  depth?: number
  initialData: T
  serverURL: string
}): {
  data: T
  isLoading: boolean
} => {
  const { depth = 0, initialData, serverURL } = props
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const hasSentReadyMessage = useRef<boolean>(false)

  const onChange = useCallback((mergedData) => {
    // When a change is made, the `onChange` callback will be called with the merged data
    // Set this merged data into state so that React will re-render the UI
    setData(mergedData)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Listen for `window.postMessage` events from the Admin Panel
    // When a change is made, the `onChange` callback will be called with the merged data
    const subscription = subscribe({
      callback: onChange,
      depth,
      initialData,
      serverURL,
    })

    // Once subscribed, send a `ready` message back up to the Admin Panel
    // This will indicate that the front-end is ready to receive messages
    if (!hasSentReadyMessage.current) {
      hasSentReadyMessage.current = true

      ready({
        serverURL,
      })
    }

    // When the component unmounts, unsubscribe from the `window.postMessage` events
    return () => {
      unsubscribe(subscription)
    }
  }, [serverURL, onChange, depth, initialData])

  return {
    data,
    isLoading,
  }
}
```

When building your own hook, ensure that the args and return values are consistent with the ones listed at the top of this document. This will ensure that all hooks follow the same API.

## Troubleshooting

### Server-side Live Preview Issues

#### Updates do not appear as fast as client-side Live Preview

If you are noticing that updates feel less snappy than client-side Live Preview (i.e. the useLivePreview hook), this is because of how the two differ in how they work—instead of emitting events against form state, server-side Live Preview refreshes the route after a new document is saved.

Use Autosave to mimic this effect server-side. Try decreasing the value of versions.autoSave.interval to make the experience feel more responsive:

```javascript
// collection.ts
{
   versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
  },
}
```

### Client-side Live Preview Issues

#### Relationships and/or uploads are not populating

If you are using relationships or uploads in your front-end application, and your front-end application runs on a different domain than your Payload server, you may need to configure CORS to allow requests to be made between the two domains. This includes sites that are running on a different port or subdomain. Similarly, if you are protecting resources behind user authentication, you may also need to configure CSRF to allow cookies to be sent between the two domains. For example:

```javascript
// payload.config.ts
{
  // ...
  // If your site is running on a different domain than your Payload server,
  // This will allow requests to be made between the two domains
  cors: [
    'http://localhost:3001' // Your front-end application
  ],
  // If you are protecting resources behind user authentication,
  // This will allow cookies to be sent between the two domains
  csrf: [
    'http://localhost:3001' // Your front-end application
  ],
}
```

#### Relationships and/or uploads disappear after editing a document

It is possible that either you are setting an improper depth in your initial request and/or your useLivePreview hook, or they're mismatched. Ensure that the depth parameter is set to the correct value, and that it matches exactly in both places. For example:

```javascript
// Your initial request
const { docs } = await payload.find({
  collection: 'pages',
  depth: 1, // Ensure this is set to the proper depth for your application
  where: {
    slug: {
      equals: 'home',
    },
  },
})

// Your hook
const { data } = useLivePreview<PageType>({
  initialData: initialPage,
  serverURL: PAYLOAD_SERVER_URL,
  depth: 1, // Ensure this matches the depth of your initial request
})
```

### General Issues

#### Iframe refuses to connect

If your front-end application has set a Content Security Policy (CSP) that blocks the Admin Panel from loading your front-end application, the iframe will not be able to load your site. To resolve this, you can whitelist the Admin Panel's domain in your CSP by setting the frame-ancestors directive:

```
frame-ancestors: "self" localhost:* https://your-site.com;
```

## Examples

For a working demonstration of this, check out the official Live Preview Example. There you will find an example of a fully integrated Next.js App Router front-end that runs on the same server as Payload.