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

export class CodePKCEFlow {
  public readonly oauth: OAuth;

  constructor(oauth: OAuth) {
    this.oauth = oauth;
  }

  public readonly getAuthorizeURL = (silent: boolean = false): string => {
    const pair: CodeChallengePair = generateCodeChallengePair();
    const transaction: Transaction<CodeChallengePair> = startTransaction(pair);
    return this.oauth.api.authorization.getAuthorizeURL(
      {
        code_challenge: transaction.data.challenge,
        code_challenge_method: 'S256',
        response_type: 'code',
        state: transaction.state
      },
      silent
    );
  };

  public readonly authorize = (): void => {
    return navigate(this.getAuthorizeURL());
  };

  public readonly silentAuthorize = async (): Promise<
    Result<AuthorizeResponse, ErrorResponse>
  > => {
    return executeHiddenIFrameOperation(this.getAuthorizeURL(true));
  };

  public readonly exchangeCode = async (
    authorizeResponse: AuthorizeResponse,
    silent: boolean = false
  ): Promise<Result<AccessTokenResponse, ErrorResponse>> => {
    const transaction: Transaction<CodeChallengePair> = getStoredTransaction(
      authorizeResponse.state
    );

    return !transaction
      ? failure(INVALID_STATE_ERROR)
      : this.oauth.api.authorization.token(
          {
            code: authorizeResponse.code,
            code_verifier:
              transaction && transaction.data
                ? transaction.data.verifier
                : void 0,
            grant_type: 'authorization_code'
          },
          silent
        );
  };
}
