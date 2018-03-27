"use strict"
const _ = require("lodash")
const github = require("../githubClient")
const getUsername = require("./dataHelpers/getUsername")
const deleteCachedTutorial = require("./dataHelpers/deleteCachedTutorial")
const transformError = require("../transformers/errorTransformer")
const errors = require("../errors")
const constants = require("../../../config/constants.json")
const repoName = constants.REPO
const branchPrefix = constants.BRANCH_PREFIX

module.exports = async function(req, res) {
  const hashToken = _.get(req.cookies, "hashToken")
  const tutorialName = _.get(req, "body.tutorialName", "")
  const log = req.log
  // get authenticated user
  try {
    const username = await getUsername(hashToken)
    await deleteCachedTutorial(username, tutorialName)
    const ref = `heads/${branchPrefix}/${tutorialName}`
    await deleteBranch(username, ref)
    res.sendStatus(204)
  } catch (err) {
    const head = "deleteTutorial"
    log.error({ err, details: err.details, head }, "an error occured when trying to delete tutorial")
    let error
    if (err.code === 422) {
      error = new errors.ResourceNotFound("The tutorial that we attempted to delete could not be found")
    } else {
      error = new errors.InternalServerError(
        "Uh-oh something broke on the server side of things. Unable to delete tutorial."
      )
    }
    res.status(error.status).send(error)
  }
}

function deleteBranch(username, ref) {
  return github.gitdata
    .deleteReference({
      owner: username,
      repo: repoName,
      ref: ref
    })
    .catch(err => {
      const source = "deleteBranch::catch::err"
      const params = { username, ref }
      return Promise.reject(transformError(err, source, params))
    })
}
