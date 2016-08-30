function git() {
  const spawn = require('cross-spawn-promise');
  const Q = require('q');
  const flatten = require('lodash.flattendeep');

  return spawn('git', flatten(arguments))
    .catch(exception => Q.reject(exception.stderr.toString()));
}

module.exports = git;