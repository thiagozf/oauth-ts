import { OAuthConfig } from '~lib/OAuthConfig';
import { Authorization } from './Authorization';
import { Introspect } from './Introspect';
import { UserInfo } from './UserInfo';

export class OAuthAPI {
  public readonly authorization: Authorization;
  public readonly introspect: Introspect;
  public readonly userInfo: UserInfo;

  constructor(config: OAuthConfig) {
    this.authorization = new Authorization(config);
    this.introspect = new Introspect(config);
    this.userInfo = new UserInfo(config);
  }
}
