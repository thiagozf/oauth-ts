export const getWindow = (): Window => {
  return window;
};

export const navigate = (uri: string): void => {
  // tslint:disable-next-line:no-expression-statement no-object-mutation
  getWindow().location.href = uri;
};

export const getHashFragment = (): string => {
  return getWindow().location.hash;
};

export const getQueryParams = (): URLSearchParams => {
  return new URLSearchParams(getWindow().location.search);
};
