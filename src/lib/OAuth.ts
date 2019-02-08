export * from './authorization';
export * from './introspect';

// import { ErrorResponse } from './error/ErrorResponse';
// import { introspect, IntrospectResponse } from './introspect';
// import { authorize } from './authorization';
// import { Result } from './utils/Result';

// interface OAuthOptions {
//   readonly domain: string;
//   readonly clientId: string;
//   readonly redirectUri: string;
//   readonly scope: string;
// }

// export class OAuth {
//   public readonly domain: string;
//   public readonly clientId: string;
//   public readonly redirectUri: string;
//   public readonly scope: string;

//   constructor({ domain, clientId, redirectUri, scope = 'read' }: OAuthOptions) {
//     this.domain = domain;
//     this.clientId = clientId;
//     this.scope = scope;
//     this.redirectUri = redirectUri;
//   }

//   public introspect(
//     token: string
//   ): Promise<Result<IntrospectResponse, ErrorResponse>> {
//     return introspect(this.domain, { access_token: token });
//   }

//   public authorize() {
//     authorize(this.domain, {
//       client_id: this.clientId,
//       redirect_uri: this.redirectUri,
//       response_type: 'token',
//       scope: this.scope
//     });
//   }
// }
