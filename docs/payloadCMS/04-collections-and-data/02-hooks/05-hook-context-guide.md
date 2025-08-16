# Hook Context Guide

The context object is used to share data across different Hooks. This persists throughout the entire lifecycle of a request and is available within every Hook. By setting properties to `req.context`, you can effectively share logic across multiple Hooks.

## When To Use Context

Context gives you a way forward on otherwise difficult problems such as:

- **Passing data between Hooks**: Needing data in multiple Hooks from a 3rd party API, it could be retrieved and used in beforeChange and later used again in an afterChange hook without having to fetch it twice.
- **Preventing infinite loops**: Calling `payload.update()` on the same document that triggered an afterChange hook will create an infinite loop, control the flow by assigning a no-op condition to context
- **Passing data to Local API**: Setting values on the `req.context` and pass it to `payload.create()` you can provide additional data to hooks without adding extraneous fields.
- **Passing data between hooks and middleware or custom endpoints**: Hooks could set context across multiple collections and then be used in a final postMiddleware.

## How To Use Context

Let's see examples on how context can be used in the first two scenarios mentioned above:

### Passing Data Between Hooks

To pass data between hooks, you can assign values to context in an earlier hook in the lifecycle of a request and expect it in the context of a later hook.

For example:

```typescript
import type { CollectionConfig } from 'payload'

const Customer: CollectionConfig = {
  slug: 'customers',
  hooks: {
    beforeChange: [
      async ({ context, data }) => {
        // assign the customerData to context for use later
        context.customerData = await fetchCustomerData(data.customerID)
        return {
          ...data,
          // some data we use here
          name: context.customerData.name,
        }
      },
    ],
    afterChange: [
      async ({ context, doc, req }) => {
        // use context.customerData without needing to fetch it again
        if (context.customerData.contacted === false) {
          createTodo('Call Customer', context.customerData)
        }
      },
    ],
  },
  fields: [
    /* ... */
  ],
}
```

### Preventing Infinite Loops

Let's say you have an afterChange hook, and you want to do a calculation inside the hook (as the document ID needed for the calculation is available in the afterChange hook, but not in the beforeChange hook). Once that's done, you want to update the document with the result of the calculation.

**Bad example:**

```typescript
import type { CollectionConfig } from 'payload'

const Customer: CollectionConfig = {
  slug: 'customers',
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        await req.payload.update({
          // DANGER: updating the same slug as the collection in an afterChange will create an infinite loop!
          collection: 'customers',
          id: doc.id,
          data: {
            ...(await fetchCustomerData(data.customerID)),
          },
        })
      },
    ],
  },
  fields: [
    /* ... */
  ],
}
```

Instead of the above, we need to tell the afterChange hook to not run again if it performs the update (and thus not update itself again). We can solve that with context.

**Fixed example:**

```typescript
import type { CollectionConfig } from 'payload'

const MyCollection: CollectionConfig = {
  slug: 'slug',
  hooks: {
    afterChange: [
      async ({ context, doc, req }) => {
        // return if flag was previously set
        if (context.triggerAfterChange === false) {
          return
        }
        await req.payload.update({
          collection: contextHooksSlug,
          id: doc.id,
          data: {
            ...(await fetchCustomerData(data.customerID)),
          },
          context: {
            // set a flag to prevent from running again
            triggerAfterChange: false,
          },
        })
      },
    ],
  },
  fields: [
    /* ... */
  ],
}
```

## TypeScript

The default TypeScript interface for context is `{ [key: string]: unknown }`. If you prefer a more strict typing in your project or when authoring plugins for others, you can override this using the declare module syntax.

This is known as module augmentation / declaration merging, a TypeScript feature which allows us to add properties to existing types. Simply put this in any `.ts` or `.d.ts` file:

```typescript
declare module 'payload' {
  // Augment the RequestContext interface to include your custom properties
  export interface RequestContext {
    myObject?: string
    // ...
  }
}
```

This will add the property `myObject` with a type of `string` to every context object. Make sure to follow this example correctly, as module augmentation can mess up your types if you do it wrong.

## Advanced Examples

### Sharing Expensive Operations

