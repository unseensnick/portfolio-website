# Payload Basic Data Fields

This document covers the basic data fields in Payload CMS that store simple data types in the database.

## Text Field

The Text Field is one of the most commonly used fields. It saves a string to the database and provides the Admin Panel with a simple text input.

To add a Text Field, set the type to `text` in your Field Config:

```typescript
import type { Field } from "payload";

export const MyTextField: Field = {
    // ...
    type: "text",
};
```

### Text Field Config Options

| Option             | Description                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                     |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                          |
| `unique`           | Enforce that each entry in the Collection has a unique value for this field                                                                     |
| `minLength`        | Used by the default validation function to ensure values are of a minimum character length                                                      |
| `maxLength`        | Used by the default validation function to ensure values are of a maximum character length                                                      |
| `hasMany`          | Makes this field an ordered array of text instead of just a single text                                                                         |
| `minRows`          | Minimum number of texts in the array, if hasMany is set to true                                                                                 |
| `maxRows`          | Maximum number of texts in the array, if hasMany is set to true                                                                                 |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                              |
| `index`            | Build an index for this field to produce faster queries. Set this field to true if your users will perform queries on this field's data often   |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                   |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                             |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                         |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel |
| `defaultValue`     | Provide data to be used for this field's default value                                                                                          |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                      |
| `required`         | Require this field to have a value                                                                                                              |
| `admin`            | Admin-specific configuration                                                                                                                    |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                       |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                     |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                   |

### Text Field Admin Options

| Option         | Description                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `placeholder`  | Set this property to define a placeholder string in the text input                                                       |
| `autoComplete` | Set this property to a string that will be used for browser autocomplete                                                 |
| `rtl`          | Override the default text direction of the Admin Panel for this field. Set to true to force right-to-left text direction |

### Text Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "pageTitle",
            type: "text",
            required: true,
        },
    ],
};
```

## Textarea Field

The Textarea Field is nearly identical to the Text Field but features a slightly larger input that is better suited to edit longer text.

```typescript
import type { Field } from "payload";

export const MyTextareaField: Field = {
    type: "textarea",
    name: "metaDescription",
};
```

### Textarea Field Config Options

Same as Text Field, with these additional admin options:

| Option | Description                                                                         |
| ------ | ----------------------------------------------------------------------------------- |
| `rows` | Set the number of visible text rows in the textarea. Defaults to 2 if not specified |

### Textarea Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "metaDescription",
            type: "textarea",
            required: true,
        },
    ],
};
```

## Number Field

The Number Field stores and validates numeric entry and supports additional numerical validation and formatting features.

```typescript
import type { Field } from "payload";

export const MyNumberField: Field = {
    type: "number",
    name: "age",
};
```

### Number Field Config Options

| Option             | Description                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                     |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                          |
| `min`              | Minimum value accepted. Used in the default validation function                                                                                 |
| `max`              | Maximum value accepted. Used in the default validation function                                                                                 |
| `hasMany`          | Makes this field an ordered array of numbers instead of just a single number                                                                    |
| `minRows`          | Minimum number of numbers in the numbers array, if hasMany is set to true                                                                       |
| `maxRows`          | Maximum number of numbers in the numbers array, if hasMany is set to true                                                                       |
| `unique`           | Enforce that each entry in the Collection has a unique value for this field                                                                     |
| `index`            | Build an index for this field to produce faster queries. Set this field to true if your users will perform queries on this field's data often   |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                              |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                   |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                             |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                         |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel |
| `defaultValue`     | Provide data to be used for this field's default value                                                                                          |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                      |
| `required`         | Require this field to have a value                                                                                                              |
| `admin`            | Admin-specific configuration                                                                                                                    |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                       |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                     |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                   |

### Number Field Admin Options

| Option         | Description                                                                      |
| -------------- | -------------------------------------------------------------------------------- |
| `step`         | Set a value for the number field to increment / decrement using browser controls |
| `placeholder`  | Set this property to define a placeholder string for the field                   |
| `autoComplete` | Set this property to a string that will be used for browser autocomplete         |

