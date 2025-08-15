# Payload CMS Trash Feature Documentation (Beta)

## Overview

Trash (also known as soft delete) allows documents to be marked as deleted without being permanently removed. When enabled on a collection, deleted documents will receive a deletedAt timestamp, making it possible to restore them later, view them in a dedicated Trash view, or permanently delete them.

Soft delete is a safer way to manage content lifecycle, giving editors a chance to review and recover documents that may have been deleted by mistake.

> **Note:** The Trash feature is currently in beta and may be subject to change in minor version updates.

## Collection Configuration

To enable soft deleting for a collection, set the trash property to true:

```typescript
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  trash: true,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    // other fields...
  ],
}
```

When enabled, Payload automatically injects a `deletedAt` field into the collection's schema. This timestamp is set when a document is soft-deleted, and cleared when the document is restored.

## Admin Panel Behavior

Once trash is enabled, the Admin Panel provides a dedicated Trash view for each collection:

### Trash View Features

- A new route is added at `/collections/:collectionSlug/trash`
- The Trash view shows all documents that have a `deletedAt` timestamp

### Available Actions

From the Trash view, you can:

#### Bulk Actions
- **Restore** - Clear the `deletedAt` timestamp and return documents to their original state
- **Delete** - Permanently remove selected documents
- **Empty Trash** - Select and permanently delete all trashed documents at once

#### Document Edit View
Enter each document's edit view, just like in the main list view. While in the edit view of a trashed document:

- All fields are in a read-only state
- Standard document actions (e.g., Save, Publish, Restore Version) are hidden and disabled
- The available actions are **Restore** and **Permanently Delete**
- Access to the API, Versions, and Preview views is preserved

### Deletion from Main Collection
When deleting a document from the main collection List View, Payload will soft-delete the document by default. A checkbox in the delete confirmation modal allows users to skip the trash and permanently delete instead.

## API Support

Soft deletes are fully supported across all Payload APIs: Local, REST, and GraphQL.

### Supported Operations

The following operations respect and support the trash functionality:

- `find`
- `findByID`
- `update`
- `updateByID`
- `delete`
- `deleteByID`
- `findVersions`
- `findVersionByID`

### Understanding Trash Behavior

Passing `trash: true` to these operations will include soft-deleted documents in the query results.

To return only soft-deleted documents, you must combine `trash: true` with a where clause that checks if `deletedAt` exists.

## API Examples

### Local API

#### Return all documents including trashed:
```javascript
const result = await payload.find({
  collection: 'posts',
  trash: true,
})
```

#### Return only trashed documents:
```javascript
const result = await payload.find({
  collection: 'posts',
  trash: true,
  where: {
    deletedAt: {
      exists: true,
    },
  },
})
```

#### Return only non-trashed documents:
```javascript
const result = await payload.find({
  collection: 'posts',
  trash: false,
})
```

### REST API

#### Return all documents including trashed:
```
GET /api/posts?trash=true
```

#### Return only trashed documents:
```
GET /api/posts?trash=true&where[deletedAt][exists]=true
```

#### Return only non-trashed documents:
```
GET /api/posts?trash=false
```

### GraphQL API

#### Return all documents including trashed:
```graphql
query {
  Posts(trash: true) {
    docs {
      id
      deletedAt
    }
  }
}
```

#### Return only trashed documents:
```graphql
query {
  Posts(
    trash: true
    where: { deletedAt: { exists: true } }
  ) {
    docs {
      id
      deletedAt
    }
  }
}
```

#### Return only non-trashed documents:
```graphql
query {
  Posts(trash: false) {
    docs {
      id
      deletedAt
    }
  }
}
```

## Access Control

All trash-related actions (delete, permanent delete) respect the delete access control defined in your collection config.

This means:
- If a user is denied delete access, they cannot soft delete or permanently delete documents

## Versions and Trash

When a document is soft-deleted:

- It can no longer have a version restored until it is first restored from trash
- Attempting to restore a version while the document is in trash will result in an error
- This ensures consistency between the current document state and its version history

However, versions are still fully visible and accessible from the edit view of a trashed document. You can view the full version history, but must restore the document itself before restoring any individual version.