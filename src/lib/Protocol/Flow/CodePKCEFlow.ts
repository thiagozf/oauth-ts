import {
  AccessTokenResponse,
  Api,
  AuthorizeResponse,
  AuthorizeResponseValidator
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

import { ErrorResponse } from '~lib/Api/ErrorResponse';
import {
  AuthSession,
  SessionStateResponse,
  SessionStateResponseValidator
} from '~lib/Api/Session';
import { getQueryParams } from '~lib/Helpers';
import { deserializeResponse } from '~lib/Parsers/AuthServerResponseDeserializer';
import { Persistence } from '~lib/Persistence';
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

  public readonly handleAuthorizeResponse = async (): Promise<AuthSession> => {
    return this.handleBasicAuthorize();
  };

  public readonly silentAuthorize = async (): Promise<AuthSession> => {
    const serializedResponse: string = await IFrameAuthenticationHandler.navigate(
      this.getAuthorizeURL()
    );
    return this.handleBasicAuthorize(serializedResponse);
  };

  public readonly exchangeCode = async (
    authorizeResponse: AuthorizeResponse,
    silent: boolean = false
  ): Promise<AccessTokenResponse> => {
    const transaction: Transaction<
      CodeChallengePair
    > = this.transactionManager.getStoredTransaction(authorizeResponse.state);

    return !transaction
      ? Promise.reject(
          new ErrorResponse({
            error: 'invalid_state',
            error_description: 'application state not found'
          })
        )
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

  private readonly handleBasicAuthorize = async (
    serializedResponse: string = getQueryParams()
  ): Promise<AuthSession> => {
    const authorizeResponse: AuthorizeResponse = await deserializeResponse(
      AuthorizeResponseValidator,
      serializedResponse
    );
    const sessionState: SessionStateResponse = await deserializeResponse(
      SessionStateResponseValidator,
      serializedResponse
    );
    const accessToken: AccessTokenResponse = await this.exchangeCode(
      authorizeResponse
    );
    return { accessToken, sessionState };
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
