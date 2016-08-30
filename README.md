# Branch FU

[![NPM](https://nodei.co/npm/branch-fu.png)](http://github.com/bholloway/branch-fu)

Command-line utility for cleaning up git branches

## CLI Usage

To use the CLI you need to install as a global package.

```
npm i -g branch-fu
```

### list

List the remote branches that match the criteria.

```
branch-fu list -f -m -u "Guy Dudeson" -s "6 months"
```

Options:

* `-f, --fetch` run fetch first
* `-m, --merged [branch]` limit to branches already merged with origin/master (or given branch)
* `-u, --user <name>` limit to branches with last commit by the given user
* `-s, --stale <duration>`, 'limit to branches stale over the given duration (per [momentjs subtract](http://momentjs.com/docs/#/manipulating/subtract/))
