import { IParseOptions, parse } from 'qs';

const ParseOptions: IParseOptions = {
  ignoreQueryPrefix: true,
  decoder(str: string): any {
    const strWithoutPlus = str.replace(/\+/g, ' ');

    if (/^(\d+|\d*\.\d+)$/.test(str)) {
      return parseFloat(str);
    }

    const keywords = {
      false: false,
      null: null,
      true: true,
      undefined: void 0
    };

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

export const deserializeResponse = <T>(
  serializedResponse: string
): Promise<T> => {
  return parse(serializedResponse.slice(1), ParseOptions);
};
