import Cookies from 'js-cookie';
import { OAuthStorage } from './OAuthStorage';

const NAMESPACE: string = 'com.github.thiagozf.oauth.';
const DEFAULT_EXPIRATION_TIME: number = 1 / 48; // 30 minutes

const storageKeyFor = (key: string): string => {
  return NAMESPACE + key;
};

export class CookieOAuthStorage<T extends object> implements OAuthStorage<T> {
  public remove(key: string): T {
    const value: T = this.retrieve(key);
    // tslint:disable-next-line:no-expression-statement
    Cookies.remove(storageKeyFor(key));
    return value;
  }

  public retrieve(key: string): T {
    const storageKey: string = storageKeyFor(key);
    const transaction: T = Cookies.getJSON(storageKey);
    return transaction;
  }

  public store(key: string, value: T, expires = DEFAULT_EXPIRATION_TIME): T {
    const storageKey: string = storageKeyFor(key);
    // tslint:disable-next-line:no-expression-statement
    Cookies.set(storageKey, value, { expires });
    return value;
  }
}
