"use strict"
const Promise = require("bluebird")
const _ = require("lodash")
const github = require("../github-client")
const Base64 = require("js-base64").Base64
const errors = require("../errors")
const transformError = require("../transformers/errorTransformer")
const constants = require("../../config/constants.json")
const repoOwner = constants.OWNER
const repoName = constants.REPO
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const baseBranch = constants.BASE_BRANCH

module.exports = async function(req, res) {
  const log = req.log
  const branchName = _.get(req, "body.branchName")

  try {
    const isNameAvailable = await isTutorialNameAvailable(branchName)
    if (!isNameAvailable) {
      const error = new errors.ResourceUnavailable(
        "Tutorial name chosen is already in use. Please create a new tutorial name."
      )
      res.status(error.status).send(error)
      return
    }

    const username = await getUsername()
    const isForked = await isRepoForked(username)
    if (!isForked) {
      await forkRepo()
    }

    // tutorial name is available and the user has the 'mathbook forked'
    const referenceSHA = await getLatestCommitSHA()
    const ref = `refs/heads/${branchPrefix}/${branchName}`
    const branch = `${branchPrefix}/${branchName}`

    // let's check to see if the user already has a branch with the name requested
    const isBranchNameAvailable = await isBranchAvailable(username, repoName, ref)
    if (isBranchNameAvailable) {
      await createBranch(username, ref, referenceSHA)
    } else {
      // branch name is taken
      const error = new errors.ResourceUnavailable(
        "branch name chosen is already in use. Please select a new branch name."
      )
      res.status(error.status).send(error)
      return
    }

    await updateContributorFile(username, branch)
    await createFile("config", username, branch, branchName)
    await createFile("content", username, branch, branchName)
    await createFile("exercises", username, branch, branchName)
    res.sendStatus(201)
  } catch (err) {
    log.error({ err, details: err.details }, "failed to create a tutorial")
    const error = new errors.InternalServerError(
      "Uh-oh, something broke on the server-side of things. Unable to create tutorial."
    )
    res.status(error.status).send(error)
  }
}

function isTutorialNameAvailable(tutorialName) {
  return github.repos
    .getContent({
      owner: repoOwner,
      repo: repoName,
      path: `${basePath}/${tutorialName}`
    })
    .then(availResult => false) // not available
    .catch(err => {
      if (err.code === 404) {
        return true // available
      }
      // failed for a reason not related to the tutorial name being available.
      const source = "createTutorial::isTutorialNameAvailable::catch::err"
      const params = { tutorialName }
      return Promise.reject(transformError(err, source, params))
    })
}

function isRepoForked(username) {
  return github.repos
    .get({
      owner: username,
      repo: repoName
    })
    .then(repository => true) // forked
    .catch(err => {
      if (err.code === 404) {
        return false // not forked yet
      }
      // it failed for something not related to being forked or not.
      const source = "isRepoForked"
      const params = { username }
      return Promise.reject(transformError(err, source, params))
    })
}

function forkRepo() {
  return github.repos
    .fork({
      owner: repoOwner,
      repo: repoName
    })
    .catch(err => {
      const source = "createTutorial::forkRepo::catch::err"
      const params = {}
      return Promise.reject(transformError(err, source, params))
    })
}

function getUsername() {
  return github.users
    .get({})
    .then(user => user.data.login)
    .catch(err => {
      const source = "createTutorial::getUsername::catch::err"
      const params = {}
      return Promise.reject(transformError(err, source, params))
    })
}

function getLatestCommitSHA() {
  return github.repos
    .getBranch({
      owner: repoOwner,
      repo: repoName,
      branch: baseBranch
    })
    .then(branchResult => {
      return _.get(branchResult, "data.commit.sha") // latest commit from base branch
    })
    .catch(err => {
      const source = "createTutorial::getLatestCommitSHA::catch::err"
      const params = {}
      return Promise.reject(transformError(err, source, params))
    })
}

function isBranchAvailable(owner, repo, branch) {
  return github.repos
    .getBranch({
      owner,
      repo,
      branch
    })
    .then(branchResult => false) // branch already exists
    .catch(err => {
      if (err.code === 404) {
        return true // branch doesn't exist, hence return true (available)
      }
      // failed for a reason not related to the branch not existing.
      const source = "createTutorial::isBranchAvailable::catch::err"
      const params = { owner, repo, branch }
      return Promise.reject(transformError(err, source, params))
    })
}

function createBranch(username, ref, referenceSHA) {
  return github.gitdata
    .createReference({
      owner: username,
      repo: repoName,
      ref: ref,
      sha: referenceSHA
    })
    .catch(err => {
      const source = "createTutorial::createBranch::catch::err"
      const params = { username, ref, referenceSHA }
      return Promise.reject(transformError(err, source, params))
    })
}

function updateContributorFile(username, branch) {
  return github.repos
    .getContent({
      owner: username,
      repo: repoName,
      path: "contributors.md",
      ref: branch
    })
    .then(contributorFile => {
      const sha = contributorFile.data.sha
      const content = Base64.decode(contributorFile.data.content)
      const contributorList = content.split("-")
      if (contributorList.includes(` ${username}\n`)) {
        return
      }
      const updatedContent = Base64.encode(content + `- ${username}`)
      return github.repos.updateFile({
        owner: username,
        repo: repoName,
        path: "contributors.md",
        message: `added ${username} to the contributors list`,
        sha: sha,
        content: updatedContent,
        branch: branch
      })
    })
    .catch(err => {
      const source = "createTutorial::updateContributorFile::catch::err"
      const params = { username, branch }
      return Promise.reject(transformError(err, source, params))
    })
}

function createFile(fileType, username, branch, branchName) {
  return github.repos
    .createFile({
      owner: username,
      repo: repoName,
      path: `${basePath}/${branchName}/${fileType}.json`,
      message: `created ${fileType} file for tutorial ${branchName}`,
      content: Base64.encode(JSON.stringify({})),
      branch: branch
    })
    .catch(err => {
      const source = "createTutorial::createFile::catch::err"
      const params = { fileType, username, branch, branchName }
      return Promise.reject(transformError(err, source, params))
    })
}