### Number Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "age",
            type: "number",
            required: true,
            admin: {
                step: 1,
            },
        },
    ],
};
```

## Checkbox Field

The Checkbox Field saves a boolean in the database.

```typescript
import type { Field } from "payload";

export const MyCheckboxField: Field = {
    type: "checkbox",
    name: "enableCoolStuff",
};
```

### Checkbox Field Config Options

| Option             | Description                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                     |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                          |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                              |
| `index`            | Build an index for this field to produce faster queries. Set this field to true if your users will perform queries on this field's data often   |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                   |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                             |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                         |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel |
| `defaultValue`     | Provide data to be used for this field's default value, will default to false if field is also required                                         |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                      |
| `required`         | Require this field to have a value                                                                                                              |
| `admin`            | Admin-specific configuration                                                                                                                    |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                       |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                     |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                   |

### Checkbox Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "enableCoolStuff",
            type: "checkbox",
            label: "Click me to see fanciness",
            defaultValue: false,
        },
    ],
};
```

## Email Field

The Email Field enforces that the value provided is a valid email address.

```typescript
import type { Field } from "payload";

export const MyEmailField: Field = {
    type: "email",
    name: "contact",
};
```

### Email Field Config Options

Same as Text Field config options.

### Email Field Admin Options

| Option         | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| `placeholder`  | Set this property to define a placeholder string for the field           |
| `autoComplete` | Set this property to a string that will be used for browser autocomplete |

### Email Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "contact",
            type: "email",
            label: "Contact Email Address",
            required: true,
        },
    ],
};
```

## Date Field

The Date Field saves a Date in the database and provides the Admin Panel with a customizable time picker interface.

```typescript
import type { Field } from "payload";

export const MyDateField: Field = {
    type: "date",
    name: "publishDate",
};
```

### Date Field Config Options

| Option             | Description                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                     |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                          |
| `index`            | Build an index for this field to produce faster queries. Set this field to true if your users will perform queries on this field's data often   |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                              |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                   |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                             |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                         |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel |
| `defaultValue`     | Provide data to be used for this field's default value                                                                                          |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                      |
| `required`         | Require this field to have a value                                                                                                              |
| `admin`            | Admin-specific configuration                                                                                                                    |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                       |
| `timezone`         | Set to true to enable timezone selection on this field                                                                                          |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                     |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                   |

### Date Field Admin Options

| Property                | Description                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `placeholder`           | Placeholder text for the field                                                                |
| `date`                  | Pass options to customize date field appearance                                               |
| `date.displayFormat`    | Format date to be shown in field cell                                                         |
| `date.pickerAppearance` | Determines the appearance of the datepicker: `dayAndTime`, `timeOnly`, `dayOnly`, `monthOnly` |
| `date.monthsToShow`     | Number of months to display max is 2. Defaults to 1                                           |
| `date.minDate`          | Min date value to allow                                                                       |
| `date.maxDate`          | Max date value to allow                                                                       |
| `date.minTime`          | Min time value to allow                                                                       |
| `date.maxTime`          | Max date value to allow                                                                       |
| `date.overrides`        | Pass any valid props directly to the react-datepicker                                         |
| `date.timeIntervals`    | Time intervals to display. Defaults to 30 minutes                                             |
| `date.timeFormat`       | Determines time format. Defaults to 'h:mm aa'                                                 |

This property is passed directly to react-datepicker.

### Date Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "dateOnly",
            type: "date",
            admin: {
                date: {
                    pickerAppearance: "dayOnly",
                    displayFormat: "d MMM yyy",
                },
            },
        },
        {
            name: "timeOnly",
            type: "date",
            admin: {
                date: {
                    pickerAppearance: "timeOnly",
                    displayFormat: "h:mm:ss a",
                },
            },
        },
        {
            name: "monthOnly",
            type: "date",
            admin: {
                date: {
                    pickerAppearance: "monthOnly",
                    displayFormat: "MMMM yyyy",
                },
            },
        },
    ],
};
```

