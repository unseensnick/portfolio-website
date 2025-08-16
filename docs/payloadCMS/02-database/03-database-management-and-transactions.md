# Database Management

## Database Indexes

Database indexes are a way to optimize the performance of your database by allowing it to quickly locate and retrieve data. If you have a field that you frequently query or sort by, adding an index to that field can significantly improve the speed of those operations.

### Single Field Indexes

To index a field, set the `index` option to `true` in your field's config:

```typescript
import type { CollectionConfig } from 'payload'

export MyCollection: CollectionConfig = {
  // ...
  fields: [
    // ...
    {
      name: 'title',
      type: 'text',
      index: true,
    },
  ]
}
```

**Note:** The `id`, `createdAt`, and `updatedAt` fields are indexed by default.

**Tip:** If you're using MongoDB, you can use MongoDB Compass to visualize and manage your indexes.

### Compound Indexes

In addition to indexing single fields, you can also create compound indexes that index multiple fields together. This can be useful for optimizing queries that filter or sort by multiple fields.

To create a compound index, use the `indexes` option in your Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  fields: [
    // ...
  ],
  indexes: [
    {
      fields: ['title', 'createdAt'],
      unique: true, // Optional, if you want the combination of fields to be unique
    },
  ],
}
```

## Database Migrations

Payload exposes a full suite of migration controls available for your use. Migration commands are accessible via the `npm run payload` command in your project directory.

### Setup

Ensure you have an npm script called "payload" in your `package.json` file:

```json
{
  "scripts": {
    "payload": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload"
  }
}
```

**Note:** You need to run Payload migrations through the package manager that you are using, because Payload should not be globally installed on your system.

### Migration File Contents

Payload stores all created migrations in a folder that you can specify. By default, migrations are stored in `./src/migrations`.

A migration file has two exports:
- An `up` function, which is called when a migration is executed
- A `down` function that will be called if the migration fails to complete successfully

Example migration file:

```typescript
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/your-db-adapter'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // Perform changes to your database here.
  // You have access to `payload` as an argument, and
  // everything is done in TypeScript.
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Do whatever you need to revert changes if the `up` function fails
}
```

### Using Transactions in Migrations

When migrations are run, each migration is performed in a new transaction for you. All you need to do is pass the `req` object to any Local API or direct database calls to make database changes inside the transaction.

**Direct database access with transactions:**

**MongoDB:**
```typescript
import { type MigrateUpArgs } from '@payloadcms/db-mongodb'

export async function up({ session, payload, req }: MigrateUpArgs): Promise<void> {
  const posts = await payload.db.collections.posts.collection
    .find({ session })
    .toArray()
}
```

**Postgres:**
```typescript
import { type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const { rows: posts } = await db.execute(sql`SELECT * from posts`)
}
```

**SQLite:**
In SQLite, transactions are disabled by default. More.

```typescript
import { type MigrateUpArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const { rows: posts } = await db.run(sql`SELECT * from posts`)
}
```

### Migrations Directory

Each DB adapter has an optional property `migrationDir` where you can override where you want your migrations to be stored/read. If this is not specified, Payload will check the default and possibly make a best effort to find your migrations directory by searching in common locations ie. `./src/migrations`, `./dist/migrations`, `./migrations`, etc.

### Migration Commands

| Command | Description |
|---------|-------------|
| `npm run payload migrate` | The migrate command will run any migrations that have not yet been run |
| `npm run payload migrate:create [optional-name]` | Create a new migration file in the migrations directory. You can optionally name the migration that will be created. By default, migrations will be named using a timestamp |
| `payload migrate:status` or `npm run payload migrate:status` | The migrate:status command will check the status of migrations and output a table of which migrations have been run, and which migrations have not yet run |
| `npm run payload migrate:down` | Roll back the last batch of migrations |
| `npm run payload migrate:refresh` | Roll back all migrations that have been run, and run them again |
| `npm run payload migrate:reset` | Roll back all migrations |
| `npm run payload migrate:fresh` | Drops all entities from the database and re-runs all migrations from scratch |

#### Create Command Flags

- `--skip-empty`: with Postgres, it skips the "no schema changes detected. Would you like to create a blank migration file?" prompt which can be useful for generating migration in CI.
- `--force-accept-warning`: accepts any command prompts, creates a blank migration even if there weren't any changes to the schema.

### When to Run Migrations

#### MongoDB
In MongoDB, you'll only need to run migrations when you change your database shape and have existing data that needs to be transformed. You can create a migration and then run it either:
- In CI before you build/deploy
- Locally against your production database

#### PostgreSQL
In relational databases like Postgres, migrations are more important because each time you add a new field or collection, you need to update the database shape to match your Payload Config.

**Typical Postgres Workflow:**

1. **Work locally using push mode** - Payload uses Drizzle ORM's push mode to automatically sync data changes in development
2. **Create a migration** - Run `pnpm payload migrate:create` when ready
3. **Set up build process** - Configure CI to run migrations before building

Example `package.json` scripts for CI:
```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "ci": "payload migrate && pnpm build"
  }
}
```

**Warning:** do not mix "push" and migrations with your local development database. If you use "push" locally, and then try to migrate, Payload will throw a warning, telling you that these two methods are not meant to be used interchangeably.

### Running Migrations in Production

You can run migrations at runtime when the server starts by passing migrations to your database adapter:

```typescript
// Import your migrations from the index.ts file that Payload generates
import { migrations } from './migrations'
import { buildConfig } from 'payload'

