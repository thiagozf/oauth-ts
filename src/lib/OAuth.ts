import { OAuthAPI } from './api';

export interface OAuthConfig {
  readonly domain: string;
  readonly scope: string;
  readonly client_id: string;
  readonly client_secret?: string;
  readonly redirect_uri: string;
  readonly silent_redirect_uri?: string;
}

export class OAuth {
  public readonly config: OAuthConfig;
  public readonly api: OAuthAPI;

  constructor(config: OAuthConfig) {
    this.config = config;
    this.api = new OAuthAPI(config);
  }
}

export * from './protocol';
export * from './api';
