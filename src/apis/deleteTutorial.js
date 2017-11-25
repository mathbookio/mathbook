'use strict'
const github = require('../github-client')

module.exports = function (req, res) {
  const tutorialName = req.body.tutorialName
  // get authenticated user
  return github.users.get({})
  .then((result) => {
    const login = result.data.login
    console.log('login', login)
    return login
  })
  .then((username) => {
    const repo = 'testing'
    return github.gitdata.deleteReference({
      owner: username,
      repo: repo,
      ref: `heads/tutorial/${tutorialName}`
    })
  })                                  
  .then((deleteResult) => {
    console.log({ deleteResult })
    res.send({ deleted: true, tutorial: tutorialName })
  })
  .catch((err) => {
    console.log('error deleting branches/tutorials', err)
    res.send(err)
  })
}
