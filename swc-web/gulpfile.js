const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

// TypeScript compile
gulp.task('compile', function () {
  var tsResult = tsProject.src().pipe(ts(tsProject));	
	return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('dependencies', ['lib', 'html', 'css']);

gulp.task('lib', function () {
  return gulp.src([
    'node_modules/es6-shim/es6-shim.min.js',
    'node_modules/es6-shim/es6-shim.map',
    'node_modules/systemjs/dist/system-polyfills.js',
    'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/systemjs/dist/system.src.js',
    'node_modules/rxjs/bundles/Rx.js',
    'node_modules/angular2/bundles/angular2.dev.js',
  ])
    .pipe(gulp.dest('dist' + '/lib'));
});

// move html
gulp.task('html', function () {
  return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'))
});

gulp.task('css', function () {
  return gulp.src('app/**/*.css')
    .pipe(gulp.dest('dist'))
});

gulp.task('build', ['dependencies', 'compile']);
gulp.task('default', ['build']);
