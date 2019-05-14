import { OpenIDProvider } from './Provider';
import { CookieOAuthStorage, OAuthStorage } from './Storage';

export interface OAuthConfigParams {
  readonly provider: OpenIDProvider;
  readonly scope: string;
  readonly clientId: string;
  readonly clientSecret?: string;
  readonly redirectUri: string;
  readonly silentRedirectUri?: string;
  readonly storage?: new <T extends object>() => OAuthStorage<T>;
}

export class OAuthConfig {
  public readonly provider: OpenIDProvider;
  public readonly scope: string;
  public readonly clientId: string;
  public readonly clientSecret?: string;
  public readonly redirectUri: string;
  public readonly silentRedirectUri?: string;
  public readonly storage: new <T extends object>() => OAuthStorage<T>;

  constructor({
    provider,
    scope,
    clientId,
    clientSecret,
    redirectUri,
    silentRedirectUri,
    storage = CookieOAuthStorage
  }: OAuthConfigParams) {
    this.provider = provider;
    this.scope = scope;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.silentRedirectUri = silentRedirectUri;
    this.storage = storage;
  }
}
