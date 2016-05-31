var gulp = require('gulp'),
  del = require('del'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  ts = require("gulp-typescript");
  gulpTypings = require("gulp-typings");
 
gulp.task('default', ['watch']);

gulp.task('build', ['client:src', 'tests:ts']);

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
gulp.task("typings", ['clean'], function() {
  return gulp.src("./typings.json").pipe(gulpTypings());
});

// compile typescript
gulp.task('ts', ['typings'], function () {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src('client/**/*.ts').pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('tests:ts', [], function () {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src('tests/**/*.ts').pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest('tests'));
});

