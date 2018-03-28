"use strict"
const { WEBSOCKET_TOPICS } = require("../../config/constants.json")
const socketIo = require("socket.io")
const log = require("./logger")
const cacheTutorial = require("./apis/dataHelpers/cacheTutorial")

module.exports = function(server) {
  const io = socketIo(server)
  io.on("connection", function(client) {
    client.on(WEBSOCKET_TOPICS.CacheTutorial, function(data) {
      return cacheTutorial(data)
        .then(() => {
          client.emit(WEBSOCKET_TOPICS.Saved)
        })
        .catch(err => {
          const head = "websocket-client"
          log.error({ err, details: err.details, head }, "failed to cache tutorial.")
          client.emit(WEBSOCKET_TOPICS.SaveFailed)
        })
    })
  })
  return io
}
