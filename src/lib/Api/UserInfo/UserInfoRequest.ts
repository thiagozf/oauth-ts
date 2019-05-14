import * as t from 'io-ts';

export const UserInfoRequestValidator = t.type({
  access_token: t.string
});

export type UserInfoRequest = t.TypeOf<typeof UserInfoRequestValidator>;
