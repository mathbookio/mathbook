"use strict"

const gulp = require("gulp")
const plugins = require("gulp-load-plugins")()
const browserSync = require("browser-sync").create()
const config = require("./config/config")()

const files = {
  allFiles: ["src/server/**/*.js", "tests/*.spec.js", "!src/front-end/public/javascripts/*.js"],
  testFiles: ["./tests/**/*.spec.js"],
  watchFiles: ["./src/server/**/*.js", "./src/front-end/**/*.css", "./src/front-end/views/*.pug"],
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

gulp.task("test", () => {
  gulp
    .src(files.testFiles)
    .pipe(plugins.ava())
    .once("error", () => {
      process.exit(1)
    })
    .once("end", () => {
      process.exit()
    })
})

gulp.task("nodemon", function(done) {
  let called = false
  return plugins
    .nodemon({
      // nodemon our expressjs server
      script: "./bin/www",
      ignore: ["src/front-end/public", "src/front-end/tags"]
    })
    .on("start", function onStart() {
      // ensure start only got called once
      if (!called) {
        const host = config.get("bin.host")
        const port = config.get("bin.port")
        setTimeout(() => {
          browserSync.init({
            proxy: `${host}:${port}`,
            port: port + 1
          })
        }, 2000)
        done()
      }
      called = true
      // for more browser-sync config options: http://www.browsersync.io/docs/options/
    })
})

gulp.task("riot", function() {
  return gulp
    .src(files.tagFiles)
    .pipe(plugins.riot())
    .pipe(plugins.concat("all.js"))
    .pipe(gulp.dest("./src/front-end/public/javascripts"))
})

gulp.task("serve", ["nodemon"], function() {
  gulp.watch(files.tagFiles, ["riot:reload"])
  gulp.watch(files.watchFiles).on("change", browserSync.reload)
})

gulp.task("riot:reload", ["riot"], done => {
  browserSync.reload()
  done()
})
