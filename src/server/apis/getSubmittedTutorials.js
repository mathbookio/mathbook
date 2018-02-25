"use strict"
const _ = require("lodash")
const github = require("../github-client")
const Promise = require("bluebird")
const errors = require("../errors")
const transformError = require("../transformers/errorTransformer")
const constants = require("../../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const baseBranch = constants.BASE_BRANCH
const repoName = constants.REPO
const repoOwner = constants.OWNER
module.exports = async function(req, res) {
  const log = req.log
  try {
    const allPullRequests = await getAllPullRequests()
    await Promise.map(allPullRequests, async pullRequest => {
      const pullRequestRef = pullRequest.head.ref
      if (pullRequestRef.includes("tutorial/") === false) {
        return
      }
      const name = pullRequestRef.replace(`${branchPrefix}/`, "")
      const owner = pullRequest.head.user.login
      const ownerUrl = pullRequest.head.user.html_url
      const url = pullRequest.html_url
      const previewUrl = `/review/${owner}/${name}`
      const state = await getTutorialState(pullRequest)

      return {
        name,
        owner,
        ownerUrl,
        previewUrl,
        url,
        state
      }
    }).then(pullRequests => {
      const submittedTutorials = pullRequests.filter(pr => pr !== undefined)
      return res.send({ data: { submittedTutorials }, metadata: { expiresOn: req["expiresOn"] } })
    })
  } catch (err) {
    log.error({ err, details: err.details }, "failed to get submitted tutorials")
    let error
    if (err.code === 404) {
      error = new errors.ResourceNotFound("unable to locate tutorials for the requested user.")
    } else {
      error = new errors.InternalServerError(
        "Uh-oh, something broke on the server-side of things. Unable to fetch tutorials."
      )
    }
    res.status(error.status).send(error)
  }
}

function getAllPullRequests(username) {
  return github.pullRequests
    .getAll({
      owner: repoOwner,
      repo: repoName,
      state: "open",
      base: baseBranch,
      per_page: 100
    })
    .then(pullRequests => {
      return _.get(pullRequests, "data", [])
    })
    .catch(err => {
      if (err.code === 404) {
        return []
      }
      const source = "getSubmittedTutorials::getAllPullRequests::catch:err"
      const params = { username }
      return Promise.reject(transformError(err, source, params))
    })
}

async function getTutorialState(pullRequest) {
  const pullRequestNumber = pullRequest["number"]

  const pullRequestReviews = await getPullRequestReviews(pullRequestNumber)

  let state = pullRequest["state"]
  if (pullRequestReviews.length > 0) {
    const latestReview = _.last(pullRequestReviews)
    if (latestReview.state === "CHANGES_REQUESTED") {
      state = "changesRequested"
    } else if (latestReview.state === "APPROVED") {
      state = "approved"
    }
  }
  return state
}

function getPullRequestReviews(prNumber) {
  return github.pullRequests
    .getReviews({
      owner: repoOwner,
      repo: repoName,
      number: prNumber
    })
    .then(result => _.get(result, "data", []))
    .catch(err => {
      const source = "getSubmittedTutorials::getPullRequestReviews::catch:err"
      const params = { prNumber }
      return Promise.reject(transformError(err, source, params))
    })
}
