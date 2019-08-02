import { OAuthConfig } from '~lib/OAuthConfig';
import { authServerRequest } from '../AuthServerRequest';
import { UserInfoRequest } from './UserInfoRequest';
import { UserInfoResponse } from './UserInfoResponse';

/**
 * The `userinfo` endpoint of the OpenID specification.
 *
 * {@link https://openid.net/specs/openid-connect-core-1_0.html}
 */
export class UserInfo {
  private readonly config: OAuthConfig;

  constructor(config: OAuthConfig) {
    this.config = config;
  }

  /**
   * Calls the `userinfo` endpoint and returns the user's details.
   *
   * @method get
   * @param {IntrospectParams} params the request params.
   * @returns the `userinfo` URL
   */
  public readonly get = async (
    accessToken: string
  ): Promise<UserInfoResponse> => {
    const userInfoRequest: UserInfoRequest = { access_token: accessToken };

    return authServerRequest({
      query: userInfoRequest,
      url: this.config.provider.userinfo_endpoint
    });
  };
}
