import * as t from 'io-ts';

export const OpenIDProviderValidator = t.intersection([
  t.type({
    authorization_endpoint: t.string,
    end_session_endpoint: t.string,
    token_endpoint: t.string,
    userinfo_endpoint: t.string
  }),
  t.partial({
    check_session_iframe: t.string,
    introspect_endpoint: t.string
  })
]);

export type OpenIDProvider = t.TypeOf<typeof OpenIDProviderValidator>;
