var resolveUrl = require('../');
var should = require('should');
var fs = require('fs');
var path = require('path');
var assert = require('stream-assert');
var File = require('vinyl');
var gulp = require('gulp');
var concat = require('gulp-concat-sourcemap');
var sourcemaps = require('gulp-sourcemaps');
require('mocha');

var basePath = path.join(__dirname, "fixtures");

describe('gulp-resolve-url', function() {

  describe('resolveUrl()', function() {

    it('should rewrite resource url', function (done) {
      var stream = gulp.src([path.join(basePath, "main.css"),path.join(basePath,"sub","module.css")], {base:basePath})
        .pipe(sourcemaps.init())
        .pipe(concat('main2.css'))
        .pipe(resolveUrl({
            root: __dirname
        }));

      stream
        .pipe(assert.length(1))
        .pipe(assert.first(function (d) { d.contents.toString().should.eql('div {\n  background-image: url("sub/resource.png");\n}\n\n'); }))
        .pipe(assert.end(done));
    });
  });
});