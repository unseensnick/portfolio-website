# Payload CMS Uploads and Storage - Complete Documentation

## Overview

Payload provides everything you need to enable file upload, storage, and management directly on your server—including extremely powerful file access control.

### Common Use Cases

Here are some common use cases of Uploads:

- Creating a "Media Library" that contains images for use throughout your site or app
- Building a Gated Content library where users need to sign up to gain access to downloadable assets like ebook PDFs, whitepapers, etc.
- Storing publicly available, downloadable assets like software, ZIP files, MP4s, etc.

### Automatic Collection Modifications

By simply enabling Upload functionality on a Collection, Payload will automatically transform your Collection into a robust file management / storage solution. The following modifications will be made:

- `filename`, `mimeType`, and `filesize` fields will be automatically added to your Collection. Optionally, if you pass `imageSizes` to your Collection's Upload config, a `sizes` array will also be added containing auto-resized image sizes and filenames.
- The Admin Panel will modify its built-in List component to show a thumbnail for each upload within the List View
- The Admin Panel will modify its Edit view(s) to add a new set of corresponding Upload UI which will allow for file upload
- The create, update, and delete Collection operations will be modified to support file upload, re-upload, and deletion

## Enabling Uploads

Every Payload Collection can opt-in to supporting Uploads by specifying the `upload` property on the Collection's config to either `true` or to an object containing upload options.

**Tip:** A common pattern is to create a "media" collection and enable upload on that collection.

