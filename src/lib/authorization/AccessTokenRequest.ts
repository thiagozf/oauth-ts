import * as t from 'io-ts';

export const AccessTokenRequestValidator = t.intersection([
  t.type({
    client_id: t.string,
    grant_type: t.string,
    scope: t.string
  }),
  t.partial({
    client_secret: t.string,
    code: t.string,
    code_verifier: t.string,
    refresh_token: t.string
  })
]);

export type AccessTokenRequest = t.TypeOf<typeof AccessTokenRequestValidator>;
