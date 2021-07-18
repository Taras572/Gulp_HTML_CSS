const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const image = require('gulp-image');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const del = require('del');
const paths = {
    images: {
        src: 'app/images/*.*',
        dest: 'build/images'
    },
    fonts: {
        src: 'app/fonts/**',
        dest: 'build/fonts'
    },
    styles: {
        src: 'app/styles/**/*.scss',
        dest: 'build/css'
    },
    scripts: {
        src: 'app/js/**/*.js',
        dest: 'build/scripts'
    },
    pug: {
        src: 'app/*.pug',
        dest: 'build/'
    }
};
const html = () => {
    return gulp.src(paths.pug.src)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.pug.dest))
}
const styles = () => {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('err',sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dest))
}
const scripts = () => {
    return gulp.src(paths.scripts.src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
}
const images = () => {
    return gulp.src(paths.images.src)
        .pipe(image())
        .pipe(gulp.dest(paths.images.dest))
}
const fonts = () => {
    return gulp.src(paths.pug.src)
        .pipe(gulp.dest(paths.fonts.dest))
}
const watch = () => {
    gulp.watch('app/**/*.pug', html);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.fonts.src, fonts);
}
const server = () => {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        notify: false
    });
    browserSync.watch('build', browserSync.reload);
}
const deleteBuild = (cb) => {
    return del('build/**/*.*').then(() => { cb() });
}
exports.default = gulp.series(
    deleteBuild, 
    gulp.parallel(html,styles, scripts, images,fonts),
    gulp.parallel(watch, server),
    );