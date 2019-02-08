import * as t from 'io-ts';
import request from 'superagent';
import { ErrorResponse } from '../error/ErrorResponse';
import { Result } from '../result';
import { parseResponse } from './ResponseParser';

type HttpRequestMethod = 'GET' | 'POST' | 'POST' | 'DELETE' | 'PATCH';

interface HttpRequestOptions<B> {
  readonly method?: HttpRequestMethod;
  readonly retries?: number;
  readonly url: string;
  readonly body?: object;
  readonly query?: object;
  readonly validator: t.Type<B>;
}

export async function OAuthRequest<B>({
  url,
  method = 'GET',
  body,
  query,
  retries = 3,
  validator
}: HttpRequestOptions<B>): Promise<Result<B, ErrorResponse>> {
  const response = await request(method, url)
    .retry(retries)
    .query(query)
    .send(body)
    .accept('json');

  return parseResponse(response, validator);
}
