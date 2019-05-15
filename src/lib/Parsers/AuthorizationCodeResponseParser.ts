import {
  AuthorizeResponse,
  AuthorizeResponseValidator,
  ErrorResponse
} from '~lib/Api';
import { getQueryParams } from '~lib/Helpers';
import { Result } from '~lib/Result';
import { resultOf } from './ServerResponseParser';

export const authorizeResponseFromQueryParams = (
  query: URLSearchParams = getQueryParams()
): Result<AuthorizeResponse, ErrorResponse> => {
  return resultOf(
    {
      code: query.get('code') || void 0,
      error: query.get('error') || void 0,
      error_description: query.get('error_description') || void 0,
      session_state: query.get('session_state') || void 0,
      state: query.get('state') || void 0
    },
    AuthorizeResponseValidator
  );
};
