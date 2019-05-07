import { executeHiddenIFrameOperation, navigate } from '../../helpers';
import { AccessTokenResponse, ErrorResponse, OAuth, Result } from '../../OAuth';

export class ImplicitFlow {
  public readonly oauth: OAuth;

  constructor(oauth: OAuth) {
    this.oauth = oauth;
  }

  public readonly getAuthorizeURL = (silent: boolean = false): string => {
    return this.oauth.api.authorization.getAuthorizeURL(
      {
        response_type: 'token'
      },
      silent
    );
  };

  public readonly authorize = (): void => {
    return navigate(this.getAuthorizeURL());
  };

  public readonly silentAuthorize = async (): Promise<
    Result<AccessTokenResponse, ErrorResponse>
  > => {
    return executeHiddenIFrameOperation(this.getAuthorizeURL(true));
  };
}
