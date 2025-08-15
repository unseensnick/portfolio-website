# Payload Admin Panel Customization Guide

## Overview

The Payload Admin Panel is designed to be as minimal and straightforward as possible to allow for easy customization and full control over the UI. In order for Payload to support this level of customization, Payload provides a pattern for you to supply your own React components through your Payload Config.

All Custom Components in Payload are React Server Components by default. This enables the use of the Local API directly on the front-end. Custom Components are available for nearly every part of the Admin Panel for extreme granularity and control.

**Note:** Client Components continue to be fully supported. To use Client Components in your app, simply include the 'use client' directive. Payload will automatically detect and remove all non-serializable default props before rendering your component.

There are four main types of Custom Components in Payload:

- Root Components
- Collection Components
- Global Components
- Field Components

To swap in your own Custom Component, first determine the scope that corresponds to what you are trying to accomplish, consult the list of available components, then author your React component(s) accordingly.

## Defining Custom Components

As Payload compiles the Admin Panel, it checks your config for Custom Components. When detected, Payload either replaces its own default component with yours, or if none exists by default, renders yours outright. While there are many places where Custom Components are supported in Payload, each is defined in the same way using Component Paths.

To add a Custom Component, point to its file path in your Payload Config:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      logout: {
        Button: '/src/components/Logout#MyComponent', 
      },
    },
  },
})
```

**Note:** All Custom Components can be either Server Components or Client Components, depending on the presence of the 'use client' directive at the top of the file.

### Component Paths

In order to ensure the Payload Config is fully Node.js compatible and as lightweight as possible, components are not directly imported into your config. Instead, they are identified by their file path for the Admin Panel to resolve on its own.

Component Paths, by default, are relative to your project's base directory. This is either your current working directory, or the directory specified in config.admin.importMap.baseDir.

Components using named exports are identified either by appending # followed by the export name, or using the exportName property. If the component is the default export, this can be omitted.

```javascript
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  // ...
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, 'src'), 
    },
    components: {
      logout: {
        Button: '/components/Logout#MyComponent', 
      },
    },
  },
})
```

In this example, we set the base directory to the src directory, and omit the /src/ part of our component path string.

### Component Config

While Custom Components are usually defined as a string, you can also pass in an object with additional options:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      logout: {
        Button: {
          path: '/src/components/Logout',
          exportName: 'MyComponent',
        },
      },
    },
  },
})
```

The following options are available:

| Property | Description |
|----------|-------------|
| clientProps | Props to be passed to the Custom Components if it's a Client Component. |
| exportName | Instead of declaring named exports using # in the component path, you can also omit them from path and pass them in here. |
| path | File path to the Custom Component. Named exports can be appended to the end of the path, separated by a #. |
| serverProps | Props to be passed to the Custom Component if it's a Server Component. |

## Building Custom Components

All Custom Components in Payload are React Server Components by default. This enables the use of the Local API directly on the front-end, among other things.

### Default Props

To make building Custom Components as easy as possible, Payload automatically provides common props, such as the payload class and the i18n object. This means that when building Custom Components within the Admin Panel, you do not have to get these yourself.

Here is an example:

```javascript
import React from 'react'
import type { Payload } from 'payload'

async function MyServerComponent({
  payload, 
}: {
  payload: Payload
}) {
  const page = await payload.findByID({
    collection: 'pages',
    id: '123',
  })

  return <p>{page.title}</p>
}
```

Each Custom Component receives the following props by default:

| Prop | Description |
|------|-------------|
| payload | The Payload class. |
| i18n | The i18n object. |

**Reminder:** All Custom Components also receive various other props that are specific to the component being rendered. See Root Components, Collection Components, Global Components, or Field Components for a complete list of all default props per component.

### Custom Props

It is also possible to pass custom props to your Custom Components. To do this, you can use either the clientProps or serverProps properties depending on whether your prop is serializable, and whether your component is a Server or Client Component.

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    
    components: {
      logout: {
        Button: {
          path: '/src/components/Logout#MyComponent',
          clientProps: {
            myCustomProp: 'Hello, World!', 
          },
        },
      },
    },
  },
})
```

Here is how your component might receive this prop:

```javascript
import React from 'react'
import { Link } from '@payloadcms/ui'

export function MyComponent({ myCustomProp }: { myCustomProp: string }) {
  return <Link href="/admin/logout">{myCustomProp}</Link>
}
```

### Client Components

All Custom Components in Payload are React Server Components by default, however, it is possible to use Client Components by simply adding the 'use client' directive at the top of your file. Payload will automatically detect and remove all non-serializable default props before rendering your component.

```javascript
'use client'
import React, { useState } from 'react'

export function MyClientComponent() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  )
}
```

**Reminder:** Client Components cannot be passed non-serializable props. If you are rendering your Client Component from within a Server Component, ensure that its props are serializable.

### Accessing the Payload Config

From any Server Component, the Payload Config can be accessed directly from the payload prop:

```javascript
import React from 'react'

export default async function MyServerComponent({
  payload: {
    config, 
  },
}) {
  return <Link href={config.serverURL}>Go Home</Link>
}
```

But, the Payload Config is non-serializable by design. It is full of custom validation functions and more. This means that the Payload Config, in its entirety, cannot be passed directly to Client Components.

For this reason, Payload creates a Client Config and passes it into the Config Provider. This is a serializable version of the Payload Config that can be accessed from any Client Component via the useConfig hook:

```javascript
'use client'
import React from 'react'
import { useConfig } from '@payloadcms/ui'

export function MyClientComponent() {
  const {
    config: { serverURL },
  } = useConfig()

  return <Link href={serverURL}>Go Home</Link>
}
```

See Using Hooks for more details.

Similarly, all Field Components automatically receive their respective Field Config through props.

Within Server Components, this prop is named field:

```javascript
import React from 'react'
import type { TextFieldServerComponent } from 'payload'

