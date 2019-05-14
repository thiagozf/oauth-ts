import { navigate } from '~lib/Helpers';
import { AuthenticationHandler } from './AuthenticationHandler';

export class RedirectAuthenticationHandler implements AuthenticationHandler {
  public prepare(): Promise<void> {
    return Promise.resolve();
  }

  public navigate(url: string): Promise<any> {
    return navigate(url);
  }

  public callback(): Promise<void> {
    return Promise.resolve();
  }
}

export default new RedirectAuthenticationHandler();
