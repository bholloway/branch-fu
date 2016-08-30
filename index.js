#!/usr/bin/env node

const program = require('commander');

const validate = require('./lib/validate');

const parseAge = text => text
  .split(/\s+/)
  .map(word => word.trim())
  .filter(Boolean);

program
  .command('list')
  .option('-u, --user [name]', 'limit results to the given user', '*')
  .option('-m, --merged [branch]', 'limit to branches already merged with origin/master or given branch', false)
  .option('-a, --age [value]', 'limit to branches older that the given number of weeks', parseAge, false)
  .action(validate(require('./command/list')));

program
  .version(require('./package.json').version)
  .parse(process.argv);