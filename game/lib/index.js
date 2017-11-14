(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App, CounterView, FontFaceObserver, LayoutView, MenuView, version;

FontFaceObserver = require('fontfaceobserver');

MenuView = require('./MenuView');

CounterView = require('./CounterView');

LayoutView = require('./LayoutView');

version = require('./version');

App = (function() {
  function App(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.loadFont("saxMono");
    this.loadFont("Instruction");
    this.fonts = {};
    this.versionFontHeight = Math.floor(this.canvas.height * 0.02);
    this.versionFont = this.registerFont("version", this.versionFontHeight + "px saxMono, monospace");
    this.generatingFontHeight = Math.floor(this.canvas.height * 0.04);
    this.generatingFont = this.registerFont("generating", this.generatingFontHeight + "px saxMono, monospace");
    this.views = {
      menu: new MenuView(this, this.canvas),
      counter: new CounterView(this, this.canvas)
    };
    this.views.layout = new LayoutView(this, this.canvas, this.views.counter);
    this.switchView("layout");
  }

  App.prototype.measureFonts = function() {
    var f, fontName, ref;
    ref = this.fonts;
    for (fontName in ref) {
      f = ref[fontName];
      this.ctx.font = f.style;
      this.ctx.fillStyle = "black";
      this.ctx.textAlign = "center";
      f.height = Math.floor(this.ctx.measureText("m").width * 1.1);
      console.log("Font " + fontName + " measured at " + f.height + " pixels");
    }
  };

  App.prototype.registerFont = function(name, style) {
    var font;
    font = {
      name: name,
      style: style,
      height: 0
    };
    this.fonts[name] = font;
    this.measureFonts();
    return font;
  };

  App.prototype.loadFont = function(fontName) {
    var font;
    font = new FontFaceObserver(fontName);
    return font.load().then((function(_this) {
      return function() {
        console.log(fontName + " loaded, redrawing...");
        _this.measureFonts();
        return _this.draw();
      };
    })(this));
  };

  App.prototype.switchView = function(view) {
    this.view = this.views[view];
    return this.draw();
  };

  App.prototype.newGame = function(difficulty) {};

  App.prototype.reset = function() {};

  App.prototype["import"] = function(importString) {};

  App.prototype["export"] = function() {};

  App.prototype.holeCount = function() {};

  App.prototype.draw = function() {
    return this.view.draw();
  };

  App.prototype.mousedown = function(x, y) {
    return this.view.mousedown(x, y);
  };

  App.prototype.mousemove = function(x, y, buttons) {
    return this.view.mousemove(x, y, buttons);
  };

  App.prototype.mouseup = function(x, y) {
    return this.view.mouseup(x, y);
  };

  App.prototype.drawFill = function(x, y, w, h, color) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.fillStyle = color;
    return this.ctx.fill();
  };

  App.prototype.drawRoundedRect = function(x, y, w, h, r, fillColor, strokeColor) {
    if (fillColor == null) {
      fillColor = null;
    }
    if (strokeColor == null) {
      strokeColor = null;
    }
    this.ctx.roundRect(x, y, w, h, r);
    if (fillColor !== null) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    if (strokeColor !== null) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.stroke();
    }
  };

  App.prototype.drawRect = function(x, y, w, h, color, lineWidth) {
    if (lineWidth == null) {
      lineWidth = 1;
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.rect(x, y, w, h);
    return this.ctx.stroke();
  };

  App.prototype.drawLine = function(x1, y1, x2, y2, color, lineWidth) {
    if (color == null) {
      color = "black";
    }
    if (lineWidth == null) {
      lineWidth = 1;
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    return this.ctx.stroke();
  };

  App.prototype.drawArc = function(x, y, r, startAngle, endAngle, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.moveTo(x, y);
    this.ctx.arc(x, y, r, startAngle, endAngle);
    this.ctx.closePath();
    return this.ctx.fill();
  };

  App.prototype.strokeCircle = function(x, y, r, color, lineWidth) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.closePath();
    return this.ctx.stroke();
  };

  App.prototype.drawTextCentered = function(text, cx, cy, font, color, rot) {
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(rot);
    this.ctx.font = font.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, 0, font.height / 2);
    return this.ctx.restore();
  };

  App.prototype.strokeTextCentered = function(text, cx, cy, font, color, lineWidth, rot) {
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(rot);
    this.ctx.font = font.style;
    this.ctx.textAlign = "center";
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeText(text, 0, font.height / 2);
    return this.ctx.restore();
  };

  App.prototype.drawLowerLeft = function(text, color) {
    if (color == null) {
      color = "white";
    }
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = this.versionFont.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "left";
    return this.ctx.fillText(text, 0, this.canvas.height - (this.versionFont.height / 2));
  };

  App.prototype.drawVersion = function(color) {
    if (color == null) {
      color = "white";
    }
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = this.versionFont.style;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "right";
    return this.ctx.fillText("v" + version, this.canvas.width - (this.versionFont.height / 2), this.canvas.height - (this.versionFont.height / 2));
  };

  return App;

})();

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

