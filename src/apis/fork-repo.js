"use strict"
const Promise = require("bluebird")
const _ = require("lodash")
const github = require("../github-client")
const Base64 = require("js-base64").Base64

const constants = require("../../config/constants.json")
const repoOwner = constants.OWNER
const repoName = constants.REPO
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const baseBranch = constants.BASE_BRANCH

module.exports = async function(req, res) {
  const branchName = _.get(req, "body.branchName")
  console.log({ branchName })

  try {
    const isNameAvailable = await isTutorialNameAvailable(branchName)
    if (!isNameAvailable) {
      const error = {
        status: 401,
        code: "NameUnavailable",
        message: "tutorial name chosen is already taken. please select a new branch name."
      }
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
    console.log({ username, referenceSHA, ref, branch })

    // let's check to see if the user already has a branch with the name requested
    const isBranchNameAvailable = await isBranchAvailable(username, repoName, ref)
    if (isBranchNameAvailable) {
      await createBranch(username, ref, referenceSHA)
    } else {
      // branch name is taken
      const error = {
        status: 401,
        code: "BranchUnavailable",
        message: "branch name chosen is already in use. Please select a new branch name."
      }
      res.status(error.status).send(error)
      return
    }

    await updateContributorFile(username, branch)
    await createConfigFile(username, branch, branchName)
    await createContentFile(username, branch, branchName)
    await createExercisesFile(username, branch, branchName)
    res.sendStatus(201)
  } catch (err) {
    res.status(500).send(err)
  }
}

async function isTutorialNameAvailable(tutorialName) {
  return github.repos
    .getContent({
      owner: repoOwner,
      repo: repoName,
      path: `${basePath}/${tutorialName}`
    })
    .then(availResult => false) // not available
    .catch(err => true) // available
}

async function isRepoForked(username) {
  return github.repos
    .get({
      owner: username,
      repo: repoName
    })
    .then(repository => true) // forked
    .catch(err => false) // not forked yet
}

async function forkRepo() {
  return github.repos.fork({
    owner: repoOwner,
    repo: repoName
  })
}

function getUsername() {
  return github.users.get({}).then(user => user.data.login)
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
}

function isBranchAvailable(owner, repo, branch) {
  return github.repos
    .getBranch({
      owner,
      repo,
      branch
    })
    .then(branchResult => false) // branch already exists
    .catch(err => true) // branch doesn't exist, hence return true (available)
}

function createBranch(username, ref, referenceSHA) {
  return github.gitdata.createReference({
    owner: username,
    repo: repoName,
    ref: ref,
    sha: referenceSHA
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
      console.log("decoded content", content)
      console.log(content + `- ${username}`)
      const contributorList = content.split("-")
      console.log("contributorList", contributorList)
      if (contributorList.includes(` ${username}\n`)) {
        console.log(`no need to update contributors list. The user ${username} is already on the list!`)
        return
      }
      const updatedContent = Base64.encode(content + `- ${username}`)
      console.log("encoded updated content", updatedContent)
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
}

function createConfigFile(username, branch, branchName) {
  return github.repos.createFile({
    owner: username,
    repo: repoName,
    path: `${basePath}/${branchName}/config.json`,
    message: `created config file for tutorial ${branchName}`,
    content: Base64.encode(JSON.stringify({})),
    branch: branch
  })
}

function createContentFile(username, branch, branchName) {
  return github.repos.createFile({
    owner: username,
    repo: repoName,
    path: `${basePath}/${branchName}/content.json`,
    message: `created content.json file for tutorial ${branchName}`,
    content: Base64.encode(JSON.stringify([])),
    branch: branch
  })
}

function createExercisesFile(username, branch, branchName) {
  return github.repos.createFile({
    owner: username,
    repo: repoName,
    path: `${basePath}/${branchName}/exercises.json`,
    message: `created exercises file for tutorial ${branchName}`,
    content: Base64.encode(JSON.stringify([])),
    branch: branch
  })
}
