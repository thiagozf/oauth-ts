import * as t from 'io-ts';
import { ErrorResponse, failure, Result, success } from '~lib/Api';
import { validate } from './Validator';

export const resultOf = <S>(
  response: any,
  validator: t.Type<S>
): Result<S, ErrorResponse> => {
  try {
    const value: S = validate(validator, response);
    return success(value);
  } catch (err) {
    return failure(response);
  }
};
