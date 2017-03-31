# Broccoli Gzip Plugin

[![Build Status](https://travis-ci.org/salsify/broccoli-gzip.svg?branch=master)](https://travis-ci.org/salsify/broccoli-gzip)

## Installation

```bash
yarn add broccoli-gzip
```

## Example

```javascript
const Gzip = require('broccoli-gzip');

let tree = new Gzip('app', {
  extensions: ['js', 'css']
});
```

## Configuration

### `new Gzip(inputTree, options)`

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
yarn test
```

## License

This project is distributed under the MIT license.
