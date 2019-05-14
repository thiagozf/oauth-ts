import { IParseOptions, parse } from 'qs';
import {
  AccessTokenResponse,
  AccessTokenResponseValidator,
  ErrorResponse,
  Result
} from '~lib/Api';
import { getHashFragment } from '~lib/Helpers';
import { resultOf } from './ServerResponseParser';

const ParseOptions: IParseOptions = {
  ignoreQueryPrefix: true,
  decoder(str: string): any {
    const strWithoutPlus = str.replace(/\+/g, ' ');

    // tslint:disable-next-line:no-if-statement
    if (/^(\d+|\d*\.\d+)$/.test(str)) {
      return parseFloat(str);
    }

    const keywords = {
      false: false,
      null: null,
      true: true,
      undefined: void 0
    };

    // tslint:disable-next-line:no-if-statement
    if (str in keywords) {
      return keywords[str];
    }

    try {
      return decodeURIComponent(strWithoutPlus);
    } catch (e) {
      return strWithoutPlus;
    }
  }
};

export const tokenResponseFromFragment = (
  fragment: string = getHashFragment()
): Result<AccessTokenResponse, ErrorResponse> => {
  const fragmentResponse: any = parse(fragment.slice(1), ParseOptions);
  return resultOf(fragmentResponse, AccessTokenResponseValidator);
};
