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
var git = require('gulp-gh-pages/lib/git');
var gutil = require('gulp-util');
var when = require('when');
var path = require('path');
var runSequence = require('run-sequence');

/* Configuration */
var lessSource = 'css/main.less';
var jsSource = 'js/**/*.js';
var htmlSource = ['views/*.html', 'index.html'];
var destDir = 'dist/';
var deployOptions = {
    "origin": 'origin',
    "branch": "master"
}
var tmpRepoPath = '';

/* Tasks */
gulp.task('clean', function () {
    del('dist', true);
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
    gulp.watch(htmlSource, ['build-html']);
});

gulp.task('copy-dev-assets', ['build-css', 'build-js', 'build-html'], function() {
    if (argv.includeDevAssets && argv.includeDevAssets !== true) {
        var assets = argv.includeDevAssets.split(',');
        var i, assetsArray = [];
        for (i = 0; i < assets.length; i++) {
            assetsArray.push(assets[i]);
        }
        gutil.log('Copying ' + argv.includeDevAssets);
        return gulp.src(assetsArray, { base: './'})
            .pipe(gulp.dest(destDir))
    } else {
        gutil.log('Nothing copied from dev assets.');
    }
});

gulp.task('build', ['copy-dev-assets']);

gulp.task('watch', ['watch-css', 'watch-js', 'watch-html']);

// Clone repo, checkout deployment branch to copy data & imgs files from there
gulp.task('prepare-deploy', ['clean'], function() {
    var TAG = '[gulp-' + deployOptions.branch + ']: ';
    return git.prepareRepo(null, deployOptions.origin, null)
        .then(function (repo) {
            tmpRepoPath = repo._repo.path;
            gutil.log(TAG + 'Repo cloned in ' + tmpRepoPath);
            if ( repo._localBranches.indexOf(deployOptions.branch) > -1 ) {
                gutil.log(TAG + 'Checkout branch `' + deployOptions.branch + '`');
                return repo.checkoutBranch(deployOptions.branch);
            }
            else if ( repo._remoteBranches.indexOf(deployOptions.origin + '/' + deployOptions.branch) > -1 ) {
                gutil.log(TAG + 'Checkout remote branch `' + deployOptions.branch + '`');
                return repo.checkoutBranch(deployOptions.branch);
            } else {
                gutil.log(TAG + 'Create branch `' + deployOptions.branch + '` and checkout');
                return repo.createAndCheckoutBranch(deployOptions.branch);
            }
        })
        .then(function(repo) {
            gutil.log(TAG + 'Updating repository');
            var deferred = when.defer();
            repo._repo.pull(deployOptions.origin, deployOptions.branch, function (err) {
                if ( err ) {
                    deferred.reject(err);
                } else {
                    this._currentBranch = deployOptions.branch;
                    deferred.resolve(repo.status());
                }
            });
            return deferred.promise;
        });
});

gulp.task('copy-master-assets', ['prepare-deploy'], function() {
    return gulp.src([ path.join(tmpRepoPath, 'data/**/*'), path.join(tmpRepoPath, 'imgs/**/*') ])
        pipe(gulp.dest(destDir));
});

gulp.task('deploy', function () {
    runSequence('copy-master-assets', 'build', function() {
        deployOptions.push = argv.push ? true : false;
        return gulp.src(['./dist/**/*'])
            .pipe(deploy(deployOptions));
    })
});