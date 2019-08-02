import { generateRandomString } from '~lib/Helpers/Crypto';

export interface CodeChallengePair {
  readonly challenge: string;
  readonly verifier: string;
}

const urlEncode = (str: string): string => {
  return btoa(str)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const generateChallenge = (verifier: string): string => {
  // const hash: string = await sha256(verifier);
  return urlEncode(verifier);
};

const generateVerifier = (): string => {
  return generateRandomString(128);
};

export const generateCodeChallengePair = (): CodeChallengePair => {
  const verifier: string = generateVerifier();
  const challenge: string = generateChallenge(verifier);
  return { challenge, verifier };
};
