// tslint:disable:no-expression-statement
import test from 'ava';
import * as types from 'io-ts';
import request from 'superagent';
import mockSuperagent from 'superagent-mock';
import { authServerRequest } from './AuthServerRequest';
import { BAD_REQUEST_ERROR, ErrorResponse } from './Errors';
import { Result } from './Result';

const mockRequestUrl: string = 'https://oauth.my.test/auth';
const validResponseValidator = types.type({
  ok: types.boolean
});

test.serial(
  'authServerRequest should return a bad request error if the request fails',
  async t => {
    const expectedResponse: ErrorResponse = BAD_REQUEST_ERROR;
    const superagentMock = mockSuperagent(request, [
      {
        fixtures: () => expectedResponse,
        get: () => ({ status: 400, body: expectedResponse }),
        pattern: mockRequestUrl
      }
    ]);

    const failResult: Result<any, ErrorResponse> = await authServerRequest({
      url: mockRequestUrl,
      validator: validResponseValidator
    });

    t.false(failResult.success);
    t.is(failResult.failure, BAD_REQUEST_ERROR);

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

    const successResult: Result<any, ErrorResponse> = await authServerRequest({
      url: mockRequestUrl,
      validator: validResponseValidator
    });

    t.true(successResult.success);
    t.is(successResult.value, expectedResponse);

    superagentMock.unset();
  }
);
