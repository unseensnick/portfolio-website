# Payload CMS - Versions, Drafts, and Autosave Documentation

## Overview

Payload's powerful Versions functionality allows you to keep a running history of changes over time and extensible to fit any content publishing workflow.

When enabled, Payload will automatically scaffold a new Collection in your database to store versions of your document(s) over time, and the Admin UI will be extended with additional views that allow you to browse document versions, view diffs in order to see exactly what has changed in your documents (and when they changed), and restore documents back to prior versions easily.

With Versions, you can:

- Maintain an audit log / history of every change ever made to a document, including monitoring for what user made which change
- Restore documents and globals to prior states in case you need to roll back changes
- Build a true Draft Preview mode for your data
- Manage who can see Drafts, and who can only see Published documents via Access Control
- Enable Autosave on collections and globals to never lose your work again
- Build a powerful publishing schedule mechanism to create documents and have them become publicly readable automatically at a future date

Versions are extremely performant and totally opt-in. They don't change the shape of your data at all. All versions are stored in a separate Collection and can be turned on and off easily at your discretion.

## Versions Configuration Levels

Versions support a few different levels of functionality that each come with their own impacts to document workflow.

### Versions enabled, drafts disabled

If you enable versions but keep draft mode disabled, Payload will simply create a new version of a document each time you update a document. This is great for use cases where you need to retain a history of all document updates over time, but always want to treat the newest document version as the version that is "published".

For example, a use case for "versions enabled, drafts disabled" could be on a collection of users, where you might want to keep a version history (or audit log) of all changes ever made to users - but any changes to users should always be treated as "published" and you have no need to maintain a "draft" version of a user.

### Versions and drafts enabled

If you have versions and drafts enabled, you are able to control which documents are published, and which are considered draft. That lets you write Access Control to control who can see published documents, and who can see draft documents. It also lets you save versions (drafts) that are newer than your most recently published document, which is helpful if you want to draft changes and maybe even preview them before you publish the changes.

### Versions, drafts, and autosave enabled

When you have versions, drafts, and autosave enabled, the Admin UI will automatically save changes that you make to a new draft version as you edit a document, which makes sure that you never lose your changes ever again. Autosave will not affect your published post at allâ€"instead, it'll just save your changes and let you publish them whenever you or your editors are ready to do so.

## Configuration

### Collection Config

Configuring Versions is done by adding the versions key to your Collection configs. Set it to true to enable default Versions settings, or customize versions options by setting the property equal to an object containing the following available options:

| Option | Description |
|--------|-------------|
| maxPerDoc | Use this setting to control how many versions to keep on a document by document basis. Must be an integer. Defaults to 100, use 0 to save all versions. |
| drafts | Enable Drafts mode for this collection. To enable, set to true or pass an object with draft options. |

### Global Config

Global versions work similarly to Collection versions but have a slightly different set of config properties supported.

| Option | Description |
|--------|-------------|
| max | Use this setting to control how many versions to keep on a global by global basis. Must be an integer. |
| drafts | Enable Drafts mode for this global. To enable, set to true or pass an object with draft options |

## Drafts

Payload's Draft functionality builds on top of the Versions functionality to allow you to make changes to your collection documents and globals, but publish only when you're ready. This functionality allows you to build powerful Preview environments for your data, where you can make sure your changes look good before publishing documents.

Drafts rely on Versions being enabled in order to function.

By enabling Versions with Drafts, your collections and globals can maintain newer, and unpublished versions of your documents. It's perfect for cases where you might want to work on a document, update it and save your progress, but not necessarily make it publicly published right away. Drafts are extremely helpful when building preview implementations.

### Drafts Enabled

If Drafts are enabled, the typical Save button is replaced with new actions which allow you to either save a draft, or publish your changes.

### Draft Options

Collections and Globals both support the same options for configuring drafts. You can either set versions.drafts to true, or pass an object to configure draft properties.

| Draft Option | Description |
|--------------|-------------|
| autosave | Enable autosave to automatically save progress while documents are edited. To enable, set to true or pass an object with options. |
| schedulePublish | Allow for editors to schedule publish / unpublish events in the future. |
| validate | Set validate to true to validate draft documents when saved. Default is false. |

