import { getFullURL } from '~lib/Helpers';
import { Persistence } from '~lib/Persistence';

const LAST_PAGE_KEY: string = 'last_page';
const LAST_PAGE_EXPIRATION_TIME_DAYS: number = 1 / 24; // 1 hour

export interface LastPage {
  readonly url: string;
}

export class LastPageStore {
  private readonly storage: Persistence;

  constructor(storage: Persistence) {
    this.storage = storage;
  }

  public readonly storeLastPage = (): string => {
    const lastPage: LastPage = { url: getFullURL() };
    this.storage.store(LAST_PAGE_KEY, lastPage, LAST_PAGE_EXPIRATION_TIME_DAYS);
    return lastPage.url;
  };

  public readonly retrieveLastPage = (): string => {
    const lastPage: LastPage = this.storage.remove(LAST_PAGE_KEY);
    return lastPage ? lastPage.url : '/';
  };
}
