'use strict';

import sequence from 'p-pipe';

import {init, maybeFetch, getBranches, filterBranches, segment} from './common';
import {lift, liftTap} from '../lib/fp';
import {LastContributor} from '../lib/types';

const list = segment<LastContributor>(
  lift(branches => branches.map(({branch}) => branch).sort((a, b) => a.localeCompare(b))),
  liftTap(lines => console.log(lines.join('\n')))
);

export default sequence(init, maybeFetch, getBranches, filterBranches, list);
