const gulp = require('gulp');
const fs = require('fs');
const fsExtra = require('fs-extra')
const less = require("gulp-less");
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const gulpIf = require('gulp-if');
const minifyCSS = require('gulp-clean-css');
const path = require('path');
const handlebars = require('handlebars');

const argv = yargs(hideBin(process.argv)).argv;

/* Configuration */
const sources = {
  css: ['css/main.less']
, js: ['js/**/*']
, handlebarTemplates: ['templates/communityEvents.html']
, imgs: ['imgs/**/*']
, pages: ['data/*.json', 'templates/*.html']
};
const destDir = 'public/';

/* Tasks */
exports.clean = async () =>
  fsExtra.removeSync(destDir);

exports.buildCss = () =>
  gulp.src(sources.css)
    .pipe(less({ paths: ['node_modules/bootstrap/less/'] }))
    .pipe(gulpIf(argv.push, minifyCSS()))
    .pipe(gulp.dest(destDir + 'css/'));

exports.watchCss = () =>
  gulp.watch(sources.css, exports.buildCss);

exports.buildImgs = () =>
  gulp.src(sources.imgs)
    .pipe(gulp.dest(destDir + 'imgs/'));

exports.watchImgs = () =>
  gulp.watch(sources.imgs, exports.buildImgs);

exports.buildJs = () =>
  gulp.src(sources.js)
    .pipe(gulp.dest(destDir + 'js/'));

exports.watchJs = () =>
  gulp.watch(sources.js, exports.buildJs);

exports.buildHandlebarTemplates = () =>
  gulp.src('templates/communityEvents.html')
    .pipe(gulp.dest(destDir + 'js/'));

exports.watchHandlebarTemplates = () =>
  gulp.watch(sources.handlebarTemplates, exports.buildHandlebarTemplates);

exports.buildPages = async () => {
  const withTemplate = (src) => handlebars.compile(fsExtra.readFileSync('templates/' + src, 'utf8'));
  const baseOf = withTemplate("baseof.html");
  const withBody = (target, body) => {
    const dest = destDir + target;
    fsExtra.ensureDirSync(path.dirname(dest));
    fsExtra.writeFileSync(dest, baseOf({content: body}));
  };
  const page = (src, target, args) => withBody(target, withTemplate(src)(args));
  const defaultImage = (x) => {
    if (!x.image) {
        x.image = x.key + ".png";
    }
    return x;
  };
  const addDetailKey = (x) => {
    x.detailKey = x.key.replaceAll(' ', '-');
    return x;
  };
  const communities =
    fs.readdirSync('data/')
    .filter(f => f.endsWith('.json') && f != 'conferences.json')
    .map(f => {
      const content = fs.readFileSync('data/' + f)
      const json = JSON.parse(content)
      json.key = f.substring(0, f.length - '.json'.length)
      return json
    })
    .map(defaultImage)
    .map(addDetailKey)
    ;

  page('index.html', 'index.html', {});
  page('about.html', 'about/index.html', {});
  page('calendar.html', 'calendar/index.html', {});
  page('conferences.html', 'conferences/index.html', {
    conferences:
      fsExtra
        .readJsonSync('data/conferences.json')
        .map(defaultImage)
  });
  page('communities.html', 'communities/index.html', {
    communities:
      communities
        .toSorted((x, y) => x.name.localeCompare(y.name))
  });
  communities.forEach((community) => {
    const data = { ...community };
    data.patternsGoogleCalendar = JSON.stringify(data.patternsGoogleCalendar || [community.key]);
    page('community.html', 'community/' + community.detailKey + '/index.html', data);
  });
  await Promise.resolve('ignored');
};

exports.watchPages = () =>
  gulp.watch(sources.pages, exports.buildPages);

exports.build =
  gulp.parallel(exports.buildCss, exports.buildImgs, exports.buildJs, exports.buildHandlebarTemplates, exports.buildPages);

exports.watch =
  gulp.parallel(exports.watchCss, exports.watchImgs, exports.watchJs, exports.watchHandlebarTemplates, exports.watchPages);

exports.dev =
  gulp.series(exports.build, exports.watch);
