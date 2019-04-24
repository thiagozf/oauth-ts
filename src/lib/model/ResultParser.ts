import * as t from 'io-ts';
import { validate } from '../utils/Validator';
import { ErrorResponse, ErrorResponseValidator } from './Error';
import { Failure, Result, Success } from './Result';

export const resultOf = <S>(
  response: any,
  validator: t.Type<S>
): Result<S, ErrorResponse> => {
  try {
    const value: S = validate(validator, response);
    return Success(value);
  } catch (err) {
    const errorResponse: ErrorResponse = validate(
      ErrorResponseValidator,
      response
    );
    return Failure(errorResponse);
  }
};
