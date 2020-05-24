'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var sourcemap = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var imagemin = require('gulp-imagemin');
var svgstore = require('gulp-svgstore');
var webp = require('gulp-webp');
var rename = require('gulp-rename');
var server = require('browser-sync').create();

gulp.task('css', function () {
  return gulp.src('Source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('Source/css'))
    .pipe(server.stream());
});

gulp.task('images', function() {
  return gulp.src('Source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({quality: 70, progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('Source/images/'))
});

gulp.task('sprite', function() {
  return gulp.src('Source/images/**/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('Source/images/'))
});

gulp.task(`webp`, function() {
  return gulp.src('Source/images/**/*.{png,jpg}')
    .pipe(webp({quality: 70}))
    .pipe(gulp.dest('Source/images/'))
});

gulp.task('server', function () {
  server.init({
    server: 'Source/'
  });

  gulp.watch('Source/sass/**/*.{sass,scss}', gulp.series('css'));
  gulp.watch('Source/*.html').on('change', server.reload);
});

gulp.task('start', gulp.series('css', 'server'));
