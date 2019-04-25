import * as t from 'io-ts';

export const AuthorizeResponseValidator = t.type({
  code: t.string,
  state: t.string
});

export type AuthorizeResponse = t.TypeOf<typeof AuthorizeResponseValidator>;
