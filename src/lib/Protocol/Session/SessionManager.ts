import { getWindow, MessageBoundHiddenIFrame } from '~lib/Helpers';
import { OAuthConfig } from '~lib/OAuthConfig';

export interface SessionManagerOptions {
  readonly interval: number;
  readonly config: OAuthConfig;
  readonly sessionState: string;
  readonly url: string;
}

export interface SessionManagerHandlers {
  readonly onChanged?: () => void;
  readonly onError?: () => void;
}

type SessionManagerStat = 'changed' | 'unchanged' | 'error';

export class SessionManager {
  private readonly options: SessionManagerOptions;
  private readonly handlers: SessionManagerHandlers;
  private readonly frame: MessageBoundHiddenIFrame;
  private readonly timer: NodeJS.Timeout;

  constructor(
    options: SessionManagerOptions,
    handlers: SessionManagerHandlers = {}
  ) {
    this.options = options;
    this.handlers = handlers;
    this.frame = new MessageBoundHiddenIFrame(
      {
        url: options.url,
        window: getWindow()
      },
      { onMessage: this.handleNewStat }
    );
    this.timer = setInterval(this.doCheck, this.options.interval);
  }

  public readonly stop = (): void => {
    // tslint:disable-next-line:no-expression-statement
    clearInterval(this.timer);
    this.frame.destroy();
  };

  private readonly handleNewStat = (e: MessageEvent) => {
    const stat: SessionManagerStat = e.data;
    return stat === 'error'
      ? this.handleError()
      : stat === 'changed'
      ? this.handleChanged()
      : void 0;
  };

  private readonly handleChanged = () => {
    this.stop();
    return this.handlers.onChanged ? this.handlers.onChanged() : void 0;
  };

  private readonly handleError = () => {
    this.stop();
    return this.handlers.onError ? this.handlers.onError() : void 0;
  };

  private readonly doCheck = (): void => {
    const sessionToCheck: string = `${this.options.config.clientId} ${
      this.options.sessionState
    }`;
    this.frame.postMessage(sessionToCheck);
  };
}
