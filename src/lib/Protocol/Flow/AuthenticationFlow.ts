import { AccessTokenResponse, ErrorResponse } from '~lib/Api';
import { Result } from '~lib/Result';

export interface AuthenticationFlow {
  readonly authorize: () => Promise<void>;
  readonly handleAuthorizeResponse: () => Promise<AccessTokenResponse>;
  readonly silentAuthorize: () => Promise<
    Result<AccessTokenResponse, ErrorResponse>
  >;
}
