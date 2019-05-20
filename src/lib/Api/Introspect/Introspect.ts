import { OAuthConfig } from '~lib/OAuthConfig';
import { authServerRequest } from '../AuthServerRequest';
import { IntrospectRequest } from './IntrospectRequest';
import {
  IntrospectResponse,
  IntrospectResponseValidator
} from './IntrospectResponse';

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
   * Calls the `introspect` endpoint and returns the token's details.
   *
   * @method get
   * @param {IntrospectParams} params the request params.
   * @returns the `introspect` URL
   */
  public readonly get = async (
    accessToken: string
  ): Promise<IntrospectResponse> => {
    const introspectRequest: IntrospectRequest = { access_token: accessToken };

    return authServerRequest({
      query: introspectRequest,
      url: this.config.provider.introspect_endpoint,
      validator: IntrospectResponseValidator
    });
  };
}
