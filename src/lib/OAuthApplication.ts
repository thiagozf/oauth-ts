import { AccessTokenResponse, Api, UserInfoResponse } from './Api';
import { navigate } from './Helpers';
import { OAuthConfig } from './OAuthConfig';
import { parsePersistence, Persistence } from './Persistence';
import {
  AccessTokenStore,
  AuthenticationFlow,
  LastPageStore,
  parseFlow,
  UserStore
} from './Protocol';

export class OAuthApplication {
  private readonly flow: AuthenticationFlow;
  private readonly api: Api;
  private readonly storage: Persistence;

  private readonly lastPageStore: LastPageStore;
  private readonly accessTokenStore: AccessTokenStore;
  private readonly userStore: UserStore;

  constructor(config: OAuthConfig) {
    this.api = new Api(config);
    this.storage = parsePersistence(config);
    this.flow = parseFlow(config.flow, this.api, this.storage);
    this.lastPageStore = new LastPageStore(this.storage);
    this.accessTokenStore = new AccessTokenStore(this.storage);
    this.userStore = new UserStore(this.storage);
  }

  public readonly login = async (): Promise<void> => {
    this.lastPageStore.storeLastPage();
    return this.flow.authorize();
  };

  public readonly isLoggedIn = (): boolean => {
    return !!this.getUser();
  };

  public readonly getUser = (): UserInfoResponse => {
    return this.userStore.retrieveUser();
  };

  public readonly getToken = (): AccessTokenResponse => {
    return this.accessTokenStore.retrieveAccessToken();
  };

  public readonly handleCallback = (): Promise<void> => {
    return this.flow
      .handleAuthorizeResponse()
      .then(this.accessTokenStore.storeAccessToken)
      .then(this.loadUser)
      .then(this.lastPageStore.retrieveLastPage)
      .then(navigate);
  };

  private readonly loadUser = async (): Promise<UserInfoResponse> => {
    const { access_token } = this.getToken();
    return this.api.userInfo
      .get(access_token)
      .then(result =>
        result.success
          ? this.userStore.storeUser(result.value)
          : Promise.reject()
      );
  };
}
