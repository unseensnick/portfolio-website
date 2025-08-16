# Collection Hooks Reference

Collection Hooks are Hooks that run on Documents within a specific Collection. They allow you to execute your own logic during specific events of the Document lifecycle.

## Configuration

To add Hooks to a Collection, use the `hooks` property in your Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const CollectionWithHooks: CollectionConfig = {
  // ...
  hooks: {
    beforeOperation: [(args) => {...}],
    beforeValidate: [(args) => {...}],
    beforeDelete: [(args) => {...}],
    beforeChange: [(args) => {...}],
    beforeRead: [(args) => {...}],
    afterChange: [(args) => {...}],
    afterRead: [(args) => {...}],
    afterDelete: [(args) => {...}],
    afterOperation: [(args) => {...}],
    afterError: [(args) => {...}],

    // Auth-enabled Hooks
    beforeLogin: [(args) => {...}],
    afterLogin: [(args) => {...}],
    afterLogout: [(args) => {...}],
    afterRefresh: [(args) => {...}],
    afterMe: [(args) => {...}],
    afterForgotPassword: [(args) => {...}],
    refresh: [(args) => {...}],
    me: [(args) => {...}],
  },
}
```

> **Tip:** You can also set hooks on the field-level to isolate hook logic to specific fields.

## Config Options

All Collection Hooks accept an array of synchronous or asynchronous functions. Each Collection Hook receives specific arguments based on its own type, and has the ability to modify specific outputs.

## Core Hooks

### beforeOperation

The beforeOperation hook can be used to modify the arguments that operations accept or execute side-effects that run before an operation begins.

Available Collection operations include: `create`, `read`, `update`, `delete`, `login`, `refresh`, and `forgotPassword`.

```typescript
import type { CollectionBeforeOperationHook } from 'payload'

const beforeOperationHook: CollectionBeforeOperationHook = async ({
  args,
  operation,
  req,
}) => {
  return args // return modified operation arguments as necessary
}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between Hooks |
| operation | The name of the operation that this hook is running within |
| req | The Web Request object (mocked for Local API operations) |

### beforeValidate

Runs during the `create` and `update` operations. This hook allows you to add or format data before the incoming data is validated server-side.

**Note:** This does not run before client-side validation. Validation order:
1. `validate` runs on the client
2. if successful, `beforeValidate` runs on the server
3. `validate` runs on the server

```typescript
import type { CollectionBeforeValidateHook } from 'payload'

const beforeValidateHook: CollectionBeforeValidateHook = async ({ data }) => {
  return data
}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between Hooks |
| data | The incoming data passed through the operation |
| operation | The name of the operation that this hook is running within |
| originalDoc | The Document before changes are applied |
| req | The Web Request object (mocked for Local API operations) |

### beforeChange

Immediately before validation, beforeChange hooks will run during `create` and `update` operations. At this stage, the data should be treated as unvalidated user input. You can optionally modify the shape of the data to be saved.

```typescript
import type { CollectionBeforeChangeHook } from 'payload'

const beforeChangeHook: CollectionBeforeChangeHook = async ({ data }) => {
  return data
}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |
| data | The incoming data passed through the operation |
| operation | The name of the operation that this hook is running within |
| originalDoc | The Document before changes are applied |
| req | The Web Request object (mocked for Local API operations) |

### afterChange

After a document is created or updated, the afterChange hook runs. This hook is helpful to recalculate statistics such as total sales within a global, syncing user profile changes to a CRM, and more.

```typescript
import type { CollectionAfterChangeHook } from 'payload'

const afterChangeHook: CollectionAfterChangeHook = async ({ doc }) => {
  return doc
}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |
| data | The incoming data passed through the operation |
| doc | The resulting Document after changes are applied |
| operation | The name of the operation that this hook is running within |
| previousDoc | The Document before changes were applied |
| req | The Web Request object (mocked for Local API operations) |

### beforeRead

Runs before `find` and `findByID` operations are transformed for output by afterRead. This hook fires before hidden fields are removed and before localized fields are flattened into the requested locale. Using this Hook will provide you with all locales and all hidden fields via the doc argument.

```typescript
import type { CollectionBeforeReadHook } from 'payload'

const beforeReadHook: CollectionBeforeReadHook = async ({ doc }) => {
  return doc
}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |
| doc | The resulting Document after changes are applied |
| query | The Query of the request |
| req | The Web Request object (mocked for Local API operations) |

### afterRead

Runs as the last step before documents are returned. Flattens locales, hides protected fields, and removes fields that users do not have access to.

```typescript
import type { CollectionAfterReadHook } from 'payload'

const afterReadHook: CollectionAfterReadHook = async ({ doc }) => {
  return doc
}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |
| doc | The resulting Document after changes are applied |
| query | The Query of the request |
| req | The Web Request object (mocked for Local API operations) |

## Delete Hooks

### beforeDelete

Runs before the delete operation. Returned values are discarded.

```typescript
import type { CollectionBeforeDeleteHook } from 'payload';

const beforeDeleteHook: CollectionBeforeDeleteHook = async ({
  req,
  id,
}) => {...}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |
| id | The ID of the Document being deleted |
| req | The Web Request object (mocked for Local API operations) |

### afterDelete

Runs immediately after the delete operation removes records from the database. Returned values are discarded.

