// tslint:disable:no-expression-statement
import test from 'ava';
import { OpenIDProvider } from './OpenIDProvider';

export const dummyProvider: OpenIDProvider = {
  authorization_endpoint: 'https://oauth.my.test/auth/authorize',
  end_session_endpoint: 'https://oauth.my.test/auth/logout',
  introspect_endpoint: 'https://oauth.my.test/auth/tokeninfo',
  token_endpoint: 'https://oauth.my.test/auth/token',
  userinfo_endpoint: 'https://oauth.my.test/auth/userinfo'
};

test('should represent the OpenID Provider metadata', t => {
  t.true(true);
});
