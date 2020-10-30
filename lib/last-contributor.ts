'use strict';

import git from './git';
import type {LastContributor} from './types';

export default (branch: string): Promise<LastContributor> =>
  git('show', '--format="%ai | %an | %ae"', '--name-only', branch)
    .then(String)
    .then((text: String) => String(text || '')
      .split('\n')
      .map(v => v.trim())
      .filter(Boolean)
    )
    .then((lines: ReadonlyArray<String>) => lines[0]
      .slice(1, -1)
      .split('|')
      .map(v => v.trim())
    )
    .then((v: [string, string, string]) => ({
      branch,
      date: new Date(Date.parse(v[0])),
      user: v[1],
      email: v[2]
    }));
