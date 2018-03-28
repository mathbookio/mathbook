const protocol = location.protocol
const domain = location.hostname
const port = location.port

/**
 * HEADS UP!
 * Since we are proxying the server via browsersync during development,
 * socket.io will try to connect using a websocket connection with the
 * following url and it will fail because port=proxyPort. This is
 * acceptable because socket.io will fall back to long polling if
 * websocket connections fail/aren't supported by the browser.
 */
const url = `${protocol}//${domain}:${port}`
const io = io(url)
io.on("connect", function() {
  console.log("socket.io Connected")
})

io.on("disconnect", function() {
  console.log("socket.io Disconnected")
})

io.on("reconnect", attemptNumber => {
  console.log("socket.io Reconnected")
})

io.on("reconnecting", attemptNumber => {
  console.log("socket.io Reconnecting::attemptNumber", attemptNumber)
})

io.on("reconnect_failed", () => {
  console.log("socket.io failed to reconnect. Exhausted all reconnect attempts.")
})

io.on("reconnect_error", error => {
  console.error("socket.io - ReconnectError", error)
})

const SocketIoService = {
  cacheTutorial: function(data) {
    data["hashToken"] = Cookies.get("hashToken")
    io.emit(SocketIoTopics.CacheTutorial, data)
  }
}

const SocketIoTopics = {
  CacheTutorial: "cacheTutorial",
  Saved: "saved",
  SaveFailed: "saveFailed"
}
