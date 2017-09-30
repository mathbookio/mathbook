const express = require('express')
const router = express.Router()
const eleAlgebraRouter = require('./ele-algebra')
const contributeRouter = require('./contribute')
const editorRouter = require('./editor')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = { router, eleAlgebraRouter, contributeRouter, editorRouter }
