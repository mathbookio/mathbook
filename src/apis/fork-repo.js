'use strict'
const Promise = require('bluebird')
const _ = require('lodash')
const github = require('../github-client')
const Base64 = require('js-base64').Base64

const constants = require('../../config/constants.json')
const repoOwner = constants.OWNER
const repoName = constants.REPO
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const baseBranch = constants.BASE_BRANCH

module.exports = async function (req, res) {
  const branchName = _.get(req, 'body.branchName')
  console.log({ branchName })
  // const referenceSHA = 'f085ad6a48d783f524eeca63b4d67466bdc83527'
  const referenceSHA = await github.repos.getBranch({
    owner: repoOwner,
    repo: repoName,
    branch: baseBranch
  })
  .then((branchResult) => {
    console.dir({ branchResult }, { depth: 10 })
    return _.get(branchResult, 'data.commit.sha') // latest commit from base branch
  })

  return isTutorialNameAvailable(branchName)
  .then((isAvailable) => getUsername())
  .then((username) => {
    return isRepoForked(username)
    .then((isForked) => {
      if (isForked) {
        return username
      }
      return github.repos.fork({
        owner: repoOwner,
        repo: repoName
      })
      .then((forkResult) => username)
    })
  })
  .then((username) => {
    console.log('user', username)
    console.log('referenceSha', referenceSHA)
    const ref = `refs/heads/${branchPrefix}/${branchName}`
    const branch = `${branchPrefix}/${branchName}`
    return isBranchAvailable(username, repoName, ref)
    .then((isBranch) => {
      return github.gitdata.createReference({
        owner: username,
        repo: repoName,
        ref: ref,
        sha: referenceSHA
      })
      .then((branchResult) => {
        console.log('created a new branch')
        return github.repos.getContent({
          owner: username,
          repo: repoName,
          path: 'contributors.md',
          ref: branch
        })
        .then((contributorFile) => {
          console.dir({ title: 'got the contributor file', contributorFile }, {depth: 10})
          const sha = contributorFile.data.sha
          const content = Base64.decode(contributorFile.data.content)
          console.log('decoded content', content)
          console.log(content + `- ${username}`)
          const contributorList = content.split('-')
          console.log('contributorList', contributorList)
          if (contributorList.includes(` ${username}\n`)){
            console.log(`no need to update contributors list. The user ${username} is already on the list!`)
            return
          }
          const updatedContent = Base64.encode(content + `- ${username}`)
          console.log('encoded updated content', updatedContent)
          return github.repos.updateFile({
            owner: username,
            repo: repoName,
            path: 'contributors.md',
            message: `added ${username} to the contributors list`,
            sha: sha,
            content: updatedContent,
            branch: branch
          })
          .then((updateFileResult) => {
            console.dir({ updateFileResult }, { depth: 10 })
            const createConfigFile = github.repos.createFile({
              owner: username,
              repo: repoName,
              path: `${basePath}/${branchName}/config.json`,
              message: `created config file for tutorial ${branchName}`,
              content: Base64.encode(JSON.stringify({})),
              branch: branch
            })

            return createConfigFile
            .then((createConfigFileResult) => {
              console.log({ createConfigFileResult }, { depth: 10 })
              return github.repos.createFile({
                owner: username,
                repo: repoName,
                path: `${basePath}/${branchName}/content.json`,
                message: `created content.json file for tutorial ${branchName}`,
                content: Base64.encode('[]'),
                branch: branch
              })
              .then((createContentFileResult) => {
                console.dir({ createContentFileResult }, { depth: 10 })
                return github.repos.createFile({
                  owner: username,
                  repo: repoName,
                  path: `${basePath}/${branchName}/exercises.json`,
                  message: `created exercises file for tutorial ${branchName}`,
                  content: Base64.encode('[]'),
                  branch: branch
                })
                .then((createExercisesFile) => {
                  console.dir({ createExercisesFile }, { depth: 10 })
                  return updateFileResult
                })
              })
            })
          })
          .then((updateFileResult) => {
            console.log(updateFileResult)
            res.sendStatus(201)
          })
        })
      })
    })
  })
  .catch((err) => {
    console.log('error /v1/fork', err)

    res.status(401).send(err)
  })
}

function getUsername () {
  return github.users.get({})
  .then((user) => user.data.login)
}

function isRepoForked (username) {
  return github.repos.get({
    owner: username,
    repo: repoName
  })
  .then((repository) => {
    // console.log('repository', repository)
    return true
  })
  .catch((err) => {
    // console.log('isRepoForked err', err)
    return false
  })
}

function isBranchAvailable (owner, repo, branch) {
  return github.repos.getBranch({
    owner,
    repo,
    branch
  })
  .then((branchResult) => {
    // console.log({ branchResult })
    return Promise.reject({status: 401, code: 'BranchUnavailable', message: 'branch name chosen is already in use. Please select a new branch name.' })
  })
  .catch((err) => {
    console.log(err)
    return true
  })
}

function isTutorialNameAvailable(tutorialName){
  return github.repos.getContent({
    owner: repoOwner,
    repo: repoName,
    path: `${basePath}/${tutorialName}`
  })
  .then((availResult) => {
    // console.dir({ availResult }, { depth: 10 })
    return Promise.reject({status: 401, code: 'NameUnavailable', message: 'tutorial name chosen is already taken. please select a new branch name.'})
  })
  .catch((err) => {
    console.log(err)
    return true
  })
}