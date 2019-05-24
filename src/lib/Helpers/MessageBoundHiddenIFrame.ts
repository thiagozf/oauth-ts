const MESSAGE_EVENT: string = 'message';

const createHiddenIFrame = (w: Window, url: string): HTMLIFrameElement => {
  const element: HTMLIFrameElement = w.document.createElement(
    'iframe'
  ) as HTMLIFrameElement;
  element.style.display = 'none';
  element.style.visibility = 'hidden';
  element.style.position = 'absolute';
  element.style.width = '0';
  element.style.height = '0';
  element.src = url;
  return element;
};
// tslint:enable

export interface MessageBoundHiddenIFrameOptions {
  readonly timeout?: number;
  readonly url: string;
  readonly window: Window;
}

export interface MessageBoundHiddenIFrameHandlers {
  readonly onMessage: (e: MessageEvent) => void;
  readonly onTimeout?: () => void;
}

export class MessageBoundHiddenIFrame {
  private readonly window: Window;
  private readonly element: HTMLIFrameElement;
  private readonly onTimeout?: () => void;
  private readonly onMessage: (e: MessageEvent) => void;
  private readonly timeoutMillis?: number;
  private readonly targetOrigin: string;

  private timeoutHandler: NodeJS.Timeout;

  constructor(
    options: MessageBoundHiddenIFrameOptions,
    handlers: MessageBoundHiddenIFrameHandlers
  ) {
    this.onMessage = handlers.onMessage;
    this.window = options.window;
    this.timeoutMillis = options.timeout;
    this.element = createHiddenIFrame(this.window, options.url);
    this.onTimeout = handlers.onTimeout;
    this.targetOrigin = options.url.substr(
      0,
      options.url.indexOf('/', options.url.indexOf('//') + 2)
    );
  }

  public readonly load = (): Promise<void> => {
    return new Promise(resolve => {
      this.element.onload = () => {
        resolve();
      };

      this.timeoutHandler = this.timeoutMillis
        ? setTimeout(this.handleTimeout, this.timeoutMillis)
        : void 0;

      this.window.document.body.appendChild(this.element);
      this.window.addEventListener(MESSAGE_EVENT, this.handleMessage, false);
    });
  };

  public readonly destroy = (): void => {
    clearTimeout(this.timeoutHandler);
    this.window.removeEventListener(MESSAGE_EVENT, this.handleMessage, false);
    this.element.parentNode.removeChild(this.element);
  };

  public readonly postMessage = (message: string): void => {
    this.element.contentWindow.postMessage(message, this.targetOrigin);
  };

  private readonly isSameOrigin = (e: MessageEvent): boolean => {
    // TODO: check origin
    // return e.origin === this.targetOrigin;
    return e.source === this.element.contentWindow;
  };

  private readonly handleMessage = (e: MessageEvent): void => {
    return this.isSameOrigin(e) ? this.onMessage(e) : void 0;
  };

  private readonly handleTimeout = (): void => {
    this.destroy();
    return this.onTimeout ? this.onTimeout() : void 0;
  };
}