export default buildConfig({
  db: postgresAdapter({
    // your adapter config here
    prodMigrations: migrations,
  }),
})
```

**Warning:** if Payload is instructed to run migrations in production, this may slow down serverless cold starts on platforms such as Vercel. Generally, this option should only be used for long-running servers / containers.

### Environment-Specific Configurations

Be mindful of environment-specific logic in your config when handling migrations. Ways to address this:

- Manually update your migration file after it is generated to include any environment-specific configurations.
- Temporarily enable any required production environment variables in your local setup when generating the migration to capture the necessary updates.
- Use separate migration files for each environment to ensure the correct migration is executed in the corresponding environment.

## Database Transactions

Database transactions allow your application to make a series of database changes in an all-or-nothing commit. By default, Payload will use transactions for all data changing operations, as long as it is supported by the configured database.

### Basic Usage

The initial request made to Payload will begin a new transaction and attach it to the `req.transactionID`. You can opt in to using the same transaction by passing the `req` in the arguments:

```typescript
const afterChange: CollectionAfterChangeHook = async ({ req }) => {
  // because req.transactionID is assigned from Payload and passed through,
  // my-slug will only persist if the entire request is successful
  await req.payload.create({
    req,
    collection: 'my-slug',
    data: {
      some: 'data',
    },
  })
}
```

### Async Hooks with Transactions

If you have a hook where you do not await the result, then you should not pass the `req.transactionID`:

```typescript
const afterChange: CollectionAfterChangeHook = async ({ req }) => {
  // WARNING: an async call with req but NOT awaited may fail 
  // resulting in an OK response with uncommitted data
  const dangerouslyIgnoreAsync = req.payload.create({
    req,
    collection: 'my-slug',
    data: { some: 'other data' },
  })

  // Safe: doesn't pass req, so no transaction rollback issues
  const safelyIgnoredAsync = req.payload.create({
    collection: 'my-slug',
    data: { some: 'other data' },
  })
}
```

### Direct Transaction Access

When writing custom scripts or endpoints, you can directly control transactions:

```typescript
import payload from 'payload'
import config from './payload.config'

const standalonePayloadScript = async () => {
  await payload.init({ config })

  const transactionID = await payload.db.beginTransaction()

  try {
    await payload.update({
      collection: 'posts',
      data: { some: 'data' },
      where: { slug: { equals: 'my-slug' } },
      req: { transactionID },
    })

    // Commit the transaction
    await payload.db.commitTransaction(transactionID)
  } catch (error) {
    // Rollback the transaction
    await payload.db.rollbackTransaction(transactionID)
  }
}
```

### Transaction Functions

- `payload.db.beginTransaction` - Starts a new session and returns a transaction ID
- `payload.db.commitTransaction` - Takes the transaction identifier and finalizes changes
- `payload.db.rollbackTransaction` - Takes the transaction identifier and discards changes

### Disabling Transactions

**At the adapter level:**
Pass `false` as the `transactionOptions` in your database adapter configuration. All the official Payload database adapters support this option.

**Per operation:**
In addition to allowing database transactions to be disabled at the adapter level. You can prevent Payload from using a transaction in direct calls to the Local API by adding `disableTransaction: true` to the args. For example:

```typescript
await payload.update({
  collection: 'posts',
  data: { some: 'data' },
  where: { slug: { equals: 'my-slug' } },
  disableTransaction: true,
})
```

### Important Notes

- **MongoDB** requires a connection to a replicaset to use transactions
- **SQLite** transactions are disabled by default. You need to pass `transactionOptions: {}` to enable them
- Database changes are contained within all Payload operations
- Errors thrown will result in all changes being rolled back
- When transactions are not supported, Payload continues to operate without them
