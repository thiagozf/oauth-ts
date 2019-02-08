import * as t from 'io-ts';

export const IntrospectParamsValidator = t.type({
  access_token: t.string
});

export type IntrospectParams = t.TypeOf<typeof IntrospectParamsValidator>;
