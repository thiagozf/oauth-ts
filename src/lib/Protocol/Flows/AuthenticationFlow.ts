import { AccessTokenResponse, ErrorResponse, Result } from '~lib/Api';

export interface AuthenticationFlow {
  readonly authorize: () => Promise<void>;
  readonly silentAuthorize: () => Promise<
    Result<AccessTokenResponse, ErrorResponse>
  >;
}
