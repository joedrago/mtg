FontFaceObserver = require 'fontfaceobserver'

MenuView = require './MenuView'
CounterView = require './CounterView'
LayoutView = require './LayoutView'
version = require './version'

class App
  constructor: (@canvas) ->
    @ctx = @canvas.getContext("2d")
    @loadFont("saxMono")
    @loadFont("Instruction")
    @fonts = {}

    @versionFontHeight = Math.floor(@canvas.height * 0.02)
    @versionFont = @registerFont("version", "#{@versionFontHeight}px saxMono, monospace")

    @generatingFontHeight = Math.floor(@canvas.height * 0.04)
    @generatingFont = @registerFont("generating", "#{@generatingFontHeight}px saxMono, monospace")

    @views =
      menu: new MenuView(this, @canvas)
      counter: new CounterView(this, @canvas)
    @views.layout = new LayoutView(this, @canvas, @views.counter)
    @switchView("layout")

  measureFonts: ->
    for fontName, f of @fonts
      @ctx.font = f.style
      @ctx.fillStyle = "black"
      @ctx.textAlign = "center"
      f.height = Math.floor(@ctx.measureText("m").width * 1.1) # best hack ever
      console.log "Font #{fontName} measured at #{f.height} pixels"
    return

  registerFont: (name, style) ->
    font =
      name: name
      style: style
      height: 0
    @fonts[name] = font
    @measureFonts()
    return font

  loadFont: (fontName) ->
    font = new FontFaceObserver(fontName)
    font.load().then =>
      console.log("#{fontName} loaded, redrawing...")
      @measureFonts()
      @draw()

  switchView: (view) ->
    @view = @views[view]
    @draw()

  newGame: (difficulty) ->
    # console.log "app.newGame(#{difficulty})"

    # @drawFill(0, 0, @canvas.width, @canvas.height, "#444444")
    # @drawTextCentered("Generating, please wait...", @canvas.width / 2, @canvas.height / 2, @generatingFont, "#ffffff")

    # window.setTimeout =>
    # @views.sudoku.newGame(difficulty)
    # @switchView("sudoku")
    # , 0

  reset: ->
    # @views.sudoku.reset()
    # @switchView("sudoku")

  import: (importString) ->
    # return @views.sudoku.import(importString)

  export: ->
    # return @views.sudoku.export()

  holeCount: ->
    # return @views.sudoku.holeCount()

  draw: ->
    @view.draw()

  mousedown: (x, y) ->
    @view.mousedown(x, y)

  mousemove: (x, y, buttons) ->
    @view.mousemove(x, y, buttons)

  mouseup: (x, y) ->
    @view.mouseup(x, y)

  drawFill: (x, y, w, h, color) ->
    @ctx.beginPath()
    @ctx.rect(x, y, w, h)
    @ctx.fillStyle = color
    @ctx.fill()

  drawRoundedRect: (x, y, w, h, r, fillColor = null, strokeColor = null) ->
    @ctx.roundRect(x, y, w, h, r)
    if fillColor != null
      @ctx.fillStyle = fillColor
      @ctx.fill()
    if strokeColor != null
      @ctx.strokeStyle = strokeColor
      @ctx.stroke()
    return

  drawRect: (x, y, w, h, color, lineWidth = 1) ->
    @ctx.beginPath()
    @ctx.strokeStyle = color
    @ctx.lineWidth = lineWidth
    @ctx.rect(x, y, w, h)
    @ctx.stroke()

  drawLine: (x1, y1, x2, y2, color = "black", lineWidth = 1) ->
    @ctx.beginPath()
    @ctx.strokeStyle = color
    @ctx.lineWidth = lineWidth
    @ctx.moveTo(x1, y1)
    @ctx.lineTo(x2, y2)
    @ctx.stroke()

  drawArc: (x, y, r, startAngle, endAngle, color) ->
    @ctx.beginPath()
    @ctx.fillStyle = color
    @ctx.moveTo(x, y)
    @ctx.arc(x, y, r, startAngle, endAngle)
    @ctx.closePath()
    @ctx.fill()

  strokeCircle: (x, y, r, color, lineWidth) ->
    @ctx.beginPath()
    @ctx.strokeStyle = color
    @ctx.lineWidth = lineWidth
    @ctx.arc(x, y, r, 0, Math.PI * 2)
    @ctx.closePath()
    @ctx.stroke()

  drawTextCentered: (text, cx, cy, font, color, rot) ->
    @ctx.save()
    @ctx.translate(cx, cy)
    @ctx.rotate(rot)
    @ctx.font = font.style
    @ctx.fillStyle = color

    @ctx.textAlign = "center"
    @ctx.fillText(text, 0, (font.height / 2))

    @ctx.restore()

  strokeTextCentered: (text, cx, cy, font, color, lineWidth, rot) ->
    @ctx.save()
    @ctx.translate(cx, cy)
    @ctx.rotate(rot)
    @ctx.font = font.style
    @ctx.textAlign = "center"
    @ctx.strokeStyle = color
    @ctx.lineWidth = lineWidth
    @ctx.strokeText(text, 0, (font.height / 2))
    @ctx.restore()

  drawLowerLeft: (text, color = "white") ->
    @ctx = @canvas.getContext("2d")
    @ctx.font = @versionFont.style
    @ctx.fillStyle = color
    @ctx.textAlign = "left"
    @ctx.fillText(text, 0, @canvas.height - (@versionFont.height / 2))

  drawVersion: (color = "white") ->
    @ctx = @canvas.getContext("2d")
    @ctx.font = @versionFont.style
    @ctx.fillStyle = color
    @ctx.textAlign = "right"
    @ctx.fillText("v#{version}", @canvas.width - (@versionFont.height / 2), @canvas.height - (@versionFont.height / 2))

CanvasRenderingContext2D.prototype.roundRect = (x, y, w, h, r) ->
  if (w < 2 * r) then r = w / 2
  if (h < 2 * r) then r = h / 2
  @beginPath()
  @moveTo(x+r, y)
  @arcTo(x+w, y,   x+w, y+h, r)
  @arcTo(x+w, y+h, x,   y+h, r)
  @arcTo(x,   y+h, x,   y,   r)
  @arcTo(x,   y,   x+w, y,   r)
  @closePath()
  return this

module.exports = App
