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
    this.switchView("counter");
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

  App.prototype.resetAllHealth = function() {
    this.views.counter.resetAllHealth();
    return this.switchView("counter");
  };

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

PlayerColors = ["#ffff77", "#7777ff", "#77ff77", "#77ffff", "#ff77ff", "#ff7777"];

TWO_PI = Math.PI * 2;

clone = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

CounterView = (function() {
  function CounterView(app, canvas) {
    var cRadius6, fRadius2, fRadius6, incrementFontPixels, menuFontPixels;
    this.app = app;
    this.canvas = canvas;
    console.log("canvas size " + this.canvas.width + "x" + this.canvas.height);
    this.Color = Color;
    this.PlayerColors = PlayerColors;
    this.healthFontPixels = Math.floor(this.canvas.width * 0.30);
    incrementFontPixels = Math.floor(this.canvas.width * 0.05);
    menuFontPixels = Math.floor(this.canvas.width * 0.05);
    this.fonts = {
      health: this.app.registerFont("health", this.healthFontPixels + "px Instruction, monospace"),
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
    fRadius2 = this.center.y * 0.6;
    cRadius6 = this.center.x * 0.7;
    fRadius6 = this.center.x * 1.0;
    this.layouts.push({
      name: "Solo",
      players: [this.playerLayout(PlayerColors[0], 4, fRadius2, 20)]
    });
    this.layouts.push({
      name: "2P",
      players: [this.playerLayout(PlayerColors[0], 4, fRadius2, 20), this.playerLayout(PlayerColors[1], 14, fRadius2, 20)]
    });
    this.layouts.push({
      name: "3P",
      players: [this.playerLayout(PlayerColors[0], 4, fRadius2, 20), this.playerLayout(PlayerColors[1], 9, cRadius6, 20), this.playerLayout(PlayerColors[2], 14, fRadius2, 20)]
    });
    this.layouts.push({
      name: "4P",
      players: [this.playerLayout(PlayerColors[0], 4, fRadius2, 20), this.playerLayout(PlayerColors[1], 9, cRadius6, 20), this.playerLayout(PlayerColors[2], 14, fRadius2, 20), this.playerLayout(PlayerColors[3], 19, cRadius6, 20)]
    });
    this.layouts.push({
      name: "Scoreboard 4P",
      players: [this.playerLayout(PlayerColors[0], 2, cRadius6, 20, Math.PI / 2), this.playerLayout(PlayerColors[1], 6, cRadius6, 20, Math.PI / 2), this.playerLayout(PlayerColors[2], 12, cRadius6, 20, Math.PI / 2), this.playerLayout(PlayerColors[3], 16, cRadius6, 20, Math.PI / 2)]
    });
    this.layouts.push({
      name: "2v2",
      players: [this.playerLayout(PlayerColors[0], 2, cRadius6, 20, -Math.PI / 2), this.playerLayout(PlayerColors[1], 6, cRadius6, 20, Math.PI / 2), this.playerLayout(PlayerColors[1], 12, cRadius6, 20, Math.PI / 2), this.playerLayout(PlayerColors[0], 16, cRadius6, 20, -Math.PI / 2)]
    });
    this.layouts.push({
      name: "5 Player",
      players: [this.playerLayout(PlayerColors[0], 2, fRadius6, 20), this.playerLayout(PlayerColors[1], 6, fRadius6, 20), this.playerLayout(PlayerColors[2], 9, cRadius6, 20), this.playerLayout(PlayerColors[3], 12, fRadius6, 20), this.playerLayout(PlayerColors[4], 16, fRadius6, 20)]
    });
    this.layouts.push({
      name: "6P",
      players: [this.playerLayout(PlayerColors[0], 2, fRadius6, 20), this.playerLayout(PlayerColors[1], 6, fRadius6, 20), this.playerLayout(PlayerColors[2], 9, cRadius6, 20), this.playerLayout(PlayerColors[3], 12, fRadius6, 20), this.playerLayout(PlayerColors[4], 16, fRadius6, 20), this.playerLayout(PlayerColors[5], 19, cRadius6, 20)]
    });
    this.layouts.push({
      name: "Commander 6P",
      players: [this.playerLayout(PlayerColors[0], 2, fRadius6, 40), this.playerLayout(PlayerColors[1], 6, fRadius6, 40), this.playerLayout(PlayerColors[1], 9, cRadius6, 40), this.playerLayout(PlayerColors[1], 12, fRadius6, 40), this.playerLayout(PlayerColors[0], 16, fRadius6, 40), this.playerLayout(PlayerColors[0], 19, cRadius6, 40)]
    });
    if (!this.load()) {
      this.chooseLayout(0);
    }
    this.onDragReset();
    this.draw();
  }

  CounterView.prototype.chooseLayout = function(layout) {
    this.layoutIndex = layout;
    this.players = clone(this.layouts[layout].players);
    this.save();
  };

  CounterView.prototype.resetAllHealth = function() {
    return this.chooseLayout(this.layoutIndex);
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

  CounterView.prototype.playerLayout = function(color, slice, radius, health, angle) {
    var c, player;
    if (angle == null) {
      angle = null;
    }
    c = this.unpolar(((slice + 1) % this.sliceCount) * this.sliceAngle, radius, this.center.x, this.center.y);
    if (angle === null) {
      angle = this.facingOutAngle(c.x, c.y);
    }
    player = {
      x: c.x,
      y: c.y,
      angle: angle,
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
      this.save();
    }
    this.onDragReset();
    return this.draw();
  };

  CounterView.prototype.load = function() {
    var jsonString, state;
    if (!localStorage) {
      alert("No local storage, nothing will work");
      return false;
    }
    jsonString = localStorage.getItem("mtgstate");
    if (jsonString === null) {
      return false;
    }
    try {
      state = JSON.parse(jsonString);
    } catch (error) {
      return false;
    }
    if (!state) {
      return false;
    }
    this.players = state.players;
    this.layoutIndex = state.layoutIndex;
    console.log("Loaded state.");
    return true;
  };

  CounterView.prototype.save = function() {
    var jsonString, state;
    if (!localStorage) {
      alert("No local storage, nothing will work");
      return false;
    }
    state = {
      players: this.players,
      layoutIndex: this.layoutIndex
    };
    jsonString = JSON.stringify(state);
    localStorage.setItem("mtgstate", jsonString);
    console.log("Saved state (" + jsonString.length + " chars)");
    return true;
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
            textColor = Color.addText;
          } else {
            textV = "" + value;
            textColor = Color.subtractText;
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
  function LayoutView(app, canvas, counter) {
    var button, buttonFontHeight, buttonName, buttonWidth, buttonX, ref, titleFontHeight;
    this.app = app;
    this.canvas = canvas;
    this.counter = counter;
    this.buttons = {
      cancel: {
        y: buttonPos(7),
        text: "Cancel",
        bgColor: "#777777",
        textColor: "#ffffff",
        click: this.cancel.bind(this)
      }
    };
    this.scale = 5;
    this.nameFontPixels = this.counter.healthFontPixels / this.scale / 3;
    this.fonts = {
      health: this.app.registerFont("health", (this.counter.healthFontPixels / this.scale) + "px Instruction, monospace"),
      name: this.app.registerFont("name", this.nameFontPixels + "px Instruction, monospace")
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

  LayoutView.prototype.drawLayout = function(layout, ox, oy) {
    var j, len, player, ref;
    console.log("drawing layout", layout);
    this.app.drawRoundedRect(ox, oy, this.canvas.width / this.scale, this.canvas.height / this.scale, 0, this.counter.Color.background, "black");
    ref = layout.players;
    for (j = 0, len = ref.length; j < len; j++) {
      player = ref[j];
      this.app.drawTextCentered(player.health, ox + (player.x / this.scale), oy + (player.y / this.scale), this.fonts.health, player.color, player.angle);
    }
    return this.app.drawTextCentered(layout.name, ox + (this.canvas.width / this.scale / 2), oy + this.nameFontPixels, this.fonts.name, "white", 0);
  };

  LayoutView.prototype.draw = function() {
    var button, buttonName, i, j, layout, len, ref, ref1, results, shadowOffset, x, y;
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "#330000");
    ref = this.counter.layouts;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      layout = ref[i];
      x = (i % this.scale) * this.canvas.width / this.scale;
      y = Math.floor(i / this.scale) * this.canvas.height / this.scale;
      this.drawLayout(layout, x, y);
    }
    shadowOffset = this.canvas.height * 0.01;
    ref1 = this.buttons;
    results = [];
    for (buttonName in ref1) {
      button = ref1[buttonName];
      this.app.drawRoundedRect(button.x + shadowOffset, button.y + shadowOffset, button.w, button.h, button.h * 0.3, "black", "black");
      this.app.drawRoundedRect(button.x, button.y, button.w, button.h, button.h * 0.3, button.bgColor, "#999999");
      results.push(this.app.drawTextCentered(button.text, button.x + (button.w / 2), button.y + (button.h / 2), this.buttonFont, button.textColor));
    }
    return results;
  };

  LayoutView.prototype.mousedown = function(x, y) {
    var button, buttonName, layout, layoutIndex, ref;
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      if ((y > button.y) && (y < (button.y + this.buttonHeight))) {
        button.click();
        return;
      }
    }
    console.log(x + ", " + y);
    layoutIndex = Math.floor(x / (this.canvas.width / this.scale)) + Math.floor(this.scale * Math.floor(y / (this.canvas.height / this.scale)));
    if ((layoutIndex >= 0) && (layoutIndex < this.counter.layouts.length)) {
      layout = this.counter.layouts[layoutIndex];
      if (confirm("Reset to the '" + layout.name + "' layout?")) {
        this.counter.chooseLayout(layoutIndex);
        this.app.switchView("counter");
      }
    }
  };

  LayoutView.prototype.mousemove = function(x, y, buttons) {};

  LayoutView.prototype.mouseup = function() {};

  LayoutView.prototype.cancel = function() {
    return this.app.switchView("menu");
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

  MenuView.prototype.resetAllHealth = function() {
    if (confirm("Reset all health?")) {
      return this.app.resetAllHealth();
    }
  };

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXENvdW50ZXJWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcTGF5b3V0Vmlldy5jb2ZmZWUiLCJnYW1lXFxzcmNcXE1lbnVWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcbWFpbi5jb2ZmZWUiLCJnYW1lXFxzcmNcXHZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVI7O0FBQ2QsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUjs7QUFFSjtFQUNTLGFBQUMsTUFBRDtJQUFDLElBQUMsQ0FBQSxTQUFEO0lBQ1osSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsSUFBbkI7SUFDUCxJQUFDLENBQUEsUUFBRCxDQUFVLFNBQVY7SUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGFBQVY7SUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTO0lBRVQsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQTVCO0lBQ3JCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxTQUFkLEVBQTRCLElBQUMsQ0FBQSxpQkFBRixHQUFvQix1QkFBL0M7SUFFZixJQUFDLENBQUEsb0JBQUQsR0FBd0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJ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Y2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkZvbnRGYWNlT2JzZXJ2ZXIgPSByZXF1aXJlICdmb250ZmFjZW9ic2VydmVyJ1xyXG5cclxuTWVudVZpZXcgPSByZXF1aXJlICcuL01lbnVWaWV3J1xyXG5Db3VudGVyVmlldyA9IHJlcXVpcmUgJy4vQ291bnRlclZpZXcnXHJcbkxheW91dFZpZXcgPSByZXF1aXJlICcuL0xheW91dFZpZXcnXHJcbnZlcnNpb24gPSByZXF1aXJlICcuL3ZlcnNpb24nXHJcblxyXG5jbGFzcyBBcHBcclxuICBjb25zdHJ1Y3RvcjogKEBjYW52YXMpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBsb2FkRm9udChcInNheE1vbm9cIilcclxuICAgIEBsb2FkRm9udChcIkluc3RydWN0aW9uXCIpXHJcbiAgICBAZm9udHMgPSB7fVxyXG5cclxuICAgIEB2ZXJzaW9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxyXG4gICAgQHZlcnNpb25Gb250ID0gQHJlZ2lzdGVyRm9udChcInZlcnNpb25cIiwgXCIje0B2ZXJzaW9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAZ2VuZXJhdGluZ0ZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNClcclxuICAgIEBnZW5lcmF0aW5nRm9udCA9IEByZWdpc3RlckZvbnQoXCJnZW5lcmF0aW5nXCIsIFwiI3tAZ2VuZXJhdGluZ0ZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQHZpZXdzID1cclxuICAgICAgbWVudTogbmV3IE1lbnVWaWV3KHRoaXMsIEBjYW52YXMpXHJcbiAgICAgIGNvdW50ZXI6IG5ldyBDb3VudGVyVmlldyh0aGlzLCBAY2FudmFzKVxyXG4gICAgQHZpZXdzLmxheW91dCA9IG5ldyBMYXlvdXRWaWV3KHRoaXMsIEBjYW52YXMsIEB2aWV3cy5jb3VudGVyKVxyXG4gICAgQHN3aXRjaFZpZXcoXCJjb3VudGVyXCIpXHJcblxyXG4gIG1lYXN1cmVGb250czogLT5cclxuICAgIGZvciBmb250TmFtZSwgZiBvZiBAZm9udHNcclxuICAgICAgQGN0eC5mb250ID0gZi5zdHlsZVxyXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxyXG4gICAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgICAgZi5oZWlnaHQgPSBNYXRoLmZsb29yKEBjdHgubWVhc3VyZVRleHQoXCJtXCIpLndpZHRoICogMS4xKSAjIGJlc3QgaGFjayBldmVyXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRm9udCAje2ZvbnROYW1lfSBtZWFzdXJlZCBhdCAje2YuaGVpZ2h0fSBwaXhlbHNcIlxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlZ2lzdGVyRm9udDogKG5hbWUsIHN0eWxlKSAtPlxyXG4gICAgZm9udCA9XHJcbiAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgc3R5bGU6IHN0eWxlXHJcbiAgICAgIGhlaWdodDogMFxyXG4gICAgQGZvbnRzW25hbWVdID0gZm9udFxyXG4gICAgQG1lYXN1cmVGb250cygpXHJcbiAgICByZXR1cm4gZm9udFxyXG5cclxuICBsb2FkRm9udDogKGZvbnROYW1lKSAtPlxyXG4gICAgZm9udCA9IG5ldyBGb250RmFjZU9ic2VydmVyKGZvbnROYW1lKVxyXG4gICAgZm9udC5sb2FkKCkudGhlbiA9PlxyXG4gICAgICBjb25zb2xlLmxvZyhcIiN7Zm9udE5hbWV9IGxvYWRlZCwgcmVkcmF3aW5nLi4uXCIpXHJcbiAgICAgIEBtZWFzdXJlRm9udHMoKVxyXG4gICAgICBAZHJhdygpXHJcblxyXG4gIHN3aXRjaFZpZXc6ICh2aWV3KSAtPlxyXG4gICAgQHZpZXcgPSBAdmlld3Nbdmlld11cclxuICAgIEBkcmF3KClcclxuXHJcbiAgcmVzZXRBbGxIZWFsdGg6IC0+XHJcbiAgICBAdmlld3MuY291bnRlci5yZXNldEFsbEhlYWx0aCgpXHJcbiAgICBAc3dpdGNoVmlldyhcImNvdW50ZXJcIilcclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEB2aWV3LmRyYXcoKVxyXG5cclxuICBtb3VzZWRvd246ICh4LCB5KSAtPlxyXG4gICAgQHZpZXcubW91c2Vkb3duKHgsIHkpXHJcblxyXG4gIG1vdXNlbW92ZTogKHgsIHksIGJ1dHRvbnMpIC0+XHJcbiAgICBAdmlldy5tb3VzZW1vdmUoeCwgeSwgYnV0dG9ucylcclxuXHJcbiAgbW91c2V1cDogKHgsIHkpIC0+XHJcbiAgICBAdmlldy5tb3VzZXVwKHgsIHkpXHJcblxyXG4gIGRyYXdGaWxsOiAoeCwgeSwgdywgaCwgY29sb3IpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHguZmlsbCgpXHJcblxyXG4gIGRyYXdSb3VuZGVkUmVjdDogKHgsIHksIHcsIGgsIHIsIGZpbGxDb2xvciA9IG51bGwsIHN0cm9rZUNvbG9yID0gbnVsbCkgLT5cclxuICAgIEBjdHgucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpXHJcbiAgICBpZiBmaWxsQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IGZpbGxDb2xvclxyXG4gICAgICBAY3R4LmZpbGwoKVxyXG4gICAgaWYgc3Ryb2tlQ29sb3IgIT0gbnVsbFxyXG4gICAgICBAY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3JcclxuICAgICAgQGN0eC5zdHJva2UoKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdSZWN0OiAoeCwgeSwgdywgaCwgY29sb3IsIGxpbmVXaWR0aCA9IDEpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4LnJlY3QoeCwgeSwgdywgaClcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd0xpbmU6ICh4MSwgeTEsIHgyLCB5MiwgY29sb3IgPSBcImJsYWNrXCIsIGxpbmVXaWR0aCA9IDEpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4Lm1vdmVUbyh4MSwgeTEpXHJcbiAgICBAY3R4LmxpbmVUbyh4MiwgeTIpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcblxyXG4gIGRyYXdBcmM6ICh4LCB5LCByLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgY29sb3IpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4Lm1vdmVUbyh4LCB5KVxyXG4gICAgQGN0eC5hcmMoeCwgeSwgciwgc3RhcnRBbmdsZSwgZW5kQW5nbGUpXHJcbiAgICBAY3R4LmNsb3NlUGF0aCgpXHJcbiAgICBAY3R4LmZpbGwoKVxyXG5cclxuICBzdHJva2VDaXJjbGU6ICh4LCB5LCByLCBjb2xvciwgbGluZVdpZHRoKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxyXG4gICAgQGN0eC5hcmMoeCwgeSwgciwgMCwgTWF0aC5QSSAqIDIpXHJcbiAgICBAY3R4LmNsb3NlUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcblxyXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yLCByb3QpIC0+XHJcbiAgICBAY3R4LnNhdmUoKVxyXG4gICAgQGN0eC50cmFuc2xhdGUoY3gsIGN5KVxyXG4gICAgQGN0eC5yb3RhdGUocm90KVxyXG4gICAgQGN0eC5mb250ID0gZm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG5cclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCAwLCAoZm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbiAgICBAY3R4LnJlc3RvcmUoKVxyXG5cclxuICBzdHJva2VUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yLCBsaW5lV2lkdGgsIHJvdCkgLT5cclxuICAgIEBjdHguc2F2ZSgpXHJcbiAgICBAY3R4LnRyYW5zbGF0ZShjeCwgY3kpXHJcbiAgICBAY3R4LnJvdGF0ZShyb3QpXHJcbiAgICBAY3R4LmZvbnQgPSBmb250LnN0eWxlXHJcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHguc3Ryb2tlVGV4dCh0ZXh0LCAwLCAoZm9udC5oZWlnaHQgLyAyKSlcclxuICAgIEBjdHgucmVzdG9yZSgpXHJcblxyXG4gIGRyYXdMb3dlckxlZnQ6ICh0ZXh0LCBjb2xvciA9IFwid2hpdGVcIikgLT5cclxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwibGVmdFwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIDAsIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbiAgZHJhd1ZlcnNpb246IChjb2xvciA9IFwid2hpdGVcIikgLT5cclxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIlxyXG4gICAgQGN0eC5maWxsVGV4dChcInYje3ZlcnNpb259XCIsIEBjYW52YXMud2lkdGggLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLnJvdW5kUmVjdCA9ICh4LCB5LCB3LCBoLCByKSAtPlxyXG4gIGlmICh3IDwgMiAqIHIpIHRoZW4gciA9IHcgLyAyXHJcbiAgaWYgKGggPCAyICogcikgdGhlbiByID0gaCAvIDJcclxuICBAYmVnaW5QYXRoKClcclxuICBAbW92ZVRvKHgrciwgeSlcclxuICBAYXJjVG8oeCt3LCB5LCAgIHgrdywgeStoLCByKVxyXG4gIEBhcmNUbyh4K3csIHkraCwgeCwgICB5K2gsIHIpXHJcbiAgQGFyY1RvKHgsICAgeStoLCB4LCAgIHksICAgcilcclxuICBAYXJjVG8oeCwgICB5LCAgIHgrdywgeSwgICByKVxyXG4gIEBjbG9zZVBhdGgoKVxyXG4gIHJldHVybiB0aGlzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxyXG4iLCJDb2xvciA9XHJcbiAgYmFja2dyb3VuZDogXCIjMzMzMzMzXCJcclxuICBkaWFsOiBcIiMzMzMzMzNcIlxyXG4gIGRpYWxIaWdobGlnaHQ6IFwiIzY2NjY2NlwiXHJcbiAgaGVhbHRoOiBcIndoaXRlXCJcclxuICBjaGFuZ2luZ0hlYWx0aDogXCJyZWRcIlxyXG4gIGFkZFRleHQ6IFwiIzAwZmYwMFwiXHJcbiAgc3VidHJhY3RUZXh0OiBcIiNmZjAwMDBcIlxyXG4gIG1lbnU6IFwiI2ZmZmZmZlwiXHJcblxyXG5QbGF5ZXJDb2xvcnMgPSBbXHJcbiAgXCIjZmZmZjc3XCJcclxuICBcIiM3Nzc3ZmZcIlxyXG4gIFwiIzc3ZmY3N1wiXHJcbiAgXCIjNzdmZmZmXCJcclxuICBcIiNmZjc3ZmZcIlxyXG4gIFwiI2ZmNzc3N1wiXHJcbl1cclxuXHJcblRXT19QSSA9IE1hdGguUEkgKiAyXHJcblxyXG5jbG9uZSA9IChvYmopIC0+XHJcbiAgIyBUT0RPOiBmaW5kIHNvbWV0aGluZyBiZXR0ZXI/XHJcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSlcclxuXHJcbmNsYXNzIENvdW50ZXJWaWV3XHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgIyBJbml0XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiY2FudmFzIHNpemUgI3tAY2FudmFzLndpZHRofXgje0BjYW52YXMuaGVpZ2h0fVwiXHJcblxyXG4gICAgQENvbG9yID0gQ29sb3JcclxuICAgIEBQbGF5ZXJDb2xvcnMgPSBQbGF5ZXJDb2xvcnNcclxuXHJcbiAgICAjIGluaXQgZm9udHNcclxuICAgIEBoZWFsdGhGb250UGl4ZWxzID0gTWF0aC5mbG9vcihAY2FudmFzLndpZHRoICogMC4zMClcclxuICAgIGluY3JlbWVudEZvbnRQaXhlbHMgPSBNYXRoLmZsb29yKEBjYW52YXMud2lkdGggKiAwLjA1KVxyXG4gICAgbWVudUZvbnRQaXhlbHMgPSBNYXRoLmZsb29yKEBjYW52YXMud2lkdGggKiAwLjA1KVxyXG4gICAgQGZvbnRzID1cclxuICAgICAgaGVhbHRoOiAgICBAYXBwLnJlZ2lzdGVyRm9udChcImhlYWx0aFwiLCAgICBcIiN7QGhlYWx0aEZvbnRQaXhlbHN9cHggSW5zdHJ1Y3Rpb24sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBpbmNyZW1lbnQ6IEBhcHAucmVnaXN0ZXJGb250KFwiaW5jcmVtZW50XCIsIFwiI3tpbmNyZW1lbnRGb250UGl4ZWxzfXB4IEluc3RydWN0aW9uLCBtb25vc3BhY2VcIilcclxuICAgICAgbWVudTogICAgICBAYXBwLnJlZ2lzdGVyRm9udChcImluY3JlbWVudFwiLCBcIiN7bWVudUZvbnRQaXhlbHN9cHggSW5zdHJ1Y3Rpb24sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBjZW50ZXIgPVxyXG4gICAgICB4OiBAY2FudmFzLndpZHRoIC8gMlxyXG4gICAgICB5OiBAY2FudmFzLmhlaWdodCAvIDJcclxuXHJcbiAgICBAc2xpY2VDb3VudCA9IDIwXHJcbiAgICBAaGFsZlNsaWNlQ291bnQgPSBNYXRoLmZsb29yKEBzbGljZUNvdW50IC8gMilcclxuICAgIEBzbGljZUFuZ2xlID0gVFdPX1BJIC8gQHNsaWNlQ291bnRcclxuICAgIEBoYWxmU2xpY2VBbmdsZSA9IEBzbGljZUFuZ2xlIC8gMlxyXG5cclxuICAgIEBkaWFsUmFkaXVzID0gQGNlbnRlci54ICogMC44XHJcbiAgICBAZGlhbEluY3JlbWVudFJhZGl1cyA9IEBjZW50ZXIueCAqIDAuN1xyXG4gICAgQG1lbnVSYWRpdXMgPSBAY2VudGVyLnggKiAwLjFcclxuXHJcbiAgICBAbGF5b3V0cyA9IFtdXHJcblxyXG4gICAgZlJhZGl1czIgPSBAY2VudGVyLnkgKiAwLjZcclxuICAgIGNSYWRpdXM2ID0gQGNlbnRlci54ICogMC43XHJcbiAgICBmUmFkaXVzNiA9IEBjZW50ZXIueCAqIDEuMFxyXG5cclxuICAgIEBsYXlvdXRzLnB1c2gge1xyXG4gICAgICBuYW1lOiBcIlNvbG9cIlxyXG4gICAgICBwbGF5ZXJzOiBbXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDQsIGZSYWRpdXMyLCAyMClcclxuICAgICAgXVxyXG4gICAgfVxyXG5cclxuICAgIEBsYXlvdXRzLnB1c2gge1xyXG4gICAgICBuYW1lOiBcIjJQXCJcclxuICAgICAgcGxheWVyczogW1xyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCA0LCBmUmFkaXVzMiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDE0LCBmUmFkaXVzMiwgMjApXHJcbiAgICAgIF1cclxuICAgIH1cclxuXHJcbiAgICBAbGF5b3V0cy5wdXNoIHtcclxuICAgICAgbmFtZTogXCIzUFwiXHJcbiAgICAgIHBsYXllcnM6IFtcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgNCwgZlJhZGl1czIsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCA5LCBjUmFkaXVzNiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMl0sIDE0LCBmUmFkaXVzMiwgMjApXHJcbiAgICAgIF1cclxuICAgIH1cclxuXHJcbiAgICBAbGF5b3V0cy5wdXNoIHtcclxuICAgICAgbmFtZTogXCI0UFwiXHJcbiAgICAgIHBsYXllcnM6IFtcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgNCwgZlJhZGl1czIsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCA5LCBjUmFkaXVzNiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMl0sIDE0LCBmUmFkaXVzMiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbM10sIDE5LCBjUmFkaXVzNiwgMjApXHJcbiAgICAgIF1cclxuICAgIH1cclxuXHJcbiAgICBAbGF5b3V0cy5wdXNoIHtcclxuICAgICAgbmFtZTogXCJTY29yZWJvYXJkIDRQXCJcclxuICAgICAgcGxheWVyczogW1xyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCAyLCBjUmFkaXVzNiwgMjAsIE1hdGguUEkgLyAyKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCA2LCBjUmFkaXVzNiwgMjAsIE1hdGguUEkgLyAyKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzJdLCAxMiwgY1JhZGl1czYsIDIwLCBNYXRoLlBJIC8gMilcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1szXSwgMTYsIGNSYWRpdXM2LCAyMCwgTWF0aC5QSSAvIDIpXHJcbiAgICAgIF1cclxuICAgIH1cclxuXHJcbiAgICBAbGF5b3V0cy5wdXNoIHtcclxuICAgICAgbmFtZTogXCIydjJcIlxyXG4gICAgICBwbGF5ZXJzOiBbXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sICAyLCBjUmFkaXVzNiwgMjAsIC1NYXRoLlBJIC8gMilcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgIDYsIGNSYWRpdXM2LCAyMCwgIE1hdGguUEkgLyAyKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCAxMiwgY1JhZGl1czYsIDIwLCAgTWF0aC5QSSAvIDIpXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDE2LCBjUmFkaXVzNiwgMjAsIC1NYXRoLlBJIC8gMilcclxuICAgICAgXVxyXG4gICAgfVxyXG5cclxuICAgIEBsYXlvdXRzLnB1c2gge1xyXG4gICAgICBuYW1lOiBcIjUgUGxheWVyXCJcclxuICAgICAgcGxheWVyczogW1xyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCAyLCBmUmFkaXVzNiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDYsIGZSYWRpdXM2LCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1syXSwgOSwgY1JhZGl1czYsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzNdLCAxMiwgZlJhZGl1czYsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzRdLCAxNiwgZlJhZGl1czYsIDIwKVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgQGxheW91dHMucHVzaCB7XHJcbiAgICAgIG5hbWU6IFwiNlBcIlxyXG4gICAgICBwbGF5ZXJzOiBbXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDIsIGZSYWRpdXM2LCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgNiwgZlJhZGl1czYsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzJdLCA5LCBjUmFkaXVzNiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbM10sIDEyLCBmUmFkaXVzNiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbNF0sIDE2LCBmUmFkaXVzNiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbNV0sIDE5LCBjUmFkaXVzNiwgMjApXHJcbiAgICAgIF1cclxuICAgIH1cclxuXHJcbiAgICBAbGF5b3V0cy5wdXNoIHtcclxuICAgICAgbmFtZTogXCJDb21tYW5kZXIgNlBcIlxyXG4gICAgICBwbGF5ZXJzOiBbXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDIsIGZSYWRpdXM2LCA0MClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgNiwgZlJhZGl1czYsIDQwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCA5LCBjUmFkaXVzNiwgNDApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDEyLCBmUmFkaXVzNiwgNDApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDE2LCBmUmFkaXVzNiwgNDApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDE5LCBjUmFkaXVzNiwgNDApXHJcbiAgICAgIF1cclxuICAgIH1cclxuXHJcbiAgICBpZiBub3QgQGxvYWQoKVxyXG4gICAgICBAY2hvb3NlTGF5b3V0KDApXHJcbiAgICBAb25EcmFnUmVzZXQoKVxyXG4gICAgQGRyYXcoKVxyXG5cclxuICBjaG9vc2VMYXlvdXQ6IChsYXlvdXQpIC0+XHJcbiAgICBAbGF5b3V0SW5kZXggPSBsYXlvdXRcclxuICAgIEBwbGF5ZXJzID0gY2xvbmUoQGxheW91dHNbbGF5b3V0XS5wbGF5ZXJzKVxyXG4gICAgQHNhdmUoKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlc2V0QWxsSGVhbHRoOiAtPlxyXG4gICAgQGNob29zZUxheW91dChAbGF5b3V0SW5kZXgpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICAjIHJldHVybiBAY291bnRlci5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICByZXR1cm4gXCJcIiAjQGNvdW50ZXIuZXhwb3J0KClcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIGZhY2luZ091dEFuZ2xlOiAoeCwgeSkgLT5cclxuICAgIHJldHVybiBNYXRoLmF0YW4yKHkgLSBAY2VudGVyLnksIHggLSBAY2VudGVyLngpIC0gKE1hdGguUEkgLyAyKVxyXG5cclxuICB1bnBvbGFyOiAoYW5nbGUsIHIsIG9mZnNldFggPSAwLCBvZmZzZXRZID0gMCkgLT5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IG9mZnNldFggKyAoTWF0aC5jb3MoYW5nbGUpICogcilcclxuICAgICAgeTogb2Zmc2V0WSArIChNYXRoLnNpbihhbmdsZSkgKiByKVxyXG4gICAgfVxyXG5cclxuICBwb3NUb1NsaWNlOiAoeCwgeSkgLT5cclxuICAgIHBvc0FuZ2xlID0gTWF0aC5hdGFuMih5IC0gQGNlbnRlci55LCB4IC0gQGNlbnRlci54KVxyXG4gICAgaWYgcG9zQW5nbGUgPCAwXHJcbiAgICAgIHBvc0FuZ2xlICs9IE1hdGguUEkgKiAyXHJcbiAgICBhbmdsZSA9IDBcclxuICAgIGZvciBzbGljZSBpbiBbMC4uLkBzbGljZUNvdW50XVxyXG4gICAgICBpZiAocG9zQW5nbGUgPj0gYW5nbGUpIGFuZCAocG9zQW5nbGUgPCAoYW5nbGUgKyBAc2xpY2VBbmdsZSkpXHJcbiAgICAgICAgcmV0dXJuIHNsaWNlXHJcbiAgICAgIGFuZ2xlICs9IEBzbGljZUFuZ2xlXHJcbiAgICByZXR1cm4gMFxyXG5cclxuICBwbGF5ZXJMYXlvdXQ6IChjb2xvciwgc2xpY2UsIHJhZGl1cywgaGVhbHRoLCBhbmdsZSA9IG51bGwpIC0+XHJcbiAgICBjID0gQHVucG9sYXIoKChzbGljZSArIDEpICUgQHNsaWNlQ291bnQpICogQHNsaWNlQW5nbGUsIHJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXHJcbiAgICBpZiBhbmdsZSA9PSBudWxsXHJcbiAgICAgIGFuZ2xlID0gQGZhY2luZ091dEFuZ2xlKGMueCwgYy55KVxyXG4gICAgcGxheWVyID1cclxuICAgICAgeDogYy54XHJcbiAgICAgIHk6IGMueVxyXG4gICAgICBhbmdsZTogYW5nbGVcclxuICAgICAgc2xpY2U6IHNsaWNlXHJcbiAgICAgIGhlYWx0aDogaGVhbHRoXHJcbiAgICAgIGNvbG9yOiBjb2xvclxyXG4gICAgcmV0dXJuIHBsYXllclxyXG5cclxuICBkaXN0YW5jZTogKHgwLCB5MCwgeDEsIHkxKSAtPlxyXG4gICAgeGQgPSB4MSAtIHgwXHJcbiAgICB5ZCA9IHkxIC0geTBcclxuICAgIHJldHVybiBNYXRoLnNxcnQoKHhkKnhkKSArICh5ZCp5ZCkpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBvbkRyYWdQb3M6ICh4LCB5KSAtPlxyXG4gICAgQGRyYWdnaW5nID0gdHJ1ZVxyXG5cclxuICAgIGlmIEBkcmFnU2xpY2UgPT0gLTFcclxuICAgICAgIyBGaWd1cmUgb3V0IHdoaWNoIHBsYXllciB3ZSBzdGFydGVkIG9uXHJcbiAgICAgIGNsb3Nlc3RJbmRleCA9IDBcclxuICAgICAgY2xvc2VzdFBvc2l0aW9uID0gQGNhbnZhcy5oZWlnaHQgKiAxMDAwXHJcbiAgICAgIGZvciBwbGF5ZXIsIGluZGV4IGluIEBwbGF5ZXJzXHJcbiAgICAgICAgZGlzdCA9IEBkaXN0YW5jZShwbGF5ZXIueCwgcGxheWVyLnksIHgsIHkpXHJcbiAgICAgICAgaWYgY2xvc2VzdFBvc2l0aW9uID4gZGlzdFxyXG4gICAgICAgICAgY2xvc2VzdFBvc2l0aW9uID0gZGlzdFxyXG4gICAgICAgICAgY2xvc2VzdEluZGV4ID0gaW5kZXhcclxuICAgICAgQGRyYWdQbGF5ZXJJbmRleCA9IGNsb3Nlc3RJbmRleFxyXG5cclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICMgVE9ETzogZGlzdHJpYnV0ZSBhIGJ1bmNoIG9mIG1hdGggb3V0XHJcbiAgICAgIEBkcmFnU2xpY2UgPSBAcG9zVG9TbGljZSh4LCB5KVxyXG5cclxuICAgICAgQGRyYWdEZWx0YSA9IEBkcmFnU2xpY2UgLSBAcGxheWVyc1tAZHJhZ1BsYXllckluZGV4XS5zbGljZVxyXG4gICAgICBpZiBAZHJhZ0RlbHRhID4gQGhhbGZTbGljZUNvdW50XHJcbiAgICAgICAgQGRyYWdEZWx0YSAtPSBAc2xpY2VDb3VudFxyXG4gICAgICBpZiBAZHJhZ0RlbHRhIDwgLUBoYWxmU2xpY2VDb3VudFxyXG4gICAgICAgIEBkcmFnRGVsdGEgKz0gQHNsaWNlQ291bnRcclxuICAgICAgY29uc29sZS5sb2cgXCJAZHJhZ0RlbHRhIHN0YXJ0aW5nIGF0ICN7QGRyYWdEZWx0YX1cIlxyXG4gICAgZWxzZVxyXG4gICAgICBuZXdEcmFnU2xpY2UgPSBAcG9zVG9TbGljZSh4LCB5KVxyXG4gICAgICBpZiBAZHJhZ1NsaWNlICE9IG5ld0RyYWdTbGljZVxyXG4gICAgICAgIHNsaWNlT2Zmc2V0ID0gbmV3RHJhZ1NsaWNlIC0gQGRyYWdTbGljZVxyXG4gICAgICAgIGlmIHNsaWNlT2Zmc2V0ID4gQGhhbGZTbGljZUNvdW50XHJcbiAgICAgICAgICBzbGljZU9mZnNldCAtPSBAc2xpY2VDb3VudFxyXG4gICAgICAgIGlmIHNsaWNlT2Zmc2V0IDwgLUBoYWxmU2xpY2VDb3VudFxyXG4gICAgICAgICAgc2xpY2VPZmZzZXQgKz0gQHNsaWNlQ291bnRcclxuICAgICAgICBAZHJhZ0RlbHRhICs9IHNsaWNlT2Zmc2V0XHJcbiAgICAgICAgY29uc29sZS5sb2cgXCJAZHJhZ0RlbHRhIG5vdyBhdCAje0BkcmFnRGVsdGF9XCJcclxuXHJcbiAgICAgICAgQGRyYWdTbGljZSA9IG5ld0RyYWdTbGljZVxyXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIEBkcmFnWCA9IHhcclxuICAgIEBkcmFnWSA9IHlcclxuICAgICMgQGRyYWdBbmdsZSA9IE1hdGguYXRhbjIoeSAtIEBjZW50ZXIueSwgeCAtIEBjZW50ZXIueClcclxuICAgIHJldHVyblxyXG5cclxuICBvbkRyYWdSZXNldDogLT5cclxuICAgIEBkcmFnZ2luZyA9IGZhbHNlXHJcbiAgICBAZHJhZ1BsYXllckluZGV4ID0gLTFcclxuICAgIEBkcmFnWCA9IC0xXHJcbiAgICBAZHJhZ1kgPSAtMVxyXG4gICAgQGRyYWdTbGljZSA9IC0xXHJcbiAgICBAZHJhZ0RlbHRhID0gMFxyXG5cclxuICBtb3VzZWRvd246ICh4LCB5KSAtPlxyXG4gICAgZGlzdGFuY2VGcm9tQ2VudGVyID0gQGRpc3RhbmNlKHgsIHksIEBjZW50ZXIueCwgQGNlbnRlci55KVxyXG4gICAgaWYgZGlzdGFuY2VGcm9tQ2VudGVyIDwgQG1lbnVSYWRpdXNcclxuICAgICAgQGFwcC5zd2l0Y2hWaWV3KFwibWVudVwiKVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICAjIGNvbnNvbGUubG9nIFwibW91c2Vkb3duICN7eH0sICN7eX1cIlxyXG4gICAgQG9uRHJhZ1Bvcyh4LCB5KVxyXG4gICAgQGRyYXcoKVxyXG5cclxuICBtb3VzZW1vdmU6ICh4LCB5LCBidXR0b25zKSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcIm1vdXNlZG93biAje3h9LCAje3l9XCJcclxuICAgIGlmIGJ1dHRvbnMgPT0gMVxyXG4gICAgICBAb25EcmFnUG9zKHgsIHkpXHJcbiAgICAgIEBkcmF3KClcclxuXHJcbiAgbW91c2V1cDogLT5cclxuICAgIGlmIEBkcmFnZ2luZ1xyXG4gICAgICBkcmFnUGxheWVyID0gQHBsYXllcnNbQGRyYWdQbGF5ZXJJbmRleF1cclxuICAgICAgbmV3SGVhbHRoID0gZHJhZ1BsYXllci5oZWFsdGhcclxuICAgICAgaWYgQGRyYWdEZWx0YSA+IDFcclxuICAgICAgICBuZXdIZWFsdGggKz0gQGRyYWdEZWx0YSAtIDFcclxuICAgICAgZWxzZSBpZiBAZHJhZ0RlbHRhIDwgMFxyXG4gICAgICAgIG5ld0hlYWx0aCArPSBAZHJhZ0RlbHRhXHJcbiAgICAgIGRyYWdQbGF5ZXIuaGVhbHRoID0gbmV3SGVhbHRoXHJcbiAgICAgIEBzYXZlKClcclxuXHJcbiAgICBAb25EcmFnUmVzZXQoKVxyXG4gICAgQGRyYXcoKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBsb2FkOiAtPlxyXG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxyXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAganNvblN0cmluZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibXRnc3RhdGVcIilcclxuICAgIGlmIGpzb25TdHJpbmcgPT0gbnVsbFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICB0cnlcclxuICAgICAgc3RhdGUgPSBKU09OLnBhcnNlKGpzb25TdHJpbmcpXHJcbiAgICBjYXRjaFxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBpZiBub3Qgc3RhdGVcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgIyBUT0RPOiB2YWxpZGF0ZSBpbmZvXHJcbiAgICBAcGxheWVycyA9IHN0YXRlLnBsYXllcnNcclxuICAgIEBsYXlvdXRJbmRleCA9IHN0YXRlLmxheW91dEluZGV4XHJcblxyXG4gICAgY29uc29sZS5sb2cgXCJMb2FkZWQgc3RhdGUuXCJcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHNhdmU6IC0+XHJcbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXHJcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgc3RhdGUgPVxyXG4gICAgICBwbGF5ZXJzOiBAcGxheWVyc1xyXG4gICAgICBsYXlvdXRJbmRleDogQGxheW91dEluZGV4XHJcblxyXG4gICAganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KHN0YXRlKVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJtdGdzdGF0ZVwiLCBqc29uU3RyaW5nKVxyXG4gICAgY29uc29sZS5sb2cgXCJTYXZlZCBzdGF0ZSAoI3tqc29uU3RyaW5nLmxlbmd0aH0gY2hhcnMpXCJcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBzbGljZU9mZnNldFRvRGVsdGE6IChvZmZzZXQpIC0+XHJcbiAgICBpZiBvZmZzZXQgPT0gMFxyXG4gICAgICByZXR1cm4gMFxyXG5cclxuICAgIGlmIG9mZnNldCA8PSBAaGFsZlNsaWNlQ291bnRcclxuICAgICAgIyB0cnlpbmcgdG8gaW5jcmVtZW50XHJcbiAgICAgIHJldHVybiBvZmZzZXRcclxuICAgIGVsc2VcclxuICAgICAgIyB0cnlpbmcgdG8gZGVjcmVtZW50XHJcbiAgICAgIHJldHVybiAtMSAqIChAc2xpY2VDb3VudCAtIG9mZnNldClcclxuXHJcbiAgZHJhdzogLT5cclxuICAgIGNvbnNvbGUubG9nIFwiZHJhdygpXCJcclxuXHJcbiAgICAjIENsZWFyIHNjcmVlbiB0byBibGFja1xyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgQ29sb3IuYmFja2dyb3VuZClcclxuICAgICMgQGFwcC5kcmF3UmVjdChAY2VudGVyLngsIEBjZW50ZXIueSwgMSwgMSwgXCJ3aGl0ZVwiLCAxKSAjIGRlYnVnIGNlbnRlciBkb3RcclxuXHJcbiAgICBAYXBwLnN0cm9rZUNpcmNsZShAY2VudGVyLngsIEBjZW50ZXIueSwgQG1lbnVSYWRpdXMsIFwid2hpdGVcIiwgNClcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIk1cIiwgQGNlbnRlci54LCBAY2VudGVyLnksIEBmb250cy5tZW51LCBDb2xvci5tZW51LCAwKVxyXG5cclxuICAgIGZvciBwbGF5ZXIsIGluZGV4IGluIEBwbGF5ZXJzXHJcbiAgICAgIGNvbG9yID0gQ29sb3IuaGVhbHRoXHJcbiAgICAgIGlmIEBkcmFnZ2luZyBhbmQgKGluZGV4ID09IEBkcmFnUGxheWVySW5kZXgpXHJcbiAgICAgICAgY29sb3IgPSBDb2xvci5jaGFuZ2luZ0hlYWx0aFxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoICBTdHJpbmcocGxheWVyLmhlYWx0aCksIHBsYXllci54LCBwbGF5ZXIueSwgQGZvbnRzLmhlYWx0aCwgcGxheWVyLmNvbG9yLCBwbGF5ZXIuYW5nbGUpXHJcbiAgICAgIEBhcHAuc3Ryb2tlVGV4dENlbnRlcmVkKFN0cmluZyhwbGF5ZXIuaGVhbHRoKSwgcGxheWVyLngsIHBsYXllci55LCBAZm9udHMuaGVhbHRoLCBcIndoaXRlXCIsIDQsIHBsYXllci5hbmdsZSlcclxuXHJcbiAgICBpZiBAZHJhZ2dpbmdcclxuICAgICAgZHJhZ1BsYXllciA9IEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdXHJcblxyXG4gICAgICBAYXBwLmRyYXdBcmMoQGNlbnRlci54LCBAY2VudGVyLnksIEBkaWFsUmFkaXVzLCAwLCBUV09fUEksIENvbG9yLmRpYWwpXHJcblxyXG4gICAgICBmb3IgaSBpbiBbMC4uLkBoYWxmU2xpY2VDb3VudCsxXVxyXG4gICAgICAgIHNsaWNlID0gKEBkcmFnU2xpY2UgKyBpKSAlIEBzbGljZUNvdW50XHJcbiAgICAgICAgYW5nbGUgPSBzbGljZSAqIEBzbGljZUFuZ2xlXHJcbiAgICAgICAgdmFsdWUgPSBAZHJhZ0RlbHRhICsgaVxyXG4gICAgICAgIGlmIHNsaWNlID09IEBkcmFnU2xpY2VcclxuICAgICAgICAgIEBhcHAuZHJhd0FyYyhAY2VudGVyLngsIEBjZW50ZXIueSwgQGRpYWxSYWRpdXMsIGFuZ2xlLCBhbmdsZSArIEBzbGljZUFuZ2xlLCBDb2xvci5kaWFsSGlnaGxpZ2h0KVxyXG4gICAgICAgIGlmICh2YWx1ZSAhPSAwKSBhbmQgKHZhbHVlICE9IDEpXHJcbiAgICAgICAgICBpZiB2YWx1ZSA+IDBcclxuICAgICAgICAgICAgdGV4dFYgPSBcIisje3ZhbHVlIC0gMX1cIlxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5hZGRUZXh0XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRleHRWID0gXCIje3ZhbHVlfVwiXHJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnN1YnRyYWN0VGV4dFxyXG4gICAgICAgICAgdGV4dFBvcyA9IEB1bnBvbGFyKGFuZ2xlICsgQGhhbGZTbGljZUFuZ2xlLCBAZGlhbEluY3JlbWVudFJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXHJcbiAgICAgICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQodGV4dFYsIHRleHRQb3MueCwgdGV4dFBvcy55LCBAZm9udHMuaW5jcmVtZW50LCB0ZXh0Q29sb3IsIEBmYWNpbmdPdXRBbmdsZSh0ZXh0UG9zLngsIHRleHRQb3MueSkpXHJcblxyXG4gICAgICBmb3IgaSBpbiBbMS4uLkBoYWxmU2xpY2VDb3VudF1cclxuICAgICAgICBzbGljZSA9IChAc2xpY2VDb3VudCArIEBkcmFnU2xpY2UgLSBpKSAlIEBzbGljZUNvdW50XHJcbiAgICAgICAgYW5nbGUgPSBzbGljZSAqIEBzbGljZUFuZ2xlXHJcbiAgICAgICAgdmFsdWUgPSBAZHJhZ0RlbHRhIC0gaVxyXG4gICAgICAgIGlmICh2YWx1ZSAhPSAwKSBhbmQgKHZhbHVlICE9IDEpXHJcbiAgICAgICAgICBpZiB2YWx1ZSA+IDBcclxuICAgICAgICAgICAgdGV4dFYgPSBcIisje3ZhbHVlIC0gMX1cIlxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5hZGRUZXh0XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRleHRWID0gXCIje3ZhbHVlfVwiXHJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnN1YnRyYWN0VGV4dFxyXG4gICAgICAgICAgdGV4dFBvcyA9IEB1bnBvbGFyKGFuZ2xlICsgQGhhbGZTbGljZUFuZ2xlLCBAZGlhbEluY3JlbWVudFJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXHJcbiAgICAgICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQodGV4dFYsIHRleHRQb3MueCwgdGV4dFBvcy55LCBAZm9udHMuaW5jcmVtZW50LCB0ZXh0Q29sb3IsIEBmYWNpbmdPdXRBbmdsZSh0ZXh0UG9zLngsIHRleHRQb3MueSkpXHJcblxyXG4gICAgICBAYXBwLnN0cm9rZUNpcmNsZShAY2VudGVyLngsIEBjZW50ZXIueSwgQGRpYWxSYWRpdXMsIFwid2hpdGVcIiwgNClcclxuXHJcbiAgICAgIGVzdGltYXRlZEhlYWx0aCA9IGRyYWdQbGF5ZXIuaGVhbHRoXHJcbiAgICAgIGlmIEBkcmFnRGVsdGEgPiAxXHJcbiAgICAgICAgZXN0aW1hdGVkSGVhbHRoICs9IEBkcmFnRGVsdGEgLSAxXHJcbiAgICAgIGVsc2UgaWYgQGRyYWdEZWx0YSA8IDBcclxuICAgICAgICBlc3RpbWF0ZWRIZWFsdGggKz0gQGRyYWdEZWx0YVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoICBlc3RpbWF0ZWRIZWFsdGgsIEBjZW50ZXIueCwgQGNlbnRlci55LCBAZm9udHMuaGVhbHRoLCBkcmFnUGxheWVyLmNvbG9yLCBkcmFnUGxheWVyLmFuZ2xlKVxyXG4gICAgICBAYXBwLnN0cm9rZVRleHRDZW50ZXJlZChlc3RpbWF0ZWRIZWFsdGgsIEBjZW50ZXIueCwgQGNlbnRlci55LCBAZm9udHMuaGVhbHRoLCBcIndoaXRlXCIsIDQsIGRyYWdQbGF5ZXIuYW5nbGUpXHJcblxyXG4gICAgcmV0dXJuXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb3VudGVyVmlld1xyXG4iLCJCVVRUT05fSEVJR0hUID0gMC4wNlxyXG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcclxuQlVUVE9OX1NQQUNJTkcgPSAwLjA4XHJcbkJVVFRPTl9TRVBBUkFUT1IgPSAwLjAzXHJcblxyXG5idXR0b25Qb3MgPSAoaW5kZXgpIC0+XHJcbiAgeSA9IEZJUlNUX0JVVFRPTl9ZICsgKEJVVFRPTl9TUEFDSU5HICogaW5kZXgpXHJcbiAgaWYgaW5kZXggPiAzXHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDRcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNlxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgcmV0dXJuIHlcclxuXHJcbmNsYXNzIExheW91dFZpZXdcclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMsIEBjb3VudGVyKSAtPlxyXG4gICAgQGJ1dHRvbnMgPVxyXG4gICAgICBjYW5jZWw6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDcpXHJcbiAgICAgICAgdGV4dDogXCJDYW5jZWxcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3Nzc3N1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAY2FuY2VsLmJpbmQodGhpcylcclxuXHJcbiAgICAjIG1ha2VzIGZvciBhIEBzY2FsZSB4IEBzY2FsZSBibG9jayBvZiBjaG9pY2VzXHJcbiAgICBAc2NhbGUgPSA1XHJcblxyXG4gICAgQG5hbWVGb250UGl4ZWxzID0gQGNvdW50ZXIuaGVhbHRoRm9udFBpeGVscyAvIEBzY2FsZSAvIDNcclxuICAgIEBmb250cyA9XHJcbiAgICAgIGhlYWx0aDogQGFwcC5yZWdpc3RlckZvbnQoXCJoZWFsdGhcIiwgXCIje0Bjb3VudGVyLmhlYWx0aEZvbnRQaXhlbHMgLyBAc2NhbGV9cHggSW5zdHJ1Y3Rpb24sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBuYW1lOiAgIEBhcHAucmVnaXN0ZXJGb250KFwibmFtZVwiLCAgIFwiI3tAbmFtZUZvbnRQaXhlbHN9cHggSW5zdHJ1Y3Rpb24sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxyXG4gICAgQGJ1dHRvbkhlaWdodCA9IEBjYW52YXMuaGVpZ2h0ICogQlVUVE9OX0hFSUdIVFxyXG4gICAgYnV0dG9uWCA9IChAY2FudmFzLndpZHRoIC0gYnV0dG9uV2lkdGgpIC8gMlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBidXR0b24ueCA9IGJ1dHRvblhcclxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XHJcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcclxuICAgICAgYnV0dG9uLmggPSBAYnV0dG9uSGVpZ2h0XHJcblxyXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcclxuICAgIEBidXR0b25Gb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje2J1dHRvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4xKVxyXG4gICAgQHRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3t0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd0xheW91dDogKGxheW91dCwgb3gsIG95KSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJkcmF3aW5nIGxheW91dFwiLCBsYXlvdXRcclxuICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KG94LCBveSwgQGNhbnZhcy53aWR0aCAvIEBzY2FsZSwgQGNhbnZhcy5oZWlnaHQgLyBAc2NhbGUsIDAsIEBjb3VudGVyLkNvbG9yLmJhY2tncm91bmQsIFwiYmxhY2tcIilcclxuICAgIGZvciBwbGF5ZXIgaW4gbGF5b3V0LnBsYXllcnNcclxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHBsYXllci5oZWFsdGgsIG94ICsgKHBsYXllci54IC8gQHNjYWxlKSwgb3kgKyAocGxheWVyLnkgLyBAc2NhbGUpLCBAZm9udHMuaGVhbHRoLCBwbGF5ZXIuY29sb3IsIHBsYXllci5hbmdsZSlcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChsYXlvdXQubmFtZSwgb3ggKyAoQGNhbnZhcy53aWR0aCAvIEBzY2FsZSAvIDIpLCBveSArIEBuYW1lRm9udFBpeGVscywgQGZvbnRzLm5hbWUsIFwid2hpdGVcIiwgMClcclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMDAwMFwiKVxyXG5cclxuICAgIGZvciBsYXlvdXQsIGkgaW4gQGNvdW50ZXIubGF5b3V0c1xyXG4gICAgICB4ID0gKGkgJSBAc2NhbGUpICogQGNhbnZhcy53aWR0aCAvIEBzY2FsZVxyXG4gICAgICB5ID0gTWF0aC5mbG9vcihpIC8gQHNjYWxlKSAqIEBjYW52YXMuaGVpZ2h0IC8gQHNjYWxlXHJcbiAgICAgIEBkcmF3TGF5b3V0KGxheW91dCwgeCwgeSlcclxuXHJcbiAgICBzaGFkb3dPZmZzZXQgPSBAY2FudmFzLmhlaWdodCAqIDAuMDFcclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLnggKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi55ICsgc2hhZG93T2Zmc2V0LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBcImJsYWNrXCIsIFwiYmxhY2tcIilcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBidXR0b24uYmdDb2xvciwgXCIjOTk5OTk5XCIpXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLncgLyAyKSwgYnV0dG9uLnkgKyAoYnV0dG9uLmggLyAyKSwgQGJ1dHRvbkZvbnQsIGJ1dHRvbi50ZXh0Q29sb3IpXHJcblxyXG4gICAgIyBAYXBwLmRyYXdWZXJzaW9uKClcclxuXHJcbiAgbW91c2Vkb3duOiAoeCwgeSkgLT5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgaWYgKHkgPiBidXR0b24ueSkgJiYgKHkgPCAoYnV0dG9uLnkgKyBAYnV0dG9uSGVpZ2h0KSlcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiYnV0dG9uIHByZXNzZWQ6ICN7YnV0dG9uTmFtZX1cIlxyXG4gICAgICAgIGJ1dHRvbi5jbGljaygpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgY29uc29sZS5sb2cgXCIje3h9LCAje3l9XCJcclxuICAgIGxheW91dEluZGV4ID0gTWF0aC5mbG9vcih4IC8gKEBjYW52YXMud2lkdGggLyBAc2NhbGUpKSArIE1hdGguZmxvb3IoQHNjYWxlICogTWF0aC5mbG9vcih5IC8gKEBjYW52YXMuaGVpZ2h0IC8gQHNjYWxlKSkpXHJcbiAgICBpZiAobGF5b3V0SW5kZXggPj0gMCkgYW5kIChsYXlvdXRJbmRleCA8IEBjb3VudGVyLmxheW91dHMubGVuZ3RoKVxyXG4gICAgICBsYXlvdXQgPSBAY291bnRlci5sYXlvdXRzW2xheW91dEluZGV4XVxyXG4gICAgICBpZihjb25maXJtKFwiUmVzZXQgdG8gdGhlICcje2xheW91dC5uYW1lfScgbGF5b3V0P1wiKSlcclxuICAgICAgICBAY291bnRlci5jaG9vc2VMYXlvdXQobGF5b3V0SW5kZXgpXHJcbiAgICAgICAgQGFwcC5zd2l0Y2hWaWV3KFwiY291bnRlclwiKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG1vdXNlbW92ZTogKHgsIHksIGJ1dHRvbnMpIC0+XHJcbiAgbW91c2V1cDogLT5cclxuXHJcbiAgY2FuY2VsOiAtPlxyXG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwibWVudVwiKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYXlvdXRWaWV3XHJcbiIsIkJVVFRPTl9IRUlHSFQgPSAwLjA2XHJcbkZJUlNUX0JVVFRPTl9ZID0gMC4yMlxyXG5CVVRUT05fU1BBQ0lORyA9IDAuMDhcclxuQlVUVE9OX1NFUEFSQVRPUiA9IDAuMDNcclxuXHJcbmJ1dHRvblBvcyA9IChpbmRleCkgLT5cclxuICB5ID0gRklSU1RfQlVUVE9OX1kgKyAoQlVUVE9OX1NQQUNJTkcgKiBpbmRleClcclxuICBpZiBpbmRleCA+IDNcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNFxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgaWYgaW5kZXggPiA2XHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICByZXR1cm4geVxyXG5cclxuY2xhc3MgTWVudVZpZXdcclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XHJcbiAgICBAYnV0dG9ucyA9XHJcbiAgICAgIGNob29zZUxheW91dDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMSlcclxuICAgICAgICB0ZXh0OiBcIkNob29zZSBMYXlvdXRcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzU1NTU1NVwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAY2hvb3NlTGF5b3V0LmJpbmQodGhpcylcclxuICAgICAgcmVzZXRBbGxIZWFsdGg6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDIpXHJcbiAgICAgICAgdGV4dDogXCJSZXNldCBBbGwgSGVhbHRoXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM1NTU1NTVcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc2V0QWxsSGVhbHRoLmJpbmQodGhpcylcclxuICAgICAgcmVzdW1lOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg3KVxyXG4gICAgICAgIHRleHQ6IFwiUmVzdW1lXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3NzdcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc3VtZS5iaW5kKHRoaXMpXHJcblxyXG4gICAgYnV0dG9uV2lkdGggPSBAY2FudmFzLndpZHRoICogMC44XHJcbiAgICBAYnV0dG9uSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgKiBCVVRUT05fSEVJR0hUXHJcbiAgICBidXR0b25YID0gKEBjYW52YXMud2lkdGggLSBidXR0b25XaWR0aCkgLyAyXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGJ1dHRvbi54ID0gYnV0dG9uWFxyXG4gICAgICBidXR0b24ueSA9IEBjYW52YXMuaGVpZ2h0ICogYnV0dG9uLnlcclxuICAgICAgYnV0dG9uLncgPSBidXR0b25XaWR0aFxyXG4gICAgICBidXR0b24uaCA9IEBidXR0b25IZWlnaHRcclxuXHJcbiAgICBidXR0b25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAYnV0dG9uSGVpZ2h0ICogMC40KVxyXG4gICAgQGJ1dHRvbkZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7YnV0dG9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjEpXHJcbiAgICBAdGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3RpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjMzMzMzMzXCIpXHJcblxyXG4gICAgeCA9IEBjYW52YXMud2lkdGggLyAyXHJcbiAgICBzaGFkb3dPZmZzZXQgPSBAY2FudmFzLmhlaWdodCAqIDAuMDFcclxuXHJcbiAgICB5MSA9IEBjYW52YXMuaGVpZ2h0ICogMC4wNVxyXG4gICAgeTIgPSBAY2FudmFzLmhlaWdodCAqIDAuMTVcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIk1UR1wiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJNVEdcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLnggKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi55ICsgc2hhZG93T2Zmc2V0LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBcImJsYWNrXCIsIFwiYmxhY2tcIilcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBidXR0b24uYmdDb2xvciwgXCIjOTk5OTk5XCIpXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLncgLyAyKSwgYnV0dG9uLnkgKyAoYnV0dG9uLmggLyAyKSwgQGJ1dHRvbkZvbnQsIGJ1dHRvbi50ZXh0Q29sb3IpXHJcblxyXG4gICAgQGFwcC5kcmF3VmVyc2lvbigpXHJcblxyXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGlmICh5ID4gYnV0dG9uLnkpICYmICh5IDwgKGJ1dHRvbi55ICsgQGJ1dHRvbkhlaWdodCkpXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImJ1dHRvbiBwcmVzc2VkOiAje2J1dHRvbk5hbWV9XCJcclxuICAgICAgICBidXR0b24uY2xpY2soKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG1vdXNlbW92ZTogKHgsIHksIGJ1dHRvbnMpIC0+XHJcbiAgbW91c2V1cDogLT5cclxuXHJcbiAgY2hvb3NlTGF5b3V0OiAtPlxyXG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwibGF5b3V0XCIpXHJcblxyXG4gIHJlc2V0QWxsSGVhbHRoOiAtPlxyXG4gICAgaWYoY29uZmlybShcIlJlc2V0IGFsbCBoZWFsdGg/XCIpKVxyXG4gICAgICBAYXBwLnJlc2V0QWxsSGVhbHRoKClcclxuXHJcbiAgcmVzdW1lOiAtPlxyXG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwiY291bnRlclwiKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51Vmlld1xyXG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXHJcbiAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxyXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoY2FudmFzLCBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXNbMF0pXHJcbiAgY2FudmFzUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICB3aW5kb3cuYXBwID0gbmV3IEFwcChjYW52YXMpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hzdGFydFwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgd2luZG93LmFwcC5tb3VzZWRvd24oeCwgeSlcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaG1vdmVcIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAgIHdpbmRvdy5hcHAubW91c2Vtb3ZlKHgsIHksIDEpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hlbmRcIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHdpbmRvdy5hcHAubW91c2V1cCgpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB4ID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAgIHdpbmRvdy5hcHAubW91c2Vkb3duKHgsIHkpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vtb3ZlXCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB4ID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAgIGJ1dHRvbnMgPSBlLmJ1dHRvbnNcclxuICAgIHdpbmRvdy5hcHAubW91c2Vtb3ZlKHgsIHksIGJ1dHRvbnMpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2V1cFwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgd2luZG93LmFwcC5tb3VzZXVwKClcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpIC0+XHJcbiAgICBpbml0KClcclxuLCBmYWxzZSlcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjAuMC4xXCIiLCIvKiBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMC4xMyAtIMKpIEJyYW0gU3RlaW4uIExpY2Vuc2U6IEJTRC0zLUNsYXVzZSAqLyhmdW5jdGlvbigpe2Z1bmN0aW9uIGwoYSxiKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLGIsITEpOmEuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIixiKX1mdW5jdGlvbiBtKGEpe2RvY3VtZW50LmJvZHk/YSgpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbiBjKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjKTthKCl9KTpkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uIGsoKXtpZihcImludGVyYWN0aXZlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGV8fFwiY29tcGxldGVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZSlkb2N1bWVudC5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGspLGEoKX0pfTtmdW5jdGlvbiByKGEpe3RoaXMuYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RoaXMuYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKTt0aGlzLmEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpO3RoaXMuYj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmc9LTE7dGhpcy5iLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmMuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xudGhpcy5mLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmguc3R5bGUuY3NzVGV4dD1cImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7XCI7dGhpcy5iLmFwcGVuZENoaWxkKHRoaXMuaCk7dGhpcy5jLmFwcGVuZENoaWxkKHRoaXMuZik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYyl9XG5mdW5jdGlvbiB0KGEsYil7YS5hLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDpcIitiK1wiO1wifWZ1bmN0aW9uIHkoYSl7dmFyIGI9YS5hLm9mZnNldFdpZHRoLGM9YisxMDA7YS5mLnN0eWxlLndpZHRoPWMrXCJweFwiO2EuYy5zY3JvbGxMZWZ0PWM7YS5iLnNjcm9sbExlZnQ9YS5iLnNjcm9sbFdpZHRoKzEwMDtyZXR1cm4gYS5nIT09Yj8oYS5nPWIsITApOiExfWZ1bmN0aW9uIHooYSxiKXtmdW5jdGlvbiBjKCl7dmFyIGE9azt5KGEpJiZhLmEucGFyZW50Tm9kZSYmYihhLmcpfXZhciBrPWE7bChhLmIsYyk7bChhLmMsYyk7eShhKX07ZnVuY3Rpb24gQShhLGIpe3ZhciBjPWJ8fHt9O3RoaXMuZmFtaWx5PWE7dGhpcy5zdHlsZT1jLnN0eWxlfHxcIm5vcm1hbFwiO3RoaXMud2VpZ2h0PWMud2VpZ2h0fHxcIm5vcm1hbFwiO3RoaXMuc3RyZXRjaD1jLnN0cmV0Y2h8fFwibm9ybWFsXCJ9dmFyIEI9bnVsbCxDPW51bGwsRT1udWxsLEY9bnVsbDtmdW5jdGlvbiBHKCl7aWYobnVsbD09PUMpaWYoSigpJiYvQXBwbGUvLnRlc3Qod2luZG93Lm5hdmlnYXRvci52ZW5kb3IpKXt2YXIgYT0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7Qz0hIWEmJjYwMz5wYXJzZUludChhWzFdLDEwKX1lbHNlIEM9ITE7cmV0dXJuIEN9ZnVuY3Rpb24gSigpe251bGw9PT1GJiYoRj0hIWRvY3VtZW50LmZvbnRzKTtyZXR1cm4gRn1cbmZ1bmN0aW9uIEsoKXtpZihudWxsPT09RSl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7YS5zdHlsZS5mb250PVwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIn1jYXRjaChiKXt9RT1cIlwiIT09YS5zdHlsZS5mb250fXJldHVybiBFfWZ1bmN0aW9uIEwoYSxiKXtyZXR1cm5bYS5zdHlsZSxhLndlaWdodCxLKCk/YS5zdHJldGNoOlwiXCIsXCIxMDBweFwiLGJdLmpvaW4oXCIgXCIpfVxuQS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMsaz1hfHxcIkJFU2Jzd3lcIixxPTAsRD1ifHwzRTMsSD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtpZihKKCkmJiFHKCkpe3ZhciBNPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gZSgpeyhuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PUQ/YigpOmRvY3VtZW50LmZvbnRzLmxvYWQoTChjLCdcIicrYy5mYW1pbHkrJ1wiJyksaykudGhlbihmdW5jdGlvbihjKXsxPD1jLmxlbmd0aD9hKCk6c2V0VGltZW91dChlLDI1KX0sZnVuY3Rpb24oKXtiKCl9KX1lKCl9KSxOPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYyl7cT1zZXRUaW1lb3V0KGMsRCl9KTtQcm9taXNlLnJhY2UoW04sTV0pLnRoZW4oZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQocSk7YShjKX0sZnVuY3Rpb24oKXtiKGMpfSl9ZWxzZSBtKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gdSgpe3ZhciBiO2lmKGI9LTEhPVxuZiYmLTEhPWd8fC0xIT1mJiYtMSE9aHx8LTEhPWcmJi0xIT1oKShiPWYhPWcmJmYhPWgmJmchPWgpfHwobnVsbD09PUImJihiPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSxCPSEhYiYmKDUzNj5wYXJzZUludChiWzFdLDEwKXx8NTM2PT09cGFyc2VJbnQoYlsxXSwxMCkmJjExPj1wYXJzZUludChiWzJdLDEwKSkpLGI9QiYmKGY9PXYmJmc9PXYmJmg9PXZ8fGY9PXcmJmc9PXcmJmg9PXd8fGY9PXgmJmc9PXgmJmg9PXgpKSxiPSFiO2ImJihkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxjbGVhclRpbWVvdXQocSksYShjKSl9ZnVuY3Rpb24gSSgpe2lmKChuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PUQpZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksYihjKTtlbHNle3ZhciBhPWRvY3VtZW50LmhpZGRlbjtpZighMD09PWF8fHZvaWQgMD09PWEpZj1lLmEub2Zmc2V0V2lkdGgsXG5nPW4uYS5vZmZzZXRXaWR0aCxoPXAuYS5vZmZzZXRXaWR0aCx1KCk7cT1zZXRUaW1lb3V0KEksNTApfX12YXIgZT1uZXcgcihrKSxuPW5ldyByKGspLHA9bmV3IHIoayksZj0tMSxnPS0xLGg9LTEsdj0tMSx3PS0xLHg9LTEsZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2QuZGlyPVwibHRyXCI7dChlLEwoYyxcInNhbnMtc2VyaWZcIikpO3QobixMKGMsXCJzZXJpZlwiKSk7dChwLEwoYyxcIm1vbm9zcGFjZVwiKSk7ZC5hcHBlbmRDaGlsZChlLmEpO2QuYXBwZW5kQ2hpbGQobi5hKTtkLmFwcGVuZENoaWxkKHAuYSk7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkKTt2PWUuYS5vZmZzZXRXaWR0aDt3PW4uYS5vZmZzZXRXaWR0aDt4PXAuYS5vZmZzZXRXaWR0aDtJKCk7eihlLGZ1bmN0aW9uKGEpe2Y9YTt1KCl9KTt0KGUsTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNhbnMtc2VyaWYnKSk7eihuLGZ1bmN0aW9uKGEpe2c9YTt1KCl9KTt0KG4sTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNlcmlmJykpO1xueihwLGZ1bmN0aW9uKGEpe2g9YTt1KCl9KTt0KHAsTChjLCdcIicrYy5mYW1pbHkrJ1wiLG1vbm9zcGFjZScpKX0pfSl9O1wib2JqZWN0XCI9PT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPUE6KHdpbmRvdy5Gb250RmFjZU9ic2VydmVyPUEsd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIucHJvdG90eXBlLmxvYWQ9QS5wcm90b3R5cGUubG9hZCk7fSgpKTtcbiJdfQ==
