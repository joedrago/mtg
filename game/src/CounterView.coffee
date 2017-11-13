Color =
  health: "white"
  changingHealth: "red"
  centeredHealth: "white"

TWO_PI = Math.PI * 2

clone = (obj) ->
  # TODO: find something better?
  return JSON.parse(JSON.stringify(obj))

class CounterView
  # -------------------------------------------------------------------------------------
  # Init

  constructor: (@app, @canvas) ->
    console.log "canvas size #{@canvas.width}x#{@canvas.height}"

    # init fonts
    healthFontPixels = Math.floor(@canvas.width * 0.35)
    incrementFontPixels = Math.floor(@canvas.width * 0.05)
    @fonts =
      health:    @app.registerFont("health",    "#{healthFontPixels}px saxMono, monospace")
      increment: @app.registerFont("increment", "#{incrementFontPixels}px saxMono, monospace")

    @center =
      x: @canvas.width / 2
      y: @canvas.height / 2

    @sliceCount = 16
    @halfSliceCount = Math.floor(@sliceCount / 2)

    @dialRadius = @center.x * 0.7
    @dialIncrementRadius = @center.x * 0.6

    @layouts = []

    # 6 players
    xstep6 = @center.x / 2
    ystep6 = @center.y / 3
    @layouts.push {
      players: [
        @playerLayout(2,  xstep6 * 3, ystep6 * 5)
        @playerLayout(4,  xstep6,     ystep6 * 5)
        @playerLayout(7,  xstep6,     ystep6 * 3)
        @playerLayout(10, xstep6,     ystep6    )
        @playerLayout(12, xstep6 * 3, ystep6    )
        @playerLayout(15, xstep6 * 3, ystep6 * 3)
      ]
    }

    @chooseLayout(0)
    @onDragReset()
    @draw()

  chooseLayout: (layout) ->
    @players = clone(@layouts[layout].players)
    return

  # -------------------------------------------------------------------------------------

  import: (importString) ->
    # return @counter.import(importString)

  export: ->
    return "" #@counter.export()

  # -------------------------------------------------------------------------------------

  facingOutAngle: (x, y) ->
    return Math.atan2(y - @center.y, x - @center.x) - (Math.PI / 2)

  unpolar: (angle, r, offsetX = 0, offsetY = 0) ->
    return {
      x: offsetX + (Math.cos(angle) * r)
      y: offsetY + (Math.sin(angle) * r)
    }

  posToSlice: (x, y) ->
    posAngle = Math.atan2(y - @center.y, x - @center.x)
    if posAngle < 0
      posAngle += Math.PI * 2
    sliceAngle = TWO_PI / @sliceCount
    angle = 0
    for slice in [0...@sliceCount]
      if (posAngle >= angle) and (posAngle < (angle + sliceAngle))
        return slice
      angle += sliceAngle
    return 0

  playerLayout: (slice, x, y) ->
    player =
      x: x
      y: y
      angle: @facingOutAngle(x, y)
      slice: slice
      health: 20
    return player

  distance: (x0, y0, x1, y1) ->
    xd = x1 - x0
    yd = y1 - y0
    return Math.sqrt((xd*xd) + (yd*yd))

  # -------------------------------------------------------------------------------------

  onDragPos: (x, y) ->
    @dragging = true

    if @dragSlice == -1
      # Figure out which player we started on
      closestIndex = 0
      closestPosition = @canvas.height * 1000
      for player, index in @players
        dist = @distance(player.x, player.y, x, y)
        if closestPosition > dist
          closestPosition = dist
          closestIndex = index
      @dragPlayerIndex = closestIndex

    # -----------------------------------------------------------
    # TODO: distribute a bunch of math out
      @dragSlice = @posToSlice(x, y)

      @dragDelta = @dragSlice - @players[@dragPlayerIndex].slice
      if @dragDelta > @halfSliceCount
        @dragDelta -= @sliceCount
      if @dragDelta < -@halfSliceCount
        @dragDelta += @sliceCount
      console.log "@dragDelta starting at #{@dragDelta}"
    else
      newDragSlice = @posToSlice(x, y)
      if @dragSlice != newDragSlice
        sliceOffset = newDragSlice - @dragSlice
        if sliceOffset > @halfSliceCount
          sliceOffset -= @sliceCount
        if sliceOffset < -@halfSliceCount
          sliceOffset += @sliceCount
        @dragDelta += sliceOffset
        console.log "@dragDelta now at #{@dragDelta}"

        @dragSlice = newDragSlice
    # -----------------------------------------------------------

    @dragX = x
    @dragY = y
    # @dragAngle = Math.atan2(y - @center.y, x - @center.x)
    return

  onDragReset: ->
    @dragging = false
    @dragPlayerIndex = -1
    @dragX = -1
    @dragY = -1
    @dragSlice = -1
    @dragDelta = 0

  mousedown: (x, y) ->
    # console.log "mousedown #{x}, #{y}"
    @onDragPos(x, y)
    @draw()

  mousemove: (x, y, buttons) ->
    # console.log "mousedown #{x}, #{y}"
    if buttons == 1
      @onDragPos(x, y)
      @draw()

  mouseup: ->
    # console.log "mouseup #{x}, #{y}"

    dragPlayer = @players[@dragPlayerIndex]
    newHealth = dragPlayer.health
    if @dragDelta > 1
      newHealth += @dragDelta - 1
    else if @dragDelta < 0
      newHealth += @dragDelta
    dragPlayer.health = newHealth

    @onDragReset()
    @draw()

  # -------------------------------------------------------------------------------------

  sliceOffsetToDelta: (offset) ->
    if offset == 0
      return 0

    if offset <= @halfSliceCount
      # trying to increment
      return offset
    else
      # trying to decrement
      return -1 * (@sliceCount - offset)

  draw: ->
    console.log "draw()"

    # Clear screen to black
    @app.drawFill(0, 0, @canvas.width, @canvas.height, "black")
    # @app.drawRect(@center.x, @center.y, 1, 1, "white", 1) # debug center dot

    for player, index in @players
      color = Color.health
      if @dragging and (index == @dragPlayerIndex)
        color = Color.changingHealth
      @app.drawTextCentered(String(player.health), player.x, player.y, @fonts.health, color, player.angle)

    if @dragging
      dragPlayer = @players[@dragPlayerIndex]
      sliceAngle = TWO_PI / @sliceCount
      halfSliceAngle = sliceAngle / 2

      @app.drawArc(@center.x, @center.y, @dialRadius, 0, TWO_PI, "#333333")

      for i in [0...@halfSliceCount+1]
        slice = (@dragSlice + i) % @sliceCount
        angle = slice * sliceAngle
        value = @dragDelta + i
        if slice == @dragSlice
          @app.drawArc(@center.x, @center.y, @dialRadius, angle, angle + sliceAngle, "#555555")
        if (value != 0) and (value != 1)
          if value > 0
            textV = "+#{value - 1}"
            textColor = "#aaffaa"
          else
            textV = "#{value}"
            textColor = "#ffaaaa"
          textPos = @unpolar(angle + halfSliceAngle, @dialIncrementRadius, @center.x, @center.y)
          @app.drawTextCentered(textV, textPos.x, textPos.y, @fonts.increment, textColor, @facingOutAngle(textPos.x, textPos.y))

      for i in [1...@halfSliceCount]
        slice = (@sliceCount + @dragSlice - i) % @sliceCount
        angle = slice * sliceAngle
        value = @dragDelta - i
        if (value != 0) and (value != 1)
          if value > 0
            textV = "+#{value - 1}"
            textColor = "#aaffaa"
          else
            textV = "#{value}"
            textColor = "#ffaaaa"
          textPos = @unpolar(angle + halfSliceAngle, @dialIncrementRadius, @center.x, @center.y)
          @app.drawTextCentered(textV, textPos.x, textPos.y, @fonts.increment, textColor, @facingOutAngle(textPos.x, textPos.y))

      estimatedHealth = dragPlayer.health
      if @dragDelta > 1
        estimatedHealth += @dragDelta - 1
      else if @dragDelta < 0
        estimatedHealth += @dragDelta
      @app.drawTextCentered(String(estimatedHealth), @center.x, @center.y, @fonts.health, Color.centeredHealth, dragPlayer.angle)

    return

  # -------------------------------------------------------------------------------------

module.exports = CounterView
