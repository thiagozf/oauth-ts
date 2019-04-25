/**
 * An abstraction for the result of an operation.
 * @typeparam S a type that represents the result of the operation when it succeeds.
 * @typeparam F a type that represents the result of the operation when it fails.
 */
export interface Result<S, F> {
  /**
   * `true` if the operation succeeded, `false` otherwise.
   */
  readonly success: boolean;

  /**
   * the result of the operation.
   */
  readonly value: S;

  /**
   * the failure details.
   */
  readonly failure: F;
}

/**
 * Returns a new result failure with `body` as value.
 * @param body the result's value.
 */
export const failure = <F>(body: F): Result<any, F> => {
  return {
    failure: body,
    success: false,
    value: undefined
  };
};

/**
 * Returns a new result success with `body` as value.
 * @param body the result's body.
 */
export const success = <S>(body: S): Result<S, any> => {
  return {
    failure: undefined,
    success: true,
    value: body
  };
};
