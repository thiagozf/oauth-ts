import { getWindow } from '../../helpers';
import { MessageBoundHiddenIFrame } from '../../helpers/MessageBoundHiddenIFrame';
import { OAuth } from '../../OAuth';

export interface CheckSessionOptions {
  readonly interval: number;
  readonly oauth: OAuth;
  readonly session_state: string;
  readonly url: string;
}

export interface CheckSessionHandlers {
  readonly onChanged?: () => void;
  readonly onError?: () => void;
}

type CheckSessionStat = 'changed' | 'unchanged' | 'error';

export class CheckSession {
  private readonly options: CheckSessionOptions;
  private readonly handlers: CheckSessionHandlers;
  private readonly frame: MessageBoundHiddenIFrame;
  private readonly timer: NodeJS.Timeout;

  constructor(options: CheckSessionOptions, handlers: CheckSessionHandlers) {
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
    const stat: CheckSessionStat = e.data;
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
    const sessionToCheck: string = `${this.options.oauth.config.client_id} ${
      this.options.session_state
    }`;
    this.frame.postMessage(sessionToCheck);
  };
}