### Timezones

To enable timezone selection, set the `timezone` property to `true`:

```typescript
{
  name: 'date',
  type: 'date',
  timezone: true,
}
```

This will add a dropdown to the date picker that allows users to select a timezone. The selected timezone will be saved in the database along with the date in a new column named `date_tz`.

You can customise the available list of timezones in the global admin config.

**Good to know:** The date itself will be stored in UTC so it's up to you to handle the conversion to the user's timezone when displaying the date in your frontend.

Dates without a specific time are normalised to 12:00 in the selected timezone.

## Code Field

The Code Field saves a string in the database, but provides the Admin Panel with a code editor styled interface.

```typescript
import type { Field } from "payload";

export const MyCodeField: Field = {
    type: "code",
    name: "trackingCode",
};
```

### Code Field Config Options

| Option             | Description                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                     |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                          |
| `unique`           | Enforce that each entry in the Collection has a unique value for this field                                                                     |
| `index`            | Build an index for this field to produce faster queries. Set this field to true if your users will perform queries on this field's data often   |
| `minLength`        | Used by the default validation function to ensure values are of a minimum character length                                                      |
| `maxLength`        | Used by the default validation function to ensure values are of a maximum character length                                                      |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                              |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                   |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                             |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                         |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel |
| `defaultValue`     | Provide data to be used for this field's default value                                                                                          |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                      |
| `required`         | Require this field to have a value                                                                                                              |
| `admin`            | Admin-specific configuration                                                                                                                    |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                       |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                     |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                   |

### Code Field Admin Options

| Option          | Description                                                                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `language`      | This property can be set to any language listed [here](https://microsoft.github.io/monaco-editor/api/enums/monaco.languages.Languages.html)                                             |
| `editorOptions` | Options that can be passed to the monaco editor, view the [full list](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html) |

### Code Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "trackingCode",
            type: "code",
            required: true,
            admin: {
                language: "javascript",
            },
        },
    ],
};
```

## JSON Field

The JSON Field saves raw JSON to the database and provides the Admin Panel with a code editor styled interface. This is different from the Code Field which saves the value as a string in the database.

```typescript
import type { Field } from "payload";

export const MyJSONField: Field = {
    type: "json",
    name: "customerJSON",
};
```

### JSON Field Config Options

| Option             | Description                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                     |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                          |
| `unique`           | Enforce that each entry in the Collection has a unique value for this field                                                                     |
| `index`            | Build an index for this field to produce faster queries. Set this field to true if your users will perform queries on this field's data often   |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                              |
| `jsonSchema`       | Provide a JSON schema that will be used for validation                                                                                          |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                   |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                             |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                         |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel |
| `defaultValue`     | Provide data to be used for this field's default value                                                                                          |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                      |
| `required`         | Require this field to have a value                                                                                                              |
| `admin`            | Admin-specific configuration                                                                                                                    |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                       |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                     |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                   |

### JSON Field Admin Options

| Option          | Description                                                                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `editorOptions` | Options that can be passed to the monaco editor, view the [full list](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html) |

### JSON Schema Validation

Payload JSON fields fully support the JSON schema standard. By providing a schema in your field config, the editor will be guided in the admin UI, getting typeahead for properties and their formats automatically. When the document is saved, the default validation will prevent saving any invalid data in the field according to the schema in your config.

```typescript
// Local JSON Schema
{
  name: 'customerJSON',
  type: 'json',
  jsonSchema: {
    uri: 'a://b/foo.json',
    fileMatch: ['a://b/foo.json'],
    schema: {
      type: 'object',
      properties: {
        foo: {
          enum: ['bar', 'foobar'],
        },
      },
    },
  },
}

