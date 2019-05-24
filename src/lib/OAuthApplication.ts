import { Api, UserInfo, UserInfoResponse } from './Api';
import { AuthSession } from './Api/Session';
import { navigate } from './Helpers';
import { OAuthConfig } from './OAuthConfig';
import { parsePersistence, Persistence } from './Persistence';
import {
  AuthenticationFlow,
  LastPageStore,
  parseFlow,
  SessionStore,
  UserStore
} from './Protocol';

export class OAuthApplication {
  public readonly config: OAuthConfig;
  private readonly flow: AuthenticationFlow;
  private readonly api: Api;
  private readonly storage: Persistence;

  private readonly lastPageStore: LastPageStore;
  private readonly sessionStore: SessionStore;
  private readonly userStore: UserStore;

  constructor(config: OAuthConfig) {
    this.config = config;
    this.api = new Api(config);
    this.storage = parsePersistence(config);
    this.flow = parseFlow(config.flow, this.api, this.storage);
    this.lastPageStore = new LastPageStore(this.storage);
    this.sessionStore = new SessionStore(this.storage);
    this.userStore = new UserStore(this.storage);
  }

  public readonly login = async (): Promise<void> => {
    this.lastPageStore.storeLastPage();
    return this.flow.authorize();
  };

  public readonly logout = async (): Promise<void> => {
    this.invalidateSession();
    // TODO: post_logout_redirect_uri as query param
    return navigate(this.config.provider.end_session_endpoint);
  };

  public readonly invalidateSession = (): void => {
    this.sessionStore.clear();
  };

  public readonly silentRefresh = async (): Promise<UserInfoResponse> => {
    const session: AuthSession = await this.flow.silentAuthorize();
    return this.establishUserSession(session);
  };

  public readonly getUser = (): UserInfoResponse => {
    return this.userStore.retrieveUser();
  };

  public readonly getSession = (): AuthSession => {
    return this.sessionStore.retrieveSession();
  };

  public readonly handleCallback = async (): Promise<void> => {
    const authSession: AuthSession = await this.flow.handleAuthorizeResponse();
    await this.establishUserSession(authSession);
    return navigate(this.lastPageStore.retrieveLastPage());
  };

  public readonly hasActiveSession = (): boolean => {
    // TODO: remove session from storage on logout / expiration?
    return !!this.getSession();
  };

  private readonly establishUserSession = async (
    session: AuthSession
  ): Promise<UserInfoResponse> => {
    this.sessionStore.storeSession(session);
    return this.loadUser();
  };

  private readonly loadUser = async (): Promise<UserInfoResponse> => {
    if (!this.hasActiveSession()) {
      return Promise.reject();
    }

    // TODO: check if user changed before loading again
    const { access_token } = this.getSession().accessToken;
    const userInfo: UserInfo = await this.api.userInfo.get(access_token);
    return this.userStore.storeUser(userInfo);
  };
}
