import CryptoJS from 'crypto-js';
import { Persistence } from '~lib/Persistence';
import { Transaction } from './Transaction';

const KEY_LENGTH: number = 32;
const TRANSACTION_EXPIRATION_TIME_DAYS: number = 1 / 48; // 30 minutes

export class TransactionManager<D> {
  private readonly storage: Persistence;

  constructor(storage: Persistence) {
    this.storage = storage;
  }

  public readonly startTransaction = (data: D): Transaction<D> => {
    const transaction: Transaction<D> = {
      data,
      nonce: CryptoJS.lib.WordArray.random(KEY_LENGTH).toString(),
      state: CryptoJS.lib.WordArray.random(KEY_LENGTH).toString()
    };

    return this.storage.store(
      transaction.state,
      transaction,
      TRANSACTION_EXPIRATION_TIME_DAYS
    );
  };

  public readonly getStoredTransaction = (state: string): Transaction<D> => {
    return this.storage.remove(state);
  };
}
