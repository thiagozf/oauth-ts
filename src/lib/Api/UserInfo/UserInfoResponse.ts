import * as t from 'io-ts';

export const UserInfoResponseValidator = t.any;

export type UserInfoResponse = t.TypeOf<typeof UserInfoResponseValidator>;
