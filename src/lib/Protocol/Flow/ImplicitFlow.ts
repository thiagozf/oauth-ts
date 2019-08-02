import {
  AccessTokenResponse,
  Api,
  AuthSession,
  SessionStateResponse
} from '~lib/Api';

import {
  IFrameAuthenticationHandler,
  RedirectAuthenticationHandler
} from '../Handlers';

import { getHashFragment } from '~lib/Helpers';
import { deserializeResponse } from '~lib/Parsers/AuthServerResponseDeserializer';
import { AuthenticationFlow } from './AuthenticationFlow';

export class ImplicitFlow implements AuthenticationFlow {
  private readonly api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  public readonly authorize = (): Promise<void> => {
    return RedirectAuthenticationHandler.navigate(this.getAuthorizeURL());
  };

  public readonly handleAuthorizeResponse = async (): Promise<AuthSession> => {
    return this.handleBasicAuthorize();
  };

  public readonly silentAuthorize = async (): Promise<AuthSession> => {
    const serializedResponse: string = await IFrameAuthenticationHandler.navigate(
      this.getAuthorizeURL(true)
    );
    return this.handleBasicAuthorize(serializedResponse);
  };

  private readonly handleBasicAuthorize = async (
    serializedResponse: string = getHashFragment()
  ): Promise<AuthSession> => {
    const accessToken: AccessTokenResponse = await deserializeResponse(
      serializedResponse
    );
    const sessionState: SessionStateResponse = await deserializeResponse(
      serializedResponse
    );
    return { accessToken, sessionState };
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