### Database Changes

By enabling drafts on a collection or a global, Payload will automatically inject a new field into your schema called `_status`. The `_status` field is used internally by Payload to store if a document is set to draft or published.

### Admin UI Status Indication

Within the Admin UI, if drafts are enabled, a document can be shown with one of three "statuses":

- **Draft** - if a document has never been published, and only draft versions of the document are present
- **Published** - if a document is published and there are no newer drafts available
- **Changed** - if a document has been published, but there are newer drafts available and not yet published

### Draft API

If drafts are enabled on your collection or global, important and powerful changes are made to your REST, GraphQL, and Local APIs that allow you to specify if you are interacting with drafts or with live documents.

#### Updating or creating drafts

If you enable drafts on a collection or global, the create and update operations for REST, GraphQL, and Local APIs expose a new option called draft which allows you to specify if you are creating or updating a draft, or if you're just sending your changes straight to the published document.

For example:

```javascript
// REST API
POST /api/your-collection?draft=true

// Local API
await payload.create({
  collection: 'your-collection',
  data: {
    // your data here
  },
  draft: true, // This is required to create a draft
})

// GraphQL
mutation {
  createYourCollection(data: { ... }, draft: true) {
    // ...
  }
}
```

#### Required fields

If draft is enabled while creating or updating a document, all fields are considered as not required, so that you can save drafts that are incomplete.

Setting `_status: "draft"` will not bypass the required fields. You need to set `draft: true` as shown in the previous examples.

#### Reading drafts vs. published documents

In addition to the draft argument within create and update operations, a draft argument is also exposed for find and findByID operations.

If draft is set to true while reading a document, Payload will automatically replace returned document(s) with their newest drafts if any newer drafts are available.

For example, let's take the following scenario:

1. You create a new collection document and publish it right away
2. You then make some updates, and save the updates as a draft
3. You then make some further updates, and save more updates as another draft

Here, you will have a published document that resides in your main collection, and then you'll have two newer drafts that reside in the `_[collectionSlug]_versions` database collection.

If you simply fetch your created document using a find or findByID operation, your published document will be returned and the drafts will be ignored.

But, if you specify draft as true, Payload will automatically replace your published document's content with content coming from the most recently saved version. In this case, as we have created two versions in the above scenario, Payload will send back data from the newest (second) draft and your document will appear as the most recently drafted version instead of the published version.

**Important:** the draft argument on its own will not restrict documents with `_status: 'draft'` from being returned from the API. You need to use Access Control to prevent documents with `_status: 'draft'` from being returned to unauthenticated users.

### Controlling who can see Collection drafts

If you're using the drafts feature, it's important for you to consider who can view your drafts, and who can view only published documents. Luckily, Payload makes this extremely simple and puts the power completely in your hands.

#### Restricting draft access

You can use the read Access Control method to restrict who is able to view drafts of your documents by simply returning a query constraint which restricts the documents that any given user is able to retrieve.

Here is an example that utilizes the `_status` field to require a user to be logged in to retrieve drafts:

```javascript
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: ({ req }) => {
      // If there is a user logged in,
      // let them retrieve all documents
      if (req.user) return true

      // If there is no user,
      // restrict the documents that are returned
      // to only those where `_status` is equal to `published`
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  versions: {
    drafts: true,
  },
  //.. the rest of the Pages config here
}
```

#### Note regarding adding versions to an existing collection

If you already have a collection with documents, and you opt in to draft functionality after you have already created existing documents, all of your old documents _will not have a `_status` field_ until you resave them. For this reason, if you are _adding_ versions into an existing collection, you might want to write your Access Control function to allow for users to read both documents where `_status` is equal to "published" as well as where `_status` does not exist.

Here is an example for how to write an Access Control function that grants access to both documents where `_status` is equal to "published" and where `_status` does not exist:

```javascript
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: ({ req }) => {
      // If there is a user logged in,
      // let them retrieve all documents
      if (req.user) return true

      // If there is no user,
      // restrict the documents that are returned
      // to only those where `_status` is equal to `published`
      // or where `_status` does not exist
      return {
        or: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            _status: {
              exists: false,
            },
          },
        ],
      }
    },
  },
  versions: {
    drafts: true,
  },
  //.. the rest of the Pages config here
}
```

