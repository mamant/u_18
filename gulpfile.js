const gulp = require('gulp');
const data = require('gulp-data');
const rename = require("gulp-rename");
const fs = require('fs');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const nunjucksRender = require('gulp-nunjucks-render');
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const sorting = require('postcss-sorting');
const cssnext = require("postcss-cssnext");
const precss = require('precss');
const spritesmith = require("gulp.spritesmith");

const setting = {
    buildPath: './',
    projectName: 'uniqa',
    cssPath: 'css',
    templatesPath: ['./templates', './sections'],
    pagesPath: './templates/pages/',
    cssSplitPath: 'css/split/'
  };

gulp.task('css', function() {
    return gulp.src([
        './css/sprites/*.css',
        './css/old/*.css',
        './css/new/*.css'
    ])
    .pipe(sourcemaps.init())
    .pipe(postcss([
        precss(),
        cssnext(),
        sorting(),
    ]))
    .pipe( cssnano() )
    .pipe(concat(setting.projectName + '.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(setting.cssPath))
});

gulp.task('css-split', function() {
    return gulp.src([
        './css/sprites/*.css',
        './css/old/*.css',
        './css/new/*.css'
    ])
    .pipe(sourcemaps.init())
    .pipe(postcss([
        precss(),
        cssnext(),
        sorting(),
    ]))
    .pipe(gulp.dest(setting.cssSplitPath))
});

gulp.task('views', function() {
    return gulp.src(['./templates/pages/*.html'])
    .pipe(nunjucksRender({
        path: setting.templatesPath
    }))
    .pipe(gulp.dest(setting.buildPath));
});

gulp.task('sprites', function () {
    return  gulp.src('./images/icns/*.png')
        .pipe(spritesmith({
            imgName: 'sprite-uniqa.png',
            cssName: 'sprite-uniqa.css'
        }))
        .pipe(gulp.dest('./css/sprites/'));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
    })
});

gulp.task('dev', ['sprites', 'css', 'views', 'browserSync'], function() {
    gulp.watch('./css/new/*', ['css', 'views', browserSync.reload]);
    gulp.watch('./css/old/*', ['css', browserSync.reload]);
    gulp.watch('./templates/pages/*.html', ['views', browserSync.reload]);
    gulp.watch('./templates/components/*.njk', ['views', browserSync.reload]);
    gulp.watch('./templates/sections/*.njk', ['views', browserSync.reload]);
});
