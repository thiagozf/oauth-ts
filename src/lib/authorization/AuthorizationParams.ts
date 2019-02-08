import * as t from 'io-ts';

export const AuthorizationParamsValidator = t.intersection([
  t.type({
    client_id: t.string,
    redirect_uri: t.string,
    response_type: t.string,
    scope: t.string
  }),
  t.partial({
    code_challenge: t.string,
    code_challenge_method: t.string,
    silent: t.boolean,
    state: t.string
  })
]);

export type AuthorizationParams = t.TypeOf<typeof AuthorizationParamsValidator>;
