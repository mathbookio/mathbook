'use strict'

const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()

const files = {
  allFiles: ['./src/**/*.js', './tests/*.spec.js'],
  testFiles: ['./tests/*.spec.js'],
  srcFiles: ['./src/**/*.js']
}

gulp.task('test:config', () => {
  return gulp.src(files.srcFiles)
    // Covering files
    .pipe(plugins.istanbul())
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire())
})

gulp.task('test', ['test:config'], () => {
  gulp.src(files.testFiles)
  .pipe(plugins.mocha())
  .once('error', () => {
    process.exit(1)
  })
  .once('end', () => {
    process.exit()
  })
})

gulp.task('lint', function () {
  return gulp.src(files.allFiles)
    .pipe(plugins.standard())
    .pipe(plugins.standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

gulp.task('default', () =>
  gulp.src(files.testFiles)
  .pipe(plugins.mocha())
  .once('error', () => {
    process.exit(1)
  })
  .once('end', () => {
    process.exit()
  })
)