export const MyClientFieldComponent: TextFieldServerComponent = ({
  field: { name },
}) => {
  return <p>{`This field's name is ${name}`}</p>
}
```

Within Client Components, this prop is named clientField because its non-serializable props have been removed:

```javascript
'use client'
import React from 'react'
import type { TextFieldClientComponent } from 'payload'

export const MyClientFieldComponent: TextFieldClientComponent = ({
  clientField: { name },
}) => {
  return <p>{`This field's name is ${name}`}</p>
}
```

### Getting the Current Language

All Custom Components can support language translations to be consistent with Payload's I18n. This will allow your Custom Components to display the correct language based on the user's preferences.

To do this, first add your translation resources to the I18n Config. Then from any Server Component, you can translate resources using the getTranslation function from @payloadcms/translations.

All Server Components automatically receive the i18n object as a prop by default:

```javascript
import React from 'react'
import { getTranslation } from '@payloadcms/translations'

export default async function MyServerComponent({ i18n }) {
  const translatedTitle = getTranslation(myTranslation, i18n) 

  return <p>{translatedTitle}</p>
}
```

The best way to do this within a Client Component is to import the useTranslation hook from @payloadcms/ui:

```javascript
'use client'
import React from 'react'
import { useTranslation } from '@payloadcms/ui'

export function MyClientComponent() {
  const { t, i18n } = useTranslation() 

  return (
    <ul>
      <li>{t('namespace1:key', { variable: 'value' })}</li>
      <li>{t('namespace2:key', { variable: 'value' })}</li>
      <li>{i18n.language}</li>
    </ul>
  )
}
```

See the Hooks documentation for a full list of available hooks.

### Getting the Current Locale

All Custom Views can support multiple locales to be consistent with Payload's Localization feature. This can be used to scope API requests, etc.

All Server Components automatically receive the locale object as a prop by default:

```javascript
import React from 'react'

export default async function MyServerComponent({ payload, locale }) {
  const localizedPage = await payload.findByID({
    collection: 'pages',
    id: '123',
    locale,
  })

  return <p>{localizedPage.title}</p>
}
```

The best way to do this within a Client Component is to import the useLocale hook from @payloadcms/ui:

```javascript
'use client'
import React from 'react'
import { useLocale } from '@payloadcms/ui'

function Greeting() {
  const locale = useLocale() 

  const trans = {
    en: 'Hello',
    es: 'Hola',
  }

  return <span>{trans[locale.code]}</span>
}
```

See the Hooks documentation for a full list of available hooks.

### Using Hooks

To make it easier to build your Custom Components, you can use Payload's built-in React Hooks in any Client Component. For example, you might want to interact with one of Payload's many React Contexts. To do this, you can use one of the many hooks available depending on your needs.

```javascript
'use client'
import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export function MyClientComponent() {
  const { slug } = useDocumentInfo() 

  return <p>{`Entity slug: ${slug}`}</p>
}
```

See the Hooks documentation for a full list of available hooks.

### Adding Styles

Payload has a robust CSS Library that you can use to style your Custom Components to match to Payload's built-in styling. This will ensure that your Custom Components integrate well into the existing design system. This will make it so they automatically adapt to any theme changes that might occur.

To apply custom styles, simply import your own .css or .scss file into your Custom Component:

```javascript
import './index.scss'

export function MyComponent() {
  return <div className="my-component">My Custom Component</div>
}
```

Then to colorize your Custom Component's background, for example, you can use the following CSS:

```css
.my-component {
  background-color: var(--theme-elevation-500);
}
```

Payload also exports its SCSS library for reuse which includes mixins, etc. To use this, simply import it as follows into your .scss file:

```scss
@import '~@payloadcms/ui/scss';

.my-component {
  @include mid-break {
    background-color: var(--theme-elevation-900);
  }
}
```

**Note:** You can also drill into Payload's own component styles, or easily apply global, app-wide CSS. More on that here.

## Import Map

In order for Payload to make use of Component Paths, an "Import Map" is automatically generated at either src/app/(payload)/admin/importMap.js or app/(payload)/admin/importMap.js. This file contains every Custom Component in your config, keyed to their respective paths. When Payload needs to lookup a component, it uses this file to find the correct import.

The Import Map is automatically regenerated at startup and whenever Hot Module Replacement (HMR) runs, or you can run payload generate:importmap to manually regenerate it.

### Overriding Import Map Location

Using the config.admin.importMap.importMapFile property, you can override the location of the import map. This is useful if you want to place the import map in a different location, or if you want to use a custom file name.

```javascript
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  // ...
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
      importMapFile: path.resolve(
        dirname,
        'app',
        '(payload)',
        'custom-import-map.js',
      ), 
    },
  },
})
```

### Custom Imports

If needed, custom items can be appended onto the Import Map. This is mostly only relevant for plugin authors who need to add a custom import that is not referenced in a known location.

To add a custom import to the Import Map, use the admin.dependencies property in your Payload Config:

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // ...
    dependencies: {
      myTestComponent: {
        // myTestComponent is the key - can be anything
        path: '/components/TestComponent.js#TestComponent',
        type: 'component',
        clientProps: {
          test: 'hello',
        },
      },
    },
  },
})
```

## Root Components

Root Components are those that affect the Admin Panel at a high-level, such as the logo or the main nav. You can swap out these components with your own Custom Components to create a completely custom look and feel.

When combined with Custom CSS, you can create a truly unique experience for your users, such as white-labeling the Admin Panel to match your brand.

