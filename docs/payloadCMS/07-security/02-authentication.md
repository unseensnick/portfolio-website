# Payload CMS Authentication Complete Guide

## Table of Contents

1. [Authentication Overview](#authentication-overview)
2. [Configuration Options](#configuration-options)
3. [Authentication Strategies](#authentication-strategies)
4. [Authentication Operations](#authentication-operations)
5. [Email Functionality](#email-functionality)
6. [Token Data Management](#token-data-management)
7. [Access Control](#access-control)

## Authentication Overview

Authentication is a critical part of any application. Payload provides a secure, portable way to manage user accounts out of the box. Payload Authentication is designed to be used in both the Admin Panel, as well as your own external applications, completely eliminating the need for paid, third-party platforms and services.

Here are some common use cases of Authentication in your own applications:

- Customer accounts for an e-commerce app
- User accounts for a SaaS product
- P2P apps or social sites where users need to log in and manage their profiles
- Online games where players need to track their progress over time

When Authentication is enabled on a Collection, Payload injects all necessary functionality to support the entire user flow. This includes all auth-related operations like account creation, logging in and out, and resetting passwords, all auth-related emails like email verification and password reset, as well as any necessary UI to manage users from the Admin Panel.

### Basic Setup

To enable Authentication on a Collection, use the auth property in the Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  // ...
  auth: true, 
}
```

**Note:** By default, Payload provides an auth-enabled User Collection which is used to access the Admin Panel.

**Note:** Auth-enabled Collections will be automatically injected with the hash, salt, and email fields.

## Configuration Options

Any Collection can opt-in to supporting Authentication. Once enabled, each Document that is created within the Collection can be thought of as a "user". This enables a complete authentication workflow on your Collection, such as logging in and out, resetting their password, and more.

### Advanced Configuration

```typescript
import type { CollectionConfig } from 'payload'

export const Admins: CollectionConfig = {
  // ...
  auth: {
    tokenExpiration: 7200, // How many seconds to keep the user logged in
    verify: true, // Require email verification before being allowed to authenticate
    maxLoginAttempts: 5, // Automatically lock a user out after X amount of failed logins
    lockTime: 600 * 1000, // Time period to allow the max login attempts
    // More options are available
  },
}
```

**Tip:** For default auth behavior, set `auth: true`. This is a good starting point for most applications.

### Available Options

| Option | Description |
|--------|-------------|
| `cookies` | Set cookie options, including secure, sameSite, and domain. For advanced users. |
| `depth` | How many levels deep a user document should be populated when creating the JWT and binding the user to the req. Defaults to 0 and should only be modified if absolutely necessary, as this will affect performance. |
| `disableLocalStrategy` | Advanced - disable Payload's built-in local auth strategy. Only use this property if you have replaced Payload's auth mechanisms with your own. |
| `forgotPassword` | Customize the way that the forgotPassword operation functions. |
| `lockTime` | Set the time (in milliseconds) that a user should be locked out if they fail authentication more times than maxLoginAttempts allows for. |
| `loginWithUsername` | Ability to allow users to login with username/password. |
| `maxLoginAttempts` | Only allow a user to attempt logging in X amount of times. Automatically locks out a user from authenticating if this limit is passed. Set to 0 to disable. |
| `removeTokenFromResponses` | Set to true if you want to remove the token from the returned authentication API responses such as login or refresh. |
| `strategies` | Advanced - an array of custom authentication strategies to extend this collection's authentication with. |
| `tokenExpiration` | How long (in seconds) to keep the user logged in. JWTs and HTTP-only cookies will both expire at the same time. |
| `useAPIKey` | Payload Authentication provides for API keys to be set on each user within an Authentication-enabled Collection. |
| `useSessions` | True by default. Set to false to use stateless JWTs for authentication instead of sessions. |
| `verify` | Set to true or pass an object with verification options to require users to verify by email before they are allowed to log into your app. |

### Login With Username

You can allow users to login with their username instead of their email address by setting the `loginWithUsername` property to true.

```typescript
{
  slug: 'customers',
  auth: {
    loginWithUsername: true,
  },
}
```

Or, you can pass an object with additional options:

```typescript
{
  slug: 'customers',
  auth: {
    loginWithUsername: {
      allowEmailLogin: true, // default: false
      requireEmail: false, // default: false
    },
  },
}
```

**allowEmailLogin:** If set to true, users can log in with either their username or email address. If set to false, users can only log in with their username.

**requireEmail:** If set to true, an email address is required when creating a new user. If set to false, email is not required upon creation.

### Auto-Login

For testing and demo purposes you may want to skip forcing the user to login in order to access your application. Typically, all users should be required to login, however, you can speed up local development time by enabling auto-login.

To enable auto-login, set the autoLogin property in the Payload Config:

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    autoLogin:
      process.env.NODE_ENV === 'development'
        ? {
            email: 'test@example.com',
            password: 'test',
            prefillOnly: true,
          }
        : false,
  },
})
```

**Warning:** The recommended way to use this feature is behind an Environment Variable. This will ensure it is disabled in production.

Available options:

| Option | Description |
|--------|-------------|
| `username` | The username of the user to login as |
| `email` | The email address of the user to login as |
| `password` | The password of the user to login as. This is only needed if prefillOnly is set to true |
| `prefillOnly` | If set to true, the login credentials will be prefilled but the user will still need to click the login button. |

## Authentication Strategies

Out of the box Payload ships with three powerful Authentication strategies:

- HTTP-Only Cookies
- JSON Web Tokens (JWT)
- API-Keys

Each of these strategies can work together or independently. You can also create your own custom strategies to fit your specific needs.

### HTTP-Only Cookies Strategy

Payload offers the ability to Authenticate via HTTP-only cookies. These can be read from the responses of login, logout, refresh, and me auth operations.

**Tip:** You can access the logged-in user from within Access Control and Hooks through the `req.user` argument.

#### Automatic Browser Inclusion

Modern browsers automatically include http-only cookies when making requests directly to URLs—meaning that if you are running your API on https://example.com, and you have logged in and visit https://example.com/test-page, your browser will automatically include the Payload authentication cookie for you.

#### HTTP Authentication

However, if you use fetch or similar APIs to retrieve Payload resources from its REST or GraphQL API, you must specify to include credentials (cookies).

Fetch example, including credentials:

```javascript
const response = await fetch('http://localhost:3000/api/pages', {
  credentials: 'include',
})

const pages = await response.json()
```

**Tip:** To make sure you have a Payload cookie set properly in your browser after logging in, you can use the browsers Developer Tools > Application > Cookies > [your-domain-here]. The Developer tools will still show HTTP-only cookies.

#### CSRF Attacks

CSRF (cross-site request forgery) attacks are common and dangerous. By using an HTTP-only cookie, Payload removes many XSS vulnerabilities, however, CSRF attacks can still be possible.

For example, let's say you have a popular app https://payload-finances.com that allows users to manage finances, send and receive money. As Payload is using HTTP-only cookies, that means that browsers automatically will include cookies when sending requests to your domain - no matter what page created the request.

So, if a user of https://payload-finances.com is logged in and is browsing around on the internet, they might stumble onto a page with malicious intent. Let's look at an example:

```javascript
// malicious-intent.com
// makes an authenticated request as on your behalf

const maliciousRequest = await fetch(`https://payload-finances.com/api/me`, {
  credentials: 'include',
}).then((res) => await res.json())
```

In this scenario, if your cookie was still valid, malicious-intent.com would be able to make requests like the one above on your behalf. This is a CSRF attack.

#### CSRF Prevention

Define domains that you trust and are willing to accept Payload HTTP-only cookie based requests from. Use the csrf option on the base Payload Config to do this:

```typescript
// payload.config.ts

import { buildConfig } from 'payload'

const config = buildConfig({
  serverURL: 'https://my-payload-instance.com',
  csrf: [
    // whitelist of domains to allow cookie auth from
    'https://your-frontend-app.com',
    'https://your-other-frontend-app.com',
    // `config.serverURL` is added by default if defined
  ],
  collections: [
    // collections here
  ],
})

export default config
```

#### Cross Domain Authentication

If your frontend is on a different domain than your Payload API then you will not be able to use HTTP-only cookies for authentication by default as they will be considered third-party cookies by the browser. There are a few strategies to get around this:

**1. Use subdomains**

Cookies can cross subdomains without being considered third party cookies, for example if your API is at api.example.com then you can authenticate from example.com.

**2. Configure cookies**

If option 1 isn't possible, then you can get around this limitation by configuring your cookies on your authentication collection to achieve the following setup:

- SameSite: None // allows the cookie to cross domains
- Secure: true // ensures it's sent over HTTPS only
- HttpOnly: true // ensures it's not accessible via client side JavaScript

Configuration example:

```typescript
{
  slug: 'users',
  auth: {
    cookies: {
      sameSite: 'None',
      secure: true,
    }
  },
  fields: [
    // your auth fields here
  ]
},
```

If you're configuring cors in your Payload config, you won't be able to use a wildcard anymore, you'll need to specify the list of allowed domains.

**Good to know:** Setting up secure: true will not work if you're developing on http://localhost or any non-https domain. For local development you should conditionally set this to false based on the environment.

### JWT Strategy

Payload offers the ability to Authenticate via JSON Web Tokens (JWT). These can be read from the responses of login, logout, refresh, and me auth operations.

**Tip:** You can access the logged-in user from within Access Control and Hooks through the `req.user` argument.

#### Identifying Users Via The Authorization Header

In addition to authenticating via an HTTP-only cookie, you can also identify users via the Authorization header on an HTTP request.

Example:

```javascript
const user = await fetch('http://localhost:3000/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'dev@payloadcms.com',
    password: 'password',
  }),
}).then((req) => await req.json())

const request = await fetch('http://localhost:3000', {
  headers: {
    Authorization: `JWT ${user.token}`,
  },
})
```

#### Omitting The Token

In some cases you may want to prevent the token from being returned from the auth operations. You can do that by setting `removeTokenFromResponses` to true like so:

```typescript
import type { CollectionConfig } from 'payload'

export const UsersWithoutJWTs: CollectionConfig = {
  slug: 'users-without-jwts',
  auth: {
    removeTokenFromResponses: true, 
  },
}
```

### API Key Strategy

To integrate with third-party APIs or services, you might need the ability to generate API keys that can be used to identify as a certain user within Payload. API keys are generated on a user-by-user basis, similar to email and passwords, and are meant to represent a single user.

For example, if you have a third-party service or external app that needs to be able to perform protected actions against Payload, first you need to create a user within Payload, i.e. dev@thirdparty.com. From your external application you will need to authenticate with that user, you have two options:

1. Log in each time with that user and receive an expiring token to request with.
2. Generate a non-expiring API key for that user to request with.

**Tip:** This is particularly useful as you can create a "user" that reflects an integration with a specific external service and assign a "role" or specific access only needed by that service/integration.

Technically, both of these options will work for third-party integrations but the second option with API key is simpler, because it reduces the amount of work that your integrations need to do to be authenticated properly.

To enable API keys on a collection, set the `useAPIKey` auth option to true. From there, a new interface will appear in the Admin Panel for each document within the collection that allows you to generate an API key for each user in the Collection.

```typescript
import type { CollectionConfig } from 'payload'

export const ThirdPartyAccess: CollectionConfig = {
  slug: 'third-party-access',
  auth: {
    useAPIKey: true, 
  },
  fields: [],
}
```

User API keys are encrypted within the database, meaning that if your database is compromised, your API keys will not be.

**Important:** If you change your PAYLOAD_SECRET, you will need to regenerate your API keys.

The secret key is used to encrypt the API keys, so if you change the secret, existing API keys will no longer be valid.

#### HTTP Authentication

To authenticate REST or GraphQL API requests using an API key, set the Authorization header. The header is case-sensitive and needs the slug of the auth.useAPIKey enabled collection, then " API-Key ", followed by the apiKey that has been assigned. Payload's built-in middleware will then assign the user document to req.user and handle requests with the proper Access Control. By doing this, Payload recognizes the request being made as a request by the user associated with that API key.

For example, using Fetch:

```javascript
import Users from '../collections/Users'

const response = await fetch('http://localhost:3000/api/pages', {
  headers: {
    Authorization: `${Users.slug} API-Key ${YOUR_API_KEY}`,
  },
})
```

Payload ensures that the same, uniform Access Control is used across all authentication strategies. This enables you to utilize your existing Access Control configurations with both API keys and the standard email/password authentication. This consistency can aid in maintaining granular control over your API keys.

#### API Key Only Auth

If you want to use API keys as the only authentication method for a collection, you can disable the default local strategy by setting `disableLocalStrategy` to true on the collection's auth property. This will disable the ability to authenticate with email and password, and will only allow for authentication via API key.

```typescript
import type { CollectionConfig } from 'payload'

export const ThirdPartyAccess: CollectionConfig = {
  slug: 'third-party-access',
  auth: {
    useAPIKey: true,
    disableLocalStrategy: true, 
  },
}
```

### Custom Strategies

**This is an advanced feature, so only attempt this if you are an experienced developer. Otherwise, just let Payload's built-in authentication handle user auth for you.**

#### Creating a Strategy

At the core, a strategy is a way to authenticate a user making a request. As of 3.0 we moved away from Passport in favor of pulling back the curtain and putting you in full control.

A strategy is made up of the following:

| Parameter | Description |
|-----------|-------------|
| `name` * | The name of your strategy |
| `authenticate` * | A function that takes in the parameters below and returns a user or null. |

The authenticate function is passed the following arguments:

| Argument | Description |
|----------|-------------|
| `canSetHeaders` * | Whether or not the strategy is being executed from a context where response headers can be set. Default is false. |
| `headers` * | The headers on the incoming request. Useful for retrieving identifiable information on a request. |
| `payload` * | The Payload class. Useful for authenticating the identifiable information against Payload. |
| `isGraphQL` | Whether or not the strategy is being executed within the GraphQL endpoint. Default is false. |

#### Example Strategy

At its core a strategy simply takes information from the incoming request and returns a user. This is exactly how Payload's built-in strategies function.

Your authenticate method should return an object containing a Payload user document and any optional headers that you'd like Payload to set for you when we return a response.

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    strategies: [
      {
        name: 'custom-strategy',
        authenticate: ({ payload, headers }) => {
          const usersQuery = await payload.find({
            collection: 'users',
            where: {
              code: {
                equals: headers.get('code'),
              },
              secret: {
                equals: headers.get('secret'),
              },
            },
          })

          return {
            // Send the user with the collection slug back to authenticate,
            // or send null if no user should be authenticated
            user: usersQuery.docs[0] ? {
              collection: 'users',
              ...usersQuery.docs[0],
            } : null,

            // Optionally, you can return headers
            // that you'd like Payload to set here when
            // it returns the response
            responseHeaders: new Headers({
              'some-header': 'my header value'
            })
          }
        }
      }
    ]
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      index: true,
      unique: true,
    },
    {
      name: 'secret',
      type: 'text',
    },
  ]
}
```

## Authentication Operations

Enabling Authentication on a Collection automatically exposes additional auth-based operations in the Local API, REST API, and GraphQL API.

### Access

The Access operation returns what a logged in user can and can't do with the collections and globals that are registered via your config. This data can be immensely helpful if your app needs to show and hide certain features based on Access Control, just as the Admin Panel does.

REST API endpoint:

```
GET http://localhost:3000/api/access
```

Example response:

```json
{
  "canAccessAdmin": true,
  "collections": {
    "pages": {
      "create": {
        "permission": true,
      },
      "read": {
        "permission": true,
      },
      "update": {
        "permission": true,
      },
      "delete": {
        "permission": true,
      },
      "fields": {
        "title": {
          "create": {
            "permission": true,
          },
          "read": {
            "permission": true,
          },
          "update": {
            "permission": true,
          },
        }
      }
    }
  }
}
```

Example GraphQL Query:

```graphql
query {
  Access {
    pages {
      read {
        permission
      }
    }
  }
}
```

Document access can also be queried on a collection/global basis. Access on a global can be queried like `http://localhost:3000/api/global-slug/access`, Collection document access can be queried like `http://localhost:3000/api/collection-slug/access/:id`.

### Me

Returns either a logged in user with token or null when there is no logged in user.

REST API endpoint:

```
GET http://localhost:3000/api/[collection-slug]/me
```

Example response:

```json
{
  "user": { // The JWT "payload" ;) from the logged in user
    "email": "dev@payloadcms.com",
    "createdAt": "2020-12-27T21:16:45.645Z",
    "updatedAt": "2021-01-02T18:37:41.588Z",
    "id": "5ae8f9bde69e394e717c8832"
  },
  "token": "34o4345324...", // The token that can be used to authenticate the user
  "exp": 1609619861, // Unix timestamp representing when the user's token will expire
}
```

Example GraphQL Query:

```graphql
query {
  me[collection-singular-label] {
    user {
      email
    }
    exp
  }
}
```

### Login

Accepts an email and password. On success, it will return the logged in user as well as a token that can be used to authenticate. In the GraphQL and REST APIs, this operation also automatically sets an HTTP-only cookie including the user's token. If you pass a res to the Local API operation, Payload will set a cookie there as well.

Example REST API login:

```javascript
const res = await fetch('http://localhost:3000/api/[collection-slug]/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'dev@payloadcms.com',
    password: 'this-is-not-our-password...or-is-it?',
  }),
})

const json = await res.json()

// JSON will be equal to the following:
/*
{
  user: {
    email: 'dev@payloadcms.com',
    createdAt: "2020-12-27T21:16:45.645Z",
    updatedAt: "2021-01-02T18:37:41.588Z",
    id: "5ae8f9bde69e394e717c8832"
  },
  token: '34o4345324...',
  exp: 1609619861
}
*/
```

Example GraphQL Mutation:

```graphql
mutation {
  login[collection-singular-label](email: "dev@payloadcms.com", password: "yikes") {
    user {
      email
    }
    exp
    token
  }
}
```

Example Local API login:

```javascript
const result = await payload.login({
  collection: 'collection-slug',
  data: {
    email: 'dev@payloadcms.com',
    password: 'get-out',
  },
})
```

**Server Functions:** Payload offers a ready-to-use login server function that utilizes the Local API.

### Logout

As Payload sets HTTP-only cookies, logging out cannot be done by just removing a cookie in JavaScript, as HTTP-only cookies are inaccessible by JS within the browser. So, Payload exposes a logout operation to delete the token in a safe way.

Example REST API logout:

```javascript
const res = await fetch(
  'http://localhost:3000/api/[collection-slug]/logout?allSessions=false',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
```

Example GraphQL Mutation:

```graphql
mutation {
  logoutUser(allSessions: false)
}
```

**Server Functions:** Payload provides a ready-to-use logout server function that manages the user's cookie for a seamless logout.

#### Logging out with sessions enabled

By default, logging out will only end the session pertaining to the JWT that was used to log out with. However, you can pass `allSessions: true` to the logout operation in order to end all sessions for the user logging out.

### Refresh

Allows for "refreshing" JWTs. If your user has a token that is about to expire, but the user is still active and using the app, you might want to use the refresh operation to receive a new token by executing this operation via the authenticated user.

This operation requires a non-expired token to send back a new one. If the user's token has already expired, you will need to allow them to log in again to retrieve a new token.

If successful, this operation will automatically renew the user's HTTP-only cookie and will send back the updated token in JSON.

Example REST API token refresh:

```javascript
const res = await fetch(
  'http://localhost:3000/api/[collection-slug]/refresh-token',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)

const json = await res.json()

// JSON will be equal to the following:
/*
{
  user: {
    email: 'dev@payloadcms.com',
    createdAt: "2020-12-27T21:16:45.645Z",
    updatedAt: "2021-01-02T18:37:41.588Z",
    id: "5ae8f9bde69e394e717c8832"
  },
  refreshedToken: '34o4345324...',
  exp: 1609619861
}
*/
```

Example GraphQL Mutation:

```graphql
mutation {
  refreshToken[collection-singular-label] {
    user {
      email
    }
    refreshedToken
  }
}
```

**Server Functions:** Payload exports a ready-to-use refresh server function that automatically renews the user's token and updates the associated cookie.

### Verify by Email

If your collection supports email verification, the Verify operation will be exposed which accepts a verification token and sets the user's `_verified` property to true, thereby allowing the user to authenticate with the Payload API.

Example REST API user verification:

```javascript
const res = await fetch(
  `http://localhost:3000/api/[collection-slug]/verify/${TOKEN_HERE}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
```

Example GraphQL Mutation:

```graphql
mutation {
  verifyEmail[collection-singular-label](token: "TOKEN_HERE")
}
```

Example Local API verification:

```javascript
const result = await payload.verifyEmail({
  collection: 'collection-slug',
  token: 'TOKEN_HERE',
})
```

**Note:** the token you need to pass to the verifyEmail function is unique to verification and is not the same as the token that you can retrieve from the forgotPassword operation. It can be found on the user document, as a hidden `_verificationToken` field. If you'd like to retrieve this token, you can use the Local API's find or findByID methods, setting `showHiddenFields: true`.

**Note:** if you do not have a `config.serverURL` set, Payload will attempt to create one for you if the user was created via REST or GraphQL by looking at the incoming req. But this is not supported if you are creating the user via the Local API's `payload.create()` method. If this applies to you, and you do not have a serverURL set, you may want to override your `verify.generateEmailHTML` function to provide a full URL to link the user to a proper verification page.

### Unlock

If a user locks themselves out and you wish to deliberately unlock them, you can utilize the Unlock operation. The Admin Panel features an Unlock control automatically for all collections that feature max login attempts, but you can programmatically unlock users as well by using the Unlock operation.

To restrict who is allowed to unlock users, you can utilize the unlock access control function.

Example REST API unlock:

```javascript
const res = await fetch(`http://localhost:3000/api/[collection-slug]/unlock`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

Example GraphQL Mutation:

```graphql
mutation {
  unlock[collection-singular-label]
}
```

Example Local API unlock:

```javascript
const result = await payload.unlock({
  collection: 'collection-slug',
})
```

### Forgot Password

Payload comes with built-in forgot password functionality. Submitting an email address to the Forgot Password operation will generate an email and send it to the respective email address with a link to reset their password.

The link to reset the user's password contains a token which is what allows the user to securely reset their password.

By default, the Forgot Password operations send users to the Admin Panel to reset their password, but you can customize the generated email to send users to the frontend of your app instead by overriding the email HTML.

Example REST API Forgot Password:

```javascript
const res = await fetch(
  `http://localhost:3000/api/[collection-slug]/forgot-password`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'dev@payloadcms.com',
    }),
  },
)
```

Example GraphQL Mutation:

```graphql
mutation {
  forgotPassword[collection-singular-label](email: "dev@payloadcms.com")
}
```

Example Local API forgot password:

```javascript
const token = await payload.forgotPassword({
  collection: 'collection-slug',
  data: {
    email: 'dev@payloadcms.com',
  },
  disableEmail: false, // you can disable the auto-generation of email via Local API
})
```

**Note:** if you do not have a `config.serverURL` set, Payload will attempt to create one for you if the forgot-password operation was triggered via REST or GraphQL by looking at the incoming req. But this is not supported if you are calling `payload.forgotPassword()` via the Local API. If you do not have a serverURL set, you may want to override your `auth.forgotPassword.generateEmailHTML` function to provide a full URL to link the user to a proper reset-password page.

**Tip:** You can stop the reset-password email from being sent via using the Local API. This is helpful if you need to create user accounts programmatically, but not set their password for them. This effectively generates a reset password token which you can then use to send to a page you create, allowing a user to "complete" their account by setting their password. In the background, you'd use the token to "reset" their password.

### Reset Password

After a user has "forgotten" their password and a token is generated, that token can be used to send to the reset password operation along with a new password which will allow the user to reset their password securely.

Example REST API Reset Password:

```javascript
const res = await fetch(`http://localhost:3000/api/[collection-slug]/reset-password`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: 'TOKEN_GOES_HERE'
    password: 'not-today',
  }),
});

