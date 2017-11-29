'use strict'

const _ = require('lodash')
const getLocalTutorialData = require('./dataHelpers/getLocalTutorialData')

module.exports = function (req, res) {
  const subject = _.get(req, 'params.subject', '')
  const tutorialName = _.get(req, 'params.tutorialName', '')
  console.log({ subject, tutorialName })
  return getLocalTutorialData(subject, tutorialName)
  .then((data) => res.send(data))
  .catch((err) => {
    console.error('getTutorialBySubject::getLocalTutorialData', err)
    res.status(500).send(err)
  })
  
}