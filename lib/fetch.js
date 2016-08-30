const fetch = () => {
  const git = require('./git');

  return git('fetch');
};

module.exports = fetch;