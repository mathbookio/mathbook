"use strict"

const express = require("express")
const path = require("path")
const bunyanRequest = require("bunyan-request")
// const favicon = require('serve-favicon')
const logger = require("./logger")
const requestLogger = bunyanRequest({
  logger: logger,
  headerName: "x-request-id"
})
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")

const router = require("./routes/index")
const app = express()

const apis = require("./apis")
// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(requestLogger)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/js", express.static(path.join(__dirname, "public/javascripts")))
app.use("/stylesheets", express.static(path.join(__dirname, "public/stylesheets")))
app.use("/images", express.static(path.join(__dirname, "public/images")))
app.use("/tags", express.static(path.join(__dirname, "public/tags")))
app.use("/qs", express.static(path.resolve(__dirname, "..", "node_modules/query-string/index.js")))
app.use("/moment", express.static(path.resolve(__dirname, "..", "node_modules/moment/")))
app.use("/sortable", express.static(path.resolve(__dirname, "..", "node_modules/sortablejs/")))
app.use("/bulma", express.static(path.resolve(__dirname, "..", "node_modules/bulma/css/")))
app.use("/mathjax", express.static(path.resolve(__dirname, "..", "node_modules/mathjax/")))
app.use("/jquery", express.static(path.resolve(__dirname, "..", "node_modules/jquery/")))
app.use("/highlight", express.static(path.resolve(__dirname, "..", "node_modules/highlight.js/")))
app.use("/riot", express.static(path.resolve(__dirname, "..", "node_modules/riot/")))
app.use("/katex", express.static(path.resolve(__dirname, "..", "node_modules/katex/dist")))

app.use("/v1", apis)
app.use("/tutorial", router.viewTutorialRouter)
app.use("/subject", router.subjectRouter)
app.use("/contribute", router.contributeRouter)
app.use("/editor", router.editorRouter)
app.use("/login", router.authRouter)
app.use("/dashboard", router.dashboardRouter)
app.use("/preview", router.previewRouter)
app.use("/review", router.reviewRouter)
app.use("/error", router.errorRouter)
app.use("/", router.router)
// catch 404 and forward to error handler
app.use(function(req, res) {
  const err = new Error("Not Found")
  err.status = 404
  res.render("404")
})

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app
