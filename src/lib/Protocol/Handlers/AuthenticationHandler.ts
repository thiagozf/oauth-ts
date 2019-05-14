export interface AuthenticationHandler {
  readonly prepare: () => Promise<void>;
  readonly navigate: (url: string) => Promise<any>;
  readonly callback: () => Promise<void>;
}
