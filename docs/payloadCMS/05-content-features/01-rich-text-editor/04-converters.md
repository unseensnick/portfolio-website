# Lexical Converters

Richtext fields save data in JSON - this is great for storage and flexibility and allows you to easily to convert it to other formats:

- Converting JSX
- Converting HTML
- Converting Plaintext
- Converting Markdown and MDX

## Retrieving the Editor Config

Some converters require access to the Lexical editor config, which defines available features and behaviors. Payload provides multiple ways to obtain the editor config through the editorConfigFactory from `@payloadcms/richtext-lexical`.

### Importing the Factory

First, import the necessary utilities:

```javascript
import type { SanitizedConfig } from 'payload'
import { editorConfigFactory } from '@payloadcms/richtext-lexical'

// Your Payload Config needs to be available in order to retrieve the default editor config
const config: SanitizedConfig = {} as SanitizedConfig
```

### Option 1: Default Editor Config

If you require the default editor config:

```javascript
const defaultEditorConfig = await editorConfigFactory.default({ config });
```

### Option 2: Extract from a Lexical Field

When a lexical field config is available, you can extract the editor config directly:

```javascript
const fieldEditorConfig = editorConfigFactory.fromField({
    field: config.collections[0].fields[1],
});
```

### Option 3: Create a Custom Editor Config

You can create a custom editor configuration by specifying additional features:

```javascript
import { FixedToolbarFeature } from "@payloadcms/richtext-lexical";

const customEditorConfig = await editorConfigFactory.fromFeatures({
    config,
    features: ({ defaultFeatures }) => [
        ...defaultFeatures,
        FixedToolbarFeature(),
    ],
});
```

### Option 4: Extract from an Instantiated Editor

If you've created a global or reusable Lexical editor instance, you can access its configuration. This method is typically less efficient and not recommended:

```javascript
const editor = lexicalEditor({
    features: ({ defaultFeatures }) => [
        ...defaultFeatures,
        FixedToolbarFeature(),
    ],
});

const instantiatedEditorConfig = await editorConfigFactory.fromEditor({
    config,
    editor,
});
```

For better efficiency, consider extracting the features into a separate variable and using fromFeatures instead of this method.

### Example - Retrieving the editor config from an existing field

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

## Converting HTML

### Rich Text to HTML

There are two main approaches to convert your Lexical-based rich text to HTML:

1. **Generate HTML on-demand (Recommended)**: Convert JSON to HTML wherever you need it, on-demand.
2. **Generate HTML within your Collection**: Create a new field that automatically converts your saved JSON content to HTML. This is not recommended because it adds overhead to the Payload API and may not work well with live preview.

### On-demand

To convert JSON to HTML on-demand, use the convertLexicalToHTML function from `@payloadcms/richtext-lexical/html`. Here's an example of how to use it in a React component in your frontend:

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

### Dynamic Population (Advanced)

By default, convertLexicalToHTML expects fully populated data (e.g. uploads, links, etc.). If you need to dynamically fetch and populate those nodes, use the async variant, convertLexicalToHTMLAsync, from `@payloadcms/richtext-lexical/html-async`. You must provide a populate function:

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

### HTML field

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

### Blocks to HTML

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

### HTML to Richtext

If you need to convert raw HTML into a Lexical editor state, use `convertHTMLToLexical` from `@payloadcms/richtext-lexical`, along with the editorConfigFactory to retrieve the editor config:

```javascript
import {
    convertHTMLToLexical,
    editorConfigFactory,
} from "@payloadcms/richtext-lexical";
// Make sure you have jsdom and @types/jsdom installed
import { JSDOM } from "jsdom";

const html = convertHTMLToLexical({
    editorConfig: await editorConfigFactory.default({
        config, // Your Payload Config
    }),
    html: "<p>text</p>",
    JSDOM, // Pass in the JSDOM import; it's not bundled to keep package size small
});
```

## Converting JSX

### Richtext to JSX

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

### Internal Links

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

### Lexical Blocks

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

### Overriding Converters

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

## Converting Markdown

### Richtext to Markdown

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

### Example - outputting Markdown from the Collection

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

### Markdown to Richtext

If you have access to the Payload Config and the lexical editor config, you can convert Markdown to the lexical editor state with the following:

```javascript
import {
    convertMarkdownToLexical,
    editorConfigFactory,
} from "@payloadcms/richtext-lexical";

const lexicalJSON = convertMarkdownToLexical({
    editorConfig: await editorConfigFactory.default({
        config, // <= make sure you have access to your Payload Config
    }),
    markdown: "# Hello world\n\nThis is a **test**.",
});
```

### Converting MDX

Payload supports serializing and deserializing MDX content. While Markdown converters are stored on the features, MDX converters are stored on the blocks that you pass to the BlocksFeature.

### Defining a Custom Block

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

### Export

The export function takes the block field data and the lexicalToMarkdown function as arguments. It returns the following object:

| Property | Type   | Description                                                        |
| -------- | ------ | ------------------------------------------------------------------ |
| children | string | This will be in between the opening and closing tags of the block. |
| props    | object | This will be in the opening tag of the block.                      |

### Import

The import function provides data extracted from the MDX. It takes the following arguments:

| Argument | Type   | Description                                                                          |
| -------- | ------ | ------------------------------------------------------------------------------------ |
| children | string | This will be the text between the opening and closing tags of the block.             |
| props    | object | These are the props passed to the block, parsed from the opening tag into an object. |

The returning object is equal to the block field data.

## Converting Plaintext

### Richtext to Plaintext

Here's how you can convert richtext data to plaintext using `@payloadcms/richtext-lexical/plaintext`.

```javascript
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

// Your richtext data here
const data: SerializedEditorState = {}

const plaintext = convertLexicalToPlaintext({ data })
```

### Custom Converters

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
