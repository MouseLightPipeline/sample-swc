var gulp = require('gulp');
var plumber = require('gulp-plumber');
var del = require('del');
var exec = require('child_process').exec;

gulp.task('default', ['develop']);

gulp.task('build', []);

gulp.task('develop', ['build'], function () {
    exec('swagger project start', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    console.log(err);
  });
});
