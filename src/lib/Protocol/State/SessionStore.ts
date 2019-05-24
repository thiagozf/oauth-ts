import { AuthSession } from '~lib/Api';
import { Persistence } from '~lib/Persistence';

const EXPIRATION_MARGIN: number = 300; // 300 seconds = 5 minutes
const SESSION_KEY: string = 'session';

const secondsToDays = (seconds: number): number => {
  return seconds / 86400;
};

export class SessionStore {
  private readonly storage: Persistence;

  constructor(storage: Persistence) {
    this.storage = storage;
  }

  public readonly storeSession = (session: AuthSession): AuthSession => {
    const timeToExpire: number =
      session.accessToken.expires_in - EXPIRATION_MARGIN;
    return this.storage.store(
      SESSION_KEY,
      session,
      secondsToDays(timeToExpire)
    );
  };

  public readonly retrieveSession = (): AuthSession => {
    return this.storage.retrieve(SESSION_KEY);
  };

  public readonly clear = (): void => {
    this.storage.remove(SESSION_KEY);
  };
}
