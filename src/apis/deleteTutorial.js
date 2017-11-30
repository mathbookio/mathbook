"use strict"
const _ = require("lodash")
const github = require("../github-client")
const constants = require("../../config/constants.json")
const repoName = constants.REPO
const branchPrefix = constants.BRANCH_PREFIX

module.exports = async function(req, res) {
  const tutorialName = _.get(req, "body.tutorialName", "")
  // get authenticated user
  try {
    const username = await getUsername()
    const ref = `heads/${branchPrefix}/${tutorialName}`
    await deleteBranch(username, ref)
    res.sendStatus(204)
  } catch (err) {
    console.log("an error occured when trying to delete tutorial", err)
    let error
    if (err.code === 422) {
      error = {
        status: 404,
        code: "ResourceNotFound",
        message: "The tutorial that we attempted to delete could not be found"
      }
    } else {
      error = {
        status: 500,
        code: "InternalServerError",
        message: "Uh-oh something broke on the server side of things. Unable to delete tutorial."
      }
    }
    res.status(error.status).send(error)
  }
}

function getUsername() {
  return github.users.get({}).then(result => {
    const login = result.data.login
    return login
  })
}

function deleteBranch(username, ref) {
  return github.gitdata.deleteReference({
    owner: username,
    repo: repoName,
    ref: ref
  })
}
