import * as t from 'io-ts';

export const ClientValidator = t.type({
  attributes: t.record(t.string, t.any),
  client_id: t.string,
  name: t.string
});

export type Client = t.TypeOf<typeof ClientValidator>;

export const UserValidator = t.type({
  attributes: t.record(t.string, t.any),
  id: t.string
});

export type User = t.TypeOf<typeof UserValidator>;

export const IntrospectResponseValidator = t.type({
  client: ClientValidator,
  expires_in: t.string,
  scopes: t.string,
  user: UserValidator
});

export type IntrospectResponse = t.TypeOf<typeof IntrospectResponseValidator>;