```typescript
import type { CollectionAfterDeleteHook } from 'payload';

const afterDeleteHook: CollectionAfterDeleteHook = async ({
  req,
  id,
  doc,
}) => {...}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |
| doc | The resulting Document after changes are applied |
| id | The ID of the Document that was deleted |
| req | The Web Request object (mocked for Local API operations) |

## Operation Hooks

### afterOperation

The afterOperation hook can be used to modify the result of operations or execute side-effects that run after an operation has completed.

Available Collection operations include: `create`, `find`, `findByID`, `update`, `updateByID`, `delete`, `deleteByID`, `login`, `refresh`, and `forgotPassword`.

```typescript
import type { CollectionAfterOperationHook } from 'payload'

const afterOperationHook: CollectionAfterOperationHook = async ({ result }) => {
  return result
}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| args | The arguments passed into the operation |
| collection | The Collection in which this Hook is running against |
| req | The Web Request object (mocked for Local API operations) |
| operation | The name of the operation that this hook is running within |
| result | The result of the operation, before modifications |

### afterError

The afterError Hook is triggered when an error occurs in the Payload application. This can be useful for logging errors to a third-party service, sending an email to the development team, logging the error to Sentry or DataDog, etc.

```typescript
import type { CollectionAfterErrorHook } from 'payload';

const afterErrorHook: CollectionAfterErrorHook = async ({
  req,
  id,
  doc,
}) => {...}
```

**Arguments:**

| Argument | Description |
|----------|-------------|
| error | The error that occurred |
| context | Custom context passed between Hooks |
| graphqlResult | The GraphQL result object, available if executed within a GraphQL context |
| req | The PayloadRequest object that extends Web Request |
| collection | The Collection in which this Hook is running against |
| result | The formatted error result object, available if executed from a REST context |

## Authentication Hooks

For Auth-enabled Collections, the following hooks are available:

### beforeLogin

Runs during login operations where a user with the provided credentials exist, but before a token is generated and added to the response. You can optionally modify the user that is returned, or throw an error to deny the login operation.

```typescript
import type { CollectionBeforeLoginHook } from 'payload'

const beforeLoginHook: CollectionBeforeLoginHook = async ({ user }) => {
  return user
}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |
| req | The Web Request object (mocked for Local API operations) |
| user | The user being logged in |

### afterLogin

Runs after successful login operations. You can optionally modify the user that is returned.

```typescript
import type { CollectionAfterLoginHook } from 'payload';

const afterLoginHook: CollectionAfterLoginHook = async ({
  user,
  token,
}) => {...}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |
| req | The Web Request object (mocked for Local API operations) |
| token | The token generated for the user |
| user | The user being logged in |

### afterLogout

Runs after logout operations.

```typescript
import type { CollectionAfterLogoutHook } from 'payload';

const afterLogoutHook: CollectionAfterLogoutHook = async ({
  req,
}) => {...}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |
| req | The Web Request object (mocked for Local API operations) |

### afterMe

Runs after me operations.

```typescript
import type { CollectionAfterMeHook } from 'payload';

const afterMeHook: CollectionAfterMeHook = async ({
  req,
  response,
}) => {...}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |
| req | The Web Request object (mocked for Local API operations) |
| response | The response to return |

### afterRefresh

Runs after refresh operations.

```typescript
import type { CollectionAfterRefreshHook } from 'payload';

const afterRefreshHook: CollectionAfterRefreshHook = async ({
  token,
}) => {...}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |
| exp | The expiration time of the token |
| req | The Web Request object (mocked for Local API operations) |
| token | The newly refreshed user token |

### afterForgotPassword

Runs after successful forgotPassword operations. Returned values are discarded.

```typescript
import type { CollectionAfterForgotPasswordHook } from 'payload'

const afterForgotPasswordHook: CollectionAfterForgotPasswordHook = async ({
  args,
  context,
  collection,
}) => {...}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| args | The arguments passed into the operation |
| collection | The Collection in which this Hook is running against |
| context | Custom context passed between hooks |

## Custom Operation Hooks

### refresh

Allows you to optionally replace the default behavior of the refresh operation with your own. If you return a value from your hook, the operation will not perform its own logic and continue.

```typescript
import type { CollectionRefreshHook } from 'payload'

const myRefreshHook: CollectionRefreshHook = async ({
  args,
  user,
}) => {...}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| args | The arguments passed into the operation |
| user | The user being logged in |

### me

Allows you to optionally replace the default behavior of the me operation with your own. If you return a value from your hook, the operation will not perform its own logic and continue.

```typescript
import type { CollectionMeHook } from 'payload'

const meHook: CollectionMeHook = async ({
  args,
  user,
}) => {...}
```

**Arguments:**

| Option | Description |
|--------|-------------|
| args | The arguments passed into the operation |
| user | The user being logged in |

## TypeScript

Payload exports a type for each Collection hook:

```typescript
import type {
  CollectionBeforeOperationHook,
  CollectionBeforeValidateHook,
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
  CollectionAfterReadHook,
  CollectionBeforeReadHook,
  CollectionBeforeDeleteHook,
  CollectionAfterDeleteHook,
  CollectionBeforeLoginHook,
  CollectionAfterLoginHook,
  CollectionAfterLogoutHook,
  CollectionAfterRefreshHook,
  CollectionAfterMeHook,
  CollectionAfterForgotPasswordHook,
  CollectionRefreshHook,
  CollectionMeHook,
} from 'payload'
```