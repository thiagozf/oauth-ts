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
      state: query.get('state')
    },
    AuthorizeResponseValidator
  );
};
