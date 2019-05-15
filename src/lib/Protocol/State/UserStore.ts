import { UserInfoResponse } from '~lib/Api';
import { Persistence } from '~lib/Persistence';

const USER_INFO_KEY: string = 'user';
const USER_INFO_EXPIRATION_TIME_DAYS: number = 1 / 24; // 1 hour

export class UserStore {
  private readonly storage: Persistence;

  constructor(storage: Persistence) {
    this.storage = storage;
  }

  public readonly storeUser = (
    accessToken: UserInfoResponse
  ): UserInfoResponse => {
    return this.storage.store(
      USER_INFO_KEY,
      accessToken,
      USER_INFO_EXPIRATION_TIME_DAYS
    );
  };

  public readonly retrieveUser = (): UserInfoResponse => {
    return this.storage.retrieve(USER_INFO_KEY);
  };
}
