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
  this.appendSuffix = !!options.appendSuffix;

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
