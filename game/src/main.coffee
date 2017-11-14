App = require './App'

Util = {}
Util.base64 = (mimeType, base64) ->
  return 'data:' + mimeType + 'base64,' + base64

sleepDisabled = false
disableSleep = ->
  if sleepDisabled
    return

  console.log "Disabling sleep..."
  video = document.createElement('video')
  video.setAttribute('loop', '')
  addSourceToVideo = (element, type, dataURI) ->
    source = document.createElement('source')
    source.src = dataURI
    source.type = 'video/' + type
    element.appendChild(source)
  addSourceToVideo(video,'webm', Util.base64('video/webm', 'GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA='))
  addSourceToVideo(video, 'mp4', Util.base64('video/mp4', 'AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=='))
  video.play()
  sleepDisabled = true
  return

init = ->
  console.log "init"
  canvas = document.createElement("canvas")
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight
  document.body.insertBefore(canvas, document.body.childNodes[0])
  canvasRect = canvas.getBoundingClientRect()

  window.app = new App(canvas)

  canvas.addEventListener "touchstart", (e) ->
    disableSleep()
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
    disableSleep()
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
