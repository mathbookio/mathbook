"use strict"

const express = require("express")
const path = require("path")
const bunyanRequest = require("bunyan-request")
const authenticationMiddleware = require("./middleware/authentication")
// const favicon = require('serve-favicon')
const logger = require("./logger")
const requestLogger = bunyanRequest({
  logger: logger,
  headerName: "x-request-id"
})
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")

const viewRouter = require("./routes/index")
const app = express()

const apis = require("./apis")
// view engine setup
app.set("views", path.join(__dirname, "..", "front-end", "views"))
app.set("view engine", "pug")

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(requestLogger)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(authenticationMiddleware())

app.use("/js", express.static(path.join(__dirname, "..", "front-end/public/javascripts")))
app.use("/stylesheets", express.static(path.join(__dirname, "..", "front-end/public/stylesheets")))
app.use("/images", express.static(path.join(__dirname, "..", "front-end/public/images")))
app.use("/moment", express.static(path.resolve(__dirname, "..", "..", "node_modules/moment/")))
app.use("/sortable", express.static(path.resolve(__dirname, "..", "..", "node_modules/sortablejs/")))
app.use("/bulma", express.static(path.resolve(__dirname, "..", "..", "node_modules/bulma/css/")))
app.use("/jquery", express.static(path.resolve(__dirname, "..", "..", "node_modules/jquery/")))
app.use("/riot", express.static(path.resolve(__dirname, "..", "..", "node_modules/riot/")))
app.use("/katex", express.static(path.resolve(__dirname, "..", "..", "node_modules/katex/dist")))
app.use("/chartjs", express.static(path.resolve(__dirname, "..", "..", "node_modules/chart.js/dist")))

app.use("/v1", apis)
app.get("/tutorial/:subject/:tutorialName", viewRouter.viewTutorial)
app.get("/subject/:subject", viewRouter.getSubject)
app.get("/editor/:tutorialName", viewRouter.viewEditor)
app.get("/dashboard", viewRouter.viewDashboard)
app.get("/preview/:tutorialName", viewRouter.viewPreview)
app.get("/review/:user/:tutorialName", viewRouter.reviewTutorial)
app.get("/error/500", viewRouter.viewError)
app.use("/contribute", viewRouter.contributeRouter)
app.use("/login", viewRouter.authRouter)
app.use("/logout", viewRouter.logout)

/* GET home page. */
app.get("/", viewRouter.homePage)

app.use(function(req, res, next) {
  const view = req.locals.view
  const data = req.locals.data
  if (view) {
    res.render(view, data)
    return
  }
  next()
})

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
