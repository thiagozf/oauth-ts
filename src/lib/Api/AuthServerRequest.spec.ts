import test from 'ava';
import * as types from 'io-ts';
import request from 'superagent';
import mockSuperagent from 'superagent-mock';
import { authServerRequest } from './AuthServerRequest';
import { ErrorResponse } from './ErrorResponse';

const mockRequestUrl: string = 'https://oauth.my.test/auth';
const validResponseValidator = types.type({
  ok: types.boolean
});

test.serial(
  'authServerRequest should return a bad request error if the request fails',
  async t => {
    const expectedResponse: ErrorResponse = new ErrorResponse({
      error: 'some_error'
    });

    const superagentMock = mockSuperagent(request, [
      {
        fixtures: () => expectedResponse,
        get: () => ({ status: 400, body: expectedResponse }),
        pattern: mockRequestUrl
      }
    ]);

    // TODO: check error
    await t.throwsAsync(
      async () =>
        authServerRequest({
          url: mockRequestUrl,
          validator: validResponseValidator
        }),
      { instanceOf: ErrorResponse }
    );

    superagentMock.unset();
  }
);

test.serial(
  'authServerRequest should return a valid response if the request succeeds',
  async t => {
    const expectedResponse = { ok: true };
    const superagentMock = mockSuperagent(request, [
      {
        fixtures: () => expectedResponse,
        get: () => ({ status: 200, body: expectedResponse }),
        pattern: mockRequestUrl
      }
    ]);

    const successResult: any = await authServerRequest({
      url: mockRequestUrl,
      validator: validResponseValidator
    });

    t.is(successResult, expectedResponse);

    superagentMock.unset();
  }
);
