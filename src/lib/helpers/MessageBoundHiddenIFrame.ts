const MESSAGE_EVENT: string = 'message';

// tslint:disable:no-expression-statement no-object-mutation
const createHiddenIFrame = (w: Window): HTMLIFrameElement => {
  const element: HTMLIFrameElement = w.document.createElement(
    'iframe'
  ) as HTMLIFrameElement;
  element.style.display = 'none';
  element.style.visibility = 'hidden';
  element.style.position = 'absolute';
  element.style.width = '0';
  element.style.height = '0';
  w.document.body.appendChild(element);
  return element;
};

const messageListenerBoundWindow = (
  w: Window,
  listener: (event: MessageEvent) => void
): Window => {
  w.addEventListener(MESSAGE_EVENT, listener, false);
  return w;
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
  private readonly timeout: NodeJS.Timeout;
  private readonly targetOrigin: string;

  constructor(
    options: MessageBoundHiddenIFrameOptions,
    handlers: MessageBoundHiddenIFrameHandlers
  ) {
    this.onMessage = handlers.onMessage;
    this.window = messageListenerBoundWindow(
      options.window,
      this.handleMessage
    );
    this.element = createHiddenIFrame(this.window);
    this.onTimeout = handlers.onTimeout;
    this.timeout = options.timeout
      ? setTimeout(this.handleTimeout, options.timeout)
      : void 0;
    this.targetOrigin = options.url.substr(
      0,
      options.url.indexOf('/', options.url.indexOf('//') + 2)
    );
    this.element.src = options.url;
  }

  public readonly destroy = (): void => {
    // tslint:disable-next-line:no-expression-statement
    clearTimeout(this.timeout);
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
