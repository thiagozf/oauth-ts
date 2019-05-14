export interface OAuthStorage<T extends object> {
  readonly remove: (key: string) => T;
  readonly retrieve: (key: string) => T;
  readonly store: (key: string, value: T, expires: number) => T;
}
