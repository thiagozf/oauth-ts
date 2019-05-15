import { AccessTokenResponse } from '~lib/Api';
import { Persistence } from '~lib/Persistence';

const ACCESS_TOKEN_KEY: string = 'access_token';
const ACCESS_TOKEN_EXPIRATION_TIME_DAYS: number = 1 / 24; // 1 hour

export class AccessTokenStore {
  private readonly storage: Persistence;

  constructor(storage: Persistence) {
    this.storage = storage;
  }

  public readonly storeAccessToken = (
    accessToken: AccessTokenResponse
  ): AccessTokenResponse => {
    return this.storage.store(
      ACCESS_TOKEN_KEY,
      accessToken,
      ACCESS_TOKEN_EXPIRATION_TIME_DAYS
    );
  };

  public readonly retrieveAccessToken = (): AccessTokenResponse => {
    return this.storage.retrieve(ACCESS_TOKEN_KEY);
  };
}
