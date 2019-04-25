import { OAuthConfig } from '../../OAuth';
import { authServerRequest } from '../AuthServerRequest';
import { ErrorResponse } from '../Errors';
import { Result } from '../Result';
import { IntrospectRequest } from './IntrospectRequest';
import {
  IntrospectResponse,
  IntrospectResponseValidator
} from './IntrospectResponse';

export interface IntrospectParams {
  /**
   * the access token to introspect
   */
  readonly access_token: string;
}

/**
 * The introspect endpoint of the OAuth specification, as described by RFC-7662.
 *
 * {@link https://tools.ietf.org/html/rfc7662}
 */
export class Introspect {
  private readonly config: OAuthConfig;

  constructor(config: OAuthConfig) {
    this.config = config;
  }

  /**
   * Calls the `/tokeninfo` endpoint and returns the token's details.
   *
   * @method introspect
   * @param {IntrospectParams} params the request params.
   * @returns the `/tokeninfo` URL
   */
  public readonly introspect = async (
    params: IntrospectParams
  ): Promise<Result<IntrospectResponse, ErrorResponse>> => {
    const introspectRequest: IntrospectRequest = {
      ...params
    };

    return authServerRequest({
      query: introspectRequest,
      url: `${this.config.domain}/tokeninfo`,
      validator: IntrospectResponseValidator
    });
  };
}
