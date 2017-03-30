var gzip = require('../index');

var RSVP = require('rsvp');
var zlib = require('zlib');
var expect = require('expect.js');

var fs = require('fs');
var broccoli = require('broccoli');

var textContent = fs.readFileSync('tests/fixtures/sample-assets/test.txt');
var csvContent = fs.readFileSync('tests/fixtures/sample-assets/test.csv');

var builder;

describe('broccoli-gzip', function(){
  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('gzips files that match the configured extension', function() {
    var sourcePath = 'tests/fixtures/sample-assets';
    var tree = gzip(sourcePath, {
      extensions: ['txt']
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function() {
      var outputPath = builder.outputPath;
      var gzippedText = fs.readFileSync(outputPath + '/test.txt.gz');

      return RSVP.hash({
        dir: outputPath,
        actualCsv: fs.readFileSync(outputPath  + '/test.csv'),
        actualText: RSVP.denodeify(zlib.gunzip)(gzippedText)
      });
    }).then(function(result) {
      expect(result.actualText).to.eql(textContent);
      expect(result.actualCsv).to.eql(csvContent);
      expect(fs.existsSync(result.dir + '/test.txt')).to.not.be.ok();
    });
  });

  it('keeps the uncompressed files when configured to', function() {
    var sourcePath = 'tests/fixtures/sample-assets';
    var tree = gzip(sourcePath, {
      keepUncompressed: true,
      extensions: ['txt']
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(build) {
      var gzippedText = fs.readFileSync(builder.outputPath + '/test.txt.gz');
      return RSVP.hash({
        dir: builder.outputPath,
        actualCsv: fs.readFileSync(builder.outputPath + '/test.csv'),
        actualText: RSVP.denodeify(zlib.gunzip)(gzippedText)
      });
    }).then(function(result) {
      expect(result.actualText).to.eql(textContent);
      expect(fs.readFileSync(result.dir + '/test.txt')).to.eql(textContent);
      expect(result.actualCsv).to.eql(csvContent);
    });
  });

  it('it does not append the suffix when configured to', function(){
    var sourcePath = 'tests/fixtures/sample-assets';
    var tree = gzip(sourcePath, {
      extensions: ['txt'],
      appendSuffix: false,
      keepCompressed: false
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function() {
      var gzippedText = fs.readFileSync(builder.outputPath + '/test.txt');
      return RSVP.hash({
        dir: builder.outputPath,
        actualText: RSVP.denodeify(zlib.gunzip)(gzippedText)
      });
    }).then(function(result) {
      expect(result.actualText).to.eql(textContent);
      expect(fs.existsSync(result.dir + '/test.txt.gz')).to.not.be.ok();
    });
  });

  it('it errors when configured to use incompatible options', function(){
    var sourcePath = 'tests/fixtures/sample-assets';

    expect(function() {
      gzip(sourcePath, {
        keepUncompressed: true,
        appendSuffix: false
      });
    }).to.throwError();
  });
});
