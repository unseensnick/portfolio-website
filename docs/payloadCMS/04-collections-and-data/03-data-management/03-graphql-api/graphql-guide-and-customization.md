# Payload GraphQL Complete Guide

## GraphQL Overview

In addition to its REST and Local APIs, Payload ships with a fully featured and extensible GraphQL API.

By default, the GraphQL API is exposed via `/api/graphql`, but you can customize this URL via specifying your routes within the main Payload Config.

The labels you provide for your Collections and Globals are used to name the GraphQL types that are created to correspond to your config. Special characters and spaces are removed.

### GraphQL Options

At the top of your Payload Config you can define all the options to manage GraphQL.

| Option | Description |
|--------|-------------|
| mutations | Any custom Mutations to be added in addition to what Payload provides. More |
| queries | Any custom Queries to be added in addition to what Payload provides. More |
| maxComplexity | A number used to set the maximum allowed complexity allowed by requests More |
| disablePlaygroundInProduction | A boolean that if false will enable the GraphQL playground in production environments, defaults to true. More |
| disableIntrospectionInProduction | A boolean that if false will enable the GraphQL introspection in production environments, defaults to true. |
| disable | A boolean that if true will disable the GraphQL entirely, defaults to false. |
| validationRules | A function that takes the ExecutionArgs and returns an array of ValidationRules. |

## Collections

Everything that can be done to a Collection via the REST or Local API can be done with GraphQL (outside of uploading files, which is REST-only). If you have a collection as follows:

```typescript
import type { CollectionConfig } from 'payload'

export const PublicUser: CollectionConfig = {
  slug: 'public-users',
  auth: true, // Auth is enabled
  fields: [
    ...
  ],
}
```

Payload will automatically open up the following queries:

| Query Name | Operation |
|------------|-----------|
| PublicUser | findByID |
| PublicUsers | find |
| countPublicUsers | count |
| mePublicUser | me auth operation |

And the following mutations:

| Query Name | Operation |
|------------|-----------|
| createPublicUser | create |
| updatePublicUser | update |
| deletePublicUser | delete |
| forgotPasswordPublicUser | forgotPassword auth operation |
| resetPasswordPublicUser | resetPassword auth operation |
| unlockPublicUser | unlock auth operation |
| verifyPublicUser | verify auth operation |
| loginPublicUser | login auth operation |
| logoutPublicUser | logout auth operation |
| refreshTokenPublicUser | refresh auth operation |

## Globals

Globals are also fully supported. For example:

```typescript
import type { GlobalConfig } from 'payload';

const Header: GlobalConfig = {
  slug: 'header',
  fields: [
    ...
  ],
}
```

Payload will open the following query:

| Query Name | Operation |
|------------|-----------|
| Header | findOne |

And the following mutation:

| Query Name | Operation |
|------------|-----------|
| updateHeader | update |

## Preferences

User preferences for the Admin Panel are also available to GraphQL the same way as other collection schemas are generated. To query preferences you must supply an authorization token in the header and only the preferences of that user will be accessible.

Payload will open the following query:

| Query Name | Operation |
|------------|-----------|
| Preference | findOne |

And the following mutations:

| Query Name | Operation |
|------------|-----------|
| updatePreference | update |
| deletePreference | delete |

## GraphQL Schema Generation

In Payload the schema is controlled by your collections and globals. All you need to do is run the generate command and the entire schema will be created for you.

### Schema generation script

Install @payloadcms/graphql as a dev dependency:

```bash
pnpm add @payloadcms/graphql -D
```

Run the following command to generate the schema:

```bash
pnpm payload-graphql generate:schema
```

### Custom Field Schemas

For array, block, group and named tab fields, you can generate top level reusable interfaces. The following group field config:

```javascript
{
  type: 'group',
  name: 'meta',
  interfaceName: 'SharedMeta', 
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
}
```

will generate:

```graphql
// A top level reusable type will be generated
type SharedMeta {
  title: String
  description: String
}

// And will be referenced inside the generated schema
type Collection1 {
  // ...other fields
  meta: SharedMeta
}
```

The above example outputs all your definitions to a file relative from your Payload config as `./graphql/schema.graphql`. By default, the file will be output to your current working directory as `schema.graphql`.

### Adding an npm script

**Important**: Payload needs to be able to find your config to generate your GraphQL schema.

Payload will automatically try and locate your config, but might not always be able to find it. For example, if you are working in a `/src` directory or similar, you need to tell Payload where to find your config manually by using an environment variable.

If this applies to you, create an npm script to make generating types easier:

```json
// package.json

{
  "scripts": {
    "generate:graphQLSchema": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload-graphql generate:schema"
  }
}
```

Now you can run `pnpm generate:graphQLSchema` to easily generate your schema.

## Adding Custom Queries and Mutations

You can add your own GraphQL queries and mutations to Payload, making use of all the types that Payload has defined for you.

To do so, add your queries and mutations to the main Payload Config as follows:

| Config Path | Description |
|-------------|-------------|
| graphQL.queries | Function that returns an object containing keys to custom GraphQL queries |
| graphQL.mutations | Function that returns an object containing keys to custom GraphQL mutations |

The above properties each receive a function that is defined with the following arguments:

**GraphQL**: This is Payload's GraphQL dependency. You should not install your own copy of GraphQL as a dependency due to underlying restrictions based on how GraphQL works. Instead, you can use the Payload-provided copy via this argument.

**payload**: This is a copy of the currently running Payload instance, which provides you with existing GraphQL types for all of your Collections and Globals - among other things.