const json = await res.json();

// JSON will be equal to the following:
/*
{
  user: {
    email: 'dev@payloadcms.com',
    createdAt: "2020-12-27T21:16:45.645Z",
    updatedAt: "2021-01-02T18:37:41.588Z",
    id: "5ae8f9bde69e394e717c8832"
  },
  token: '34o4345324...',
  exp: 1609619861
}
*/
```

Example GraphQL Mutation:

```graphql
mutation {
  resetPassword[collection-singular-label](token: "TOKEN_GOES_HERE", password: "not-today")
}
```

## Email Functionality

Authentication ties directly into the Email functionality that Payload provides. This allows you to send emails to users for verification, password resets, and more. While Payload provides default email templates for these actions, you can customize them to fit your brand.

### Email Verification

Email Verification forces users to prove they have access to the email address they can authenticate. This will help to reduce spam accounts and ensure that users are who they say they are.

To enable Email Verification, use the `auth.verify` property on your Collection Config:

```typescript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    verify: true, 
  },
}
```

**Tip:** Verification emails are fully customizable.

The following options are available:

| Option | Description |
|--------|-------------|
| `generateEmailHTML` | Allows for overriding the HTML within emails that are sent to users indicating how to validate their account. |
| `generateEmailSubject` | Allows for overriding the subject of the email that is sent to users indicating how to validate their account. |

#### generateEmailHTML

Function that accepts one argument, containing `{ req, token, user }`, that allows for overriding the HTML within emails that are sent to users indicating how to validate their account. The function should return a string that supports HTML, which can optionally be a full HTML email.

```typescript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    verify: {
      generateEmailHTML: ({ req, token, user }) => {
        // Use the token provided to allow your user to verify their account
        const url = `https://yourfrontend.com/verify?token=${token}`

        return `Hey ${user.email}, verify your email by clicking here: ${url}`
      },
    },
  },
}
```

**Important:** If you specify a different URL to send your users to for email verification, such as a page on the frontend of your app or similar, you need to handle making the call to the Payload REST or GraphQL verification operation yourself on your frontend, using the token that was provided for you. Above, it was passed via query parameter.

#### generateEmailSubject

Similarly to the above `generateEmailHTML`, you can also customize the subject of the email. The function arguments are the same but you can only return a string - not HTML.

```typescript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    verify: {
      generateEmailSubject: ({ req, user }) => {
        return `Hey ${user.email}, reset your password!`
      },
    },
  },
}
```

### Forgot Password

You can customize how the Forgot Password workflow operates with the following options on the `auth.forgotPassword` property:

```typescript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    forgotPassword: {
      // ...
    },
  },
}
```

The following options are available:

| Option | Description |
|--------|-------------|
| `expiration` | Configure how long password reset tokens remain valid, specified in milliseconds. |
| `generateEmailHTML` | Allows for overriding the HTML within emails that are sent to users attempting to reset their password. |
| `generateEmailSubject` | Allows for overriding the subject of the email that is sent to users attempting to reset their password. |

#### generateEmailHTML

This function allows for overriding the HTML within emails that are sent to users attempting to reset their password. The function should return a string that supports HTML, which can be a full HTML email.

```typescript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    forgotPassword: {
      generateEmailHTML: ({ req, token, user }) => {
        // Use the token provided to allow your user to reset their password
        const resetPasswordURL = `https://yourfrontend.com/reset-password?token=${token}`

        return `
          <!doctype html>
          <html>
            <body>
              <h1>Here is my custom email template!</h1>
              <p>Hello, ${user.email}!</p>
              <p>Click below to reset your password.</p>
              <p>
                <a href="${resetPasswordURL}">${resetPasswordURL}</a>
              </p>
            </body>
          </html>
        `
      },
    },
  },
}
```

**Important:** If you specify a different URL to send your users to for resetting their password, such as a page on the frontend of your app or similar, you need to handle making the call to the Payload REST or GraphQL reset-password operation yourself on your frontend, using the token that was provided for you. Above, it was passed via query parameter.

**Tip:** HTML templating can be used to create custom email templates, inline CSS automatically, and more. You can make a reusable function that standardizes all email sent from Payload, which makes sending custom emails more DRY. Payload doesn't ship with an HTML templating engine, so you are free to choose your own.

The following arguments are passed to the `generateEmailHTML` function:

| Argument | Description |
|----------|-------------|
| `req` | The request object. |
| `token` | The token that is generated for the user to reset their password. |
| `user` | The user document that is attempting to reset their password. |

#### generateEmailSubject

Similarly to the above `generateEmailHTML`, you can also customize the subject of the email. The function arguments are the same but you can only return a string - not HTML.

```typescript
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  // ...
  auth: {
    forgotPassword: {
      generateEmailSubject: ({ req, user }) => {
        return `Hey ${user.email}, reset your password!`
      },
    },
  },
}
```

The following arguments are passed to the `generateEmailSubject` function:

| Argument | Description |
|----------|-------------|
| `req` | The request object. |
| `user` | The user document that is attempting to reset their password. |

## Token Data Management

During the lifecycle of a request you will be able to access the data you have configured to be stored in the JWT by accessing `req.user`. The user object is automatically appended to the request for you.

### Defining Token Data

You can specify what data gets encoded to the Cookie/JWT-Token by setting `saveToJWT` property on fields within your auth collection.

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      // will be stored in the JWT
      saveToJWT: true,
      type: 'select',
      name: 'role',
      options: ['super-admin', 'user'],
    },
    {
      // the entire object will be stored in the JWT
      // tab fields can do the same thing!
      saveToJWT: true,
      type: 'group',
      name: 'group1',
      fields: [
        {
          type: 'text',
          name: 'includeField',
        },
        {
          // will be omitted from the JWT
          saveToJWT: false,
          type: 'text',
          name: 'omitField',
        },
      ],
    },
    {
      type: 'group',
      name: 'group2',
      fields: [
        {
          // will be stored in the JWT
          // but stored at the top level
          saveToJWT: true,
          type: 'text',
          name: 'includeField',
        },
        {
          type: 'text',
          name: 'omitField',
        },
      ],
    },
  ],
}
```

