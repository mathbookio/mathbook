const express = require('express')
const router = express.Router()
const eleAlgebraRouter = require('./ele-algebra')
const contributeRouter = require('./contribute')
const editorRouter = require('./editor')
const authRouter = require('./authenticate')
const previewRouter = require('./preview')
const dashboardRouter = require('./dashboard')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index')
})

module.exports = { router, eleAlgebraRouter, contributeRouter, editorRouter, authRouter, dashboardRouter, previewRouter }
