# Database Adapters Reference

## MongoDB Adapter

To use Payload with MongoDB, install the package `@payloadcms/db-mongodb`.

### Basic Configuration

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  collections: [
    // Collections go here
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
```

### MongoDB Options

| Option | Description |
|--------|-------------|
| `autoPluralization` | Tell Mongoose to auto-pluralize any collection names if it encounters any singular words used as collection slugs |
| `connectOptions` | Customize MongoDB connection options. Payload will connect to your MongoDB database using default options which you can override and extend |
| `collectionsSchemaOptions` | Customize Mongoose schema options for collections |
| `disableIndexHints` | Set to `true` to disable hinting to MongoDB to use 'id' as index. Defaults to `false` |
| `migrationDir` | Customize the directory that migrations are stored |
| `transactionOptions` | An object with configuration properties used in transactions or `false` which will disable the use of transactions |
| `collation` | Enable language-specific string comparison with customizable options. Available on MongoDB 3.4+. Defaults locale to "en" |
| `allowAdditionalKeys` | By default, Payload strips all additional keys from MongoDB data that don't exist in the Payload schema. Set to `true` to include additional data |
| `allowIDOnCreate` | Set to `true` to use the id passed in data on the create API operations without using a custom ID field |
| `disableFallbackSort` | Set to `true` to disable the adapter adding a fallback sort when sorting by non-unique fields |
| `useAlternativeDropDatabase` | Set to `true` to use an alternative dropDatabase implementation. Defaults to `false` |
| `useBigIntForNumberIDs` | Set to `true` to use BigInt for custom ID fields of type 'number'. Defaults to `false` |
| `useJoinAggregations` | Set to `false` to disable join aggregations and instead populate join fields via multiple find queries. Defaults to `true` |
| `usePipelineInSortLookup` | Set to `false` to disable the use of pipeline in the $lookup aggregation in sorting. Defaults to `true` |

### Access to Mongoose Models

After Payload is initialized, this adapter exposes all of your Mongoose models:

- Collection models - `payload.db.collections[myCollectionSlug]`
- Globals model - `payload.db.globals`
- Versions model (both collections and globals) - `payload.db.versions[myEntitySlug]`

### Other MongoDB Implementations

You can import the `compatibilityOptions` object for other MongoDB implementations:

```typescript
import { mongooseAdapter, compatabilityOptions } from '@payloadcms/db-mongodb'

export default buildConfig({
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
    // For example, if you're using firestore:
    ...compatabilityOptions.firestore,
  }),
})
```

We export compatability options for DocumentDB, Azure Cosmos DB and Firestore.

**Known limitations:**
- Azure Cosmos DB does not support transactions that update two or more documents in different collections
- Azure Cosmos DB requires the root config property `indexSortableFields` to be set to `true`

## PostgreSQL Adapter

To use Payload with Postgres, install either:
- `@payloadcms/db-postgres` (standard)
- `@payloadcms/db-vercel-postgres` (optimized for Vercel)

### Basic Configuration

**Standard Postgres:**
```typescript
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})
```

**Vercel Postgres:**
```typescript
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

export default buildConfig({
  // Automatically uses process.env.POSTGRES_URL if no options are provided
  db: vercelPostgresAdapter(),
  // Or with custom options:
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
})
```

### PostgreSQL Options

| Option | Description |
|--------|-------------|
| `pool` * | Pool connection options that will be passed to Drizzle and node-postgres or to @vercel/postgres |
| `push` | Disable Drizzle's db push in development mode. By default, push is enabled for development mode only |
| `migrationDir` | Customize the directory that migrations are stored |
| `schemaName` | A string for the postgres schema to use, defaults to 'public' (experimental) |
| `idType` | A string of 'serial', or 'uuid' that is used for the data type given to id columns |
| `transactionOptions` | A PgTransactionConfig object for transactions, or set to `false` to disable using transactions |
| `disableCreateDatabase` | Pass `true` to disable auto database creation if it doesn't exist. Defaults to `false` |
| `localesSuffix` | A string appended to the end of table names for storing localized fields. Default is '_locales' |
| `relationshipsSuffix` | A string appended to the end of table names for storing relationships. Default is '_rels' |
| `versionsSuffix` | A string appended to the end of table names for storing versions. Defaults to '_v' |
| `beforeSchemaInit` | Drizzle schema hook. Runs before the schema is built |
| `afterSchemaInit` | Drizzle schema hook. Runs after the schema is built |
| `generateSchemaOutputFile` | Override generated schema file path. Defaults to `{CWD}/src/payload-generated.schema.ts` |
| `allowIDOnCreate` | Set to `true` to use the id passed in data on the create API operations without using a custom ID field |
| `readReplicas` | An array of DB read replicas connection strings, can be used to offload read-heavy traffic |
| `blocksAsJSON` | Store blocks as a JSON column instead of using the relational structure |

### Access to Drizzle

Generate Drizzle schema first:
```bash
npx payload generate:db-schema
```

Then access Drizzle:
```typescript
import { posts } from './payload-generated-schema'
import { eq, sql, and } from '@payloadcms/db-postgres/drizzle'