**Tip:** If you wish to use a different key other than the field name, you can define `saveToJWT` as a string.

### Using Token Data

This is especially helpful when writing Hooks and Access Control that depend on user defined fields.

```typescript
import type { CollectionConfig } from 'payload'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  access: {
    read: ({ req, data }) => {
      if (!req?.user) return false
      if ({ req.user?.role === 'super-admin'}) {
        return true
      }
      return data.owner === req.user.id
    }
  }
  fields: [
    {
      name: 'owner',
      relationTo: 'users'
    },
    // ... other fields
  ],
}
```

## Access Control

Default auth fields including email, username, and password can be overridden by defining a custom field with the same name in your collection config. This allows you to customize the field — including access control — while preserving the underlying auth functionality. For example, you might want to restrict the email field from being updated once it is created, or only allow it to be read by certain user roles. You can achieve this by redefining the field and setting access rules accordingly.

Here's an example of how to restrict access to default auth fields:

```typescript
import type { CollectionConfig } from 'payload'

export const Auth: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'email', // or 'username'
      type: 'text',
      access: {
        create: () => true,
        read: () => false,
        update: () => false,
      },
    },
    {
      name: 'password', // this will be applied to all password-related fields including new password, confirm password.
      type: 'text',
      hidden: true, // needed only for the password field to prevent duplication in the Admin panel
      access: {
        update: () => false,
      },
    },
  ],
}
```

**Note:**

- Access functions will apply across the application — I.e. if read access is disabled on email, it will not appear in the Admin panel UI or API.
- Restricting read on the email or username disables the Unlock action in the Admin panel as this function requires access to a user-identifying field.
- When overriding the password field, you may need to include `hidden: true` to prevent duplicate fields being displayed in the Admin panel.
