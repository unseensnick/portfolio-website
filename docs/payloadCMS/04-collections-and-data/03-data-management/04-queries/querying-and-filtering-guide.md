# Payload CMS Querying Documentation

## Overview

In Payload, "querying" means filtering or searching through Documents within a Collection. The querying language in Payload is designed to be simple and powerful, allowing you to filter Documents with extreme precision through an intuitive and standardized structure.

Payload provides three common APIs for querying your data:

- **Local API** - Extremely fast, direct-to-database access
- **REST API** - Standard HTTP endpoints for querying and mutating data
- **GraphQL** - A full GraphQL API with a GraphQL Playground

Each of these APIs share the same underlying querying language, and fully support all of the same features. This means that you can learn Payload's querying language once, and use it across any of the APIs that you might use.

To query your Documents, you can send any number of Operators through your request:

```typescript
import type { Where } from 'payload'

const query: Where = {
  color: {
    equals: 'blue',
  },
}
```

The exact query syntax will depend on the API you are using, but the concepts are the same across all APIs.

**Tip:** You can also use queries within Access Control functions.

## Query Operators

The following operators are available for use in queries:

| Operator | Description |
|----------|-------------|
| `equals` | The value must be exactly equal. |
| `not_equals` | The query will return all documents where the value is not equal. |
| `greater_than` | For numeric or date-based fields. |
| `greater_than_equal` | For numeric or date-based fields. |
| `less_than` | For numeric or date-based fields. |
| `less_than_equal` | For numeric or date-based fields. |
| `like` | Case-insensitive string must be present. If string of words, all words must be present, in any order. |
| `contains` | Must contain the value entered, case-insensitive. |
| `in` | The value must be found within the provided comma-delimited list of values. |
| `not_in` | The value must NOT be within the provided comma-delimited list of values. |
| `all` | The value must contain all values provided in the comma-delimited list. Note: currently this operator is supported only with the MongoDB adapter. |
| `exists` | Only return documents where the value either exists (true) or does not exist (false). |
| `near` | For distance related to a Point Field comma separated as `<longitude>, <latitude>, <maxDistance in meters (nullable)>, <minDistance in meters (nullable)>`. |
| `within` | For Point Fields to filter documents based on whether points are inside of the given area defined in GeoJSON. |
| `intersects` | For Point Fields to filter documents based on whether points intersect with the given area defined in GeoJSON. |

**Tip:** If you know your users will be querying on certain fields a lot, add `index: true` to the Field Config. This will speed up searches using that field immensely.

## And / Or Logic

In addition to defining simple queries, you can join multiple queries together using AND / OR logic. These can be nested as deeply as you need to create complex queries.

To join queries, use the `and` or `or` keys in your query object:

```typescript
import type { Where } from 'payload'

const query: Where = {
  or: [
    {
      color: {
        equals: 'mint',
      },
    },
    {
      and: [
        {
          color: {
            equals: 'white',
          },
        },
        {
          featured: {
            equals: false,
          },
        },
      ],
    },
  ],
}
```

Written in plain English, if the above query were passed to a find operation, it would translate to finding posts where either the color is mint OR the color is white AND featured is set to false.

## Nested Properties

When working with nested properties, which can happen when using relational fields, it is possible to use the dot notation to access the nested property. For example, when working with a Song collection that has a `artists` field which is related to an Artists collection using the `name: 'artists'`. You can access a property within the collection Artists like so:

```typescript
import type { Where } from 'payload'

const query: Where = {
  'artists.featured': {
    // nested property name to filter on
    exists: true, // operator to use and boolean value that needs to be true
  },
}
```

## Writing Queries

Writing queries in Payload is simple and consistent across all APIs, with only minor differences in syntax between them.

### Local API

The Local API supports the find operation that accepts a raw query object:

```typescript
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    where: {
      color: {
        equals: 'mint',
      },
    },
  })

  return posts
}
```

### GraphQL API

All find queries in the GraphQL API support the where argument that accepts a raw query object:

```graphql
query {
  Posts(where: { color: { equals: mint } }) {
    docs {
      color
    }
    totalDocs
  }
}
```

### REST API

With the REST API, you can use the full power of Payload queries, but they are written as query strings instead:

```
https://localhost:3000/api/posts?where[color][equals]=mint
```

To understand the syntax, you need to understand that complex URL search strings are parsed into a JSON object. This one isn't too bad, but more complex queries get unavoidably more difficult to write.

For this reason, we recommend to use the extremely helpful and ubiquitous `qs-esm` package to parse your JSON / object-formatted queries into query strings:

