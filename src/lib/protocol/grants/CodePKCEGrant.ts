import { navigate } from '../../helpers';
import { executeHiddenIFrameOperation } from '../../helpers/HiddenIFrameOperation';
import {
  AuthorizationCodeResponse,
  authorize
} from '../../model/Authorization';
import { ErrorResponse } from '../../model/Error';
import { OAuthConfig } from '../../model/OAuthConfig';
import { Failure, Result } from '../../model/Result';
import { AccessTokenResponse, token } from '../../model/Token';
import { INVALID_STATE_ERROR } from '../Errors';
import { CodeChallengePair, generateCodeChallengePair } from '../PKCE';
import {
  getStoredTransaction,
  startTransaction,
  Transaction
} from '../TransactionManager';

export class CodePKCEGrant {
  public readonly config: OAuthConfig;

  constructor(config: OAuthConfig) {
    this.config = config;
  }

  public readonly bootstrap = (): string => {
    const pair: CodeChallengePair = generateCodeChallengePair();
    const transaction: Transaction<CodeChallengePair> = startTransaction(pair);

    return authorize(this.config.domain, {
      client_id: this.config.client_id,
      code_challenge: transaction.data.challenge,
      code_challenge_method: 'S256',
      redirect_uri: this.config.redirect_uri,
      response_type: 'code',
      scope: this.config.scope,
      state: transaction.state
    });
  };

  public readonly authorize = (): void => {
    return navigate(this.bootstrap());
  };

  public readonly refresh = async (): Promise<
    Result<AccessTokenResponse, ErrorResponse>
  > => {
    return executeHiddenIFrameOperation(this.bootstrap()).then(
      this.exchangeCode
    );
  };

  public readonly exchangeCode = async (
    params: AuthorizationCodeResponse
  ): Promise<Result<AccessTokenResponse, ErrorResponse>> => {
    const transaction: Transaction<CodeChallengePair> = getStoredTransaction(
      params.state
    );

    return !transaction
      ? Failure(INVALID_STATE_ERROR)
      : token(this.config.domain, {
          client_id: this.config.client_id,
          code: params.code,
          code_verifier: transaction ? transaction.data.verifier : undefined,
          grant_type: 'authorization_code',
          redirect_uri: this.config.redirect_uri,
          scope: this.config.scope
        });
  };
}
