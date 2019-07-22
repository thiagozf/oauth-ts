import { AuthSession } from '~lib/Api';
import { getWindow, MessageBoundHiddenIFrame } from '~lib/Helpers';
import { OAuthApplication } from '~lib/OAuthApplication';

export interface OAuthMonitorOptions {
  readonly app: OAuthApplication;
  readonly interval: number;
}

export interface OAuthMonitorEventHandlers {
  readonly onError?: () => void;
  readonly onSessionChanged?: () => void;
  readonly onSessionEnded?: () => void;
  readonly onSessionRestablished?: () => void;
  readonly onTokenRenewed?: () => void;
}

type SessionStatus = 'changed' | 'unchanged' | 'error';

export class OAuthMonitor {
  private readonly app: OAuthApplication;
  private readonly interval: number;
  private readonly handlers: OAuthMonitorEventHandlers;

  private session: AuthSession;
  private frame: MessageBoundHiddenIFrame;
  private timer: NodeJS.Timeout;
  private isRunning: boolean;
  private currentStat: SessionStatus;

  constructor(
    { app, interval = 1000 }: OAuthMonitorOptions,
    {
      onError = () => void 0,
      onSessionChanged = () => void 0,
      onSessionEnded = () => void 0,
      onSessionRestablished = () => void 0,
      onTokenRenewed = () => void 0
    }: OAuthMonitorEventHandlers
  ) {
    this.app = app;
    this.currentStat = 'unchanged';
    this.interval = interval;
    this.handlers = {
      onError,
      onSessionChanged,
      onSessionEnded,
      onSessionRestablished,
      onTokenRenewed
    };
    this.isRunning = false;
  }

  public readonly start = async (): Promise<void> => {
    if (this.isRunning) {
      this.stop();
    }

    this.isRunning = true;
    this.session = this.app.getSession();
    this.frame = new MessageBoundHiddenIFrame(
      {
        url: this.app.config.provider.check_session_iframe,
        window: getWindow()
      },
      { onMessage: this.handleMessage }
    );

    return this.frame.load().then(() => {
      setInterval(this.checkSession, this.interval);
    });
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

  public readonly checkSession = (): void => {
    const sessionToCheck: string = `${this.app.config.clientId} ${
      this.session.sessionState.session_state
    }`;
    this.frame.postMessage(sessionToCheck);
  };

  private readonly handleMessage = (e: MessageEvent): void => {
    const stat: SessionStatus = e.data;

    if (stat !== this.currentStat) {
      this.currentStat = stat;

      if (stat === 'error') {
        this.handleError();
      } else if (stat === 'changed') {
        this.handleChanged();
      } else if (stat === 'unchanged') {
        this.handleUnchanged();
      }
    }
  };

  private readonly handleError = (): Promise<void> => {
    this.handlers.onError();
    return Promise.resolve();
  };

  private readonly handleUnchanged = async (): Promise<void> => {
    this.handlers.onSessionRestablished();
    return this.start();
  };

  private readonly handleChanged = async (): Promise<void> => {
    const app: OAuthApplication = this.app;

    try {
      await app.silentRefresh();
    } catch (e) {
      this.handlers.onSessionEnded();
      return app.invalidateSession();
    }

    if (!this.isSameUser()) {
      this.handlers.onSessionChanged();
      return;
    }

    if (!this.isSameToken()) {
      this.handlers.onTokenRenewed();
    }

    return this.start();
  };

  private readonly isSameToken = (): boolean => {
    const newSession: AuthSession = this.app.getSession();
    return (
      newSession.accessToken.access_token ===
      this.session.accessToken.access_token
    );
  };

  private readonly isSameUser = (): boolean => {
    const newSession: AuthSession = this.app.getSession();
    return (
      newSession.accessToken.principal === this.session.accessToken.principal
    );
  };
}
