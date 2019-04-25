import * as t from 'io-ts';

export const IntrospectRequestValidator = t.type({
  access_token: t.string
});

export type IntrospectRequest = t.TypeOf<typeof IntrospectRequestValidator>;
