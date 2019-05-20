import { AuthSession } from '~lib/Api/Session';
import { getWindow, MessageBoundHiddenIFrame } from '~lib/Helpers';
import { OAuthApplication } from '~lib/OAuthApplication';

export interface SessionMonitorOptions {
  readonly app: OAuthApplication;
  readonly interval: number;
}

export interface SessionMonitorEventHandlers {
  readonly onUserChanged?: () => void;
  readonly onUserLoggedOut?: () => void;
  readonly onError?: () => void;
}

type SessionMonitorStat = 'changed' | 'unchanged' | 'error';

export class SessionMonitor {
  private readonly app: OAuthApplication;
  private readonly interval: number;
  private readonly onUserChanged: () => void;
  private readonly onUserLoggedOut: () => void;
  private readonly onError: () => void;

  private session: AuthSession;
  private frame: MessageBoundHiddenIFrame;
  private timer: NodeJS.Timeout;
  private isRunning: boolean;

  constructor(
    { app, interval = 1000 }: SessionMonitorOptions,
    {
      onUserChanged = () => void 0,
      onUserLoggedOut = () => void 0,
      onError = () => void 0
    }: SessionMonitorEventHandlers
  ) {
    this.app = app;
    this.interval = interval;
    this.onUserChanged = onUserChanged;
    this.onUserLoggedOut = onUserLoggedOut;
    this.onError = onError;
    this.isRunning = false;
  }

  public readonly start = (): void => {
    if (this.isRunning) {
      return;
    }

    this.session = this.app.getSession();
    this.frame = new MessageBoundHiddenIFrame(
      {
        url: this.app.config.provider.check_session_iframe,
        window: getWindow()
      },
      { onMessage: this.handleNewStat }
    );
    this.timer = setInterval(this.doCheck, this.interval);
    this.isRunning = true;
  };

  public readonly stop = (): void => {
    if (!this.isRunning) {
      return;
    }

    try {
      clearInterval(this.timer);
      this.frame.destroy();
    } finally {
      this.isRunning = false;
    }
  };

  private readonly handleNewStat = (e: MessageEvent) => {
    const stat: SessionMonitorStat = e.data;
    return stat === 'error'
      ? this.handleError()
      : stat === 'changed'
      ? this.handleChanged()
      : void 0;
  };

  private readonly handleChanged = async () => {
    this.stop();

    const app: OAuthApplication = this.app;

    try {
      await app.silentLogin();
    } catch (e) {
      this.onUserLoggedOut();
      return;
    }

    const newSession: AuthSession = app.getSession();
    if (newSession.accessToken.user !== this.session.accessToken.user) {
      this.onUserChanged();
      return;
    }

    return this.start();
  };

  private readonly handleError = () => {
    this.stop();
    return this.onError();
  };

  private readonly doCheck = (): void => {
    console.log(this.app);
    const sessionToCheck: string = `${this.app.config.clientId} ${
      this.session.sessionState.session_state
    }`;
    this.frame.postMessage(sessionToCheck);
  };
}