### Return value

Both `graphQL.queries` and `graphQL.mutations` functions should return an object with properties equal to your newly written GraphQL queries and mutations.

### Example

payload.config.js:

```javascript
import { buildConfig } from 'payload'
import myCustomQueryResolver from './graphQL/resolvers/myCustomQueryResolver'

export default buildConfig({
  graphQL: {
    queries: (GraphQL, payload) => {
      return {
        MyCustomQuery: {
          type: new GraphQL.GraphQLObjectType({
            name: 'MyCustomQuery',
            fields: {
              text: {
                type: GraphQL.GraphQLString,
              },
              someNumberField: {
                type: GraphQL.GraphQLFloat,
              },
            },
          }),
          args: {
            argNameHere: {
              type: new GraphQL.GraphQLNonNull(GraphQLString),
            },
          },
          resolve: myCustomQueryResolver,
        },
      }
    },
  },
})
```

### Resolver function

In your resolver, make sure you set `depth: 0` if you're returning data directly from the Local API so that GraphQL can correctly resolve queries to nested values such as relationship data.

Your function will receive four arguments you can make use of:

**Example**:
```javascript
async (obj, args, context, info) => {}
```

**obj**: The previous object. Not very often used and usually discarded.

**args**: The available arguments from your query or mutation will be available to you here, these must be configured via the custom operation first.

**context**: An object containing the req and res objects that will provide you with the payload, user instances and more, like any other Payload API handler.

**info**: Contextual information about the currently running GraphQL operation. You can get schema information from this as well as contextual information about where this resolver function is being run.

### Types

We've exposed a few types and utilities to help you extend the API further. Payload uses the GraphQL.js package for which you can view the full list of available types in the official documentation.

#### GraphQLJSON & GraphQLJSONObject

```javascript
import { GraphQLJSON, GraphQLJSONObject } from '@payloadcms/graphql/types'
```

#### GraphQL

You can directly import the GraphQL package used by Payload, most useful for typing.

```javascript
import { GraphQL } from '@payloadcms/graphql/types'
```

For queries, mutations and handlers make sure you use the GraphQL and payload instances provided via arguments.

#### buildPaginatedListType

This is a utility function that allows you to build a new GraphQL type for a paginated result similar to the Payload's generated schema. It takes in two arguments, the first for the name of this new schema type and the second for the GraphQL type to be used in the docs parameter.

**Example**:

```javascript
import { buildPaginatedListType } from '@payloadcms/graphql/types'

export const getMyPosts = (GraphQL, payload) => {
  return {
    args: {},
    resolve: Resolver,
    // The name of your new type has to be unique
    type: buildPaginatedListType(
      'AuthorPosts',
      payload.collections['posts'].graphQL?.type,
    ),
  }
}
```

#### payload.collections.slug.graphQL

If you want to extend more of the provided API then the graphQL object on your collection slug will contain additional types to help you re-use code for types, mutations and queries.

```typescript
graphQL?: {
  type: GraphQLObjectType
  paginatedType: GraphQLObjectType
  JWT: GraphQLObjectType
  versionType: GraphQLObjectType
  whereInputType: GraphQLInputObjectType
  mutationInputType: GraphQLNonNull<any>
  updateMutationInputType: GraphQLNonNull<any>
}
```

### Best practices

There are a few ways to structure your code, we recommend using a dedicated graphql directory so you can keep all of your logic in one place. You have total freedom of how you want to structure this but a common pattern is to group functions by type and with their resolver.

**Example**:

```
src/graphql
---- queries/
     index.ts
    -- myCustomQuery/
       index.ts
       resolver.ts

---- mutations/
```

## GraphQL Playground

GraphQL Playground is enabled by default for development purposes, but disabled in production. You can enable it in production by passing `graphQL.disablePlaygroundInProduction` a false setting in the main Payload Config.

You can even log in using the `login[collection-singular-label-here]` mutation to use the Playground as an authenticated user.

**Tip**: To see more regarding how the above queries and mutations are used, visit your GraphQL playground (by default at `${SERVER_URL}/api/graphql-playground`) while your server is running. There, you can use the "Schema" and "Docs" buttons on the right to see a ton of detail about how GraphQL operates within Payload.

## Custom Validation Rules

You can add custom validation rules to your GraphQL API by defining a `validationRules` function in your Payload Config. This function should return an array of Validation Rules that will be applied to all incoming queries and mutations.

```javascript
import { GraphQL } from '@payloadcms/graphql/types'
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  graphQL: {
    validationRules: (args) => [NoProductionIntrospection],
  },
  // ...
})

const NoProductionIntrospection: GraphQL.ValidationRule = (context) => ({
  Field(node) {
    if (process.env.NODE_ENV === 'production') {
      if (node.name.value === '__schema' || node.name.value === '__type') {
        context.reportError(
          new GraphQL.GraphQLError(
            'GraphQL introspection is not allowed, but the query contained __schema or __type',
            { nodes: [node] },
          ),
        )
      }
    }
  },
})
```

## Query complexity limits

Payload comes with a built-in query complexity limiter to prevent bad people from trying to slow down your server by running massive queries. To learn more, click here.

### Field complexity

You can define custom complexity for relationship, upload and join type fields. This is useful if you want to assign a higher complexity to a field that is more expensive to resolve. This can help prevent users from running queries that are too complex.

```javascript
const fieldWithComplexity = {
  name: 'authors',
  type: 'relationship',
  relationship: 'authors',
  graphQL: {
    complexity: 100, 
  },
}
```