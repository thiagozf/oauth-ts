import { AccessTokenResponse } from '../Authorization';
import { SessionStateResponse } from './SessionStateResponse';

export interface AuthSession {
  readonly accessToken: AccessTokenResponse;
  readonly sessionState: SessionStateResponse;
}
