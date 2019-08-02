import request from 'superagent';
import { parseResponse } from '~lib/Parsers';

type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface HttpRequestOptions {
  /**
   * the request's body.
   */
  readonly body?: object;

  /**
   * the HTTP method to execute.
   */
  readonly method?: HttpRequestMethod;
  /**
   * the query params.
   */
  readonly query?: object;

  /**
   * the number of retries.
   */
  readonly retries?: number;

  /**
   * the `Content-Type` header value.
   */
  readonly type?: string;

  /**
   * the full URL to call.
   */
  readonly url: string;
}

/**
 * Sends an asynchronous request to a server and returns the response as an instance of `B`.
 * @typeparam B type of response body.
 * @method authServerRequest
 * @returns the result of the request as a promise.
 */
export const authServerRequest = async <B>({
  body,
  method = 'GET',
  query,
  retries = 3,
  type = 'application/x-www-form-urlencoded',
  url
}: HttpRequestOptions): Promise<B> => {
  try {
    const response: request.Response = await request(method, url)
      .retry(retries)
      .type(type)
      .query(query)
      .send(body)
      .accept('json');

    return parseResponse(response.body);
  } catch (e) {
    // Received an unknown error when requesting the auth server...
    return Promise.reject({
      error: 'invalid_request',
      error_description: 'bad request for authorization server'
    });
  }
};
