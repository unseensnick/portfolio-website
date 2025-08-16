# Rich Text Editor - Overview and Getting Started

## Overview

This documentation is about our new editor, based on Lexical (Meta's rich text editor). The previous default editor was based on Slate and is still supported. You can read its documentation, or the optional migration guide to migrate from Slate to Lexical (recommended).

The editor is the most important property of the rich text field.

As a key part of Payload, we are proud to offer you the best editing experience you can imagine. With healthy defaults out of the box, but also with the flexibility to customize every detail: from the "/" menu and toolbars (whether inline or fixed) to inserting any component or subfield you can imagine.

## Installation

To use the rich text editor, first you need to install it:

```bash
pnpm install @payloadcms/richtext-lexical
```

## Basic Setup

Once you have it installed, you can pass it to your top-level Payload Config as follows:

```javascript
import { buildConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export default buildConfig({
    collections: [
        // your collections here
    ],
    // Pass the Lexical editor to the root config
    editor: lexicalEditor({}),
});
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

## Extending the lexical editor with Features

Lexical has been designed with extensibility in mind. Whether you're aiming to introduce new functionalities or tweak the existing ones, Lexical makes it seamless for you to bring those changes to life.

### Features: The Building Blocks

At the heart of Lexical's customization potential are "features". While Lexical ships with a set of default features we believe are essential for most use cases, the true power lies in your ability to redefine, expand, or prune these as needed.

If you remove all the default features, you're left with a blank editor. You can then add in only the features you need, or you can build your own custom features from scratch.

### Integrating New Features

To weave in your custom features, utilize the features prop when initializing the Lexical Editor. Here's a basic example of how this is done:

```javascript
import {
    BlocksFeature,
    LinkFeature,
    UploadFeature,
    lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { Banner } from "../blocks/Banner";
import { CallToAction } from "../blocks/CallToAction";

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
                        name: "rel",
                        label: "Rel Attribute",
                        type: "select",
                        hasMany: true,
                        options: ["noopener", "noreferrer", "nofollow"],
                        admin: {
                            description:
                                "The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.",
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
                                name: "caption",
                                type: "richText",
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
    });
}
```

features can be both an array of features, or a function returning an array of features. The function provides the following props:

| Prop            | Description                                                                                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| defaultFeatures | This opinionated array contains all "recommended" default features. You can see which features are included in the default features in the table below.                                                                                                |
| rootFeatures    | This array contains all features that are enabled in the root richText editor (the one defined in the payload.config.ts). If this field is the root richText editor, or if the root richText editor is not a lexical editor, this array will be empty. |

## Official Features

You can find more information about the official features in our official features docs.

## Creating your own, custom Feature

You can find more information about creating your own feature in our building custom feature docs.

## Detecting empty editor state

When you first type into a rich text field and subsequently delete everything through the admin panel, its value changes from null to a JSON object containing an empty paragraph.

If needed, you can reset the field value to null programmatically - for example, by using a custom hook to detect when the editor is empty.

This also applies to fields like text and textArea, which could be stored as either null or an empty value in the database. Since the empty value for richText is a JSON object, checking for emptiness is a bit more involved - so Payload provides a utility for it:

```javascript
import { hasText } from "@payloadcms/richtext-lexical/shared";

hasText(richtextData);
```
