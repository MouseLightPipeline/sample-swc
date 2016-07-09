var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var del = require('del');

gulp.task('default', ['develop']);

gulp.task('build', ['lib:js', 'lib:css', 'lib:fonts:1', 'lib:fonts:2', 'client:js', 'js', 'pug', 'css']);

gulp.task('develop', ['nodemon', 'watch']);

gulp.task('nodemon', ['build'], function () {
  livereload.listen({port: 34728});
  nodemon({
    script: 'dist/server/app.js',
    ext: 'js pug html css',
    ignore: ['client/**/*.*', 'server/**/*.*'],
    stdout: false
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

gulp.task('watch', function() {
    return gulp.watch(['server/**/*.*', 'client/**/*.*'], ['build']);
});

gulp.task('clean', function () {
  return del('dist/**/*');
});

gulp.task('lib:js', ['clean'], function() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
      'bower_components/tether/dist/js/tether.min.js',
      'bower_components/socket.io.client/dist/socket.io-1.3.5.js'
    ])
    .pipe(gulp.dest('dist/public/lib'))
});


gulp.task('lib:css', ['clean'], function() {
  return gulp.src([
      'bower_components/bootstrap/dist/css/bootstrap.min.css',
      'bower_components/bootstrap/dist/css/bootstrap.min.css.map',
      'bower_components/tether/dist/css/tether.min.css',
      'bower_components/font-awesome/css/font-awesome.min.css',
      'bower_components/lato/css/lato.min.css'
    ])
    .pipe(gulp.dest('dist/public/css'))
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

// move client js
gulp.task('client:js', ['clean'], function () {
  return gulp.src('client/**/*.js')
    .pipe(gulp.dest('dist/public/lib'));
});


// move css
gulp.task('css', ['clean'], function () {
  return gulp.src('server/**/*.css')
    .pipe(gulp.dest('dist/public'))
});

// move server js
gulp.task('js', ['clean'], function () {
  return gulp.src('server/**/*.js')
    .pipe(gulp.dest('dist/server'));
});

// move pug
gulp.task('pug', ['clean'], function () {
  return gulp.src('server/**/*.pug')
    .pipe(gulp.dest('dist/server'))
});
