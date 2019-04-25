import { executeHiddenIFrameOperation, navigate } from '../../helpers';
import { AccessTokenResponse, ErrorResponse, OAuth, Result } from '../../OAuth';

export class ImplicitGrant {
  public readonly oauth: OAuth;

  constructor(oauth: OAuth) {
    this.oauth = oauth;
  }

  public readonly getAuthorizeURL = (): string => {
    return this.oauth.api.authorization.getAuthorizeURL({
      response_type: 'token'
    });
  };

  public readonly authorize = (): void => {
    return navigate(this.getAuthorizeURL());
  };

  public readonly refresh = async (): Promise<
    Result<AccessTokenResponse, ErrorResponse>
  > => {
    return executeHiddenIFrameOperation(this.getAuthorizeURL());
  };
}
