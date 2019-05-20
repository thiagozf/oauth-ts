import { AuthSession } from '~lib/Api/Session';
import { Persistence } from '~lib/Persistence';

const SESSION_KEY: string = 'session';
const SESSION_EXPIRATION_TIME_DAYS: number = 24; // 24 hours

export class SessionStore {
  private readonly storage: Persistence;

  constructor(storage: Persistence) {
    this.storage = storage;
  }

  public readonly storeSession = (sessionState: AuthSession): AuthSession => {
    return this.storage.store(
      SESSION_KEY,
      sessionState,
      SESSION_EXPIRATION_TIME_DAYS
    );
  };

  public readonly retrieveSession = (): AuthSession => {
    return this.storage.retrieve(SESSION_KEY);
  };

  public readonly clear = (): void => {
    this.storage.remove(SESSION_KEY);
  };
}
