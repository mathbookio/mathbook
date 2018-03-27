"use strict"
const { WEBSOCKET_TOPICS } = require("../../config/constants.json")
const socketIo = require("socket.io")
const log = require("./logger")
const transformError = require("./transformers/errorTransformer")
const cacheTutorial = require("./apis/dataHelpers/cacheTutorial")

module.exports = function(server) {
  const io = socketIo(server)
  io.on("connection", function(client) {
    client.on(WEBSOCKET_TOPICS.CacheTutorial, function(data) {
      cacheTutorial(data, log)
        .then(() => {
          client.emit(WEBSOCKET_TOPICS.Saved)
        })
        .catch(err => {
          const source = "websocket-client::cacheTutorial::catch:err"
          const params = { data }
          transformError(err, source, params)
          log.error({ err, details: err.details }, "failed to cache tutorial.")
          client.emit(WEBSOCKET_TOPICS.SaveFailed)
        })
    })
  })
  return io
}
