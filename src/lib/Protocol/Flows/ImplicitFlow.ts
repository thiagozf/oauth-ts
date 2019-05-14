import { AccessTokenResponse, ErrorResponse, OAuthAPI, Result } from '~lib/Api';

import { OAuthConfig } from '~lib/OAuthConfig';

import {
  IFrameAuthenticationHandler,
  RedirectAuthenticationHandler
} from '../Handlers';

import { AuthenticationFlow } from './AuthenticationFlow';

export class ImplicitFlow implements AuthenticationFlow {
  public readonly config: OAuthConfig;
  private readonly api: OAuthAPI;

  constructor(config: OAuthConfig) {
    this.config = config;
    this.api = new OAuthAPI(config);
  }

  public readonly authorize = (): Promise<void> => {
    return RedirectAuthenticationHandler.navigate(this.getAuthorizeURL());
  };

  public readonly silentAuthorize = async (): Promise<
    Result<AccessTokenResponse, ErrorResponse>
  > => {
    return IFrameAuthenticationHandler.navigate(this.getAuthorizeURL(true));
  };

  private readonly getAuthorizeURL = (silent: boolean = false): string => {
    return this.api.authorization.getAuthorizeURL(
      {
        response_type: 'token'
      },
      silent
    );
  };
}
