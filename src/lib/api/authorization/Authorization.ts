import { stringify } from 'qs';
import { OAuthConfig } from '../../OAuth';
import { authServerRequest } from '../AuthServerRequest';
import { ErrorResponse } from '../Errors';
import { Result } from '../Result';
import { AccessTokenRequest } from './AccessTokenRequest';
import {
  AccessTokenResponse,
  AccessTokenResponseValidator
} from './AccessTokenResponse';
import { AuthorizeRequest } from './AuthorizeRequest';

export interface AuthorizeParams {
  /**
   * the expected response type, which can be either `code` or `token`.
   */
  readonly response_type: 'code' | 'token';

  /**
   * the code challenge to secure the authorization with PKCE. {@link https://oauth.net/2/pkce/}.
   */
  readonly code_challenge?: string;

  /**
   * the hash method to use for a PKCE authorization request. {@link https://oauth.net/2/pkce/}.
   */
  readonly code_challenge_method?: string;

  /**
   * tells if the authentication should be done under the hood, in order to fetch a new token for a session that is active.
   */
  readonly silent?: boolean;

  /**
   * a parameter to prevent against CSRF attacks. {@link https://auth0.com/docs/protocols/oauth2/oauth-state}
   */
  readonly state?: string;
}

export interface AccessTokenParams {
  readonly grant_type: string;
  readonly code?: string;
  readonly code_verifier?: string;
  readonly refresh_token?: string;
}

/**
 *
 */
export class Authorization {
  private readonly config: OAuthConfig;

  constructor(config: OAuthConfig) {
    this.config = config;
  }

  /**
   * Builds and returns the `/authorize` URL in order to initialize a new authentication transaction.
   *
   * @method authorize
   * @param {AuthorizeParams} params the request params.
   * @returns the `/authorize` URL
   */
  public readonly getAuthorizeURL = (params: AuthorizeParams): string => {
    const authorizeRequest: AuthorizeRequest = {
      client_id: this.config.client_id,
      redirect_uri: this.config.redirect_uri,
      scope: this.config.scope,
      ...params
    };

    return `${this.config.domain}/authorize?${stringify(authorizeRequest)}`;
  };

  public readonly token = async (
    params: AccessTokenParams
  ): Promise<Result<AccessTokenResponse, ErrorResponse>> => {
    const tokenRequest: AccessTokenRequest = {
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      redirect_uri: this.config.redirect_uri,
      scope: this.config.scope,
      ...params
    };

    return authServerRequest({
      body: tokenRequest,
      method: 'POST',
      url: `${this.config.domain}/token`,
      validator: AccessTokenResponseValidator
    });
  };
}
