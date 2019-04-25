import * as t from 'io-ts';

export const IntrospectResponseValidator = t.type({
  client: t.type({
    attributes: t.record(t.string, t.any),
    client_id: t.string,
    name: t.string
  }),
  expires_in: t.string,
  scopes: t.string,
  user: t.type({
    attributes: t.record(t.string, t.any),
    id: t.string
  })
});

export type IntrospectResponse = t.TypeOf<typeof IntrospectResponseValidator>;
