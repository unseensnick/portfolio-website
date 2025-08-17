# Database Overview & Configuration

## Introduction

Payload is database agnostic, meaning you can use any type of database behind Payload's familiar APIs. Payload is designed to interact with your database through a Database Adapter, which is a thin layer that translates Payload's internal data structures into your database's native data structures.

## Supported Database Adapters

Currently, Payload officially supports the following Database Adapters:

- **MongoDB with Mongoose** (`@payloadcms/db-mongodb`)
- **Postgres with Drizzle** (`@payloadcms/db-postgres` or `@payloadcms/db-vercel-postgres`)
- **SQLite with Drizzle** (`@payloadcms/db-sqlite`)

## Basic Configuration

To configure a Database Adapter, use the `db` property in your Payload Config:

```typescript
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  // ...
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
```

**Reminder:** The Database Adapter is an external dependency and must be installed in your project separately from Payload. You can find the installation instructions for each Database Adapter in their respective documentation.

## Selecting a Database

There are several factors to consider when choosing which database technology and hosting option is right for your project and workload. There are two main categories of databases to choose from:

### Non-Relational Databases (MongoDB)

If your project has a lot of dynamic fields, and you are comfortable with allowing Payload to enforce data integrity across your documents, MongoDB is a great choice. With it, your Payload documents are stored as one document in your database—no matter if you have localization enabled, how many block or array fields you have, etc.

**You should prefer MongoDB if:**
- You prefer simplicity within your database
- You don't want to deal with keeping production/staging databases in sync via DDL changes
- Most (or everything) in your project is Localized
- You leverage a lot of Arrays, Blocks, or hasMany Select fields

### Relational Databases (Postgres/SQLite)

Many projects might call for more rigid database architecture where the shape of your data is strongly enforced at the database level. For example, if you know the shape of your data and it's relatively "flat", and you don't anticipate it to change often, your workload might suit relational databases like Postgres very well.

**You should prefer a relational DB like Postgres or SQLite if:**
- You are comfortable with Migrations
- You require enforced data consistency at the database level
- You have a lot of relationships between collections and require relationships to be enforced

## Payload Differences

It's important to note that nearly every Payload feature is available in all of our officially supported Database Adapters, including Localization, Arrays, Blocks, etc. The only thing that is not supported in SQLite yet is the Point Field, but that should be added soon.

It's up to you to choose which database you would like to use based on the requirements of your project. Payload has no opinion on which database you should ultimately choose.
