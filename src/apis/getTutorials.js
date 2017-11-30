"use strict"
const _ = require("lodash")
const github = require("../github-client")
const Promise = require("bluebird")
const constants = require("../../config/constants.json")
const branchPrefix = constants.BRANCH_PREFIX
const repoName = constants.REPO
const repoOwner = constants.OWNER
module.exports = async function(req, res) {
  // get authenticated user
  const username = await getUsername()
  const allBranches = await getAllBranches(username)
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
  return github.users.get({}).then(result => {
    const login = result.data.login
    return login
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
}

function getBranchData(username, branchName) {
  return github.repos.getBranch({
    owner: username,
    repo: repoName,
    branch: branchName
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
}

function getBranchPullRequestReviews(prNumber) {
  return github.pullRequests
    .getReviews({
      owner: repoOwner,
      repo: repoName,
      number: prNumber
    })
    .then(result => _.get(result, "data", []))
}

function invalidTutorialBranch(branchName) {
  return !branchName.split("/").includes(branchPrefix)
}
