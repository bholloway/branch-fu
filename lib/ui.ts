'use strict';

import { Spinner } from 'cli-spinner';

export default (stream: NodeJS.WritableStream, labelLength: number, progressInterval: number) => {
  const spinner = new Spinner({ stream });

  const logFn = (text: string) =>
    stream.write(`${text}\n`);

  const formatFraction = (n: number, m: number) => {
    const padded = n.toString().padStart(m.toString().length, '0');
    return(`${padded}/${m}`);
  };

  const mem = () => {
    const { heapTotal } = process.memoryUsage();
    return `${Math.round(heapTotal/1024/1024)}MiB`;
  };

  const instance = ({
    log: (label: string, text: any) => {
      const prefix = `${label}:`.padEnd(labelLength);
      instance.progress();
      logFn(`\r${prefix} ${JSON.stringify(text)}`);
    },
    tick: (label: string) => {
      const prefix = `${label}:`.padEnd(labelLength);
      instance.progress();
      logFn(`\r${prefix} \u2714`);
    },
    progress: (n = 0, m = 0) => {
      if (n === 0 && m === 0) {
        spinner.clearLine(stream);
        spinner.setSpinnerTitle('%s');
      } else if (n % progressInterval === 0) {
        spinner.setSpinnerTitle(`%s ${formatFraction(n,m)} ${mem()}`);
      }
    },
    withProgress: <T, U = T>(mapFn: (v: T, i: number, a: ReadonlyArray<T>) => Promise<U>) => (v: T, i: number, a: ReadonlyArray<T>): Promise<U> =>
      mapFn(v, i, a).then((vv: U): U => (instance.progress(i, a.length), vv)),
    start: () => {
      spinner.start();
    },
    stop: () => {
      spinner.stop(true);
    },
  });

  return instance;
};
