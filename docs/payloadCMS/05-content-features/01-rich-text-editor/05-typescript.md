# TypeScript

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

## Automatic type generation

Lexical does not generate accurate type definitions for your richText fields for you yet - this will be improved in the future. Currently, it only outputs the rough shape of the editor JSON, which you can enhance using type assertions.
