const fetch = () => {
  const git = require('./git');

  return git('fetch', '-p');
};

module.exports = fetch;