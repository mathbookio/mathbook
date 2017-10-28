'use strict'

const github = require('../github-client')
const _ = require('lodash')
const forkRepo = require('./fork-repo')
const deleteTutorial = require('./deleteTutorial')
const submitTutorial = require('./submitTutorial')
const getTutorials = require('./getTutorials')
const express = require('express')
const apiRouter = express.Router()

// middleware that is specific to this router
apiRouter.use((req, res, next) => {
  console.log('Time: ', Date.now(), 'using apiRouter')

  const authToken = _.get(req, 'cookies.accessToken')
  console.log('authToken', authToken)
  github.authenticate({
    type: 'oauth',
    token: authToken
  })
  next()
})

apiRouter.post('/fork', forkRepo)
apiRouter.put('/submit/tutorial', submitTutorial)
apiRouter.delete('/remove/tutorial', deleteTutorial)
apiRouter.get('/tutorials', getTutorials)

module.exports = apiRouter