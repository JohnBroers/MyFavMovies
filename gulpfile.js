// Requirements
var gulp = require('gulp'),
	sass = require('gulp-ruby-sass');
	prefix = require('gulp-autoprefixer');
	manifest = require('gulp-manifest');

var sassRoot = 'build/sass/';
var publicRoot = 'public/static/'

gulp.task('sass-to-css', function(){
	return gulp.src(sassRoot+'main.scss')
	.pipe(sass())
	.pipe(prefix("last 3 versions"))
	.pipe(gulp.dest(publicRoot+'css'));
});

gulp.task('manifest', function(){
  gulp.src(['public/**'])
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['http://*', 'https://*', '*'],
      filename: 'app.manifest',
      exclude: ['app.manifest', 'static/css/main.css.map']
     }))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
	gulp.watch(sassRoot+'*.scss', ['sass-to-css']);
});

gulp.task('default', ['sass-to-css', 'watch', 'manifest']);