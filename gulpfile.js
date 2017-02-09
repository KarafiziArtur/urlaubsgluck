let gulp = require("gulp"),
    connect = require("gulp-connect"),
    opn = require("opn"),
    fs = require("fs"),
    gutil = require("gulp-util"),
    plumber = require("gulp-plumber"),
    useref = require("gulp-useref"),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    uncss = require('gulp-uncss'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    sass = require("gulp-sass"),
    babel = require("gulp-babel"),
    browserify = require('gulp-browserify');

//***********************************//
// 1.Локальный сервер и автообновление //
//***********************************//

// Запуск локального сервера
gulp.task('connect', function () {
  connect.server({
    root: 'app',
    livereload: true,
    port: 8888
  });
  opn('http://localhost:8888');
});

// Слежение за HTML файлами
gulp.task('html', function () {
  gulp.src('./app/*.html')
      .pipe(connect.reload());
});

// Слежение за CSS файлами
gulp.task('css', function () {
  gulp.src('./app/_css/**/*.css')
      .pipe(connect.reload());
});

// Слежение за JS файлами
gulp.task('js', function () {
  gulp.src('./app/_js/**/*.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(browserify())
      .pipe(connect.reload());
});

// Компиляция SASS
gulp.task('sass', function () {
  return gulp.src('./app/sass/app.scss')
      .pipe(plumber())
      .pipe(sass({outputStyle: "compressed"}).on('error', sass.logError))
      .pipe(autoprefixer(
          'last 2 version',
          '> 1%',
          'ie 8',
          'ie 9',
          'ios 6',
          'android 4'
      ))
      .pipe(csso())
      .pipe(gulp.dest('./app/_css'));
});

// Запуск слежения
gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/_css/**/*.css'], ['css']);
  gulp.watch(['./app/_js/**/*.js'], ['js']);
  gulp.watch(['./app/sass/**/*.scss'], ['sass']);
});

//***********************************//
// /1.Локальный сервер и автообновление//
//***********************************//

// Конкатенация(склеивание),минификация всех подключаемых файлов в один/два
gulp.task('to-build', function () {
  let assets = useref.assets();
  return gulp.src('app/*.html')
      .pipe(assets)
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', csso()))
      .pipe(assets.restore())
      .pipe(useref())
      .pipe(gulp.dest('./app_build'));
});

// Минификация HTML
gulp.task('html-min', function () {
  return gulp.src('./app_build/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('./app_build'))
});

// Удаление неиспользуемых CSS стилей
gulp.task('uncss', function () {
  gulp.src(['./app_build/_css/vendor.css', './app_build/_css/app.css'])
      .pipe(uncss({
        html: ['app_build/index.html']
      }))
      .pipe(csso())
      .pipe(gulp.dest('./app_build/_css/uncss'));
});


// Зачада по умолчанию
gulp.task('default', ['connect', 'watch']);

// Подготовка релиза
gulp.task('release', ['to-build', 'uncss'], function () {
  let number = gutil.env.number;
  console.log('Number ', number);
  if (fs.existsSync('./releases/' + number)) {
    return console.error('Number ' + number + ' already exists');
  }
  console.log('Making release ' + number + '');
  gulp.src("./app_build/**/*.*")
      .pipe(gulp.dest("./releases/" + number + "/"));
});
