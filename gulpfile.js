const gulp = require('gulp');
const less = require('gulp-less');

const LESS_DEST = "./css";
const LESS_SRC = "./styles/chroniquesdeletrange.less";
const LESS_WATCH = ["./styles/**/*.less"];

/* ----------------------------------------- */
/*  Compile LESS
/* ----------------------------------------- */
function compileLESS() {
  return gulp.src(LESS_SRC)
    .pipe(less())
    .pipe(gulp.dest(LESS_DEST))
}
const css = gulp.series(compileLESS);

/* ----------------------------------------- */
/*  Watch Updates
/* ----------------------------------------- */

function watchUpdates() {
  gulp.watch(LESS_WATCH, css);
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

exports.default = gulp.series(
  gulp.parallel(css),
  watchUpdates
);
exports.css = css;
