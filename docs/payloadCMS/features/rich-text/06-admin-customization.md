# Admin Customization

The Rich Text Field editor configuration has an admin property with the following options:

| Property                 | Description                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------- |
| placeholder              | Set this property to define a placeholder string for the field.                        |
| hideGutter               | Set this property to true to hide this field's gutter within the Admin Panel.          |
| hideInsertParagraphAtEnd | Set this property to true to hide the "+" button that appears at the end of the editor |

## Disable the gutter

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

## Customize the placeholder

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
