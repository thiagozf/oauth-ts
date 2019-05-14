export const getWindow = (): Window => {
  return window;
};

export const getHashFragment = (): string => {
  return getWindow().location.hash;
};

export const getQueryParams = (): URLSearchParams => {
  return new URLSearchParams(getWindow().location.search);
};

export const getFullURL = (): string => {
  return getWindow().location.href;
};

export const navigate = (uri: string): Promise<void> => {
  // tslint:disable-next-line:no-expression-statement no-object-mutation
  getWindow().location.href = uri;
  return Promise.resolve();
};
