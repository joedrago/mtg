App = require './App'
NoSleep = require 'nosleep.js'

init = ->
  console.log "init"
  canvas = document.createElement("canvas")
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight
  document.body.insertBefore(canvas, document.body.childNodes[0])
  canvasRect = canvas.getBoundingClientRect()

  noSleep = new NoSleep()

  window.app = new App(canvas)

  canvas.addEventListener "touchstart", (e) ->
    noSleep.enable()
    e.preventDefault()
    x = e.touches[0].clientX - canvasRect.left
    y = e.touches[0].clientY - canvasRect.top
    window.app.mousedown(x, y)

  canvas.addEventListener "touchmove", (e) ->
    e.preventDefault()
    x = e.touches[0].clientX - canvasRect.left
    y = e.touches[0].clientY - canvasRect.top
    window.app.mousemove(x, y, 1)

  canvas.addEventListener "touchend", (e) ->
    e.preventDefault()
    window.app.mouseup()

  canvas.addEventListener "mousedown", (e) ->
    noSleep.enable()
    e.preventDefault()
    x = e.clientX - canvasRect.left
    y = e.clientY - canvasRect.top
    window.app.mousedown(x, y)

  canvas.addEventListener "mousemove", (e) ->
    e.preventDefault()
    x = e.clientX - canvasRect.left
    y = e.clientY - canvasRect.top
    buttons = e.buttons
    window.app.mousemove(x, y, buttons)

  canvas.addEventListener "mouseup", (e) ->
    e.preventDefault()
    window.app.mouseup()

window.addEventListener('load', (e) ->
    init()
, false)
