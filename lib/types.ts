'use strict';

import ui from '../lib/ui';

export type Matcher = (((branch: string) => boolean) & {toJSON: () => string}) | false

export type Program = {
  parent?: Program,
  options: Array<{defaultValue: unknown, long:string, bool: boolean}>,
  [key: string]: unknown
};

export type Options = {
  fetch: boolean,
  merged: string | false,
  pattern: Matcher | false,
  stale: Date | false,
  user: string | '*'
};

export type Context = Options & ReturnType<typeof ui>;

export type Value<T extends string | {[key:string]: unknown}> = Context & {_array?: ReadonlyArray<T> | undefined};

export type LastContributor = {
  branch: string,
  date: Date,
  user: string,
  email: string
};
