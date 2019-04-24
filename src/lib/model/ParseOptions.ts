import { IParseOptions } from 'qs';

export const ParseOptions: IParseOptions = {
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
      undefined
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
