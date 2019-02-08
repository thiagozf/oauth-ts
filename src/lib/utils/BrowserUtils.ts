function getWindow(): Window {
  return window;
}

export function navigate(uri: string): void {
  // tslint:disable-next-line:no-expression-statement no-object-mutation
  getWindow().location.href = uri;
}

export function getHashFragment(): string {
  return getWindow().location.hash;
}
