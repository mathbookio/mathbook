"use strict"
const _ = require("lodash")
const github = require("../github-client")
const constants = require("../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const repoOwner = constants.OWNER
const repoName = constants.REPO
const baseBranch = constants.BASE_BRANCH

module.exports = async function(req, res) {
  const tutorialName = _.get(req, "body.tutorialName", "")
  let submitDescription = _.get(req, "body.submitDescription", "")

  try {
    // get authenticated user
    const username = await getUsername()
    const reviewUrl = `http://localhost:4000/review/${username}/${tutorialName}`
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
    console.log(`there was error when trying to submit a tutorial: ${tutorialName}`, err)
    let error
    if (err.code === 422) {
      error = {
        status: 404,
        code: "ResourceNotFound",
        message: "Unable to submit tutorial because the tutorial could not be found."
      }
    } else {
      error = {
        status: 500,
        code: "InternalServerError",
        message: "Uh-oh something broke on the server side of things. Unable to submit tutorial."
      }
    }
    res.status(error.status).send(error)
  }
}

function getUsername() {
  return github.users.get({}).then(result => {
    const login = result.data.login
    console.log("login", login)
    return login
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
}
