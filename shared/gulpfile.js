var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var ts = require("gulp-typescript");
var gulpTypings = require("gulp-typings");
var tslint = require("gulp-tslint");

gulp.task('default', ['watch']);

gulp.task('build', ['tslint, ts']);

gulp.task('deploy', ['ts']);

gulp.task('watch', ['build'], () => {
    return gulp.watch(['client/**/*.*', '*.js', '*.json'], ['build']);
})

gulp.task('clean', function () {
    return del('dist/**/*');
})

gulp.task("typings", ['clean'], () => {
    return gulp.src("./typings.json")
        .pipe(gulpTypings());
})

gulp.task("tslint", () => {
        var tslintConfig = require('../tslint.json');

        gulp.src('client/**/*.ts')
            .pipe(tslint({configuration: tslintConfig}))
            .pipe(tslint.report("verbose", {emitError: false}))
    }
)

gulp.task('ts', ['typings'], () => {
    var tsConfig = require('./tsconfig.json');

    return gulp.src('client/**/*.ts')
        .pipe(ts(tsConfig.compilerOptions))
        .pipe(gulp.dest('dist/client'));
})
