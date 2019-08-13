const lastContributer = branch => {
  const moment = require('moment');

  const git = require('./git');
  const splitLines = require('./split-lines');

  return git('show', '--format="%ai | %an | %ae"', branch)
    .then(String)
    .then(splitLines)
    .then(lines => lines[0]
      .slice(1, -1)
      .split('|')
      .map(v => v.trim())
    )
    .then(v => ({
      branch,
      date: moment(v[0], 'YYYY-MM-DD HH-MM-SS Z'),
      user: v[1],
      email: v[2]
    }));
};

module.exports = lastContributer;