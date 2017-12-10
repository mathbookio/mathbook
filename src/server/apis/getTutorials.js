"use strict"
const _ = require("lodash")
const github = require("../github-client")
const Promise = require("bluebird")
const errors = require("../errors")
const transformError = require("../transformers/errorTransformer")
const constants = require("../../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const repoName = constants.REPO
const repoOwner = constants.OWNER
module.exports = async function(req, res) {
  const log = req.log
  try {
    // get authenticated user
    const username = await getUsername()
    const allBranches = await getAllBranches(username)
    await Promise.map(allBranches, async branch => {
      const branchName = branch.name
      if (branchName === "master") {
        return
      } else if (invalidTutorialBranch(branchName)) {
        return
      }
      const name = branchName.replace(`${branchPrefix}/`, "")
      const branchData = await getBranchData(username, branchName)
      const tutorialState = await getTutorialState(`${username}:${branchName}`)
      const lastEdited = _.get(branchData, "data.commit.commit.committer.date")
      return {
        name,
        state: tutorialState.state,
        pullRequestUrl: tutorialState.pullRequestUrl,
        lastEdited
      }
    }).then(tutorials => {
      const validTutorials = tutorials.filter(tutorial => tutorial !== undefined)
      return res.send({ data: { tutorials: validTutorials }, metadata: { expiresOn: req["expiresOn"] } })
    })
  } catch (err) {
    log.error({ err, details: err.details }, "failed to get tutorials for a user")
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

async function getTutorialState(branch) {
  const pullRequestData = await getBranchPullRequest(branch)
  if (pullRequestData === undefined) {
    return { state: null, pullRequestUrl: null }
  }

  let isMerged = false
  if (pullRequestData["merged_at"] !== null) {
    isMerged = true
  }

  const pullRequestNumber = pullRequestData["number"]
  const pullRequestUrl = pullRequestData["html_url"]

  const pullRequestReviews = await getBranchPullRequestReviews(pullRequestNumber)

  let state = pullRequestData["state"]
  if (pullRequestReviews.length > 0) {
    const latestReview = _.last(pullRequestReviews)
    if (latestReview.state === "CHANGES_REQUESTED") {
      state = "changesRequested"
    } else if (latestReview.state === "APPROVED") {
      state = "approved"
    }
  }
  return {
    state: isMerged ? "merged" : state,
    pullRequestUrl: pullRequestUrl
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
      const source = "getTutorials::getUsername::catch:err"
      const params = {}
      return Promise.reject(transformError(err, source, params))
    })
}

function getAllBranches(username) {
  return github.repos
    .getBranches({
      owner: username,
      repo: repoName
    })
    .then(branches => {
      return _.get(branches, "data", [])
    })
    .catch(err => {
      if (err.code === 404) {
        return [] // the user does not have the repo forked so no branches exist.
      }
      const source = "getTutorials::getAllBranches::catch:err"
      const params = { username }
      return Promise.reject(transformError(err, source, params))
    })
}

function getBranchData(username, branchName) {
  return github.repos
    .getBranch({
      owner: username,
      repo: repoName,
      branch: branchName
    })
    .catch(err => {
      const source = "getTutorials::getBranchData::catch:err"
      const params = { username, branchName }
      return Promise.reject(transformError(err, source, params))
    })
}

function getBranchPullRequest(branch) {
  return github.pullRequests
    .getAll({
      owner: repoOwner,
      repo: repoName,
      head: branch,
      state: "all"
    })
    .then(result => _.get(result, "data", [])[0])
    .catch(err => {
      const source = "getTutorials::getBranchPullRequest::catch::err"
      const params = { branch }
      return Promise.reject(transformError(err, source, params))
    })
}

function getBranchPullRequestReviews(prNumber) {
  return github.pullRequests
    .getReviews({
      owner: repoOwner,
      repo: repoName,
      number: prNumber
    })
    .then(result => _.get(result, "data", []))
    .catch(err => {
      const source = "getTutorials::getBranchPullRequestReviews::catch:err"
      const params = { prNumber }
      return Promise.reject(transformError(err, source, params))
    })
}

function invalidTutorialBranch(branchName) {
  return !branchName.split("/").includes(branchPrefix)
}