To override Root Components, use the admin.components property at the root of your Payload Config:

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      // ...
    },
  },
})
```

### Root Component Config Options

The following options are available:

| Path | Description |
|------|-------------|
| actions | An array of Custom Components to be rendered within the header of the Admin Panel, providing additional interactivity and functionality. |
| afterDashboard | An array of Custom Components to inject into the built-in Dashboard, after the default dashboard contents. |
| afterLogin | An array of Custom Components to inject into the built-in Login, after the default login form. |
| afterNavLinks | An array of Custom Components to inject into the built-in Nav, after the links. |
| beforeDashboard | An array of Custom Components to inject into the built-in Dashboard, before the default dashboard contents. |
| beforeLogin | An array of Custom Components to inject into the built-in Login, before the default login form. |
| beforeNavLinks | An array of Custom Components to inject into the built-in Nav, before the links themselves. |
| graphics.Icon | The simplified logo used in contexts like the Nav component. |
| graphics.Logo | The full logo used in contexts like the Login view. |
| header | An array of Custom Components to be injected above the Payload header. |
| logout.Button | The button displayed in the sidebar that logs the user out. |
| Nav | Contains the sidebar / mobile menu in its entirety. |
| providers | Custom React Context providers that will wrap the entire Admin Panel. |
| views | Override or create new views within the Admin Panel. |

**Note:** You can also use set Collection Components and Global Components in their respective configs.

### Root Components Examples

#### actions

Actions are rendered within the header of the Admin Panel. Actions are typically used to display buttons that add additional interactivity and functionality, although they can be anything you'd like.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      actions: ['/path/to/your/component'],
    },
  },
})
```

Example Action component:

```javascript
export default function MyCustomAction() {
  return (
    <button onClick={() => alert('Hello, world!')}>
      This is a custom action component
    </button>
  )
}
```

#### beforeDashboard

The beforeDashboard property allows you to inject Custom Components into the built-in Dashboard, before the default dashboard contents.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      beforeDashboard: ['/path/to/your/component'],
    },
  },
})
```

Example beforeDashboard component:

```javascript
export default function MyBeforeDashboardComponent() {
  return <div>This is a custom component injected before the Dashboard.</div>
}
```

#### afterDashboard

Similar to beforeDashboard, the afterDashboard property allows you to inject Custom Components into the built-in Dashboard, after the default dashboard contents.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      afterDashboard: ['/path/to/your/component'],
    },
  },
})
```

Example afterDashboard component:

```javascript
export default function MyAfterDashboardComponent() {
  return <div>This is a custom component injected after the Dashboard.</div>
}
```

#### beforeLogin

The beforeLogin property allows you to inject Custom Components into the built-in Login view, before the default login form.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      beforeLogin: ['/path/to/your/component'],
    },
  },
})
```

Example beforeLogin component:

```javascript
export default function MyBeforeLoginComponent() {
  return <div>This is a custom component injected before the Login form.</div>
}
```

#### afterLogin

Similar to beforeLogin, the afterLogin property allows you to inject Custom Components into the built-in Login view, after the default login form.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      afterLogin: ['/path/to/your/component'],
    },
  },
})
```

Example afterLogin component:

```javascript
export default function MyAfterLoginComponent() {
  return <div>This is a custom component injected after the Login form.</div>
}
```

#### beforeNavLinks

The beforeNavLinks property allows you to inject Custom Components into the built-in Nav Component, before the nav links themselves.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      beforeNavLinks: ['/path/to/your/component'],
    },
  },
})
```

Example beforeNavLinks component:

```javascript
export default function MyBeforeNavLinksComponent() {
  return <div>This is a custom component injected before the Nav links.</div>
}
```

#### afterNavLinks

Similar to beforeNavLinks, the afterNavLinks property allows you to inject Custom Components into the built-in Nav, after the nav links.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      afterNavLinks: ['/path/to/your/component'],
    },
  },
})
```

Example afterNavLinks component:

```javascript
export default function MyAfterNavLinksComponent() {
  return <p>This is a custom component injected after the Nav links.</p>
}
```

#### Nav

The Nav property contains the sidebar / mobile menu in its entirety. Use this property to completely replace the built-in Nav with your own custom navigation.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      Nav: '/path/to/your/component',
    },
  },
})
```

Example Nav component:

```javascript
import { Link } from '@payloadcms/ui'

export default function MyCustomNav() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  )
}
```

#### graphics.Icon

The Icon property is the simplified logo used in contexts like the Nav component. This is typically a small, square icon that represents your brand.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      graphics: {
        Icon: '/path/to/your/component',
      },
    },
  },
})
```

Example Icon component:

```javascript
export default function MyCustomIcon() {
  return <img src="/path/to/your/icon.png" alt="My Custom Icon" />
}
```

#### graphics.Logo

The Logo property is the full logo used in contexts like the Login view. This is typically a larger, more detailed representation of your brand.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      graphics: {
        Logo: '/path/to/your/component',
      },
    },
  },
})
```

Example Logo component:

```javascript
export default function MyCustomLogo() {
  return <img src="/path/to/your/logo.png" alt="My Custom Logo" />
}
```

#### header

The header property allows you to inject Custom Components above the Payload header.

Examples of a custom header components might include an announcements banner, a notifications bar, or anything else you'd like to display at the top of the Admin Panel in a prominent location.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      header: ['/path/to/your/component'],
    },
  },
})
```

Example header component:

```javascript
export default function MyCustomHeader() {
  return (
    <header>
      <h1>My Custom Header</h1>
    </header>
  )
}
```

#### logout.Button

The logout.Button property is the button displayed in the sidebar that should log the user out when clicked.

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      logout: {
        Button: '/path/to/your/component',
      },
    },
  },
})
```

Example logout.Button component:

```javascript
export default function MyCustomLogoutButton() {
  return <button onClick={() => alert('Logging out!')}>Log Out</button>
}
```

## Customizing Views

Views are the individual pages that make up the Admin Panel, such as the Dashboard, List View, and Edit View. One of the most powerful ways to customize the Admin Panel is to create Custom Views. These are Custom Components that can either replace built-in views or be entirely new.

There are four types of views within the Admin Panel:

- Root Views
- Collection Views
- Global Views
- Document Views

To swap in your own Custom View, first determine the scope that corresponds to what you are trying to accomplish, consult the list of available components, then author your React component(s) accordingly.

### Configuration

#### Replacing Views

To customize views, use the admin.components.views property in your Payload Config. This is an object with keys for each view you want to customize. Each key corresponds to the view you want to customize.

The exact list of available keys depends on the scope of the view you are customizing, depending on whether it's a Root View, Collection View, or Global View. Regardless of the scope, the principles are the same.

Here is an example of how to swap out a built-in view:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      views: {
        dashboard: {
          Component: '/path/to/MyCustomDashboard',
        },
      },
    },
  },
})
```