module.exports = App;


},{"./CounterView":2,"./LayoutView":3,"./MenuView":4,"./version":6,"fontfaceobserver":7}],2:[function(require,module,exports){
var Color, CounterView, PlayerColors, TWO_PI, clone;

Color = {
  background: "#333333",
  dial: "#333333",
  dialHighlight: "#666666",
  health: "white",
  changingHealth: "red",
  addText: "#00ff00",
  subtractText: "#ff0000",
  menu: "#ffffff"
};

PlayerColors = ["#ffaaaa", "#aaffaa", "#aaaaff", "#ffffaa", "#ffaaff", "#aaffff"];

TWO_PI = Math.PI * 2;

clone = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

CounterView = (function() {
  function CounterView(app, canvas) {
    var cRadius6, fRadius6, healthFontPixels, incrementFontPixels, menuFontPixels;
    this.app = app;
    this.canvas = canvas;
    console.log("canvas size " + this.canvas.width + "x" + this.canvas.height);
    healthFontPixels = Math.floor(this.canvas.width * 0.30);
    incrementFontPixels = Math.floor(this.canvas.width * 0.05);
    menuFontPixels = Math.floor(this.canvas.width * 0.05);
    this.fonts = {
      health: this.app.registerFont("health", healthFontPixels + "px Instruction, monospace"),
      increment: this.app.registerFont("increment", incrementFontPixels + "px Instruction, monospace"),
      menu: this.app.registerFont("increment", menuFontPixels + "px Instruction, monospace")
    };
    this.center = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    };
    this.sliceCount = 20;
    this.halfSliceCount = Math.floor(this.sliceCount / 2);
    this.sliceAngle = TWO_PI / this.sliceCount;
    this.halfSliceAngle = this.sliceAngle / 2;
    this.dialRadius = this.center.x * 0.8;
    this.dialIncrementRadius = this.center.x * 0.7;
    this.menuRadius = this.center.x * 0.1;
    this.layouts = [];
    cRadius6 = this.center.x * 0.7;
    fRadius6 = this.center.x * 1.1;
    this.layouts.push({
      name: "Commander 6P",
      players: [this.playerLayout(PlayerColors[0], 2, fRadius6, 40), this.playerLayout(PlayerColors[1], 6, fRadius6, 40), this.playerLayout(PlayerColors[2], 9, cRadius6, 40), this.playerLayout(PlayerColors[3], 12, fRadius6, 40), this.playerLayout(PlayerColors[4], 16, fRadius6, 40), this.playerLayout(PlayerColors[5], 19, cRadius6, 40)]
    });
    this.chooseLayout(0);
    this.onDragReset();
    this.draw();
  }

  CounterView.prototype.chooseLayout = function(layout) {
    this.players = clone(this.layouts[layout].players);
  };

  CounterView.prototype["import"] = function(importString) {};

  CounterView.prototype["export"] = function() {
    return "";
  };

  CounterView.prototype.facingOutAngle = function(x, y) {
    return Math.atan2(y - this.center.y, x - this.center.x) - (Math.PI / 2);
  };

  CounterView.prototype.unpolar = function(angle, r, offsetX, offsetY) {
    if (offsetX == null) {
      offsetX = 0;
    }
    if (offsetY == null) {
      offsetY = 0;
    }
    return {
      x: offsetX + (Math.cos(angle) * r),
      y: offsetY + (Math.sin(angle) * r)
    };
  };

  CounterView.prototype.posToSlice = function(x, y) {
    var angle, j, posAngle, ref, slice;
    posAngle = Math.atan2(y - this.center.y, x - this.center.x);
    if (posAngle < 0) {
      posAngle += Math.PI * 2;
    }
    angle = 0;
    for (slice = j = 0, ref = this.sliceCount; 0 <= ref ? j < ref : j > ref; slice = 0 <= ref ? ++j : --j) {
      if ((posAngle >= angle) && (posAngle < (angle + this.sliceAngle))) {
        return slice;
      }
      angle += this.sliceAngle;
    }
    return 0;
  };

  CounterView.prototype.playerLayout = function(color, slice, radius, health) {
    var c, player;
    c = this.unpolar(((slice + 1) % this.sliceCount) * this.sliceAngle, radius, this.center.x, this.center.y);
    player = {
      x: c.x,
      y: c.y,
      angle: this.facingOutAngle(c.x, c.y),
      slice: slice,
      health: health,
      color: color
    };
    return player;
  };

  CounterView.prototype.distance = function(x0, y0, x1, y1) {
    var xd, yd;
    xd = x1 - x0;
    yd = y1 - y0;
    return Math.sqrt((xd * xd) + (yd * yd));
  };

  CounterView.prototype.onDragPos = function(x, y) {
    var closestIndex, closestPosition, dist, index, j, len, newDragSlice, player, ref, sliceOffset;
    this.dragging = true;
    if (this.dragSlice === -1) {
      closestIndex = 0;
      closestPosition = this.canvas.height * 1000;
      ref = this.players;
      for (index = j = 0, len = ref.length; j < len; index = ++j) {
        player = ref[index];
        dist = this.distance(player.x, player.y, x, y);
        if (closestPosition > dist) {
          closestPosition = dist;
          closestIndex = index;
        }
      }
      this.dragPlayerIndex = closestIndex;
      this.dragSlice = this.posToSlice(x, y);
      this.dragDelta = this.dragSlice - this.players[this.dragPlayerIndex].slice;
      if (this.dragDelta > this.halfSliceCount) {
        this.dragDelta -= this.sliceCount;
      }
      if (this.dragDelta < -this.halfSliceCount) {
        this.dragDelta += this.sliceCount;
      }
      console.log("@dragDelta starting at " + this.dragDelta);
    } else {
      newDragSlice = this.posToSlice(x, y);
      if (this.dragSlice !== newDragSlice) {
        sliceOffset = newDragSlice - this.dragSlice;
        if (sliceOffset > this.halfSliceCount) {
          sliceOffset -= this.sliceCount;
        }
        if (sliceOffset < -this.halfSliceCount) {
          sliceOffset += this.sliceCount;
        }
        this.dragDelta += sliceOffset;
        console.log("@dragDelta now at " + this.dragDelta);
        this.dragSlice = newDragSlice;
      }
    }
    this.dragX = x;
    this.dragY = y;
  };

  CounterView.prototype.onDragReset = function() {
    this.dragging = false;
    this.dragPlayerIndex = -1;
    this.dragX = -1;
    this.dragY = -1;
    this.dragSlice = -1;
    return this.dragDelta = 0;
  };

  CounterView.prototype.mousedown = function(x, y) {
    var distanceFromCenter;
    distanceFromCenter = this.distance(x, y, this.center.x, this.center.y);
    if (distanceFromCenter < this.menuRadius) {
      this.app.switchView("menu");
      return;
    }
    this.onDragPos(x, y);
    return this.draw();
  };

  CounterView.prototype.mousemove = function(x, y, buttons) {
    if (buttons === 1) {
      this.onDragPos(x, y);
      return this.draw();
    }
  };

  CounterView.prototype.mouseup = function() {
    var dragPlayer, newHealth;
    if (this.dragging) {
      dragPlayer = this.players[this.dragPlayerIndex];
      newHealth = dragPlayer.health;
      if (this.dragDelta > 1) {
        newHealth += this.dragDelta - 1;
      } else if (this.dragDelta < 0) {
        newHealth += this.dragDelta;
      }
      dragPlayer.health = newHealth;
    }
    this.onDragReset();
    return this.draw();
  };

  CounterView.prototype.sliceOffsetToDelta = function(offset) {
    if (offset === 0) {
      return 0;
    }
    if (offset <= this.halfSliceCount) {
      return offset;
    } else {
      return -1 * (this.sliceCount - offset);
    }
  };

  CounterView.prototype.draw = function() {
    var angle, color, dragPlayer, estimatedHealth, i, index, j, k, l, len, player, ref, ref1, ref2, slice, textColor, textPos, textV, value;
    console.log("draw()");
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, Color.background);
    this.app.strokeCircle(this.center.x, this.center.y, this.menuRadius, "white", 4);
    this.app.drawTextCentered("M", this.center.x, this.center.y, this.fonts.menu, Color.menu, 0);
    ref = this.players;
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      player = ref[index];
      color = Color.health;
      if (this.dragging && (index === this.dragPlayerIndex)) {
        color = Color.changingHealth;
      }
      this.app.drawTextCentered(String(player.health), player.x, player.y, this.fonts.health, player.color, player.angle);
      this.app.strokeTextCentered(String(player.health), player.x, player.y, this.fonts.health, "white", 4, player.angle);
    }
    if (this.dragging) {
      dragPlayer = this.players[this.dragPlayerIndex];
      this.app.drawArc(this.center.x, this.center.y, this.dialRadius, 0, TWO_PI, Color.dial);
      for (i = k = 0, ref1 = this.halfSliceCount + 1; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        slice = (this.dragSlice + i) % this.sliceCount;
        angle = slice * this.sliceAngle;
        value = this.dragDelta + i;
        if (slice === this.dragSlice) {
          this.app.drawArc(this.center.x, this.center.y, this.dialRadius, angle, angle + this.sliceAngle, Color.dialHighlight);
        }
        if ((value !== 0) && (value !== 1)) {
          if (value > 0) {
            textV = "+" + (value - 1);
            textColor = Color.addText;
          } else {
            textV = "" + value;
            textColor = Color.subtractText;
          }
          textPos = this.unpolar(angle + this.halfSliceAngle, this.dialIncrementRadius, this.center.x, this.center.y);
          this.app.drawTextCentered(textV, textPos.x, textPos.y, this.fonts.increment, textColor, this.facingOutAngle(textPos.x, textPos.y));
        }
      }
      for (i = l = 1, ref2 = this.halfSliceCount; 1 <= ref2 ? l < ref2 : l > ref2; i = 1 <= ref2 ? ++l : --l) {
        slice = (this.sliceCount + this.dragSlice - i) % this.sliceCount;
        angle = slice * this.sliceAngle;
        value = this.dragDelta - i;
        if ((value !== 0) && (value !== 1)) {
          if (value > 0) {
            textV = "+" + (value - 1);
            textColor = "#aaffaa";
          } else {
            textV = "" + value;
            textColor = "#ffaaaa";
          }
          textPos = this.unpolar(angle + this.halfSliceAngle, this.dialIncrementRadius, this.center.x, this.center.y);
          this.app.drawTextCentered(textV, textPos.x, textPos.y, this.fonts.increment, textColor, this.facingOutAngle(textPos.x, textPos.y));
        }
      }
      this.app.strokeCircle(this.center.x, this.center.y, this.dialRadius, "white", 4);
      estimatedHealth = dragPlayer.health;
      if (this.dragDelta > 1) {
        estimatedHealth += this.dragDelta - 1;
      } else if (this.dragDelta < 0) {
        estimatedHealth += this.dragDelta;
      }
      this.app.drawTextCentered(estimatedHealth, this.center.x, this.center.y, this.fonts.health, dragPlayer.color, dragPlayer.angle);
      this.app.strokeTextCentered(estimatedHealth, this.center.x, this.center.y, this.fonts.health, "white", 4, dragPlayer.angle);
    }
  };

  return CounterView;

})();

module.exports = CounterView;


},{}],3:[function(require,module,exports){
var BUTTON_HEIGHT, BUTTON_SEPARATOR, BUTTON_SPACING, FIRST_BUTTON_Y, LayoutView, buttonPos;

BUTTON_HEIGHT = 0.06;

FIRST_BUTTON_Y = 0.22;

BUTTON_SPACING = 0.08;

BUTTON_SEPARATOR = 0.03;

buttonPos = function(index) {
  var y;
  y = FIRST_BUTTON_Y + (BUTTON_SPACING * index);
  if (index > 3) {
    y += BUTTON_SEPARATOR;
  }
  if (index > 4) {
    y += BUTTON_SEPARATOR;
  }
  if (index > 6) {
    y += BUTTON_SEPARATOR;
  }
  return y;
};

LayoutView = (function() {
  function LayoutView(app, canvas) {
    var button, buttonFontHeight, buttonName, buttonWidth, buttonX, ref, titleFontHeight;
    this.app = app;
    this.canvas = canvas;
    this.buttons = {
      chooseLayout: {
        y: buttonPos(1),
        text: "Choose Layout",
        bgColor: "#555555",
        textColor: "#ffffff",
        click: this.chooseLayout.bind(this)
      },
      resetAllHealth: {
        y: buttonPos(2),
        text: "Reset All Health",
        bgColor: "#555555",
        textColor: "#ffffff",
        click: this.resetAllHealth.bind(this)
      },
      resume: {
        y: buttonPos(7),
        text: "Resume",
        bgColor: "#777777",
        textColor: "#ffffff",
        click: this.resume.bind(this)
      }
    };
    buttonWidth = this.canvas.width * 0.8;
    this.buttonHeight = this.canvas.height * BUTTON_HEIGHT;
    buttonX = (this.canvas.width - buttonWidth) / 2;
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      button.x = buttonX;
      button.y = this.canvas.height * button.y;
      button.w = buttonWidth;
      button.h = this.buttonHeight;
    }
    buttonFontHeight = Math.floor(this.buttonHeight * 0.4);
    this.buttonFont = this.app.registerFont("button", buttonFontHeight + "px saxMono, monospace");
    titleFontHeight = Math.floor(this.canvas.height * 0.1);
    this.titleFont = this.app.registerFont("button", titleFontHeight + "px saxMono, monospace");
    return;
  }

  LayoutView.prototype.draw = function() {
    var shadowOffset, x, y1, y2;
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "#333333");
    x = this.canvas.width / 2;
    shadowOffset = this.canvas.height * 0.01;
    y1 = this.canvas.height * 0.05;
    y2 = this.canvas.height * 0.15;
    this.app.drawTextCentered("LAYOUT", x + shadowOffset, y2 + shadowOffset, this.titleFont, "#000000");
    return this.app.drawTextCentered("LAYOUT", x, y2, this.titleFont, "#ffffff");
  };

  LayoutView.prototype.mousedown = function(x, y) {
    var button, buttonName, ref;
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      if ((y > button.y) && (y < (button.y + this.buttonHeight))) {
        button.click();
      }
    }
  };

  LayoutView.prototype.mousemove = function(x, y, buttons) {};

  LayoutView.prototype.mouseup = function() {};

  LayoutView.prototype.chooseLayout = function() {};

  LayoutView.prototype.resetAllHealth = function() {};

  LayoutView.prototype.resume = function() {
    return this.app.switchView("counter");
  };

  return LayoutView;

})();

