import { getWindow } from './BrowserUtils';

const MESSAGE_EVENT: string = 'message';

// tslint:disable:no-expression-statement no-object-mutation
export const hiddenIFrameOn = (parent: Window): HTMLIFrameElement => {
  const element: HTMLIFrameElement = parent.document.createElement(
    'iframe'
  ) as HTMLIFrameElement;
  element.style.display = 'none';
  parent.document.body.appendChild(element);
  return element;
};

export const messageListenerBoundWindow = (
  w: Window,
  listener: (event: MessageEvent) => void
): Window => {
  w.addEventListener(MESSAGE_EVENT, listener, false);
  return w;
};

export const redirect = (element: HTMLIFrameElement, url: string): void => {
  element.src = url;
};

export const executeHiddenIFrameOperation = async (
  url: string,
  maxTimeout: number = 30 * 1000
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const messageListener = (e: MessageEvent) => {
      // if (e.source !== this.element.contentWindow) {
      //   return;
      // }
      destroy();
      resolve(e.data);
    };

    const timeoutHandler = () => {
      destroy();
      reject();
    };

    const destroy = () => {
      clearTimeout(timeout);
      w.removeEventListener(MESSAGE_EVENT, messageListener, false);
      element.parentNode.removeChild(element);
    };

    const w: Window = messageListenerBoundWindow(getWindow(), messageListener);
    const element: HTMLIFrameElement = hiddenIFrameOn(w);
    const timeout: NodeJS.Timeout = setTimeout(timeoutHandler, maxTimeout);
    redirect(element, url);
  });
};
// tslint:enable