```typescript
import { stringify } from 'qs-esm'
import type { Where } from 'payload'

const query: Where = {
  color: {
    equals: 'mint',
  },
  // This query could be much more complex
  // and qs-esm would handle it beautifully
}

const getPosts = async () => {
  const stringifiedQuery = stringify(
    {
      where: query, // ensure that `qs-esm` adds the `where` property, too!
    },
    { addQueryPrefix: true },
  )

  const response = await fetch(
    `http://localhost:3000/api/posts${stringifiedQuery}`,
  )
  // Continue to handle the response below...
}
```

## Pagination

With Pagination you can limit the number of documents returned per page, and get a specific page of results. This is useful for creating paginated lists of documents within your application.

All paginated responses include documents nested within a `docs` array, and return top-level meta data related to pagination such as `totalDocs`, `limit`, `totalPages`, `page`, and more.

**Note:** Collection find queries are paginated automatically.

### Options

All Payload APIs support the pagination controls below. With them, you can create paginated lists of documents within your application:

| Control | Default | Description |
|---------|---------|-------------|
| `limit` | 10 | Limits the number of documents returned per page. |
| `pagination` | true | Set to false to disable pagination and return all documents. |
| `page` | 1 | Get a specific page number. |

### Local API

To specify pagination controls in the Local API, you can use the `limit`, `page`, and `pagination` options in your query:

```typescript
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    limit: 10,
    page: 2,
  })

  return posts
}
```

### REST API

With the REST API, you can use the pagination controls below as query strings:

```javascript
fetch('https://localhost:3000/api/posts?limit=10&page=2')
  .then((res) => res.json())
  .then((data) => console.log(data))
```

### Response

All paginated responses include documents nested within a `docs` array, and return top-level meta data related to pagination.

The find operation includes the following properties in its response:

| Property | Description |
|----------|-------------|
| `docs` | Array of documents in the collection |
| `totalDocs` | Total available documents within the collection |
| `limit` | Limit query parameter - defaults to 10 |
| `totalPages` | Total pages available, based upon the limit queried for |
| `page` | Current page number |
| `pagingCounter` | number of the first doc on the current page |
| `hasPrevPage` | true/false if previous page exists |
| `hasNextPage` | true/false if next page exists |
| `prevPage` | number of previous page, null if it doesn't exist |
| `nextPage` | number of next page, null if it doesn't exist |

Example response:

```json
{
  // Document Array 
  "docs": [
    {
      "title": "Page Title",
      "description": "Some description text",
      "priority": 1,
      "createdAt": "2020-10-17T01:19:29.858Z",
      "updatedAt": "2020-10-17T01:19:29.858Z",
      "id": "5f8a46a1dd05db75c3c64760"
    }
  ],
  // Metadata 
  "totalDocs": 6,
  "limit": 1,
  "totalPages": 6,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

### Limit

You can specify a limit to restrict the number of documents returned per page.

**Reminder:** By default, any query with `limit: 0` will automatically disable pagination.

#### Performance benefits

If you are querying for a specific document and can reliably expect only one document to match, you can set a limit of 1 (or another low number) to reduce the number of database lookups and improve performance.

For example, when querying a document by a unique field such as slug, you can set the limit to 1 since you know there will only be one document with that slug.

To do this, set the limit option in your query:

```typescript
await payload.find({
  collection: 'posts',
  where: {
    slug: {
      equals: 'post-1',
    },
  },
  limit: 1,
})
```

### Disabling pagination

Disabling pagination can improve performance by reducing the overhead of pagination calculations and improve query speed.

For find operations within the Local API, you can disable pagination to retrieve all documents from a collection by passing `pagination: false` to the find local operation.

To do this, set `pagination: false` in your query:

```typescript
import type { Payload } from 'payload'

const getPost = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    where: {
      title: { equals: 'My Post' },
    },
    pagination: false,
  })

  return posts
}
```

## Select

By default, Payload's APIs will return all fields for a given collection or global. But, you may not need all of that data for all of your queries. Sometimes, you might want just a few fields from the response.

With the Select API, you can define exactly which fields you'd like to retrieve. This can impact the performance of your queries by affecting the load on the database and the size of the response.

### Local API

To specify select in the Local API, you can use the `select` option in your query:

```typescript
import type { Payload } from 'payload'

// Include mode
const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    select: {
      text: true,
      // select a specific field from group
      group: {
        number: true,
      },
      // select all fields from array
      array: true,
    },
  })

  return posts
}

// Exclude mode
const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    // Select everything except for array and group.number
    select: {
      array: false,
      group: {
        number: false,
      },
    },
  })

  return posts
}
```

**Important:** To perform querying with select efficiently, Payload implements your select query on the database level. Because of that, your beforeRead and afterRead hooks may not receive the full doc. To ensure that some fields are always selected for your hooks / access control, regardless of the select query you can use `forceSelect` collection config property.

### REST API

To specify select in the REST API, you can use the `select` parameter in your query:

```javascript
fetch(
  'https://localhost:3000/api/posts?select[color]=true&select[group][number]=true',
)
  .then((res) => res.json())
  .then((data) => console.log(data))
```

To understand the syntax, you need to understand that complex URL search strings are parsed into a JSON object. This one isn't too bad, but more complex queries get unavoidably more difficult to write.

For this reason, we recommend to use the extremely helpful and ubiquitous `qs-esm` package to parse your JSON / object-formatted queries into query strings:

```typescript
import { stringify } from 'qs-esm'
import type { Where } from 'payload'

const select: Where = {
  text: true,
  group: {
    number: true,
  },
  // This query could be much more complex
  // and QS would handle it beautifully
}

const getPosts = async () => {
  const stringifiedQuery = stringify(
    {
      select, // ensure that `qs` adds the `select` property, too!
    },
    { addQueryPrefix: true },
  )

  const response = await fetch(
    `http://localhost:3000/api/posts${stringifiedQuery}`,
  )
  // Continue to handle the response below...
}
```

**Reminder:** This is the same for Globals using the `/api/globals` endpoint.

### defaultPopulate collection config property

The `defaultPopulate` property allows you specify which fields to select when populating the collection from another document. This is especially useful for links where only the slug is needed instead of the entire document.

With this feature, you can dramatically reduce the amount of JSON that is populated from Relationship or Upload fields.

For example, in your content model, you might have a Link field which links out to a different page. When you go to retrieve these links, you really only need the slug of the page.

Loading all of the page content, its related links, and everything else is going to be overkill and will bog down your Payload APIs. Instead, you can define the `defaultPopulate` property on your Pages collection, so that when Payload "populates" a related Page, it only selects the slug field and therefore returns significantly less JSON:

```typescript
import type { CollectionConfig } from 'payload'

