const express = require('express')
const router = express.Router()
const contributeRouter = require('./contribute')
const editorRouter = require('./editor')
const authRouter = require('./authenticate')
const previewRouter = require('./preview')
const reviewRouter = require('./review')
const dashboardRouter = require('./dashboard')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index')
})

module.exports = {
  router,
  contributeRouter,
  editorRouter,
  authRouter,
  dashboardRouter,
  previewRouter,
  reviewRouter
}