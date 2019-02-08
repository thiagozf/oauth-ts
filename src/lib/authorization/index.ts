import { parse, stringify } from 'qs';
import { ErrorResponse } from '../error/ErrorResponse';
import { parseResponse } from '../protocol/ResponseParser';
import { Result } from '../result';
import { getHashFragment, navigate } from '../utils/BrowserUtils';
import {
  AccessTokenResponse,
  AccessTokenResponseValidator
} from './AccessTokenResponse';
import { AuthorizationParams } from './AuthorizationParams';

export function authorize(domain: string, params: AuthorizationParams): void {
  const query = stringify(params);
  // tslint:disable-next-line:no-expression-statement
  navigate(`${domain}/authorize?${query}`);
}

export function responseFrom(
  fragment: string = getHashFragment()
): Result<AccessTokenResponse, ErrorResponse> {
  const fragmentResponse: any = parse(fragment);
  return parseResponse(fragmentResponse, AccessTokenResponseValidator);
}

export { AuthorizationParams };