// Drizzle's Querying API
const posts = await payload.db.drizzle.query.posts.findMany()

// Drizzle's Select API
const result = await payload.db.drizzle
  .select()
  .from(posts)
  .where(
    and(eq(posts.id, 50), sql`lower(${posts.title}) = 'example post title'`),
  )
```

**Available via payload.db:**
- Tables - `payload.db.tables`
- Enums - `payload.db.enums`
- Relations - `payload.db.relations`

### Drizzle Schema Hooks

**beforeSchemaInit:**
```typescript
import { postgresAdapter } from '@payloadcms/db-postgres'
import { integer, pgTable, serial } from '@payloadcms/db-postgres/drizzle/pg-core'

postgresAdapter({
  beforeSchemaInit: [
    ({ schema, adapter }) => {
      return {
        ...schema,
        tables: {
          ...schema.tables,
          addedTable: pgTable('added_table', {
            id: serial('id').notNull(),
          }),
        },
      }
    },
  ],
})
```

**afterSchemaInit:**
```typescript
import { postgresAdapter } from '@payloadcms/db-postgres'
import { index, integer } from '@payloadcms/db-postgres/drizzle/pg-core'

postgresAdapter({
  afterSchemaInit: [
    ({ schema, extendTable, adapter }) => {
      extendTable({
        table: schema.tables.places,
        columns: {
          extraIntegerColumn: integer('extra_integer_column'),
        },
        extraConfig: (table) => ({
          country_city_composite_index: index('country_city_composite_index').on(table.country, table.city),
        }),
      })
      return schema
    },
  ],
})
```

## SQLite Adapter

To use Payload with SQLite, install the package `@payloadcms/db-sqlite`.

### Basic Configuration

```typescript
import { sqliteAdapter } from '@payloadcms/db-sqlite'

export default buildConfig({
  collections: [
    // Collections go here
  ],
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
})
```

### SQLite Options

| Option | Description |
|--------|-------------|
| `client` * | Client connection options that will be passed to createClient from @libsql/client |
| `push` | Disable Drizzle's db push in development mode. By default, push is enabled for development mode only |
| `migrationDir` | Customize the directory that migrations are stored |
| `logger` | The instance of the logger to be passed to drizzle. By default Payload's will be used |
| `idType` | A string of 'number', or 'uuid' that is used for the data type given to id columns |
| `transactionOptions` | A SQLiteTransactionConfig object for transactions, or set to `false` to disable using transactions |
| `localesSuffix` | A string appended to the end of table names for storing localized fields. Default is '_locales' |
| `relationshipsSuffix` | A string appended to the end of table names for storing relationships. Default is '_rels' |
| `versionsSuffix` | A string appended to the end of table names for storing versions. Defaults to '_v' |
| `beforeSchemaInit` | Drizzle schema hook. Runs before the schema is built |
| `afterSchemaInit` | Drizzle schema hook. Runs after the schema is built |
| `generateSchemaOutputFile` | Override generated schema file path. Defaults to `{CWD}/src/payload-generated.schema.ts` |
| `autoIncrement` | Pass `true` to enable SQLite AUTOINCREMENT for primary keys |
| `allowIDOnCreate` | Set to `true` to use the id passed in data on the create API operations without using a custom ID field |
| `blocksAsJSON` | Store blocks as a JSON column instead of using the relational structure |

### Access to Drizzle

Generate Drizzle schema first:
```bash
npx payload generate:db-schema
```

Then access Drizzle:
```typescript
import { posts } from './payload-generated-schema'
import { eq, sql, and } from '@payloadcms/db-sqlite/drizzle'

// Drizzle's Querying API
const posts = await payload.db.drizzle.query.posts.findMany()

// Drizzle's Select API
const result = await payload.db.drizzle
  .select()
  .from(posts)
  .where(
    and(eq(posts.id, 50), sql`lower(${posts.title}) = 'example post title'`),
  )
```

**Available via payload.db:**
- Tables - `payload.db.tables`
- Relations - `payload.db.relations`

## Prototyping in Development Mode

Both PostgreSQL and SQLite adapters support Drizzle's "db push" feature, which automatically pushes changes you make to your Payload Config to your database in development mode. This eliminates the need to manually migrate every time you change your Payload Config.

- Push is enabled by default for development mode only
- Should not be mixed with manually running migrate commands
- You will be warned if any changes will entail data loss
- Can be disabled by setting `push: false` in adapter options
