import {
  AuthorizeResponse,
  AuthorizeResponseValidator,
  ErrorResponse,
  Result
} from '~lib/Api';
import { getQueryParams } from '~lib/Helpers';
import { resultOf } from './ServerResponseParser';

export const authorizeReponseFromQueryParams = (
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
