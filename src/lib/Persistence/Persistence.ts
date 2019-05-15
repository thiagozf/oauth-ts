export interface Persistence {
  readonly remove: <T extends object>(key: string) => T;
  readonly retrieve: <T extends object>(key: string) => T;
  readonly store: <T extends object>(
    key: string,
    value: T,
    expires: number
  ) => T;
}
