import * as CryptoJS from 'crypto-js';

export interface CodeChallengePair {
  readonly challenge: string;
  readonly verifier: string;
}

const urlEncode = (str: string): string => {
  return str
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const generateChallenge = (verifier: string): string => {
  return urlEncode(CryptoJS.SHA256(verifier).toString(CryptoJS.enc.Base64));
};

const generateVerifier = (): string => {
  return urlEncode(
    CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(32))
  );
};

export const generateCodeChallengePair = (): CodeChallengePair => {
  const verifier: string = generateVerifier();
  const challenge: string = generateChallenge(verifier);
  return { challenge, verifier };
};
