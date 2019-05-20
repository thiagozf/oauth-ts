export const getWindow = (): Window => {
  return window;
};

export const getHashFragment = (): string => {
  return getWindow().location.hash;
};

export const getQueryParams = (): string => {
  return getWindow().location.search;
};

export const getFullURL = (): string => {
  return getWindow().location.href;
};

export const navigate = (uri: string): Promise<void> => {
  getWindow().location.href = uri;
  return Promise.resolve();
};
