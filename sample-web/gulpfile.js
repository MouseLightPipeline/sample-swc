var gulp = require('gulp'),
  del = require('del'),
  rename = require('gulp-rename'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  typescript = require("gulp-typescript");
  gulpTypings = require("gulp-typings");

gulp.task('default', ['sampleweb']);

gulp.task('sampleweb', ['develop']);

gulp.task('build', ['server:dep', 'client:dep', 'client:src']);

gulp.task('develop', ['nodemon', 'watch']);

gulp.task('nodemon', ['build'], () => {
  livereload.listen({port: 34729});
  nodemon({
    script: 'dist/server/app.js',
    ext: 'js pug html css',
    ignore: ['client/**/*.*', 'server/**/*.*', 'gulpfile.js', './*.json'],
    debug: true,
    stdout: false,
    delay: 3
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('watch', ['build'], function() {
    return gulp.watch(['server/**/*.*', 'client/**/*.*', '../shared/dist/**/*.*'], ['build']);
});

gulp.task('server:dep', ['js', 'pug']);

gulp.task('client:dep', ['html', 'css', 'lib:js', 'lib:css', 'lib:fonts:1', 'lib:fonts:2']);

gulp.task('client:src', ['ts', 'client:shared']);

gulp.task('clean', function () {
  return del('dist/**/*');
});

// install typings
gulp.task("typings", ['clean'], function() {
  return gulp.src("./typings.json").pipe(gulpTypings());
});

gulp.task('lib:js', ['clean'], function() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/angular/angular.min.js',
      'bower_components/angular/angular.min.js.map',
      'bower_components/angular-resource/angular-resource.min.js',
      'bower_components/angular-resource/angular-resource.min.js.map',
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
      'bower_components/bootstrap-material-design/dist/js/material.min.js',
      'bower_components/bootstrap-material-design/dist/js/material.min.js.map',
      'bower_components/bootstrap-material-design/dist/js/ripples.min.js',
      'bower_components/bootstrap-material-design/dist/js/ripples.min.js.map',
      'bower_components/tether/dist/js/tether.min.js',
      'bower_components/socket.io-client/socket.io.js'
    ])
    .pipe(gulp.dest('dist/public/lib'))
});

gulp.task('lib:css', ['clean'], function() {
  return gulp.src([
      'bower_components/bootstrap/dist/css/bootstrap.min.css',
      'bower_components/bootstrap/dist/css/bootstrap.min.css.map',
      'bower_components/bootstrap-material-design/dist/css/bootstrap-material-design.min.css',
      'bower_components/bootstrap-material-design/dist/css/bootstrap-material-design.min.css.map',
      'bower_components/bootstrap-material-design/dist/css/ripples.min.css',
      'bower_components/bootstrap-material-design/dist/css/ripples.min.css.map',
      'bower_components/tether/dist/css/tether.min.css',
      'bower_components/font-awesome/css/font-awesome.min.css',
      'bower_components/lato/css/lato.min.css'
    ])
    .pipe(gulp.dest('dist/public/css'))
});

// compile typescript
gulp.task('ts', ['typings'], function () {
  var tsconfig = require('./tsconfig.json');

  return gulp.src('client/**/*.ts').pipe(typescript(tsconfig.compilerOptions)).pipe(gulp.dest('dist/public'));
});

gulp.task('lib:fonts:1', ['clean'], function() {
  return gulp.src([
      'bower_components/font-awesome/fonts/*.*'
    ])
    .pipe(gulp.dest('dist/public/fonts'))
});

gulp.task('lib:fonts:2', ['clean'], function() {
  return gulp.src([
      'bower_components/lato/font/**/*'
    ])
    .pipe(gulp.dest('dist/public/font'))
});

// move js
gulp.task('js', ['clean'], function () {
  return gulp.src('server/**/*.js')
    .pipe(gulp.dest('dist/server'));
});

// move pug
gulp.task('pug', ['clean'], function () {
  return gulp.src('server/**/*.pug')
    .pipe(gulp.dest('dist/server'))
});

// move html
gulp.task('html', ['clean'], function () {
  return gulp.src('server/**/*.html')
    .pipe(gulp.dest('dist/public'))
});

// move css
gulp.task('css', ['clean'], function () {
  return gulp.src('server/**/*.css')
    .pipe(gulp.dest('dist/public'))
});

// move shared
gulp.task('client:shared', ['clean'], function () {
  return gulp.src('../shared/dist/client/services/*.js').pipe(gulp.dest('dist/public/lib'))
});
