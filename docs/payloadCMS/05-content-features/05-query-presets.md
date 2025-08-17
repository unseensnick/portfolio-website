# PayloadCMS Query Presets

## Overview

Query Presets allow you to save and share filters, columns, and sort orders for your Collections. This is useful for reusing common or complex filtering patterns and/or sharing them across your team.

Each Query Preset is saved as a new record in the database under the `payload-query-presets` collection. This allows for an endless number of preset configurations, where the users of your app define the presets that are most useful to them, rather than being hard coded into the Payload Config.

Within the Admin Panel, Query Presets are applied to the List View. When enabled, new controls are displayed for users to manage presets. Once saved, these presets can be loaded up at any time and optionally shared with others.

## Basic Setup

To enable Query Presets on a Collection, use the `enableQueryPresets` property in your Collection Config:

```javascript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  enableQueryPresets: true,
}
```

## Configuration Options

While not required, you may want to customize the behavior of Query Presets to suit your needs, such as add custom labels or access control rules.

Settings for Query Presets are managed on the `queryPresets` property at the root of your Payload Config:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  queryPresets: {
    // ...
  },
})
```

The following options are available for Query Presets:

| Option | Description |
|--------|-------------|
| `access` | Used to define custom collection-level access control that applies to all presets. |
| `filterConstraints` | Used to define which constraints are available to users when managing presets. |
| `constraints` | Used to define custom document-level access control that apply to individual presets. |
| `labels` | Custom labels to use for the Query Presets collection. |

## Access Control

Query Presets are subject to the same Access Control as the rest of Payload. This means you can use the same patterns you are already familiar with to control who can read, update, and delete presets.

Access Control for Query Presets can be customized in two ways:

1. **Collection Access Control**: Applies to all presets. These rules are not controllable by the user and are statically defined in the config.
2. **Document Access Control**: Applies to each individual preset. These rules are controllable by the user and are dynamically defined on each record in the database.

### Collection Access Control

Collection-level access control applies to all presets within the Query Presets collection. Users cannot control these rules, they are written statically in your config.

To add Collection Access Control, use the `queryPresets.access` property in your Payload Config:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  queryPresets: {
    // ...
    access: {
      read: ({ req: { user } }) =>
        user ? user?.roles?.some((role) => role === 'admin') : false,
      update: ({ req: { user } }) =>
        user ? user?.roles?.some((role) => role === 'admin') : false,
    },
  },
})
```

This example restricts all Query Presets to users with the role of admin.

**Note:** Custom access control will override the defaults on this collection, including the requirement for a user to be authenticated. Be sure to include any necessary checks in your custom rules unless you intend on making these publicly accessible.

### Document Access Control

You can also define access control rules that apply to each specific preset. Users have the ability to define and modify these rules on the fly as they manage presets. These are saved dynamically in the database on each record.

When a user manages a preset, document-level access control options will be available to them in the Admin Panel for each operation.

By default, Payload provides a set of sensible defaults for all Query Presets, but you can customize these rules to suit your needs:

- **Only Me**: Only the user who created the preset can read, update, and delete it.
- **Everyone**: All users can read, update, and delete the preset.
- **Specific Users**: Only select users can read, update, and delete the preset.

## Custom Access Control

You can augment the default access control rules with your own custom rules. This can be useful for creating more complex access control patterns that the defaults don't provide, such as for RBAC.

Adding custom access control rules requires:

- A label to display in the dropdown
- A set of fields to conditionally render when that option is selected
- A function that returns the access control rules for that option

To do this, use the `queryPresets.constraints` property in your Payload Config:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  queryPresets: {
    // ...
    constraints: {
      read: [
        {
          label: 'Specific Roles',
          value: 'specificRoles',
          fields: [
            {
              name: 'roles',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
              ],
            },
          ],
          access: ({ req: { user } }) => ({
            'access.read.roles': {
              in: [user?.roles],
            },
          }),
        },
      ],
    },
  },
})
```

In this example, we've added a new option called "Specific Roles" that allows users to select from a list of roles. When this option is selected, the user will be prompted to select one or more roles from a list of options. The access control rule for this option is that the user operating on the preset must have one of the selected roles.

**Note:** Payload places your custom fields into the `access[operation]` field group, so your rules will need to reflect this.

### Constraint Configuration Options

The following options are available for each constraint:

| Option | Description |
|--------|-------------|
| `label` | The label to display in the dropdown for this constraint. |
| `value` | The value to store in the database when this constraint is selected. |
| `fields` | An array of fields to render when this constraint is selected. |
| `access` | A function that determines the access control rules for this constraint. |

## Constraint Access Control

Used to dynamically filter which constraints are available based on the current user, document data, or other criteria.

Some examples of this might include:

- Ensuring that only "admins" are allowed to make a preset available to "everyone"
- Preventing the "onlyMe" option from being selected based on a hypothetical "disablePrivatePresets" checkbox

When a user lacks the permission to set a constraint, the option will either be hidden from them, or disabled if it is already saved to that preset.

To do this, you can use the `filterConstraints` property in your Payload Config:

```javascript
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  queryPresets: {
    // ...
    filterConstraints: ({ req, options }) =>
      !req.user?.roles?.includes('admin')
        ? options.filter(
            (option) =>
              (typeof option === 'string' ? option : option.value) !==
              'everyone',
          )
        : options,
  },
})
```

The `filterConstraints` function receives the same arguments as `filterOptions` in the Select field.