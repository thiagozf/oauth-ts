import {
  AccessTokenResponse,
  AuthorizeResponse,
  BAD_REQUEST_ERROR,
  ErrorResponse,
  failure,
  INVALID_STATE_ERROR,
  OAuthAPI,
  Result
} from '~lib/Api';

import { OAuthConfig } from '~lib/OAuthConfig';

import {
  CodeChallengePair,
  generateCodeChallengePair,
  Transaction,
  TransactionManager
} from '~lib/Protocol';

import {
  IFrameAuthenticationHandler,
  RedirectAuthenticationHandler
} from '../Handlers';

import { AuthenticationFlow } from './AuthenticationFlow';

export class CodePKCEFlow implements AuthenticationFlow {
  public readonly config: OAuthConfig;
  private readonly api: OAuthAPI;
  private readonly transactionManager: TransactionManager<CodeChallengePair>;

  constructor(config: OAuthConfig) {
    this.config = config;
    this.api = new OAuthAPI(config);
    this.transactionManager = new TransactionManager<CodeChallengePair>(
      new config.storage()
    );
  }

  public readonly authorize = (): Promise<void> => {
    return RedirectAuthenticationHandler.navigate(this.getAuthorizeURL());
  };

  public readonly silentAuthorize = async (): Promise<
    Result<AccessTokenResponse, ErrorResponse>
  > => {
    return IFrameAuthenticationHandler.navigate(
      this.getAuthorizeURL(true)
    ).then((result: Result<AuthorizeResponse, ErrorResponse>) => {
      return result.success
        ? this.exchangeCode(result.value, true)
        : failure(BAD_REQUEST_ERROR);
    });
  };

  public readonly exchangeCode = async (
    authorizeResponse: AuthorizeResponse,
    silent: boolean = false
  ): Promise<Result<AccessTokenResponse, ErrorResponse>> => {
    const transaction: Transaction<
      CodeChallengePair
    > = this.transactionManager.getStoredTransaction(authorizeResponse.state);

    return !transaction
      ? failure(INVALID_STATE_ERROR)
      : this.api.authorization.token(
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

  private readonly getAuthorizeURL = (silent: boolean = false): string => {
    const pair: CodeChallengePair = generateCodeChallengePair();
    const transaction: Transaction<
      CodeChallengePair
    > = this.transactionManager.startTransaction(pair);
    return this.api.authorization.getAuthorizeURL(
      {
        code_challenge: transaction.data.challenge,
        code_challenge_method: 'S256',
        response_type: 'code',
        state: transaction.state
      },
      silent
    );
  };
}
