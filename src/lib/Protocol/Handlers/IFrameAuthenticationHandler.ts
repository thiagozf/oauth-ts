import { executeHiddenIFrameOperation } from '~lib/Helpers';
import { AuthenticationHandler } from './AuthenticationHandler';

export class IFrameAuthenticationHandler implements AuthenticationHandler {
  public prepare(): Promise<void> {
    return Promise.resolve();
  }

  public navigate(url: string): Promise<any> {
    return executeHiddenIFrameOperation(url);
  }

  public callback(): Promise<void> {
    return Promise.resolve();
  }
}

export default new IFrameAuthenticationHandler();
