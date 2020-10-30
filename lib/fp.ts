'use strict';

import type {Options, Context, Value} from './types';

export const pure = <T>(fn: (input: Options) => Context) => (input: Options): Promise<Context> =>
  Promise.resolve(fn(input))

export const lift = <T extends {}>(fn: (array: ReadonlyArray<T> | undefined, ctx: Context) => unknown) =>
  ({_array: array, ...ctx}: Value<T>): Promise<Value<T>> =>
    Promise.resolve(fn(array, ctx))
      .then(output => Object.assign({}, ctx, Array.isArray(output) ? {_array: output} : output));

export const liftTap = <T extends {}>(fn: (array: ReadonlyArray<T> | undefined, ctx: Context) => unknown) =>
  (input: Value<T>): Promise<Value<T>> => {
    const {_array: array, ...ctx} = input;
    return Promise.resolve(fn(array, ctx))
      .then(() => input)
  };
