# Payload CMS Access Control - Complete Guide

## Overview

Access Control determines what a user can and cannot do with any given Document, as well as what they can and cannot see within the Admin Panel. By implementing Access Control, you can define granular restrictions based on the user, their roles (RBAC), Document data, or any other criteria your application requires.

Access Control functions are scoped to the operation, meaning you can have different rules for create, read, update, delete, etc. Access Control functions are executed before any changes are made and before any operations are completed. This allows you to determine if the user has the necessary permissions before fulfilling the request.

### Use Cases

There are many use cases for Access Control, including:

- Allowing anyone read access to all posts
- Only allowing public access to posts where a status field is equal to published
- Giving only users with a role field equal to admin the ability to delete posts
- Allowing anyone to submit contact forms, but only logged in users to read, update or delete them
- Restricting a user to only be able to see their own orders, but no-one else's
- Allowing users that belong to a certain organization to access only that organization's resources

### Types of Access Control

There are three main types of Access Control in Payload:

1. **Collection Access Control**
2. **Global Access Control** 
3. **Field Access Control**

### Default Access Control

Payload provides default Access Control so that your data is secured behind Authentication without additional configuration. To do this, Payload sets a default function that simply checks if a user is present on the request. You can override this default behavior by defining your own Access Control functions as needed.

Here is the default Access Control that Payload provides:

```javascript
const defaultPayloadAccess = ({ req: { user } }) => {
  // Return `true` if a user is found
  // and `false` if it is undefined or null
  return Boolean(user) 
}
```

**Important:** In the Local API, all Access Control is skipped by default. This allows your server to have full control over your application. To opt back in, you can set the overrideAccess option to false in your requests.

### The Access Operation

The Admin Panel responds dynamically to your changes to Access Control. For example, if you restrict editing ExampleCollection to only users that feature an "admin" role, Payload will hide that Collection from the Admin Panel entirely. This is super powerful and allows you to control who can do what within your Admin Panel using the same functions that secure your APIs.

To accomplish this, Payload exposes the Access Operation. Upon login, Payload executes each Access Control function at the top level, across all Collections, Globals, and Fields, and returns a response that contains a reflection of what the currently authenticated user can do within your application.

**Important:** When your access control functions are executed via the Access Operation, the id and data arguments will be undefined. This is because Payload is executing your functions without referencing a specific Document.

If you use id or data within your access control functions, make sure to check that they are defined first. If they are not, then you can assume that your Access Control is being executed via the Access Operation to determine solely what the user can do within the Admin Panel.

### Locale Specific Access Control

To implement locale-specific access control, you can use the req.locale argument in your access control functions. This argument allows you to evaluate the current locale of the request and determine access permissions accordingly.

Here is an example:

```javascript
const access = ({ req }) => {
  // Grant access if the locale is 'en'
  if (req.locale === 'en') {
    return true
  }

  // Deny access for all other locales
  return false
}
```

## Collection Access Control

Collection Access Control is Access Control used to restrict access to Documents within a Collection, as well as what they can and cannot see within the Admin Panel as it relates to that Collection.

To add Access Control to a Collection, use the access property in your Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithAccessControl: CollectionConfig = {
  // ...
  access: {
    
    // ...
  },
}
```

### Config Options

Access Control is specific to the operation of the request.

To add Access Control to a Collection, use the access property in your Collection Config:

```typescript
import type { CollectionConfig } from 'payload';

export const CollectionWithAccessControl: CollectionConfig = {
  // ...
  access: {
    create: () => {...},
    read: () => {...},
    update: () => {...},
    delete: () => {...},

    // Auth-enabled Collections only
    admin: () => {...},
    unlock: () => {...},

    // Version-enabled Collections only
    readVersions: () => {...},
  },
}
```

The following options are available:

| Function | Allows/Denies Access |
|----------|---------------------|
| create | Used in the create operation. More details. |
| read | Used in the find and findByID operations. More details. |
| update | Used in the update operation. More details. |
| delete | Used in the delete operation. More details. |

If a Collection supports Authentication, the following additional options are available:

| Function | Allows/Denies Access |
|----------|---------------------|
| admin | Used to restrict access to the Admin Panel. More details. |
| unlock | Used to restrict which users can access the unlock operation. More details. |

If a Collection supports Versions, the following additional options are available:

| Function | Allows/Denies Access |
|----------|---------------------|
| readVersions | Used to control who can read versions, and who can't. Will automatically restrict the Admin UI version viewing access. More details. |

### Create

Returns a boolean which allows/denies access to the create request.

To add create Access Control to a Collection, use the create property in the Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithCreateAccess: CollectionConfig = {
  // ...
  access: {
    create: ({ req: { user }, data }) => {
      return Boolean(user)
    },
  },
}
```

