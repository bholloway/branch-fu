'use strict';

import picomatch from 'picomatch';
const program = require('commander');
const ms = require('ms');

const {count, report} = require('./command');
import {Matcher} from './lib/types';

const parsePattern = (pattern: string, accumulator: Matcher) => {
  // @ts-ignore
  const matcher = picomatch(pattern, {nocase: true});
  const test = (v: string) => matcher(v); // suppress additional arguments
  const fn = accumulator ? (branch: string) => accumulator(branch) && test(branch) : test;
  const toJSON = accumulator ? [].concat(accumulator.toJSON()).concat(pattern) : pattern;
  return Object.assign(fn, {toJSON});
}

const parseDateDuration = (text: string): Date | false => {
  const duration = ms(text);
  const date = new Date(Date.parse(text));
  const pending = duration ? new Date(Date.now() - duration) : date;
  return pending.valueOf() ? pending : false;
};

let timeout: NodeJS.Timeout = undefined;

const withOptions = (fn: Function) => (...args: ReadonlyArray<string | {parent?: {}}>) => {
  if (args.length === 1) {
    const obj: { parent?: {} } | undefined = args.find((v): v is {} => typeof v !== 'string');
    const options: {} = obj && obj.parent || obj;
    timeout = setTimeout(() => fn(options), 0);
  }
};

program
  .version(require('./package.json').version, '-v, --version', 'output the current version')

program
  .option('-f, --fetch', 'run git fetch first', () => true, false)
  .option('-m, --merged <branch>', 'limit to branches already merged with branch (e.g. "origin/master")', false)
  .option('-p, --pattern <glob>', 'limit branches by glob (per picomatch)', parsePattern, false)
  .option('-u, --user <name>', 'limit to branches with last commit by the given user', '*')
  .option('-s, --stale <duration>', 'limit to branches stale since date or duration (per ms)', parseDateDuration, false);

program
  .command('count')
  .description('count remote branches that match the given criteria')
  .usage('branch-fu count -f -m "origin/master" -u "Guy Dudeson" -s 90days')
  .action(withOptions(count));

program
  .command('report')
  .description('list remote branches, group by user, and append all user emails')
  .usage('branch-fu report -f -m "origin/master" -p "!origin/release/*"')
  .action(withOptions(report));

program
  .parse(process.argv);

if (!timeout) {
  program.help();
}
