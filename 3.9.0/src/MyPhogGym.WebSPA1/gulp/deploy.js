'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var replace = require('gulp-replace');
var publishPath = "D:\\Projects\\TRENET\\TRENET.APP.EDU\\Publish";

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('deploy:clean', function () {
    return $.del([conf.paths.dist], { force: true });
});

gulp.task('deploy:copy-site', ['deploy:clean', 'deploy:fixendpoint'], function () {
    return gulp.src(path.join(conf.paths.dist, '/**'))
        .pipe(gulp.dest(publishPath));
});

gulp.task('deploy:fixendpoint', ['deploy:clean', 'build'], function () {
    return gulp.src([path.join(conf.paths.dist, '/**/*.js'), path.join(conf.paths.dist, '/**/*.html')])
        .pipe(replace('localhost:6634', 'edu.trenet.com.vn'))
        .pipe(replace('localhost:6635', 'edu.trenet.com.vn'))
        .pipe(replace('localhost:3000', 'edu.trenet.com.vn'))
        .pipe(replace('localhost:3002', 'sso.trenet.com.vn'))
        .pipe(replace('localhost', 'trenet.com.vn'))
        .pipe(gulp.dest(conf.paths.dist));
});

gulp.task('deploy:site', ['deploy:copy-site']);
