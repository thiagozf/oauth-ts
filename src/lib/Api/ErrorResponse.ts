export interface ErrorDetails {
  readonly error: string;
  readonly error_description?: string;
  readonly error_uri?: string;
}

export class ErrorResponse extends Error {
  public readonly details: ErrorDetails;

  constructor(details: ErrorDetails) {
    super(details.error);
    this.details = details;
  }
}
