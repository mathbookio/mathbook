"use strict"
const _ = require("lodash")
const contributeRouter = require("./contribute")
const viewEditor = require("./editor")
const authRouter = require("./authenticate")
const viewPreview = require("./preview")
const reviewTutorial = require("./review")
const viewDashboard = require("./dashboard")
const viewTutorial = require("./viewTutorial")
const getSubject = require("./subject")
const viewError = require("./errorRouter")
const subjectMap = require("../subjectMap.json")
const logout = require("./logout")

module.exports = {
  homePage: function(req, res, next) {
    _.set(req, "locals.data.subjectMap", JSON.stringify(subjectMap))
    _.set(req, "locals.view", "index")
    next()
  },
  contributeRouter,
  viewEditor,
  authRouter,
  viewPreview,
  reviewTutorial,
  viewDashboard,
  viewTutorial,
  getSubject,
  viewError,
  logout
}
