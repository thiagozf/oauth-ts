const VALID_RANDOM_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateRandomString = (length: number) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return String.fromCharCode.apply(
    null,
    array.map(x => VALID_RANDOM_CHARS.charCodeAt(x % VALID_RANDOM_CHARS.length))
  );
};

export const sha256 = async (message: string) => {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(b => ('00' + b.toString(16)).slice(-2))
    .join('');
  return hashHex;
};
