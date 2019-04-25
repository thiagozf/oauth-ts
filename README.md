# oauth.js

OAuth 2.0 authentication library

## How to use

```typescript
// index.ts

import { OAuth, ImplicitGrant } from 'oauth.js';

const oauth: OAuth = new OAuth({
  domain: 'https://my.oauth.provider.com',
  client_id: 'my_client_id',
  redirect_uri: 'http://localhost:8080/callback',
  scope: 'read,write'
});

const grant: ImplicitGrant = new ImplicitGrant(oauth);

grant.authorize();

// callback.ts
import { tokenResponseFromFragment } from 'oauth.js';

console.log(JSON.stringify(tokenResponseFromFragment()));
```
