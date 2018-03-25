"use strict"
const socketIo = require("socket.io")
const log = require("./logger")
const transformError = require("./transformers/errorTransformer")
const cacheTutorial = require("./apis/dataHelpers/cacheTutorial")

module.exports = function(server) {
  const io = socketIo(server)
  io.on("connection", function(client) {
    client.on("cacheTutorial", function(data) {
      cacheTutorial(data, log)
        .then(() => {
          client.emit("saved")
        })
        .catch(err => {
          const source = "websocket-client::cacheTutorial::catch:err"
          const params = { data }
          transformError(err, source, params)
          log.error({ err, details: err.details }, "failed to cache tutorial.")
          client.emit("saveFailed")
        })
    })
  })
  return io
}
