import { OAuthConfig } from '~lib/OAuthConfig';
import { CookiePersistence } from './CookiePersistence';
import { Persistence } from './Persistence';

type PersistenceType = 'COOKIE';

const parsePersistence = (config: OAuthConfig): Persistence => {
  switch (config.persistence) {
    default:
      return new CookiePersistence(config);
  }
};

export { PersistenceType, parsePersistence };
