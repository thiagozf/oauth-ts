import * as t from 'io-ts';

export const AccessTokenResponseValidator = t.intersection([
  t.type({
    access_token: t.string,
    expires: t.number,
    expires_in: t.number,
    scope: t.string,
    token_type: t.string
  }),
  t.partial({
    refresh_token: t.string
  })
]);

export type AccessTokenResponse = t.TypeOf<typeof AccessTokenResponseValidator>;
