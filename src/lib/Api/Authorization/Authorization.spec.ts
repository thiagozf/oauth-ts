import test from 'ava';
import { OAuthConfig } from '~lib/OAuthConfig';
import { dummyProvider } from '~lib/Provider/OpenIDProvider.spec';
import { Authorization, AuthorizeParams } from './Authorization';

test('authorize returns the endpoint to authenticate a user', async t => {
  const config: OAuthConfig = {
    clientId: 'client_id',
    flow: 'IMPLICIT',
    provider: dummyProvider,
    redirectUri: 'http://my.app/callback',
    scope: 'read write'
  };

  const params: AuthorizeParams = {
    code_challenge: 'challenge',
    code_challenge_method: 'S256',
    response_type: 'code',
    state: 'state'
  };

  const authorization: Authorization = new Authorization(config);

  const url: URL = new URL(authorization.getAuthorizeURL(params));

  t.is(url.protocol, 'https:');
  t.is(url.host, 'oauth.my.test');
  t.is(url.pathname, '/auth/authorize');
  t.is(url.searchParams.get('client_id'), config.clientId);
  t.is(url.searchParams.get('redirect_uri'), config.redirectUri);
  t.is(url.searchParams.get('scope'), config.scope);
  t.is(url.searchParams.get('code_challenge'), params.code_challenge);
  t.is(
    url.searchParams.get('code_challenge_method'),
    params.code_challenge_method
  );
  t.is(url.searchParams.get('response_type'), params.response_type);
  t.is(url.searchParams.get('prompt'), 'login');
  t.is(url.searchParams.get('state'), params.state);
});
