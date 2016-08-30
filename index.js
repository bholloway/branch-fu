#!/usr/bin/env node

const program = require('commander');

const validate = require('./lib/validate');

const parseAge = text => text
  .split(/\s+/)
  .map(word => word.trim())
  .filter(Boolean);

program
  .command('list')
  .option('-u, --user [value]', 'user to limit results to', '*')
  .option('-m, --merged', 'limit to branches already merged with master', false)
  .option('-a, --age [value]', 'limit to branches older that the given number of weeks', parseAge, false)
  .action(validate(require('./command/list')));

program
  .version(require('./package.json').version)
  .parse(process.argv);