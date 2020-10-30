'use strict';

import git from './git';

export default () =>
  git('fetch', '-p');
