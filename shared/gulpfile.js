var gulp = require('gulp'),
  del = require('del'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  ts = require("gulp-typescript");
  gulpTypings = require("gulp-typings");
 
gulp.task('default', ['watch']);

gulp.task('build', ['client:src']);

gulp.task('watch', ['build'], function() {
    livereload.listen({port: 33729});

    return gulp.watch(['client/**/*.*', 'tests/**/*.ts', 'tests/**/*.html'], ['refresh']);
});

gulp.task('refresh', ['build'], function() {
    livereload.changed(__dirname);
});

gulp.task('clean', function () {
  return del('dist/**/*');
});

gulp.task('client:src', ['ts']);

// install typings
gulp.task("typings", [], function() {
  return gulp.src("./typings.json").pipe(gulpTypings());
});

// compile typescript
gulp.task('ts', ['typings'], function () {
    var tsconfig = require('./tsconfig.json');
    return gulp.src('client/**/*.ts').pipe(ts(tsconfig.compilerOptions)).pipe(gulp.dest('dist/client'));
});
