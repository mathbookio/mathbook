"use strict"

const github = require("../github-client")
const errors = require("../errors")
const _ = require("lodash")
const createTutorial = require("./createTutorial")
const deleteTutorial = require("./deleteTutorial")
const submitTutorial = require("./submitTutorial")
const cacheTutorial = require("./cacheTutorial")
const saveTutorial = require("./saveTutorial")
const getTutorials = require("./getTutorials")
const getTutorial = require("./getTutorial")
const getTutorialByUsername = require("./getTutorialByUsername")
const getTutorialBySubject = require("./getTutorialBySubject")
const getSubmittedTutorials = require("./getSubmittedTutorials")
const getSubjectTopics = require("./getSubjectTopics")
const express = require("express")
const redisClient = require("../redis-client")
const apiRouter = express.Router()

// these requests don't need authentication.
apiRouter.get("/tutorial/local/:subject/:tutorialName", getTutorialBySubject)
apiRouter.get("/subject/:subject", getSubjectTopics)

// middleware that checks to see if the user is authenticated.
apiRouter.use(async (req, res, next) => {
  const hashToken = _.get(req, "cookies.hashToken")
  if (hashToken && _.isString(hashToken)) {
    const storedData = await redisClient.getAsync(hashToken).then(result => {
      if (result) {
        return JSON.parse(result)
      }
      return null
    })
    const authToken = _.get(storedData, "authToken", null)
    const expiresOn = _.get(storedData, "expiresOn", null)
    if (authToken) {
      github.authenticate({
        type: "oauth",
        token: authToken
      })
      _.set(req, "expiresOn", expiresOn)
      next()
    } else {
      const error = new errors.UnauthorizedError("you are unauthorized to access this resource")
      res.status(error.status).send(error)
      return
    }
  } else {
    const error = new errors.UnauthorizedError("you are unauthorized to access this resource")
    res.status(error.status).send(error)
    return
  }
})

apiRouter.post("/create", createTutorial)
apiRouter.put("/cache/tutorial", cacheTutorial)
apiRouter.put("/submit/tutorial", submitTutorial)
apiRouter.put("/save/tutorial", saveTutorial)
apiRouter.delete("/remove/tutorial", deleteTutorial)
apiRouter.get("/tutorials", getTutorials)
apiRouter.get("/tutorial/:user/:tutorialName", getTutorialByUsername)
apiRouter.get("/tutorial/:tutorialName", getTutorial)
apiRouter.get("/tutorials/submitted", getSubmittedTutorials)

apiRouter.use(function(req, res) {
  const badRequest = new errors.BadRequestError("the url requested does not exist")
  res.status(badRequest.status).send(badRequest)
})

module.exports = apiRouter
