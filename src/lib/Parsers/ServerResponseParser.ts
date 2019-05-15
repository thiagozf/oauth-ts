import * as t from 'io-ts';
import { ErrorResponse } from '~lib/Api';
import { failure, Result, success } from '~lib/Result';
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
