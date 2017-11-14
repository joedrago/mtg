BUTTON_HEIGHT = 0.06
FIRST_BUTTON_Y = 0.22
BUTTON_SPACING = 0.08
BUTTON_SEPARATOR = 0.03

buttonPos = (index) ->
  y = FIRST_BUTTON_Y + (BUTTON_SPACING * index)
  if index > 3
    y += BUTTON_SEPARATOR
  if index > 4
    y += BUTTON_SEPARATOR
  if index > 6
    y += BUTTON_SEPARATOR
  return y

class LayoutView
  constructor: (@app, @canvas, @counter) ->
    @buttons =
      cancel:
        y: buttonPos(7)
        text: "Cancel"
        bgColor: "#777777"
        textColor: "#ffffff"
        click: @cancel.bind(this)

    # makes for a @scale x @scale block of choices
    @scale = 5

    @nameFontPixels = @counter.healthFontPixels / @scale / 3
    @fonts =
      health: @app.registerFont("health", "#{@counter.healthFontPixels / @scale}px Instruction, monospace")
      name:   @app.registerFont("name",   "#{@nameFontPixels}px Instruction, monospace")

    buttonWidth = @canvas.width * 0.8
    @buttonHeight = @canvas.height * BUTTON_HEIGHT
    buttonX = (@canvas.width - buttonWidth) / 2
    for buttonName, button of @buttons
      button.x = buttonX
      button.y = @canvas.height * button.y
      button.w = buttonWidth
      button.h = @buttonHeight

    buttonFontHeight = Math.floor(@buttonHeight * 0.4)
    @buttonFont = @app.registerFont("button", "#{buttonFontHeight}px saxMono, monospace")
    titleFontHeight = Math.floor(@canvas.height * 0.1)
    @titleFont = @app.registerFont("button", "#{titleFontHeight}px saxMono, monospace")
    return

  drawLayout: (layout, ox, oy) ->
    console.log "drawing layout", layout
    @app.drawRoundedRect(ox, oy, @canvas.width / @scale, @canvas.height / @scale, 0, @counter.Color.background, "black")
    for player in layout.players
      @app.drawTextCentered(player.health, ox + (player.x / @scale), oy + (player.y / @scale), @fonts.health, player.color, player.angle)
    @app.drawTextCentered(layout.name, ox + (@canvas.width / @scale / 2), oy + @nameFontPixels, @fonts.name, "white", 0)

  draw: ->
    @app.drawFill(0, 0, @canvas.width, @canvas.height, "#330000")

    for layout, i in @counter.layouts
      x = (i % @scale) * @canvas.width / @scale
      y = Math.floor(i / @scale) * @canvas.height / @scale
      @drawLayout(layout, x, y)

    shadowOffset = @canvas.height * 0.01
    for buttonName, button of @buttons
      @app.drawRoundedRect(button.x + shadowOffset, button.y + shadowOffset, button.w, button.h, button.h * 0.3, "black", "black")
      @app.drawRoundedRect(button.x, button.y, button.w, button.h, button.h * 0.3, button.bgColor, "#999999")
      @app.drawTextCentered(button.text, button.x + (button.w / 2), button.y + (button.h / 2), @buttonFont, button.textColor)

    # @app.drawVersion()

  mousedown: (x, y) ->
    for buttonName, button of @buttons
      if (y > button.y) && (y < (button.y + @buttonHeight))
        # console.log "button pressed: #{buttonName}"
        button.click()
        return

    console.log "#{x}, #{y}"
    layoutIndex = Math.floor(x / (@canvas.width / @scale)) + Math.floor(@scale * Math.floor(y / (@canvas.height / @scale)))
    if (layoutIndex >= 0) and (layoutIndex < @counter.layouts.length)
      layout = @counter.layouts[layoutIndex]
      if(confirm("Reset to the '#{layout.name}' layout?"))
        @counter.chooseLayout(layoutIndex)
        @app.switchView("counter")
    return

  mousemove: (x, y, buttons) ->
  mouseup: ->

  cancel: ->
    @app.switchView("menu")

module.exports = LayoutView
