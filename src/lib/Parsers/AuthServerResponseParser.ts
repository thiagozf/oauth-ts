import * as t from 'io-ts';
import { ErrorResponse } from '~lib/Api/ErrorResponse';
import { validate } from './Validator';

const isError = <I extends object>(input: I) => {
  return !!input && input.hasOwnProperty('error');
};

const parseError = (input: any): ErrorResponse => {
  return new ErrorResponse({
    error: input.error,
    error_description: input.error_description,
    error_uri: input.error_uri
  });
};

const parseSuccess = async <T, O, I extends object>(
  validator: t.Type<T, O, I>,
  input: I
): Promise<T> => {
  return validate(validator, input).catch(() => {
    return Promise.reject(
      new ErrorResponse({
        error: 'invalid_response',
        error_description: 'bad response from authorization server'
      })
    );
  });
};

export const parseResponse = <T, O, I extends object>(
  validator: t.Type<T, O, I>,
  input: I
): Promise<T> => {
  return isError(input)
    ? Promise.reject(parseError(input))
    : parseSuccess(validator, input);
};
