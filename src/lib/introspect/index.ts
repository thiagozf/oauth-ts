import { ErrorResponse } from '../error/ErrorResponse';
import { OAuthRequest } from '../protocol/OAuthRequest';
import { Result } from '../result';
import { IntrospectParams } from './IntrospectParams';
import {
  IntrospectResponse,
  IntrospectResponseValidator
} from './IntrospectResponse';

export async function introspect(
  domain: string,
  params: IntrospectParams
): Promise<Result<IntrospectResponse, ErrorResponse>> {
  return OAuthRequest({
    query: params,
    url: `${domain}/tokeninfo`,
    validator: IntrospectResponseValidator
  });
}

export { IntrospectParams, IntrospectResponse, IntrospectResponseValidator };
