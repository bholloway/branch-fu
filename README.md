# Branch FU

[![NPM](https://nodei.co/npm/branch-fu.png)](http://github.com/bholloway/branch-fu)

Command-line utility for cleaning up git branches

## CLI Usage

To use the CLI you need to install as a global package or use [npx](https://www.npmjs.com/package/npx).

```
npm i -g branch-fu
```

### options

common across all commands

* `-h, --help` show these options
* `-f, --fetch` run fetch first
* `-m, --merged <branch>` limit to branches already merged with branch (e.g. "origin/master")
* `-x, --pattern <glob> ...` limit branches by glob(s) (case insensitive per [picomatch](https://github.com/micromatch/picomatch))
* `-u, --user <name>` limit to branches with last commit by the given user
* `-s, --stale <duration>` limit to branches stale since date or duration (per [ms](https://github.com/vercel/ms#readme))

### commands

#### count

Count the remote branches that match the criteria.

```
branch-fu count -f -m "origin/master" -u "Guy Dudeson" -s 90days"
```

### report

Find remote branches that match the criteria but collate them by user.

Append a list of emails for a `bcc` mail out.

```
branch-fu report -f -m "origin/master" -p "\!origin/release/*"
```

### list

List remote branches that match the criteria.

```
branch-fu list -f -m "origin/master" -p "\!origin/release/*"
```
