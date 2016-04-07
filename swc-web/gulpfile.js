var gulp = require('gulp'),
  del = require('del'),
  rename = require('gulp-rename'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  typescript = require("gulp-typescript");
  gulpTypings = require("gulp-typings");
 
gulp.task('default', ['develop']);

gulp.task('build', ['server:dep', 'client:dep', 'client:src']);

gulp.task('develop', ['nodemon', 'watch']);

gulp.task('nodemon', ['build'], function () {
  livereload.listen({port: 34729});
  nodemon({
    script: 'dist/server/app.js',
    ext: 'js jade html css',
    ignore: ['client/**/*.*', 'server/**/*.*', 'gulpfile.js', './*.json'],
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
          console.log('triggered')
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('watch', ['build'], function() {
    return gulp.watch(['server/**/*.*', 'client/**/*.*'], ['build']);
});

/*
gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'dist/server/app.js',
    ext: 'js ts jade css',
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

  
gulp.task('watch', ['build'], function () {
  var stream = nodemon({
    script: 'dist/server/app.js',
    ext: 'js ts jade css',
    ignore: 'dist',
    tasks: ['build']
  });

  return stream;
})
*/

gulp.task('server:dep', ['js', 'jade']);

gulp.task('client:dep', ['html', 'css', 'lib:js', 'lib:css', 'lib:fonts:1', 'lib:fonts:2']);

gulp.task('client:src', ['ts']);

gulp.task('clean', function () {
  return del('dist/**/*');
});

// install typings
gulp.task("typings",function() {
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
      'bower_components/tether/dist/js/tether.min.js'
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

// compile typescript
gulp.task('ts', ['clean'], function () {
  var tsconfig = './tsconfig.json';
  return gulp
    .src('client/**/*.ts')
    .pipe(typescript(tsconfig.compilerOptions))
    .pipe(gulp.dest('dist/public'));
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

// move jade
gulp.task('jade', ['clean'], function () {
  return gulp.src('server/**/*.jade')
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