The following arguments are provided to the create function:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user. |
| data | The data passed to create the document with. |

### Read

Returns a boolean which allows/denies access to the read request.

To add read Access Control to a Collection, use the read property in the Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithReadAccess: CollectionConfig = {
  // ...
  access: {
    read: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

**Tip:** Return a Query to limit the Documents to only those that match the constraint. This can be helpful to restrict users' access to specific Documents. More details.

As your application becomes more complex, you may want to define your function in a separate file and import them into your Collection Config:

```typescript
import type { Access } from 'payload'

export const canReadPage: Access = ({ req: { user } }) => {
  // Allow authenticated users
  if (user) {
    return true
  }

  // By returning a Query, guest users can read public Documents
  // Note: this assumes you have a `isPublic` checkbox field on your Collection
  return {
    isPublic: {
      equals: true,
    },
  }
}
```

The following arguments are provided to the read function:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user. |
| id | id of document requested, if within findByID. |

### Update

Returns a boolean which allows/denies access to the update request.

To add update Access Control to a Collection, use the update property in the Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithUpdateAccess: CollectionConfig = {
  // ...
  access: {
    update: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

**Tip:** Return a Query to limit the Documents to only those that match the constraint. This can be helpful to restrict users' access to specific Documents. More details.

As your application becomes more complex, you may want to define your function in a separate file and import them into your Collection Config:

```typescript
import type { Access } from 'payload'

export const canUpdateUser: Access = ({ req: { user }, id }) => {
  // Allow users with a role of 'admin'
  if (user.roles && user.roles.some((role) => role === 'admin')) {
    return true
  }

  // allow any other users to update only oneself
  return user.id === id
}
```

The following arguments are provided to the update function:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user. |
| id | id of document requested to update. |
| data | The data passed to update the document with. |

### Delete

Similarly to the Update function, returns a boolean or a query constraint to limit which documents can be deleted by which users.

To add delete Access Control to a Collection, use the delete property in the Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithDeleteAccess: CollectionConfig = {
  // ...
  access: {
    delete: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

As your application becomes more complex, you may want to define your function in a separate file and import them into your Collection Config:

```typescript
import type { Access } from 'payload'

export const canDeleteCustomer: Access = async ({ req, id }) => {
  if (!id) {
    // allow the admin UI to show controls to delete since it is indeterminate without the `id`
    return true
  }

  // Query another Collection using the `id`
  const result = await req.payload.find({
    collection: 'contracts',
    limit: 0,
    depth: 0,
    where: {
      customer: { equals: id },
    },
  })

  return result.totalDocs === 0
}
```

The following arguments are provided to the delete function:

| Option | Description |
|--------|-------------|
| req | The Request object with additional user property, which is the currently logged in user. |
| id | id of document requested to delete. |

### Admin

If the Collection is used to access the Admin Panel, the Admin Access Control function determines whether or not the currently logged in user can access the admin UI.

To add Admin Access Control to a Collection, use the admin property in the Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithAdminAccess: CollectionConfig = {
  // ...
  access: {
    admin: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

The following arguments are provided to the admin function:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user. |

### Unlock

Determines which users can unlock other users who may be blocked from authenticating successfully due to failing too many login attempts.

To add Unlock Access Control to a Collection, use the unlock property in the Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithUnlockAccess: CollectionConfig = {
  // ...
  access: {
    unlock: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

The following arguments are provided to the unlock function:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user. |

### Read Versions

If the Collection has Versions enabled, the readVersions Access Control function determines whether or not the currently logged in user can access the version history of a Document.

To add Read Versions Access Control to a Collection, use the readVersions property in the Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithVersionsAccess: CollectionConfig = {
  // ...
  access: {
    readVersions: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

The following arguments are provided to the readVersions function:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user. |

## Field-level Access Control

Field Access Control is Access Control used to restrict access to specific Fields within a Document.

To add Access Control to a Field, use the access property in your Field Config:

```typescript
import type { Field } from 'payload'

export const FieldWithAccessControl: Field = {
  // ...
  access: {
    
    // ...
  },
}
```

**Note:** Field Access Controls does not support returning Query constraints like Collection Access Control does.

### Config Options

Access Control is specific to the operation of the request.

To add Access Control to a Field, use the access property in the Field Config:

```typescript
import type { CollectionConfig } from 'payload';

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      access: {
        create: ({ req: { user } }) => { ... },
        read: ({ req: { user } }) => { ... },
        update: ({ req: { user } }) => { ... },
      },
    },
  ],
};
```

The following options are available:

| Function | Purpose |
|----------|---------|
| create | Allows or denies the ability to set a field's value when creating a new document. More details. |
| read | Allows or denies the ability to read a field's value. More details. |
| update | Allows or denies the ability to update a field's value More details. |

### Create

Returns a boolean which allows or denies the ability to set a field's value when creating a new document. If false is returned, any passed values will be discarded.

Available argument properties:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user |
| data | The full data passed to create the document. |
| siblingData | Immediately adjacent field data passed to create the document. |

### Read

Returns a boolean which allows or denies the ability to read a field's value. If false, the entire property is omitted from the resulting document.

Available argument properties:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user |
| id | id of the document being read |
| doc | The full document data. |
| siblingData | Immediately adjacent field data of the document being read. |

### Update

Returns a boolean which allows or denies the ability to update a field's value. If false is returned, any passed values will be discarded.

If false is returned and you attempt to update the field's value, the operation will not throw an error however the field will be omitted from the update operation and the value will remain unchanged.

Available argument properties:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user |
| id | id of the document being updated |
| data | The full data passed to update the document. |
| siblingData | Immediately adjacent field data passed to update the document with. |
| doc | The full document data, before the update is applied. |

## Globals Access Control

Global Access Control is Access Control used to restrict access to Global Documents, as well as what they can and cannot see within the Admin Panel as it relates to that Global.

To add Access Control to a Global, use the access property in your Global Config:

```typescript
import type { GlobalConfig } from 'payload'

export const GlobalWithAccessControl: GlobalConfig = {
  // ...
  access: {
    
    // ...
  },
}
```

### Config Options

Access Control is specific to the operation of the request.

To add Access Control to a Global, use the access property in the Global Config:

```typescript
import { GlobalConfig } from 'payload'

const GlobalWithAccessControl: GlobalConfig = {
  // ...
  access: {
    read: ({ req: { user } }) => {...},
    update: ({ req: { user } }) => {...},

    // Version-enabled Globals only
    readVersions: () => {...},
  },
}

export default GlobalWithAccessControl
```

The following options are available:

| Function | Allows/Denies Access |
|----------|---------------------|
| read | Used in the findOne Global operation. More details. |
| update | Used in the update Global operation. More details. |

If a Global supports Versions, the following additional options are available:

| Function | Allows/Denies Access |
|----------|---------------------|
| readVersions | Used to control who can read versions, and who can't. Will automatically restrict the Admin UI version viewing access. More details. |

### Read

Returns a boolean result or optionally a query constraint which limits who can read this global based on its current properties.

To add read Access Control to a Global, use the access property in the Global Config:

```typescript
import { GlobalConfig } from 'payload'

const Header: GlobalConfig = {
  // ...
  access: {
    read: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

The following arguments are provided to the read function:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user. |

### Update

Returns a boolean result or optionally a query constraint which limits who can update this global based on its current properties.

To add update Access Control to a Global, use the access property in the Global Config:

```typescript
import { GlobalConfig } from 'payload'

const Header: GlobalConfig = {
  // ...
  access: {
    update: ({ req: { user }, data }) => {
      return Boolean(user)
    },
  },
}
```

The following arguments are provided to the update function:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user. |
| data | The data passed to update the global with. |

### Read Versions

If the Global has Versions enabled, the readVersions Access Control function determines whether or not the currently logged in user can access the version history of a Document.

To add Read Versions Access Control to a Collection, use the readVersions property in the Global Config:

```typescript
import type { GlobalConfig } from 'payload'

export const GlobalWithVersionsAccess: GlobalConfig = {
  // ...
  access: {
    readVersions: ({ req: { user } }) => {
      return Boolean(user)
    },
  },
}
```

The following arguments are provided to the readVersions function:

| Option | Description |
|--------|-------------|
| req | The Request object containing the currently authenticated user. |