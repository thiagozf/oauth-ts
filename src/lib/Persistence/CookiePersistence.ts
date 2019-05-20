import Cookies from 'js-cookie';
import { OAuthConfig } from '~lib/OAuthConfig';
import { Persistence } from './Persistence';

const NAMESPACE: string = 'com.github.thiagozf.oauth';
const DEFAULT_EXPIRATION_TIME: number = 1 / 48; // 30 minutes

// TODO: use secure cookies
export class CookiePersistence implements Persistence {
  private readonly config: OAuthConfig;

  constructor(config: OAuthConfig) {
    this.config = config;
  }

  public readonly remove = <T extends object>(key: string): T => {
    const value: T = this.retrieve(key);
    Cookies.remove(this.storageKeyFor(key));
    return value;
  };

  public readonly retrieve = <T extends object>(key: string): T => {
    const storageKey: string = this.storageKeyFor(key);
    const transaction: T = Cookies.getJSON(storageKey);
    return transaction;
  };

  public readonly store = <T extends object>(
    key: string,
    value: T,
    expires = DEFAULT_EXPIRATION_TIME
  ): T => {
    const storageKey: string = this.storageKeyFor(key);
    Cookies.set(storageKey, value, { expires });
    return value;
  };

  private readonly storageKeyFor = (key: string): string => {
    return `${NAMESPACE}.${this.config.clientId}.${key}`;
  };
}