### Basic Example

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        // By specifying `undefined` or leaving a height undefined,
        // the image will be sized to a certain width,
        // but it will retain its original aspect ratio
        // and calculate a height automatically.
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
```

## Collection Upload Options

An asterisk denotes that an option is required.

| Option | Description |
|--------|-------------|
| `adminThumbnail` | Set the way that the Admin Panel will display thumbnails for this Collection |
| `bulkUpload` | Allow users to upload in bulk from the list view, default is `true` |
| `cacheTags` | Set to `false` to disable the cache tag set in the UI for the admin thumbnail component. Useful for when CDNs don't allow certain cache queries |
| `constructorOptions` | An object passed to the Sharp image library that accepts any Constructor options and applies them to the upload file |
| `crop` | Set to `false` to disable the cropping tool in the Admin Panel. Crop is enabled by default |
| `disableLocalStorage` | Completely disable uploading files to disk locally |
| `displayPreview` | Enable displaying preview of the uploaded file in Upload fields related to this Collection. Can be locally overridden by displayPreview option in Upload field |
| `externalFileHeaderFilter` | Accepts existing headers and returns the headers after filtering or modifying. If using this option, you should handle the removal of any sensitive cookies (like payload-prefixed cookies) to prevent leaking session information to external services. By default, Payload automatically filters out payload-prefixed cookies when this option is not defined |
| `filesRequiredOnCreate` | Mandate file data on creation, default is `true` |
| `filenameCompoundIndex` | Field slugs to use for a compound index instead of the default filename index |
| `focalPoint` | Set to `false` to disable the focal point selection tool in the Admin Panel. The focal point selector is only available when imageSizes or resizeOptions are defined |
| `formatOptions` | An object with format and options that are used with the Sharp image library to format the upload file |
| `handlers` | Array of Request handlers to execute when fetching a file, if a handler returns a Response it will be sent to the client. Otherwise Payload will retrieve and send back the file |
| `imageSizes` | If specified, image uploads will be automatically resized in accordance to these image sizes |
| `mimeTypes` | Restrict mimeTypes in the file picker. Array of valid mimetypes or mimetype wildcards |
| `pasteURL` | Controls whether files can be uploaded from remote URLs by pasting them into the Upload field. Enabled by default. Accepts `false` to disable or an object with an `allowList` of valid remote URLs |
| `resizeOptions` | An object passed to the Sharp image library to resize the uploaded file |
| `skipSafeFetch` | Set to an `allowList` to skip the safe fetch check when fetching external files. Set to `true` to skip the safe fetch for all documents in this collection. Defaults to `false` |
| `allowRestrictedFileTypes` | Set to `true` to allow restricted file types. If your Collection has defined mimeTypes, restricted file verification will be skipped. Defaults to `false` |
| `staticDir` | The folder directory to use to store media in. Can be either an absolute path or relative to the directory that contains your config. Defaults to your collection slug |
| `trimOptions` | An object passed to the Sharp image library to trim the uploaded file |
| `withMetadata` | If specified, appends metadata to the output image file. Accepts a boolean or a function that receives metadata and req, returning a boolean |
| `hideFileInputOnCreate` | Set to `true` to prevent the admin UI from showing file inputs during document creation, useful for programmatic file generation |
| `hideRemoveFile` | Set to `true` to prevent the admin UI having a way to remove an existing file while editing |
| `modifyResponseHeaders` | Accepts an object with existing headers and allows you to manipulate the response headers for media files |

## Payload-wide Upload Options

Upload options are specifiable on a Collection by Collection basis, you can also control app wide options by passing your base Payload Config an upload property containing an object supportive of all Busboy configuration options.

| Option | Description |
|--------|-------------|
| `abortOnLimit` | A boolean that, if true, returns HTTP 413 if a file exceeds the file size limit. If false, the file is truncated. Defaults to `false` |
| `createParentPath` | Set to `true` to automatically create a directory path when moving files from a temporary directory or buffer. Defaults to `false` |
| `debug` | A boolean that turns upload process logging on if true, or off if false. Useful for troubleshooting. Defaults to `false` |
| `limitHandler` | A function which is invoked if the file is greater than configured limits |
| `parseNested` | Set to `true` to turn req.body and req.files into nested structures. By default req.body and req.files are flat objects. Defaults to `false` |
| `preserveExtension` | Preserves file extensions with the safeFileNames option. Limits file names to 3 characters if true or a custom length if a number, trimming from the start of the extension |
| `responseOnLimit` | A string that is sent in the Response to a client if the file size limit is exceeded when used with abortOnLimit |
| `safeFileNames` | Set to `true` to strip non-alphanumeric characters except dashes and underscores. Can also be set to a regex to determine what to strip. Defaults to `false` |
| `tempFileDir` | A string path to store temporary files used when the useTempFiles option is set to true. Defaults to './tmp' |
| `uploadTimeout` | A number that defines how long to wait for data before aborting, specified in milliseconds. Set to 0 to disable timeout checks. Defaults to 60000 |
| `uriDecodeFileNames` | Set to `true` to apply uri decoding to file names. Defaults to `false` |
| `useTempFiles` | Set to `true` to store files to a temporary directory instead of in RAM, reducing memory usage for large files or many files |

### Example Configuration

A common example of what you might want to customize within Payload-wide Upload options would be to increase the allowed fileSize of uploads sent to Payload:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  collections: [
    {
      slug: 'media',
      fields: [
        {
          name: 'alt',
          type: 'text',
        },
      ],
      upload: true,
    },
  ],
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, written in bytes
    },
  },
})
```

## Custom Filename via Hooks

You can customize the filename before it's uploaded to the server by using a `beforeOperation` hook.

```typescript
beforeOperation: [
  ({ req, operation }) => {
    if ((operation === 'create' || operation === 'update') && req.file) {
      req.file.name = 'test.jpg'
    }
  },
],
```

The `req.file` object will have additional information about the file, such as `mimeType` and `extension`, and you also have full access to the file data itself. The filename from here will also be threaded to image sizes if they're enabled.

## Image Sizes

If you specify an array of `imageSizes` to your upload config, Payload will automatically crop and resize your uploads to fit each of the sizes specified by your config.

The Admin Panel will also automatically display all available files, including width, height, and file size, for each of your uploaded files.

Behind the scenes, Payload relies on **sharp** to perform its image resizing. You can specify additional options for sharp to use while resizing your images.

**Note:** For image resizing to work, sharp must be specified in your Payload Config. This is configured by default if you created your Payload project with create-payload-app.

### Accessing Resized Images in Hooks

All auto-resized images are exposed to be re-used in hooks and similar via an object that is bound to `req.payloadUploadSizes`.

