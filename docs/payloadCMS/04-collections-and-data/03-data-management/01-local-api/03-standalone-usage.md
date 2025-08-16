# Using Payload Outside Next.js

## Overview

Payload can be used completely outside of Next.js which is helpful in cases like:

- Running scripts
- Using Payload in a separate backend service
- Using Payload's Local API to fetch your data directly from your database in other frontend frameworks like SvelteKit, Remix, Nuxt, and similar

**Important Note:** Payload and all of its official packages are fully ESM. If you want to use Payload within your own projects, make sure you are writing your scripts in ESM format or dynamically importing the Payload Config.

## Importing the Payload Config Outside of Next.js

Payload provides a convenient way to run standalone scripts, which can be useful for tasks like seeding your database or performing one-off operations.

In standalone scripts, you can simply import the Payload Config and use it right away. If you need an initialized copy of Payload, you can then use the `getPayload` function. This can be useful for tasks like seeding your database or performing other one-off operations.

### Basic Usage Example

```javascript
import { getPayload } from 'payload'
import config from '@payload-config'

const seed = async () => {
  // Get a local copy of Payload by passing your config
  const payload = await getPayload({ config })

  const user = await payload.create({
    collection: 'users',
    data: {
      email: 'dev@payloadcms.com',
      password: 'some-password',
    },
  })

  const page = await payload.create({
    collection: 'pages',
    data: {
      title: 'My Homepage',
      // other data to seed here
    },
  })
}

// Call the function here to run your seed script
await seed()
```

## Running Scripts with `payload run`

You can execute the script using `payload run`. Example: if you placed this standalone script in `src/seed.ts`, you would execute it like this:

```bash
payload run src/seed.ts
```

### What `payload run` Does

The `payload run` command does two things for you:

1. **Environment Variables**: It loads the environment variables the same way Next.js loads them, eliminating the need for additional dependencies like dotenv. The usage of dotenv is not recommended, as Next.js loads environment variables differently. By using `payload run`, you ensure consistent environment variable handling across your Payload and Next.js setup.

2. **TypeScript Execution**: It initializes tsx, allowing direct execution of TypeScript files manually installing tools like tsx or ts-node.

## Troubleshooting

If you encounter import-related errors, you have 2 options:

### Option 1: Enable SWC Mode

Enable swc mode by appending `--use-swc` to the payload command:

```bash
payload run src/seed.ts --use-swc
```

**Note:** 
- Install `@swc-node/register` in your project first
- While swc mode is faster than the default tsx mode, it might break for some imports

### Option 2: Use Alternative Runtime (e.g., Bun)

While we do not guarantee support for alternative runtimes, you are free to use them and disable Payload's own transpilation by appending the `--disable-transpile` flag to the payload command:

```bash
bunx --bun payload run src/seed.ts --disable-transpile
```

**Requirements:** You will need to have bun installed on your system for this to work.

## Use Cases for Standalone Payload

### Database Seeding

Create scripts to populate your database with initial data:

```javascript
import { getPayload } from 'payload'
import config from '@payload-config'

const seedDatabase = async () => {
  const payload = await getPayload({ config })

  // Create initial users
  const adminUser = await payload.create({
    collection: 'users',
    data: {
      email: 'admin@example.com',
      password: 'secure-password',
      role: 'admin',
    },
  })

  // Create initial content
  const homePage = await payload.create({
    collection: 'pages',
    data: {
      title: 'Welcome Home',
      slug: 'home',
      content: 'Welcome to our website!',
    },
  })

  console.log('Database seeded successfully!')
}

await seedDatabase()
```

### Data Migration Scripts

Create scripts to migrate or transform existing data:

```javascript
import { getPayload } from 'payload'
import config from '@payload-config'

const migrateData = async () => {
  const payload = await getPayload({ config })

  // Find all posts that need migration
  const posts = await payload.find({
    collection: 'posts',
    where: {
      migrated: { not_equals: true }
    },
    limit: 1000,
  })

  // Process each post
  for (const post of posts.docs) {
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: {
        // Transform data as needed
        newField: transformOldData(post.oldField),
        migrated: true,
      },
    })
  }

  console.log(`Migrated ${posts.docs.length} posts`)
}

await migrateData()
```

### Background Jobs and Cron Tasks

Use Payload in scheduled tasks or background processes:

```javascript
import { getPayload } from 'payload'
import config from '@payload-config'

const cleanupOldData = async () => {
  const payload = await getPayload({ config })

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  // Delete old temporary files
  const result = await payload.delete({
    collection: 'temp-files',
    where: {
      createdAt: {
        less_than: oneMonthAgo.toISOString()
      }
    }
  })

  console.log(`Cleaned up ${result.docs.length} old files`)
}

await cleanupOldData()
```

### Integration with Other Frameworks

Use Payload as a data source in other frontend frameworks:

```javascript
// In a SvelteKit or Nuxt application
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getStaticData() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
    where: {
      status: { equals: 'published' }
    }
  })

  const settings = await payload.findGlobal({
    slug: 'settings'
  })

  return {
    pages: pages.docs,
    settings
  }
}
```

## Environment Configuration

When running Payload outside of Next.js, ensure your environment variables are properly configured. The `payload run` command will automatically load environment variables from your `.env` files, but for custom scripts, you might need to handle this manually:

```javascript
// For custom script runners (not using payload run)
import dotenv from 'dotenv'
dotenv.config()

import { getPayload } from 'payload'
import config from '@payload-config'

// Your script logic here
```

## Best Practices

1. **Error Handling**: Always wrap your operations in try-catch blocks when running standalone scripts
2. **Environment Variables**: Use `payload run` to ensure consistent environment variable loading
3. **Database Connections**: Payload will handle database connections automatically, but ensure your database is accessible
4. **Logging**: Add appropriate logging to track script execution and troubleshoot issues
5. **Testing**: Test your scripts in development before running them in production

## Example: Complete Seeding Script

```javascript
import { getPayload } from 'payload'
import config from '@payload-config'

const runSeed = async () => {
  try {
    console.log('Starting database seed...')
    
    const payload = await getPayload({ config })

    // Create admin user
    console.log('Creating admin user...')
    const admin = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      },
    })
    console.log(`Admin user created: ${admin.email}`)

    // Create sample pages
    console.log('Creating sample pages...')
    const pages = [
      { title: 'Home', slug: 'home', content: 'Welcome to our website!' },
      { title: 'About', slug: 'about', content: 'Learn more about us.' },
      { title: 'Contact', slug: 'contact', content: 'Get in touch with us.' },
    ]

    for (const pageData of pages) {
      const page = await payload.create({
        collection: 'pages',
        data: pageData,
      })
      console.log(`Page created: ${page.title}`)
    }

    console.log('Database seed completed successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  }
}

await runSeed()
```

Run this script with:

```bash
payload run src/seed.ts
```