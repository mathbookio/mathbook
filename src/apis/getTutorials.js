"use strict"
const _ = require("lodash")
const github = require("../github-client")
const Promise = require("bluebird")
const constants = require("../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const repoName = constants.REPO
const repoOwner = constants.OWNER
module.exports = async function(req, res) {
  try {
    // get authenticated user
    const username = await getUsername()
    console.log({ username })
    const allBranches = await getAllBranches(username)
    console.log("allBranches", allBranches)
    return Promise.map(allBranches, async branch => {
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
      return res.send({ tutorials: validTutorials })
    })
  } catch (err) {
    console.log("getTutorials::catch::err", err)
    let error
    if (err.code === 404) {
      error = { status: 404, code: "ResourceNotFound", message: "unable to locate tutorials for the requested user." }
    } else {
      error = {
        status: 500,
        code: "InternalServerError",
        message: "Uh-oh, something broke on the server-side of things. Unable to fetch tutorials."
      }
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
      err.source = "getTutorials::getUsername"
      return Promise.reject(err)
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
      err.source = "getTutorials::getAllBranches"
      return Promise.reject(err)
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
      err.source = "getTutorials::getBranchData"
      return Promise.reject(err)
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
      err.source = "getTutorials::getBranchPullRequest"
      return Promise.reject(err)
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
      err.source = "getTutorials::getBranchPullRequestReviews"
      return Promise.reject(err)
    })
}

function invalidTutorialBranch(branchName) {
  return !branchName.split("/").includes(branchPrefix)
}
