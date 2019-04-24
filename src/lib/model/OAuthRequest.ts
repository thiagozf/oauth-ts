import * as t from 'io-ts';
import request from 'superagent';
import { BAD_REQUEST_ERROR } from '../protocol/Errors';
import { ErrorResponse } from './Error';
import { Failure, Result } from './Result';
import { resultOf } from './ResultParser';

type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface HttpRequestOptions<B> {
  readonly body?: object;
  readonly method?: HttpRequestMethod;
  readonly query?: object;
  readonly retries?: number;
  readonly type?: string;
  readonly url: string;
  readonly validator: t.Type<B>;
}

export const OAuthRequest = async <B>({
  body,
  method = 'GET',
  query,
  retries = 3,
  type = 'application/x-www-form-urlencoded',
  url,
  validator
}: HttpRequestOptions<B>): Promise<Result<B, ErrorResponse>> => {
  try {
    const response: request.Response = await request(method, url)
      .retry(retries)
      .type(type)
      .query(query)
      .send(body)
      .accept('json');

    return resultOf(response.body, validator);
  } catch (error) {
    return Failure(BAD_REQUEST_ERROR);
  }
};