The object will have keys for each size generated, and each key will be set equal to a buffer containing the file data.

### Handling Image Enlargement

When an uploaded image is smaller than the defined image size, we have 3 options:

**withoutEnlargement: undefined | false | true**

- `undefined` [default]: uploading images with smaller width AND height than the image size will return null
- `false`: always enlarge images to the image size
- `true`: if the image is smaller than the image size, return the original image

**Note:** By default, the image size will return NULL when the uploaded image is smaller than the defined image size. Use the `withoutEnlargement` prop to change this.

### Custom File Name per Size

Each image size supports a `generateImageName` function that can be used to generate a custom file name for the resized image. This function receives the original file name, the resize name, the extension, height and width as arguments.

```typescript
{
  name: 'thumbnail',
  width: 400,
  height: 300,
  generateImageName: ({ height, sizeName, extension, width }) => {
    return `custom-${sizeName}-${height}-${width}.${extension}`
  },
}
```

## Crop and Focal Point Selector

This feature is only available for image file types.

Setting `crop: false` and `focalPoint: false` in your Upload config will disable the respective selector in the Admin Panel.

Image cropping occurs before any resizing, the resized images will therefore be generated from the cropped image (not the original image).

If no resizing options are specified (`imageSizes` or `resizeOptions`), the focal point selector will not be displayed.

## Disabling Local Upload Storage

If you are using a plugin to send your files off to a third-party file storage host or CDN, like Amazon S3 or similar, you may not want to store your files locally at all. You can prevent Payload from writing files to disk by specifying `disableLocalStorage: true` on your collection's upload config.

**Note:** This is a fairly advanced feature. If you do disable local file storage, by default, your admin panel's thumbnails will be broken as you will not have stored a file. It will be totally up to you to use either a plugin or your own hooks to store your files in a permanent manner, as well as provide your own admin thumbnail using `upload.adminThumbnail`.

## Admin Thumbnails

You can specify how Payload retrieves admin thumbnails for your upload-enabled Collections with one of the following:

### As a String

`adminThumbnail` as a string, equal to one of your provided image size names.

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    adminThumbnail: 'small',
    imageSizes: [
      {
        name: 'small',
        fit: 'cover',
        height: 300,
        width: 900,
      },
      {
        name: 'large',
        fit: 'cover',
        height: 600,
        width: 1800,
      },
    ],
  },
}
```

### As a Function

`adminThumbnail` as a function that takes the document's data and sends back a full URL to load the thumbnail.

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    adminThumbnail: ({ doc }) =>
      `https://google.com/custom-path-to-file/${doc.filename}`,
  },
}
```

## Restricted File Types

Possibly problematic file types are automatically restricted from being uploaded to your application. If your Collection has defined `mimeTypes` or has set `allowRestrictedFileTypes` to `true`, restricted file verification will be skipped.

### Restricted File Types and Extensions

| File Extensions | MIME Type |
|----------------|-----------|
| exe, dll | application/x-msdownload |
| exe, com, app, action | application/x-executable |
| bat, cmd | application/x-msdos-program |
| exe, com | application/x-ms-dos-executable |
| dmg | application/x-apple-diskimage |
| deb | application/x-debian-package |
| rpm | application/x-redhat-package-manager |
| exe, dll | application/vnd.microsoft.portable-executable |
| msi | application/x-msi |
| jar, ear, war | application/java-archive |
| desktop | application/x-desktop |
| cpl | application/x-cpl |
| lnk | application/x-ms-shortcut |
| pkg | application/x-apple-installer |
| htm, html, shtml, xhtml | text/html |
| php, phtml | application/x-httpd-php |
| js, jse | text/javascript |
| jsp | application/x-jsp |
| py | text/x-python |
| rb | text/x-ruby |
| pl | text/x-perl |
| ps1, psc1, psd1, psh, psm1 | application/x-powershell |
| vbe, vbs | application/x-vbscript |
| ws, wsc, wsf, wsh | application/x-ms-wsh |
| scr | application/x-msdownload |
| asp, aspx | application/x-asp |
| hta | application/x-hta |
| reg | application/x-registry |
| url | application/x-url |
| workflow | application/x-workflow |
| command | application/x-command |

## MimeTypes

Specifying the `mimeTypes` property can restrict what files are allowed from the user's file picker. This accepts an array of strings, which can be any valid mimetype or mimetype wildcards

Some example values are: `image/*`, `audio/*`, `video/*`, `image/png`, `application/pdf`

### Example mimeTypes usage

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/*', 'application/pdf'], 
  },
}
```

## Uploading Files

**Important:** Uploading files is currently only possible through the REST and Local APIs due to how GraphQL works. It's difficult and fairly nonsensical to support uploading files through GraphQL.

### REST API Upload

To upload a file, use your collection's create endpoint. Send it all the data that your Collection requires, as well as a `file` key containing the file that you'd like to upload.

Send your request as a `multipart/form-data` request, using FormData if possible.

**Note:** To include any additional fields (like title, alt, etc.), append a `_payload` field containing a JSON-stringified object of the required values. These values must match the schema of your upload-enabled collection.

```javascript
const fileInput = document.querySelector('#your-file-input')
const formData = new FormData()

formData.append('file', fileInput.files[0])

// Replace with the fields defined in your upload-enabled collection.
// The example below includes an optional field like 'title'.
formData.append(
  '_payload',
  JSON.stringify({
    title: 'Example Title',
    description: 'An optional description for the file',
  }),
)

fetch('api/:upload-slug', {
  method: 'POST',
  body: formData,
  /**
   * Do not manually add the Content-Type Header
   * the browser will handle this.
   *
   * headers: {
   *  'Content-Type': 'multipart/form-data'
   * }
   */
})
```

### Uploading Files Stored Locally

If you want to upload a file stored on your machine directly using the `payload.create` method, for example, during a seed script, you can use the `filePath` property to specify the local path of the file.

```typescript
const localFilePath = path.resolve(__dirname, filename)

