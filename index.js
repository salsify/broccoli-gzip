var zlib = require('zlib');
var RSVP = require('rsvp');
var helpers = require('broccoli-kitchen-sink-helpers');
var Filter = require('broccoli-persistent-filter');
var stringify = require('json-stable-stringify');

GzipFilter.prototype = Object.create(Filter.prototype);
GzipFilter.prototype.constructor = GzipFilter;

function GzipFilter(inputNode, _options) {
  if (!(this instanceof GzipFilter)) return new GzipFilter(inputNode, _options);

  var options = _options || {};
  if (!options.hasOwnProperty('persist')) {
    options.persist = true; // default to persistent cache
  }

  this.options = options;

  this.keepUncompressed = options.keepUncompressed;
  this.appendSuffix = options.hasOwnProperty('appendSuffix') ? options.appendSuffix : true;

  // Default file encoding is raw to handle binary files
  this.inputEncoding = options.inputEncoding || null;
  this.outputEncoding = options.outputEncoding || null;

  if(this.keepUncompressed && !this.appendSuffix) {
    throw new Error('Cannot keep uncompressed files without appending suffix. Filenames would be the same.');
  }

  Filter.call(this, inputNode, options);
}

GzipFilter.prototype.processFile = function(srcDir, destDir, relativePath) {
  if (this.keepUncompressed) {
    helpers.copyPreserveSync(srcDir + '/' + relativePath, destDir + '/' + relativePath);
  }

  return Filter.prototype.processFile.apply(this, arguments);
};

GzipFilter.prototype.baseDir = function() {
  return __dirname;
}

GzipFilter.prototype.optionsHash =  function() {
  if (!this._optionsHash) {
    this._optionsHash = stringify(this.options);
  }

  return this._optionsHash;
}

GzipFilter.prototype.cacheKeyProcessString = function(string, relativePath) {
  return this.optionsHash() + Filter.prototype.cacheKeyProcessString.call(this, string, relativePath);
}

GzipFilter.prototype.processString = function(str) {
  return RSVP.denodeify(zlib.gzip)(str);
};

GzipFilter.prototype.getDestFilePath = function() {
  var destFilePath = Filter.prototype.getDestFilePath.apply(this, arguments);
  if (destFilePath) {
    return this.appendSuffix ? destFilePath + '.gz' : destFilePath;
  }
};

module.exports = GzipFilter;
