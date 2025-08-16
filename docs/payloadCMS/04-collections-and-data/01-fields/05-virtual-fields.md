# Payload Virtual Fields

This document covers virtual fields in Payload CMS that display computed or related data without storing it directly in the database.

## Join Field

The Join Field is used to make Relationship and Upload fields available in the opposite direction. With a Join you can edit and view collections having reference to a specific collection document. The field itself acts as a virtual field, in that no new data is stored on the collection with a Join field. Instead, the Admin UI surfaces the related documents for a better editing experience and is surfaced by Payload's APIs.

```typescript
import type { Field } from "payload";

export const MyJoinField: Field = {
    name: "relatedPosts",
    type: "join",
    collection: "posts",
    on: "category",
};
```

### Join Field Use Cases

The Join field is useful for scenarios including:

- Surface Orders for a given Product
- View and edit Posts belonging to a Category
- Work with any bi-directional relationship data
- Display where a document or upload is used in other documents
- Control your own database schema and junction tables

### Join Field Requirements

For the Join field to work, you must have an existing relationship or upload field in the collection you are joining that references the collection and path of the field.

**Example Setup:**

```typescript
// Join field in categories collection
export const MyJoinField: Field = {
    name: "relatedPosts",
    type: "join",
    collection: "posts",
    on: "category",
};

// Corresponding relationship field in posts collection
export const MyRelationshipField: Field = {
    name: "category",
    type: "relationship",
    relationTo: "categories",
};
```

### Join Field Config Options

| Option             | Description                                                                                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`             | To be used as the property name when retrieved from the database                                                                                                                                                                     |
| `collection`       | The slugs having the relationship field or an array of collection slugs                                                                                                                                                              |
| `on`               | The name of the relationship or upload field that relates to the collection document. Use dot notation for nested paths, like 'myGroup.relationName'. If collection is an array, this field must exist for all specified collections |
| `orderable`        | If true, enables custom ordering and joined documents can be reordered via drag and drop. Uses fractional indexing for efficient reordering                                                                                          |
| `where`            | A Where query to hide related documents from appearing. Will be merged with any where specified in the request                                                                                                                       |
| `maxDepth`         | Default is 1, Sets a maximum population depth for this field, regardless of the remaining depth when this field is reached                                                                                                           |
| `label`            | Text used as a field label in the Admin Panel or an object with keys for each language                                                                                                                                               |
| `hooks`            | Provide Field Hooks to control logic for this field                                                                                                                                                                                  |
| `access`           | Provide Field Access Control to denote what users can see and do with this field's data                                                                                                                                              |
| `defaultLimit`     | The number of documents to return. Set to 0 to return all related documents                                                                                                                                                          |
| `defaultSort`      | The field name used to specify the order the joined documents are returned                                                                                                                                                           |
| `admin`            | Admin-specific configuration                                                                                                                                                                                                         |
| `custom`           | Extension point for adding custom data (e.g. for plugins)                                                                                                                                                                            |
| `typescriptSchema` | Override field type generation with providing a JSON schema                                                                                                                                                                          |
| `graphQL`          | Custom graphQL configuration for the field                                                                                                                                                                                           |

### Join Field Admin Options

| Option             | Description                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `defaultColumns`   | Array of field names that correspond to which columns to show in the relationship table. Default is the collection config |
| `allowCreate`      | Set to false to remove the controls for making new related documents from this field                                      |
| `components.Label` | Override the default Label of the Field Component                                                                         |

### Schema Design Best Practices

When modeling your database, you generally only want to store relationship information in one place for several reasons:

1. **Single Source of Truth**: You want to have a "single source of truth" for relationships, and not worry about keeping two sources in sync with one another
2. **Performance**: If you have hundreds, thousands, or even millions of posts, you would not want to store all of those post IDs on a given category
3. **Scalability**: Handle thousands or millions of related documents efficiently

**Example**: For Posts and Categories, store the `category_id` on the post, not an array of `post_ids` on the category. The join field enables bi-directional APIs and UI without data duplication.

### Join Field Data Structure

**Single Collection Join:**

```json
{
    "id": "66e3431a3f23e684075aae9c",
    "relatedPosts": {
        "docs": [
            {
                "id": "66e3431a3f23e684075aaeb9",
                // other fields...
                "category": "66e3431a3f23e684075aae9c"
            }
            // { ... }
        ],
        "hasNextPage": false,
        "totalDocs": 10 // if count: true is passed
    }
    // other fields...
}
```

**Polymorphic Join (multiple collections):**

```json
{
    "id": "66e3431a3f23e684075aae9c",
    "relatedPosts": {
        "docs": [
            {
                "relationTo": "posts",
                "value": {
                    "id": "66e3431a3f23e684075aaeb9",
                    // other fields...
                    "category": "66e3431a3f23e684075aae9c"
                }
            }
            // { ... }
        ],
        "hasNextPage": false,
        "totalDocs": 10 // if count: true is passed
    }
    // other fields...
}
```

### Join Field Query Options

The Join Field supports custom queries to filter, sort, and limit the related documents that will be returned. In addition to the specific query options for each Join Field, you can pass joins: false to disable all Join Field from returning. This is useful for performance reasons when you don't need the related documents.

| Property | Description                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------- |
| `limit`  | The maximum related documents to be returned, default is 10                                    |
| `where`  | An optional Where query to filter joined documents. Will be merged with the field where object |
| `sort`   | A string used to order related results                                                         |
| `count`  | Whether include the count of related documents or not. Not included by default                 |

### Local API Usage

By adding joins to the Local API you can customize the request for each join field by the name of the field.

```typescript
const result = await payload.find({
    collection: "categories",
    where: {
        title: {
            equals: "My Category",
        },
    },
    joins: {
        relatedPosts: {
            limit: 5,
            where: {
                title: {
                    equals: "My Post",
                },
            },
            sort: "title",
        },
    },
});
```

To disable all Join Fields for performance:

```typescript
const result = await payload.find({
    collection: "categories",
    joins: false,
});
```

### REST API Usage

The REST API supports the same query options as the Local API. You can use the joins query parameter to customize the request for each join field by the name of the field:

```
/api/categories/${id}?joins[relatedPosts][limit]=5&joins[relatedPosts][sort]=title
```

You can specify as many joins parameters as needed for the same or different join fields for a single request.

### GraphQL Usage

The GraphQL API supports the same query options as the local and REST APIs. You can specify the query options for each join field in your query.

```graphql
query {
  Categories {
    docs {
      relatedPosts(
        sort: "createdAt"
        limit: 5
        where: { author: { equals: "66e3431a3f23e684075aaeb9" } }
        """
        Optionally pass count: true if you want to retrieve totalDocs
        """
        count: true
      ) {
        docs {
          title
        }
        hasNextPage
        totalDocs
      }
    }
  }
}
```

### Advanced Use Cases

#### Custom Junction Tables

Use Join fields to control your own junction table design and avoid Payload's automatic `_rels` tables:

```typescript
// Custom junction collection
export const CategoriesPosts: CollectionConfig = {
    slug: "categories_posts",
    admin: {
        hidden: true, // Hide from admin navigation
    },
    fields: [
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            required: true,
        },
        {
            name: "post",
            type: "relationship",
            relationTo: "posts",
            required: true,
        },
        {
            name: "featured",
            type: "checkbox",
            defaultValue: false,
        },
        {
            name: "spotlight",
            type: "checkbox",
            defaultValue: false,
        },
    ],
};