// Remote JSON Schema
{
  name: 'customerJSON',
  type: 'json',
  jsonSchema: {
    uri: 'https://example.com/customer.schema.json',
    fileMatch: ['https://example.com/customer.schema.json'],
  },
}
```

## Point Field

The Point Field saves a pair of coordinates in the database and assigns an index for location related queries. The data structure in the database matches the GeoJSON structure to represent point.

```typescript
import type { Field } from "payload";

export const MyPointField: Field = {
    type: "point",
    name: "location",
};
```

**Important:** The Point Field currently is not supported in SQLite.

### Point Field Config

| Option             | Description                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                               |
| `label`            | Used as a field label in the Admin Panel and to name the generated GraphQL type                                                                           |
| `unique`           | Enforce that each entry in the Collection has a unique value for this field                                                                               |
| `index`            | Build an index for this field to produce faster queries. To support location queries, point index defaults to 2dsphere, to disable the index set to false |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                                        |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                             |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                                       |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                                   |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel           |
| `defaultValue`     | Provide data to be used for this field's default value                                                                                                    |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                                |
| `required`         | Require this field to have a value                                                                                                                        |
| `admin`            | Admin-specific configuration                                                                                                                              |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                                 |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                               |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                             |

### Point Field Querying

**Near Operator:** Query by distance to another point (results sorted by nearest first)

**Within Operator:** Query points within a specific GeoJSON area

```typescript
const polygon: Point[] = [
    [9.0, 19.0], // bottom-left
    [9.0, 21.0], // top-left
    [11.0, 21.0], // top-right
    [11.0, 19.0], // bottom-right
    [9.0, 19.0], // back to starting point to close the polygon
];

payload.find({
    collection: "points",
    where: {
        point: {
            within: {
                type: "Polygon",
                coordinates: [polygon],
            },
        },
    },
});
```

**Intersects Operator:** Query points that intersect a specific GeoJSON area (same usage as within)

## Radio Group Field

The Radio Field allows for the selection of one value from a predefined set of possible values and presents a radio group-style set of inputs to the Admin Panel.

```typescript
import type { Field } from "payload";

export const MyRadioField: Field = {
    type: "radio",
    name: "color",
    options: [
        // ...
    ],
};
```

### Radio Field Config Options

| Option             | Description                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                          |
| `options`          | Array of options to allow the field to store. Can either be an array of strings, or an array of objects containing a label string and a value string |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                               |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                                   |
| `index`            | Build an index for this field to produce faster queries. Set this field to true if your users will perform queries on this field's data often        |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                        |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                                  |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                              |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel      |
| `defaultValue`     | Provide data to be used for this field's default value. The default value must exist within provided values in options                               |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                           |
| `required`         | Require this field to have a value                                                                                                                   |
| `admin`            | Admin-specific configuration                                                                                                                         |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                            |
| `enumName`         | Custom enum name for this field when using SQL Database Adapter (Postgres). Auto-generated from name if not defined                                  |
| `interfaceName`    | Create a top level, reusable Typescript interface & GraphQL type                                                                                     |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                          |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                        |

### Radio Field Admin Options

| Property | Description                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `layout` | Allows for the radio group to be styled as a horizontally or vertically distributed list. The default value is horizontal |

### Radio Field Example

```typescript
import type { CollectionConfig } from "payload";

export const ExampleCollection: CollectionConfig = {
    slug: "example-collection",
    fields: [
        {
            name: "color",
            type: "radio",
            options: [
                {
                    label: "Mint",
                    value: "mint",
                },
                {
                    label: "Dark Gray",
                    value: "dark_gray",
                },
            ],
            defaultValue: "mint", // The first value in options.
            admin: {
                layout: "horizontal",
            },
        },
    ],
};
```

**Important:** Option values should be strings that do not contain hyphens or special characters due to GraphQL enumeration naming constraints. Underscores are allowed. If you determine you need your option values to be non-strings or contain special characters, they will be formatted accordingly before being used as a GraphQL enum.

## Select Field

The Select Field provides a dropdown-style interface for choosing options from a predefined list as an enumeration.

```typescript
import type { Field } from "payload";

