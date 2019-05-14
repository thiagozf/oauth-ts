import { getFullURL } from '~lib/Helpers';
import { OAuthStorage } from '~lib/Storage';

const LAST_PAGE_KEY: string = 'last_page';
const LAST_PAGE_EXPIRATION_TIME_DAYS: number = 1 / 24; // 1 hour

interface LastPage {
  readonly url: string;
}

export class LastPageManager {
  private readonly storage: OAuthStorage<LastPage>;

  constructor(storage: OAuthStorage<LastPage>) {
    this.storage = storage;
  }

  public storeLastPage(): LastPage {
    return this.storage.store(
      LAST_PAGE_KEY,
      { url: getFullURL() },
      LAST_PAGE_EXPIRATION_TIME_DAYS
    );
  }

  public retrieveLastPage(): LastPage {
    return this.storage.remove(LAST_PAGE_KEY);
  }
}