module.exports = LayoutView;


},{}],4:[function(require,module,exports){
var BUTTON_HEIGHT, BUTTON_SEPARATOR, BUTTON_SPACING, FIRST_BUTTON_Y, MenuView, buttonPos;

BUTTON_HEIGHT = 0.06;

FIRST_BUTTON_Y = 0.22;

BUTTON_SPACING = 0.08;

BUTTON_SEPARATOR = 0.03;

buttonPos = function(index) {
  var y;
  y = FIRST_BUTTON_Y + (BUTTON_SPACING * index);
  if (index > 3) {
    y += BUTTON_SEPARATOR;
  }
  if (index > 4) {
    y += BUTTON_SEPARATOR;
  }
  if (index > 6) {
    y += BUTTON_SEPARATOR;
  }
  return y;
};

MenuView = (function() {
  function MenuView(app, canvas) {
    var button, buttonFontHeight, buttonName, buttonWidth, buttonX, ref, titleFontHeight;
    this.app = app;
    this.canvas = canvas;
    this.buttons = {
      chooseLayout: {
        y: buttonPos(1),
        text: "Choose Layout",
        bgColor: "#555555",
        textColor: "#ffffff",
        click: this.chooseLayout.bind(this)
      },
      resetAllHealth: {
        y: buttonPos(2),
        text: "Reset All Health",
        bgColor: "#555555",
        textColor: "#ffffff",
        click: this.resetAllHealth.bind(this)
      },
      resume: {
        y: buttonPos(7),
        text: "Resume",
        bgColor: "#777777",
        textColor: "#ffffff",
        click: this.resume.bind(this)
      }
    };
    buttonWidth = this.canvas.width * 0.8;
    this.buttonHeight = this.canvas.height * BUTTON_HEIGHT;
    buttonX = (this.canvas.width - buttonWidth) / 2;
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      button.x = buttonX;
      button.y = this.canvas.height * button.y;
      button.w = buttonWidth;
      button.h = this.buttonHeight;
    }
    buttonFontHeight = Math.floor(this.buttonHeight * 0.4);
    this.buttonFont = this.app.registerFont("button", buttonFontHeight + "px saxMono, monospace");
    titleFontHeight = Math.floor(this.canvas.height * 0.1);
    this.titleFont = this.app.registerFont("button", titleFontHeight + "px saxMono, monospace");
    return;
  }

  MenuView.prototype.draw = function() {
    var button, buttonName, ref, shadowOffset, x, y1, y2;
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "#333333");
    x = this.canvas.width / 2;
    shadowOffset = this.canvas.height * 0.01;
    y1 = this.canvas.height * 0.05;
    y2 = this.canvas.height * 0.15;
    this.app.drawTextCentered("MTG", x + shadowOffset, y2 + shadowOffset, this.titleFont, "#000000");
    this.app.drawTextCentered("MTG", x, y2, this.titleFont, "#ffffff");
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      this.app.drawRoundedRect(button.x + shadowOffset, button.y + shadowOffset, button.w, button.h, button.h * 0.3, "black", "black");
      this.app.drawRoundedRect(button.x, button.y, button.w, button.h, button.h * 0.3, button.bgColor, "#999999");
      this.app.drawTextCentered(button.text, button.x + (button.w / 2), button.y + (button.h / 2), this.buttonFont, button.textColor);
    }
    return this.app.drawVersion();
  };

  MenuView.prototype.mousedown = function(x, y) {
    var button, buttonName, ref;
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      if ((y > button.y) && (y < (button.y + this.buttonHeight))) {
        button.click();
      }
    }
  };

  MenuView.prototype.mousemove = function(x, y, buttons) {};

  MenuView.prototype.mouseup = function() {};

  MenuView.prototype.chooseLayout = function() {
    return this.app.switchView("layout");
  };

  MenuView.prototype.resetAllHealth = function() {};

  MenuView.prototype.resume = function() {
    return this.app.switchView("counter");
  };

  return MenuView;

})();

