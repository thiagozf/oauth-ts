import { AuthSession } from '~lib/Api/Session';
import { getWindow, MessageBoundHiddenIFrame } from '~lib/Helpers';
import { OAuthApplication } from '~lib/OAuthApplication';

export interface SessionMonitorOptions {
  readonly app: OAuthApplication;
  readonly interval: number;
}

export interface SessionMonitorEventHandlers {
  readonly onError?: () => void;
  readonly onSessionChanged?: () => void;
  readonly onSessionRestablished?: () => void;
  readonly onSessionTerminated?: () => void;
}

type SessionMonitorStat = 'changed' | 'unchanged' | 'error';

export class SessionMonitor {
  private readonly app: OAuthApplication;
  private readonly interval: number;
  private readonly handlers: SessionMonitorEventHandlers;

  private session: AuthSession;
  private frame: MessageBoundHiddenIFrame;
  private timer: NodeJS.Timeout;
  private isRunning: boolean;
  private currentStat: SessionMonitorStat;

  constructor(
    { app, interval = 1000 }: SessionMonitorOptions,
    {
      onError = () => void 0,
      onSessionChanged = () => void 0,
      onSessionRestablished = () => void 0,
      onSessionTerminated = () => void 0
    }: SessionMonitorEventHandlers
  ) {
    this.app = app;
    this.currentStat = 'unchanged';
    this.interval = interval;
    this.handlers = {
      onError,
      onSessionChanged,
      onSessionRestablished,
      onSessionTerminated
    };
    this.isRunning = false;
  }

  public readonly start = (): void => {
    if (this.isRunning) {
      this.stop();
    }

    this.session = this.app.getSession();
    this.frame = new MessageBoundHiddenIFrame(
      {
        url: this.app.config.provider.check_session_iframe,
        window: getWindow()
      },
      { onMessage: this.handleMessage }
    );
    this.timer = setInterval(this.checkSession, this.interval);
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

  public readonly checkSession = (): void => {
    const sessionToCheck: string = `${this.app.config.clientId} ${
      this.session.sessionState.session_state
    }`;
    this.frame.postMessage(sessionToCheck);
  };

  private readonly handleMessage = (e: MessageEvent): void => {
    const stat: SessionMonitorStat = e.data;

    if (stat !== this.currentStat) {
      this.currentStat = stat;

      if (stat === 'error') {
        this.handleError();
      } else if (stat === 'changed') {
        this.handleChanged();
      } else if (stat === 'unchanged') {
        this.handleRestablished();
      }
    }
  };

  private readonly handleRestablished = (): void => {
    this.handlers.onSessionRestablished();
    return this.start();
  };

  private readonly handleChanged = async (): Promise<void> => {
    const app: OAuthApplication = this.app;

    try {
      await app.silentRefresh();
    } catch (e) {
      this.handlers.onSessionTerminated();
      return app.logout();
    }

    const newSession: AuthSession = app.getSession();
    if (
      newSession.accessToken.principal !== this.session.accessToken.principal
    ) {
      this.handlers.onSessionChanged();
      return;
    }

    return this.start();
  };

  private readonly handleError = () => {
    return this.handlers.onError();
  };
}
