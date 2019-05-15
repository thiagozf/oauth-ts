import test from 'ava';
import sinon from 'sinon';
import { ErrorResponse } from '~lib/Api';
import { OAuthConfig } from '~lib/OAuthConfig';
import { dummyProvider } from '~lib/Provider/OpenIDProvider.spec';
import { Result, success } from '~lib/Result';
import * as OAuthRequest from '../AuthServerRequest';
import { Introspect } from './Introspect';
import { IntrospectResponse } from './IntrospectResponse';

test('introspect returns information about an access token', async t => {
  const mockedSuccessResponse: Result<
    IntrospectResponse,
    ErrorResponse
  > = success({
    client: {
      attributes: {},
      client_id: 'client_id',
      name: 'name'
    },
    expires_in: '0',
    scopes: 'read write',
    user: {
      attributes: {},
      id: 'user'
    }
  });

  sinon
    .stub(OAuthRequest, 'authServerRequest')
    .returns(Promise.resolve(mockedSuccessResponse));

  const config: OAuthConfig = {
    clientId: 'client_id',
    flow: 'IMPLICIT',
    provider: dummyProvider,
    redirectUri: 'http://my.app/callback',
    scope: 'read write'
  };

  const introspect: Introspect = new Introspect(config);

  t.deepEqual(await introspect.get('my_secret_token'), mockedSuccessResponse);
});
