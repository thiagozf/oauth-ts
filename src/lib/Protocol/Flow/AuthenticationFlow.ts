import { AuthSession } from '~lib/Api/Session';

export interface AuthenticationFlow {
  readonly authorize: () => Promise<void>;
  readonly handleAuthorizeResponse: () => Promise<AuthSession>;
  readonly silentAuthorize: () => Promise<AuthSession>;
}
