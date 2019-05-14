export interface Transaction<D> {
  readonly data: D;
  readonly nonce: string;
  readonly state: string;
}
