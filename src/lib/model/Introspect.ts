import * as t from 'io-ts';
import { ErrorResponse } from './Error';
import { OAuthRequest } from './OAuthRequest';
import { Result } from './Result';

export const IntrospectParamsValidator = t.type({
  access_token: t.string
});

export type IntrospectParams = t.TypeOf<typeof IntrospectParamsValidator>;

export const ClientInfoValidator = t.type({
  attributes: t.record(t.string, t.any),
  client_id: t.string,
  name: t.string
});

export type ClientInfo = t.TypeOf<typeof ClientInfoValidator>;

export const UserValidator = t.type({
  attributes: t.record(t.string, t.any),
  id: t.string
});

export type User = t.TypeOf<typeof UserValidator>;

export const IntrospectResponseValidator = t.type({
  client: ClientInfoValidator,
  expires_in: t.string,
  scopes: t.string,
  user: UserValidator
});

export type IntrospectResponse = t.TypeOf<typeof IntrospectResponseValidator>;

export const introspect = async (
  domain: string,
  params: IntrospectParams
): Promise<Result<IntrospectResponse, ErrorResponse>> => {
  return OAuthRequest({
    query: params,
    url: `${domain}/tokeninfo`,
    validator: IntrospectResponseValidator
  });
};
