const { series } = require("gulp");

/**
 * Gulpfile version 4.
 *
 * @author Ran Bahadur kc  🙏🙏🙏✔✔✔✔✔
 * @version 4.0.3
 */

//this is for wordpress theme
var themename = "rntheme";

var gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  browserSync = require("browser-sync").create(),
  reload = browserSync.reload,
  sass = require("gulp-sass"),
  clearCSS = require("gulp-clean-css"),
  sourcemaps = require("gulp-sourcemaps"),
  concat = require("gulp-concat"),
  imagemin = require("gulp-imagemin"),
  changed = require("gulp-changed"),
  uglify = require("gulp-uglify"),
  lineec = require("gulp-line-ending-corrector");

var root = "./",
  scss = root + "scss/",
  js = root + "src/js/",
  cssDist = root + "assets/css/",
  jsDist = root + "assets/js/",
  css = root + "src/css/";

//Watach PHP File inwordpress .php now in html
var phpwatchFiles = root + "**/*.html",
  styleWatchFiles = root + "**/*.scss";

var jsSRC = [js + "main.js", js + "custom.js"];

var cssSRC = [css + "style.css", css + "custom.css"];

var imgSRC = root + "src/images/*",
  imgDEST = root + "assets/images";

function styles() {
  return gulp
    .src([scss + "style.scss"])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer("last 2 versions"))
    .pipe(sourcemaps.write())
    .pipe(lineec())
    .pipe(gulp.dest(cssDist));
}

function concatCSS() {
  return gulp
    .src(cssSRC)
    .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
    .pipe(concat("style.min.css"))
    .pipe(clearCSS())
    .pipe(sourcemaps.write("./maps/"))
    .pipe(lineec())
    .pipe(gulp.dest(cssDist));
}

function javascript() {
  return gulp
    .src(jsSRC)
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(lineec())
    .pipe(gulp.dest(jsDist));
}

function imgmin() {
  return gulp
    .src(imgSRC)
    .pipe(changed(imgDEST))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(gulp.dest(imgDEST));
}

function watch() {
  browserSync.init({
    open: "external",
    proxy: "http://localhost",
    port: 3000,
  });
  gulp.watch(styleWatchFiles, gulp.series([styles, concatCSS]));
  gulp.watch(jsSRC, javascript);
  gulp.watch(imgSRC, imgmin);
  gulp
    .watch([phpwatchFiles, jsDist + "rn.js", scss + "style.min.css"])
    .on("change", browserSync.reload);
}

exports.styles = styles;
exports.concatCSS = concatCSS;
exports.javascript = javascript;
exports.watch = watch;
exports.imgmin = imgmin;

var build = gulp.parallel(watch);
gulp.task("default", build);
