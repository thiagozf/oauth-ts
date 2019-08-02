import { ErrorResponse } from '~lib/Api/ErrorResponse';

const isError = <I extends object>(input: I) => {
  return !!input && input.hasOwnProperty('error');
};

const parseError = (input: any): ErrorResponse => {
  return {
    error: input.error,
    error_description: input.error_description,
    error_uri: input.error_uri
  };
};

const parseSuccess = async <T, I extends unknown>(input: I): Promise<T> => {
  return input as T;
};

export const parseResponse = <T, I extends object>(input: I): Promise<T> => {
  return isError(input)
    ? Promise.reject(parseError(input))
    : parseSuccess(input);
};
