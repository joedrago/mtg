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

PlayerColors = ["#ffaaaa", "#aaffaa", "#aaaaff", "#ffffaa", "#ffaaff", "#aaffff"];

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
    fRadius6 = this.center.x * 1.1;
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
    jsonString = localStorage.getItem("state");
    if (jsonString === null) {
      return false;
    }
    state = JSON.parse(jsonString);
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
    localStorage.setItem("state", jsonString);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXENvdW50ZXJWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcTGF5b3V0Vmlldy5jb2ZmZWUiLCJnYW1lXFxzcmNcXE1lbnVWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcbWFpbi5jb2ZmZWUiLCJnYW1lXFxzcmNcXHZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVI7O0FBQ2QsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUjs7QUFFSjtFQUNTLGFBQUMsTUFBRDtJQUFDLElBQUMsQ0FBQSxTQUFEO0lBQ1osSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsSUFBbkI7SUFDUCxJQUFDLENBQUEsUUFBRCxDQUFVLFNBQVY7SUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGFBQVY7SUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTO0lBRVQsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQTVCO0lBQ3JCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxTQUFkLEVBQTRCLElBQUMsQ0FBQSxpQkFBRixHQUFvQix1QkFBL0M7SUFFZixJQUFDLENBQUEsb0JBQUQsR0FBd0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJ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cUMsU0FBQyxDQUFEO0FBQ25DLFFBQUE7SUFBQSxDQUFDLENBQUMsY0FBRixDQUFBO0lBQ0EsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO0lBQzNCLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztXQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7RUFKbUMsQ0FBckM7RUFNQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsV0FBeEIsRUFBcUMsU0FBQyxDQUFEO0FBQ25DLFFBQUE7SUFBQSxDQUFDLENBQUMsY0FBRixDQUFBO0lBQ0EsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO0lBQzNCLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztJQUMzQixPQUFBLEdBQVUsQ0FBQyxDQUFDO1dBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFYLENBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLE9BQTNCO0VBTG1DLENBQXJDO1NBT0EsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFNBQUMsQ0FBRDtJQUNqQyxDQUFDLENBQUMsY0FBRixDQUFBO1dBQ0EsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFYLENBQUE7RUFGaUMsQ0FBbkM7QUF2Q0s7O0FBMkNQLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxTQUFDLENBQUQ7U0FDNUIsSUFBQSxDQUFBO0FBRDRCLENBQWhDLEVBRUUsS0FGRjs7OztBQzdDQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0FqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRm9udEZhY2VPYnNlcnZlciA9IHJlcXVpcmUgJ2ZvbnRmYWNlb2JzZXJ2ZXInXHJcblxyXG5NZW51VmlldyA9IHJlcXVpcmUgJy4vTWVudVZpZXcnXHJcbkNvdW50ZXJWaWV3ID0gcmVxdWlyZSAnLi9Db3VudGVyVmlldydcclxuTGF5b3V0VmlldyA9IHJlcXVpcmUgJy4vTGF5b3V0VmlldydcclxudmVyc2lvbiA9IHJlcXVpcmUgJy4vdmVyc2lvbidcclxuXHJcbmNsYXNzIEFwcFxyXG4gIGNvbnN0cnVjdG9yOiAoQGNhbnZhcykgLT5cclxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgQGxvYWRGb250KFwic2F4TW9ub1wiKVxyXG4gICAgQGxvYWRGb250KFwiSW5zdHJ1Y3Rpb25cIilcclxuICAgIEBmb250cyA9IHt9XHJcblxyXG4gICAgQHZlcnNpb25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDIpXHJcbiAgICBAdmVyc2lvbkZvbnQgPSBAcmVnaXN0ZXJGb250KFwidmVyc2lvblwiLCBcIiN7QHZlcnNpb25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBnZW5lcmF0aW5nRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA0KVxyXG4gICAgQGdlbmVyYXRpbmdGb250ID0gQHJlZ2lzdGVyRm9udChcImdlbmVyYXRpbmdcIiwgXCIje0BnZW5lcmF0aW5nRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAdmlld3MgPVxyXG4gICAgICBtZW51OiBuZXcgTWVudVZpZXcodGhpcywgQGNhbnZhcylcclxuICAgICAgY291bnRlcjogbmV3IENvdW50ZXJWaWV3KHRoaXMsIEBjYW52YXMpXHJcbiAgICBAdmlld3MubGF5b3V0ID0gbmV3IExheW91dFZpZXcodGhpcywgQGNhbnZhcywgQHZpZXdzLmNvdW50ZXIpXHJcbiAgICBAc3dpdGNoVmlldyhcImNvdW50ZXJcIilcclxuXHJcbiAgbWVhc3VyZUZvbnRzOiAtPlxyXG4gICAgZm9yIGZvbnROYW1lLCBmIG9mIEBmb250c1xyXG4gICAgICBAY3R4LmZvbnQgPSBmLnN0eWxlXHJcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiXHJcbiAgICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgICBmLmhlaWdodCA9IE1hdGguZmxvb3IoQGN0eC5tZWFzdXJlVGV4dChcIm1cIikud2lkdGggKiAxLjEpICMgYmVzdCBoYWNrIGV2ZXJcclxuICAgICAgY29uc29sZS5sb2cgXCJGb250ICN7Zm9udE5hbWV9IG1lYXN1cmVkIGF0ICN7Zi5oZWlnaHR9IHBpeGVsc1wiXHJcbiAgICByZXR1cm5cclxuXHJcbiAgcmVnaXN0ZXJGb250OiAobmFtZSwgc3R5bGUpIC0+XHJcbiAgICBmb250ID1cclxuICAgICAgbmFtZTogbmFtZVxyXG4gICAgICBzdHlsZTogc3R5bGVcclxuICAgICAgaGVpZ2h0OiAwXHJcbiAgICBAZm9udHNbbmFtZV0gPSBmb250XHJcbiAgICBAbWVhc3VyZUZvbnRzKClcclxuICAgIHJldHVybiBmb250XHJcblxyXG4gIGxvYWRGb250OiAoZm9udE5hbWUpIC0+XHJcbiAgICBmb250ID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoZm9udE5hbWUpXHJcbiAgICBmb250LmxvYWQoKS50aGVuID0+XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiI3tmb250TmFtZX0gbG9hZGVkLCByZWRyYXdpbmcuLi5cIilcclxuICAgICAgQG1lYXN1cmVGb250cygpXHJcbiAgICAgIEBkcmF3KClcclxuXHJcbiAgc3dpdGNoVmlldzogKHZpZXcpIC0+XHJcbiAgICBAdmlldyA9IEB2aWV3c1t2aWV3XVxyXG4gICAgQGRyYXcoKVxyXG5cclxuICByZXNldEFsbEhlYWx0aDogLT5cclxuICAgIEB2aWV3cy5jb3VudGVyLnJlc2V0QWxsSGVhbHRoKClcclxuICAgIEBzd2l0Y2hWaWV3KFwiY291bnRlclwiKVxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQHZpZXcuZHJhdygpXHJcblxyXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XHJcbiAgICBAdmlldy5tb3VzZWRvd24oeCwgeSlcclxuXHJcbiAgbW91c2Vtb3ZlOiAoeCwgeSwgYnV0dG9ucykgLT5cclxuICAgIEB2aWV3Lm1vdXNlbW92ZSh4LCB5LCBidXR0b25zKVxyXG5cclxuICBtb3VzZXVwOiAoeCwgeSkgLT5cclxuICAgIEB2aWV3Lm1vdXNldXAoeCwgeSlcclxuXHJcbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5maWxsKClcclxuXHJcbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxyXG4gICAgQGN0eC5yb3VuZFJlY3QoeCwgeSwgdywgaCwgcilcclxuICAgIGlmIGZpbGxDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXHJcbiAgICAgIEBjdHguZmlsbCgpXHJcbiAgICBpZiBzdHJva2VDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxyXG4gICAgICBAY3R4LnN0cm9rZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1JlY3Q6ICh4LCB5LCB3LCBoLCBjb2xvciwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3TGluZTogKHgxLCB5MSwgeDIsIHkyLCBjb2xvciA9IFwiYmxhY2tcIiwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcclxuICAgIEBjdHgubGluZVRvKHgyLCB5MilcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd0FyYzogKHgsIHksIHIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBjb2xvcikgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubW92ZVRvKHgsIHkpXHJcbiAgICBAY3R4LmFyYyh4LCB5LCByLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSlcclxuICAgIEBjdHguY2xvc2VQYXRoKClcclxuICAgIEBjdHguZmlsbCgpXHJcblxyXG4gIHN0cm9rZUNpcmNsZTogKHgsIHksIHIsIGNvbG9yLCBsaW5lV2lkdGgpIC0+XHJcbiAgICBAY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4LmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJICogMilcclxuICAgIEBjdHguY2xvc2VQYXRoKClcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd1RleHRDZW50ZXJlZDogKHRleHQsIGN4LCBjeSwgZm9udCwgY29sb3IsIHJvdCkgLT5cclxuICAgIEBjdHguc2F2ZSgpXHJcbiAgICBAY3R4LnRyYW5zbGF0ZShjeCwgY3kpXHJcbiAgICBAY3R4LnJvdGF0ZShyb3QpXHJcbiAgICBAY3R4LmZvbnQgPSBmb250LnN0eWxlXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcblxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIDAsIChmb250LmhlaWdodCAvIDIpKVxyXG5cclxuICAgIEBjdHgucmVzdG9yZSgpXHJcblxyXG4gIHN0cm9rZVRleHRDZW50ZXJlZDogKHRleHQsIGN4LCBjeSwgZm9udCwgY29sb3IsIGxpbmVXaWR0aCwgcm90KSAtPlxyXG4gICAgQGN0eC5zYXZlKClcclxuICAgIEBjdHgudHJhbnNsYXRlKGN4LCBjeSlcclxuICAgIEBjdHgucm90YXRlKHJvdClcclxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxyXG4gICAgQGN0eC5zdHJva2VUZXh0KHRleHQsIDAsIChmb250LmhlaWdodCAvIDIpKVxyXG4gICAgQGN0eC5yZXN0b3JlKClcclxuXHJcbiAgZHJhd0xvd2VyTGVmdDogKHRleHQsIGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCJcclxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgMCwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3VmVyc2lvbjogKGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KFwidiN7dmVyc2lvbn1cIiwgQGNhbnZhcy53aWR0aCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMiksIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUucm91bmRSZWN0ID0gKHgsIHksIHcsIGgsIHIpIC0+XHJcbiAgaWYgKHcgPCAyICogcikgdGhlbiByID0gdyAvIDJcclxuICBpZiAoaCA8IDIgKiByKSB0aGVuIHIgPSBoIC8gMlxyXG4gIEBiZWdpblBhdGgoKVxyXG4gIEBtb3ZlVG8oeCtyLCB5KVxyXG4gIEBhcmNUbyh4K3csIHksICAgeCt3LCB5K2gsIHIpXHJcbiAgQGFyY1RvKHgrdywgeStoLCB4LCAgIHkraCwgcilcclxuICBAYXJjVG8oeCwgICB5K2gsIHgsICAgeSwgICByKVxyXG4gIEBhcmNUbyh4LCAgIHksICAgeCt3LCB5LCAgIHIpXHJcbiAgQGNsb3NlUGF0aCgpXHJcbiAgcmV0dXJuIHRoaXNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwXHJcbiIsIkNvbG9yID1cclxuICBiYWNrZ3JvdW5kOiBcIiMzMzMzMzNcIlxyXG4gIGRpYWw6IFwiIzMzMzMzM1wiXHJcbiAgZGlhbEhpZ2hsaWdodDogXCIjNjY2NjY2XCJcclxuICBoZWFsdGg6IFwid2hpdGVcIlxyXG4gIGNoYW5naW5nSGVhbHRoOiBcInJlZFwiXHJcbiAgYWRkVGV4dDogXCIjMDBmZjAwXCJcclxuICBzdWJ0cmFjdFRleHQ6IFwiI2ZmMDAwMFwiXHJcbiAgbWVudTogXCIjZmZmZmZmXCJcclxuXHJcblBsYXllckNvbG9ycyA9IFtcclxuICBcIiNmZmFhYWFcIlxyXG4gIFwiI2FhZmZhYVwiXHJcbiAgXCIjYWFhYWZmXCJcclxuICBcIiNmZmZmYWFcIlxyXG4gIFwiI2ZmYWFmZlwiXHJcbiAgXCIjYWFmZmZmXCJcclxuXVxyXG5cclxuVFdPX1BJID0gTWF0aC5QSSAqIDJcclxuXHJcbmNsb25lID0gKG9iaikgLT5cclxuICAjIFRPRE86IGZpbmQgc29tZXRoaW5nIGJldHRlcj9cclxuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKVxyXG5cclxuY2xhc3MgQ291bnRlclZpZXdcclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEluaXRcclxuXHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJjYW52YXMgc2l6ZSAje0BjYW52YXMud2lkdGh9eCN7QGNhbnZhcy5oZWlnaHR9XCJcclxuXHJcbiAgICBAQ29sb3IgPSBDb2xvclxyXG4gICAgQFBsYXllckNvbG9ycyA9IFBsYXllckNvbG9yc1xyXG5cclxuICAgICMgaW5pdCBmb250c1xyXG4gICAgQGhlYWx0aEZvbnRQaXhlbHMgPSBNYXRoLmZsb29yKEBjYW52YXMud2lkdGggKiAwLjMwKVxyXG4gICAgaW5jcmVtZW50Rm9udFBpeGVscyA9IE1hdGguZmxvb3IoQGNhbnZhcy53aWR0aCAqIDAuMDUpXHJcbiAgICBtZW51Rm9udFBpeGVscyA9IE1hdGguZmxvb3IoQGNhbnZhcy53aWR0aCAqIDAuMDUpXHJcbiAgICBAZm9udHMgPVxyXG4gICAgICBoZWFsdGg6ICAgIEBhcHAucmVnaXN0ZXJGb250KFwiaGVhbHRoXCIsICAgIFwiI3tAaGVhbHRoRm9udFBpeGVsc31weCBJbnN0cnVjdGlvbiwgbW9ub3NwYWNlXCIpXHJcbiAgICAgIGluY3JlbWVudDogQGFwcC5yZWdpc3RlckZvbnQoXCJpbmNyZW1lbnRcIiwgXCIje2luY3JlbWVudEZvbnRQaXhlbHN9cHggSW5zdHJ1Y3Rpb24sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBtZW51OiAgICAgIEBhcHAucmVnaXN0ZXJGb250KFwiaW5jcmVtZW50XCIsIFwiI3ttZW51Rm9udFBpeGVsc31weCBJbnN0cnVjdGlvbiwgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQGNlbnRlciA9XHJcbiAgICAgIHg6IEBjYW52YXMud2lkdGggLyAyXHJcbiAgICAgIHk6IEBjYW52YXMuaGVpZ2h0IC8gMlxyXG5cclxuICAgIEBzbGljZUNvdW50ID0gMjBcclxuICAgIEBoYWxmU2xpY2VDb3VudCA9IE1hdGguZmxvb3IoQHNsaWNlQ291bnQgLyAyKVxyXG4gICAgQHNsaWNlQW5nbGUgPSBUV09fUEkgLyBAc2xpY2VDb3VudFxyXG4gICAgQGhhbGZTbGljZUFuZ2xlID0gQHNsaWNlQW5nbGUgLyAyXHJcblxyXG4gICAgQGRpYWxSYWRpdXMgPSBAY2VudGVyLnggKiAwLjhcclxuICAgIEBkaWFsSW5jcmVtZW50UmFkaXVzID0gQGNlbnRlci54ICogMC43XHJcbiAgICBAbWVudVJhZGl1cyA9IEBjZW50ZXIueCAqIDAuMVxyXG5cclxuICAgIEBsYXlvdXRzID0gW11cclxuXHJcbiAgICBmUmFkaXVzMiA9IEBjZW50ZXIueSAqIDAuNlxyXG4gICAgY1JhZGl1czYgPSBAY2VudGVyLnggKiAwLjdcclxuICAgIGZSYWRpdXM2ID0gQGNlbnRlci54ICogMS4xXHJcblxyXG4gICAgQGxheW91dHMucHVzaCB7XHJcbiAgICAgIG5hbWU6IFwiU29sb1wiXHJcbiAgICAgIHBsYXllcnM6IFtcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgNCwgZlJhZGl1czIsIDIwKVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgQGxheW91dHMucHVzaCB7XHJcbiAgICAgIG5hbWU6IFwiMlBcIlxyXG4gICAgICBwbGF5ZXJzOiBbXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDQsIGZSYWRpdXMyLCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgMTQsIGZSYWRpdXMyLCAyMClcclxuICAgICAgXVxyXG4gICAgfVxyXG5cclxuICAgIEBsYXlvdXRzLnB1c2gge1xyXG4gICAgICBuYW1lOiBcIjNQXCJcclxuICAgICAgcGxheWVyczogW1xyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCA0LCBmUmFkaXVzMiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDksIGNSYWRpdXM2LCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1syXSwgMTQsIGZSYWRpdXMyLCAyMClcclxuICAgICAgXVxyXG4gICAgfVxyXG5cclxuICAgIEBsYXlvdXRzLnB1c2gge1xyXG4gICAgICBuYW1lOiBcIjRQXCJcclxuICAgICAgcGxheWVyczogW1xyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCA0LCBmUmFkaXVzMiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDksIGNSYWRpdXM2LCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1syXSwgMTQsIGZSYWRpdXMyLCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1szXSwgMTksIGNSYWRpdXM2LCAyMClcclxuICAgICAgXVxyXG4gICAgfVxyXG5cclxuICAgIEBsYXlvdXRzLnB1c2gge1xyXG4gICAgICBuYW1lOiBcIlNjb3JlYm9hcmQgNFBcIlxyXG4gICAgICBwbGF5ZXJzOiBbXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDIsIGNSYWRpdXM2LCAyMCwgTWF0aC5QSSAvIDIpXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDYsIGNSYWRpdXM2LCAyMCwgTWF0aC5QSSAvIDIpXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMl0sIDEyLCBjUmFkaXVzNiwgMjAsIE1hdGguUEkgLyAyKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzNdLCAxNiwgY1JhZGl1czYsIDIwLCBNYXRoLlBJIC8gMilcclxuICAgICAgXVxyXG4gICAgfVxyXG5cclxuICAgIEBsYXlvdXRzLnB1c2gge1xyXG4gICAgICBuYW1lOiBcIjJ2MlwiXHJcbiAgICAgIHBsYXllcnM6IFtcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgIDIsIGNSYWRpdXM2LCAyMCwgLU1hdGguUEkgLyAyKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCAgNiwgY1JhZGl1czYsIDIwLCAgTWF0aC5QSSAvIDIpXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDEyLCBjUmFkaXVzNiwgMjAsICBNYXRoLlBJIC8gMilcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgMTYsIGNSYWRpdXM2LCAyMCwgLU1hdGguUEkgLyAyKVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgQGxheW91dHMucHVzaCB7XHJcbiAgICAgIG5hbWU6IFwiNSBQbGF5ZXJcIlxyXG4gICAgICBwbGF5ZXJzOiBbXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDIsIGZSYWRpdXM2LCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgNiwgZlJhZGl1czYsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzJdLCA5LCBjUmFkaXVzNiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbM10sIDEyLCBmUmFkaXVzNiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbNF0sIDE2LCBmUmFkaXVzNiwgMjApXHJcbiAgICAgIF1cclxuICAgIH1cclxuXHJcbiAgICBAbGF5b3V0cy5wdXNoIHtcclxuICAgICAgbmFtZTogXCI2UFwiXHJcbiAgICAgIHBsYXllcnM6IFtcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgMiwgZlJhZGl1czYsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCA2LCBmUmFkaXVzNiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMl0sIDksIGNSYWRpdXM2LCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1szXSwgMTIsIGZSYWRpdXM2LCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1s0XSwgMTYsIGZSYWRpdXM2LCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1s1XSwgMTksIGNSYWRpdXM2LCAyMClcclxuICAgICAgXVxyXG4gICAgfVxyXG5cclxuICAgIEBsYXlvdXRzLnB1c2gge1xyXG4gICAgICBuYW1lOiBcIkNvbW1hbmRlciA2UFwiXHJcbiAgICAgIHBsYXllcnM6IFtcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgMiwgZlJhZGl1czYsIDQwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCA2LCBmUmFkaXVzNiwgNDApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDksIGNSYWRpdXM2LCA0MClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgMTIsIGZSYWRpdXM2LCA0MClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgMTYsIGZSYWRpdXM2LCA0MClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgMTksIGNSYWRpdXM2LCA0MClcclxuICAgICAgXVxyXG4gICAgfVxyXG5cclxuICAgIGlmIG5vdCBAbG9hZCgpXHJcbiAgICAgIEBjaG9vc2VMYXlvdXQoMClcclxuICAgIEBvbkRyYWdSZXNldCgpXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIGNob29zZUxheW91dDogKGxheW91dCkgLT5cclxuICAgIEBsYXlvdXRJbmRleCA9IGxheW91dFxyXG4gICAgQHBsYXllcnMgPSBjbG9uZShAbGF5b3V0c1tsYXlvdXRdLnBsYXllcnMpXHJcbiAgICBAc2F2ZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgcmVzZXRBbGxIZWFsdGg6IC0+XHJcbiAgICBAY2hvb3NlTGF5b3V0KEBsYXlvdXRJbmRleClcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cclxuICAgICMgcmV0dXJuIEBjb3VudGVyLmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIHJldHVybiBcIlwiICNAY291bnRlci5leHBvcnQoKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgZmFjaW5nT3V0QW5nbGU6ICh4LCB5KSAtPlxyXG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSAtIEBjZW50ZXIueSwgeCAtIEBjZW50ZXIueCkgLSAoTWF0aC5QSSAvIDIpXHJcblxyXG4gIHVucG9sYXI6IChhbmdsZSwgciwgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwKSAtPlxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogb2Zmc2V0WCArIChNYXRoLmNvcyhhbmdsZSkgKiByKVxyXG4gICAgICB5OiBvZmZzZXRZICsgKE1hdGguc2luKGFuZ2xlKSAqIHIpXHJcbiAgICB9XHJcblxyXG4gIHBvc1RvU2xpY2U6ICh4LCB5KSAtPlxyXG4gICAgcG9zQW5nbGUgPSBNYXRoLmF0YW4yKHkgLSBAY2VudGVyLnksIHggLSBAY2VudGVyLngpXHJcbiAgICBpZiBwb3NBbmdsZSA8IDBcclxuICAgICAgcG9zQW5nbGUgKz0gTWF0aC5QSSAqIDJcclxuICAgIGFuZ2xlID0gMFxyXG4gICAgZm9yIHNsaWNlIGluIFswLi4uQHNsaWNlQ291bnRdXHJcbiAgICAgIGlmIChwb3NBbmdsZSA+PSBhbmdsZSkgYW5kIChwb3NBbmdsZSA8IChhbmdsZSArIEBzbGljZUFuZ2xlKSlcclxuICAgICAgICByZXR1cm4gc2xpY2VcclxuICAgICAgYW5nbGUgKz0gQHNsaWNlQW5nbGVcclxuICAgIHJldHVybiAwXHJcblxyXG4gIHBsYXllckxheW91dDogKGNvbG9yLCBzbGljZSwgcmFkaXVzLCBoZWFsdGgsIGFuZ2xlID0gbnVsbCkgLT5cclxuICAgIGMgPSBAdW5wb2xhcigoKHNsaWNlICsgMSkgJSBAc2xpY2VDb3VudCkgKiBAc2xpY2VBbmdsZSwgcmFkaXVzLCBAY2VudGVyLngsIEBjZW50ZXIueSlcclxuICAgIGlmIGFuZ2xlID09IG51bGxcclxuICAgICAgYW5nbGUgPSBAZmFjaW5nT3V0QW5nbGUoYy54LCBjLnkpXHJcbiAgICBwbGF5ZXIgPVxyXG4gICAgICB4OiBjLnhcclxuICAgICAgeTogYy55XHJcbiAgICAgIGFuZ2xlOiBhbmdsZVxyXG4gICAgICBzbGljZTogc2xpY2VcclxuICAgICAgaGVhbHRoOiBoZWFsdGhcclxuICAgICAgY29sb3I6IGNvbG9yXHJcbiAgICByZXR1cm4gcGxheWVyXHJcblxyXG4gIGRpc3RhbmNlOiAoeDAsIHkwLCB4MSwgeTEpIC0+XHJcbiAgICB4ZCA9IHgxIC0geDBcclxuICAgIHlkID0geTEgLSB5MFxyXG4gICAgcmV0dXJuIE1hdGguc3FydCgoeGQqeGQpICsgKHlkKnlkKSlcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIG9uRHJhZ1BvczogKHgsIHkpIC0+XHJcbiAgICBAZHJhZ2dpbmcgPSB0cnVlXHJcblxyXG4gICAgaWYgQGRyYWdTbGljZSA9PSAtMVxyXG4gICAgICAjIEZpZ3VyZSBvdXQgd2hpY2ggcGxheWVyIHdlIHN0YXJ0ZWQgb25cclxuICAgICAgY2xvc2VzdEluZGV4ID0gMFxyXG4gICAgICBjbG9zZXN0UG9zaXRpb24gPSBAY2FudmFzLmhlaWdodCAqIDEwMDBcclxuICAgICAgZm9yIHBsYXllciwgaW5kZXggaW4gQHBsYXllcnNcclxuICAgICAgICBkaXN0ID0gQGRpc3RhbmNlKHBsYXllci54LCBwbGF5ZXIueSwgeCwgeSlcclxuICAgICAgICBpZiBjbG9zZXN0UG9zaXRpb24gPiBkaXN0XHJcbiAgICAgICAgICBjbG9zZXN0UG9zaXRpb24gPSBkaXN0XHJcbiAgICAgICAgICBjbG9zZXN0SW5kZXggPSBpbmRleFxyXG4gICAgICBAZHJhZ1BsYXllckluZGV4ID0gY2xvc2VzdEluZGV4XHJcblxyXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgIyBUT0RPOiBkaXN0cmlidXRlIGEgYnVuY2ggb2YgbWF0aCBvdXRcclxuICAgICAgQGRyYWdTbGljZSA9IEBwb3NUb1NsaWNlKHgsIHkpXHJcblxyXG4gICAgICBAZHJhZ0RlbHRhID0gQGRyYWdTbGljZSAtIEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdLnNsaWNlXHJcbiAgICAgIGlmIEBkcmFnRGVsdGEgPiBAaGFsZlNsaWNlQ291bnRcclxuICAgICAgICBAZHJhZ0RlbHRhIC09IEBzbGljZUNvdW50XHJcbiAgICAgIGlmIEBkcmFnRGVsdGEgPCAtQGhhbGZTbGljZUNvdW50XHJcbiAgICAgICAgQGRyYWdEZWx0YSArPSBAc2xpY2VDb3VudFxyXG4gICAgICBjb25zb2xlLmxvZyBcIkBkcmFnRGVsdGEgc3RhcnRpbmcgYXQgI3tAZHJhZ0RlbHRhfVwiXHJcbiAgICBlbHNlXHJcbiAgICAgIG5ld0RyYWdTbGljZSA9IEBwb3NUb1NsaWNlKHgsIHkpXHJcbiAgICAgIGlmIEBkcmFnU2xpY2UgIT0gbmV3RHJhZ1NsaWNlXHJcbiAgICAgICAgc2xpY2VPZmZzZXQgPSBuZXdEcmFnU2xpY2UgLSBAZHJhZ1NsaWNlXHJcbiAgICAgICAgaWYgc2xpY2VPZmZzZXQgPiBAaGFsZlNsaWNlQ291bnRcclxuICAgICAgICAgIHNsaWNlT2Zmc2V0IC09IEBzbGljZUNvdW50XHJcbiAgICAgICAgaWYgc2xpY2VPZmZzZXQgPCAtQGhhbGZTbGljZUNvdW50XHJcbiAgICAgICAgICBzbGljZU9mZnNldCArPSBAc2xpY2VDb3VudFxyXG4gICAgICAgIEBkcmFnRGVsdGEgKz0gc2xpY2VPZmZzZXRcclxuICAgICAgICBjb25zb2xlLmxvZyBcIkBkcmFnRGVsdGEgbm93IGF0ICN7QGRyYWdEZWx0YX1cIlxyXG5cclxuICAgICAgICBAZHJhZ1NsaWNlID0gbmV3RHJhZ1NsaWNlXHJcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgQGRyYWdYID0geFxyXG4gICAgQGRyYWdZID0geVxyXG4gICAgIyBAZHJhZ0FuZ2xlID0gTWF0aC5hdGFuMih5IC0gQGNlbnRlci55LCB4IC0gQGNlbnRlci54KVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG9uRHJhZ1Jlc2V0OiAtPlxyXG4gICAgQGRyYWdnaW5nID0gZmFsc2VcclxuICAgIEBkcmFnUGxheWVySW5kZXggPSAtMVxyXG4gICAgQGRyYWdYID0gLTFcclxuICAgIEBkcmFnWSA9IC0xXHJcbiAgICBAZHJhZ1NsaWNlID0gLTFcclxuICAgIEBkcmFnRGVsdGEgPSAwXHJcblxyXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XHJcbiAgICBkaXN0YW5jZUZyb21DZW50ZXIgPSBAZGlzdGFuY2UoeCwgeSwgQGNlbnRlci54LCBAY2VudGVyLnkpXHJcbiAgICBpZiBkaXN0YW5jZUZyb21DZW50ZXIgPCBAbWVudVJhZGl1c1xyXG4gICAgICBAYXBwLnN3aXRjaFZpZXcoXCJtZW51XCIpXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgICMgY29uc29sZS5sb2cgXCJtb3VzZWRvd24gI3t4fSwgI3t5fVwiXHJcbiAgICBAb25EcmFnUG9zKHgsIHkpXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIG1vdXNlbW92ZTogKHgsIHksIGJ1dHRvbnMpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwibW91c2Vkb3duICN7eH0sICN7eX1cIlxyXG4gICAgaWYgYnV0dG9ucyA9PSAxXHJcbiAgICAgIEBvbkRyYWdQb3MoeCwgeSlcclxuICAgICAgQGRyYXcoKVxyXG5cclxuICBtb3VzZXVwOiAtPlxyXG4gICAgaWYgQGRyYWdnaW5nXHJcbiAgICAgIGRyYWdQbGF5ZXIgPSBAcGxheWVyc1tAZHJhZ1BsYXllckluZGV4XVxyXG4gICAgICBuZXdIZWFsdGggPSBkcmFnUGxheWVyLmhlYWx0aFxyXG4gICAgICBpZiBAZHJhZ0RlbHRhID4gMVxyXG4gICAgICAgIG5ld0hlYWx0aCArPSBAZHJhZ0RlbHRhIC0gMVxyXG4gICAgICBlbHNlIGlmIEBkcmFnRGVsdGEgPCAwXHJcbiAgICAgICAgbmV3SGVhbHRoICs9IEBkcmFnRGVsdGFcclxuICAgICAgZHJhZ1BsYXllci5oZWFsdGggPSBuZXdIZWFsdGhcclxuICAgICAgQHNhdmUoKVxyXG5cclxuICAgIEBvbkRyYWdSZXNldCgpXHJcbiAgICBAZHJhdygpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIGxvYWQ6IC0+XHJcbiAgICBpZiBub3QgbG9jYWxTdG9yYWdlXHJcbiAgICAgIGFsZXJ0KFwiTm8gbG9jYWwgc3RvcmFnZSwgbm90aGluZyB3aWxsIHdvcmtcIilcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBqc29uU3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzdGF0ZVwiKVxyXG4gICAgaWYganNvblN0cmluZyA9PSBudWxsXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIHN0YXRlID0gSlNPTi5wYXJzZShqc29uU3RyaW5nKVxyXG5cclxuICAgICMgVE9ETzogdmFsaWRhdGUgaW5mb1xyXG4gICAgQHBsYXllcnMgPSBzdGF0ZS5wbGF5ZXJzXHJcbiAgICBAbGF5b3V0SW5kZXggPSBzdGF0ZS5sYXlvdXRJbmRleFxyXG5cclxuICAgIGNvbnNvbGUubG9nIFwiTG9hZGVkIHN0YXRlLlwiXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBzYXZlOiAtPlxyXG4gICAgaWYgbm90IGxvY2FsU3RvcmFnZVxyXG4gICAgICBhbGVydChcIk5vIGxvY2FsIHN0b3JhZ2UsIG5vdGhpbmcgd2lsbCB3b3JrXCIpXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIHN0YXRlID1cclxuICAgICAgcGxheWVyczogQHBsYXllcnNcclxuICAgICAgbGF5b3V0SW5kZXg6IEBsYXlvdXRJbmRleFxyXG5cclxuICAgIGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShzdGF0ZSlcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic3RhdGVcIiwganNvblN0cmluZylcclxuICAgIGNvbnNvbGUubG9nIFwiU2F2ZWQgc3RhdGUgKCN7anNvblN0cmluZy5sZW5ndGh9IGNoYXJzKVwiXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgc2xpY2VPZmZzZXRUb0RlbHRhOiAob2Zmc2V0KSAtPlxyXG4gICAgaWYgb2Zmc2V0ID09IDBcclxuICAgICAgcmV0dXJuIDBcclxuXHJcbiAgICBpZiBvZmZzZXQgPD0gQGhhbGZTbGljZUNvdW50XHJcbiAgICAgICMgdHJ5aW5nIHRvIGluY3JlbWVudFxyXG4gICAgICByZXR1cm4gb2Zmc2V0XHJcbiAgICBlbHNlXHJcbiAgICAgICMgdHJ5aW5nIHRvIGRlY3JlbWVudFxyXG4gICAgICByZXR1cm4gLTEgKiAoQHNsaWNlQ291bnQgLSBvZmZzZXQpXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBjb25zb2xlLmxvZyBcImRyYXcoKVwiXHJcblxyXG4gICAgIyBDbGVhciBzY3JlZW4gdG8gYmxhY2tcclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIENvbG9yLmJhY2tncm91bmQpXHJcbiAgICAjIEBhcHAuZHJhd1JlY3QoQGNlbnRlci54LCBAY2VudGVyLnksIDEsIDEsIFwid2hpdGVcIiwgMSkgIyBkZWJ1ZyBjZW50ZXIgZG90XHJcblxyXG4gICAgQGFwcC5zdHJva2VDaXJjbGUoQGNlbnRlci54LCBAY2VudGVyLnksIEBtZW51UmFkaXVzLCBcIndoaXRlXCIsIDQpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJNXCIsIEBjZW50ZXIueCwgQGNlbnRlci55LCBAZm9udHMubWVudSwgQ29sb3IubWVudSwgMClcclxuXHJcbiAgICBmb3IgcGxheWVyLCBpbmRleCBpbiBAcGxheWVyc1xyXG4gICAgICBjb2xvciA9IENvbG9yLmhlYWx0aFxyXG4gICAgICBpZiBAZHJhZ2dpbmcgYW5kIChpbmRleCA9PSBAZHJhZ1BsYXllckluZGV4KVxyXG4gICAgICAgIGNvbG9yID0gQ29sb3IuY2hhbmdpbmdIZWFsdGhcclxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKCAgU3RyaW5nKHBsYXllci5oZWFsdGgpLCBwbGF5ZXIueCwgcGxheWVyLnksIEBmb250cy5oZWFsdGgsIHBsYXllci5jb2xvciwgcGxheWVyLmFuZ2xlKVxyXG4gICAgICBAYXBwLnN0cm9rZVRleHRDZW50ZXJlZChTdHJpbmcocGxheWVyLmhlYWx0aCksIHBsYXllci54LCBwbGF5ZXIueSwgQGZvbnRzLmhlYWx0aCwgXCJ3aGl0ZVwiLCA0LCBwbGF5ZXIuYW5nbGUpXHJcblxyXG4gICAgaWYgQGRyYWdnaW5nXHJcbiAgICAgIGRyYWdQbGF5ZXIgPSBAcGxheWVyc1tAZHJhZ1BsYXllckluZGV4XVxyXG5cclxuICAgICAgQGFwcC5kcmF3QXJjKEBjZW50ZXIueCwgQGNlbnRlci55LCBAZGlhbFJhZGl1cywgMCwgVFdPX1BJLCBDb2xvci5kaWFsKVxyXG5cclxuICAgICAgZm9yIGkgaW4gWzAuLi5AaGFsZlNsaWNlQ291bnQrMV1cclxuICAgICAgICBzbGljZSA9IChAZHJhZ1NsaWNlICsgaSkgJSBAc2xpY2VDb3VudFxyXG4gICAgICAgIGFuZ2xlID0gc2xpY2UgKiBAc2xpY2VBbmdsZVxyXG4gICAgICAgIHZhbHVlID0gQGRyYWdEZWx0YSArIGlcclxuICAgICAgICBpZiBzbGljZSA9PSBAZHJhZ1NsaWNlXHJcbiAgICAgICAgICBAYXBwLmRyYXdBcmMoQGNlbnRlci54LCBAY2VudGVyLnksIEBkaWFsUmFkaXVzLCBhbmdsZSwgYW5nbGUgKyBAc2xpY2VBbmdsZSwgQ29sb3IuZGlhbEhpZ2hsaWdodClcclxuICAgICAgICBpZiAodmFsdWUgIT0gMCkgYW5kICh2YWx1ZSAhPSAxKVxyXG4gICAgICAgICAgaWYgdmFsdWUgPiAwXHJcbiAgICAgICAgICAgIHRleHRWID0gXCIrI3t2YWx1ZSAtIDF9XCJcclxuICAgICAgICAgICAgdGV4dENvbG9yID0gQ29sb3IuYWRkVGV4dFxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0ZXh0ViA9IFwiI3t2YWx1ZX1cIlxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5zdWJ0cmFjdFRleHRcclxuICAgICAgICAgIHRleHRQb3MgPSBAdW5wb2xhcihhbmdsZSArIEBoYWxmU2xpY2VBbmdsZSwgQGRpYWxJbmNyZW1lbnRSYWRpdXMsIEBjZW50ZXIueCwgQGNlbnRlci55KVxyXG4gICAgICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHRleHRWLCB0ZXh0UG9zLngsIHRleHRQb3MueSwgQGZvbnRzLmluY3JlbWVudCwgdGV4dENvbG9yLCBAZmFjaW5nT3V0QW5nbGUodGV4dFBvcy54LCB0ZXh0UG9zLnkpKVxyXG5cclxuICAgICAgZm9yIGkgaW4gWzEuLi5AaGFsZlNsaWNlQ291bnRdXHJcbiAgICAgICAgc2xpY2UgPSAoQHNsaWNlQ291bnQgKyBAZHJhZ1NsaWNlIC0gaSkgJSBAc2xpY2VDb3VudFxyXG4gICAgICAgIGFuZ2xlID0gc2xpY2UgKiBAc2xpY2VBbmdsZVxyXG4gICAgICAgIHZhbHVlID0gQGRyYWdEZWx0YSAtIGlcclxuICAgICAgICBpZiAodmFsdWUgIT0gMCkgYW5kICh2YWx1ZSAhPSAxKVxyXG4gICAgICAgICAgaWYgdmFsdWUgPiAwXHJcbiAgICAgICAgICAgIHRleHRWID0gXCIrI3t2YWx1ZSAtIDF9XCJcclxuICAgICAgICAgICAgdGV4dENvbG9yID0gQ29sb3IuYWRkVGV4dFxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0ZXh0ViA9IFwiI3t2YWx1ZX1cIlxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5zdWJ0cmFjdFRleHRcclxuICAgICAgICAgIHRleHRQb3MgPSBAdW5wb2xhcihhbmdsZSArIEBoYWxmU2xpY2VBbmdsZSwgQGRpYWxJbmNyZW1lbnRSYWRpdXMsIEBjZW50ZXIueCwgQGNlbnRlci55KVxyXG4gICAgICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHRleHRWLCB0ZXh0UG9zLngsIHRleHRQb3MueSwgQGZvbnRzLmluY3JlbWVudCwgdGV4dENvbG9yLCBAZmFjaW5nT3V0QW5nbGUodGV4dFBvcy54LCB0ZXh0UG9zLnkpKVxyXG5cclxuICAgICAgQGFwcC5zdHJva2VDaXJjbGUoQGNlbnRlci54LCBAY2VudGVyLnksIEBkaWFsUmFkaXVzLCBcIndoaXRlXCIsIDQpXHJcblxyXG4gICAgICBlc3RpbWF0ZWRIZWFsdGggPSBkcmFnUGxheWVyLmhlYWx0aFxyXG4gICAgICBpZiBAZHJhZ0RlbHRhID4gMVxyXG4gICAgICAgIGVzdGltYXRlZEhlYWx0aCArPSBAZHJhZ0RlbHRhIC0gMVxyXG4gICAgICBlbHNlIGlmIEBkcmFnRGVsdGEgPCAwXHJcbiAgICAgICAgZXN0aW1hdGVkSGVhbHRoICs9IEBkcmFnRGVsdGFcclxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKCAgZXN0aW1hdGVkSGVhbHRoLCBAY2VudGVyLngsIEBjZW50ZXIueSwgQGZvbnRzLmhlYWx0aCwgZHJhZ1BsYXllci5jb2xvciwgZHJhZ1BsYXllci5hbmdsZSlcclxuICAgICAgQGFwcC5zdHJva2VUZXh0Q2VudGVyZWQoZXN0aW1hdGVkSGVhbHRoLCBAY2VudGVyLngsIEBjZW50ZXIueSwgQGZvbnRzLmhlYWx0aCwgXCJ3aGl0ZVwiLCA0LCBkcmFnUGxheWVyLmFuZ2xlKVxyXG5cclxuICAgIHJldHVyblxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ291bnRlclZpZXdcclxuIiwiQlVUVE9OX0hFSUdIVCA9IDAuMDZcclxuRklSU1RfQlVUVE9OX1kgPSAwLjIyXHJcbkJVVFRPTl9TUEFDSU5HID0gMC4wOFxyXG5CVVRUT05fU0VQQVJBVE9SID0gMC4wM1xyXG5cclxuYnV0dG9uUG9zID0gKGluZGV4KSAtPlxyXG4gIHkgPSBGSVJTVF9CVVRUT05fWSArIChCVVRUT05fU1BBQ0lORyAqIGluZGV4KVxyXG4gIGlmIGluZGV4ID4gM1xyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgaWYgaW5kZXggPiA0XHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDZcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIHJldHVybiB5XHJcblxyXG5jbGFzcyBMYXlvdXRWaWV3XHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzLCBAY291bnRlcikgLT5cclxuICAgIEBidXR0b25zID1cclxuICAgICAgY2FuY2VsOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg3KVxyXG4gICAgICAgIHRleHQ6IFwiQ2FuY2VsXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3NzdcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQGNhbmNlbC5iaW5kKHRoaXMpXHJcblxyXG4gICAgIyBtYWtlcyBmb3IgYSBAc2NhbGUgeCBAc2NhbGUgYmxvY2sgb2YgY2hvaWNlc1xyXG4gICAgQHNjYWxlID0gNVxyXG5cclxuICAgIEBuYW1lRm9udFBpeGVscyA9IEBjb3VudGVyLmhlYWx0aEZvbnRQaXhlbHMgLyBAc2NhbGUgLyAzXHJcbiAgICBAZm9udHMgPVxyXG4gICAgICBoZWFsdGg6IEBhcHAucmVnaXN0ZXJGb250KFwiaGVhbHRoXCIsIFwiI3tAY291bnRlci5oZWFsdGhGb250UGl4ZWxzIC8gQHNjYWxlfXB4IEluc3RydWN0aW9uLCBtb25vc3BhY2VcIilcclxuICAgICAgbmFtZTogICBAYXBwLnJlZ2lzdGVyRm9udChcIm5hbWVcIiwgICBcIiN7QG5hbWVGb250UGl4ZWxzfXB4IEluc3RydWN0aW9uLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBidXR0b25XaWR0aCA9IEBjYW52YXMud2lkdGggKiAwLjhcclxuICAgIEBidXR0b25IZWlnaHQgPSBAY2FudmFzLmhlaWdodCAqIEJVVFRPTl9IRUlHSFRcclxuICAgIGJ1dHRvblggPSAoQGNhbnZhcy53aWR0aCAtIGJ1dHRvbldpZHRoKSAvIDJcclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgYnV0dG9uLnggPSBidXR0b25YXHJcbiAgICAgIGJ1dHRvbi55ID0gQGNhbnZhcy5oZWlnaHQgKiBidXR0b24ueVxyXG4gICAgICBidXR0b24udyA9IGJ1dHRvbldpZHRoXHJcbiAgICAgIGJ1dHRvbi5oID0gQGJ1dHRvbkhlaWdodFxyXG5cclxuICAgIGJ1dHRvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBidXR0b25IZWlnaHQgKiAwLjQpXHJcbiAgICBAYnV0dG9uRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tidXR0b25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgdGl0bGVGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMSlcclxuICAgIEB0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7dGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXdMYXlvdXQ6IChsYXlvdXQsIG94LCBveSkgLT5cclxuICAgIGNvbnNvbGUubG9nIFwiZHJhd2luZyBsYXlvdXRcIiwgbGF5b3V0XHJcbiAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChveCwgb3ksIEBjYW52YXMud2lkdGggLyBAc2NhbGUsIEBjYW52YXMuaGVpZ2h0IC8gQHNjYWxlLCAwLCBAY291bnRlci5Db2xvci5iYWNrZ3JvdW5kLCBcImJsYWNrXCIpXHJcbiAgICBmb3IgcGxheWVyIGluIGxheW91dC5wbGF5ZXJzXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChwbGF5ZXIuaGVhbHRoLCBveCArIChwbGF5ZXIueCAvIEBzY2FsZSksIG95ICsgKHBsYXllci55IC8gQHNjYWxlKSwgQGZvbnRzLmhlYWx0aCwgcGxheWVyLmNvbG9yLCBwbGF5ZXIuYW5nbGUpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQobGF5b3V0Lm5hbWUsIG94ICsgKEBjYW52YXMud2lkdGggLyBAc2NhbGUgLyAyKSwgb3kgKyBAbmFtZUZvbnRQaXhlbHMsIEBmb250cy5uYW1lLCBcIndoaXRlXCIsIDApXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiMzMzAwMDBcIilcclxuXHJcbiAgICBmb3IgbGF5b3V0LCBpIGluIEBjb3VudGVyLmxheW91dHNcclxuICAgICAgeCA9IChpICUgQHNjYWxlKSAqIEBjYW52YXMud2lkdGggLyBAc2NhbGVcclxuICAgICAgeSA9IE1hdGguZmxvb3IoaSAvIEBzY2FsZSkgKiBAY2FudmFzLmhlaWdodCAvIEBzY2FsZVxyXG4gICAgICBAZHJhd0xheW91dChsYXlvdXQsIHgsIHkpXHJcblxyXG4gICAgc2hhZG93T2Zmc2V0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjAxXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54ICsgc2hhZG93T2Zmc2V0LCBidXR0b24ueSArIHNoYWRvd09mZnNldCwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgXCJibGFja1wiLCBcImJsYWNrXCIpXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54LCBidXR0b24ueSwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgYnV0dG9uLmJnQ29sb3IsIFwiIzk5OTk5OVwiKVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoYnV0dG9uLnRleHQsIGJ1dHRvbi54ICsgKGJ1dHRvbi53IC8gMiksIGJ1dHRvbi55ICsgKGJ1dHRvbi5oIC8gMiksIEBidXR0b25Gb250LCBidXR0b24udGV4dENvbG9yKVxyXG5cclxuICAgICMgQGFwcC5kcmF3VmVyc2lvbigpXHJcblxyXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGlmICh5ID4gYnV0dG9uLnkpICYmICh5IDwgKGJ1dHRvbi55ICsgQGJ1dHRvbkhlaWdodCkpXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImJ1dHRvbiBwcmVzc2VkOiAje2J1dHRvbk5hbWV9XCJcclxuICAgICAgICBidXR0b24uY2xpY2soKVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgIGNvbnNvbGUubG9nIFwiI3t4fSwgI3t5fVwiXHJcbiAgICBsYXlvdXRJbmRleCA9IE1hdGguZmxvb3IoeCAvIChAY2FudmFzLndpZHRoIC8gQHNjYWxlKSkgKyBNYXRoLmZsb29yKEBzY2FsZSAqIE1hdGguZmxvb3IoeSAvIChAY2FudmFzLmhlaWdodCAvIEBzY2FsZSkpKVxyXG4gICAgaWYgKGxheW91dEluZGV4ID49IDApIGFuZCAobGF5b3V0SW5kZXggPCBAY291bnRlci5sYXlvdXRzLmxlbmd0aClcclxuICAgICAgbGF5b3V0ID0gQGNvdW50ZXIubGF5b3V0c1tsYXlvdXRJbmRleF1cclxuICAgICAgaWYoY29uZmlybShcIlJlc2V0IHRvIHRoZSAnI3tsYXlvdXQubmFtZX0nIGxheW91dD9cIikpXHJcbiAgICAgICAgQGNvdW50ZXIuY2hvb3NlTGF5b3V0KGxheW91dEluZGV4KVxyXG4gICAgICAgIEBhcHAuc3dpdGNoVmlldyhcImNvdW50ZXJcIilcclxuICAgIHJldHVyblxyXG5cclxuICBtb3VzZW1vdmU6ICh4LCB5LCBidXR0b25zKSAtPlxyXG4gIG1vdXNldXA6IC0+XHJcblxyXG4gIGNhbmNlbDogLT5cclxuICAgIEBhcHAuc3dpdGNoVmlldyhcIm1lbnVcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5b3V0Vmlld1xyXG4iLCJCVVRUT05fSEVJR0hUID0gMC4wNlxyXG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcclxuQlVUVE9OX1NQQUNJTkcgPSAwLjA4XHJcbkJVVFRPTl9TRVBBUkFUT1IgPSAwLjAzXHJcblxyXG5idXR0b25Qb3MgPSAoaW5kZXgpIC0+XHJcbiAgeSA9IEZJUlNUX0JVVFRPTl9ZICsgKEJVVFRPTl9TUEFDSU5HICogaW5kZXgpXHJcbiAgaWYgaW5kZXggPiAzXHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDRcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNlxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgcmV0dXJuIHlcclxuXHJcbmNsYXNzIE1lbnVWaWV3XHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxyXG4gICAgQGJ1dHRvbnMgPVxyXG4gICAgICBjaG9vc2VMYXlvdXQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDEpXHJcbiAgICAgICAgdGV4dDogXCJDaG9vc2UgTGF5b3V0XCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM1NTU1NTVcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQGNob29zZUxheW91dC5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc2V0QWxsSGVhbHRoOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygyKVxyXG4gICAgICAgIHRleHQ6IFwiUmVzZXQgQWxsIEhlYWx0aFwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNTU1NTU1XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXNldEFsbEhlYWx0aC5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc3VtZTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNylcclxuICAgICAgICB0ZXh0OiBcIlJlc3VtZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3Nzc3XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXN1bWUuYmluZCh0aGlzKVxyXG5cclxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxyXG4gICAgQGJ1dHRvbkhlaWdodCA9IEBjYW52YXMuaGVpZ2h0ICogQlVUVE9OX0hFSUdIVFxyXG4gICAgYnV0dG9uWCA9IChAY2FudmFzLndpZHRoIC0gYnV0dG9uV2lkdGgpIC8gMlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBidXR0b24ueCA9IGJ1dHRvblhcclxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XHJcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcclxuICAgICAgYnV0dG9uLmggPSBAYnV0dG9uSGVpZ2h0XHJcblxyXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcclxuICAgIEBidXR0b25Gb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje2J1dHRvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4xKVxyXG4gICAgQHRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3t0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMzMzM1wiKVxyXG5cclxuICAgIHggPSBAY2FudmFzLndpZHRoIC8gMlxyXG4gICAgc2hhZG93T2Zmc2V0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjAxXHJcblxyXG4gICAgeTEgPSBAY2FudmFzLmhlaWdodCAqIDAuMDVcclxuICAgIHkyID0gQGNhbnZhcy5oZWlnaHQgKiAwLjE1XHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJNVEdcIiwgeCArIHNoYWRvd09mZnNldCwgeTIgKyBzaGFkb3dPZmZzZXQsIEB0aXRsZUZvbnQsIFwiIzAwMDAwMFwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiTVRHXCIsIHgsIHkyLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54ICsgc2hhZG93T2Zmc2V0LCBidXR0b24ueSArIHNoYWRvd09mZnNldCwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgXCJibGFja1wiLCBcImJsYWNrXCIpXHJcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54LCBidXR0b24ueSwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgYnV0dG9uLmJnQ29sb3IsIFwiIzk5OTk5OVwiKVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoYnV0dG9uLnRleHQsIGJ1dHRvbi54ICsgKGJ1dHRvbi53IC8gMiksIGJ1dHRvbi55ICsgKGJ1dHRvbi5oIC8gMiksIEBidXR0b25Gb250LCBidXR0b24udGV4dENvbG9yKVxyXG5cclxuICAgIEBhcHAuZHJhd1ZlcnNpb24oKVxyXG5cclxuICBtb3VzZWRvd246ICh4LCB5KSAtPlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBpZiAoeSA+IGJ1dHRvbi55KSAmJiAoeSA8IChidXR0b24ueSArIEBidXR0b25IZWlnaHQpKVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJidXR0b24gcHJlc3NlZDogI3tidXR0b25OYW1lfVwiXHJcbiAgICAgICAgYnV0dG9uLmNsaWNrKClcclxuICAgIHJldHVyblxyXG5cclxuICBtb3VzZW1vdmU6ICh4LCB5LCBidXR0b25zKSAtPlxyXG4gIG1vdXNldXA6IC0+XHJcblxyXG4gIGNob29zZUxheW91dDogLT5cclxuICAgIEBhcHAuc3dpdGNoVmlldyhcImxheW91dFwiKVxyXG5cclxuICByZXNldEFsbEhlYWx0aDogLT5cclxuICAgIGlmKGNvbmZpcm0oXCJSZXNldCBhbGwgaGVhbHRoP1wiKSlcclxuICAgICAgQGFwcC5yZXNldEFsbEhlYWx0aCgpXHJcblxyXG4gIHJlc3VtZTogLT5cclxuICAgIEBhcHAuc3dpdGNoVmlldyhcImNvdW50ZXJcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXdcclxuIiwiQXBwID0gcmVxdWlyZSAnLi9BcHAnXHJcblxyXG5pbml0ID0gLT5cclxuICBjb25zb2xlLmxvZyBcImluaXRcIlxyXG4gIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIilcclxuICBjYW52YXMud2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxyXG4gIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGNhbnZhcywgZG9jdW1lbnQuYm9keS5jaGlsZE5vZGVzWzBdKVxyXG4gIGNhbnZhc1JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuXHJcbiAgd2luZG93LmFwcCA9IG5ldyBBcHAoY2FudmFzKVxyXG5cclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcInRvdWNoc3RhcnRcIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAgIHdpbmRvdy5hcHAubW91c2Vkb3duKHgsIHkpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2htb3ZlXCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB4ID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAgIHkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXHJcbiAgICB3aW5kb3cuYXBwLm1vdXNlbW92ZSh4LCB5LCAxKVxyXG5cclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcInRvdWNoZW5kXCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB3aW5kb3cuYXBwLm1vdXNldXAoKVxyXG5cclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlZG93blwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgeCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICAgeSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXHJcbiAgICB3aW5kb3cuYXBwLm1vdXNlZG93bih4LCB5KVxyXG5cclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlbW92ZVwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgeCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICAgeSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXHJcbiAgICBidXR0b25zID0gZS5idXR0b25zXHJcbiAgICB3aW5kb3cuYXBwLm1vdXNlbW92ZSh4LCB5LCBidXR0b25zKVxyXG5cclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNldXBcIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHdpbmRvdy5hcHAubW91c2V1cCgpXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSAtPlxyXG4gICAgaW5pdCgpXHJcbiwgZmFsc2UpXHJcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIwLjAuMVwiIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjAuMTMgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGEsYil7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9hLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixiLCExKTphLmF0dGFjaEV2ZW50KFwic2Nyb2xsXCIsYil9ZnVuY3Rpb24gbShhKXtkb2N1bWVudC5ib2R5P2EoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24gYygpe2RvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYyk7YSgpfSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbiBrKCl7aWYoXCJpbnRlcmFjdGl2ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImNvbXBsZXRlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGUpZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSxhKCl9KX07ZnVuY3Rpb24gcihhKXt0aGlzLmE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLmEuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIik7dGhpcy5hLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKTt0aGlzLmI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5jPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5nPS0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5jLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcbnRoaXMuZi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5oLnN0eWxlLmNzc1RleHQ9XCJkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lO1wiO3RoaXMuYi5hcHBlbmRDaGlsZCh0aGlzLmgpO3RoaXMuYy5hcHBlbmRDaGlsZCh0aGlzLmYpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmIpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmMpfVxuZnVuY3Rpb24gdChhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB5KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiB6KGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eShhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3koYSl9O2Z1bmN0aW9uIEEoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBCPW51bGwsQz1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1DKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0M9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBDPSExO3JldHVybiBDfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5mdW5jdGlvbiBLKCl7aWYobnVsbD09PUUpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2Euc3R5bGUuZm9udD1cImNvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmXCJ9Y2F0Y2goYil7fUU9XCJcIiE9PWEuc3R5bGUuZm9udH1yZXR1cm4gRX1mdW5jdGlvbiBMKGEsYil7cmV0dXJuW2Euc3R5bGUsYS53ZWlnaHQsSygpP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixiXS5qb2luKFwiIFwiKX1cbkEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGs9YXx8XCJCRVNic3d5XCIscT0wLEQ9Ynx8M0UzLEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7aWYoSigpJiYhRygpKXt2YXIgTT1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGUoKXsobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EP2IoKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGZ1bmN0aW9uKCl7YigpfSl9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3E9c2V0VGltZW91dChjLEQpfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHEpO2EoYyl9LGZ1bmN0aW9uKCl7YihjKX0pfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHUoKXt2YXIgYjtpZihiPS0xIT1cbmYmJi0xIT1nfHwtMSE9ZiYmLTEhPWh8fC0xIT1nJiYtMSE9aCkoYj1mIT1nJiZmIT1oJiZnIT1oKXx8KG51bGw9PT1CJiYoYj0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksQj0hIWImJig1MzY+cGFyc2VJbnQoYlsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGJbMV0sMTApJiYxMT49cGFyc2VJbnQoYlsyXSwxMCkpKSxiPUImJihmPT12JiZnPT12JiZoPT12fHxmPT13JiZnPT13JiZoPT13fHxmPT14JiZnPT14JiZoPT14KSksYj0hYjtiJiYoZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksY2xlYXJUaW1lb3V0KHEpLGEoYykpfWZ1bmN0aW9uIEkoKXtpZigobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EKWQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGIoYyk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLFxuZz1uLmEub2Zmc2V0V2lkdGgsaD1wLmEub2Zmc2V0V2lkdGgsdSgpO3E9c2V0VGltZW91dChJLDUwKX19dmFyIGU9bmV3IHIoayksbj1uZXcgcihrKSxwPW5ldyByKGspLGY9LTEsZz0tMSxoPS0xLHY9LTEsdz0tMSx4PS0xLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmRpcj1cImx0clwiO3QoZSxMKGMsXCJzYW5zLXNlcmlmXCIpKTt0KG4sTChjLFwic2VyaWZcIikpO3QocCxMKGMsXCJtb25vc3BhY2VcIikpO2QuYXBwZW5kQ2hpbGQoZS5hKTtkLmFwcGVuZENoaWxkKG4uYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7dj1lLmEub2Zmc2V0V2lkdGg7dz1uLmEub2Zmc2V0V2lkdGg7eD1wLmEub2Zmc2V0V2lkdGg7SSgpO3ooZSxmdW5jdGlvbihhKXtmPWE7dSgpfSk7dChlLEwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO3oobixmdW5jdGlvbihhKXtnPWE7dSgpfSk7dChuLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtcbnoocCxmdW5jdGlvbihhKXtoPWE7dSgpfSk7dChwLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1BOih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1BLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUEucHJvdG90eXBlLmxvYWQpO30oKSk7XG4iXX0=
