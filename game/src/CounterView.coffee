Color =
  background: "#333333"
  dial: "#333333"
  dialHighlight: "#666666"
  health: "white"
  changingHealth: "red"
  addText: "#00ff00"
  subtractText: "#ff0000"
  menu: "#ffffff"

PlayerColors = [
  "#ffaaaa"
  "#aaffaa"
  "#aaaaff"
  "#ffffaa"
  "#ffaaff"
  "#aaffff"
]

TWO_PI = Math.PI * 2

clone = (obj) ->
  # TODO: find something better?
  return JSON.parse(JSON.stringify(obj))

class CounterView
  # -------------------------------------------------------------------------------------
  # Init

  constructor: (@app, @canvas) ->
    console.log "canvas size #{@canvas.width}x#{@canvas.height}"

    @Color = Color
    @PlayerColors = PlayerColors

    # init fonts
    @healthFontPixels = Math.floor(@canvas.width * 0.30)
    incrementFontPixels = Math.floor(@canvas.width * 0.05)
    menuFontPixels = Math.floor(@canvas.width * 0.05)
    @fonts =
      health:    @app.registerFont("health",    "#{@healthFontPixels}px Instruction, monospace")
      increment: @app.registerFont("increment", "#{incrementFontPixels}px Instruction, monospace")
      menu:      @app.registerFont("increment", "#{menuFontPixels}px Instruction, monospace")

    @center =
      x: @canvas.width / 2
      y: @canvas.height / 2

    @sliceCount = 20
    @halfSliceCount = Math.floor(@sliceCount / 2)
    @sliceAngle = TWO_PI / @sliceCount
    @halfSliceAngle = @sliceAngle / 2

    @dialRadius = @center.x * 0.8
    @dialIncrementRadius = @center.x * 0.7
    @menuRadius = @center.x * 0.1

    @layouts = []

    fRadius2 = @center.y * 0.6
    cRadius6 = @center.x * 0.7
    fRadius6 = @center.x * 1.1

    @layouts.push {
      name: "Solo"
      players: [
        @playerLayout(PlayerColors[0], 4, fRadius2, 20)
      ]
    }

    @layouts.push {
      name: "2P"
      players: [
        @playerLayout(PlayerColors[0], 4, fRadius2, 20)
        @playerLayout(PlayerColors[1], 14, fRadius2, 20)
      ]
    }

    @layouts.push {
      name: "3P"
      players: [
        @playerLayout(PlayerColors[0], 4, fRadius2, 20)
        @playerLayout(PlayerColors[1], 9, cRadius6, 20)
        @playerLayout(PlayerColors[2], 14, fRadius2, 20)
      ]
    }

    @layouts.push {
      name: "4P"
      players: [
        @playerLayout(PlayerColors[0], 4, fRadius2, 20)
        @playerLayout(PlayerColors[1], 9, cRadius6, 20)
        @playerLayout(PlayerColors[2], 14, fRadius2, 20)
        @playerLayout(PlayerColors[3], 19, cRadius6, 20)
      ]
    }

    @layouts.push {
      name: "Scoreboard 4P"
      players: [
        @playerLayout(PlayerColors[0], 2, cRadius6, 20, Math.PI / 2)
        @playerLayout(PlayerColors[1], 6, cRadius6, 20, Math.PI / 2)
        @playerLayout(PlayerColors[2], 12, cRadius6, 20, Math.PI / 2)
        @playerLayout(PlayerColors[3], 16, cRadius6, 20, Math.PI / 2)
      ]
    }

    @layouts.push {
      name: "2v2"
      players: [
        @playerLayout(PlayerColors[0],  2, cRadius6, 20, -Math.PI / 2)
        @playerLayout(PlayerColors[1],  6, cRadius6, 20,  Math.PI / 2)
        @playerLayout(PlayerColors[1], 12, cRadius6, 20,  Math.PI / 2)
        @playerLayout(PlayerColors[0], 16, cRadius6, 20, -Math.PI / 2)
      ]
    }

    @layouts.push {
      name: "5 Player"
      players: [
        @playerLayout(PlayerColors[0], 2, fRadius6, 20)
        @playerLayout(PlayerColors[1], 6, fRadius6, 20)
        @playerLayout(PlayerColors[2], 9, cRadius6, 20)
        @playerLayout(PlayerColors[3], 12, fRadius6, 20)
        @playerLayout(PlayerColors[4], 16, fRadius6, 20)
      ]
    }

    @layouts.push {
      name: "6P"
      players: [
        @playerLayout(PlayerColors[0], 2, fRadius6, 20)
        @playerLayout(PlayerColors[1], 6, fRadius6, 20)
        @playerLayout(PlayerColors[2], 9, cRadius6, 20)
        @playerLayout(PlayerColors[3], 12, fRadius6, 20)
        @playerLayout(PlayerColors[4], 16, fRadius6, 20)
        @playerLayout(PlayerColors[5], 19, cRadius6, 20)
      ]
    }

    @layouts.push {
      name: "Commander 6P"
      players: [
        @playerLayout(PlayerColors[0], 2, fRadius6, 40)
        @playerLayout(PlayerColors[1], 6, fRadius6, 40)
        @playerLayout(PlayerColors[1], 9, cRadius6, 40)
        @playerLayout(PlayerColors[1], 12, fRadius6, 40)
        @playerLayout(PlayerColors[0], 16, fRadius6, 40)
        @playerLayout(PlayerColors[0], 19, cRadius6, 40)
      ]
    }

    if not @load()
      @chooseLayout(0)
    @onDragReset()
    @draw()

  chooseLayout: (layout) ->
    @layoutIndex = layout
    @players = clone(@layouts[layout].players)
    @save()
    return

  resetAllHealth: ->
    @chooseLayout(@layoutIndex)

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
    angle = 0
    for slice in [0...@sliceCount]
      if (posAngle >= angle) and (posAngle < (angle + @sliceAngle))
        return slice
      angle += @sliceAngle
    return 0

  playerLayout: (color, slice, radius, health, angle = null) ->
    c = @unpolar(((slice + 1) % @sliceCount) * @sliceAngle, radius, @center.x, @center.y)
    if angle == null
      angle = @facingOutAngle(c.x, c.y)
    player =
      x: c.x
      y: c.y
      angle: angle
      slice: slice
      health: health
      color: color
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
    distanceFromCenter = @distance(x, y, @center.x, @center.y)
    if distanceFromCenter < @menuRadius
      @app.switchView("menu")
      return

    # console.log "mousedown #{x}, #{y}"
    @onDragPos(x, y)
    @draw()

  mousemove: (x, y, buttons) ->
    # console.log "mousedown #{x}, #{y}"
    if buttons == 1
      @onDragPos(x, y)
      @draw()

  mouseup: ->
    if @dragging
      dragPlayer = @players[@dragPlayerIndex]
      newHealth = dragPlayer.health
      if @dragDelta > 1
        newHealth += @dragDelta - 1
      else if @dragDelta < 0
        newHealth += @dragDelta
      dragPlayer.health = newHealth
      @save()

    @onDragReset()
    @draw()

  # -------------------------------------------------------------------------------------
  load: ->
    if not localStorage
      alert("No local storage, nothing will work")
      return false
    jsonString = localStorage.getItem("state")
    if jsonString == null
      return false

    state = JSON.parse(jsonString)

    # TODO: validate info
    @players = state.players
    @layoutIndex = state.layoutIndex

    console.log "Loaded state."
    return true

  save: ->
    if not localStorage
      alert("No local storage, nothing will work")
      return false

    state =
      players: @players
      layoutIndex: @layoutIndex

    jsonString = JSON.stringify(state)
    localStorage.setItem("state", jsonString)
    console.log "Saved state (#{jsonString.length} chars)"
    return true

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
    @app.drawFill(0, 0, @canvas.width, @canvas.height, Color.background)
    # @app.drawRect(@center.x, @center.y, 1, 1, "white", 1) # debug center dot

    @app.strokeCircle(@center.x, @center.y, @menuRadius, "white", 4)
    @app.drawTextCentered("M", @center.x, @center.y, @fonts.menu, Color.menu, 0)

    for player, index in @players
      color = Color.health
      if @dragging and (index == @dragPlayerIndex)
        color = Color.changingHealth
      @app.drawTextCentered(  String(player.health), player.x, player.y, @fonts.health, player.color, player.angle)
      @app.strokeTextCentered(String(player.health), player.x, player.y, @fonts.health, "white", 4, player.angle)

    if @dragging
      dragPlayer = @players[@dragPlayerIndex]

      @app.drawArc(@center.x, @center.y, @dialRadius, 0, TWO_PI, Color.dial)

      for i in [0...@halfSliceCount+1]
        slice = (@dragSlice + i) % @sliceCount
        angle = slice * @sliceAngle
        value = @dragDelta + i
        if slice == @dragSlice
          @app.drawArc(@center.x, @center.y, @dialRadius, angle, angle + @sliceAngle, Color.dialHighlight)
        if (value != 0) and (value != 1)
          if value > 0
            textV = "+#{value - 1}"
            textColor = Color.addText
          else
            textV = "#{value}"
            textColor = Color.subtractText
          textPos = @unpolar(angle + @halfSliceAngle, @dialIncrementRadius, @center.x, @center.y)
          @app.drawTextCentered(textV, textPos.x, textPos.y, @fonts.increment, textColor, @facingOutAngle(textPos.x, textPos.y))

      for i in [1...@halfSliceCount]
        slice = (@sliceCount + @dragSlice - i) % @sliceCount
        angle = slice * @sliceAngle
        value = @dragDelta - i
        if (value != 0) and (value != 1)
          if value > 0
            textV = "+#{value - 1}"
            textColor = Color.addText
          else
            textV = "#{value}"
            textColor = Color.subtractText
          textPos = @unpolar(angle + @halfSliceAngle, @dialIncrementRadius, @center.x, @center.y)
          @app.drawTextCentered(textV, textPos.x, textPos.y, @fonts.increment, textColor, @facingOutAngle(textPos.x, textPos.y))

      @app.strokeCircle(@center.x, @center.y, @dialRadius, "white", 4)

      estimatedHealth = dragPlayer.health
      if @dragDelta > 1
        estimatedHealth += @dragDelta - 1
      else if @dragDelta < 0
        estimatedHealth += @dragDelta
      @app.drawTextCentered(  estimatedHealth, @center.x, @center.y, @fonts.health, dragPlayer.color, dragPlayer.angle)
      @app.strokeTextCentered(estimatedHealth, @center.x, @center.y, @fonts.health, "white", 4, dragPlayer.angle)

    return

  # -------------------------------------------------------------------------------------

module.exports = CounterView
