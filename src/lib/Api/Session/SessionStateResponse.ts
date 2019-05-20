import * as t from 'io-ts';

export const SessionStateResponseValidator = t.type({
  session_state: t.string
});

export type SessionStateResponse = t.TypeOf<
  typeof SessionStateResponseValidator
>;
