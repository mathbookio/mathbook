"use strict"

function handleError(err) {
  console.error("something errored out", err)
  const status = err.status
  switch (status) {
    case 404:
      redirectTo404()
      break
    default:
      redirectTo500()
      break
  }
}

function redirectTo404() {
  window.location.href = "/404"
}

function redirectTo500() {
  window.location.href = "/error/500"
}
