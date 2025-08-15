# Payload CMS Lexical Rich Text Editor - Complete Documentation

## Table of Contents

1. [Overview and Getting Started](#overview-and-getting-started)
2. [Official Features](#official-features)
3. [Custom Features](#custom-features)
4. [Converters](#converters)
   - [Editor Config Factory](#editor-config-factory)
   - [Converting to HTML](#converting-to-html)
   - [Converting to JSX](#converting-to-jsx)
   - [Converting to Markdown](#converting-to-markdown)
   - [Converting to Plaintext](#converting-to-plaintext)
5. [TypeScript](#typescript)
6. [Admin Customization](#admin-customization)

---

## Overview and Getting Started

This documentation is about our new editor, based on Lexical (Meta's rich text editor). The previous default editor was based on Slate and is still supported. You can read its documentation, or the optional migration guide to migrate from Slate to Lexical (recommended).

The editor is the most important property of the rich text field.

As a key part of Payload, we are proud to offer you the best editing experience you can imagine. With healthy defaults out of the box, but also with the flexibility to customize every detail: from the "/"​ menu and toolbars (whether inline or fixed) to inserting any component or subfield you can imagine.

### Installation

To use the rich text editor, first you need to install it:

```bash
pnpm install @payloadcms/richtext-lexical
```

### Basic Setup

Once you have it installed, you can pass it to your top-level Payload Config as follows:

```javascript
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  collections: [
    // your collections here
  ],
  // Pass the Lexical editor to the root config
  editor: lexicalEditor({}),
})
```

You can also override Lexical settings on a field-by-field basis as follows:

```javascript
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'content',
      type: 'richText',
      // Pass the Lexical editor here and override base settings as necessary
      editor: lexicalEditor({}),
    },
  ],
}
```

### Extending the lexical editor with Features

Lexical has been designed with extensibility in mind. Whether you're aiming to introduce new functionalities or tweak the existing ones, Lexical makes it seamless for you to bring those changes to life.

#### Features: The Building Blocks

At the heart of Lexical's customization potential are "features". While Lexical ships with a set of default features we believe are essential for most use cases, the true power lies in your ability to redefine, expand, or prune these as needed.

If you remove all the default features, you're left with a blank editor. You can then add in only the features you need, or you can build your own custom features from scratch.

#### Integrating New Features

To weave in your custom features, utilize the features prop when initializing the Lexical Editor. Here's a basic example of how this is done:

```javascript
import {
  BlocksFeature,
  LinkFeature,
  UploadFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Banner } from '../blocks/Banner'
import { CallToAction } from '../blocks/CallToAction'

{
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      ...defaultFeatures,
      LinkFeature({
        // Example showing how to customize the built-in fields
        // of the Link feature
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'rel',
            label: 'Rel Attribute',
            type: 'select',
            hasMany: true,
            options: ['noopener', 'noreferrer', 'nofollow'],
            admin: {
              description:
                'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
            },
          },
        ],
      }),
      UploadFeature({
        collections: {
          uploads: {
            // Example showing how to customize the built-in fields
            // of the Upload feature
            fields: [
              {
                name: 'caption',
                type: 'richText',
                editor: lexicalEditor(),
              },
            ],
          },
        },
      }),
      // This is incredibly powerful. You can re-use your Payload blocks
      // directly in the Lexical editor as follows:
      BlocksFeature({
        blocks: [Banner, CallToAction],
      }),
    ],
  })
}
```

features can be both an array of features, or a function returning an array of features. The function provides the following props:

| Prop | Description |
|------|-------------|
| defaultFeatures | This opinionated array contains all "recommended" default features. You can see which features are included in the default features in the table below. |
| rootFeatures | This array contains all features that are enabled in the root richText editor (the one defined in the payload.config.ts). If this field is the root richText editor, or if the root richText editor is not a lexical editor, this array will be empty. |

### Detecting empty editor state

When you first type into a rich text field and subsequently delete everything through the admin panel, its value changes from null to a JSON object containing an empty paragraph.

If needed, you can reset the field value to null programmatically - for example, by using a custom hook to detect when the editor is empty.

This also applies to fields like text and textArea, which could be stored as either null or an empty value in the database. Since the empty value for richText is a JSON object, checking for emptiness is a bit more involved - so Payload provides a utility for it:

```javascript
import { hasText } from '@payloadcms/richtext-lexical/shared'

hasText(richtextData)
```

---

## Official Features

Below are all the Rich Text Features Payload offers. Everything is customizable; you can create your own features, modify ours and share them with the community.

### Features Overview

| Feature Name | Included by default | Description |
|--------------|-------------------|-------------|
| BoldFeature | Yes | Adds support for bold text formatting. |
| ItalicFeature | Yes | Adds support for italic text formatting. |
| UnderlineFeature | Yes | Adds support for underlined text formatting. |
| StrikethroughFeature | Yes | Adds support for strikethrough text formatting. |
| SubscriptFeature | Yes | Adds support for subscript text formatting. |
| SuperscriptFeature | Yes | Adds support for superscript text formatting. |
| InlineCodeFeature | Yes | Adds support for inline code formatting. |
| ParagraphFeature | Yes | Provides entries in both the slash menu and toolbar dropdown for explicit paragraph creation or conversion. |
| HeadingFeature | Yes | Adds Heading Nodes (by default, H1 - H6, but that can be customized) |
| AlignFeature | Yes | Adds support for text alignment (left, center, right, justify) |
| IndentFeature | Yes | Adds support for text indentation with toolbar buttons |
| UnorderedListFeature | Yes | Adds support for unordered lists (ul) |
| OrderedListFeature | Yes | Adds support for ordered lists (ol) |
| ChecklistFeature | Yes | Adds support for interactive checklists |
| LinkFeature | Yes | Allows you to create internal and external links |
| RelationshipFeature | Yes | Allows you to create block-level (not inline) relationships to other documents |
| BlockquoteFeature | Yes | Allows you to create block-level quotes |
| UploadFeature | Yes | Allows you to create block-level upload nodes - this supports all kinds of uploads, not just images |
| HorizontalRuleFeature | Yes | Adds support for horizontal rules / separators. Basically displays an <hr> element |
| InlineToolbarFeature | Yes | Provides a floating toolbar which appears when you select text. This toolbar only contains actions relevant for selected text |
| FixedToolbarFeature | No | Provides a persistent toolbar pinned to the top and always visible. Both inline and fixed toolbars can be enabled at the same time. |
| BlocksFeature | No | Allows you to use Payload's Blocks Field directly inside your editor. In the feature props, you can specify the allowed blocks - just like in the Blocks field. |
| TreeViewFeature | No | Provides a debug box under the editor, which allows you to see the current editor state live, the dom, as well as time travel. Very useful for debugging |
| EXPERIMENTAL_TableFeature | No | Adds support for tables. This feature may be removed or receive breaking changes in the future - even within a stable lexical release, without needing a major release. |
| TextStateFeature | No | Allows you to store key-value attributes within TextNodes and assign them inline styles. |

### In depth

#### BoldFeature
- **Description**: Adds support for bold text formatting, along with buttons to apply it in both fixed and inline toolbars.
- **Included by default**: Yes
- **Markdown Support**: `**bold**` or `__bold__`
- **Keyboard Shortcut**: Ctrl/Cmd + B

#### ItalicFeature
- **Description**: Adds support for italic text formatting, along with buttons to apply it in both fixed and inline toolbars.
- **Included by default**: Yes
- **Markdown Support**: `*italic*` or `_italic_`
- **Keyboard Shortcut**: Ctrl/Cmd + I

#### UnderlineFeature
- **Description**: Adds support for underlined text formatting, along with buttons to apply it in both fixed and inline toolbars.
- **Included by default**: Yes
- **Keyboard Shortcut**: Ctrl/Cmd + U

#### StrikethroughFeature
- **Description**: Adds support for strikethrough text formatting, along with buttons to apply it in both fixed and inline toolbars.
- **Included by default**: Yes
- **Markdown Support**: `~~strikethrough~~`

#### SubscriptFeature
- **Description**: Adds support for subscript text formatting, along with buttons to apply it in both fixed and inline toolbars.
- **Included by default**: Yes

#### SuperscriptFeature
- **Description**: Adds support for superscript text formatting, along with buttons to apply it in both fixed and inline toolbars.
- **Included by default**: Yes

#### InlineCodeFeature
- **Description**: Adds support for inline code formatting with distinct styling, along with buttons to apply it in both fixed and inline toolbars.
- **Included by default**: Yes
- **Markdown Support**: `` `code` ``

#### ParagraphFeature
- **Description**: Provides entries in both the slash menu and toolbar dropdown for explicit paragraph creation or conversion.
- **Included by default**: Yes

#### HeadingFeature
- **Description**: Adds support for heading nodes (H1-H6) with toolbar dropdown and slash menu entries for each enabled heading size.
- **Included by default**: Yes
- **Markdown Support**: `#`, `##`, `###`, ..., at start of line.

**Types:**
```typescript
type HeadingFeatureProps = {
  enabledHeadingSizes?: HeadingTagType[] // ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
}
```

**Usage example:**
```javascript
HeadingFeature({
  enabledHeadingSizes: ['h1', 'h2', 'h3'], // Default: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
})
```

#### AlignFeature
- **Description**: Allows text alignment (left, center, right, justify), along with buttons to apply it in both fixed and inline toolbars.
- **Included by default**: Yes
- **Keyboard Shortcut**: Ctrl/Cmd + Shift + L/E/R/J (left/center/right/justify)

#### IndentFeature
- **Description**: Adds support for text indentation, along with buttons to apply it in both fixed and inline toolbars.
- **Included by default**: Yes
- **Keyboard Shortcut**: Tab (increase), Shift + Tab (decrease)

**Types:**
```typescript
type IndentFeatureProps = {
  /**
   * The nodes that should not be indented. "type"
   * property of the nodes you don't want to be indented.
   * These can be: "paragraph", "heading", "listitem",
   * "quote" or other indentable nodes if they exist.
   */
  disabledNodes?: string[]
  /**
   * If true, pressing Tab in the middle of a block such
   * as a paragraph or heading will not insert a tabNode.
   * Instead, Tab will only be used for block-level indentation.
   * @default false
   */
  disableTabNode?: boolean
}
```

**Usage example:**
```javascript
// Allow block-level indentation only
IndentFeature({
  disableTabNode: true,
})
```

#### UnorderedListFeature
- **Description**: Adds support for unordered lists (bullet points) with toolbar dropdown and slash menu entries.
- **Included by default**: Yes
- **Markdown Support**: `-`, `*`, or `+` at start of line

#### OrderedListFeature
- **Description**: Adds support for ordered lists (numbered lists) with toolbar dropdown and slash menu entries.
- **Included by default**: Yes
- **Markdown Support**: `1.` at start of line

#### ChecklistFeature
- **Description**: Adds support for interactive checklists with toolbar dropdown and slash menu entries.
- **Included by default**: Yes
- **Markdown Support**: `- [ ]` (unchecked) or `- [x]` (checked)

#### LinkFeature
- **Description**: Allows creation of internal and external links with toolbar buttons and automatic URL conversion.
- **Included by default**: Yes
- **Markdown Support**: `[anchor](url)`

**Types:**
```typescript
type LinkFeatureServerProps = {
  /**
   * Disables the automatic creation of links
   * from URLs typed or pasted into the editor,
   * @default false
   */
  disableAutoLinks?: 'creationOnly' | true
  /**
   * A function or array defining additional
   * fields for the link feature.
   * These will be displayed in the link editor drawer.
   */
  fields?:
    | ((args: {
        config: SanitizedConfig
        defaultFields: FieldAffectingData[]
      }) => (Field | FieldAffectingData)[])
    | Field[]
  /**
   * Sets a maximum population depth for the internal
   * doc default field of link, regardless of the
   * remaining depth when the field is reached.
   */
  maxDepth?: number
} & ExclusiveLinkCollectionsProps

type ExclusiveLinkCollectionsProps =
  | {
      disabledCollections?: CollectionSlug[]
      enabledCollections?: never
    }
  | {
      disabledCollections?: never
      enabledCollections?: CollectionSlug[]
    }
```

**Usage example:**
```javascript
LinkFeature({
  fields: ({ defaultFields }) => [
    ...defaultFields,
    {
      name: 'rel',
      type: 'select',
      options: ['noopener', 'noreferrer', 'nofollow'],
    },
  ],
  enabledCollections: ['pages', 'posts'], // Collections for internal links
  maxDepth: 2, // Population depth for internal links
  disableAutoLinks: false, // Allow auto-conversion of URLs
})
```

#### RelationshipFeature
- **Description**: Allows creation of block-level relationships to other documents with toolbar button and slash menu entry.
- **Included by default**: Yes

**Types:**
```typescript
type RelationshipFeatureProps = {
  /**
   * Sets a maximum population depth for this relationship,
   * regardless of the remaining depth when the respective
   * field is reached.
   */
  maxDepth?: number
} & ExclusiveRelationshipFeatureProps

type ExclusiveRelationshipFeatureProps =
  | {
      disabledCollections?: CollectionSlug[]
      enabledCollections?: never
    }
  | {
      disabledCollections?: never
      enabledCollections?: CollectionSlug[]
    }
```

**Usage example:**
```javascript
RelationshipFeature({
  disabledCollections: ['users'], // Collections to exclude
  maxDepth: 2, // Population depth for relationships
})
```

#### UploadFeature
- **Description**: Allows creation of upload/media nodes with toolbar button and slash menu entry, supports all file types.
- **Included by default**: Yes

**Types:**
```typescript
type UploadFeatureProps = {
  collections?: {
    [collection: CollectionSlug]: {
      fields: Field[]
    }
  }
  /**
   * Sets a maximum population depth for this upload
   * (not the fields for this upload), regardless of
   * the remaining depth when the respective field is
   * reached.
   */
  maxDepth?: number
}
```

**Usage example:**
```javascript
UploadFeature({
  collections: {
    uploads: {
      fields: [
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
        },
      ],
    },
  },
  maxDepth: 1, // Population depth for uploads
})
```

#### BlockquoteFeature
- **Description**: Allows creation of blockquotes with toolbar button and slash menu entry.
- **Included by default**: Yes
- **Markdown Support**: `> quote text`

#### HorizontalRuleFeature
- **Description**: Adds support for horizontal rules/separators with toolbar button and slash menu entry.
- **Included by default**: Yes
- **Markdown Support**: `---`

#### InlineToolbarFeature
- **Description**: Provides a floating toolbar that appears when text is selected, containing formatting options relevant to selected text.
- **Included by default**: Yes

#### FixedToolbarFeature
- **Description**: Provides a persistent toolbar pinned to the top of the editor that's always visible.
- **Included by default**: No

**Types:**
```typescript
type FixedToolbarFeatureProps = {
  /**
   * @default false
   * If this is enabled, the toolbar will apply
   * to the focused editor, not the editor with
   * the FixedToolbarFeature.
   */
  applyToFocusedEditor?: boolean
  /**
   * Custom configurations for toolbar groups
   * Key is the group key (e.g. 'format', 'indent', 'align')
   * Value is a partial ToolbarGroup object that will
   * be merged with the default configuration
   */
  customGroups?: CustomGroups
  /**
   * @default false
   * If there is a parent editor with a fixed toolbar,
   * this will disable the toolbar for this editor.
   */
  disableIfParentHasFixedToolbar?: boolean
}
```

**Usage example:**
```javascript
FixedToolbarFeature({
  applyToFocusedEditor: false, // Apply to focused editor
  customGroups: {
    format: {
      // Custom configuration for format group
    },
  },
})
```

#### BlocksFeature
- **Description**: Allows use of Payload's Blocks Field directly in the editor with toolbar buttons and slash menu entries for each block type.
- **Included by default**: No

**Types:**
```typescript
type BlocksFeatureProps = {
  blocks?: (Block | BlockSlug)[] | Block[]
  inlineBlocks?: (Block | BlockSlug)[] | Block[]
}
```

**Usage example:**
```javascript
BlocksFeature({
  blocks: [
    {
      slug: 'callout',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  inlineBlocks: [
    {
      slug: 'mention',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
})
```

#### TreeViewFeature
- **Description**: Provides a debug panel below the editor showing the editor's internal state, DOM tree, and time travel debugging.
- **Included by default**: No

#### EXPERIMENTAL_TableFeature
- **Description**: Adds support for tables with toolbar button and slash menu entry for creation and editing.
- **Included by default**: No

#### TextStateFeature
- **Description**: Allows storing key-value attributes in text nodes with inline styles and toolbar dropdown for style selection.
- **Included by default**: No

**Types:**
```typescript
type TextStateFeatureProps = {
  /**
   * The keys of the top-level object (stateKeys) represent the attributes that the textNode can have (e.g., color).
   * The values of the top-level object (stateValues) represent the values that the attribute can have (e.g., red, blue, etc.).
   * Within the stateValue, you can define inline styles and labels.
   */
  state: { [stateKey: string]: StateValues }
}

type StateValues = {
  [stateValue: string]: {
    css: StyleObject
    label: string
  }
}

type StyleObject = {
  [K in keyof PropertiesHyphenFallback]?:
    | Extract<PropertiesHyphenFallback[K], string>
    | undefined
}
```

**Usage example:**
```javascript
// We offer default colors that have good contrast and look good in dark and light mode.
import { defaultColors, TextStateFeature } from '@payloadcms/richtext-lexical'

TextStateFeature({
  // prettier-ignore
  state: {
    color: {
      ...defaultColors,
      // fancy gradients!
      galaxy: { label: 'Galaxy', css: { background: 'linear-gradient(to right, #0000ff, #ff0000)', color: 'white' } },
      sunset: { label: 'Sunset', css: { background: 'linear-gradient(to top, #ff5f6d, #6a3093)' } },
    },
    // You can have both colored and underlined text at the same time.
    // If you don't want that, you should group them within the same key.
    // (just like I did with defaultColors and my fancy gradients)
    underline: {
      'solid': { label: 'Solid', css: { 'text-decoration': 'underline', 'text-underline-offset': '4px' } },
       // You'll probably want to use the CSS light-dark() utility.
      'yellow-dashed': { label: 'Yellow Dashed', css: { 'text-decoration': 'underline dashed', 'text-decoration-color': 'light-dark(#EAB308,yellow)', 'text-underline-offset': '4px' } },
    },
  },
}),
```

---

## Custom Features

Before you begin building custom features for Lexical, it is crucial to familiarize yourself with the Lexical docs, particularly the "Concepts" section. This foundation is necessary for understanding Lexical's core principles, such as nodes, editor state, and commands.

Lexical features are designed to be modular, meaning each piece of functionality is encapsulated within just two specific interfaces: one for server-side code and one for client-side code.

By convention, these are named `feature.server.ts` for server-side functionality and `feature.client.ts` for client-side functionality. The primary functionality is housed within `feature.server.ts`, which users will import into their projects. The client-side feature, although defined separately, is integrated and rendered server-side through the server feature.

That way, we still maintain a clear boundary between server and client code, while also centralizing the code needed for a feature as a whole, such as toolbar entries, buttons, or new nodes, allowing each feature to be neatly contained and managed independently.

**Important**: Do not import directly from core lexical packages - this may break in minor Payload version bumps.

Instead, import the re-exported versions from `@payloadcms/richtext-lexical`. For example, change `import { $insertNodeToNearestRoot } from '@lexical/utils'` to `import { $insertNodeToNearestRoot } from '@payloadcms/richtext-lexical/lexical/utils'`

### Do I need a custom feature?

Before you start building a custom feature, consider whether you can achieve your desired functionality using the existing BlocksFeature. The BlocksFeature is a powerful feature that allows you to create custom blocks with a variety of options, including custom React components, markdown converters, and more. If you can achieve your desired functionality using the BlocksFeature, it is recommended to use it instead of building a custom feature.

Using the BlocksFeature, you can add both inline blocks (= can be inserted into a paragraph, in between text) and block blocks (= take up the whole line) to the editor. If you simply want to bring custom react components into the editor, this is the way to go.

### Example: Code Field Block with language picker

This example demonstrates how to create a custom code field block with a language picker using the BlocksFeature. First, make sure to explicitly install `@payloadcms/ui` in your project.

**Field Config:**

```javascript
import {
  BlocksFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const languages = {
  ts: 'TypeScript',
  plaintext: 'Plain Text',
  tsx: 'TSX',
  js: 'JavaScript',
  jsx: 'JSX',
}

// ...
{
  name: 'richText',
  type: 'richText',
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [
          {
            slug: 'Code',
            fields: [
              {
                type: 'select',
                name: 'language',
                options: Object.entries(languages).map(([key, value]) => ({
                  label: value,
                  value: key,
                })),
                defaultValue: 'ts',
              },
              {
                admin: {
                  components: {
                    Field: './path/to/CodeComponent#Code',
                  },
                },
                name: 'code',
                type: 'code',
              },
            ],
          }
        ],
        inlineBlocks: [],
      }),
    ],
  }),
},
```

**CodeComponent.tsx:**

```javascript
'use client'
import type { CodeFieldClient, CodeFieldClientProps } from 'payload'

import { CodeField, useFormFields } from '@payloadcms/ui'
import React, { useMemo } from 'react'

import { languages } from './yourFieldConfig'

const languageKeyToMonacoLanguageMap = {
  plaintext: 'plaintext',
  ts: 'typescript',
  tsx: 'typescript',
}

type Language = keyof typeof languageKeyToMonacoLanguageMap

export const Code: React.FC<CodeFieldClientProps> = ({
  autoComplete,
  field,
  forceRender,
  path,
  permissions,
  readOnly,
  renderedBlocks,
  schemaPath,
  validate,
}) => {
  const languageField = useFormFields(([fields]) => fields['language'])

  const language: Language =
    (languageField?.value as Language) ||
    (languageField?.initialValue as Language) ||
    'ts'

  const label = languages[language]

  const props: CodeFieldClient = useMemo<CodeFieldClient>(
    () => ({
      ...field,
      type: 'code',
      admin: {
        ...field.admin,
        editorOptions: undefined,
        language: languageKeyToMonacoLanguageMap[language] || language,
      },
      label,
    }),
    [field, language, label],
  )

  const key = `${field.name}-${language}-${label}`

  return (
    <CodeField
      autoComplete={autoComplete}
      field={props}
      forceRender={forceRender}
      key={key}
      path={path}
      permissions={permissions}
      readOnly={readOnly}
      renderedBlocks={renderedBlocks}
      schemaPath={schemaPath}
      validate={validate}
    />
  )
}
```

### Server Feature

Custom Blocks are not enough? To start building a custom feature, you should start with the server feature, which is the entry-point.

Example `myFeature/feature.server.ts`:

```javascript
import { createServerFeature } from '@payloadcms/richtext-lexical'

export const MyFeature = createServerFeature({
  feature: {},
  key: 'myFeature',
})
```

`createServerFeature` is a helper function which lets you create new features without boilerplate code.

Now, the feature is ready to be used in the editor:

```javascript
import { MyFeature } from './myFeature/feature.server';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

//...
 {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: [
        MyFeature(),
      ],
    }),
 },
```

By default, this server feature does nothing - you haven't added any functionality yet. Depending on what you want your feature to do, the ServerFeature type exposes various properties you can set to inject custom functionality into the lexical editor.

#### i18n

Each feature can register their own translations, which are automatically scoped to the feature key:

```javascript
import { createServerFeature } from '@payloadcms/richtext-lexical'

export const MyFeature = createServerFeature({
  feature: {
    i18n: {
      en: {
        label: 'My Feature',
      },
      de: {
        label: 'Mein Feature',
      },
    },
  },
  key: 'myFeature',
})
```

This allows you to add i18n translations scoped to your feature. This specific example translation will be available under lexical:myFeature:label - myFeature being your feature key.

#### Markdown Transformers

The Server Feature, just like the Client Feature, allows you to add markdown transformers. Markdown transformers on the server are used when converting the editor from or to markdown.

```javascript
import { createServerFeature } from '@payloadcms/richtext-lexical'
import type { ElementTransformer } from '@payloadcms/richtext-lexical/lexical/markdown'
import { $createMyNode, $isMyNode, MyNode } from './nodes/MyNode'

const MyMarkdownTransformer: ElementTransformer = {
  type: 'element',
  dependencies: [MyNode],
  export: (node, exportChildren) => {
    if (!$isMyNode(node)) {
      return null
    }
    return '+++'
  },
  // match ---
  regExp: /^+++\s*$/,
  replace: (parentNode) => {
    const node = $createMyNode()
    if (node) {
      parentNode.replace(node)
    }
  },
}

export const MyFeature = createServerFeature({
  feature: {
    markdownTransformers: [MyMarkdownTransformer],
  },
  key: 'myFeature',
})
```

In this example, the node will be outputted as +++ in Markdown, and the markdown +++ will be converted to a MyNode node in the editor.

#### Nodes

While nodes added to the server feature do not control how the node is rendered in the editor, they control other aspects of the node:

- HTML conversion
- Node Hooks
- Sub fields
- Behavior in a headless editor

The createNode helper function is used to create nodes with proper typing. It is recommended to use this function to create nodes.

```javascript
import { createServerFeature, createNode } from '@payloadcms/richtext-lexical'
import { MyNode } from './nodes/MyNode'

export const MyFeature = createServerFeature({
  feature: {
    nodes: [
      // Use the createNode helper function to more easily create nodes with proper typing
      createNode({
        converters: {
          html: {
            converter: () => {
              return `<hr/>`
            },
            nodeTypes: [MyNode.getType()],
          },
        },
        // Here you can add your actual node. On the server, they will be
        // used to initialize a headless editor which can be used to perform
        // operations on the editor, like markdown / html conversion.
        node: MyNode,
      }),
    ],
  },
  key: 'myFeature',
})
```

While nodes in the client feature are added by themselves to the nodes array, nodes in the server feature can be added together with the following sibling options:

| Option | Description |
|--------|-------------|
| getSubFields | If a node includes sub-fields (e.g. block and link nodes), passing the subFields schema here will make Payload automatically populate & run hooks for them. |
| getSubFieldsData | If a node includes sub-fields, the sub-fields data needs to be returned here, alongside getSubFields which returns their schema. |
| graphQLPopulationPromises | Allows you to run population logic when a node's data was requested from GraphQL. While getSubFields and getSubFieldsData automatically handle populating sub-fields (since they run hooks on them), those are only populated in the Rest API. This is because the Rest API hooks do not have access to the 'depth' property provided by GraphQL. In order for them to be populated correctly in GraphQL, the population logic needs to be provided here. |
| node | The actual lexical node needs to be provided here. This also supports lexical node replacements. |
| validations | This allows you to provide node validations, which are run when your document is being validated, alongside other Payload fields. You can use it to throw a validation error for a specific node in case its data is incorrect. |
| converters | Allows you to define how a node can be serialized into different formats. Currently, only supports HTML. Markdown converters are defined in markdownTransformers and not here. |
| hooks | Just like Payload fields, you can provide hooks which are run for this specific node. These are called Node Hooks. |

#### Feature load order

Server features can also accept a function as the feature property (useful for sanitizing props, as mentioned below). This function will be called when the feature is loaded during the Payload sanitization process:

```javascript
import { createServerFeature } from '@payloadcms/richtext-lexical'

createServerFeature({
  //...
  feature: async ({
    config,
    isRoot,
    props,
    resolvedFeatures,
    unSanitizedEditorConfig,
    featureProviderMap,
  }) => {
    return {
      //Actual server feature here...
    }
  },
})
```

"Loading" here means the process of calling this feature function. By default, features are called in the order in which they are added to the editor. However, sometimes you might want to load a feature after another feature has been loaded, or require a different feature to be loaded, throwing an error if this is not the case.

Within lexical, one example where this is done are our list features. Both UnorderedListFeature and OrderedListFeature register the same ListItem node. Within UnorderedListFeature we register it normally, but within OrderedListFeature we want to only register the ListItem node if the UnorderedListFeature is not present - otherwise, we would have two features registering the same node.

Here is how we do it:

```javascript
import { createServerFeature, createNode } from '@payloadcms/richtext-lexical'

export const OrderedListFeature = createServerFeature({
  feature: ({ featureProviderMap }) => {
    return {
      // ...
      nodes: featureProviderMap.has('unorderedList')
        ? []
        : [
            createNode({
              // ...
            }),
          ],
    }
  },
  key: 'orderedList',
})
```

`featureProviderMap` will always be available and contain all the features, even yet-to-be-loaded ones, so we can check if a feature is loaded by checking if its key present in the map.

If you wanted to make sure a feature is loaded before another feature, you can use the `dependenciesPriority` property:

```javascript
import { createServerFeature } from '@payloadcms/richtext-lexical'

export const MyFeature = createServerFeature({
  feature: ({ featureProviderMap }) => {
    return {
      // ...
    }
  },
  key: 'myFeature',
  dependenciesPriority: ['otherFeature'],
})
```

| Option | Description |
|--------|-------------|
| dependenciesSoft | Keys of soft-dependencies needed for this feature. These are optional. Payload will attempt to load them before this feature, but doesn't throw an error if that's not possible. |
| dependencies | Keys of dependencies needed for this feature. These dependencies do not have to be loaded first, but they have to exist, otherwise an error will be thrown. |
| dependenciesPriority | Keys of priority dependencies needed for this feature. These dependencies have to be loaded first AND have to exist, otherwise an error will be thrown. They will be available in the feature property. |

### Client Feature

Most of the functionality which the user actually sees and interacts with, like toolbar items and React components for nodes, resides on the client-side.

To set up your client-side feature, follow these three steps:

1. **Create a Separate File**: Start by creating a new file specifically for your client feature, such as `myFeature/feature.client.ts`. It's important to keep client and server features in separate files to maintain a clean boundary between server and client code.
2. **'use client'**: Mark that file with a 'use client' directive at the top of the file
3. **Register the Client Feature**: Register the client feature within your server feature, by passing it to the ClientFeature prop. This is needed because the server feature is the sole entry-point of your feature. This also means you are not able to create a client feature without a server feature, as you will not be able to register it otherwise.

Example `myFeature/feature.client.ts`:

```javascript
'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'

export const MyClientFeature = createClientFeature({})
```

Explore the APIs available through ClientFeature to add the specific functionality you need. Remember, do not import directly from `@payloadcms/richtext-lexical` when working on the client-side, as it will cause errors with webpack or turbopack. Instead, use `@payloadcms/richtext-lexical/client` for all client-side imports. Type-imports are excluded from this rule and can always be imported.

#### Adding a client feature to the server feature

Inside of your server feature, you can provide an import path to the client feature like this:

```javascript
import { createServerFeature } from '@payloadcms/richtext-lexical'

export const MyFeature = createServerFeature({
  feature: {
    ClientFeature: './path/to/feature.client#MyClientFeature',
  },
  key: 'myFeature',
  dependenciesPriority: ['otherFeature'],
})
```

#### Nodes

Add nodes to the nodes array in both your client & server feature. On the server side, nodes are utilized for backend operations like HTML conversion in a headless editor. On the client side, these nodes are integral to how content is displayed and managed in the editor, influencing how they are rendered, behave, and saved in the database.

Example:

`myFeature/feature.client.ts`:

```javascript
'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { MyNode } from './nodes/MyNode'

export const MyClientFeature = createClientFeature({
  nodes: [MyNode],
})
```

This also supports lexical node replacements.

`myFeature/nodes/MyNode.tsx`:

Here is a basic DecoratorNode example:

```javascript
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical'

import { $applyNodeReplacement, DecoratorNode } from '@payloadcms/richtext-lexical/lexical'

// SerializedLexicalNode is the default lexical node.
// By setting your SerializedMyNode type to SerializedLexicalNode,
// you are basically saying that this node does not save any additional data.
// If you want your node to save data, feel free to extend it
export type SerializedMyNode = SerializedLexicalNode

// Lazy-import the React component to your node here
const MyNodeComponent = React.lazy(() =>
  import('../component/index.js').then((module) => ({
    default: module.MyNodeComponent,
  })),
)

/**
 * This node is a DecoratorNode. DecoratorNodes allow
 * you to render React components in the editor.
 *
 * They need both createDom and decorate functions.
 * createDom => outside of the html.
 * decorate => React Component inside of the html.
 *
 * If we used DecoratorBlockNode instead,
 * we would only need a decorate method
 */
export class MyNode extends DecoratorNode<React.ReactElement> {
  static clone(node: MyNode): MyNode {
    return new MyNode(node.__key)
  }

  static getType(): string {
    return 'myNode'
  }

  /**
   * Defines what happens if you copy a div element
   * from another page and paste it into the lexical editor
   *
   * This also determines the behavior of lexical's
   * internal HTML -> Lexical converter
   */
  static importDOM(): DOMConversionMap | null {
    return {
      div: () => ({
        conversion: $yourConversionMethod,
        priority: 0,
      }),
    }
  }

  /**
   * The data for this node is stored serialized as JSON.
   * This is the "load function" of that node: it takes
   * the saved data and converts it into a node.
   */
  static importJSON(serializedNode: SerializedMyNode): MyNode {
    return $createMyNode()
  }

  /**
   * Determines how the hr element is rendered in the
   * lexical editor. This is only the "initial" / "outer"
   * HTML element.
   */
  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('div')
    return element
  }

  /**
   * Allows you to render a React component within
   * whatever createDOM returns.
   */
  decorate(): React.ReactElement {
    return <MyNodeComponent nodeKey={this.__key} />
  }

  /**
   * Opposite of importDOM, this function defines what
   * happens when you copy a div element from the lexical
   * editor and paste it into another page.
   *
   * This also determines the behavior of lexical's
   * internal Lexical -> HTML converter
   */
  exportDOM(): DOMExportOutput {
    return { element: document.createElement('div') }
  }
  /**
   * Opposite of importJSON. This determines what
   * data is saved in the database / in the lexical
   * editor state.
   */
  exportJSON(): SerializedLexicalNode {
    return {
      type: 'myNode',
      version: 1,
    }
  }

  getTextContent(): string {
    return '\n'
  }

  isInline(): false {
    return false
  }

  updateDOM(): boolean {
    return false
  }
}

// This is used in the importDOM method. Totally optional
// if you do not want your node to be created automatically
// when copy & pasting certain dom elements into your editor.
function $yourConversionMethod(): DOMConversionOutput {
  return { node: $createMyNode() }
}

// This is a utility method to create a new MyNode.
// Utility methods prefixed with $ make it explicit
// that this should only be used within lexical
export function $createMyNode(): MyNode {
  return $applyNodeReplacement(new MyNode())
}

// This is just a utility method you can use
// to check if a node is a MyNode. This also
// ensures correct typing.
export function $isMyNode(
  node: LexicalNode | null | undefined,
): node is MyNode {
  return node instanceof MyNode
}
```

Please do not add any 'use client' directives to your nodes, as the node class can be used on the server.

#### Plugins

One small part of a feature are plugins. The name stems from the lexical playground plugins and is just a small part of a lexical feature. Plugins are simply React components which are added to the editor, within all the lexical context providers. They can be used to add any functionality to the editor, by utilizing the lexical API.

Most commonly, they are used to register lexical listeners, node transforms or commands. For example, you could add a drawer to your plugin and register a command which opens it. That command can then be called from anywhere within lexical, e.g. from within your custom lexical node.

To add a plugin, simply add it to the plugins array in your client feature:

```javascript
'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { MyPlugin } from './plugin'

export const MyClientFeature = createClientFeature({
  plugins: [MyPlugin],
})
```

Example `plugin.tsx`:

```javascript
'use client'
import type { LexicalCommand } from '@payloadcms/richtext-lexical/lexical'

import {
  createCommand,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
} from '@payloadcms/richtext-lexical/lexical'

import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import { $insertNodeToNearestRoot } from '@payloadcms/richtext-lexical/lexical/utils'
import { useEffect } from 'react'

import type { PluginComponent } from '@payloadcms/richtext-lexical' // type imports can be imported from @payloadcms/richtext-lexical - even on the client

import { $createMyNode } from '../nodes/MyNode'
import './index.scss'

export const INSERT_MYNODE_COMMAND: LexicalCommand<void> = createCommand(
  'INSERT_MYNODE_COMMAND',
)

/**
 * Plugin which registers a lexical command to
 * insert a new MyNode into the editor
 */
export const MyNodePlugin: PluginComponent = () => {
  // The useLexicalComposerContext hook can be used
  // to access the lexical editor instance
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_MYNODE_COMMAND,
      (type) => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection)) {
          return false
        }

        const focusNode = selection.focus.getNode()

        if (focusNode !== null) {
          const newMyNode = $createMyNode()
          $insertNodeToNearestRoot(newMyNode)
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}
```

In this example, we register a lexical command, which simply inserts a new MyNode into the editor. This command can be called from anywhere within lexical, e.g. from within a custom node.

#### Toolbar groups

Toolbar groups are visual containers which hold toolbar items. There are different toolbar group types which determine how a toolbar item is displayed: dropdown and buttons.

All the default toolbar groups are exported from `@payloadcms/richtext-lexical/client`. You can use them to add your own toolbar items to the editor:

- Dropdown: toolbarAddDropdownGroupWithItems
- Dropdown: toolbarTextDropdownGroupWithItems
- Buttons: toolbarFormatGroupWithItems
- Buttons: toolbarFeatureButtonsGroupWithItems

Within dropdown groups, items are positioned vertically when the dropdown is opened and include the icon & label. Within button groups, items are positioned horizontally and only include the icon. If a toolbar group with the same key is declared twice, all its items will be merged into one group.

##### Custom buttons toolbar group

| Option | Description |
|--------|-------------|
| items | All toolbar items part of this toolbar group need to be added here. |
| key | Each toolbar group needs to have a unique key. Groups with the same keys will have their items merged together. |
| order | Determines where the toolbar group will be. |
| type | Controls the toolbar group type. Set to buttons to create a buttons toolbar group, which displays toolbar items horizontally using only their icons. |

Example:

```javascript
import type {
  ToolbarGroup,
  ToolbarGroupItem,
} from '@payloadcms/richtext-lexical'

export const toolbarFormatGroupWithItems = (
  items: ToolbarGroupItem[],
): ToolbarGroup => {
  return {
    type: 'buttons',
    items,
    key: 'myButtonsToolbar',
    order: 10,
  }
}
```

##### Custom dropdown toolbar group

| Option | Description |
|--------|-------------|
| items | All toolbar items part of this toolbar group need to be added here. |
| key | Each toolbar group needs to have a unique key. Groups with the same keys will have their items merged together. |
| order | Determines where the toolbar group will be. |
| type | Controls the toolbar group type. Set to dropdown to create a buttons toolbar group, which displays toolbar items vertically using their icons and labels, if the dropdown is open. |
| ChildComponent | The dropdown toolbar ChildComponent allows you to pass in a React Component which will be displayed within the dropdown button. |

Example:

```javascript
import type {
  ToolbarGroup,
  ToolbarGroupItem,
} from '@payloadcms/richtext-lexical'

import { MyIcon } from './icons/MyIcon'

export const toolbarAddDropdownGroupWithItems = (
  items: ToolbarGroupItem[],
): ToolbarGroup => {
  return {
    type: 'dropdown',
    ChildComponent: MyIcon,
    items,
    key: 'myDropdownToolbar',
    order: 10,
  }
}
```

#### Toolbar items

Custom nodes and features on its own are pointless, if they can't be added to the editor. You will need to hook in one of our interfaces which allow the user to interact with the editor:

- Fixed toolbar which stays fixed at the top of the editor
- Inline, floating toolbar which appears when selecting text
- Slash menu which appears when typing / in the editor
- Markdown transformers, which are triggered when a certain text pattern is typed in the editor
- Or any other interfaces which can be added via your own plugins. Our toolbars are a prime example of this - they are just plugins.

To add a toolbar item to either the floating or the inline toolbar, you can add a ToolbarGroup with a ToolbarItem to the toolbarFixed or toolbarInline props of your client feature:

```javascript
'use client'

import {
  createClientFeature,
  toolbarAddDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { IconComponent } from './icon'
import { $isHorizontalRuleNode } from './nodes/MyNode'
import { INSERT_MYNODE_COMMAND } from './plugin'
import { $isNodeSelection } from '@payloadcms/richtext-lexical/lexical'

export const MyClientFeature = createClientFeature({
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          ChildComponent: IconComponent,
          isActive: ({ selection }) => {
            if (!$isNodeSelection(selection) || !selection.getNodes().length) {
              return false
            }

            const firstNode = selection.getNodes()[0]
            return $isHorizontalRuleNode(firstNode)
          },
          key: 'myNode',
          label: ({ i18n }) => {
            return i18n.t('lexical:myFeature:label')
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_MYNODE_COMMAND, undefined)
          },
        },
      ]),
    ],
  },
})
```

You will have to provide a toolbar group first, and then the items for that toolbar group (more on that above).

A ToolbarItem various props you can use to customize its behavior:

| Option | Description |
|--------|-------------|
| ChildComponent | A React component which is rendered within your toolbar item's default button component. Usually, you want this to be an icon. |
| Component | A React component which is rendered in place of the toolbar item's default button component, thus completely replacing it. The ChildComponent and onSelect properties will be ignored. |
| label | The label will be displayed in your toolbar item, if it's within a dropdown group. To make use of i18n, this can be a function. |
| key | Each toolbar item needs to have a unique key. |
| onSelect | A function which is called when the toolbar item is clicked. |
| isEnabled | This is optional and controls if the toolbar item is clickable or not. If false is returned here, it will be grayed out and unclickable. |
| isActive | This is optional and controls if the toolbar item is highlighted or not |

The API for adding an item to the floating inline toolbar (toolbarInline) is identical. If you wanted to add an item to both the fixed and inline toolbar, you can extract it into its own variable (typed as ToolbarGroup[]) and add it to both the toolbarFixed and toolbarInline props.

#### Slash Menu groups

We're exporting `slashMenuBasicGroupWithItems` from `@payloadcms/richtext-lexical/client` which you can use to add items to the slash menu labelled "Basic". If you want to create your own slash menu group, here is an example:

```javascript
import type {
  SlashMenuGroup,
  SlashMenuItem,
} from '@payloadcms/richtext-lexical'

export function mwnSlashMenuGroupWithItems(
  items: SlashMenuItem[],
): SlashMenuGroup {
  return {
    items,
    key: 'myGroup',
    label: 'My Group', // <= This can be a function to make use of i18n
  }
}
```

By creating a helper function like this, you can easily re-use it and add items to it. All Slash Menu groups with the same keys will have their items merged together.

| Option | Description |
|--------|-------------|
| items | An array of SlashMenuItem's which will be displayed in the slash menu. |
| label | The label will be displayed before your Slash Menu group. In order to make use of i18n, this can be a function. |
| key | Used for class names and, if label is not provided, for display. Slash menus with the same key will have their items merged together. |

#### Slash Menu items

The API for adding items to the slash menu is similar. There are slash menu groups, and each slash menu groups has items. Here is an example:

```javascript
'use client'

import {
  createClientFeature,
  slashMenuBasicGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { INSERT_MYNODE_COMMAND } from './plugin'
import { IconComponent } from './icon'

export const MyClientFeature = createClientFeature({
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: IconComponent,
          key: 'myNode',
          keywords: ['myNode', 'myFeature', 'someOtherKeyword'],
          label: ({ i18n }) => {
            return i18n.t('lexical:myFeature:label')
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_MYNODE_COMMAND, undefined)
          },
        },
      ]),
    ],
  },
})
```

| Option | Description |
|--------|-------------|
| Icon | The icon which is rendered in your slash menu item. |
| label | The label will be displayed in your slash menu item. In order to make use of i18n, this can be a function. |
| key | Each slash menu item needs to have a unique key. The key will be matched when typing, displayed if no label property is set, and used for classNames. |
| onSelect | A function which is called when the slash menu item is selected. |
| keywords | Keywords are used to match the item for different texts typed after the '/'. E.g. you might want to show a horizontal rule item if you type both /hr, /separator, /horizontal etc. In addition to the keywords, the label and key will be used to find the right slash menu item. |

#### Markdown Transformers

The Client Feature, just like the Server Feature, allows you to add markdown transformers. Markdown transformers on the client are used to create new nodes when a certain markdown pattern is typed in the editor.

```javascript
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import type { ElementTransformer } from '@payloadcms/richtext-lexical/lexical/markdown'
import { $createMyNode, $isMyNode, MyNode } from './nodes/MyNode'

const MyMarkdownTransformer: ElementTransformer = {
  type: 'element',
  dependencies: [MyNode],
  export: (node, exportChildren) => {
    if (!$isMyNode(node)) {
      return null
    }
    return '+++'
  },
  // match ---
  regExp: /^+++\s*$/,
  replace: (parentNode) => {
    const node = $createMyNode()
    if (node) {
      parentNode.replace(node)
    }
  },
}

export const MyFeature = createClientFeature({
  markdownTransformers: [MyMarkdownTransformer],
})
```

In this example, a new MyNode will be inserted into the editor when `+++ ` is typed.

#### Providers

You can add providers to your client feature, which will be nested below the EditorConfigProvider. This can be useful if you want to provide some context to your nodes or other parts of your feature.

```javascript
'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { TableContext } from './context'

export const MyClientFeature = createClientFeature({
  providers: [TableContext],
})
```

#### Props

To accept props in your feature, type them as a generic.

Server Feature:

```javascript
createServerFeature<UnSanitizedProps, SanitizedProps, UnSanitizedClientProps>({
  //...
})
```

Client Feature:

```javascript
createClientFeature<UnSanitizedClientProps, SanitizedClientProps>({
  //...
})
```

The unSanitized props are what the user will pass to the feature when they call its provider function and add it to their editor config. You then have an option to sanitize those props. To sanitize those in the server feature, you can pass a function to feature instead of an object:

```javascript
createServerFeature<UnSanitizedProps, SanitizedProps, UnSanitizedClientProps>({
  //...
  feature: async ({
    config,
    isRoot,
    props,
    resolvedFeatures,
    unSanitizedEditorConfig,
    featureProviderMap,
  }) => {
    const sanitizedProps = doSomethingWithProps(props)

    return {
      sanitizedServerFeatureProps: sanitizedProps,
      //Actual server feature here...
    }
  },
})
```

Keep in mind that any sanitized props then have to be returned in the sanitizedServerFeatureProps property.

In the client feature, it works similarly:

```javascript
createClientFeature<UnSanitizedClientProps, SanitizedClientProps>(
  ({
    clientFunctions,
    featureProviderMap,
    props,
    resolvedFeatures,
    unSanitizedEditorConfig,
  }) => {
    const sanitizedProps = doSomethingWithProps(props)
    return {
      sanitizedClientFeatureProps: sanitizedProps,
      //Actual client feature here...
    }
  },
)
```

#### Bringing props from the server to the client

By default, the client feature will never receive any props from the server feature. In order to pass props from the server to the client, you can need to return those props in the server feature:

```javascript
type UnSanitizedClientProps = {
  test: string
}

createServerFeature<UnSanitizedProps, SanitizedProps, UnSanitizedClientProps>({
  //...
  feature: {
    clientFeatureProps: {
      test: 'myValue',
    },
  },
})
```

The reason the client feature does not have the same props available as the server by default is because all client props need to be serializable. You can totally accept things like functions or Maps as props in your server feature, but you will not be able to send those to the client. In the end, those props are sent from the server to the client over the network, so they need to be serializable.

### More information

Have a look at the features we've already built - understanding how they work will help you understand how to create your own. There is no difference between the features included by default and the ones you create yourself - since those features are all isolated from the "core", you have access to the same APIs, whether the feature is part of Payload or not!

---

## Converters

Richtext fields save data in JSON - this is great for storage and flexibility and allows you to easily to convert it to other formats:

- Converting JSX
- Converting HTML
- Converting Plaintext
- Converting Markdown and MDX

### Editor Config Factory

Some converters require access to the Lexical editor config, which defines available features and behaviors. Payload provides multiple ways to obtain the editor config through the editorConfigFactory from `@payloadcms/richtext-lexical`.

#### Importing the Factory

First, import the necessary utilities:

```javascript
import type { SanitizedConfig } from 'payload'
import { editorConfigFactory } from '@payloadcms/richtext-lexical'

// Your Payload Config needs to be available in order to retrieve the default editor config
const config: SanitizedConfig = {} as SanitizedConfig
```

#### Option 1: Default Editor Config

If you require the default editor config:

```javascript
const defaultEditorConfig = await editorConfigFactory.default({ config })
```

#### Option 2: Extract from a Lexical Field

When a lexical field config is available, you can extract the editor config directly:

```javascript
const fieldEditorConfig = editorConfigFactory.fromField({
  field: config.collections[0].fields[1],
})
```

#### Option 3: Create a Custom Editor Config

You can create a custom editor configuration by specifying additional features:

```javascript
import { FixedToolbarFeature } from '@payloadcms/richtext-lexical'

const customEditorConfig = await editorConfigFactory.fromFeatures({
  config,
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
  ],
})
```

#### Option 4: Extract from an Instantiated Editor

If you've created a global or reusable Lexical editor instance, you can access its configuration. This method is typically less efficient and not recommended:

```javascript
const editor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
  ],
})

const instantiatedEditorConfig = await editorConfigFactory.fromEditor({
  config,
  editor,
})
```

For better efficiency, consider extracting the features into a separate variable and using fromFeatures instead of this method.

#### Example - Retrieving the editor config from an existing field

If you have access to the sanitized collection config, you can access the lexical sanitized editor config, as every lexical richText field returns it. Here is an example how you can retrieve it from another field's afterRead hook:

```javascript
import type { CollectionConfig, RichTextField } from 'payload'

import {
  editorConfigFactory,
  getEnabledNodes,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const MyCollection: CollectionConfig = {
  slug: 'slug',
  fields: [
    {
      name: 'text',
      type: 'text',
      hooks: {
        afterRead: [
          ({ siblingFields, value }) => {
            const field: RichTextField = siblingFields.find(
              (field) => 'name' in field && field.name === 'richText',
            ) as RichTextField

            const editorConfig = editorConfigFactory.fromField({
              field,
            })

            // Now you can use the editor config

            return value
          },
        ],
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor(),
    },
  ],
}
```

### Converting to HTML

There are two main approaches to convert your Lexical-based rich text to HTML:

1. **Generate HTML on-demand (Recommended)**: Convert JSON to HTML wherever you need it, on-demand.
2. **Generate HTML within your Collection**: Create a new field that automatically converts your saved JSON content to HTML. This is not recommended because it adds overhead to the Payload API and may not work well with live preview.

#### On-demand

To convert JSON to HTML on-demand, use the `convertLexicalToHTML` function from `@payloadcms/richtext-lexical/html`. Here's an example of how to use it in a React component in your frontend:

```javascript
'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

import React from 'react'

export const MyComponent = ({ data }: { data: SerializedEditorState }) => {
  const html = convertLexicalToHTML({ data })

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

#### Dynamic Population (Advanced)

By default, `convertLexicalToHTML` expects fully populated data (e.g. uploads, links, etc.). If you need to dynamically fetch and populate those nodes, use the async variant, `convertLexicalToHTMLAsync`, from `@payloadcms/richtext-lexical/html-async`. You must provide a populate function:

```javascript
'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { getRestPopulateFn } from '@payloadcms/richtext-lexical/client'
import { convertLexicalToHTMLAsync } from '@payloadcms/richtext-lexical/html-async'
import React, { useEffect, useState } from 'react'

export const MyComponent = ({ data }: { data: SerializedEditorState }) => {
  const [html, setHTML] = useState<null | string>(null)
  useEffect(() => {
    async function convert() {
      const html = await convertLexicalToHTMLAsync({
        data,
        populate: getRestPopulateFn({
          apiURL: `http://localhost:3000/api`,
        }),
      })
      setHTML(html)
    }

    void convert()
  }, [data])

  return html && <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

Using the REST populate function will send a separate request for each node. If you need to populate a large number of nodes, this may be slow. For improved performance on the server, you can use the `getPayloadPopulateFn` function:

```javascript
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { getPayloadPopulateFn } from '@payloadcms/richtext-lexical'
import { convertLexicalToHTMLAsync } from '@payloadcms/richtext-lexical/html-async'
import { getPayload } from 'payload'
import React from 'react'

import config from '../../config.js'

export const MyRSCComponent = async ({
  data,
}: {
  data: SerializedEditorState
}) => {
  const payload = await getPayload({
    config,
  })

  const html = await convertLexicalToHTMLAsync({
    data,
    populate: await getPayloadPopulateFn({
      currentDepth: 0,
      depth: 1,
      payload,
    }),
  })

  return html && <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

#### HTML field

The `lexicalHTMLField()` helper converts JSON to HTML and saves it in a field that is updated every time you read it via an afterRead hook. It's generally not recommended for two reasons:

1. It creates a column with duplicate content in another format.
2. In client-side live preview, it makes it not "live".

Consider using the on-demand HTML converter above or the JSX converter unless you have a good reason.

```javascript
import type { HTMLConvertersFunction } from '@payloadcms/richtext-lexical/html'
import type { MyTextBlock } from '@/payload-types.js'
import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  type DefaultNodeTypes,
  lexicalEditor,
  lexicalHTMLField,
  type SerializedBlockNode,
} from '@payloadcms/richtext-lexical'

const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'nameOfYourRichTextField',
      type: 'richText',
      editor: lexicalEditor(),
    },
    lexicalHTMLField({
      htmlFieldName: 'nameOfYourRichTextField_html',
      lexicalFieldName: 'nameOfYourRichTextField',
    }),
    {
      name: 'customRichText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [
              {
                interfaceName: 'MyTextBlock',
                slug: 'myTextBlock',
                fields: [
                  {
                    name: 'text',
                    type: 'text',
                  },
                ],
              },
            ],
          }),
        ],
      }),
    },
    lexicalHTMLField({
      htmlFieldName: 'customRichText_html',
      lexicalFieldName: 'customRichText',
      // can pass in additional converters or override default ones
      converters: (({ defaultConverters }) => ({
        ...defaultConverters,
        blocks: {
          myTextBlock: ({ node, providedCSSString }) =>
            `<div style="background-color: red;${providedCSSString}">${node.fields.text}</div>`,
        },
      })) as HTMLConvertersFunction<
        DefaultNodeTypes | SerializedBlockNode<MyTextBlock>
      >,
    }),
  ],
}
```

#### Blocks to HTML

If your rich text includes Lexical blocks, you need to provide a way to convert them to HTML. For example:

```javascript
'use client'

import type { MyInlineBlock, MyTextBlock } from '@/payload-types'
import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import {
  convertLexicalToHTML,
  type HTMLConvertersFunction,
} from '@payloadcms/richtext-lexical/html'
import React from 'react'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<MyTextBlock>
  | SerializedInlineBlockNode<MyInlineBlock>

const htmlConverters: HTMLConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  blocks: {
    // Each key should match your block's slug
    myTextBlock: ({ node, providedCSSString }) =>
      `<div style="background-color: red;${providedCSSString}">${node.fields.text}</div>`,
  },
  inlineBlocks: {
    // Each key should match your inline block's slug
    myInlineBlock: ({ node, providedStyleTag }) =>
      `<span${providedStyleTag}>${node.fields.text}</span$>`,
  },
})

export const MyComponent = ({ data }: { data: SerializedEditorState }) => {
  const html = convertLexicalToHTML({
    converters: htmlConverters,
    data,
  })

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

#### HTML to Richtext

If you need to convert raw HTML into a Lexical editor state, use `convertHTMLToLexical` from `@payloadcms/richtext-lexical`, along with the editorConfigFactory to retrieve the editor config:

```javascript
import {
  convertHTMLToLexical,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'
// Make sure you have jsdom and @types/jsdom installed
import { JSDOM } from 'jsdom'

const html = convertHTMLToLexical({
  editorConfig: await editorConfigFactory.default({
    config, // Your Payload Config
  }),
  html: '<p>text</p>',
  JSDOM, // Pass in the JSDOM import; it's not bundled to keep package size small
})
```

### Converting to JSX

#### Richtext to JSX

To convert richtext to JSX, import the RichText component from `@payloadcms/richtext-lexical/react` and pass the richtext content to it:

```javascript
import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export const MyComponent = ({ data }: { data: SerializedEditorState }) => {
  return <RichText data={data} />
}
```

The RichText component includes built-in converters for common Lexical nodes. You can add or override converters via the converters prop for custom blocks, custom nodes, or any modifications you need. See the website template for a working example.

When fetching data, ensure your depth setting is high enough to fully populate Lexical nodes such as uploads. The JSX converter requires fully populated data to work correctly.

#### Internal Links

By default, Payload doesn't know how to convert internal links to JSX, as it doesn't know what the corresponding URL of the internal link is. You'll notice that you get a "found internal link, but internalDocToHref is not provided" error in the console when you try to render content with internal links.

To fix this, you need to pass the `internalDocToHref` prop to LinkJSXConverter. This prop is a function that receives the link node and returns the URL of the document.

```javascript
import type {
  DefaultNodeTypes,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { relationTo, value } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug

  switch (relationTo) {
    case 'posts':
      return `/posts/${slug}`
    case 'categories':
      return `/category/${slug}`
    case 'pages':
      return `/${slug}`
    default:
      return `/${relationTo}/${slug}`
  }
}

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
})

export const MyComponent: React.FC<{
  lexicalData: SerializedEditorState
}> = ({ lexicalData }) => {
  return <RichText converters={jsxConverters} data={lexicalData} />
}
```

#### Lexical Blocks

If your rich text includes custom Blocks or Inline Blocks, you must supply custom converters that match each block's slug. This converter is not included by default, as Payload doesn't know how to render your custom blocks.

For example:

```javascript
'use client'
import type { MyInlineBlock, MyNumberBlock, MyTextBlock } from '@/payload-types'
import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import {
  type JSXConvertersFunction,
  RichText,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'

// Extend the default node types with your custom blocks for full type safety
type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<MyNumberBlock | MyTextBlock>
  | SerializedInlineBlockNode<MyInlineBlock>

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  blocks: {
    // Each key should match your block's slug
    myNumberBlock: ({ node }) => <div>{node.fields.number}</div>,
    myTextBlock: ({ node }) => (
      <div style={{ backgroundColor: 'red' }}>{node.fields.text}</div>
    ),
  },
  inlineBlocks: {
    // Each key should match your inline block's slug
    myInlineBlock: ({ node }) => <span>{node.fields.text}</span>,
  },
})

export const MyComponent: React.FC<{
  lexicalData: SerializedEditorState
}> = ({ lexicalData }) => {
  return <RichText converters={jsxConverters} data={lexicalData} />
}
```

#### Overriding Converters

You can override any of the default JSX converters by passing your custom converter, keyed to the node type, to the converters prop / the converters function.

Example - overriding the upload node converter to use next/image:

```javascript
'use client'
import type {
  DefaultNodeTypes,
  SerializedUploadNode,
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import {
  type JSXConvertersFunction,
  RichText,
} from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import React from 'react'

type NodeTypes = DefaultNodeTypes

// Custom upload converter component that uses next/image
const CustomUploadComponent: React.FC<{
  node: SerializedUploadNode
}> = ({ node }) => {
  if (node.relationTo === 'uploads') {
    const uploadDoc = node.value
    if (typeof uploadDoc !== 'object') {
      return null
    }
    const { alt, height, url, width } = uploadDoc
    return <Image alt={alt} height={height} src={url} width={width} />
  }

  return null
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  // Override the default upload converter
  upload: ({ node }) => {
    return <CustomUploadComponent node={node} />
  },
})

export const MyComponent: React.FC<{
  lexicalData: SerializedEditorState
}> = ({ lexicalData }) => {
  return <RichText converters={jsxConverters} data={lexicalData} />
}
```

### Converting to Markdown

#### Richtext to Markdown

If you have access to the Payload Config and the lexical editor config, you can convert the lexical editor state to Markdown with the following:

```javascript
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import {
  convertLexicalToMarkdown,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'

// Your richtext data here
const data: SerializedEditorState = {}

const markdown = convertLexicalToMarkdown({
  data,
  editorConfig: await editorConfigFactory.default({
    config, // <= make sure you have access to your Payload Config
  }),
})
```

#### Example - outputting Markdown from the Collection

```javascript
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { CollectionConfig, RichTextField } from 'payload'

import {
  convertLexicalToMarkdown,
  editorConfigFactory,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'nameOfYourRichTextField',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'markdown',
      type: 'textarea',
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [
          ({ siblingData, siblingFields }) => {
            const data: SerializedEditorState =
              siblingData['nameOfYourRichTextField']

            if (!data) {
              return ''
            }

            const markdown = convertLexicalToMarkdown({
              data,
              editorConfig: editorConfigFactory.fromField({
                field: siblingFields.find(
                  (field) =>
                    'name' in field && field.name === 'nameOfYourRichTextField',
                ) as RichTextField,
              }),
            })

            return markdown
          },
        ],
        beforeChange: [
          ({ siblingData }) => {
            // Ensure that the markdown field is not saved in the database
            delete siblingData['markdown']
            return null
          },
        ],
      },
    },
  ],
}
```

#### Markdown to Richtext

If you have access to the Payload Config and the lexical editor config, you can convert Markdown to the lexical editor state with the following:

```javascript
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'

const lexicalJSON = convertMarkdownToLexical({
  editorConfig: await editorConfigFactory.default({
    config, // <= make sure you have access to your Payload Config
  }),
  markdown: '# Hello world\n\nThis is a **test**.',
})
```

#### Converting MDX

Payload supports serializing and deserializing MDX content. While Markdown converters are stored on the features, MDX converters are stored on the blocks that you pass to the BlocksFeature.

##### Defining a Custom Block

Here is an example of a Banner block.

This block:

- Renders in the admin UI as a normal Lexical block with specific fields (e.g. type, content).
- Converts to an MDX Banner component.
- Can parse that MDX Banner back into a Lexical state.

```javascript
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Block, CollectionConfig, RichTextField } from 'payload'

import {
  BlocksFeature,
  convertLexicalToMarkdown,
  editorConfigFactory,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const BannerBlock: Block = {
  slug: 'Banner',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
    },
  ],
  jsx: {
    /**
     * Convert from Lexical -> MDX:
     * <Banner type="..." >child content</Banner>
     */
    export: ({ fields, lexicalToMarkdown }) => {
      const props: any = {}
      if (fields.type) {
        props.type = fields.type
      }

      return {
        children: lexicalToMarkdown({ editorState: fields.content }),
        props,
      }
    },
    /**
     * Convert from MDX -> Lexical:
     */
    import: ({ children, markdownToLexical, props }) => {
      return {
        type: props?.type,
        content: markdownToLexical({ markdown: children }),
      }
    },
  },
}

const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'nameOfYourRichTextField',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [BannerBlock],
          }),
        ],
      }),
    },
    {
      name: 'markdown',
      type: 'textarea',
      hooks: {
        afterRead: [
          ({ siblingData, siblingFields }) => {
            const data: SerializedEditorState =
              siblingData['nameOfYourRichTextField']

            if (!data) {
              return ''
            }

            const markdown = convertLexicalToMarkdown({
              data,
              editorConfig: editorConfigFactory.fromField({
                field: siblingFields.find(
                  (field) =>
                    'name' in field && field.name === 'nameOfYourRichTextField',
                ) as RichTextField,
              }),
            })

            return markdown
          },
        ],
        beforeChange: [
          ({ siblingData }) => {
            // Ensure that the markdown field is not saved in the database
            delete siblingData['markdown']
            return null
          },
        ],
      },
    },
  ],
}
```

The conversion is done using the `jsx` property of the block. The `export` function is called when converting from lexical to MDX, and the `import` function is called when converting from MDX to lexical.

##### Export

The export function takes the block field data and the lexicalToMarkdown function as arguments. It returns the following object:

| Property | Type | Description |
|----------|------|-------------|
| children | string | This will be in between the opening and closing tags of the block. |
| props | object | This will be in the opening tag of the block. |

##### Import

The import function provides data extracted from the MDX. It takes the following arguments:

| Argument | Type | Description |
|----------|------|-------------|
| children | string | This will be the text between the opening and closing tags of the block. |
| props | object | These are the props passed to the block, parsed from the opening tag into an object. |

The returning object is equal to the block field data.

### Converting to Plaintext

#### Richtext to Plaintext

Here's how you can convert richtext data to plaintext using `@payloadcms/richtext-lexical/plaintext`.

```javascript
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

// Your richtext data here
const data: SerializedEditorState = {}

const plaintext = convertLexicalToPlaintext({ data })
```

#### Custom Converters

The `convertLexicalToPlaintext` functions accepts a converters object that allows you to customize how specific nodes are converted to plaintext.

```javascript
import type {
  DefaultNodeTypes,
  SerializedBlockNode,
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { MyTextBlock } from '@/payload-types'

import {
  convertLexicalToPlaintext,
  type PlaintextConverters,
} from '@payloadcms/richtext-lexical/plaintext'

// Your richtext data here
const data: SerializedEditorState = {}

const converters: PlaintextConverters<
  DefaultNodeTypes | SerializedBlockNode<MyTextBlock>
> = {
  blocks: {
    textBlock: ({ node }) => {
      return node.fields.text ?? ''
    },
  },
  link: ({ node }) => {
    return node.fields.url ?? ''
  },
}

const plaintext = convertLexicalToPlaintext({
  converters,
  data,
})
```

Unlike other converters, there are no default converters for plaintext.

If a node does not have a converter defined, the following heuristics are used to convert it to plaintext:

- If the node has a text field, it will be used as the plaintext.
- If the node has a children field, the children will be recursively converted to plaintext.
- If the node has neither, it will be ignored.

Paragraph, text and tab nodes insert newline / tab characters.

---

## TypeScript

Every single piece of saved data is 100% fully typed within lexical. It provides a type for every single node, which can be imported from `@payloadcms/richtext-lexical` - each type is prefixed with Serialized, e.g., `SerializedUploadNode`.

To fully type the entire editor JSON, you can use our `TypedEditorState` helper type, which accepts a union of all possible node types as a generic. We don't provide a type that already contains all possible node types because they depend on which features you have enabled in your editor. Here is an example:

```javascript
import type {
  SerializedAutoLinkNode,
  SerializedBlockNode,
  SerializedHorizontalRuleNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedParagraphNode,
  SerializedQuoteNode,
  SerializedRelationshipNode,
  SerializedTextNode,
  SerializedUploadNode,
  TypedEditorState,
  SerializedHeadingNode,
} from '@payloadcms/richtext-lexical'

const editorState: TypedEditorState<
  | SerializedAutoLinkNode
  | SerializedBlockNode
  | SerializedHorizontalRuleNode
  | SerializedLinkNode
  | SerializedListItemNode
  | SerializedListNode
  | SerializedParagraphNode
  | SerializedQuoteNode
  | SerializedRelationshipNode
  | SerializedTextNode
  | SerializedUploadNode
  | SerializedHeadingNode
> = {
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Some text. Every property here is fully-typed',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        textFormat: 0,
        version: 1,
      },
    ],
  },
}
```

Alternatively, you can use the `DefaultTypedEditorState` type, which includes all types for all nodes included in the defaultFeatures:

```javascript
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

const editorState: DefaultTypedEditorState = {
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Some text. Every property here is fully-typed',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        textFormat: 0,
        version: 1,
      },
    ],
  },
}
```

Just like `TypedEditorState`, the `DefaultTypedEditorState` also accepts an optional node type union as a generic. Here, this would add the specified node types to the default ones. Example:

```javascript
DefaultTypedEditorState<SerializedBlockNode | YourCustomSerializedNode>
```

This is a type-safe representation of the editor state. If you look at the auto suggestions of a node's type property, you will see all the possible node types you can use.

Make sure to only use types exported from `@payloadcms/richtext-lexical`, not from the lexical core packages. We only have control over the types we export and can make sure they're correct, even though the lexical core may export types with identical names.

### Automatic type generation

Lexical does not generate accurate type definitions for your richText fields for you yet - this will be improved in the future. Currently, it only outputs the rough shape of the editor JSON, which you can enhance using type assertions.

---

## Admin Customization

The Rich Text Field editor configuration has an admin property with the following options:

| Property | Description |
|----------|-------------|
| placeholder | Set this property to define a placeholder string for the field. |
| hideGutter | Set this property to true to hide this field's gutter within the Admin Panel. |
| hideInsertParagraphAtEnd | Set this property to true to hide the "+" button that appears at the end of the editor |

### Disable the gutter

You can disable the gutter (the vertical line padding between the editor and the left edge of the screen) by setting the hideGutter prop to true:

```javascript
{
  name: 'richText',
  type: 'richText',
  editor: lexicalEditor({
    admin: {
      hideGutter: true
    },
  }),
}
```

### Customize the placeholder

You can customize the placeholder (the text that appears in the editor when it's empty) by setting the placeholder prop:

```javascript
{
  name: 'richText',
  type: 'richText',
  editor: lexicalEditor({
    admin: {
      placeholder: 'Type your content here...'
    },
  }),
}
```

---

## Additional Information

### Important Import Guidelines

**Critical**: Do not import directly from core lexical packages - this may break in minor Payload version bumps.

Instead, import the re-exported versions from `@payloadcms/richtext-lexical`. For example:

❌ **Don't do this:**
```javascript
import { $insertNodeToNearestRoot } from '@lexical/utils'
```

✅ **Do this instead:**
```javascript
import { $insertNodeToNearestRoot } from '@payloadcms/richtext-lexical/lexical/utils'
```

### Client-Side Imports

When working on the client-side, do not import directly from `@payloadcms/richtext-lexical` as it will cause errors with webpack or turbopack. Instead, use `@payloadcms/richtext-lexical/client` for all client-side imports. Type-imports are excluded from this rule and can always be imported.

❌ **Don't do this in client components:**
```javascript
import { createClientFeature } from '@payloadcms/richtext-lexical'
```

✅ **Do this instead:**
```javascript
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
```

### Available Import Paths

Here are the main import paths you'll use:

- `@payloadcms/richtext-lexical` - Main package (server-side)
- `@payloadcms/richtext-lexical/client` - Client-side features and utilities
- `@payloadcms/richtext-lexical/html` - HTML conversion utilities
- `@payloadcms/richtext-lexical/html-async` - Async HTML conversion utilities
- `@payloadcms/richtext-lexical/react` - React components for JSX conversion
- `@payloadcms/richtext-lexical/plaintext` - Plaintext conversion utilities
- `@payloadcms/richtext-lexical/lexical` - Re-exported Lexical core
- `@payloadcms/richtext-lexical/lexical/utils` - Re-exported Lexical utilities
- `@payloadcms/richtext-lexical/lexical/markdown` - Re-exported Lexical markdown utilities
- `@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext` - Re-exported Lexical React context
- `@payloadcms/richtext-lexical/shared` - Shared utilities (like `hasText`)

### Next.js 15 Compatibility

This documentation is specifically relevant for **Next.js 15** projects. The Lexical rich text editor is fully compatible with Next.js 15's App Router and server components architecture.

When using the converters in Next.js 15:

- Use `convertLexicalToHTML` for client-side HTML conversion
- Use `convertLexicalToHTMLAsync` with `getPayloadPopulateFn` for server-side conversion with better performance
- The `RichText` component from `@payloadcms/richtext-lexical/react` works seamlessly with React Server Components

### Performance Considerations

1. **HTML Conversion**: Use the on-demand HTML converter rather than the HTML field for better performance and live preview compatibility.

2. **Population**: When using `convertLexicalToHTMLAsync`, prefer `getPayloadPopulateFn` on the server over `getRestPopulateFn` for better performance when populating many nodes.

3. **JSX Conversion**: Ensure your depth setting is high enough to fully populate Lexical nodes such as uploads when fetching data for JSX conversion.

4. **Custom Features**: Consider using the BlocksFeature before building completely custom features, as it covers many common use cases with less complexity.

---

## Summary

The Payload CMS Lexical Rich Text Editor provides a powerful, extensible, and fully-typed rich text editing experience. Key highlights include:

- **Modular Architecture**: Built around composable features that can be added, removed, or customized
- **Full TypeScript Support**: Every piece of data is fully typed with comprehensive type definitions
- **Multiple Output Formats**: Convert to HTML, JSX, Markdown, and Plaintext with built-in converters
- **Extensibility**: Create custom features, nodes, toolbar items, and slash menu entries
- **Next.js 15 Ready**: Fully compatible with modern Next.js applications and server components
- **Performance Optimized**: On-demand conversion and efficient population strategies

Whether you're using the default features or building completely custom functionality, the Lexical editor provides the flexibility and power needed for modern content management while maintaining excellent developer experience and type safety.