// tslint:disable:no-expression-statement
import test from 'ava';
import sinon from 'sinon';
import { OAuthConfig } from '../../OAuth';
import * as OAuthRequest from '../AuthServerRequest';
import { ErrorResponse } from '../Errors';
import { Result, success } from '../Result';
import { Introspect, IntrospectParams } from './Introspect';
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
    scopes: 'read,write',
    user: {
      attributes: {},
      id: 'user'
    }
  });

  sinon
    .stub(OAuthRequest, 'authServerRequest')
    .returns(Promise.resolve(mockedSuccessResponse));

  const config: OAuthConfig = {
    client_id: 'client_id',
    domain: 'https://oauth.my.test/auth',
    redirect_uri: 'http://my.app/callback',
    scope: 'read,write'
  };

  const params: IntrospectParams = {
    access_token: 'my_secret_token'
  };

  const introspect: Introspect = new Introspect(config);

  t.deepEqual(await introspect.introspect(params), mockedSuccessResponse);
});
