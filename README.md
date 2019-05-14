# oauth.js

[![Codecov](https://img.shields.io/codecov/c/gh/thiagozf/oauth.js/master.svg)](https://codecov.io/gh/thiagozf/oauth.js)
[![CircleCI](https://img.shields.io/circleci/project/github/thiagozf/oauth.js/master.svg)](https://circleci.com/gh/thiagozf/oauth.js)

OAuth 2.0 authentication library

## How to use

```typescript
/* index.ts */

import {
  OpenIDProvider,
  OAuthConfig,
  ImplicitFlow,
  providerConfiguration
} from 'oauth.js';

// Fetch OpenID provider configuration
const provider: OpenIDProvider = await providerConfiguration(
  'https://my.oidc.provider.com'
);

// Configure a simple OAuth client
const config: OAuthConfig = new OAuthConfig({
  provider,
  clientId: 'my_client_id',
  redirectUri: 'http://localhost:8080/callback',
  silentRedirectUri: 'http://localhost:8080/silent-callback',
  scope: 'read write'
});

// Select an authorization flow - ie: implicit and code
const flow: ImplicitFlow = new ImplicitFlow(config);

// Start the authorization flow
flow.authorize();

/* callback.ts */
import { tokenResponseFromFragment } from 'oauth.js';

// Parse the URL fragment to get the authorization response
console.log(tokenResponseFromFragment());
```
