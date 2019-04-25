import {
  AccessTokenResponse,
  AuthorizeResponse,
  ErrorResponse,
  failure,
  INVALID_STATE_ERROR,
  Result
} from '../../api';
import { navigate } from '../../helpers';
import { executeHiddenIFrameOperation } from '../../helpers/HiddenIFrameOperation';
import { OAuth } from '../../OAuth';
import { CodeChallengePair, generateCodeChallengePair } from '../PKCE';
import {
  getStoredTransaction,
  startTransaction,
  Transaction
} from '../TransactionManager';

export class CodePKCEGrant {
  public readonly oauth: OAuth;

  constructor(oauth: OAuth) {
    this.oauth = oauth;
  }

  public readonly getAuthorizeURL = (): string => {
    const pair: CodeChallengePair = generateCodeChallengePair();
    const transaction: Transaction<CodeChallengePair> = startTransaction(pair);
    return this.oauth.api.authorization.getAuthorizeURL({
      code_challenge: transaction.data.challenge,
      code_challenge_method: 'S256',
      response_type: 'code',
      state: transaction.state
    });
  };

  public readonly authorize = (): void => {
    return navigate(this.getAuthorizeURL());
  };

  public readonly refresh = async (): Promise<
    Result<AccessTokenResponse, ErrorResponse>
  > => {
    return executeHiddenIFrameOperation(this.getAuthorizeURL()).then(
      this.exchangeCode
    );
  };

  public readonly exchangeCode = async (
    params: AuthorizeResponse
  ): Promise<Result<AccessTokenResponse, ErrorResponse>> => {
    const transaction: Transaction<CodeChallengePair> = getStoredTransaction(
      params.state
    );

    return !transaction
      ? failure(INVALID_STATE_ERROR)
      : this.oauth.api.authorization.token({
          code: params.code,
          code_verifier:
            transaction && transaction.data
              ? transaction.data.verifier
              : undefined,
          grant_type: 'authorization_code'
        });
  };
}