// Join fields in both collections
export const Categories: CollectionConfig = {
    slug: "categories",
    fields: [
        {
            name: "relatedPosts",
            type: "join",
            collection: "categories_posts",
            on: "category",
        },
    ],
};

export const Posts: CollectionConfig = {
    slug: "posts",
    fields: [
        {
            name: "relatedCategories",
            type: "join",
            collection: "categories_posts",
            on: "post",
        },
    ],
};
```

#### Context Fields on Relationships

The junction collection approach allows you to add "context" fields to relationships:

- `featured` - Mark certain relationships as featured
- `spotlight` - Highlight specific relationships
- `order` - Custom ordering within the relationship
- `startDate` / `endDate` - Time-based relationship validity

### Performance Considerations

**Important Notes:**

1. **Database Support**: The Join Field is not supported in DocumentDB and Azure Cosmos DB, as we internally use MongoDB aggregations to query data for that field, which are limited there
2. **Query Overhead**: Join fields are extremely performant and do not add additional query overhead to your API responses until you add depth of 1 or above
3. **Implementation**:
    - MongoDB: Uses aggregations to automatically join in related documents
    - Relational DBs: Uses joins
4. **Where Query Limitations**: Where query support on joined documents for join fields with an array of collection is limited and not supported for fields inside arrays and blocks

### Best Practices

1. **Single Source of Truth**: Store relationships in one place, use joins for bi-directional access
2. **Performance**: Use `defaultLimit` and specific queries to avoid loading too much data
3. **Filtering**: Use `where` conditions to show only relevant related documents
4. **Schema Design**: Consider join fields when designing your database relationships
5. **Junction Tables**: Use custom junction collections for complex relationship metadata

### Example: Complete Blog System

```typescript
// Categories collection
export const Categories: CollectionConfig = {
    slug: "categories",
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "posts",
            type: "join",
            collection: "posts",
            on: "category",
            defaultLimit: 10,
            defaultSort: "-publishedDate",
            where: {
                status: { equals: "published" },
            },
        },
    ],
};

// Posts collection
export const Posts: CollectionConfig = {
    slug: "posts",
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            required: true,
        },
        {
            name: "status",
            type: "select",
            options: ["draft", "published"],
            defaultValue: "draft",
        },
        {
            name: "publishedDate",
            type: "date",
        },
    ],
};
```

This setup allows:

- Posts to reference their category
- Categories to display all related published posts
- Efficient querying in both directions
- Single source of truth for the relationship

### Limitations

1. **Database Compatibility**: Not available in DocumentDB and Azure Cosmos DB
2. **Query Complexity**: Limited where query support for polymorphic joins in arrays/blocks
3. **Performance**: Can impact performance with large datasets if not properly limited
4. **Depth Control**: Requires careful depth management to avoid over-fetching

The Join field is extremely powerful for creating sophisticated relationship architectures while maintaining clean database schemas and excellent performance characteristics.
