import * as t from 'io-ts';

export const ErrorResponseValidator = t.intersection([
  t.type({
    error: t.string
  }),
  t.partial({
    error_description: t.string,
    error_uri: t.string
  })
]);

export type ErrorResponse = t.TypeOf<typeof ErrorResponseValidator>;

export const BAD_REQUEST_ERROR: ErrorResponse = {
  error: 'invalid_request',
  error_description: 'bad request for authorization server'
};

export const INVALID_STATE_ERROR: ErrorResponse = {
  error: 'invalid_request',
  error_description: 'unknown state'
};