await payload.create({
  collection: 'media',
  data: {
    alt,
  },
  filePath: localFilePath,
})
```

The `data` property should still include all the required fields of your media collection.

**Important:** Remember that all custom hooks attached to the media collection will still trigger. Ensure that files match the specified `mimeTypes` or sizes defined in the collection's `formatOptions` or custom hooks.

## Uploading Files from Remote URLs

The `pasteURL` option allows users to fetch files from remote URLs by pasting them into an Upload field. This option is enabled by default and can be configured to either allow unrestricted client-side fetching or restrict server-side fetching to specific trusted domains.

By default, Payload uses client-side fetching, where the browser downloads the file directly from the provided URL. However, client-side fetching will fail if the URL's server has CORS restrictions, making it suitable only for internal URLs or public URLs without CORS blocks.

To fetch files from restricted URLs that would otherwise be blocked by CORS, use server-side fetching by configuring the `pasteURL` option with an `allowList` of trusted domains. This method ensures that Payload downloads the file on the server and streams it to the browser. However, for security reasons, only URLs that match the specified `allowList` will be allowed.

### Configuration Example

Here's how to configure the `pasteURL` option to control remote URL fetching:

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    pasteURL: {
      allowList: [
        {
          hostname: 'payloadcms.com', // required
          pathname: '',
          port: '',
          protocol: 'https',
          search: '',
        },
        {
          hostname: 'example.com',
          pathname: '/images/*',
        },
      ],
    },
  },
}
```