```typescript
import type { CollectionConfig } from 'payload'

const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    beforeChange: [
      async ({ context, data, req }) => {
        // Only fetch analytics data once per request
        if (!context.analyticsData && data.trackAnalytics) {
          context.analyticsData = await fetchAnalyticsData(data.slug)
        }
        
        // Use the data immediately
        if (context.analyticsData) {
          data.viewCount = context.analyticsData.views
        }
        
        return data
      },
    ],
    afterChange: [
      async ({ context, doc, req }) => {
        // Reuse the same analytics data without fetching again
        if (context.analyticsData && context.analyticsData.trending) {
          await req.payload.create({
            collection: 'notifications',
            data: {
              message: `Post "${doc.title}" is trending!`,
              postId: doc.id,
            },
          })
        }
      },
    ],
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
    },
    {
      name: 'trackAnalytics',
      type: 'checkbox',
    },
    {
      name: 'viewCount',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
  ],
}
```

### Cross-Collection Context

```typescript
import type { CollectionConfig } from 'payload'

const Orders: CollectionConfig = {
  slug: 'orders',
  hooks: {
    afterChange: [
      async ({ context, doc, req, operation }) => {
        if (operation === 'create') {
          // Set context for use in other collections
          context.newOrderId = doc.id
          context.customerEmail = doc.customerEmail
          
          // Update customer record
          await req.payload.update({
            collection: 'customers',
            where: {
              email: {
                equals: doc.customerEmail,
              },
            },
            data: {
              lastOrderDate: new Date(),
            },
            context: {
              // Pass along the order context
              fromOrderCreation: true,
              orderId: doc.id,
            },
          })
        }
      },
    ],
  ],
  fields: [
    {
      name: 'customerEmail',
      type: 'email',
    },
    {
      name: 'total',
      type: 'number',
    },
  ],
}

const Customers: CollectionConfig = {
  slug: 'customers',
  hooks: {
    afterChange: [
      async ({ context, doc, req }) => {
        // Only run loyalty logic when triggered from order creation
        if (context.fromOrderCreation && context.orderId) {
          // Award loyalty points
          const order = await req.payload.findByID({
            collection: 'orders',
            id: context.orderId,
          })
          
          const pointsEarned = Math.floor(order.total / 10)
          
          await req.payload.update({
            collection: 'customers',
            id: doc.id,
            data: {
              loyaltyPoints: (doc.loyaltyPoints || 0) + pointsEarned,
            },
            context: {
              // Prevent infinite loop
              skipLoyaltyUpdate: true,
            },
          })
        }
      },
    ],
  ],
  fields: [
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'lastOrderDate',
      type: 'date',
    },
    {
      name: 'loyaltyPoints',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
```

### Field-Level Context Usage

```typescript
import type { Field } from 'payload'

const passwordField: Field = {
  name: 'password',
  type: 'text',
  hooks: {
    beforeChange: [
      async ({ value, context, operation }) => {
        // Only hash password if it's actually changing
        if (operation === 'update' && !context.passwordChanged) {
          return value // Return existing hashed password
        }
        
        // Hash the password and mark it as changed
        const hashedPassword = await hashPassword(value)
        context.passwordChanged = true
        context.passwordHash = hashedPassword
        
        return hashedPassword
      },
    ],
    afterChange: [
      async ({ context, req, siblingData }) => {
        // Send email notification only if password was actually changed
        if (context.passwordChanged) {
          await sendPasswordChangeNotification(siblingData.email)
        }
      },
    ],
  },
}
```

## Best Practices

1. **Use descriptive names**: Choose clear, descriptive names for your context properties to avoid conflicts.

2. **Check for existing values**: Always check if a context value already exists before setting it to avoid overriding important data.

3. **Clean up when done**: While context is request-scoped, consider clearing large objects when no longer needed.

4. **Type your context**: Use module augmentation to add proper TypeScript types for better developer experience.

5. **Document your context usage**: When working in teams, document what context properties your hooks use and set.

6. **Avoid deep nesting**: Keep context structure flat when possible for easier debugging and maintenance.

```typescript
// ✅ Good
context.customerData = { id: 1, name: 'John' }
context.orderTotal = 100

// ❌ Avoid deep nesting
context.data.customer.info.details = { name: 'John' }
```