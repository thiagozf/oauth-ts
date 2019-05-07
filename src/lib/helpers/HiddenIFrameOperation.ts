import { getWindow } from './BrowserUtils';
import { MessageBoundHiddenIFrame } from './MessageBoundHiddenIFrame';

// tslint:disable:no-expression-statement no-object-mutation
export const executeHiddenIFrameOperation = async (
  url: string,
  timeout: number = 30 * 1000
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const hiddenIFrame: MessageBoundHiddenIFrame = new MessageBoundHiddenIFrame(
      { timeout, url, window: getWindow() },
      {
        onMessage: e => {
          hiddenIFrame.destroy();
          resolve(e.data);
        },
        onTimeout: () => {
          reject();
        }
      }
    );
  });
};
// tslint:enable