// The TSlug generic can be passed to have type safety for `defaultPopulate`.
// If avoided, the `defaultPopulate` type resolves to `SelectType`.
export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  // Specify `select`.
  defaultPopulate: {
    slug: true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
  ],
}
```

**Important:** When using `defaultPopulate` on a collection with Uploads enabled and you want to select the `url` field, it is important to specify `filename: true` as well, otherwise Payload will not be able to construct the correct file URL, instead returning `url: null`.

### Populate

Setting `defaultPopulate` will enforce that each time Payload performs a "population" of a related document, only the fields specified will be queried and returned. However, you can override `defaultPopulate` with the `populate` property in the Local and REST API:

**Local API:**

```typescript
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    populate: {
      // Select only `text` from populated docs in the "pages" collection
      // Now, no matter what the `defaultPopulate` is set to on the "pages" collection,
      // it will be overridden, and the `text` field will be returned instead.
      pages: {
        text: true,
      }, 
    },
  })

  return posts
}
```

**REST API:**

```javascript
fetch('https://localhost:3000/api/posts?populate[pages][text]=true') 
  .then((res) => res.json())
  .then((data) => console.log(data))
```

## Sort

Documents in Payload can be easily sorted by a specific Field. When querying Documents, you can pass the name of any top-level field, and the response will sort the Documents by that field in ascending order.

If prefixed with a minus symbol ("-"), they will be sorted in descending order. In Local API multiple fields can be specified by using an array of strings. In REST API multiple fields can be specified by separating fields with comma. The minus symbol can be in front of individual fields.

Because sorting is handled by the database, the field cannot be a Virtual Field unless it's linked with a relationship field. It must be stored in the database to be searchable.

**Tip:** For performance reasons, it is recommended to enable `index: true` for the fields that will be sorted upon.

### Local API

To sort Documents in the Local API, you can use the `sort` option in your query:

```typescript
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    sort: '-createdAt', 
  })

  return posts
}
```

To sort by multiple fields, you can use the sort option with fields in an array:

```typescript
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    sort: ['priority', '-createdAt'], 
  })

  return posts
}
```

### REST API

To sort in the REST API, you can use the `sort` parameter in your query:

```javascript
fetch('https://localhost:3000/api/posts?sort=-createdAt') 
  .then((response) => response.json())
  .then((data) => console.log(data))
```

To sort by multiple fields, you can use the sort parameter with fields separated by comma:

```javascript
fetch('https://localhost:3000/api/posts?sort=priority,-createdAt') 
  .then((response) => response.json())
  .then((data) => console.log(data))
