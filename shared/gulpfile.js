var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var ts = require("gulp-typescript");
var gulpTypings = require("gulp-typings");

gulp.task('default', ['watch']);

gulp.task('build', ['ts']);

gulp.task('watch', ['build'], () => {
    return gulp.watch(['client/**/*.*', '*.js', '*.json'], ['build']);
});

gulp.task('clean', function () {
    return del('dist/**/*');
});

// install typings
gulp.task("typings", ['clean'], () => {
    return gulp.src("./typings.json").pipe(gulpTypings());
});

// compile typescript
gulp.task('ts', ['typings'], () => {
    var tsConfig = require('./tsconfig.json');

    return gulp.src('client/**/*.ts').pipe(ts(tsConfig.compilerOptions)).pipe(gulp.dest('dist/client'));
});
