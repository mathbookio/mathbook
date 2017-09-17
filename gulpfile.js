'use strict'

const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const browserSync = require('browser-sync').create()

const files = {
  allFiles: ['./src/**/*.js', './tests/*.spec.js', '!./src/public/javascripts/*.js'],
  testFiles: ['./tests/**/*.spec.js'],
  srcFiles: ['./src/**/*.js', './src/**/*.pug', './src/**/*.css'],
  srcTestFiles: ['./src/**/*.js'],
  tagFiles: ['./src/tags/**/*.tag']
}

gulp.task('test:config', () => {
  return gulp.src(files.srcTestFiles)
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
    .pipe(plugins.standard({ignore: [ 'src/public', 'src/public/tags' ]}))
    .pipe(plugins.standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
const BROWSER_SYNC_RELOAD_DELAY = 500

gulp.task('nodemon', function (cb) {
  let called = false
  return plugins.nodemon({

    // nodemon our expressjs server
    script: './bin/www'
  })
    .on('start', function onStart () {
      // ensure start only got called once
      if (!called) { cb() }
      called = true
    })
    .on('restart', function onRestart () {
      // reload connected browsers after a slight delay
      setTimeout(function reload () {
        browserSync.reload({
          stream: false
        })
      }, BROWSER_SYNC_RELOAD_DELAY)
    })
})

gulp.task('riot', function () {
  gulp.src(files.tagFiles)
      .pipe(plugins.riot())
      .pipe(plugins.concat('all.js'))
      .pipe(gulp.dest('./src/public/javascripts'))
      // .pipe(gulp.dest('./src/public/tags'))
})

gulp.task('serve', ['nodemon'], function () {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync.init({

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://192.168.2.21:3000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000
  })

  gulp.watch(files.tagFiles, ['riot'])
  gulp.watch(files.srcFiles).on('change', browserSync.reload)
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
