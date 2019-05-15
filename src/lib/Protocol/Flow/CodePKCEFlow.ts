import {
  AccessTokenResponse,
  Api,
  AuthorizeResponse,
  BAD_REQUEST_ERROR,
  ErrorResponse,
  INVALID_STATE_ERROR
} from '~lib/Api';

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

import { authorizeResponseFromQueryParams } from '~lib/Parsers';
import { Persistence } from '~lib/Persistence';
import { failure, Result } from '~lib/Result';
import { AuthenticationFlow } from './AuthenticationFlow';

export class CodePKCEFlow implements AuthenticationFlow {
  private readonly api: Api;
  private readonly transactionManager: TransactionManager<CodeChallengePair>;

  constructor(api: Api, storage: Persistence) {
    this.api = api;
    this.transactionManager = new TransactionManager<CodeChallengePair>(
      storage
    );
  }

  public readonly authorize = (): Promise<void> => {
    return RedirectAuthenticationHandler.navigate(this.getAuthorizeURL());
  };

  public readonly handleAuthorizeResponse = async (): Promise<
    AccessTokenResponse
  > => {
    const authorizeResult: Result<
      AuthorizeResponse,
      ErrorResponse
    > = authorizeResponseFromQueryParams();

    if (authorizeResult.failure) {
      return Promise.reject(authorizeResult.failure);
    }

    const tokenResult: Result<
      AccessTokenResponse,
      ErrorResponse
    > = await this.exchangeCode(authorizeResult.value);

    return tokenResult.failure
      ? Promise.reject(tokenResult.failure)
      : Promise.resolve(tokenResult.value);
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