You can also adjust server-side fetching at the upload level as well, this does not effect the CORS policy like the `pasteURL` option does, but it allows you to skip the safe fetch check for specific URLs.

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    skipSafeFetch: [
      {
        hostname: 'example.com',
        pathname: '/images/*',
      },
    ],
  },
}
```

### Accepted Values for pasteURL

| Option | Description |
|--------|-------------|
| `undefined` | Default behavior. Enables client-side fetching for internal or public URLs |
| `false` | Disables the ability to paste URLs into Upload fields |
| `allowList` | Enables server-side fetching for specific trusted URLs. Requires an array of objects defining trusted domains |

### AllowItem Properties

An asterisk denotes that an option is required.

| Option | Description | Example |
|--------|-------------|---------|
| `hostname` * | The hostname of the allowed URL. This is required to ensure the URL is coming from a trusted source | `example.com` |
| `pathname` | The path portion of the URL. Supports wildcards to match multiple paths | `/images/*` |
| `port` | The port number of the URL. If not specified, the default port for the protocol will be used | `3000` |
| `protocol` | The protocol to match. Must be either http or https. Defaults to https | `https` |
| `search` | The query string of the URL. If specified, the URL must match this exact query string | `?version=1` |

## Access Control

All files that are uploaded to each Collection automatically support the `read` Access Control function from the Collection itself. You can use this to control who should be allowed to see your uploads, and who should not.

## Modifying Response Headers

You can modify the response headers for files by specifying the `modifyResponseHeaders` option in your upload config. This option accepts an object with existing headers and allows you to manipulate the response headers for media files.

### Modifying Existing Headers

With this method you can directly interface with the Headers object and modify the existing headers to append or remove headers.

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    modifyResponseHeaders: ({ headers }) => {
      headers.set('X-Frame-Options', 'DENY') // You can directly set headers without returning
    },
  },
}
```

### Return New Headers

You can also return a new Headers object with the modified headers. This is useful if you want to set new headers or remove existing ones.

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    modifyResponseHeaders: ({ headers }) => {
      const newHeaders = new Headers(headers) // Copy existing headers
      newHeaders.set('X-Frame-Options', 'DENY') // Set new header

      return newHeaders
    },
  },
}
```

# Storage Adapters

Payload offers additional storage adapters to handle file uploads. These adapters allow you to store files in different locations, such as Amazon S3, Vercel Blob Storage, Google Cloud Storage, and more.

## Available Storage Adapters

| Service | Package |
|---------|---------|
| Vercel Blob | `@payloadcms/storage-vercel-blob` |
| AWS S3 | `@payloadcms/storage-s3` |
| Azure | `@payloadcms/storage-azure` |
| Google Cloud Storage | `@payloadcms/storage-gcs` |
| Uploadthing | `@payloadcms/storage-uploadthing` |

## Vercel Blob Storage

**Package:** `@payloadcms/storage-vercel-blob`

### Installation

```bash
pnpm add @payloadcms/storage-vercel-blob
# or
npm install @payloadcms/storage-vercel-blob
```

### Usage

- Configure the `collections` object to specify which collections should use the Vercel Blob adapter. The slug must match one of your existing collection slugs.
- Ensure you have `BLOB_READ_WRITE_TOKEN` set in your Vercel environment variables. This is usually set by Vercel automatically after adding blob storage to your project.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client.

```typescript
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    vercelBlobStorage({
      enabled: true, // Optional, defaults to true
      // Specify which collections should use Vercel Blob
      collections: {
        media: true,
        'media-with-prefix': {
          prefix: 'my-prefix',
        },
      },
      // Token provided by Vercel once Blob storage is added to your Vercel project
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `enabled` | Whether or not to enable the plugin | `true` |
| `collections` | Collections to apply the Vercel Blob adapter to | |
| `addRandomSuffix` | Add a random suffix to the uploaded file name in Vercel Blob storage | `false` |
| `cacheControlMaxAge` | Cache-Control max-age in seconds | `365 * 24 * 60 * 60` (1 Year) |
| `token` | Vercel Blob storage read/write token | `''` |
| `clientUploads` | Do uploads directly on the client to bypass limits on Vercel | |

## S3 Storage

**Package:** `@payloadcms/storage-s3`

### Installation

```bash
pnpm add @payloadcms/storage-s3
# or
npm install @payloadcms/storage-s3
```

### Usage

- Configure the `collections` object to specify which collections should use the S3 Storage adapter. The slug must match one of your existing collection slugs.
- The `config` object can be any S3ClientConfig object (from `@aws-sdk/client-s3`). This is highly dependent on your AWS setup. Check the AWS documentation for more information.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client. You must allow CORS PUT method for the bucket to your website.
- Configure `signedDownloads` (either globally of per-collection in collections) to use presigned URLs for files downloading. This can improve performance for large files (like videos) while still respecting your access control. Additionally, with `signedDownloads.shouldUseSignedURL` you can specify a condition whether Payload should use a presigned URL, if you want to use this feature only for specific files.

```typescript
import { s3Storage } from '@payloadcms/storage-s3'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    s3Storage({
      collections: {
        media: true,
        'media-with-prefix': {
          prefix,
        },
        'media-with-presigned-downloads': {
          // Filter only mp4 files
          signedDownloads: {
            shouldUseSignedURL: ({ collection, filename, req }) => {
              return filename.endsWith('.mp4')
            },
          },
        },
      },
      bucket: process.env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        region: process.env.S3_REGION,
        // ... Other S3 configuration
      },
    }),
  ],
})
```

**Configuration Options:** See the AWS SDK Package and S3ClientConfig object for guidance on AWS S3 configuration.

## Azure Blob Storage

**Package:** `@payloadcms/storage-azure`

### Installation

```bash
pnpm add @payloadcms/storage-azure
# or
npm install @payloadcms/storage-azure
```

### Usage

- Configure the `collections` object to specify which collections should use the Azure Blob adapter. The slug must match one of your existing collection slugs.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client. You must allow CORS PUT method to your website.

```typescript
import { azureStorage } from '@payloadcms/storage-azure'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    azureStorage({
      collections: {
        media: true,
        'media-with-prefix': {
          prefix,
        },
      },
      allowContainerCreate:
        process.env.AZURE_STORAGE_ALLOW_CONTAINER_CREATE === 'true',
      baseURL: process.env.AZURE_STORAGE_ACCOUNT_BASEURL,
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
    }),
  ],
})
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `enabled` | Whether or not to enable the plugin | `true` |
| `collections` | Collections to apply the Azure Blob adapter to | |
| `allowContainerCreate` | Whether or not to allow the container to be created if it does not exist | `false` |
| `baseURL` | Base URL for the Azure Blob storage account | |
| `connectionString` | Azure Blob storage connection string | |
| `containerName` | Azure Blob storage container name | |
| `clientUploads` | Do uploads directly on the client to bypass limits on Vercel | |

## Google Cloud Storage

**Package:** `@payloadcms/storage-gcs`

### Installation

```bash
pnpm add @payloadcms/storage-gcs
# or
npm install @payloadcms/storage-gcs
```

### Usage

- Configure the `collections` object to specify which collections should use the Google Cloud Storage adapter. The slug must match one of your existing collection slugs.
- When enabled, this package will automatically set `disableLocalStorage` to `true` for each collection.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client. You must allow CORS PUT method for the bucket to your website.

```typescript
import { gcsStorage } from '@payloadcms/storage-gcs'
import { Media } from './collections/Media'
import { MediaWithPrefix } from './collections/MediaWithPrefix'

export default buildConfig({
  collections: [Media, MediaWithPrefix],
  plugins: [
    gcsStorage({
      collections: {
        media: true,
        'media-with-prefix': {
          prefix,
        },
      },
      bucket: process.env.GCS_BUCKET,
      options: {
        apiEndpoint: process.env.GCS_ENDPOINT,
        projectId: process.env.GCS_PROJECT_ID,
      },
    }),
  ],
})
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `enabled` | Whether or not to enable the plugin | `true` |
| `collections` | Collections to apply the storage to | |
| `bucket` | The name of the bucket to use | |
| `options` | Google Cloud Storage client configuration. See Docs | |
| `acl` | Access control list for files that are uploaded | Private |
| `clientUploads` | Do uploads directly on the client to bypass limits on Vercel | |

## Uploadthing Storage

**Package:** `@payloadcms/storage-uploadthing`

### Installation

```bash
pnpm add @payloadcms/storage-uploadthing
# or
npm install @payloadcms/storage-uploadthing
```

### Usage

- Configure the `collections` object to specify which collections should use uploadthing. The slug must match one of your existing collection slugs and be an upload type.
- Get a token from Uploadthing and set it as `token` in the options object.
- `acl` is optional and defaults to `public-read`.
- When deploying to Vercel, server uploads are limited with 4.5MB. Set `clientUploads` to `true` to do uploads directly on the client.

```typescript
export default buildConfig({
  collections: [Media],
  plugins: [
    uploadthingStorage({
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
  ],
})
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `token` | Token from Uploadthing. Required | |
| `acl` | Access control list for files that are uploaded | `public-read` |
| `logLevel` | Log level for Uploadthing | `info` |
| `fetch` | Custom fetch function | `fetch` |
| `defaultKeyType` | Default key type for file operations | `fileKey` |
| `clientUploads` | Do uploads directly on the client to bypass limits on Vercel | |

## Custom Storage Adapters

If you need to create a custom storage adapter, you can use the `@payloadcms/plugin-cloud-storage` package. This package is used internally by the storage adapters mentioned above.

### Installation

```bash
pnpm add @payloadcms/plugin-cloud-storage
# or
npm install @payloadcms/plugin-cloud-storage
```

### Usage

Reference any of the existing storage adapters for guidance on how this should be structured. Create an adapter following the `GeneratedAdapter` interface. Then, pass the adapter to the `cloudStorage` plugin.

```typescript
export interface GeneratedAdapter {
  /**
   * Additional fields to be injected into the base
   * collection and image sizes
   */
  fields?: Field[]
  /**
   * Generates the public URL for a file
   */
  generateURL?: GenerateURL
  handleDelete: HandleDelete
  handleUpload: HandleUpload
  name: string
  onInit?: () => void
  staticHandler: StaticHandler
}
```

```typescript
import { buildConfig } from 'payload'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'

