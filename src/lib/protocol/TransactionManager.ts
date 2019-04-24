import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const KEY_LENGTH: number = 32;
const NAMESPACE: string = 'com.github.thiagozf.oauth.';

const storageKeyFor = (state: string): string => {
  return NAMESPACE + state;
};

export interface Transaction<D> {
  readonly data: D;
  readonly nonce: string;
  readonly state: string;
}

export const startTransaction = <D>(data: D): Transaction<D> => {
  const transaction: Transaction<D> = {
    data,
    nonce: CryptoJS.lib.WordArray.random(KEY_LENGTH).toString(),
    state: CryptoJS.lib.WordArray.random(KEY_LENGTH).toString()
  };

  // tslint:disable-next-line:no-expression-statement
  Cookies.set(storageKeyFor(transaction.state), transaction);

  return transaction;
};

export const getStoredTransaction = <D>(state: string): Transaction<D> => {
  const key = storageKeyFor(state);
  const transaction: Transaction<D> = Cookies.getJSON(key);
  // tslint:disable-next-line:no-expression-statement
  Cookies.remove(key);
  return transaction;
};
