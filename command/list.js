'use strict';

function list(options) {
  const Q = require('q');
  const moment = require('moment');
  const flatten = require('lodash.flattendeep');
  const Spinner = require('cli-spinner').Spinner;

  const fetch = require('../lib/fetch');
  const listRemote = require('../lib/list-remote');
  const lastContributer = require('../lib/last-contributer');
  const dedupeXbyY = require('../lib/dedupe-x-by-y');

  const now = moment();
  const cutoffDate = !!options.stale && options.stale.length && now.subtract.apply(now, options.stale);
  const mergedWith = (typeof options.merged === 'string') && options.merged || !!options.merged && 'origin/master';

  console.log(`fetch:       ${options.fetch}`);
  console.log(`user:        "${options.user}"`);
  console.log(`merged:      ${mergedWith && ('"' + mergedWith + '"')}`);
  console.log(`stale since: ${cutoffDate}`);

  const testUser = candidate =>
    ((options.user === '*') || (candidate.toLowerCase().indexOf(options.user.toLowerCase()) >= 0));

  const testStale = candidate =>
    (!cutoffDate || (candidate.valueOf() <= cutoffDate.valueOf()));

  const eachBranch = branch =>
    lastContributer(branch)
      .then(contribution => testUser(contribution.user) && testStale(contribution.date) && contribution);

  const getReport = results => {
    const report = flatten(
      results.map((v, i, array) => {
        const isChange = (i === 0) || (v.user !== array[i - 1].user);
        return isChange ? ['', `${v.user} <${v.email}>`, `  ${v.branch}`] : `  ${v.branch}`
      })
    );

    const emails = results
      .map(v => `"${v.user}" <${v.email}>`)
      .filter((v, i, array) => (array.indexOf(v) === i));

    return []
      .concat(report)
      .concat('')
      .concat(`${results.length} branches`)
      .concat('')
      .concat(emails.join('; '));
  };

  const spinner = new Spinner();
  spinner.start();

  return (options.fetch ? fetch() : Q.when())
    .then(() => listRemote(mergedWith))
    .then(branches => Q.all(branches.map(eachBranch)))
    .then(results => results.reduce((reduced, v) => reduced.concat(v).filter(Boolean), []))
    .then(results => dedupeXbyY('user', 'email')(results))
    .then(results => results.sort((a, b) => a.user.localeCompare(b.user)))
    .then(results => {
      spinner.stop(true);
      return results;
    })
    .then(results => getReport(results).map(v => console.log(v)))
    .catch(error => error);
}

module.exports = list;