### Scheduled publish

Payload provides for an ability to schedule publishing / unpublishing events in the future, which can be helpful if you need to set certain documents to "go live" at a given date in the future, or, vice versa, revert to a draft state after a certain time has passed.

You can enable this functionality on both collections and globals via the `versions.drafts.schedulePublish: true` property.

**Important:** if you are going to enable scheduled publish / unpublish, you need to make sure your Payload app is set up to process Jobs. This feature works by creating a Job in the background, which will be picked up after the job becomes available. If you do not have any mechanism in place to run jobs, your scheduled publish / unpublish jobs will never be executed.

### Unpublishing drafts

If a document is published, the Payload Admin UI will be updated to show an "unpublish" button at the top of the sidebar, which will "unpublish" the currently published document. Consider this as a way to "revert" a document back to a draft state. On the API side, this is done by simply setting `_status: 'draft'` on any document.

### Reverting to published

If a document is published, and you have made further changes which are saved as a draft, Payload will show a "revert to published" button at the top of the sidebar which will allow you to reject your draft changes and "revert" back to the published state of the document. Your drafts will still be saved, but a new version will be created that will reflect the last published state of the document.

## Autosave

Extending on Payload's Draft functionality, you can configure your collections and globals to autosave changes as drafts, and publish only you're ready. The Admin UI will automatically adapt to autosaving progress at an interval that you define, and will store all autosaved changes as a new Draft version. Never lose your work - and publish changes to the live document only when you're ready.

Autosave relies on Versions and Drafts being enabled in order to function.

### Autosave Enabled

If Autosave is enabled, drafts will be created automatically as the document is modified and the Admin UI adds an indicator describing when the document was last saved to the top right of the sidebar.

### Autosave Options

Collections and Globals both support the same options for configuring autosave. You can either set `versions.drafts.autosave` to true, or pass an object to configure autosave properties.

| Drafts Autosave Options | Description |
|-------------------------|-------------|
| interval | Define an interval in milliseconds to automatically save progress while documents are edited. Document updates are "debounced" at this interval. Defaults to 800. |
| showSaveDraftButton | Set this to true to show the "Save as draft" button even while autosave is enabled. Defaults to false. |

### Example Configuration

Example config with versions, drafts, and autosave enabled:

```javascript
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: ({ req }) => {
      // If there is a user logged in,
      // let them retrieve all documents
      if (req.user) return true

      // If there is no user,
      // restrict the documents that are returned
      // to only those where `_status` is equal to `published`
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  versions: {
    drafts: {
      autosave: true,

      // Alternatively, you can specify an object to customize autosave:
      // autosave: {
      // Define how often the document should be autosaved (in milliseconds)
      //   interval: 1500,
      //
      // Show the "Save as draft" button even while autosave is enabled
      //   showSaveDraftButton: true,
      // },
    },
  },
  //.. the rest of the Pages config here
}
```

### Autosave API

When autosave is enabled, all update operations within Payload expose a new argument called `autosave`. When set to true, Payload will treat the incoming draft update as an autosave. This is primarily used by the Admin UI, but there may be some cases where you are building an app for your users and wish to implement autosave in your own app. To do so, use the autosave argument in your update operations.

### How autosaves are stored

If we created a new version for each autosave, you'd quickly find a ton of autosaves that clutter up your `_versions` collection within the database. That would be messy quick because autosave is typically set to save a document at ~800ms intervals.

Instead of creating a new version each time a document is autosaved, Payload smartly only creates one autosave version, and then updates that specific version with each autosave performed. This makes sure that your versions remain nice and tidy.

## Database Impact

By enabling versions, a new database collection will be made to store versions for your collection or global. The collection will be named based off the slug of the collection or global and will follow this pattern (where slug is replaced with the slug of your collection or global):

```
_slug_versions
```

Each document in this new versions collection will store a set of meta properties about the version as well as a full copy of the document. For example, a version's data might look like this for a Collection document:

```json
{
  "_id": "61cf752c19cdf1b1af7b61f1", // a unique ID of this version
  "parent": "61ce1354091d5b3ffc20ea6e", // the ID of the parent document
  "autosave": false, // used to denote if this version was created via autosave
  "version": {
    // your document's data goes here
    // all fields are set to not required and this property can be partially complete
  },
  "createdAt": "2021-12-31T21:25:00.992+00:00",
  "updatedAt": "2021-12-31T21:25:00.992+00:00"
}
```

Global versions are stored the same as the collection version shown above, except they do not feature the parent property, as each Global receives its own versions collection. That means we know that all versions in that collection correspond to that specific global.

## Version Operations

Versions expose new operations for both collections and globals. They allow you to find and query versions, find a single version by ID, and publish (or restore) a version by ID. Both Collections and Globals support the same new operations. They are used primarily by the admin UI, but if you are writing custom logic in your app and would like to utilize them, they're available for you to use as well via REST, GraphQL, and Local APIs.

### Collection REST endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/{collectionSlug}/versions` | Find and query paginated versions |
| GET | `/api/{collectionSlug}/versions/:id` | Find a specific version by ID |
| POST | `/api/{collectionSlug}/versions/:id` | Restore a version by ID |

### Collection GraphQL queries

| Query Name | Operation |
|------------|-----------|
| `version{collection.label.singular}` | findVersionByID |
| `versions{collection.label.plural}` | findVersions |

And mutation:

| Query Name | Operation |
|------------|-----------|
| `restoreVersion{collection.label.singular}` | restoreVersion |

### Collection Local API methods

#### Find
```javascript
// Result will be a paginated set of Versions.
// See /docs/queries/pagination for more.
const result = await payload.findVersions({
  collection: 'posts', // required
  depth: 2,
  page: 1,
  limit: 10,
  where: {}, // pass a `where` query here
  sort: '-createdAt',
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

#### Find by ID
```javascript
// Result will be a Post document.
const result = await payload.findVersionByID({
  collection: 'posts', // required
  id: '507f1f77bcf86cd799439013', // required
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

#### Restore
```javascript
// Result will be the restored global document.
const result = await payload.restoreVersion({
  collection: 'posts', // required
  id: '507f1f77bcf86cd799439013', // required
  depth: 2,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

### Global REST endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/globals/{globalSlug}/versions` | Find and query paginated versions |
| GET | `/api/globals/{globalSlug}/versions/:id` | Find a specific version by ID |
| POST | `/api/globals/{globalSlug}/versions/:id` | Restore a version by ID |

### Global GraphQL queries

| Query Name | Operation |
|------------|-----------|
| `version{global.label}` | findVersionByID |
| `versions{global.label}` | findVersions |

### Global GraphQL mutation

| Query Name | Operation |
|------------|-----------|
| `restoreVersion{global.label}` | restoreVersion |

### Global Local API methods

#### Find
```javascript
// Result will be a paginated set of Versions.
// See /docs/queries/pagination for more.
const result = await payload.findGlobalVersions({
  slug: 'header', // required
  depth: 2,
  page: 1,
  limit: 10,
  where: {}, // pass a `where` query here
  sort: '-createdAt',
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

#### Find by ID
```javascript
// Result will be a Post document.
const result = await payload.findGlobalVersionByID({
  slug: 'header', // required
  id: '507f1f77bcf86cd799439013', // required
  depth: 2,
  locale: 'en',
  fallbackLocale: false,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

#### Restore
```javascript
// Result will be the restored global document.
const result = await payload.restoreGlobalVersion({
  slug: 'header', // required
  id: '507f1f77bcf86cd799439013', // required
  depth: 2,
  user: dummyUser,
  overrideAccess: false,
  showHiddenFields: true,
})
```

## Access Control

Versions expose a new Access Control function on both Collections and Globals that allow for you to control who can see versions of documents, and who can't.

| Function | Allows/Denies Access |
|----------|---------------------|
| readVersions | Used to control who can read versions, and who can't. Will automatically restrict the Admin UI version viewing access. |

For full details on how to use Access Control with Versions, see the Access Control documentation.