For more granular control, pass a configuration object instead. Payload exposes the following properties for each view:

| Property | Description |
|----------|-------------|
| Component * | Pass in the component path that should be rendered when a user navigates to this route. |
| path * | Any valid URL path or array of paths that path-to-regexp understands. Must begin with a forward slash (/). |
| exact | Boolean. When true, will only match if the path matches the usePathname() exactly. |
| strict | When true, a path that has a trailing slash will only match a location.pathname with a trailing slash. This has no effect when there are additional URL segments in the pathname. |
| sensitive | When true, will match if the path is case sensitive. |
| meta | Page metadata overrides to apply to this view within the Admin Panel. |

*An asterisk denotes that a property is required.*

#### Adding New Views

To add a new view to the Admin Panel, simply add your own key to the views object. This is true for all view scopes.

New views require at least the Component and path properties:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      views: {
        myCustomView: {
          Component: '/path/to/MyCustomView#MyCustomViewComponent',
          path: '/my-custom-view',
        },
      },
    },
  },
})
```

**Note:** Routes are cascading, so unless explicitly given the exact property, they will match on URLs that simply start with the route's path. This is helpful when creating catch-all routes in your application. Alternatively, define your nested route before your parent route.

### Building Custom Views

Custom Views are simply Custom Components rendered at the page-level. Custom Views can either replace existing views or add entirely new ones. The process is generally the same regardless of the type of view you are customizing.

To understand how to build Custom Views, first review the Building Custom Components guide. Once you have a Custom Component ready, you can use it as a Custom View.

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollectionConfig: CollectionConfig = {
  // ...
  admin: {
    components: {
      views: {
        edit: {
          Component: '/path/to/MyCustomView', 
        },
      },
    },
  },
}
```

#### Default Props

Your Custom Views will be provided with the following props:

| Prop | Description |
|------|-------------|
| initPageResult | An object containing req, payload, permissions, etc. |
| clientConfig | The Client Config object. |
| importMap | The import map object. |
| params | An object containing the Dynamic Route Parameters. |
| searchParams | An object containing the Search Parameters. |
| doc | The document being edited. Only available in Document Views. |
| i18n | The i18n object. |
| payload | The Payload class. |

**Note:** Some views may receive additional props, such as Collection Views and Global Views. See the relevant section for more details.

Here is an example of a Custom View component:

```javascript
import type { AdminViewServerProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import React from 'react'

export function MyCustomView(props: AdminViewServerProps) {
  return (
    <Gutter>
      <h1>Custom Default Root View</h1>
      <p>This view uses the Default Template.</p>
    </Gutter>
  )
}
```

**Tip:** For consistent layout and navigation, you may want to wrap your Custom View with one of the built-in Template.

#### View Templates

Your Custom Root Views can optionally use one of the templates that Payload provides. The most common of these is the Default Template which provides the basic layout and navigation.

Here is an example of how to use the Default Template in your Custom View:

```javascript
import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

export function MyCustomView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>Custom Default Root View</h1>
        <p>This view uses the Default Template.</p>
      </Gutter>
    </DefaultTemplate>
  )
}
```

#### Securing Custom Views

All Custom Views are public by default. It's up to you to secure your custom views. If your view requires a user to be logged in or to have certain access rights, you should handle that within your view component yourself.

Here is how you might secure a Custom View:

```javascript
import type { AdminViewServerProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import React from 'react'

export function MyCustomView({ initPageResult }: AdminViewServerProps) {
  const {
    req: { user },
  } = initPageResult

  if (!user) {
    return <p>You must be logged in to view this page.</p>
  }

  return (
    <Gutter>
      <h1>Custom Default Root View</h1>
      <p>This view uses the Default Template.</p>
    </Gutter>
  )
}
```

### Root Views

Root Views are the main views of the Admin Panel. These are views that are scoped directly under the /admin route, such as the Dashboard or Account views.

To swap out Root Views with your own, or to create entirely new ones, use the admin.components.views property at the root of your Payload Config:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      views: {
        dashboard: {
          Component: '/path/to/Dashboard',
        },
        // Other options include:
        // - account
        // - [key: string]
        // See below for more details
      },
    },
  },
})
```

The following options are available:

| Property | Description |
|----------|-------------|
| account | The Account view is used to show the currently logged in user's Account page. |
| dashboard | The main landing page of the Admin Panel. |
| [key] | Any other key can be used to add a completely new Root View. |

### Collection Views

Collection Views are views that are scoped under the /collections route, such as the Collection List and Document Edit views.

To swap out Collection Views with your own, or to create entirely new ones, use the admin.components.views property of your Collection Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollectionConfig: CollectionConfig = {
  // ...
  admin: {
    components: {
      views: {
        edit: {
          default: {
            Component: '/path/to/MyCustomCollectionView',
          },
        },
        // Other options include:
        // - list
        // - [key: string]
        // See below for more details
      },
    },
  },
}
```

**Reminder:** The edit key is comprised of various nested views, known as Document Views, that relate to the same Collection Document.

The following options are available:

| Property | Description |
|----------|-------------|
| edit | The Edit View corresponds to a single Document for any given Collection and consists of various nested views. |
| list | The List View is used to show a list of Documents for any given Collection. |
| [key] | Any other key can be used to add a completely new Collection View. |

### Global Views

Global Views are views that are scoped under the /globals route, such as the Edit View.

