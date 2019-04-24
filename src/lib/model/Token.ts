import * as t from 'io-ts';
import { parse } from 'qs';
import { ErrorResponse } from './Error';
import { OAuthRequest } from './OAuthRequest';
import { ParseOptions } from './ParseOptions';
import { Result } from './Result';
import { resultOf } from './ResultParser';

export const AccessTokenParamsValidator = t.intersection([
  t.type({
    client_id: t.string,
    grant_type: t.string,
    scope: t.string
  }),
  t.partial({
    client_secret: t.string,
    code: t.string,
    code_verifier: t.string,
    redirect_uri: t.string,
    refresh_token: t.string
  })
]);

export type AccessTokenParams = t.TypeOf<typeof AccessTokenParamsValidator>;

export const AccessTokenResponseValidator = t.intersection([
  t.type({
    access_token: t.string,
    expires_in: t.number,
    scope: t.string,
    token_type: t.string
  }),
  t.partial({
    refresh_token: t.string
  })
]);

export type AccessTokenResponse = t.TypeOf<typeof AccessTokenResponseValidator>;

export const responseFromFragment = (
  fragment: string
): Result<AccessTokenResponse, ErrorResponse> => {
  const fragmentResponse: any = parse(fragment.slice(1), ParseOptions);
  return resultOf(fragmentResponse, AccessTokenResponseValidator);
};

export const token = async (
  domain: string,
  params: AccessTokenParams
): Promise<Result<AccessTokenResponse, ErrorResponse>> => {
  return OAuthRequest({
    body: params,
    method: 'POST',
    url: `${domain}/token`,
    validator: AccessTokenResponseValidator
  });
};
