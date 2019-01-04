'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('scripts-reload', function () {
    return buildScripts()
        .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
    return buildScripts();
});

function buildScripts() {
    var files = gulp.src([
        path.join(conf.paths.src, '/app/core/**/*.js'),
        path.join(conf.paths.src, '/app/main/**/*.js'),
        path.join(conf.paths.src, '/app/themes/*.module.js'),
        path.join(conf.paths.src, '/app/themes/' + conf.theme + '/**/*.js'),
        path.join(conf.paths.src, '/app/index.*.js'),
    ]);

    return files
        // Enable the following two lines if you want linter
        // to check your code every time the scripts reloaded
        //.pipe($.eslint())
        //.pipe($.eslint.format())
        .pipe($.size())
};