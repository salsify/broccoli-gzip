var zlib = require('zlib');
var RSVP = require('rsvp');
var helpers = require('broccoli-kitchen-sink-helpers');
var Filter = require('broccoli-filter');

GzipFilter.prototype = Object.create(Filter.prototype);
GzipFilter.prototype.constructor = GzipFilter;

function GzipFilter(inputTree, options) {
  if (!(this instanceof GzipFilter)) return new GzipFilter(inputTree, options);

  options = options || {};

  this.keepUncompressed = options.keepUncompressed;
  this.appendSuffix = options.hasOwnProperty('appendSuffix') ? options.appendSuffix : true;

  // Default file encoding is raw to handle binary files
  this.inputEncoding = options.inputEncoding || null;
  this.outputEncoding = options.outputEncoding || null;

  if(this.keepUncompressed && !this.appendSuffix) {
    throw new Error('Cannot keep uncompressed files without appending suffix. Filenames would be the same.');
  }

  Filter.apply(this, arguments);
}

GzipFilter.prototype.processFile = function(srcDir, destDir, relativePath) {
  if (this.keepUncompressed) {
    helpers.copyPreserveSync(srcDir + '/' + relativePath, destDir + '/' + relativePath);
  }

  return Filter.prototype.processFile.apply(this, arguments);
};

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
