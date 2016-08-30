#!/usr/bin/env node

const program = require('commander');

const validate = require('./lib/validate');

const splitWords = text => text
  .split(/\s+/)
  .map(word => word.trim())
  .filter(Boolean);

program
  .command('list')
  .description('list remote branches that match the given criteria')
  .usage('branch-fu list -f -m -u "Guy Dudeson" -s "6 months"')
  .option('-f, --fetch', 'run git fetch first', () => true, false)
  .option('-m, --merged [branch]', 'limit to branches already merged with origin/master (or given branch)', false)
  .option('-u, --user <name>', 'limit to branches with last commit by the given user', '*')
  .option('-s, --stale <duration>', 'limit to branches stale over the given duration (per momentjs subtract)', splitWords, false)
  .action(validate(require('./command/list')));

program
  .version(require('./package.json').version)
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}