export interface Result<S, E> {
  readonly success: boolean;
  readonly value: S;
  readonly failure: E;
}

export function Failure<F>(failure: F): Result<any, F> {
  return {
    failure,
    success: false,
    value: undefined
  };
}

export function Success<S>(value: S): Result<S, any> {
  return {
    failure: undefined,
    success: true,
    value
  };
}