```

### GraphQL API

To sort in the GraphQL API, you can use the `sort` parameter in your query:

```graphql
query {
  Posts(sort: "-createdAt") {
    docs {
      color
    }
  }
}
```

## Depth

Documents in Payload can have relationships to other Documents. This is true for both Collections as well as Globals. When you query a Document, you can specify the depth at which to populate any of its related Documents either as full objects, or only their IDs.

Since Documents can be infinitely nested or recursively related, it's important to be able to control how deep your API populates. Depth can impact the performance of your queries by affecting the load on the database and the size of the response.

For example, when you specify a depth of 0, the API response might look like this:

```json
{
  "id": "5ae8f9bde69e394e717c8832",
  "title": "This is a great post",
  "author": "5f7dd05cd50d4005f8bcab17"
}
```

But with a depth of 1, the response might look like this:

```json
{
  "id": "5ae8f9bde69e394e717c8832",
  "title": "This is a great post",
  "author": {
    "id": "5f7dd05cd50d4005f8bcab17",
    "name": "John Doe"
  }
}
```

**Important:** Depth has no effect in the GraphQL API, because there, depth is based on the shape of your queries.

### Local API

To specify depth in the Local API, you can use the `depth` option in your query:

```typescript
import type { Payload } from 'payload'

const getPosts = async (payload: Payload) => {
  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
  })

  return posts
}
```

**Reminder:** This is the same for Globals using the `findGlobal` operation.

### REST API

To specify depth in the REST API, you can use the `depth` parameter in your query:

```javascript
fetch('https://localhost:3000/api/posts?depth=2')
  .then((res) => res.json())
  .then((data) => console.log(data))
```

**Reminder:** This is the same for Globals using the `/api/globals` endpoint.

### Default Depth

If no depth is specified in the request, Payload will use its default depth for all requests. By default, this is set to 2.

To change the default depth on the application level, you can use the `defaultDepth` option in your root Payload config:

```typescript
import { buildConfig } from 'payload/config'

export default buildConfig({
  // ...
  defaultDepth: 1,
  // ...
})
```

### Max Depth

Fields like the Relationship Field or the Upload Field can also set a maximum depth. If exceeded, this will limit the population depth regardless of what the depth might be on the request.

To set a max depth for a field, use the `maxDepth` property in your field configuration:

```typescript
{
  slug: 'posts',
  fields: [
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      maxDepth: 2,
    }
  ]
}
```

## Performance

There are several ways to optimize your queries. Many of these options directly impact overall database overhead, response sizes, and/or computational load and can significantly improve performance.

When building queries, combine as many of these strategies together as possible to ensure your queries are as performant as they can be.

### Indexes

Build Indexes for fields that are often queried or sorted by.

When your query runs, the database will not search the entire document to find that one field, but will instead use the index to quickly locate the data.

This is done by adding `index: true` to the Field Config for that field:

```typescript
// In your collection configuration
{
  name: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      index: true, // Add an index to the title field
    },
    // Other fields...
  ],
}
```

### Depth

Set the Depth to only the level that you need to avoid populating unnecessary related documents.

Relationships will only populate down to the specified depth, and any relationships beyond that depth will only return the ID of the related document.

```typescript
const posts = await payload.find({
  collection: 'posts',
  where: { ... },
  depth: 0, // Only return the IDs of related documents
})
```

### Limit

Set the Limit if you can reliably predict the number of matched documents, such as when querying on a unique field.

```typescript
const posts = await payload.find({
  collection: 'posts',
  where: {
    slug: {
      equals: 'unique-post-slug',
    },
  },
  limit: 1, // Only expect one document to be returned
})
```

**Tip:** Use in combination with `pagination: false` for best performance when querying by unique fields.

### Select

Use the Select API to only process and return the fields you need.

This will reduce the amount of data returned from the request, and also skip processing of any fields that are not selected, such as running their field hooks.

```typescript
const posts = await payload.find({
  collection: 'posts',
  where: { ... },
  select: {
    title: true,
  },
})
```

This is a basic example, but there are many ways to use the Select API, including selecting specific fields, excluding fields, etc.

### Pagination

Disable Pagination if you can reliably predict the number of matched documents, such as when querying on a unique field.

```typescript
const posts = await payload.find({
  collection: 'posts',
  where: {
    slug: {
      equals: 'unique-post-slug',
    },
  },
  pagination: false, // Return all matched documents without pagination
})
```

**Tip:** Use in combination with `limit: 1` for best performance when querying by unique fields.