To swap out Global Views with your own or create entirely new ones, use the admin.components.views property in your Global Config:

```javascript
import type { SanitizedGlobalConfig } from 'payload'

export const MyGlobalConfig: SanitizedGlobalConfig = {
  // ...
  admin: {
    components: {
      views: {
        edit: {
          default: {
            Component: '/path/to/MyCustomGlobalView',
          },
        },
        // Other options include:
        // - [key: string]
        // See below for more details
      },
    },
  },
}
```

**Reminder:** The edit key is comprised of various nested views, known as Document Views, that relate to the same Global Document.

The following options are available:

| Property | Description |
|----------|-------------|
| edit | The Edit View represents a single Document for any given Global and consists of various nested views. |
| [key] | Any other key can be used to add a completely new Global View. |

## Document Views

Document Views consist of multiple, individual views that together represent any single Collection or Global Document. All Document Views and are scoped under the /collections/:collectionSlug/:id or the /globals/:globalSlug route, respectively.

There are a number of default Document Views, such as the Edit View and API View, but you can also create entirely new views as needed. All Document Views share a layout and can be given their own tab-based navigation, if desired.

To customize Document Views, use the admin.components.views.edit[key] property in your Collection Config or Global Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollectionOrGlobalConfig: CollectionConfig = {
  // ...
  admin: {
    components: {
      views: {
        edit: {
          default: {
            Component: '/path/to/MyCustomEditView',
          },
          // Other options include:
          // - root
          // - api
          // - versions
          // - version
          // - [key: string]
          // See below for more details
        },
      },
    },
  },
}
```

### Config Options

The following options are available:

| Property | Description |
|----------|-------------|
| root | The Root View overrides all other nested views and routes. No document controls or tabs are rendered when this key is set. |
| default | The Default View is the primary view in which your document is edited. It is rendered within the "Edit" tab. |
| versions | The Versions View is used to navigate the version history of a single document. It is rendered within the "Versions" tab. |
| version | The Version View is used to edit a single version of a document. It is rendered within the "Version" tab. |
| api | The API View is used to display the REST API JSON response for a given document. It is rendered within the "API" tab. |
| livePreview | The LivePreview view is used to display the Live Preview interface. It is rendered within the "Live Preview" tab. |
| [key] | Any other key can be used to add a completely new Document View. |

### Document Root

The Document Root is mounted on the top-level route for a Document. Setting this property will completely take over the entire Document View layout, including the title, Document Tabs, and all other nested Document Views including the Edit View, API View, etc.

When setting a Document Root, you are responsible for rendering all necessary components and controls, as no document controls or tabs would be rendered. To replace only the Edit View precisely, use the edit.default key instead.

To override the Document Root, use the views.edit.root property in your Collection Config or Global Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  admin: {
    components: {
      views: {
        edit: {
          root: {
            Component: '/path/to/MyCustomRootComponent', 
          },
        },
      },
    },
  },
}
```

### Document Tabs

Each Document View can be given a tab for navigation, if desired. Tabs are highly configurable, from as simple as changing the label to swapping out the entire component, they can be modified in any way.

To add or customize tabs in the Document View, use the views.edit.[key].tab property in your Collection Config or Global Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  admin: {
    components: {
      views: {
        edit: {
          myCustomView: {
            Component: '/path/to/MyCustomView',
            path: '/my-custom-tab',
            tab: {
              Component: '/path/to/MyCustomTabComponent',
            },
          },
          anotherCustomView: {
            Component: '/path/to/AnotherCustomView',
            path: '/another-custom-view',
            tab: {
              label: 'Another Custom View',
              href: '/another-custom-view',
              order: '100',
            },
          },
        },
      },
    },
  },
}
```

**Note:** This applies to both Collections and Globals.

The following options are available for tabs:

| Property | Description |
|----------|-------------|
| label | The label to display in the tab. |
| href | The URL to navigate to when the tab is clicked. This is optional and defaults to the tab's path. |
| order | The order in which the tab appears in the navigation. Can be set on default and custom tabs. |
| Component | The component to render in the tab. This can be a Server or Client component. |

#### Tab Components

If changing the label or href is not enough, you can also replace the entire tab component with your own custom component. This can be done by setting the tab.Component property to the path of your custom component.

Here is an example of how to scaffold a custom Document Tab:

**Server Component**

```javascript
import React from 'react'
import type { DocumentTabServerProps } from 'payload'
import { Link } from '@payloadcms/ui'

