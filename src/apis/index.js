"use strict"

const github = require("../github-client")
const _ = require("lodash")
const createTutorial = require("./createTutorial")
const deleteTutorial = require("./deleteTutorial")
const submitTutorial = require("./submitTutorial")
const saveTutorial = require("./saveTutorial")
const getTutorials = require("./getTutorials")
const getTutorial = require("./getTutorial")
const getTutorialByUsername = require("./getTutorialByUsername")
const getTutorialBySubject = require("./getTutorialBySubject")
const getSubjectTopics = require("./getSubjectTopics")
const express = require("express")
const apiRouter = express.Router()

// middleware that is specific to this router
apiRouter.use((req, res, next) => {
  const authToken = _.get(req, "cookies.accessToken")
  github.authenticate({
    type: "oauth",
    token: authToken
  })
  next()
})

apiRouter.post("/create", createTutorial)
apiRouter.put("/submit/tutorial", submitTutorial)
apiRouter.put("/save/tutorial", saveTutorial)
apiRouter.delete("/remove/tutorial", deleteTutorial)
apiRouter.get("/tutorials", getTutorials)
apiRouter.get("/tutorial/:user/:tutorialName", getTutorialByUsername)
apiRouter.get("/tutorial/local/:subject/:tutorialName", getTutorialBySubject)
apiRouter.get("/tutorial/:tutorialName", getTutorial)
apiRouter.get("/subject/:subject", getSubjectTopics)

apiRouter.use(function(req, res) {
  res.status(400).send({ code: "BadRequest", message: "the url requested does not exist" })
})

module.exports = apiRouter
