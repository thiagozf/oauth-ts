import * as t from 'io-ts';
import { ErrorResponse, ErrorResponseValidator } from '../error/ErrorResponse';
import { Failure, Result, Success } from '../result';
import { validate } from '../utils/Validator';

export function parseResponse<S>(
  response: any,
  validator: t.Type<S>
): Result<S, ErrorResponse> {
  try {
    const value: S = validate(validator, response.body);
    return Success(value);
  } catch (err) {
    const errorResponse: ErrorResponse = validate(
      ErrorResponseValidator,
      err.request.body
    );
    return Failure(errorResponse);
  }
}