module.exports = MenuView;


},{}],5:[function(require,module,exports){
var App, init;

App = require('./App');

init = function() {
  var canvas, canvasRect;
  console.log("init");
  canvas = document.createElement("canvas");
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  document.body.insertBefore(canvas, document.body.childNodes[0]);
  canvasRect = canvas.getBoundingClientRect();
  window.app = new App(canvas);
  canvas.addEventListener("touchstart", function(e) {
    var x, y;
    e.preventDefault();
    x = e.touches[0].clientX - canvasRect.left;
    y = e.touches[0].clientY - canvasRect.top;
    return window.app.mousedown(x, y);
  });
  canvas.addEventListener("touchmove", function(e) {
    var x, y;
    e.preventDefault();
    x = e.touches[0].clientX - canvasRect.left;
    y = e.touches[0].clientY - canvasRect.top;
    return window.app.mousemove(x, y, 1);
  });
  canvas.addEventListener("touchend", function(e) {
    e.preventDefault();
    return window.app.mouseup();
  });
  canvas.addEventListener("mousedown", function(e) {
    var x, y;
    e.preventDefault();
    x = e.clientX - canvasRect.left;
    y = e.clientY - canvasRect.top;
    return window.app.mousedown(x, y);
  });
  canvas.addEventListener("mousemove", function(e) {
    var buttons, x, y;
    e.preventDefault();
    x = e.clientX - canvasRect.left;
    y = e.clientY - canvasRect.top;
    buttons = e.buttons;
    return window.app.mousemove(x, y, buttons);
  });
  return canvas.addEventListener("mouseup", function(e) {
    e.preventDefault();
    return window.app.mouseup();
  });
};

window.addEventListener('load', function(e) {
  return init();
}, false);


},{"./App":1}],6:[function(require,module,exports){
module.exports = "0.0.1";


},{}],7:[function(require,module,exports){
/* Font Face Observer v2.0.13 - © Bram Stein. License: BSD-3-Clause */(function(){function l(a,b){document.addEventListener?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function m(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):document.attachEvent("onreadystatechange",function k(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",k),a()})};function r(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
function t(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+b+";"}function y(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function z(a,b){function c(){var a=k;y(a)&&a.a.parentNode&&b(a.g)}var k=a;l(a.b,c);l(a.c,c);y(a)};function A(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var B=null,C=null,E=null,F=null;function G(){if(null===C)if(J()&&/Apple/.test(window.navigator.vendor)){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);C=!!a&&603>parseInt(a[1],10)}else C=!1;return C}function J(){null===F&&(F=!!document.fonts);return F}
function K(){if(null===E){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}E=""!==a.style.font}return E}function L(a,b){return[a.style,a.weight,K()?a.stretch:"","100px",b].join(" ")}
A.prototype.load=function(a,b){var c=this,k=a||"BESbswy",q=0,D=b||3E3,H=(new Date).getTime();return new Promise(function(a,b){if(J()&&!G()){var M=new Promise(function(a,b){function e(){(new Date).getTime()-H>=D?b():document.fonts.load(L(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},function(){b()})}e()}),N=new Promise(function(a,c){q=setTimeout(c,D)});Promise.race([N,M]).then(function(){clearTimeout(q);a(c)},function(){b(c)})}else m(function(){function u(){var b;if(b=-1!=
f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===B&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),B=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=B&&(f==v&&g==v&&h==v||f==w&&g==w&&h==w||f==x&&g==x&&h==x)),b=!b;b&&(d.parentNode&&d.parentNode.removeChild(d),clearTimeout(q),a(c))}function I(){if((new Date).getTime()-H>=D)d.parentNode&&d.parentNode.removeChild(d),b(c);else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,
g=n.a.offsetWidth,h=p.a.offsetWidth,u();q=setTimeout(I,50)}}var e=new r(k),n=new r(k),p=new r(k),f=-1,g=-1,h=-1,v=-1,w=-1,x=-1,d=document.createElement("div");d.dir="ltr";t(e,L(c,"sans-serif"));t(n,L(c,"serif"));t(p,L(c,"monospace"));d.appendChild(e.a);d.appendChild(n.a);d.appendChild(p.a);document.body.appendChild(d);v=e.a.offsetWidth;w=n.a.offsetWidth;x=p.a.offsetWidth;I();z(e,function(a){f=a;u()});t(e,L(c,'"'+c.family+'",sans-serif'));z(n,function(a){g=a;u()});t(n,L(c,'"'+c.family+'",serif'));
z(p,function(a){h=a;u()});t(p,L(c,'"'+c.family+'",monospace'))})})};"object"===typeof module?module.exports=A:(window.FontFaceObserver=A,window.FontFaceObserver.prototype.load=A.prototype.load);}());

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXENvdW50ZXJWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcTGF5b3V0Vmlldy5jb2ZmZWUiLCJnYW1lXFxzcmNcXE1lbnVWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcbWFpbi5jb2ZmZWUiLCJnYW1lXFxzcmNcXHZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVI7O0FBQ2QsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUjs7QUFFSjtFQUNTLGFBQUMsTUFBRDtJQUFDLElBQUMsQ0FBQSxTQUFEO0lBQ1osSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsSUFBbkI7SUFDUCxJQUFDLENBQUEsUUFBRCxDQUFVLFNBQVY7SUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGFBQVY7SUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTO0lBRVQsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQTVCO0lBQ3JCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxTQUFkLEVBQTRCLElBQUMsQ0FBQSxpQkFBRixHQUFvQix1QkFBL0M7SUFFZixJQUFDLENBQUEsb0JBQUQsR0FBd0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJ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QUMsZ0JBQVAsQ0FBd0IsV0FBeEIsRUFBcUMsU0FBQyxDQUFEO0FBQ25DLFFBQUE7SUFBQSxDQUFDLENBQUMsY0FBRixDQUFBO0lBQ0EsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO0lBQzNCLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztJQUMzQixPQUFBLEdBQVUsQ0FBQyxDQUFDO1dBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFYLENBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLE9BQTNCO0VBTG1DLENBQXJDO1NBT0EsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFNBQUMsQ0FBRDtJQUNqQyxDQUFDLENBQUMsY0FBRixDQUFBO1dBQ0EsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFYLENBQUE7RUFGaUMsQ0FBbkM7QUF2Q0s7O0FBMkNQLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxTQUFDLENBQUQ7U0FDNUIsSUFBQSxDQUFBO0FBRDRCLENBQWhDLEVBRUUsS0FGRjs7OztBQzdDQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0FqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRm9udEZhY2VPYnNlcnZlciA9IHJlcXVpcmUgJ2ZvbnRmYWNlb2JzZXJ2ZXInXHJcblxyXG5NZW51VmlldyA9IHJlcXVpcmUgJy4vTWVudVZpZXcnXHJcbkNvdW50ZXJWaWV3ID0gcmVxdWlyZSAnLi9Db3VudGVyVmlldydcclxuTGF5b3V0VmlldyA9IHJlcXVpcmUgJy4vTGF5b3V0VmlldydcclxudmVyc2lvbiA9IHJlcXVpcmUgJy4vdmVyc2lvbidcclxuXHJcbmNsYXNzIEFwcFxyXG4gIGNvbnN0cnVjdG9yOiAoQGNhbnZhcykgLT5cclxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgQGxvYWRGb250KFwic2F4TW9ub1wiKVxyXG4gICAgQGxvYWRGb250KFwiSW5zdHJ1Y3Rpb25cIilcclxuICAgIEBmb250cyA9IHt9XHJcblxyXG4gICAgQHZlcnNpb25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDIpXHJcbiAgICBAdmVyc2lvbkZvbnQgPSBAcmVnaXN0ZXJGb250KFwidmVyc2lvblwiLCBcIiN7QHZlcnNpb25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBnZW5lcmF0aW5nRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA0KVxyXG4gICAgQGdlbmVyYXRpbmdGb250ID0gQHJlZ2lzdGVyRm9udChcImdlbmVyYXRpbmdcIiwgXCIje0BnZW5lcmF0aW5nRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAdmlld3MgPVxyXG4gICAgICBtZW51OiBuZXcgTWVudVZpZXcodGhpcywgQGNhbnZhcylcclxuICAgICAgY291bnRlcjogbmV3IENvdW50ZXJWaWV3KHRoaXMsIEBjYW52YXMpXHJcbiAgICBAdmlld3MubGF5b3V0ID0gbmV3IExheW91dFZpZXcodGhpcywgQGNhbnZhcywgQHZpZXdzLmNvdW50ZXIpXHJcbiAgICBAc3dpdGNoVmlldyhcImxheW91dFwiKVxyXG5cclxuICBtZWFzdXJlRm9udHM6IC0+XHJcbiAgICBmb3IgZm9udE5hbWUsIGYgb2YgQGZvbnRzXHJcbiAgICAgIEBjdHguZm9udCA9IGYuc3R5bGVcclxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcclxuICAgICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICAgIGYuaGVpZ2h0ID0gTWF0aC5mbG9vcihAY3R4Lm1lYXN1cmVUZXh0KFwibVwiKS53aWR0aCAqIDEuMSkgIyBiZXN0IGhhY2sgZXZlclxyXG4gICAgICBjb25zb2xlLmxvZyBcIkZvbnQgI3tmb250TmFtZX0gbWVhc3VyZWQgYXQgI3tmLmhlaWdodH0gcGl4ZWxzXCJcclxuICAgIHJldHVyblxyXG5cclxuICByZWdpc3RlckZvbnQ6IChuYW1lLCBzdHlsZSkgLT5cclxuICAgIGZvbnQgPVxyXG4gICAgICBuYW1lOiBuYW1lXHJcbiAgICAgIHN0eWxlOiBzdHlsZVxyXG4gICAgICBoZWlnaHQ6IDBcclxuICAgIEBmb250c1tuYW1lXSA9IGZvbnRcclxuICAgIEBtZWFzdXJlRm9udHMoKVxyXG4gICAgcmV0dXJuIGZvbnRcclxuXHJcbiAgbG9hZEZvbnQ6IChmb250TmFtZSkgLT5cclxuICAgIGZvbnQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihmb250TmFtZSlcclxuICAgIGZvbnQubG9hZCgpLnRoZW4gPT5cclxuICAgICAgY29uc29sZS5sb2coXCIje2ZvbnROYW1lfSBsb2FkZWQsIHJlZHJhd2luZy4uLlwiKVxyXG4gICAgICBAbWVhc3VyZUZvbnRzKClcclxuICAgICAgQGRyYXcoKVxyXG5cclxuICBzd2l0Y2hWaWV3OiAodmlldykgLT5cclxuICAgIEB2aWV3ID0gQHZpZXdzW3ZpZXddXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcImFwcC5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcclxuXHJcbiAgICAjIEBkcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjNDQ0NDQ0XCIpXHJcbiAgICAjIEBkcmF3VGV4dENlbnRlcmVkKFwiR2VuZXJhdGluZywgcGxlYXNlIHdhaXQuLi5cIiwgQGNhbnZhcy53aWR0aCAvIDIsIEBjYW52YXMuaGVpZ2h0IC8gMiwgQGdlbmVyYXRpbmdGb250LCBcIiNmZmZmZmZcIilcclxuXHJcbiAgICAjIHdpbmRvdy5zZXRUaW1lb3V0ID0+XHJcbiAgICAjIEB2aWV3cy5zdWRva3UubmV3R2FtZShkaWZmaWN1bHR5KVxyXG4gICAgIyBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG4gICAgIyAsIDBcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICAjIEB2aWV3cy5zdWRva3UucmVzZXQoKVxyXG4gICAgIyBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICAjIHJldHVybiBAdmlld3Muc3Vkb2t1LmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgICMgcmV0dXJuIEB2aWV3cy5zdWRva3UuZXhwb3J0KClcclxuXHJcbiAgaG9sZUNvdW50OiAtPlxyXG4gICAgIyByZXR1cm4gQHZpZXdzLnN1ZG9rdS5ob2xlQ291bnQoKVxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQHZpZXcuZHJhdygpXHJcblxyXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XHJcbiAgICBAdmlldy5tb3VzZWRvd24oeCwgeSlcclxuXHJcbiAgbW91c2Vtb3ZlOiAoeCwgeSwgYnV0dG9ucykgLT5cclxuICAgIEB2aWV3Lm1vdXNlbW92ZSh4LCB5LCBidXR0b25zKVxyXG5cclxuICBtb3VzZXVwOiAoeCwgeSkgLT5cclxuICAgIEB2aWV3Lm1vdXNldXAoeCwgeSlcclxuXHJcbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5maWxsKClcclxuXHJcbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxyXG4gICAgQGN0eC5yb3VuZFJlY3QoeCwgeSwgdywgaCwgcilcclxuICAgIGlmIGZpbGxDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXHJcbiAgICAgIEBjdHguZmlsbCgpXHJcbiAgICBpZiBzdHJva2VDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxyXG4gICAgICBAY3R4LnN0cm9rZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1JlY3Q6ICh4LCB5LCB3LCBoLCBjb2xvciwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3TGluZTogKHgxLCB5MSwgeDIsIHkyLCBjb2xvciA9IFwiYmxhY2tcIiwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcclxuICAgIEBjdHgubGluZVRvKHgyLCB5MilcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd0FyYzogKHgsIHksIHIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBjb2xvcikgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubW92ZVRvKHgsIHkpXHJcbiAgICBAY3R4LmFyYyh4LCB5LCByLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSlcclxuICAgIEBjdHguY2xvc2VQYXRoKClcclxuICAgIEBjdHguZmlsbCgpXHJcblxyXG4gIHN0cm9rZUNpcmNsZTogKHgsIHksIHIsIGNvbG9yLCBsaW5lV2lkdGgpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4LmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJICogMilcclxuICAgIEBjdHguY2xvc2VQYXRoKClcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd1RleHRDZW50ZXJlZDogKHRleHQsIGN4LCBjeSwgZm9udCwgY29sb3IsIHJvdCkgLT5cclxuICAgIEBjdHguc2F2ZSgpXHJcbiAgICBAY3R4LnRyYW5zbGF0ZShjeCwgY3kpXHJcbiAgICBAY3R4LnJvdGF0ZShyb3QpXHJcbiAgICBAY3R4LmZvbnQgPSBmb250LnN0eWxlXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcblxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIDAsIChmb250LmhlaWdodCAvIDIpKVxyXG5cclxuICAgIEBjdHgucmVzdG9yZSgpXHJcblxyXG4gIHN0cm9rZVRleHRDZW50ZXJlZDogKHRleHQsIGN4LCBjeSwgZm9udCwgY29sb3IsIGxpbmVXaWR0aCwgcm90KSAtPlxyXG4gICAgQGN0eC5zYXZlKClcclxuICAgIEBjdHgudHJhbnNsYXRlKGN4LCBjeSlcclxuICAgIEBjdHgucm90YXRlKHJvdClcclxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxyXG4gICAgQGN0eC5zdHJva2VUZXh0KHRleHQsIDAsIChmb250LmhlaWdodCAvIDIpKVxyXG4gICAgQGN0eC5yZXN0b3JlKClcclxuXHJcbiAgZHJhd0xvd2VyTGVmdDogKHRleHQsIGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCJcclxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgMCwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3VmVyc2lvbjogKGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KFwidiN7dmVyc2lvbn1cIiwgQGNhbnZhcy53aWR0aCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMiksIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUucm91bmRSZWN0ID0gKHgsIHksIHcsIGgsIHIpIC0+XHJcbiAgaWYgKHcgPCAyICogcikgdGhlbiByID0gdyAvIDJcclxuICBpZiAoaCA8IDIgKiByKSB0aGVuIHIgPSBoIC8gMlxyXG4gIEBiZWdpblBhdGgoKVxyXG4gIEBtb3ZlVG8oeCtyLCB5KVxyXG4gIEBhcmNUbyh4K3csIHksICAgeCt3LCB5K2gsIHIpXHJcbiAgQGFyY1RvKHgrdywgeStoLCB4LCAgIHkraCwgcilcclxuICBAYXJjVG8oeCwgICB5K2gsIHgsICAgeSwgICByKVxyXG4gIEBhcmNUbyh4LCAgIHksICAgeCt3LCB5LCAgIHIpXHJcbiAgQGNsb3NlUGF0aCgpXHJcbiAgcmV0dXJuIHRoaXNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwXHJcbiIsIkNvbG9yID1cclxuICBiYWNrZ3JvdW5kOiBcIiMzMzMzMzNcIlxyXG4gIGRpYWw6IFwiIzMzMzMzM1wiXHJcbiAgZGlhbEhpZ2hsaWdodDogXCIjNjY2NjY2XCJcclxuICBoZWFsdGg6IFwid2hpdGVcIlxyXG4gIGNoYW5naW5nSGVhbHRoOiBcInJlZFwiXHJcbiAgYWRkVGV4dDogXCIjMDBmZjAwXCJcclxuICBzdWJ0cmFjdFRleHQ6IFwiI2ZmMDAwMFwiXHJcbiAgbWVudTogXCIjZmZmZmZmXCJcclxuXHJcblBsYXllckNvbG9ycyA9IFtcclxuICBcIiNmZmFhYWFcIlxyXG4gIFwiI2FhZmZhYVwiXHJcbiAgXCIjYWFhYWZmXCJcclxuICBcIiNmZmZmYWFcIlxyXG4gIFwiI2ZmYWFmZlwiXHJcbiAgXCIjYWFmZmZmXCJcclxuXVxyXG5cclxuVFdPX1BJID0gTWF0aC5QSSAqIDJcclxuXHJcbmNsb25lID0gKG9iaikgLT5cclxuICAjIFRPRE86IGZpbmQgc29tZXRoaW5nIGJldHRlcj9cclxuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKVxyXG5cclxuY2xhc3MgQ291bnRlclZpZXdcclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEluaXRcclxuXHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJjYW52YXMgc2l6ZSAje0BjYW52YXMud2lkdGh9eCN7QGNhbnZhcy5oZWlnaHR9XCJcclxuXHJcbiAgICAjIGluaXQgZm9udHNcclxuICAgIGhlYWx0aEZvbnRQaXhlbHMgPSBNYXRoLmZsb29yKEBjYW52YXMud2lkdGggKiAwLjMwKVxyXG4gICAgaW5jcmVtZW50Rm9udFBpeGVscyA9IE1hdGguZmxvb3IoQGNhbnZhcy53aWR0aCAqIDAuMDUpXHJcbiAgICBtZW51Rm9udFBpeGVscyA9IE1hdGguZmxvb3IoQGNhbnZhcy53aWR0aCAqIDAuMDUpXHJcbiAgICBAZm9udHMgPVxyXG4gICAgICBoZWFsdGg6ICAgIEBhcHAucmVnaXN0ZXJGb250KFwiaGVhbHRoXCIsICAgIFwiI3toZWFsdGhGb250UGl4ZWxzfXB4IEluc3RydWN0aW9uLCBtb25vc3BhY2VcIilcclxuICAgICAgaW5jcmVtZW50OiBAYXBwLnJlZ2lzdGVyRm9udChcImluY3JlbWVudFwiLCBcIiN7aW5jcmVtZW50Rm9udFBpeGVsc31weCBJbnN0cnVjdGlvbiwgbW9ub3NwYWNlXCIpXHJcbiAgICAgIG1lbnU6ICAgICAgQGFwcC5yZWdpc3RlckZvbnQoXCJpbmNyZW1lbnRcIiwgXCIje21lbnVGb250UGl4ZWxzfXB4IEluc3RydWN0aW9uLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAY2VudGVyID1cclxuICAgICAgeDogQGNhbnZhcy53aWR0aCAvIDJcclxuICAgICAgeTogQGNhbnZhcy5oZWlnaHQgLyAyXHJcblxyXG4gICAgQHNsaWNlQ291bnQgPSAyMFxyXG4gICAgQGhhbGZTbGljZUNvdW50ID0gTWF0aC5mbG9vcihAc2xpY2VDb3VudCAvIDIpXHJcbiAgICBAc2xpY2VBbmdsZSA9IFRXT19QSSAvIEBzbGljZUNvdW50XHJcbiAgICBAaGFsZlNsaWNlQW5nbGUgPSBAc2xpY2VBbmdsZSAvIDJcclxuXHJcbiAgICBAZGlhbFJhZGl1cyA9IEBjZW50ZXIueCAqIDAuOFxyXG4gICAgQGRpYWxJbmNyZW1lbnRSYWRpdXMgPSBAY2VudGVyLnggKiAwLjdcclxuICAgIEBtZW51UmFkaXVzID0gQGNlbnRlci54ICogMC4xXHJcblxyXG4gICAgQGxheW91dHMgPSBbXVxyXG5cclxuICAgIGNSYWRpdXM2ID0gQGNlbnRlci54ICogMC43XHJcbiAgICBmUmFkaXVzNiA9IEBjZW50ZXIueCAqIDEuMVxyXG4gICAgQGxheW91dHMucHVzaCB7XHJcbiAgICAgIG5hbWU6IFwiQ29tbWFuZGVyIDZQXCJcclxuICAgICAgcGxheWVyczogW1xyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCAyLCBmUmFkaXVzNiwgNDApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDYsIGZSYWRpdXM2LCA0MClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1syXSwgOSwgY1JhZGl1czYsIDQwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzNdLCAxMiwgZlJhZGl1czYsIDQwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzRdLCAxNiwgZlJhZGl1czYsIDQwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzVdLCAxOSwgY1JhZGl1czYsIDQwKVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgQGNob29zZUxheW91dCgwKVxyXG4gICAgQG9uRHJhZ1Jlc2V0KClcclxuICAgIEBkcmF3KClcclxuXHJcbiAgY2hvb3NlTGF5b3V0OiAobGF5b3V0KSAtPlxyXG4gICAgQHBsYXllcnMgPSBjbG9uZShAbGF5b3V0c1tsYXlvdXRdLnBsYXllcnMpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cclxuICAgICMgcmV0dXJuIEBjb3VudGVyLmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIHJldHVybiBcIlwiICNAY291bnRlci5leHBvcnQoKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgZmFjaW5nT3V0QW5nbGU6ICh4LCB5KSAtPlxyXG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSAtIEBjZW50ZXIueSwgeCAtIEBjZW50ZXIueCkgLSAoTWF0aC5QSSAvIDIpXHJcblxyXG4gIHVucG9sYXI6IChhbmdsZSwgciwgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwKSAtPlxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogb2Zmc2V0WCArIChNYXRoLmNvcyhhbmdsZSkgKiByKVxyXG4gICAgICB5OiBvZmZzZXRZICsgKE1hdGguc2luKGFuZ2xlKSAqIHIpXHJcbiAgICB9XHJcblxyXG4gIHBvc1RvU2xpY2U6ICh4LCB5KSAtPlxyXG4gICAgcG9zQW5nbGUgPSBNYXRoLmF0YW4yKHkgLSBAY2VudGVyLnksIHggLSBAY2VudGVyLngpXHJcbiAgICBpZiBwb3NBbmdsZSA8IDBcclxuICAgICAgcG9zQW5nbGUgKz0gTWF0aC5QSSAqIDJcclxuICAgIGFuZ2xlID0gMFxyXG4gICAgZm9yIHNsaWNlIGluIFswLi4uQHNsaWNlQ291bnRdXHJcbiAgICAgIGlmIChwb3NBbmdsZSA+PSBhbmdsZSkgYW5kIChwb3NBbmdsZSA8IChhbmdsZSArIEBzbGljZUFuZ2xlKSlcclxuICAgICAgICByZXR1cm4gc2xpY2VcclxuICAgICAgYW5nbGUgKz0gQHNsaWNlQW5nbGVcclxuICAgIHJldHVybiAwXHJcblxyXG4gIHBsYXllckxheW91dDogKGNvbG9yLCBzbGljZSwgcmFkaXVzLCBoZWFsdGgpIC0+XHJcbiAgICBjID0gQHVucG9sYXIoKChzbGljZSArIDEpICUgQHNsaWNlQ291bnQpICogQHNsaWNlQW5nbGUsIHJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXHJcbiAgICBwbGF5ZXIgPVxyXG4gICAgICB4OiBjLnhcclxuICAgICAgeTogYy55XHJcbiAgICAgIGFuZ2xlOiBAZmFjaW5nT3V0QW5nbGUoYy54LCBjLnkpXHJcbiAgICAgIHNsaWNlOiBzbGljZVxyXG4gICAgICBoZWFsdGg6IGhlYWx0aFxyXG4gICAgICBjb2xvcjogY29sb3JcclxuICAgIHJldHVybiBwbGF5ZXJcclxuXHJcbiAgZGlzdGFuY2U6ICh4MCwgeTAsIHgxLCB5MSkgLT5cclxuICAgIHhkID0geDEgLSB4MFxyXG4gICAgeWQgPSB5MSAtIHkwXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ZCp4ZCkgKyAoeWQqeWQpKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgb25EcmFnUG9zOiAoeCwgeSkgLT5cclxuICAgIEBkcmFnZ2luZyA9IHRydWVcclxuXHJcbiAgICBpZiBAZHJhZ1NsaWNlID09IC0xXHJcbiAgICAgICMgRmlndXJlIG91dCB3aGljaCBwbGF5ZXIgd2Ugc3RhcnRlZCBvblxyXG4gICAgICBjbG9zZXN0SW5kZXggPSAwXHJcbiAgICAgIGNsb3Nlc3RQb3NpdGlvbiA9IEBjYW52YXMuaGVpZ2h0ICogMTAwMFxyXG4gICAgICBmb3IgcGxheWVyLCBpbmRleCBpbiBAcGxheWVyc1xyXG4gICAgICAgIGRpc3QgPSBAZGlzdGFuY2UocGxheWVyLngsIHBsYXllci55LCB4LCB5KVxyXG4gICAgICAgIGlmIGNsb3Nlc3RQb3NpdGlvbiA+IGRpc3RcclxuICAgICAgICAgIGNsb3Nlc3RQb3NpdGlvbiA9IGRpc3RcclxuICAgICAgICAgIGNsb3Nlc3RJbmRleCA9IGluZGV4XHJcbiAgICAgIEBkcmFnUGxheWVySW5kZXggPSBjbG9zZXN0SW5kZXhcclxuXHJcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAjIFRPRE86IGRpc3RyaWJ1dGUgYSBidW5jaCBvZiBtYXRoIG91dFxyXG4gICAgICBAZHJhZ1NsaWNlID0gQHBvc1RvU2xpY2UoeCwgeSlcclxuXHJcbiAgICAgIEBkcmFnRGVsdGEgPSBAZHJhZ1NsaWNlIC0gQHBsYXllcnNbQGRyYWdQbGF5ZXJJbmRleF0uc2xpY2VcclxuICAgICAgaWYgQGRyYWdEZWx0YSA+IEBoYWxmU2xpY2VDb3VudFxyXG4gICAgICAgIEBkcmFnRGVsdGEgLT0gQHNsaWNlQ291bnRcclxuICAgICAgaWYgQGRyYWdEZWx0YSA8IC1AaGFsZlNsaWNlQ291bnRcclxuICAgICAgICBAZHJhZ0RlbHRhICs9IEBzbGljZUNvdW50XHJcbiAgICAgIGNvbnNvbGUubG9nIFwiQGRyYWdEZWx0YSBzdGFydGluZyBhdCAje0BkcmFnRGVsdGF9XCJcclxuICAgIGVsc2VcclxuICAgICAgbmV3RHJhZ1NsaWNlID0gQHBvc1RvU2xpY2UoeCwgeSlcclxuICAgICAgaWYgQGRyYWdTbGljZSAhPSBuZXdEcmFnU2xpY2VcclxuICAgICAgICBzbGljZU9mZnNldCA9IG5ld0RyYWdTbGljZSAtIEBkcmFnU2xpY2VcclxuICAgICAgICBpZiBzbGljZU9mZnNldCA+IEBoYWxmU2xpY2VDb3VudFxyXG4gICAgICAgICAgc2xpY2VPZmZzZXQgLT0gQHNsaWNlQ291bnRcclxuICAgICAgICBpZiBzbGljZU9mZnNldCA8IC1AaGFsZlNsaWNlQ291bnRcclxuICAgICAgICAgIHNsaWNlT2Zmc2V0ICs9IEBzbGljZUNvdW50XHJcbiAgICAgICAgQGRyYWdEZWx0YSArPSBzbGljZU9mZnNldFxyXG4gICAgICAgIGNvbnNvbGUubG9nIFwiQGRyYWdEZWx0YSBub3cgYXQgI3tAZHJhZ0RlbHRhfVwiXHJcblxyXG4gICAgICAgIEBkcmFnU2xpY2UgPSBuZXdEcmFnU2xpY2VcclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBAZHJhZ1ggPSB4XHJcbiAgICBAZHJhZ1kgPSB5XHJcbiAgICAjIEBkcmFnQW5nbGUgPSBNYXRoLmF0YW4yKHkgLSBAY2VudGVyLnksIHggLSBAY2VudGVyLngpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgb25EcmFnUmVzZXQ6IC0+XHJcbiAgICBAZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgQGRyYWdQbGF5ZXJJbmRleCA9IC0xXHJcbiAgICBAZHJhZ1ggPSAtMVxyXG4gICAgQGRyYWdZID0gLTFcclxuICAgIEBkcmFnU2xpY2UgPSAtMVxyXG4gICAgQGRyYWdEZWx0YSA9IDBcclxuXHJcbiAgbW91c2Vkb3duOiAoeCwgeSkgLT5cclxuICAgIGRpc3RhbmNlRnJvbUNlbnRlciA9IEBkaXN0YW5jZSh4LCB5LCBAY2VudGVyLngsIEBjZW50ZXIueSlcclxuICAgIGlmIGRpc3RhbmNlRnJvbUNlbnRlciA8IEBtZW51UmFkaXVzXHJcbiAgICAgIEBhcHAuc3dpdGNoVmlldyhcIm1lbnVcIilcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgIyBjb25zb2xlLmxvZyBcIm1vdXNlZG93biAje3h9LCAje3l9XCJcclxuICAgIEBvbkRyYWdQb3MoeCwgeSlcclxuICAgIEBkcmF3KClcclxuXHJcbiAgbW91c2Vtb3ZlOiAoeCwgeSwgYnV0dG9ucykgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJtb3VzZWRvd24gI3t4fSwgI3t5fVwiXHJcbiAgICBpZiBidXR0b25zID09IDFcclxuICAgICAgQG9uRHJhZ1Bvcyh4LCB5KVxyXG4gICAgICBAZHJhdygpXHJcblxyXG4gIG1vdXNldXA6IC0+XHJcbiAgICBpZiBAZHJhZ2dpbmdcclxuICAgICAgZHJhZ1BsYXllciA9IEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdXHJcbiAgICAgIG5ld0hlYWx0aCA9IGRyYWdQbGF5ZXIuaGVhbHRoXHJcbiAgICAgIGlmIEBkcmFnRGVsdGEgPiAxXHJcbiAgICAgICAgbmV3SGVhbHRoICs9IEBkcmFnRGVsdGEgLSAxXHJcbiAgICAgIGVsc2UgaWYgQGRyYWdEZWx0YSA8IDBcclxuICAgICAgICBuZXdIZWFsdGggKz0gQGRyYWdEZWx0YVxyXG4gICAgICBkcmFnUGxheWVyLmhlYWx0aCA9IG5ld0hlYWx0aFxyXG5cclxuICAgIEBvbkRyYWdSZXNldCgpXHJcbiAgICBAZHJhdygpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBzbGljZU9mZnNldFRvRGVsdGE6IChvZmZzZXQpIC0+XHJcbiAgICBpZiBvZmZzZXQgPT0gMFxyXG4gICAgICByZXR1cm4gMFxyXG5cclxuICAgIGlmIG9mZnNldCA8PSBAaGFsZlNsaWNlQ291bnRcclxuICAgICAgIyB0cnlpbmcgdG8gaW5jcmVtZW50XHJcbiAgICAgIHJldHVybiBvZmZzZXRcclxuICAgIGVsc2VcclxuICAgICAgIyB0cnlpbmcgdG8gZGVjcmVtZW50XHJcbiAgICAgIHJldHVybiAtMSAqIChAc2xpY2VDb3VudCAtIG9mZnNldClcclxuXHJcbiAgZHJhdzogLT5cclxuICAgIGNvbnNvbGUubG9nIFwiZHJhdygpXCJcclxuXHJcbiAgICAjIENsZWFyIHNjcmVlbiB0byBibGFja1xyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgQ29sb3IuYmFja2dyb3VuZClcclxuICAgICMgQGFwcC5kcmF3UmVjdChAY2VudGVyLngsIEBjZW50ZXIueSwgMSwgMSwgXCJ3aGl0ZVwiLCAxKSAjIGRlYnVnIGNlbnRlciBkb3RcclxuXHJcbiAgICBAYXBwLnN0cm9rZUNpcmNsZShAY2VudGVyLngsIEBjZW50ZXIueSwgQG1lbnVSYWRpdXMsIFwid2hpdGVcIiwgNClcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIk1cIiwgQGNlbnRlci54LCBAY2VudGVyLnksIEBmb250cy5tZW51LCBDb2xvci5tZW51LCAwKVxyXG5cclxuICAgIGZvciBwbGF5ZXIsIGluZGV4IGluIEBwbGF5ZXJzXHJcbiAgICAgIGNvbG9yID0gQ29sb3IuaGVhbHRoXHJcbiAgICAgIGlmIEBkcmFnZ2luZyBhbmQgKGluZGV4ID09IEBkcmFnUGxheWVySW5kZXgpXHJcbiAgICAgICAgY29sb3IgPSBDb2xvci5jaGFuZ2luZ0hlYWx0aFxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoICBTdHJpbmcocGxheWVyLmhlYWx0aCksIHBsYXllci54LCBwbGF5ZXIueSwgQGZvbnRzLmhlYWx0aCwgcGxheWVyLmNvbG9yLCBwbGF5ZXIuYW5nbGUpXHJcbiAgICAgIEBhcHAuc3Ryb2tlVGV4dENlbnRlcmVkKFN0cmluZyhwbGF5ZXIuaGVhbHRoKSwgcGxheWVyLngsIHBsYXllci55LCBAZm9udHMuaGVhbHRoLCBcIndoaXRlXCIsIDQsIHBsYXllci5hbmdsZSlcclxuXHJcbiAgICBpZiBAZHJhZ2dpbmdcclxuICAgICAgZHJhZ1BsYXllciA9IEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdXHJcblxyXG4gICAgICBAYXBwLmRyYXdBcmMoQGNlbnRlci54LCBAY2VudGVyLnksIEBkaWFsUmFkaXVzLCAwLCBUV09fUEksIENvbG9yLmRpYWwpXHJcblxyXG4gICAgICBmb3IgaSBpbiBbMC4uLkBoYWxmU2xpY2VDb3VudCsxXVxyXG4gICAgICAgIHNsaWNlID0gKEBkcmFnU2xpY2UgKyBpKSAlIEBzbGljZUNvdW50XHJcbiAgICAgICAgYW5nbGUgPSBzbGljZSAqIEBzbGljZUFuZ2xlXHJcbiAgICAgICAgdmFsdWUgPSBAZHJhZ0RlbHRhICsgaVxyXG4gICAgICAgIGlmIHNsaWNlID09IEBkcmFnU2xpY2VcclxuICAgICAgICAgIEBhcHAuZHJhd0FyYyhAY2VudGVyLngsIEBjZW50ZXIueSwgQGRpYWxSYWRpdXMsIGFuZ2xlLCBhbmdsZSArIEBzbGljZUFuZ2xlLCBDb2xvci5kaWFsSGlnaGxpZ2h0KVxyXG4gICAgICAgIGlmICh2YWx1ZSAhPSAwKSBhbmQgKHZhbHVlICE9IDEpXHJcbiAgICAgICAgICBpZiB2YWx1ZSA+IDBcclxuICAgICAgICAgICAgdGV4dFYgPSBcIisje3ZhbHVlIC0gMX1cIlxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5hZGRUZXh0XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRleHRWID0gXCIje3ZhbHVlfVwiXHJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnN1YnRyYWN0VGV4dFxyXG4gICAgICAgICAgdGV4dFBvcyA9IEB1bnBvbGFyKGFuZ2xlICsgQGhhbGZTbGljZUFuZ2xlLCBAZGlhbEluY3JlbWVudFJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXHJcbiAgICAgICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQodGV4dFYsIHRleHRQb3MueCwgdGV4dFBvcy55LCBAZm9udHMuaW5jcmVtZW50LCB0ZXh0Q29sb3IsIEBmYWNpbmdPdXRBbmdsZSh0ZXh0UG9zLngsIHRleHRQb3MueSkpXHJcblxyXG4gICAgICBmb3IgaSBpbiBbMS4uLkBoYWxmU2xpY2VDb3VudF1cclxuICAgICAgICBzbGljZSA9IChAc2xpY2VDb3VudCArIEBkcmFnU2xpY2UgLSBpKSAlIEBzbGljZUNvdW50XHJcbiAgICAgICAgYW5nbGUgPSBzbGljZSAqIEBzbGljZUFuZ2xlXHJcbiAgICAgICAgdmFsdWUgPSBAZHJhZ0RlbHRhIC0gaVxyXG4gICAgICAgIGlmICh2YWx1ZSAhPSAwKSBhbmQgKHZhbHVlICE9IDEpXHJcbiAgICAgICAgICBpZiB2YWx1ZSA+IDBcclxuICAgICAgICAgICAgdGV4dFYgPSBcIisje3ZhbHVlIC0gMX1cIlxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBcIiNhYWZmYWFcIlxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0ZXh0ViA9IFwiI3t2YWx1ZX1cIlxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBcIiNmZmFhYWFcIlxyXG4gICAgICAgICAgdGV4dFBvcyA9IEB1bnBvbGFyKGFuZ2xlICsgQGhhbGZTbGljZUFuZ2xlLCBAZGlhbEluY3JlbWVudFJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXHJcbiAgICAgICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQodGV4dFYsIHRleHRQb3MueCwgdGV4dFBvcy55LCBAZm9udHMuaW5jcmVtZW50LCB0ZXh0Q29sb3IsIEBmYWNpbmdPdXRBbmdsZSh0ZXh0UG9zLngsIHRleHRQb3MueSkpXHJcblxyXG4gICAgICBAYXBwLnN0cm9rZUNpcmNsZShAY2VudGVyLngsIEBjZW50ZXIueSwgQGRpYWxSYWRpdXMsIFwid2hpdGVcIiwgNClcclxuXHJcbiAgICAgIGVzdGltYXRlZEhlYWx0aCA9IGRyYWdQbGF5ZXIuaGVhbHRoXHJcbiAgICAgIGlmIEBkcmFnRGVsdGEgPiAxXHJcbiAgICAgICAgZXN0aW1hdGVkSGVhbHRoICs9IEBkcmFnRGVsdGEgLSAxXHJcbiAgICAgIGVsc2UgaWYgQGRyYWdEZWx0YSA8IDBcclxuICAgICAgICBlc3RpbWF0ZWRIZWFsdGggKz0gQGRyYWdEZWx0YVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoICBlc3RpbWF0ZWRIZWFsdGgsIEBjZW50ZXIueCwgQGNlbnRlci55LCBAZm9udHMuaGVhbHRoLCBkcmFnUGxheWVyLmNvbG9yLCBkcmFnUGxheWVyLmFuZ2xlKVxyXG4gICAgICBAYXBwLnN0cm9rZVRleHRDZW50ZXJlZChlc3RpbWF0ZWRIZWFsdGgsIEBjZW50ZXIueCwgQGNlbnRlci55LCBAZm9udHMuaGVhbHRoLCBcIndoaXRlXCIsIDQsIGRyYWdQbGF5ZXIuYW5nbGUpXHJcblxyXG4gICAgcmV0dXJuXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb3VudGVyVmlld1xyXG4iLCJCVVRUT05fSEVJR0hUID0gMC4wNlxyXG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcclxuQlVUVE9OX1NQQUNJTkcgPSAwLjA4XHJcbkJVVFRPTl9TRVBBUkFUT1IgPSAwLjAzXHJcblxyXG5idXR0b25Qb3MgPSAoaW5kZXgpIC0+XHJcbiAgeSA9IEZJUlNUX0JVVFRPTl9ZICsgKEJVVFRPTl9TUEFDSU5HICogaW5kZXgpXHJcbiAgaWYgaW5kZXggPiAzXHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDRcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNlxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgcmV0dXJuIHlcclxuXHJcbmNsYXNzIExheW91dFZpZXdcclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XHJcbiAgICBAYnV0dG9ucyA9XHJcbiAgICAgIGNob29zZUxheW91dDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMSlcclxuICAgICAgICB0ZXh0OiBcIkNob29zZSBMYXlvdXRcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzU1NTU1NVwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAY2hvb3NlTGF5b3V0LmJpbmQodGhpcylcclxuICAgICAgcmVzZXRBbGxIZWFsdGg6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDIpXHJcbiAgICAgICAgdGV4dDogXCJSZXNldCBBbGwgSGVhbHRoXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM1NTU1NTVcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc2V0QWxsSGVhbHRoLmJpbmQodGhpcylcclxuICAgICAgcmVzdW1lOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg3KVxyXG4gICAgICAgIHRleHQ6IFwiUmVzdW1lXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3NzdcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc3VtZS5iaW5kKHRoaXMpXHJcblxyXG4gICAgYnV0dG9uV2lkdGggPSBAY2FudmFzLndpZHRoICogMC44XHJcbiAgICBAYnV0dG9uSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgKiBCVVRUT05fSEVJR0hUXHJcbiAgICBidXR0b25YID0gKEBjYW52YXMud2lkdGggLSBidXR0b25XaWR0aCkgLyAyXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGJ1dHRvbi54ID0gYnV0dG9uWFxyXG4gICAgICBidXR0b24ueSA9IEBjYW52YXMuaGVpZ2h0ICogYnV0dG9uLnlcclxuICAgICAgYnV0dG9uLncgPSBidXR0b25XaWR0aFxyXG4gICAgICBidXR0b24uaCA9IEBidXR0b25IZWlnaHRcclxuXHJcbiAgICBidXR0b25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAYnV0dG9uSGVpZ2h0ICogMC40KVxyXG4gICAgQGJ1dHRvbkZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7YnV0dG9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjEpXHJcbiAgICBAdGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3RpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjMzMzMzMzXCIpXHJcblxyXG4gICAgeCA9IEBjYW52YXMud2lkdGggLyAyXHJcbiAgICBzaGFkb3dPZmZzZXQgPSBAY2FudmFzLmhlaWdodCAqIDAuMDFcclxuXHJcbiAgICB5MSA9IEBjYW52YXMuaGVpZ2h0ICogMC4wNVxyXG4gICAgeTIgPSBAY2FudmFzLmhlaWdodCAqIDAuMTVcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIkxBWU9VVFwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJMQVlPVVRcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgICMgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgIyAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54ICsgc2hhZG93T2Zmc2V0LCBidXR0b24ueSArIHNoYWRvd09mZnNldCwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgXCJibGFja1wiLCBcImJsYWNrXCIpXHJcbiAgICAjICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBidXR0b24uYmdDb2xvciwgXCIjOTk5OTk5XCIpXHJcbiAgICAjICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKGJ1dHRvbi50ZXh0LCBidXR0b24ueCArIChidXR0b24udyAvIDIpLCBidXR0b24ueSArIChidXR0b24uaCAvIDIpLCBAYnV0dG9uRm9udCwgYnV0dG9uLnRleHRDb2xvcilcclxuXHJcbiAgICAjIEBhcHAuZHJhd1ZlcnNpb24oKVxyXG5cclxuICBtb3VzZWRvd246ICh4LCB5KSAtPlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBpZiAoeSA+IGJ1dHRvbi55KSAmJiAoeSA8IChidXR0b24ueSArIEBidXR0b25IZWlnaHQpKVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJidXR0b24gcHJlc3NlZDogI3tidXR0b25OYW1lfVwiXHJcbiAgICAgICAgYnV0dG9uLmNsaWNrKClcclxuICAgIHJldHVyblxyXG5cclxuICBtb3VzZW1vdmU6ICh4LCB5LCBidXR0b25zKSAtPlxyXG4gIG1vdXNldXA6IC0+XHJcblxyXG4gIGNob29zZUxheW91dDogLT5cclxuXHJcbiAgcmVzZXRBbGxIZWFsdGg6IC0+XHJcblxyXG4gIHJlc3VtZTogLT5cclxuICAgIEBhcHAuc3dpdGNoVmlldyhcImNvdW50ZXJcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5b3V0Vmlld1xyXG4iLCJCVVRUT05fSEVJR0hUID0gMC4wNlxyXG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcclxuQlVUVE9OX1NQQUNJTkcgPSAwLjA4XHJcbkJVVFRPTl9TRVBBUkFUT1IgPSAwLjAzXHJcblxyXG5idXR0b25Qb3MgPSAoaW5kZXgpIC0+XHJcbiAgeSA9IEZJUlNUX0JVVFRPTl9ZICsgKEJVVFRPTl9TUEFDSU5HICogaW5kZXgpXHJcbiAgaWYgaW5kZXggPiAzXHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDRcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNlxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgcmV0dXJuIHlcclxuXHJcbmNsYXNzIE1lbnVWaWV3XHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxyXG4gICAgQGJ1dHRvbnMgPVxyXG4gICAgICBjaG9vc2VMYXlvdXQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDEpXHJcbiAgICAgICAgdGV4dDogXCJDaG9vc2UgTGF5b3V0XCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM1NTU1NTVcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQGNob29zZUxheW91dC5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc2V0QWxsSGVhbHRoOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygyKVxyXG4gICAgICAgIHRleHQ6IFwiUmVzZXQgQWxsIEhlYWx0aFwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNTU1NTU1XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXNldEFsbEhlYWx0aC5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc3VtZTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNylcclxuICAgICAgICB0ZXh0OiBcIlJlc3VtZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3Nzc3XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXN1bWUuYmluZCh0aGlzKVxyXG5cclxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxyXG4gICAgQGJ1dHRvbkhlaWdodCA9IEBjYW52YXMuaGVpZ2h0ICogQlVUVE9OX0hFSUdIVFxyXG4gICAgYnV0dG9uWCA9IChAY2FudmFzLndpZHRoIC0gYnV0dG9uV2lkdGgpIC8gMlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBidXR0b24ueCA9IGJ1dHRvblhcclxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XHJcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcclxuICAgICAgYnV0dG9uLmggPSBAYnV0dG9uSGVpZ2h0XHJcblxyXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcclxuICAgIEBidXR0b25Gb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje2J1dHRvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4xKVxyXG4gICAgQHRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3t0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMzMzM1wiKVxyXG5cclxuICAgIHggPSBAY2FudmFzLndpZHRoIC8gMlxyXG4gICAgc2hhZG93T2Zmc2V0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjAxXHJcblxyXG4gICAgeTEgPSBAY2FudmFzLmhlaWdodCAqIDAuMDVcclxuICAgIHkyID0gQGNhbnZhcy5oZWlnaHQgKiAwLjE1XHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJNVEdcIiwgeCArIHNoYWRvd09mZnNldCwgeTIgKyBzaGFkb3dPZmZzZXQsIEB0aXRsZUZvbnQsIFwiIzAwMDAwMFwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiTVRHXCIsIHgsIHkyLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54ICsgc2hhZG93T2Zmc2V0LCBidXR0b24ueSArIHNoYWRvd09mZnNldCwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgXCJibGFja1wiLCBcImJsYWNrXCIpXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54LCBidXR0b24ueSwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgYnV0dG9uLmJnQ29sb3IsIFwiIzk5OTk5OVwiKVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoYnV0dG9uLnRleHQsIGJ1dHRvbi54ICsgKGJ1dHRvbi53IC8gMiksIGJ1dHRvbi55ICsgKGJ1dHRvbi5oIC8gMiksIEBidXR0b25Gb250LCBidXR0b24udGV4dENvbG9yKVxyXG5cclxuICAgIEBhcHAuZHJhd1ZlcnNpb24oKVxyXG5cclxuICBtb3VzZWRvd246ICh4LCB5KSAtPlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBpZiAoeSA+IGJ1dHRvbi55KSAmJiAoeSA8IChidXR0b24ueSArIEBidXR0b25IZWlnaHQpKVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJidXR0b24gcHJlc3NlZDogI3tidXR0b25OYW1lfVwiXHJcbiAgICAgICAgYnV0dG9uLmNsaWNrKClcclxuICAgIHJldHVyblxyXG5cclxuICBtb3VzZW1vdmU6ICh4LCB5LCBidXR0b25zKSAtPlxyXG4gIG1vdXNldXA6IC0+XHJcblxyXG4gIGNob29zZUxheW91dDogLT5cclxuICAgIEBhcHAuc3dpdGNoVmlldyhcImxheW91dFwiKVxyXG5cclxuICByZXNldEFsbEhlYWx0aDogLT5cclxuXHJcbiAgcmVzdW1lOiAtPlxyXG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwiY291bnRlclwiKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51Vmlld1xyXG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXHJcbiAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxyXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoY2FudmFzLCBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXNbMF0pXHJcbiAgY2FudmFzUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICB3aW5kb3cuYXBwID0gbmV3IEFwcChjYW52YXMpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hzdGFydFwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgd2luZG93LmFwcC5tb3VzZWRvd24oeCwgeSlcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaG1vdmVcIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAgIHdpbmRvdy5hcHAubW91c2Vtb3ZlKHgsIHksIDEpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hlbmRcIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHdpbmRvdy5hcHAubW91c2V1cCgpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB4ID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAgIHdpbmRvdy5hcHAubW91c2Vkb3duKHgsIHkpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vtb3ZlXCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB4ID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAgIGJ1dHRvbnMgPSBlLmJ1dHRvbnNcclxuICAgIHdpbmRvdy5hcHAubW91c2Vtb3ZlKHgsIHksIGJ1dHRvbnMpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2V1cFwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgd2luZG93LmFwcC5tb3VzZXVwKClcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpIC0+XHJcbiAgICBpbml0KClcclxuLCBmYWxzZSlcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjAuMC4xXCIiLCIvKiBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMC4xMyAtIMKpIEJyYW0gU3RlaW4uIExpY2Vuc2U6IEJTRC0zLUNsYXVzZSAqLyhmdW5jdGlvbigpe2Z1bmN0aW9uIGwoYSxiKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLGIsITEpOmEuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIixiKX1mdW5jdGlvbiBtKGEpe2RvY3VtZW50LmJvZHk/YSgpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbiBjKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjKTthKCl9KTpkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uIGsoKXtpZihcImludGVyYWN0aXZlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGV8fFwiY29tcGxldGVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZSlkb2N1bWVudC5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGspLGEoKX0pfTtmdW5jdGlvbiByKGEpe3RoaXMuYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RoaXMuYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKTt0aGlzLmEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpO3RoaXMuYj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmc9LTE7dGhpcy5iLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmMuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xudGhpcy5mLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmguc3R5bGUuY3NzVGV4dD1cImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7XCI7dGhpcy5iLmFwcGVuZENoaWxkKHRoaXMuaCk7dGhpcy5jLmFwcGVuZENoaWxkKHRoaXMuZik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYyl9XG5mdW5jdGlvbiB0KGEsYil7YS5hLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDpcIitiK1wiO1wifWZ1bmN0aW9uIHkoYSl7dmFyIGI9YS5hLm9mZnNldFdpZHRoLGM9YisxMDA7YS5mLnN0eWxlLndpZHRoPWMrXCJweFwiO2EuYy5zY3JvbGxMZWZ0PWM7YS5iLnNjcm9sbExlZnQ9YS5iLnNjcm9sbFdpZHRoKzEwMDtyZXR1cm4gYS5nIT09Yj8oYS5nPWIsITApOiExfWZ1bmN0aW9uIHooYSxiKXtmdW5jdGlvbiBjKCl7dmFyIGE9azt5KGEpJiZhLmEucGFyZW50Tm9kZSYmYihhLmcpfXZhciBrPWE7bChhLmIsYyk7bChhLmMsYyk7eShhKX07ZnVuY3Rpb24gQShhLGIpe3ZhciBjPWJ8fHt9O3RoaXMuZmFtaWx5PWE7dGhpcy5zdHlsZT1jLnN0eWxlfHxcIm5vcm1hbFwiO3RoaXMud2VpZ2h0PWMud2VpZ2h0fHxcIm5vcm1hbFwiO3RoaXMuc3RyZXRjaD1jLnN0cmV0Y2h8fFwibm9ybWFsXCJ9dmFyIEI9bnVsbCxDPW51bGwsRT1udWxsLEY9bnVsbDtmdW5jdGlvbiBHKCl7aWYobnVsbD09PUMpaWYoSigpJiYvQXBwbGUvLnRlc3Qod2luZG93Lm5hdmlnYXRvci52ZW5kb3IpKXt2YXIgYT0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7Qz0hIWEmJjYwMz5wYXJzZUludChhWzFdLDEwKX1lbHNlIEM9ITE7cmV0dXJuIEN9ZnVuY3Rpb24gSigpe251bGw9PT1GJiYoRj0hIWRvY3VtZW50LmZvbnRzKTtyZXR1cm4gRn1cbmZ1bmN0aW9uIEsoKXtpZihudWxsPT09RSl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7YS5zdHlsZS5mb250PVwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIn1jYXRjaChiKXt9RT1cIlwiIT09YS5zdHlsZS5mb250fXJldHVybiBFfWZ1bmN0aW9uIEwoYSxiKXtyZXR1cm5bYS5zdHlsZSxhLndlaWdodCxLKCk/YS5zdHJldGNoOlwiXCIsXCIxMDBweFwiLGJdLmpvaW4oXCIgXCIpfVxuQS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMsaz1hfHxcIkJFU2Jzd3lcIixxPTAsRD1ifHwzRTMsSD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtpZihKKCkmJiFHKCkpe3ZhciBNPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gZSgpeyhuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PUQ/YigpOmRvY3VtZW50LmZvbnRzLmxvYWQoTChjLCdcIicrYy5mYW1pbHkrJ1wiJyksaykudGhlbihmdW5jdGlvbihjKXsxPD1jLmxlbmd0aD9hKCk6c2V0VGltZW91dChlLDI1KX0sZnVuY3Rpb24oKXtiKCl9KX1lKCl9KSxOPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYyl7cT1zZXRUaW1lb3V0KGMsRCl9KTtQcm9taXNlLnJhY2UoW04sTV0pLnRoZW4oZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQocSk7YShjKX0sZnVuY3Rpb24oKXtiKGMpfSl9ZWxzZSBtKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gdSgpe3ZhciBiO2lmKGI9LTEhPVxuZiYmLTEhPWd8fC0xIT1mJiYtMSE9aHx8LTEhPWcmJi0xIT1oKShiPWYhPWcmJmYhPWgmJmchPWgpfHwobnVsbD09PUImJihiPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSxCPSEhYiYmKDUzNj5wYXJzZUludChiWzFdLDEwKXx8NTM2PT09cGFyc2VJbnQoYlsxXSwxMCkmJjExPj1wYXJzZUludChiWzJdLDEwKSkpLGI9QiYmKGY9PXYmJmc9PXYmJmg9PXZ8fGY9PXcmJmc9PXcmJmg9PXd8fGY9PXgmJmc9PXgmJmg9PXgpKSxiPSFiO2ImJihkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxjbGVhclRpbWVvdXQocSksYShjKSl9ZnVuY3Rpb24gSSgpe2lmKChuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PUQpZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksYihjKTtlbHNle3ZhciBhPWRvY3VtZW50LmhpZGRlbjtpZighMD09PWF8fHZvaWQgMD09PWEpZj1lLmEub2Zmc2V0V2lkdGgsXG5nPW4uYS5vZmZzZXRXaWR0aCxoPXAuYS5vZmZzZXRXaWR0aCx1KCk7cT1zZXRUaW1lb3V0KEksNTApfX12YXIgZT1uZXcgcihrKSxuPW5ldyByKGspLHA9bmV3IHIoayksZj0tMSxnPS0xLGg9LTEsdj0tMSx3PS0xLHg9LTEsZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2QuZGlyPVwibHRyXCI7dChlLEwoYyxcInNhbnMtc2VyaWZcIikpO3QobixMKGMsXCJzZXJpZlwiKSk7dChwLEwoYyxcIm1vbm9zcGFjZVwiKSk7ZC5hcHBlbmRDaGlsZChlLmEpO2QuYXBwZW5kQ2hpbGQobi5hKTtkLmFwcGVuZENoaWxkKHAuYSk7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkKTt2PWUuYS5vZmZzZXRXaWR0aDt3PW4uYS5vZmZzZXRXaWR0aDt4PXAuYS5vZmZzZXRXaWR0aDtJKCk7eihlLGZ1bmN0aW9uKGEpe2Y9YTt1KCl9KTt0KGUsTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNhbnMtc2VyaWYnKSk7eihuLGZ1bmN0aW9uKGEpe2c9YTt1KCl9KTt0KG4sTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNlcmlmJykpO1xueihwLGZ1bmN0aW9uKGEpe2g9YTt1KCl9KTt0KHAsTChjLCdcIicrYy5mYW1pbHkrJ1wiLG1vbm9zcGFjZScpKX0pfSl9O1wib2JqZWN0XCI9PT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPUE6KHdpbmRvdy5Gb250RmFjZU9ic2VydmVyPUEsd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIucHJvdG90eXBlLmxvYWQ9QS5wcm90b3R5cGUubG9hZCk7fSgpKTtcbiJdfQ==
