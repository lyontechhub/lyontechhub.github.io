var gulp = require('gulp');
var del = require('del')
var deploy = require("gulp-gh-pages");
var less = require("gulp-less");
var amdOptimize = require('amd-optimize');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var argv = require('yargs').argv;
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');

/* Configuration */
var lessSource = 'css/main.less';
var jsSource = 'js/**/*.js';
var htmlSource = ['views/*.html', 'index.html'];
var destDir = "dist/";

/* Tasks */
gulp.task('clean', function () {
    del('dist/css', true);
    del('dist/js', true);
    del('dist/views', true);
    del('dist/index.html', true);
});

gulp.task('build-css', function () {
    return gulp.src(lessSource, { base: './' })
        .pipe(less({ paths: [ 'bower_components/bootstrap/less/' ] }))
        .pipe(gulpIf(argv.push, minifyCSS()))
        .pipe(gulp.dest(destDir));
});

gulp.task('watch-css', function() {
    gulp.watch(lessSource, ['build-css']);
});

gulp.task('build-js', function () {
    return gulp.src(jsSource, { base: './' })
        .pipe(amdOptimize('main', {
            baseUrl: 'js',

            paths: {
                'jquery': 'empty:',
                'domReady': 'empty:',
                'angular': 'empty:',
                'angularRoute': '../bower_components/angular-route/angular-route.min',
                'angularStrapNavBar': '../bower_components/angular-strap/dist/modules/navbar.min'
            },

            shim: {
                'angular': {
                    deps: ['jquery'],
                    exports: 'angular'
                },
                'angularRoute': {
                    deps: ['angular']
                },
                'angularStrapNavBar': {
                    deps: ['angular']
                }
            }}))
        .pipe(concat('js/build.min.js'))
        .pipe(gulpIf(argv.push, uglify()))
        .pipe(gulp.dest(destDir));
});

gulp.task('watch-js', function() {
    gulp.watch(jsSource, ['build-js']);
});

gulp.task('build-html', function () {
    return gulp.src(htmlSource, { base: './' })
        .pipe(gulp.dest(destDir));
});

gulp.task('watch-html', function() {
    gulp.watch(jsSource, ['build-html']);
});

gulp.task('build', ['build-css', 'build-js', 'build-html']);

gulp.task('watch', ['watch-css', 'watch-js', 'watch-html']);

gulp.task('deploy', ['build'], function () {
    var push = argv.push ? true : false;
    var options = {
        "branch": "master",
        "push": push
    }
    return gulp.src(['./dist/**/*', '!./dist/data/**/*', '!./dist/imgs/**/*'])
        .pipe(deploy(options));
});