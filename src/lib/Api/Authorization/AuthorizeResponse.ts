import * as t from 'io-ts';

export const AuthorizeResponseValidator = t.intersection([
  t.type({
    code: t.string
  }),
  t.partial({
    state: t.string
  })
]);

export type AuthorizeResponse = t.TypeOf<typeof AuthorizeResponseValidator>;
