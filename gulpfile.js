const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const manifest = require('gulp-manifest');

const sassRoot = 'build/sass/';
const publicRoot = 'public/static/'

function compileSass(done) {
  src(sassRoot+'main.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(prefix("last 3 versions"))
  .pipe(dest(publicRoot+'css'));
 done();
}

function createManifest(done) {
  src('public/**')
  .pipe(manifest({
    hash: true,
    preferOnline: true,
    network: ['http://*', 'https://*', '*'],
    filename: 'app.manifest',
    exclude: ['app.manifest', 'static/css/main.css.map']
  }))
  .pipe(dest('public'));
  done();
}

function watchSass() {
  watch(sassRoot + '*.scss', compileSass);
}

exports.default = series(compileSass);
exports.watch = series(compileSass, watchSass);