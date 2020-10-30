'use strict';

// @ts-ignore
import spawn from 'cross-spawn-promise';

export default (...args: ReadonlyArray<string|undefined>): Promise<Buffer> =>
  spawn('git', args.filter(Boolean))
    .catch((exception: Error & {stderr: NodeJS.ReadableStream}) => Promise.reject(exception.stderr.toString()));
