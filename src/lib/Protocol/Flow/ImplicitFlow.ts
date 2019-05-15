import { AccessTokenResponse, Api, ErrorResponse } from '~lib/Api';

import {
  IFrameAuthenticationHandler,
  RedirectAuthenticationHandler
} from '../Handlers';

import { AuthenticationFlow } from './AuthenticationFlow';

import { tokenResponseFromFragment } from '~lib/Parsers';
import { Result } from '~lib/Result';

export class ImplicitFlow implements AuthenticationFlow {
  private readonly api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  public readonly authorize = (): Promise<void> => {
    return RedirectAuthenticationHandler.navigate(this.getAuthorizeURL());
  };

  public readonly handleAuthorizeResponse = (): Promise<
    AccessTokenResponse
  > => {
    const result: Result<
      AccessTokenResponse,
      ErrorResponse
    > = tokenResponseFromFragment();
    return result.success
      ? Promise.resolve(result.value)
      : Promise.reject(result.failure);
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
