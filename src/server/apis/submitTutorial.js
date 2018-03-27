"use strict"
const config = require("../../../config/config")()
const domain = config.get("bin.domain")
const _ = require("lodash")
const github = require("../githubClient")
const errors = require("../errors")
const transformError = require("../transformers/errorTransformer")
const constants = require("../../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const repoOwner = constants.OWNER
const repoName = constants.REPO
const baseBranch = constants.BASE_BRANCH

module.exports = async function(req, res) {
  const log = req.log
  const tutorialName = _.get(req, "body.tutorialName", "")
  let submitDescription = _.get(req, "body.submitDescription", "")

  try {
    // get authenticated user
    const username = await getUsername()
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
    log.error({ err, details: err.details }, `there was error when trying to submit a tutorial: ${tutorialName}`)
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

function getUsername() {
  return github.users
    .get({})
    .then(result => {
      const login = result.data.login
      return login
    })
    .catch(err => {
      const source = "submitTutorial::getUsername::catch::err"
      const params = {}
      return Promise.reject(transformError(err, source, params))
    })
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
      const source = "submitTutorial::createPullRequest::catch::err"
      const params = { title, body, head }
      return Promise.reject(transformError(err, source, params))
    })
}
