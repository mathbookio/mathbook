"use strict"
const { SOCKET_IO_TOPICS } = require("../../config/constants.json")
const socketIo = require("socket.io")
const log = require("./logger")
const cacheTutorial = require("./apis/dataHelpers/cacheTutorial")

module.exports = function(server) {
  const io = socketIo(server)
  io.on("connection", function(client) {
    client.on(SOCKET_IO_TOPICS.CacheTutorial, function(data) {
      return cacheTutorial(data)
        .then(() => {
          client.emit(SOCKET_IO_TOPICS.Saved)
        })
        .catch(err => {
          const head = "socketIoClient"
          log.error({ err, details: err.details, head }, "failed to cache tutorial.")
          client.emit(SOCKET_IO_TOPICS.SaveFailed)
        })
    })
  })
  return io
}
