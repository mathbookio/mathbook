"use strict"

const gulp = require("gulp")
const plugins = require("gulp-load-plugins")()
const browserSync = require("browser-sync").create()

const files = {
  allFiles: ["src/server/**/*.js", "tests/*.spec.js", "!src/front-end/public/javascripts/*.js"],
  testFiles: ["./tests/**/*.spec.js"],
  srcFiles: ["./src/server/**/*.js", "./src/server/**/*.pug", "./src/server/**/*.css"],
  srcTestFiles: ["./src/server/**/*.js"],
  tagFiles: ["./src/front-end/tags/**/*.tag"]
}

gulp.task("lint", () => {
  return (
    gulp
      .src(files.allFiles)
      .pipe(plugins.eslint())
      .pipe(plugins.eslint.format())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      .pipe(plugins.eslint.failAfterError())
  )
})

gulp.task("test:config", () => {
  return (
    gulp
      .src(files.srcTestFiles)
      // Covering files
      .pipe(plugins.istanbul())
      // Force `require` to return covered files
      .pipe(plugins.istanbul.hookRequire())
  )
})

gulp.task("test", ["test:config"], () => {
  gulp
    .src(files.testFiles)
    .pipe(plugins.mocha())
    .once("error", () => {
      process.exit(1)
    })
    .once("end", () => {
      process.exit()
    })
})

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
const BROWSER_SYNC_RELOAD_DELAY = 500

gulp.task("nodemon", function(cb) {
  let called = false
  return plugins
    .nodemon({
      // nodemon our expressjs server
      script: "./bin/www"
    })
    .on("start", function onStart() {
      // ensure start only got called once
      if (!called) {
        cb()
      }
      called = true
    })
    .on("restart", function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        })
      }, BROWSER_SYNC_RELOAD_DELAY)
    })
})

gulp.task("riot", function() {
  gulp
    .src(files.tagFiles)
    .pipe(plugins.riot())
    .pipe(plugins.concat("all.js"))
    .pipe(gulp.dest("./src/front-end/public/javascripts"))
  // .pipe(gulp.dest('./src/public/tags'))
})

gulp.task("serve", ["nodemon"], function() {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync.init({
    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: "http://192.168.2.22:3000",

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000
  })

  gulp.watch(files.tagFiles, ["riot"])
  gulp.watch(files.srcFiles).on("change", browserSync.reload)
})

gulp.task("default", () =>
  gulp
    .src(files.testFiles)
    .pipe(plugins.mocha())
    .once("error", () => {
      process.exit(1)
    })
    .once("end", () => {
      process.exit()
    })
)
