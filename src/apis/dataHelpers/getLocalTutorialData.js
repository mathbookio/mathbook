'use strict'
const _ = require('lodash')
const fs = require('fs')
const github = require('../../github-client')
const Base64 = require('js-base64').Base64
const constants = require('../../../config/constants.json')
const branchPrefix = constants.BRANCH_PREFIX
const basePath = constants.TUTORIALS_PATH
const repoName = constants.REPO
module.exports = async function (subject, tutorialName) {

  if (!_.isString(subject) || _.isEmpty(subject)){
    return Promise.reject({ status: 400, code: 'BadRequest', message: 'subject is invalid' })
  }
  else if (!_.isString(tutorialName) || _.isEmpty(tutorialName)){
    return Promise.reject({ status: 400, code: 'BadRequest', message: 'tutorialName is invalid' })
  }
  // get authenticated user
  const configPath = `${basePath}/${subject}/${tutorialName}/config.json`
  const contentPath = `${basePath}/${subject}/${tutorialName}/content.json`
  const exercisesPath = `${basePath}/${subject}/${tutorialName}/exercises.json`
  try{
    
    const configData = fs.readFileSync(configPath, 'utf-8')
    const contentData = fs.readFileSync(contentPath, 'utf-8')
    const exerciseData = fs.readFileSync(exercisesPath, 'utf-8')
    return { 
      config: configData, 
      content: contentData, 
      exercises: exerciseData 
    }
                          
  }
  catch(err){
      console.log('dataHelper::error getting local tutorial Data', err)
      return Promise.reject({ status: 500, code: 'InternalServerError', message: 'Uh-oh something broke on our side of things.' })
  }
}