export function MyCustomTabComponent(props: DocumentTabServerProps) {
  return (
    <Link href="/my-custom-tab">This is a custom Document Tab (Server)</Link>
  )
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import type { DocumentTabClientProps } from 'payload'
import { Link } from '@payloadcms/ui'

export function MyCustomTabComponent(props: DocumentTabClientProps) {
  return (
    <Link href="/my-custom-tab">This is a custom Document Tab (Client)</Link>
  )
}
```

## Edit View

The Edit View is where users interact with individual Collection and Global Documents within the Admin Panel. The Edit View contains the actual form in which submits the data to the server. This is where they can view, edit, and save their content. It contains controls for saving, publishing, and previewing the document, all of which can be customized to a high degree.

The Edit View can be swapped out in its entirety for a Custom View, or it can be injected with a number of Custom Components to add additional functionality or presentational elements without replacing the entire view.

**Note:** The Edit View is one of many Document Views in the Payload Admin Panel. Each Document View is responsible for a different aspect of the interacting with a single Document.

### Custom Edit View

To swap out the entire Edit View with a Custom View, use the views.edit.default property in your Collection Config or Global Config:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      views: {
        edit: {
          default: {
            Component: '/path/to/MyCustomEditViewComponent',
          },
        },
      },
    },
  },
})
```

Here is an example of a custom Edit View:

**Server Component**

```javascript
import React from 'react'
import type { DocumentViewServerProps } from 'payload'

export function MyCustomServerEditView(props: DocumentViewServerProps) {
  return <div>This is a custom Edit View (Server)</div>
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import type { DocumentViewClientProps } from 'payload'

export function MyCustomClientEditView(props: DocumentViewClientProps) {
  return <div>This is a custom Edit View (Client)</div>
}
```

### Custom Components

In addition to swapping out the entire Edit View with a Custom View, you can also override individual components. This allows you to customize specific parts of the Edit View without swapping out the entire view.

**Important:** Collection and Globals are keyed to a different property in the admin.components object have slightly different options. Be sure to use the correct key for the entity you are working with.

#### Collections

To override Edit View components for a Collection, use the admin.components.edit property in your Collection Config:

```javascript
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

| Path | Description |
|------|-------------|
| beforeDocumentControls | Inject custom components before the Save / Publish buttons. |
| editMenuItems | Inject custom components within the 3-dot menu dropdown located in the document control bar. |
| SaveButton | A button that saves the current document. |
| SaveDraftButton | A button that saves the current document as a draft. |
| PublishButton | A button that publishes the current document. |
| PreviewButton | A button that previews the current document. |
| Description | A description of the Collection. |
| Upload | A file upload component. |

#### Globals

To override Edit View components for Globals, use the admin.components.elements property in your Global Config:

```javascript
import type { GlobalConfig } from 'payload'

export const MyGlobal: GlobalConfig = {
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

| Path | Description |
|------|-------------|
| beforeDocumentControls | Inject custom components before the Save / Publish buttons. |
| editMenuItems | Inject custom components within the 3-dot menu dropdown located in the document control bar. |
| SaveButton | A button that saves the current document. |
| SaveDraftButton | A button that saves the current document as a draft. |
| PublishButton | A button that publishes the current document. |
| PreviewButton | A button that previews the current document. |
| Description | A description of the Global. |

#### SaveButton

The SaveButton property allows you to render a custom Save Button in the Edit View.

To add a SaveButton component, use the components.edit.SaveButton property in your Collection Config or components.elements.SaveButton in your Global Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      edit: {
        SaveButton: '/path/to/MySaveButton',
      },
    },
  },
}
```

Here's an example of a custom SaveButton component:

**Server Component**

```javascript
import React from 'react'
import { SaveButton } from '@payloadcms/ui'
import type { SaveButtonServerProps } from 'payload'

export function MySaveButton(props: SaveButtonServerProps) {
  return <SaveButton label="Save" />
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import { SaveButton } from '@payloadcms/ui'
import type { SaveButtonClientProps } from 'payload'

export function MySaveButton(props: SaveButtonClientProps) {
  return <SaveButton label="Save" />
}
```

#### beforeDocumentControls

The beforeDocumentControls property allows you to render custom components just before the default document action buttons (like Save, Publish, or Preview). This is useful for injecting custom buttons, status indicators, or any other UI elements before the built-in controls.

To add beforeDocumentControls components, use the components.edit.beforeDocumentControls property in you Collection Config or components.elements.beforeDocumentControls in your Global Config:

**Collections**

```javascript
export const MyCollection: CollectionConfig = {
  admin: {
    components: {
      edit: {
        beforeDocumentControls: ['/path/to/CustomComponent'],
      },
    },
  },
}
```

**Globals**

```javascript
export const MyGlobal: GlobalConfig = {
  admin: {
    components: {
      elements: {
        beforeDocumentControls: ['/path/to/CustomComponent'],
      },
    },
  },
}
```

Here's an example of a custom beforeDocumentControls component:

**Server Component**

```javascript
import React from 'react'
import type { BeforeDocumentControlsServerProps } from 'payload'

export function MyCustomDocumentControlButton(
  props: BeforeDocumentControlsServerProps,
) {
  return <div>This is a custom beforeDocumentControl button (Server)</div>
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import type { BeforeDocumentControlsClientProps } from 'payload'

export function MyCustomDocumentControlButton(
  props: BeforeDocumentControlsClientProps,
) {
  return <div>This is a custom beforeDocumentControl button (Client)</div>
}
```

#### editMenuItems

The editMenuItems property allows you to inject custom components into the 3-dot menu dropdown located in the document controls bar. This dropdown contains default options including Create New, Duplicate, Delete, and other options when additional features are enabled. Any custom components you add will appear below these default items.

To add editMenuItems, use the components.edit.editMenuItems property in your Collection Config:

**Config Example**

```javascript
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    components: {
      edit: {
        editMenuItems: ['/path/to/CustomEditMenuItem'],
      },
    },
  },
}
```

Here's an example of a custom editMenuItems component:

**Server Component**

```javascript
import React from 'react'
import { PopupList } from '@payloadcms/ui'

import type { EditMenuItemsServerProps } from 'payload'

export const EditMenuItems = async (props: EditMenuItemsServerProps) => {
  const href = `/custom-action?id=${props.id}`

  return (
    <PopupList.ButtonGroup>
      <PopupList.Button href={href}>Custom Edit Menu Item</PopupList.Button>
      <PopupList.Button href={href}>
        Another Custom Edit Menu Item - add as many as you need!
      </PopupList.Button>
    </PopupList.ButtonGroup>
  )
}
```

**Client Component**

```javascript
'use client'

import React from 'react'
import { PopupList } from '@payloadcms/ui'

import type { EditViewMenuItemClientProps } from 'payload'

