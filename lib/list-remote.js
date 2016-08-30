const listRemote = mergedWith => {
  const git = require('./git');
  const splitLines = require('./split-lines');

  return git('branch', '-r', mergedWith ? ['--merged', mergedWith] : [])
    .then(splitLines)
    .then(lines => lines.filter(v => !/\s-\>\s/.test(v)));
};

module.exports = listRemote;