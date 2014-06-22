# Broccoli Gzip Plugin

[![Build Status](https://travis-ci.org/salsify/broccoli-gzip.svg?branch=master)](https://travis-ci.org/salsify/broccoli-gzip)

## Installation

```bash
npm install -D broccoli-gzip
```

## Example

```javascript
var gzipFiles = require('broccoli-gzip');

var tree = gzipFiles('app', {
  extensions: ['js', 'css']
});
```

## Configuration

### `gzipFiles(inputTree, options)`

---

`options.extensions` *{Array}* (Required)

The file extensions that should be compressed.

---

`options.keepUncompressed` *{Boolean}* (Optional, default `false`)

Whether the uncompressed versions of the files should be kept in the resulting tree.

---

`options.appendSuffix` *{Boolean}* (Optional, default `true`)

Whether to append the .gz suffix.

## Testing

```bash
npm install
npm test
```

## License

This project is distributed under the MIT license.
