'use strict'

const _ = require('lodash')
const getLocalTutorialData = require('./dataHelpers/getLocalTutorialData')

module.exports = function (req, res) {
  const user = _.get(req, 'params.user', '')
  const tutorialName = _.get(req, 'params.tutorialName', '')
  return getLocalTutorialData(subject, tutorialName)
  .then((data) => res.send(data))
  .catch((err) => {
    console.error('reviewTutorial::getTutorialDataBySubject', err)
    res.status(err.status).send(err)
  })
  
}