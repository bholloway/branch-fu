'use strict';

import sequence from 'p-pipe';

import {init, maybeFetch, getBranches, filterBranches, segment} from './common';
import { lift, liftTap } from '../lib/fp';
import dudupeXbyY from '../lib/dedupe-x-by-y';
import {LastContributor} from '../lib/types';

const report = segment<LastContributor>(
  lift(dudupeXbyY<LastContributor>('user', 'email')),
  lift(results => results.slice().sort((a, b) => a.user.localeCompare(b.user))),
  lift(results => {
    const lines = results
      .flatMap(({ branch, user, email }, i, array) => {
        const isChange = (i === 0) || (user !== array[i - 1].user);
        return isChange ? ['', `${user} <${email}>`, `  ${branch}`] : `  ${branch}`
      });

    const emails = results
      .map(({ user, email }) => `"${user}" <${email}>`)
      .filter((v, i, array) => (array.indexOf(v) === i));

    return []
      .concat(lines)
      .concat('')
      .concat(`${results.length} branches`)
      .concat('')
      .concat(emails.join('; '));
  }),
  liftTap((_, {tick}) => tick('collate results')),
  liftTap(lines => console.log(lines.join('\n')))
);

export default sequence(init, maybeFetch, getBranches, filterBranches, report);
