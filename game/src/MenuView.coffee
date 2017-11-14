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

class MenuView
  constructor: (@app, @canvas) ->
    @buttons =
      chooseLayout:
        y: buttonPos(1)
        text: "Choose Layout"
        bgColor: "#555555"
        textColor: "#ffffff"
        click: @chooseLayout.bind(this)
      resetAllHealth:
        y: buttonPos(2)
        text: "Reset All Health"
        bgColor: "#555555"
        textColor: "#ffffff"
        click: @resetAllHealth.bind(this)
      resume:
        y: buttonPos(7)
        text: "Resume"
        bgColor: "#777777"
        textColor: "#ffffff"
        click: @resume.bind(this)

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

  draw: ->
    @app.drawFill(0, 0, @canvas.width, @canvas.height, "#333333")

    x = @canvas.width / 2
    shadowOffset = @canvas.height * 0.01

    y1 = @canvas.height * 0.05
    y2 = @canvas.height * 0.15
    @app.drawTextCentered("MTG", x + shadowOffset, y2 + shadowOffset, @titleFont, "#000000")
    @app.drawTextCentered("MTG", x, y2, @titleFont, "#ffffff")

    for buttonName, button of @buttons
      @app.drawRoundedRect(button.x + shadowOffset, button.y + shadowOffset, button.w, button.h, button.h * 0.3, "black", "black")
      @app.drawRoundedRect(button.x, button.y, button.w, button.h, button.h * 0.3, button.bgColor, "#999999")
      @app.drawTextCentered(button.text, button.x + (button.w / 2), button.y + (button.h / 2), @buttonFont, button.textColor)

    @app.drawVersion()

  mousedown: (x, y) ->
    for buttonName, button of @buttons
      if (y > button.y) && (y < (button.y + @buttonHeight))
        # console.log "button pressed: #{buttonName}"
        button.click()
    return

  mousemove: (x, y, buttons) ->
  mouseup: ->

  chooseLayout: ->
    @app.switchView("layout")

  resetAllHealth: ->
    if(confirm("Reset all health?"))
      @app.resetAllHealth()

  resume: ->
    @app.switchView("counter")

module.exports = MenuView
