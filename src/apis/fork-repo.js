'use strict'
const Promise = require('bluebird')
const _ = require('lodash')
const github = require('../github-client')
const Base64 = require('js-base64').Base64

module.exports = function (req, res) {
  const branchName = _.get(req, 'body.branchName')
  console.log({ branchName })
  const repo = 'testing'
  const referenceSHA = 'f085ad6a48d783f524eeca63b4d67466bdc83527'
  return isTutorialNameAvailable(branchName)
  .then((isAvailable) => {
   if (isAvailable){
     return getUsername()
   } 
   return Promise.reject('branch name is taken. please select a new branch name')
  })
  .then((username) => {
    return isRepoForked(username)
    .then((isForked) => {
      if (isForked) {
        return username
      }
      return github.repos.fork({
        owner: 'JetJet13',
        repo: repo
      })
      .then((forkResult) => username)
    })
  })
  .then((username) => {
    console.log('user', username)
    const ref = `refs/heads/tutorial/${branchName}`
    const branch = `tutorial/${branchName}`
    return isBranchExist(username, repo, ref)
    .then((isBranch) => {
      if (isBranch) {
        console.log('isBranch is true', isBranch)
        res.send({ username, isBranch })
        return
      }
      return github.gitdata.createReference({
        owner: username,
        repo: repo,
        ref: ref,
        sha: referenceSHA
      })
      .then((branchResult) => {
        console.log('created a new branch')
        return github.repos.getContent({
          owner: username,
          repo: repo,
          path: 'contributors.md',
          ref: branch
        })
        .then((contributorFile) => {
          console.dir({ title: 'got the contributor file', contributorFile }, {depth: 10})
          const sha = contributorFile.data.sha
          const content = Base64.decode(contributorFile.data.content)
          console.log('decoded content', content)
          console.log(content + `- ${username}`)
          const updatedContent = Base64.encode(content + `- ${username}`)
          console.log('encoded updated content', updatedContent)
          return github.repos.updateFile({
            owner: username,
            repo: repo,
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
              repo: repo,
              path: `${branch}/config.json`,
              message: `created config file for tutorial ${branchName}`,
              content: Base64.encode('{ "title": "NA"}'),
              branch: branch
            })

            return createConfigFile
            .then((createConfigFileResult) => {
              console.log({ createConfigFileResult }, { depth: 10 })
              return github.repos.createFile({
                owner: username,
                repo: repo,
                path: `${branch}/content.json`,
                message: `created content.json file for tutorial ${branchName}`,
                content: Base64.encode('[]'),
                branch: branch
              })
              .then((createContentFileResult) => {
                console.dir({ createContentFileResult }, { depth: 10 })
                return github.repos.createFile({
                  owner: username,
                  repo: repo,
                  path: `${branch}/exercises.json`,
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
            console.log('Money', updateFileResult)
            res.send({ username, isBranch })
          })
        })
      })
    })
  })
  .catch((err) => {
    console.log('error /v1/fork', err)
    res.status(401).send({ code: 'UnavailableBranchName', message: 'the branch name is taken' })
  })
}

function getUsername () {
  return github.users.get({})
  .then((user) => user.data.login)
}

function isRepoForked (username) {
  const repo = 'testing'
  return github.repos.get({
    owner: username,
    repo: repo
  })
  .then((repository) => {
    console.log('repository', repository)
    return true
  })
  .catch((err) => {
    console.log('isRepoForked err', err)
    return false
  })
}

function isBranchExist (owner, repo, branch) {
  return github.repos.getBranch({
    owner,
    repo,
    branch
  })
  .then((branchResult) => {
    console.log({ branchResult })
    return true
  })
  .catch((err) => {
    console.log({ title: 'isBranchExist failed for the following reason', err })
    return false
  })
}

function isTutorialNameAvailable(tutorialName){
  return github.repos.getContent({
    owner: 'JetJet13',
    repo: 'testing',
    path: `tutorial/${tutorialName}`
  })
  .then((availResult) => {
    console.dir({ availResult }, { depth: 10 })
    return false
  })
  .catch((err) => {
    console.error(err)
    return true
  })
}