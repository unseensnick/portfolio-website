# Payload Hooks Overview

Hooks allow you to execute your own side effects during specific events of the Document lifecycle. They allow you to do things like mutate data, perform business logic, integrate with third-parties, or anything else, all during precise moments within your application.

With Hooks, you can transform Payload from a traditional CMS into a fully-fledged application framework.

## Use Cases

There are many use cases for Hooks, including:

- Modify data before it is read or updated
- Encrypt and decrypt sensitive data
- Integrate with a third-party CRM like HubSpot or Salesforce
- Send a copy of uploaded files to Amazon S3 or similar
- Process orders through a payment provider like Stripe
- Send emails when contact forms are submitted
- Track data ownership or changes over time

## Types of Hooks

There are four main types of Hooks in Payload:

1. **Root Hooks** - Not associated with any specific Collection, Global, or Field
2. **Collection Hooks** - Run on Documents within a specific Collection
3. **Global Hooks** - Run on Global Documents
4. **Field Hooks** - Run on Documents on a per-field basis

> **Note:** Payload also ships a set of React hooks for frontend applications. Although they share a common name, these are very different things and should not be confused.

## Root Hooks

Root Hooks are useful for globally-oriented side effects, such as when an error occurs at the application level.

To add Root Hooks, use the `hooks` property in your Payload Config:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  hooks: {
    afterError: [() => {...}]
  },
})
```

### afterError

The afterError Hook is triggered when an error occurs in the Payload application. This can be useful for logging errors to a third-party service, sending an email to the development team, logging the error to Sentry or DataDog, etc.

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  hooks: {
    afterError: [
      async ({ error }) => {
        // Do something
      },
    ],
  },
})
```

**Arguments provided to afterError Hook:**

| Argument | Description |
|----------|-------------|
| error | The error that occurred |
| context | Custom context passed between Hooks |
| graphqlResult | The GraphQL result object, available if executed within a GraphQL context |
| req | The PayloadRequest object that extends Web Request |
| collection | The Collection in which this Hook is running against (undefined if executed from non-collection endpoint) |
| result | The formatted error result object, available if executed from a REST context |

## Execution Types

### Asynchronous vs. Synchronous

All Hooks can be written as either synchronous or asynchronous functions. Choosing the right type depends on your use case.

#### Asynchronous
- Use when the Hook should modify data and relies on asynchronous actions (e.g., fetching from third party)
- Ensures your Hook completes before the operation's lifecycle continues
- Async hooks are run in series - second hook waits for first to complete

#### Synchronous
- Use when your Hook simply performs a side-effect, such as mutating document data
- The Payload operation does not have to wait for your hook to complete

> **Tip:** If your hook executes a long-running task that doesn't affect the response, consider offloading it to the job queue.

## Server-only Execution

Hooks are only triggered on the server and are automatically excluded from the client-side bundle. This means you can safely use sensitive business logic in your Hooks without worrying about exposing it to the client.

## Performance Considerations

Hooks are powerful but some hooks run very often and can add significant overhead if not optimized.

### Writing Efficient Hooks

Consider when hooks are run. Avoid putting expensive logic in hooks that run frequently:

```typescript
// ❌ Avoid - runs on every read request
{
  hooks: {
    beforeRead: [
      async () => {
        await doSomethingExpensive() // Don't do this
        return data
      },
    ],
  },
}

// ✅ Better - only runs when document is created or updated
{
  hooks: {
    beforeChange: [
      async ({ context }) => {
        await doSomethingExpensive() // More acceptable here
        // ...
      },
    ]
  },
}
```

### Using Hook Context

Use Hook Context to prevent infinite loops or avoid repeating expensive operations across multiple hooks in the same request:

```typescript
{
  hooks: {
    beforeChange: [
      async ({ context }) => {
        const somethingExpensive = await doSomethingExpensive()
        context.somethingExpensive = somethingExpensive
        // ...
      },
    ],
  },
}
```

### Offloading to Jobs Queue

If your hooks perform long-running tasks that don't directly affect request lifecycle, consider offloading them to the jobs queue:

```typescript
{
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Offload to job queue
        await req.payload.jobs.queue(...)
        // ...
      },
    ],
  },
}
```

## Performance Tips

When building hooks, combine as many of these strategies as possible:

1. **Consider execution frequency** - Avoid expensive logic in frequently-run hooks
2. **Use Hook Context** - Share data and prevent infinite loops
3. **Offload long-running tasks** - Use job queue for tasks that don't affect response
4. **Choose appropriate execution type** - Async vs sync based on requirements

For more performance tips, see the Performance documentation.