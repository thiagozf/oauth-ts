import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';

export const validate = <T, O, I>(
  validator: t.Type<T, O, I>,
  input: I
): Promise<T> => {
  const result = validator.decode(input);
  return result.fold(
    () => {
      const messages = reporter(result);
      return Promise.reject(new Error(messages.join('\n')));
    },
    value => Promise.resolve(value)
  );
};
