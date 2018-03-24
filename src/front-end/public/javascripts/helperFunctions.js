"use strict"

function handleError(err) {
  console.error("something errored out", err)
  const status = err.status
  switch (status) {
    case 404:
      redirectTo404()
      break
    case 401:
      redirectToLogin()
      break
    case 500:
      redirectTo500()
    default:
      break
  }
}

function redirectTo404() {
  window.location.href = "/404"
}

function redirectTo500() {
  window.location.href = "/error/500"
}

function redirectToLogin() {
  window.location.href = "/login"
}

function renderMath(id) {
  try {
    renderMathInElement(document.getElementById(id))
  } catch (err) {}
}

function renderCharts(chartList) {
  const renderedCharts = {}
  for (var i in chartList) {
    const chart = chartList[i]
    const selector = document.getElementById(chart.id)
    renderedCharts[chart.id] = createLineChart(selector, chart.data, chart.options)
  }
  return renderedCharts
}

function updateLineChart(chart, data, options) {
  const chartData = data || undefined
  const chartOptions = options || undefined
  if (chartData && chartOptions) {
    if (chartOptions["axisX"]) {
      chartOptions["axisX"]["type"] = Chartist.AutoScaleAxis
    }
    return chart.update(data, options)
  }
  return chart.update()
}

function createLineChart(selector, chartData, chartOptions) {
  if (chartOptions["axisX"]) {
    chartOptions["axisX"]["type"] = Chartist.AutoScaleAxis
  }
  const chart = new Chartist.Line(selector, chartData, chartOptions)
  convertPointsToHoles(chart)
  return chart
}

function convertPointsToHoles(chart) {
  chart.on("draw", function(data) {
    const pointIndex = data.index
    const series = data.series
    if (data.type === "point" && series[pointIndex].isHole) {
      var point = new Chartist.Svg(
        "circle",
        {
          cx: data.x,
          cy: data.y,
          // Edir r value for diffrent sizes
          r: 5,
          fill: "white"
        },
        "ct-hole"
      )
      data.element.replace(point)
    }
  })
}

function uniqueId() {
  return Math.random()
    .toString(36)
    .substr(2, 10)
}

function openNavMenu() {
  const navbarBurger = $(".navbar-burger")
  const navbarMenu = $(".navbar-menu")
  if (navbarBurger.hasClass("is-active")) {
    // return to initial state
    navbarBurger.removeClass("is-active")
    navbarMenu.removeClass("is-active")
    return
  }
  navbarBurger.addClass("is-active")
  navbarMenu.addClass("is-active")
}

function toggleDropdownMenu(id) {
  const navbarDropdown = $("#" + id)
  if (navbarDropdown.hasClass("is-active")) {
    // return to initial state
    navbarDropdown.removeClass("is-active")
    return
  }
  clearDropDowns(id)
  navbarDropdown.addClass("is-active")
}

function clearDropDowns(id) {
  $(".navbar-item.has-dropdown").each(function(index) {
    const element = $(this)
    // we only want a single dropdown open at one time
    if (id && element.is("#" + id) === false && element.hasClass("is-active")) {
      element.removeClass("is-active")
    }
  })
}

// dismiss dropdowns when user clicks away from them
$(document).click(function(e) {
  const element = $(e.target)
  if (element.hasClass("navbar-link") === false) {
    clearDropDowns()
  }
})

var socket = io("http://localhost:4000")
socket.on("connect", function() {
  console.log("CONNECTED WEBSOCKET!")
})
socket.on("event", function(data) {
  console.log("GOT SOME DATA", data)
})
socket.on("disconnect", function() {
  console.log("DISCONNECTED WEBSOCKET")
})
