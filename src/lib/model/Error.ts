import * as t from 'io-ts';

export const ErrorResponseValidator = t.intersection([
  t.type({
    error_type: t.union([
      t.literal('invalid_request'),
      t.literal('unauthorized_client'),
      t.literal('access_denied'),
      t.literal('unsupported_response_type'),
      t.literal('invalid_scope'),
      t.literal('server_error'),
      t.literal('temporarily_unavailable')
    ])
  }),
  t.partial({
    error_description: t.string,
    error_uri: t.string
  })
]);

export type ErrorResponse = t.TypeOf<typeof ErrorResponseValidator>;
