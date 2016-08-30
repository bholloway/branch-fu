'use strict';

function list(options) {
  const Q = require('q');
  const moment = require('moment');
  const Spinner = require('cli-spinner').Spinner;

  const listRemote = require('../lib/list-remote');
  const lastContributer = require('../lib/last-contributer');

  const now = moment();
  const dateCutoff = !!options.age && options.age.length && now.subtract.apply(now, options.age);
  const mergedWith = (typeof options.merged === 'string') && options.merged || !!options.merged && 'origin/master';

  console.log(`user:                  "${options.user}"`);
  console.log(`merged:                ${mergedWith && ('"' + mergedWith + '"')}`);
  console.log(`date cutoff (per age): ${dateCutoff}`);

  const testUser = candidate =>
    ((options.user === '*') || (candidate.toLowerCase().indexOf(options.user.toLowerCase()) >= 0));

  const testAge = candidate =>
    (!dateCutoff || (candidate.valueOf() <= dateCutoff.valueOf()));

  const eachBranch = branch =>
    lastContributer(branch)
      .then(contribution => testUser(contribution.user) && testAge(contribution.date) && contribution);

  const spinner = new Spinner();
  spinner.start();

  return listRemote(mergedWith)
    .then(branches => Q.all(branches.map(eachBranch)))
    .then(results => results.reduce((reduced, v) => reduced.concat(v).filter(Boolean), []))
    .then(results => results.sort((a, b) => a.user.localeCompare(b.user)))
    .then(results => {
      spinner.stop(true);
      []
        .concat('')
        .concat(results.map(v => `${v.user}:${v.branch}`))
        .concat('')
        .concat(`${results.length} results`)
        .map(v => console.log(v));
    })
    .catch(error => error);
}

module.exports = list;