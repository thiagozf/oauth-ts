import { OAuthConfig } from '../OAuth';
import { Authorization } from './authorization';
import { Introspect } from './introspect';

export class OAuthAPI {
  public readonly authorization: Authorization;
  public readonly introspect: Introspect;

  constructor(config: OAuthConfig) {
    this.authorization = new Authorization(config);
    this.introspect = new Introspect(config);
  }
}

export * from './Errors';
export * from './Result';
export * from './authorization';
export * from './introspect';
