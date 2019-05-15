import { PersistenceType } from './Persistence';
import { FlowType } from './Protocol';
import { OpenIDProvider } from './Provider';

export interface OAuthConfig {
  readonly provider: OpenIDProvider;
  readonly scope: string;
  readonly clientId: string;
  readonly clientSecret?: string;
  readonly redirectUri: string;
  readonly silentRedirectUri?: string;
  readonly flow?: FlowType;
  readonly persistence?: PersistenceType;
}
