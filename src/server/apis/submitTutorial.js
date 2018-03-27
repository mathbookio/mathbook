"use strict"
const config = require("../../../config/config")()
const domain = config.get("bin.domain")
const _ = require("lodash")
const github = require("../githubClient")
const errors = require("../errors")
const transformError = require("../transformers/errorTransformer")
const constants = require("../../../config/constants.json")
const getCachedTutorial = require("./dataHelpers/getCachedTutorial")
const getUsername = require("./dataHelpers/getUsername")
const saveFile = require("./dataHelpers/saveFile")
const getCurrentTime = require("./dataHelpers/getCurrentTime")
const branchPrefix = constants.BRANCH_PREFIX
const repoOwner = constants.OWNER
const repoName = constants.REPO
const baseBranch = constants.BASE_BRANCH

module.exports = async function(req, res) {
  const log = req.log
  const hashToken = _.get(req.cookies, "hashToken")
  const tutorialName = _.get(req, "body.tutorialName", "")
  let submitDescription = _.get(req, "body.submitDescription", "")

  try {
    const username = await getUsername(hashToken)
    // save current state of tutorial
    await saveTutorial(username, tutorialName)

    // submit tutorial
    const reviewUrl = `http://${domain}/review/${username}/${tutorialName}`
    submitDescription += `\n\n Here is the link to preview the tutorial [${reviewUrl}](${reviewUrl})`
    const head = `${username}:${branchPrefix}/${tutorialName}`
    const submitTitle = `merge tutorial ${tutorialName} into ${baseBranch}`
    const submitTutorial = await createPullRequest(submitTitle, submitDescription, head)
    const pullRequestUrl = submitTutorial["html_url"]
    res.send({
      submitted: true,
      pullRequestUrl: pullRequestUrl,
      tutorial: tutorialName
    })
  } catch (err) {
    const head = "submitTutorial"
    log.error({ err, details: err.details, head }, `there was error when trying to submit a tutorial: ${tutorialName}`)
    let error
    if (err.code === 422) {
      error = new errors.ResourceNotFound("Unable to submit tutorial because the tutorial could not be found.")
    } else {
      error = new errors.InternalServerError(
        "Uh-oh something broke on the server side of things. Unable to submit tutorial."
      )
    }
    res.status(error.status).send(error)
  }
}

function createPullRequest(title, body, head) {
  return github.pullRequests
    .create({
      owner: repoOwner,
      repo: repoName,
      title: title,
      body: body,
      head: head,
      base: baseBranch
    })
    .then(prResult => prResult.data)
    .catch(err => {
      const source = "createPullRequest::catch::err"
      const params = { title, body, head }
      return Promise.reject(transformError(err, source, params))
    })
}

async function saveTutorial(username, tutorialName) {
  const currentDate = getCurrentTime()
  try {
    const tutorialData = await getCachedTutorial(username, tutorialName)
    const { config, content, exercises } = tutorialData
    await saveFile("config", username, tutorialName, config, currentDate)
    await saveFile("content", username, tutorialName, content, currentDate)
    await saveFile("exercises", username, tutorialName, exercises, currentDate)
  } catch (err) {
    const source = "saveTutorial::catch::err"
    const params = { username, tutorialName, currentDate }
    return Promise.reject(transformError(err, source, params))
  }
}
