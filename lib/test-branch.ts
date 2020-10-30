'use strict';

import {Options} from './types';
import lastContributor from './last-contributor';

export default ({user, stale}: Pick<Options, 'user' | 'stale'> ) => {
  const testUser = (value: string) =>
    (user === '*') || value.toLowerCase().includes(user.toLowerCase());

  const testStale = (value: Date) =>
    !stale || (value.valueOf() <= stale.valueOf());

  return (branch: string) =>
    lastContributor(branch)
      .then(({user, date, email}) => testUser(user) && testStale(date) && { branch, user, email, date });
};
