export interface Result<S, E> {
  readonly success: boolean;
  readonly value: S;
  readonly failure: E;
}

export const Failure = <F>(failure: F): Result<any, F> => {
  return {
    failure,
    success: false,
    value: undefined
  };
};

export const Success = <S>(value: S): Result<S, any> => {
  return {
    failure: undefined,
    success: true,
    value
  };
};
