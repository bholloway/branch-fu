'use strict';

import sequence from 'p-pipe';

import {init, maybeFetch, getBranches, filterBranches} from './common';

export default sequence(init, maybeFetch, getBranches, filterBranches);
