# Branch FU

[![NPM](https://nodei.co/npm/branch-fu.png)](http://github.com/bholloway/branch-fu)

Command-line utility for cleaning up git branche

## CLI Usage

To use the CLI you need to install as a global package.

```
npm i -g branch-fu
```

### list

List the remote branches that match some criteria.

```
branch-fu list -u "Guy Dudeson" -m -a "6 months"
```

Options:

* `-u, --user [name]` limit results to the given user
* `-m, --merged [branch]` limit to branches already merged with origin/master or optional given branch
* `-a, --age [value]`, 'limit to branches older that the given duration (per [momentjs subtract](http://momentjs.com/docs/#/manipulating/subtract/))


### convert

Convert files **in place** that match the given glob.

```
branch-fu convert -g "myDir/**/*.js"
```

Options:

* `-g, --glob [value]` A glob to match, default is `**/*.js`
* `-l, --list` Optionally list of files that will be considered
* `-s, --source-map [value]` Generate an optional source-map file per the given extension
* `-q, --quote-char [value]` Optionally specify the quotation character for strings

## API Usage

### `processSync(content, options):object`

Migrate the given content.

Where output is `{isChanged:boolean, content:string, sourceMap:object, errors:Array.<string>}`.

Where options are `{sourceMap:object, filename:string, quoteChar:string}`.

If the `sourceMap` option is truthy then a source-map is generated. Otherwise it will be `null` in the output. If it is of type `object` then it is expected to be the incoming source-map. Where source-map is used then a `filename` option should indicate the current source.

The optional `quoteChar` option indicates the string literal delineator to use in the output `content`.