export const EditMenuItems = (props: EditViewMenuItemClientProps) => {
  const handleClick = () => {
    console.log('Custom button clicked!')
  }

  return (
    <PopupList.ButtonGroup>
      <PopupList.Button onClick={handleClick}>
        Custom Edit Menu Item
      </PopupList.Button>
      <PopupList.Button onClick={handleClick}>
        Another Custom Edit Menu Item - add as many as you need!
      </PopupList.Button>
    </PopupList.ButtonGroup>
  )
}
```

**Styling:** Use Payload's built-in PopupList.Button to ensure your menu items automatically match the default dropdown styles. If you want a different look, you can customize the appearance by passing your own className to PopupList.Button, or use a completely custom button built with a standard HTML button element or any other component that fits your design preferences.

#### SaveDraftButton

The SaveDraftButton property allows you to render a custom Save Draft Button in the Edit View.

To add a SaveDraftButton component, use the components.edit.SaveDraftButton property in your Collection Config or components.elements.SaveDraftButton in your Global Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      edit: {
        SaveDraftButton: '/path/to/MySaveDraftButton',
      },
    },
  },
}
```

Here's an example of a custom SaveDraftButton component:

**Server Component**

```javascript
import React from 'react'
import { SaveDraftButton } from '@payloadcms/ui'
import type { SaveDraftButtonServerProps } from 'payload'

export function MySaveDraftButton(props: SaveDraftButtonServerProps) {
  return <SaveDraftButton />
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import { SaveDraftButton } from '@payloadcms/ui'
import type { SaveDraftButtonClientProps } from 'payload'

export function MySaveDraftButton(props: SaveDraftButtonClientProps) {
  return <SaveDraftButton />
}
```

#### PublishButton

The PublishButton property allows you to render a custom Publish Button in the Edit View.

To add a PublishButton component, use the components.edit.PublishButton property in your Collection Config or components.elements.PublishButton in your Global Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      edit: {
        PublishButton: '/path/to/MyPublishButton',
      },
    },
  },
}
```

Here's an example of a custom PublishButton component:

**Server Component**

```javascript
import React from 'react'
import { PublishButton } from '@payloadcms/ui'
import type { PublishButtonServerProps } from 'payload'

export function MyPublishButton(props: PublishButtonServerProps) {
  return <PublishButton label="Publish" />
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import { PublishButton } from '@payloadcms/ui'
import type { PublishButtonClientProps } from 'payload'

export function MyPublishButton(props: PublishButtonClientProps) {
  return <PublishButton label="Publish" />
}
```

#### PreviewButton

The PreviewButton property allows you to render a custom Preview Button in the Edit View.

To add a PreviewButton component, use the components.edit.PreviewButton property in your Collection Config or components.elements.PreviewButton in your Global Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      edit: {
        PreviewButton: '/path/to/MyPreviewButton',
      },
    },
  },
}
```

Here's an example of a custom PreviewButton component:

**Server Component**

```javascript
import React from 'react'
import { PreviewButton } from '@payloadcms/ui'
import type { PreviewButtonServerProps } from 'payload'

export function MyPreviewButton(props: PreviewButtonServerProps) {
  return <PreviewButton />
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import { PreviewButton } from '@payloadcms/ui'
import type { PreviewButtonClientProps } from 'payload'

export function MyPreviewButton(props: PreviewButtonClientProps) {
  return <PreviewButton />
}
```

#### Description

The Description property allows you to render a custom description of the Collection or Global in the Edit View.

To add a Description component, use the components.edit.Description property in your Collection Config or components.elements.Description in your Global Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      Description: '/path/to/MyDescriptionComponent',
    },
  },
}
```

**Note:** The Description component is shared between the Edit View and the List View.

Here's an example of a custom Description component:

**Server Component**

```javascript
import React from 'react'
import type { ViewDescriptionServerProps } from 'payload'

export function MyDescriptionComponent(props: ViewDescriptionServerProps) {
  return <div>This is a custom description component (Server)</div>
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import type { ViewDescriptionClientProps } from 'payload'

export function MyDescriptionComponent(props: ViewDescriptionClientProps) {
  return <div>This is a custom description component (Client)</div>
}
```

#### Upload

The Upload property allows you to render a custom file upload component in the Edit View.

To add an Upload component, use the components.edit.Upload property in your Collection Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      edit: {
        Upload: '/path/to/MyUploadComponent',
      },
    },
  },
}
```

**Note:** The Upload component is only available for Collections.

Here's an example of a custom Upload component:

```javascript
import React from 'react'

export function MyUploadComponent() {
  return <input type="file" />
}
```

## List View

The List View is where users interact with a list of Collection Documents within the Admin Panel. This is where they can view, sort, filter, and paginate their documents to find exactly what they're looking for. This is also where users can perform bulk operations on multiple documents at once, such as deleting, editing, or publishing many.

The List View can be swapped out in its entirety for a Custom View, or it can be injected with a number of Custom Components to add additional functionality or presentational elements without replacing the entire view.

**Note:** Only Collections have a List View. Globals do not have a List View as they are single documents.

### Custom List View

To swap out the entire List View with a Custom View, use the admin.components.views.list property in your Payload Config:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      views: {
        list: '/path/to/MyCustomListView',
      },
    },
  },
})
```

Here is an example of a custom List View:

**Server Component**

```javascript
import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'

export function MyCustomServerListView(props: ListViewServerProps) {
  return <div>This is a custom List View (Server)</div>
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import type { ListViewClientProps } from 'payload'

export function MyCustomClientListView(props: ListViewClientProps) {
  return <div>This is a custom List View (Client)</div>
}
```

### Custom Components

In addition to swapping out the entire List View with a Custom View, you can also override individual components. This allows you to customize specific parts of the List View without swapping out the entire view for your own.

To override List View components for a Collection, use the admin.components property in your Collection Config:

```javascript
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

| Path | Description |
|------|-------------|
| beforeList | An array of custom components to inject before the list of documents in the List View. |
| beforeListTable | An array of custom components to inject before the table of documents in the List View. |
| afterList | An array of custom components to inject after the list of documents in the List View. |
| afterListTable | An array of custom components to inject after the table of documents in the List View. |
| listMenuItems | An array of components to render within a menu next to the List Controls (after the Columns and Filters options) |
| Description | A component to render a description of the Collection. |

#### beforeList

The beforeList property allows you to inject custom components before the list of documents in the List View.

To add beforeList components, use the components.beforeList property in your Collection Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      beforeList: ['/path/to/MyBeforeListComponent'],
    },
  },
}
```

Here's an example of a custom beforeList component:

**Server Component**

```javascript
import React from 'react'
import type { BeforeListServerProps } from 'payload'

