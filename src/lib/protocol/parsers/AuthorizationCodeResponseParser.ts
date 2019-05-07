import {
  AuthorizeResponse,
  AuthorizeResponseValidator,
  ErrorResponse,
  Result
} from '../../api';
import { getQueryParams } from '../../helpers';
import { resultOf } from './ServerResponseParser';

export const authorizeReponseFromQueryParams = (
  query: URLSearchParams = getQueryParams()
): Result<AuthorizeResponse, ErrorResponse> => {
  return resultOf(
    {
      code: query.get('code'),
      error: query.get('error'),
      error_description: query.get('error_description'),
      session_state: query.get('session_state'),
      state: query.get('state')
    },
    AuthorizeResponseValidator
  );
};