export const MySelectField: Field = {
    type: "select",
    name: "selectedFeatures",
    options: [
        // ...
    ],
};
```

### Select Field Config Options

| Option             | Description                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`             | To be used as the property name when stored and retrieved from the database                                                                          |
| `options`          | Array of options to allow the field to store. Can either be an array of strings, or an array of objects containing a label string and a value string |
| `hasMany`          | Boolean when, if set to true, allows this field to have many selections instead of only one                                                          |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                               |
| `unique`           | Enforce that each entry in the Collection has a unique value for this field                                                                          |
| `validate`         | Provide a custom validation function that will be executed on both the Admin Panel and the backend                                                   |
| `index`            | Build an index for this field to produce faster queries. Set this field to true if your users will perform queries on this field's data often        |
| `saveToJWT`        | If this field is top-level and nested in a config supporting Authentication, include its data in the user JWT                                        |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                                  |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                              |
| `hidden`           | Restrict this field's visibility from all APIs entirely. Will still be saved to the database, but will not appear in any API or the Admin Panel      |
| `defaultValue`     | Provide data to be used for this field's default value                                                                                               |
| `localized`        | Enable localization for this field. Requires localization to be enabled in the Base config                                                           |
| `required`         | Require this field to have a value                                                                                                                   |
| `admin`            | Admin-specific configuration                                                                                                                         |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                            |
| `enumName`         | Custom enum name for this field when using SQL Database Adapter (Postgres). Auto-generated from name if not defined                                  |
| `dbName`           | Custom table name (if hasMany set to true) for this field when using SQL Database Adapter (Postgres). Auto-generated from name if not defined        |
| `interfaceName`    | Create a top level, reusable Typescript interface & GraphQL type                                                                                     |
| `filterOptions`    | Dynamically filter which options are available based on the user, data, etc.                                                                         |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                          |
| `virtual`          | Provide true to disable field in the database, or provide a string path to link the field with a relationship                                        |

### Select Field Admin Options

| Property      | Description                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `isClearable` | Set to true if you'd like this field to be clearable within the Admin UI                                                             |
| `isSortable`  | Set to true if you'd like this field to be sortable within the Admin UI using drag and drop (only works when hasMany is set to true) |
| `placeholder` | Define a custom text or function to replace the generic default placeholder                                                          |

### Select Field filterOptions

Used to dynamically filter which options are available based on the current user, document data, or other criteria.

Some examples of this might include:

- Restricting options based on a user's role, e.g. admin-only options
- Displaying different options based on the value of another field, e.g. a city/state selector

The result of filterOptions will determine:

- Which options are displayed in the Admin Panel
- Which options can be saved to the database

```typescript
export const MySelectField: Field = {
    type: "select",
    options: [
        { label: "One", value: "one" },
        { label: "Two", value: "two" },
        { label: "Three", value: "three" },
    ],
    filterOptions: ({ options, data }) =>
        data.disallowOption1
            ? options.filter(
                  (option) =>
                      (typeof option === "string" ? option : option.value) !==
                      "one"
              )
            : options,
};
```

**Note:** This property is similar to filterOptions in Relationship or Upload fields, except that the return value of this function is simply an array of options, not a query constraint.

````

### Select Field Example

```typescript
import type { CollectionConfig } from 'payload'

export const ExampleCollection: CollectionConfig = {
  slug: 'example-collection',
  fields: [
    {
      name: 'selectedFeatures',
      type: 'select',
      hasMany: true,
      admin: {
        isClearable: true,
        isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
      },
      options: [
        {
          label: 'Metallic Paint',
          value: 'metallic_paint',
        },
        {
          label: 'Alloy Wheels',
          value: 'alloy_wheels',
        },
        {
          label: 'Carbon Fiber Dashboard',
          value: 'carbon_fiber_dashboard',
        },
      ],
    },
  ],
}
````
