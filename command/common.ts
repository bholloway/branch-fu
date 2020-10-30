'use strict';

import sequence from 'p-pipe';
import promiseLimit from 'promise-limit';

import ui from '../lib/ui';
import { pure, lift, liftTap } from '../lib/fp';
import gitFetch from '../lib/fetch';
import listRemote from '../lib/list-remote';
import testBranch from '../lib/test-branch';
import {Value, LastContributor} from '../lib/types';

export const init = pure(({fetch, merged, pattern, stale, user}) => {
    const { log, ...rest } = ui(process.stderr, 18, 10);
    log('fetch', fetch);
    log('merged', merged);
    log('pattern', pattern);
    log('stale since', stale);
    log('user', user);

    return {fetch, merged, pattern, stale, user, log, ...rest};
});

export const segment = <T extends {}>(...fns: ReadonlyArray<(input: Value<T>) => Promise<Value<T>>>) => sequence(
    liftTap((_, {start}) => start()),
    ...fns,
    liftTap((_, {stop}) => stop()),
)

export const maybeFetch = segment(
    liftTap((_, {fetch}) => fetch && gitFetch()),
    liftTap((_, {fetch, tick}) => fetch && tick('fetched'))
)

export const getBranches = segment(
    lift((_, {merged}) => listRemote(merged)),
    liftTap((branches, {log}) => log('total branches', branches.length))
);

export const filterBranches = segment<string>(
    lift((branches, {merged}) =>
        merged ? branches.filter((branch) => branch !== merged) : branches
    ),
    lift((branches, {pattern}) =>
        pattern ? branches.filter(pattern) : branches
    ),
    lift((branches, {user, stale, withProgress}) =>
        // @ts-ignore
        promiseLimit(16).map<LastContributor>(branches, withProgress<string, LastContributor>(testBranch({user, stale})))
    ),
    liftTap((_, {tick}) => tick('last contributor')),
    lift(branches => branches.filter(Boolean)),
    liftTap((branches, {log}) => log('matched branches', branches.length))
);