export function MyBeforeListComponent(props: BeforeListServerProps) {
  return <div>This is a custom beforeList component (Server)</div>
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import type { BeforeListClientProps } from 'payload'

export function MyBeforeListComponent(props: BeforeListClientProps) {
  return <div>This is a custom beforeList component (Client)</div>
}
```

#### beforeListTable

The beforeListTable property allows you to inject custom components before the table of documents in the List View.

To add beforeListTable components, use the components.beforeListTable property in your Collection Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      beforeListTable: ['/path/to/MyBeforeListTableComponent'],
    },
  },
}
```

Here's an example of a custom beforeListTable component:

**Server Component**

```javascript
import React from 'react'
import type { BeforeListTableServerProps } from 'payload'

export function MyBeforeListTableComponent(props: BeforeListTableServerProps) {
  return <div>This is a custom beforeListTable component (Server)</div>
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import type { BeforeListTableClientProps } from 'payload'

export function MyBeforeListTableComponent(props: BeforeListTableClientProps) {
  return <div>This is a custom beforeListTable component (Client)</div>
}
```

#### afterList

The afterList property allows you to inject custom components after the list of documents in the List View.

To add afterList components, use the components.afterList property in your Collection Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      afterList: ['/path/to/MyAfterListComponent'],
    },
  },
}
```

Here's an example of a custom afterList component:

**Server Component**

```javascript
import React from 'react'
import type { AfterListServerProps } from 'payload'

export function MyAfterListComponent(props: AfterListServerProps) {
  return <div>This is a custom afterList component (Server)</div>
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import type { AfterListClientProps } from 'payload'

export function MyAfterListComponent(props: AfterListClientProps) {
  return <div>This is a custom afterList component (Client)</div>
}
```

#### afterListTable

The afterListTable property allows you to inject custom components after the table of documents in the List View.

To add afterListTable components, use the components.afterListTable property in your Collection Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      afterListTable: ['/path/to/MyAfterListTableComponent'],
    },
  },
}
```

Here's an example of a custom afterListTable component:

**Server Component**

```javascript
import React from 'react'
import type { AfterListTableServerProps } from 'payload'

export function MyAfterListTableComponent(props: AfterListTableServerProps) {
  return <div>This is a custom afterListTable component (Server)</div>
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import type { AfterListTableClientProps } from 'payload'

export function MyAfterListTableComponent(props: AfterListTableClientProps) {
  return <div>This is a custom afterListTable component (Client)</div>
}
```

#### Description

The Description property allows you to render a custom description of the Collection in the List View.

To add a Description component, use the components.Description property in your Collection Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      Description: '/path/to/MyDescriptionComponent',
    },
  },
}
```

**Note:** The Description component is shared between the List View and the Edit View.

Here's an example of a custom Description component:

**Server Component**

```javascript
import React from 'react'
import type { ViewDescriptionServerProps } from 'payload'

export function MyDescriptionComponent(props: ViewDescriptionServerProps) {
  return <div>This is a custom Collection description component (Server)</div>
}
```

**Client Component**

```javascript
'use client'
import React from 'react'
import type { ViewDescriptionClientProps } from 'payload'

export function MyDescriptionComponent(props: ViewDescriptionClientProps) {
  return <div>This is a custom Collection description component (Client)</div>
}
```

## Custom Providers

As you add more and more Custom Components to your Admin Panel, you may find it helpful to add additional React Context(s) to your app. Payload allows you to inject your own context providers where you can export your own custom hooks, etc.

To add a Custom Provider, use the admin.components.providers property in your Payload Config:

```javascript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      providers: ['/path/to/MyProvider'], 
    },
  },
})
```

Then build your Custom Provider as follows:

```javascript
'use client'
import React, { createContext, use } from 'react'

const MyCustomContext = React.createContext(myCustomValue)

export function MyProvider({ children }: { children: React.ReactNode }) {
  return <MyCustomContext value={myCustomValue}>{children}</MyCustomContext>
}

export const useMyCustomContext = () => use(MyCustomContext)
```

**Reminder:** React Context exists only within Client Components. This means they must include the use client directive at the top of their files and cannot contain server-only code. To use a Server Component here, simply wrap your Client Component with it.

## Performance

An often overlooked aspect of Custom Components is performance. If unchecked, Custom Components can lead to slow load times of the Admin Panel and ultimately a poor user experience.

This is different from front-end performance of your public-facing site.

### Follow React and Next.js best practices

All Custom Components are built using React. For this reason, it is important to follow React best practices. This includes using memoization, streaming, caching, optimizing renders, using hooks appropriately, and more.

To learn more, see the React documentation.

The Admin Panel itself is a Next.js application. For this reason, it is also important to follow Next.js best practices. This includes bundling, when to use layouts vs pages, where to place the server/client boundary, and more.

To learn more, see the Next.js documentation.

### Reducing initial HTML size

With Server Components, be aware of what is being sent to through the server/client boundary. All props are serialized and sent through the network. This can lead to large HTML sizes and slow initial load times if too much data is being sent to the client.

To minimize this, you must be explicit about what props are sent to the client. Prefer server components and only send the necessary props to the client. This will also offset some of the JS execution to the server.

**Tip:** Use React Suspense to progressively load components and improve perceived performance.

### Prevent unnecessary re-renders

If subscribing your component to form state, it may be re-rendering more often than necessary.

To do this, use the useFormFields hook instead of useFields when you only need to access specific fields.

```javascript
'use client'
import { useFormFields } from '@payloadcms/ui'

const MyComponent: TextFieldClientComponent = ({ path }) => {
  const value = useFormFields(([fields, dispatch]) => fields[path])
  // ...
}
```