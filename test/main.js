var resolveUrl = require('../');
var should = require('should');
var fs = require('fs');
var path = require('path');
var assert = require('stream-assert');
var File = require('vinyl');
var gulp = require('gulp');
var concat = require('gulp-concat-sourcemap');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
require('mocha');

var basePath = path.join(__dirname, "fixtures");

describe('gulp-resolve-url', function() {

  describe('resolveUrl()', function() {

    it('should work with sass plugin', function (done) {
        var stream = gulp.src([path.join(basePath, "main.scss")], {base:basePath})
          .pipe(sourcemaps.init())
          .pipe(sass())
          .pipe(resolveUrl({
              root: __dirname
          }));
  
        stream
          .pipe(assert.length(1))
          .pipe(assert.first(function (d) { d.contents.toString().should.eql('div {\n  background-image: url("sub/resource.png");\n}\n\n'); }))
          .pipe(assert.end(done));
      });

    it('should produce urls that contain the full module path when the absolute option is included', function (done) {
      var stream = gulp.src([path.join(basePath, "main.scss")], {base:basePath})
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(resolveUrl({
          root: __dirname,
          absolute: true
        }));

      stream
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) { d.contents.toString().should.containEql('/test/fixtures/sub/resource.png'); }))
        .pipe(assert.end(done));
      });
    
    it ('should produce urls relative to the destination path of the output', function (done) {
      var srcPath = path.join(basePath, "main.scss");
      var destPath = path.join(basePath, "build", "css");
      var stream = gulp.src([srcPath], {base:basePath})
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(resolveUrl({
          root: __dirname,
          destination: destPath
        }));
      
      stream
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) {
          d.contents.toString().should.containEql('background-image: url("../../sub/resource.png");');
        }))
        .pipe(assert.end(done));
    });

  });
});