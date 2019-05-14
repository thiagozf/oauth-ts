import CryptoJS from 'crypto-js';
import { OAuthStorage } from '~lib/Storage';
import { Transaction } from './Transaction';

const KEY_LENGTH: number = 32;
const TRANSACTION_EXPIRATION_TIME_DAYS: number = 1 / 48; // 30 minutes

export class TransactionManager<D> {
  private readonly storage: OAuthStorage<Transaction<D>>;

  constructor(storage: OAuthStorage<Transaction<D>>) {
    this.storage = storage;
  }

  public startTransaction(data: D): Transaction<D> {
    const transaction: Transaction<D> = {
      data,
      nonce: CryptoJS.lib.WordArray.random(KEY_LENGTH).toString(),
      state: CryptoJS.lib.WordArray.random(KEY_LENGTH).toString()
    };

    // tslint:disable-next-line:no-expression-statement
    return this.storage.store(
      transaction.state,
      transaction,
      TRANSACTION_EXPIRATION_TIME_DAYS
    );
  }

  public getStoredTransaction(state: string): Transaction<D> {
    return this.storage.remove(state);
  }
}
