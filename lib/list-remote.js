const listRemote = isMergedOnly => {
  const git = require('./git');
  const splitLines = require('./split-lines');

  return git('branch', '-r', isMergedOnly ? ['--merged', 'origin/master'] : [])
    .then(splitLines)
    .then(lines => lines.filter(v => !/\s-\>\s/.test(v)));
};

module.exports = listRemote;