export default buildConfig({
  plugins: [
    cloudStorage({
      collections: {
        'my-collection-slug': {
          adapter: theAdapterToUse, // see docs for the adapter you want to use
        },
      },
    }),
  ],
  // The rest of your config goes here
})
```

### Plugin Options

This plugin is configurable to work across many different Payload collections. A * denotes that the property is required.

| Option | Type | Description |
|--------|------|-------------|
| `collections` * | `Record<string, CollectionOptions>` | Object with keys set to the slug of collections you want to enable the plugin for, and values set to collection-specific options |
| `enabled` | `boolean` | To conditionally enable/disable plugin. Default: `true` |

### Collection-specific Options

| Option | Type | Description |
|--------|------|-------------|
| `adapter` * | `Adapter` | Pass in the adapter that you'd like to use for this collection. You can also set this field to `null` for local development if you'd like to bypass cloud storage in certain scenarios and use local storage |
| `disableLocalStorage` | `boolean` | Choose to disable local storage on this collection. Defaults to `true` |
| `disablePayloadAccessControl` | `true` | Set to `true` to disable Payload's Access Control |
| `prefix` | `string` | Set to `media/images` to upload files inside `media/images` folder in the bucket |
| `generateFileURL` | `GenerateFileURL` | Override the generated file URL with one that you create |

## Payload Access Control

Payload ships with Access Control that runs even on statically served files. The same `read` Access Control property on your upload-enabled collections is used, and it allows you to restrict who can request your uploaded files.

To preserve this feature, by default, this plugin keeps all file URLs exactly the same. Your file URLs won't be updated to point directly to your cloud storage source, as in that case, Payload's Access control will be completely bypassed and you would need public readability on your cloud-hosted files.

Instead, all uploads will still be reached from the default `/collectionSlug/staticURL/filename` path. This plugin will "pass through" all files that are hosted on your third-party cloud service—with the added benefit of keeping your existing Access Control in place.

If this does not apply to you (your upload collection has `read: () => true` or similar) you can disable this functionality by setting `disablePayloadAccessControl` to `true`. When this setting is in place, this plugin will update your file URLs to point directly to your cloud host.

## Conditionally Enabling/Disabling

The proper way to conditionally enable/disable this plugin is to use the `enabled` property.

```typescript
cloudStoragePlugin({
  enabled: process.env.MY_CONDITION === 'true',
  collections: {
    'my-collection-slug': {
      adapter: theAdapterToUse, // see docs for the adapter you want to use
    },
  },
}),
```