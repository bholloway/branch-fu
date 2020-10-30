'use strict';

import git from './git';

export default (merged: string | false) => {
  const mergeArg = typeof merged === 'string' ? `--merged=${merged}` : null
  return git('branch', '-r', mergeArg)
    .then(text => String(text || '')
      .split('\n')
      .map(v => v.trim())
      .filter(Boolean))
    .then(lines => lines.filter(v => !/\s->\s/.test(v)));
};
