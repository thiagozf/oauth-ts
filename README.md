# oauth.js

[![Codecov](https://img.shields.io/codecov/c/gh/thiagozf/oauth.js/master.svg)](https://codecov.io/gh/thiagozf/oauth.js)
[![CircleCI](https://img.shields.io/circleci/project/github/thiagozf/oauth.js/master.svg)](https://circleci.com/gh/thiagozf/oauth.js)

OAuth 2.0 authentication library

## How to use

```typescript
/* index.ts */
import { OAuth, ImplicitFlow } from 'oauth.js';

// A simple OAuth client config
const oauth: OAuth = new OAuth({
  domain: 'https://my.oauth.provider.com',
  client_id: 'my_client_id',
  redirect_uri: 'http://localhost:8080/callback',
  scope: 'read write'
});

// Select an authorization flow - ie: implicit and code
const flow: ImplicitFlow = new ImplicitFlow(oauth);

// Starts the authorization flow
flow.authorize();

/* callback.ts */
import { tokenResponseFromFragment } from 'oauth.js';

// Parse the URL fragment to get the authorization response
console.log(tokenResponseFromFragment());
```
