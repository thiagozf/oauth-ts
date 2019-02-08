import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';

export function validate<T, O, I>(validator: t.Type<T, O, I>, input: I): T {
  const result = validator.decode(input);
  return result.fold(
    () => {
      const messages = reporter(result);
      throw new Error(messages.join('\n'));
    },
    value => value
  );
}
