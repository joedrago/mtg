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

  App.prototype.newGame = function(difficulty) {};

  App.prototype.resetAllHealth = function() {
    this.views.counter.resetAllHealth();
    return this.switchView("counter");
  };

  App.prototype["import"] = function(importString) {};

  App.prototype["export"] = function() {};

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
    this.chooseLayout(0);
    this.onDragReset();
    this.draw();
  }

  CounterView.prototype.chooseLayout = function(layout) {
    this.layoutIndex = layout;
    this.players = clone(this.layouts[layout].players);
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
var App, NoSleep, init;

App = require('./App');

NoSleep = require('nosleep.js');

init = function() {
  var canvas, canvasRect, noSleep;
  console.log("init");
  canvas = document.createElement("canvas");
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  document.body.insertBefore(canvas, document.body.childNodes[0]);
  canvasRect = canvas.getBoundingClientRect();
  noSleep = new NoSleep();
  noSleep.enable();
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


},{"./App":1,"nosleep.js":8}],6:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
const mediaFile = require('./media.js')

// Detect iOS browsers < version 10
const oldIOS = typeof navigator !== 'undefined' && parseFloat(
  ('' + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1])
    .replace('undefined', '3_2').replace('_', '.').replace('_', '')
) < 10 && !window.MSStream

class NoSleep {
  constructor () {
    if (oldIOS) {
      this.noSleepTimer = null
    } else {
      // Set up no sleep video element
      this.noSleepVideo = document.createElement('video')

      this.noSleepVideo.setAttribute('playsinline', '')
      this.noSleepVideo.setAttribute('src', mediaFile)

      this.noSleepVideo.addEventListener('timeupdate', function (e) {
        if (this.noSleepVideo.currentTime > 0.5) {
          this.noSleepVideo.currentTime = Math.random()
        }
      }.bind(this))
    }
  }

  enable () {
    if (oldIOS) {
      this.disable()
      this.noSleepTimer = window.setInterval(function () {
        window.location.href = '/'
        window.setTimeout(window.stop, 0)
      }, 15000)
    } else {
      this.noSleepVideo.play()
    }
  }

  disable () {
    if (oldIOS) {
      if (this.noSleepTimer) {
        window.clearInterval(this.noSleepTimer)
        this.noSleepTimer = null
      }
    } else {
      this.noSleepVideo.pause()
    }
  }
};

module.exports = NoSleep

},{"./media.js":9}],9:[function(require,module,exports){
module.exports = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQAD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'

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXENvdW50ZXJWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcTGF5b3V0Vmlldy5jb2ZmZWUiLCJnYW1lXFxzcmNcXE1lbnVWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcbWFpbi5jb2ZmZWUiLCJnYW1lXFxzcmNcXHZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIiwibm9kZV9tb2R1bGVzL25vc2xlZXAuanMvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL25vc2xlZXAuanMvc3JjL21lZGlhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVI7O0FBQ2QsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUjs7QUFFSjtFQUNTLGFBQUMsTUFBRDtJQUFDLElBQUMsQ0FBQSxTQUFEO0lBQ1osSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsSUFBbkI7SUFDUCxJQUFDLENBQUEsUUFBRCxDQUFVLFNBQVY7SUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGFBQVY7SUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTO0lBRVQsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQTVCO0lBQ3JCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxTQUFkLEVBQTRC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LGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFNBQUMsQ0FBRDtJQUNqQyxDQUFDLENBQUMsY0FBRixDQUFBO1dBQ0EsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFYLENBQUE7RUFGaUMsQ0FBbkM7QUExQ0s7O0FBOENQLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxTQUFDLENBQUQ7U0FDNUIsSUFBQSxDQUFBO0FBRDRCLENBQWhDLEVBRUUsS0FGRjs7OztBQ2pEQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0FqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJGb250RmFjZU9ic2VydmVyID0gcmVxdWlyZSAnZm9udGZhY2VvYnNlcnZlcidcclxuXHJcbk1lbnVWaWV3ID0gcmVxdWlyZSAnLi9NZW51VmlldydcclxuQ291bnRlclZpZXcgPSByZXF1aXJlICcuL0NvdW50ZXJWaWV3J1xyXG5MYXlvdXRWaWV3ID0gcmVxdWlyZSAnLi9MYXlvdXRWaWV3J1xyXG52ZXJzaW9uID0gcmVxdWlyZSAnLi92ZXJzaW9uJ1xyXG5cclxuY2xhc3MgQXBwXHJcbiAgY29uc3RydWN0b3I6IChAY2FudmFzKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAbG9hZEZvbnQoXCJzYXhNb25vXCIpXHJcbiAgICBAbG9hZEZvbnQoXCJJbnN0cnVjdGlvblwiKVxyXG4gICAgQGZvbnRzID0ge31cclxuXHJcbiAgICBAdmVyc2lvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wMilcclxuICAgIEB2ZXJzaW9uRm9udCA9IEByZWdpc3RlckZvbnQoXCJ2ZXJzaW9uXCIsIFwiI3tAdmVyc2lvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQGdlbmVyYXRpbmdGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDQpXHJcbiAgICBAZ2VuZXJhdGluZ0ZvbnQgPSBAcmVnaXN0ZXJGb250KFwiZ2VuZXJhdGluZ1wiLCBcIiN7QGdlbmVyYXRpbmdGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEB2aWV3cyA9XHJcbiAgICAgIG1lbnU6IG5ldyBNZW51Vmlldyh0aGlzLCBAY2FudmFzKVxyXG4gICAgICBjb3VudGVyOiBuZXcgQ291bnRlclZpZXcodGhpcywgQGNhbnZhcylcclxuICAgIEB2aWV3cy5sYXlvdXQgPSBuZXcgTGF5b3V0Vmlldyh0aGlzLCBAY2FudmFzLCBAdmlld3MuY291bnRlcilcclxuICAgIEBzd2l0Y2hWaWV3KFwiY291bnRlclwiKVxyXG5cclxuICBtZWFzdXJlRm9udHM6IC0+XHJcbiAgICBmb3IgZm9udE5hbWUsIGYgb2YgQGZvbnRzXHJcbiAgICAgIEBjdHguZm9udCA9IGYuc3R5bGVcclxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcclxuICAgICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICAgIGYuaGVpZ2h0ID0gTWF0aC5mbG9vcihAY3R4Lm1lYXN1cmVUZXh0KFwibVwiKS53aWR0aCAqIDEuMSkgIyBiZXN0IGhhY2sgZXZlclxyXG4gICAgICBjb25zb2xlLmxvZyBcIkZvbnQgI3tmb250TmFtZX0gbWVhc3VyZWQgYXQgI3tmLmhlaWdodH0gcGl4ZWxzXCJcclxuICAgIHJldHVyblxyXG5cclxuICByZWdpc3RlckZvbnQ6IChuYW1lLCBzdHlsZSkgLT5cclxuICAgIGZvbnQgPVxyXG4gICAgICBuYW1lOiBuYW1lXHJcbiAgICAgIHN0eWxlOiBzdHlsZVxyXG4gICAgICBoZWlnaHQ6IDBcclxuICAgIEBmb250c1tuYW1lXSA9IGZvbnRcclxuICAgIEBtZWFzdXJlRm9udHMoKVxyXG4gICAgcmV0dXJuIGZvbnRcclxuXHJcbiAgbG9hZEZvbnQ6IChmb250TmFtZSkgLT5cclxuICAgIGZvbnQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihmb250TmFtZSlcclxuICAgIGZvbnQubG9hZCgpLnRoZW4gPT5cclxuICAgICAgY29uc29sZS5sb2coXCIje2ZvbnROYW1lfSBsb2FkZWQsIHJlZHJhd2luZy4uLlwiKVxyXG4gICAgICBAbWVhc3VyZUZvbnRzKClcclxuICAgICAgQGRyYXcoKVxyXG5cclxuICBzd2l0Y2hWaWV3OiAodmlldykgLT5cclxuICAgIEB2aWV3ID0gQHZpZXdzW3ZpZXddXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcImFwcC5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcclxuXHJcbiAgICAjIEBkcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjNDQ0NDQ0XCIpXHJcbiAgICAjIEBkcmF3VGV4dENlbnRlcmVkKFwiR2VuZXJhdGluZywgcGxlYXNlIHdhaXQuLi5cIiwgQGNhbnZhcy53aWR0aCAvIDIsIEBjYW52YXMuaGVpZ2h0IC8gMiwgQGdlbmVyYXRpbmdGb250LCBcIiNmZmZmZmZcIilcclxuXHJcbiAgICAjIHdpbmRvdy5zZXRUaW1lb3V0ID0+XHJcbiAgICAjIEB2aWV3cy5zdWRva3UubmV3R2FtZShkaWZmaWN1bHR5KVxyXG4gICAgIyBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG4gICAgIyAsIDBcclxuXHJcbiAgcmVzZXRBbGxIZWFsdGg6IC0+XHJcbiAgICBAdmlld3MuY291bnRlci5yZXNldEFsbEhlYWx0aCgpXHJcbiAgICBAc3dpdGNoVmlldyhcImNvdW50ZXJcIilcclxuXHJcbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgIyByZXR1cm4gQHZpZXdzLnN1ZG9rdS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICAjIHJldHVybiBAdmlld3Muc3Vkb2t1LmV4cG9ydCgpXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBAdmlldy5kcmF3KClcclxuXHJcbiAgbW91c2Vkb3duOiAoeCwgeSkgLT5cclxuICAgIEB2aWV3Lm1vdXNlZG93bih4LCB5KVxyXG5cclxuICBtb3VzZW1vdmU6ICh4LCB5LCBidXR0b25zKSAtPlxyXG4gICAgQHZpZXcubW91c2Vtb3ZlKHgsIHksIGJ1dHRvbnMpXHJcblxyXG4gIG1vdXNldXA6ICh4LCB5KSAtPlxyXG4gICAgQHZpZXcubW91c2V1cCh4LCB5KVxyXG5cclxuICBkcmF3RmlsbDogKHgsIHksIHcsIGgsIGNvbG9yKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmZpbGwoKVxyXG5cclxuICBkcmF3Um91bmRlZFJlY3Q6ICh4LCB5LCB3LCBoLCByLCBmaWxsQ29sb3IgPSBudWxsLCBzdHJva2VDb2xvciA9IG51bGwpIC0+XHJcbiAgICBAY3R4LnJvdW5kUmVjdCh4LCB5LCB3LCBoLCByKVxyXG4gICAgaWYgZmlsbENvbG9yICE9IG51bGxcclxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBmaWxsQ29sb3JcclxuICAgICAgQGN0eC5maWxsKClcclxuICAgIGlmIHN0cm9rZUNvbG9yICE9IG51bGxcclxuICAgICAgQGN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZUNvbG9yXHJcbiAgICAgIEBjdHguc3Ryb2tlKClcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3UmVjdDogKHgsIHksIHcsIGgsIGNvbG9yLCBsaW5lV2lkdGggPSAxKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxyXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcblxyXG4gIGRyYXdMaW5lOiAoeDEsIHkxLCB4MiwgeTIsIGNvbG9yID0gXCJibGFja1wiLCBsaW5lV2lkdGggPSAxKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxyXG4gICAgQGN0eC5tb3ZlVG8oeDEsIHkxKVxyXG4gICAgQGN0eC5saW5lVG8oeDIsIHkyKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3QXJjOiAoeCwgeSwgciwgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGNvbG9yKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5tb3ZlVG8oeCwgeSlcclxuICAgIEBjdHguYXJjKHgsIHksIHIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKVxyXG4gICAgQGN0eC5jbG9zZVBhdGgoKVxyXG4gICAgQGN0eC5maWxsKClcclxuXHJcbiAgc3Ryb2tlQ2lyY2xlOiAoeCwgeSwgciwgY29sb3IsIGxpbmVXaWR0aCkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHguYXJjKHgsIHksIHIsIDAsIE1hdGguUEkgKiAyKVxyXG4gICAgQGN0eC5jbG9zZVBhdGgoKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3VGV4dENlbnRlcmVkOiAodGV4dCwgY3gsIGN5LCBmb250LCBjb2xvciwgcm90KSAtPlxyXG4gICAgQGN0eC5zYXZlKClcclxuICAgIEBjdHgudHJhbnNsYXRlKGN4LCBjeSlcclxuICAgIEBjdHgucm90YXRlKHJvdClcclxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuXHJcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgMCwgKGZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG4gICAgQGN0eC5yZXN0b3JlKClcclxuXHJcbiAgc3Ryb2tlVGV4dENlbnRlcmVkOiAodGV4dCwgY3gsIGN5LCBmb250LCBjb2xvciwgbGluZVdpZHRoLCByb3QpIC0+XHJcbiAgICBAY3R4LnNhdmUoKVxyXG4gICAgQGN0eC50cmFuc2xhdGUoY3gsIGN5KVxyXG4gICAgQGN0eC5yb3RhdGUocm90KVxyXG4gICAgQGN0eC5mb250ID0gZm9udC5zdHlsZVxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXHJcbiAgICBAY3R4LnN0cm9rZVRleHQodGV4dCwgMCwgKGZvbnQuaGVpZ2h0IC8gMikpXHJcbiAgICBAY3R4LnJlc3RvcmUoKVxyXG5cclxuICBkcmF3TG93ZXJMZWZ0OiAodGV4dCwgY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIlxyXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCAwLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG4gIGRyYXdWZXJzaW9uOiAoY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCJcclxuICAgIEBjdHguZmlsbFRleHQoXCJ2I3t2ZXJzaW9ufVwiLCBAY2FudmFzLndpZHRoIC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5yb3VuZFJlY3QgPSAoeCwgeSwgdywgaCwgcikgLT5cclxuICBpZiAodyA8IDIgKiByKSB0aGVuIHIgPSB3IC8gMlxyXG4gIGlmIChoIDwgMiAqIHIpIHRoZW4gciA9IGggLyAyXHJcbiAgQGJlZ2luUGF0aCgpXHJcbiAgQG1vdmVUbyh4K3IsIHkpXHJcbiAgQGFyY1RvKHgrdywgeSwgICB4K3csIHkraCwgcilcclxuICBAYXJjVG8oeCt3LCB5K2gsIHgsICAgeStoLCByKVxyXG4gIEBhcmNUbyh4LCAgIHkraCwgeCwgICB5LCAgIHIpXHJcbiAgQGFyY1RvKHgsICAgeSwgICB4K3csIHksICAgcilcclxuICBAY2xvc2VQYXRoKClcclxuICByZXR1cm4gdGhpc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBcclxuIiwiQ29sb3IgPVxyXG4gIGJhY2tncm91bmQ6IFwiIzMzMzMzM1wiXHJcbiAgZGlhbDogXCIjMzMzMzMzXCJcclxuICBkaWFsSGlnaGxpZ2h0OiBcIiM2NjY2NjZcIlxyXG4gIGhlYWx0aDogXCJ3aGl0ZVwiXHJcbiAgY2hhbmdpbmdIZWFsdGg6IFwicmVkXCJcclxuICBhZGRUZXh0OiBcIiMwMGZmMDBcIlxyXG4gIHN1YnRyYWN0VGV4dDogXCIjZmYwMDAwXCJcclxuICBtZW51OiBcIiNmZmZmZmZcIlxyXG5cclxuUGxheWVyQ29sb3JzID0gW1xyXG4gIFwiI2ZmYWFhYVwiXHJcbiAgXCIjYWFmZmFhXCJcclxuICBcIiNhYWFhZmZcIlxyXG4gIFwiI2ZmZmZhYVwiXHJcbiAgXCIjZmZhYWZmXCJcclxuICBcIiNhYWZmZmZcIlxyXG5dXHJcblxyXG5UV09fUEkgPSBNYXRoLlBJICogMlxyXG5cclxuY2xvbmUgPSAob2JqKSAtPlxyXG4gICMgVE9ETzogZmluZCBzb21ldGhpbmcgYmV0dGVyP1xyXG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpXHJcblxyXG5jbGFzcyBDb3VudGVyVmlld1xyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgSW5pdFxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcImNhbnZhcyBzaXplICN7QGNhbnZhcy53aWR0aH14I3tAY2FudmFzLmhlaWdodH1cIlxyXG5cclxuICAgIEBDb2xvciA9IENvbG9yXHJcbiAgICBAUGxheWVyQ29sb3JzID0gUGxheWVyQ29sb3JzXHJcblxyXG4gICAgIyBpbml0IGZvbnRzXHJcbiAgICBAaGVhbHRoRm9udFBpeGVscyA9IE1hdGguZmxvb3IoQGNhbnZhcy53aWR0aCAqIDAuMzApXHJcbiAgICBpbmNyZW1lbnRGb250UGl4ZWxzID0gTWF0aC5mbG9vcihAY2FudmFzLndpZHRoICogMC4wNSlcclxuICAgIG1lbnVGb250UGl4ZWxzID0gTWF0aC5mbG9vcihAY2FudmFzLndpZHRoICogMC4wNSlcclxuICAgIEBmb250cyA9XHJcbiAgICAgIGhlYWx0aDogICAgQGFwcC5yZWdpc3RlckZvbnQoXCJoZWFsdGhcIiwgICAgXCIje0BoZWFsdGhGb250UGl4ZWxzfXB4IEluc3RydWN0aW9uLCBtb25vc3BhY2VcIilcclxuICAgICAgaW5jcmVtZW50OiBAYXBwLnJlZ2lzdGVyRm9udChcImluY3JlbWVudFwiLCBcIiN7aW5jcmVtZW50Rm9udFBpeGVsc31weCBJbnN0cnVjdGlvbiwgbW9ub3NwYWNlXCIpXHJcbiAgICAgIG1lbnU6ICAgICAgQGFwcC5yZWdpc3RlckZvbnQoXCJpbmNyZW1lbnRcIiwgXCIje21lbnVGb250UGl4ZWxzfXB4IEluc3RydWN0aW9uLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAY2VudGVyID1cclxuICAgICAgeDogQGNhbnZhcy53aWR0aCAvIDJcclxuICAgICAgeTogQGNhbnZhcy5oZWlnaHQgLyAyXHJcblxyXG4gICAgQHNsaWNlQ291bnQgPSAyMFxyXG4gICAgQGhhbGZTbGljZUNvdW50ID0gTWF0aC5mbG9vcihAc2xpY2VDb3VudCAvIDIpXHJcbiAgICBAc2xpY2VBbmdsZSA9IFRXT19QSSAvIEBzbGljZUNvdW50XHJcbiAgICBAaGFsZlNsaWNlQW5nbGUgPSBAc2xpY2VBbmdsZSAvIDJcclxuXHJcbiAgICBAZGlhbFJhZGl1cyA9IEBjZW50ZXIueCAqIDAuOFxyXG4gICAgQGRpYWxJbmNyZW1lbnRSYWRpdXMgPSBAY2VudGVyLnggKiAwLjdcclxuICAgIEBtZW51UmFkaXVzID0gQGNlbnRlci54ICogMC4xXHJcblxyXG4gICAgQGxheW91dHMgPSBbXVxyXG5cclxuICAgIGZSYWRpdXMyID0gQGNlbnRlci55ICogMC42XHJcbiAgICBjUmFkaXVzNiA9IEBjZW50ZXIueCAqIDAuN1xyXG4gICAgZlJhZGl1czYgPSBAY2VudGVyLnggKiAxLjFcclxuXHJcbiAgICBAbGF5b3V0cy5wdXNoIHtcclxuICAgICAgbmFtZTogXCJTb2xvXCJcclxuICAgICAgcGxheWVyczogW1xyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCA0LCBmUmFkaXVzMiwgMjApXHJcbiAgICAgIF1cclxuICAgIH1cclxuXHJcbiAgICBAbGF5b3V0cy5wdXNoIHtcclxuICAgICAgbmFtZTogXCIyUFwiXHJcbiAgICAgIHBsYXllcnM6IFtcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgNCwgZlJhZGl1czIsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCAxNCwgZlJhZGl1czIsIDIwKVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgQGxheW91dHMucHVzaCB7XHJcbiAgICAgIG5hbWU6IFwiM1BcIlxyXG4gICAgICBwbGF5ZXJzOiBbXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDQsIGZSYWRpdXMyLCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgOSwgY1JhZGl1czYsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzJdLCAxNCwgZlJhZGl1czIsIDIwKVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgQGxheW91dHMucHVzaCB7XHJcbiAgICAgIG5hbWU6IFwiNFBcIlxyXG4gICAgICBwbGF5ZXJzOiBbXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDQsIGZSYWRpdXMyLCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgOSwgY1JhZGl1czYsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzJdLCAxNCwgZlJhZGl1czIsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzNdLCAxOSwgY1JhZGl1czYsIDIwKVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgQGxheW91dHMucHVzaCB7XHJcbiAgICAgIG5hbWU6IFwiU2NvcmVib2FyZCA0UFwiXHJcbiAgICAgIHBsYXllcnM6IFtcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgMiwgY1JhZGl1czYsIDIwLCBNYXRoLlBJIC8gMilcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgNiwgY1JhZGl1czYsIDIwLCBNYXRoLlBJIC8gMilcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1syXSwgMTIsIGNSYWRpdXM2LCAyMCwgTWF0aC5QSSAvIDIpXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbM10sIDE2LCBjUmFkaXVzNiwgMjAsIE1hdGguUEkgLyAyKVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgQGxheW91dHMucHVzaCB7XHJcbiAgICAgIG5hbWU6IFwiMnYyXCJcclxuICAgICAgcGxheWVyczogW1xyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCAgMiwgY1JhZGl1czYsIDIwLCAtTWF0aC5QSSAvIDIpXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sICA2LCBjUmFkaXVzNiwgMjAsICBNYXRoLlBJIC8gMilcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgMTIsIGNSYWRpdXM2LCAyMCwgIE1hdGguUEkgLyAyKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCAxNiwgY1JhZGl1czYsIDIwLCAtTWF0aC5QSSAvIDIpXHJcbiAgICAgIF1cclxuICAgIH1cclxuXHJcbiAgICBAbGF5b3V0cy5wdXNoIHtcclxuICAgICAgbmFtZTogXCI1IFBsYXllclwiXHJcbiAgICAgIHBsYXllcnM6IFtcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgMiwgZlJhZGl1czYsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCA2LCBmUmFkaXVzNiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMl0sIDksIGNSYWRpdXM2LCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1szXSwgMTIsIGZSYWRpdXM2LCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1s0XSwgMTYsIGZSYWRpdXM2LCAyMClcclxuICAgICAgXVxyXG4gICAgfVxyXG5cclxuICAgIEBsYXlvdXRzLnB1c2gge1xyXG4gICAgICBuYW1lOiBcIjZQXCJcclxuICAgICAgcGxheWVyczogW1xyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCAyLCBmUmFkaXVzNiwgMjApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDYsIGZSYWRpdXM2LCAyMClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1syXSwgOSwgY1JhZGl1czYsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzNdLCAxMiwgZlJhZGl1czYsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzRdLCAxNiwgZlJhZGl1czYsIDIwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzVdLCAxOSwgY1JhZGl1czYsIDIwKVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgQGxheW91dHMucHVzaCB7XHJcbiAgICAgIG5hbWU6IFwiQ29tbWFuZGVyIDZQXCJcclxuICAgICAgcGxheWVyczogW1xyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCAyLCBmUmFkaXVzNiwgNDApXHJcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDYsIGZSYWRpdXM2LCA0MClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgOSwgY1JhZGl1czYsIDQwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCAxMiwgZlJhZGl1czYsIDQwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCAxNiwgZlJhZGl1czYsIDQwKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCAxOSwgY1JhZGl1czYsIDQwKVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgQGNob29zZUxheW91dCgwKVxyXG4gICAgQG9uRHJhZ1Jlc2V0KClcclxuICAgIEBkcmF3KClcclxuXHJcbiAgY2hvb3NlTGF5b3V0OiAobGF5b3V0KSAtPlxyXG4gICAgQGxheW91dEluZGV4ID0gbGF5b3V0XHJcbiAgICBAcGxheWVycyA9IGNsb25lKEBsYXlvdXRzW2xheW91dF0ucGxheWVycylcclxuICAgIHJldHVyblxyXG5cclxuICByZXNldEFsbEhlYWx0aDogLT5cclxuICAgIEBjaG9vc2VMYXlvdXQoQGxheW91dEluZGV4KVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgaW1wb3J0OiAoaW1wb3J0U3RyaW5nKSAtPlxyXG4gICAgIyByZXR1cm4gQGNvdW50ZXIuaW1wb3J0KGltcG9ydFN0cmluZylcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgcmV0dXJuIFwiXCIgI0Bjb3VudGVyLmV4cG9ydCgpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBmYWNpbmdPdXRBbmdsZTogKHgsIHkpIC0+XHJcbiAgICByZXR1cm4gTWF0aC5hdGFuMih5IC0gQGNlbnRlci55LCB4IC0gQGNlbnRlci54KSAtIChNYXRoLlBJIC8gMilcclxuXHJcbiAgdW5wb2xhcjogKGFuZ2xlLCByLCBvZmZzZXRYID0gMCwgb2Zmc2V0WSA9IDApIC0+XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB4OiBvZmZzZXRYICsgKE1hdGguY29zKGFuZ2xlKSAqIHIpXHJcbiAgICAgIHk6IG9mZnNldFkgKyAoTWF0aC5zaW4oYW5nbGUpICogcilcclxuICAgIH1cclxuXHJcbiAgcG9zVG9TbGljZTogKHgsIHkpIC0+XHJcbiAgICBwb3NBbmdsZSA9IE1hdGguYXRhbjIoeSAtIEBjZW50ZXIueSwgeCAtIEBjZW50ZXIueClcclxuICAgIGlmIHBvc0FuZ2xlIDwgMFxyXG4gICAgICBwb3NBbmdsZSArPSBNYXRoLlBJICogMlxyXG4gICAgYW5nbGUgPSAwXHJcbiAgICBmb3Igc2xpY2UgaW4gWzAuLi5Ac2xpY2VDb3VudF1cclxuICAgICAgaWYgKHBvc0FuZ2xlID49IGFuZ2xlKSBhbmQgKHBvc0FuZ2xlIDwgKGFuZ2xlICsgQHNsaWNlQW5nbGUpKVxyXG4gICAgICAgIHJldHVybiBzbGljZVxyXG4gICAgICBhbmdsZSArPSBAc2xpY2VBbmdsZVxyXG4gICAgcmV0dXJuIDBcclxuXHJcbiAgcGxheWVyTGF5b3V0OiAoY29sb3IsIHNsaWNlLCByYWRpdXMsIGhlYWx0aCwgYW5nbGUgPSBudWxsKSAtPlxyXG4gICAgYyA9IEB1bnBvbGFyKCgoc2xpY2UgKyAxKSAlIEBzbGljZUNvdW50KSAqIEBzbGljZUFuZ2xlLCByYWRpdXMsIEBjZW50ZXIueCwgQGNlbnRlci55KVxyXG4gICAgaWYgYW5nbGUgPT0gbnVsbFxyXG4gICAgICBhbmdsZSA9IEBmYWNpbmdPdXRBbmdsZShjLngsIGMueSlcclxuICAgIHBsYXllciA9XHJcbiAgICAgIHg6IGMueFxyXG4gICAgICB5OiBjLnlcclxuICAgICAgYW5nbGU6IGFuZ2xlXHJcbiAgICAgIHNsaWNlOiBzbGljZVxyXG4gICAgICBoZWFsdGg6IGhlYWx0aFxyXG4gICAgICBjb2xvcjogY29sb3JcclxuICAgIHJldHVybiBwbGF5ZXJcclxuXHJcbiAgZGlzdGFuY2U6ICh4MCwgeTAsIHgxLCB5MSkgLT5cclxuICAgIHhkID0geDEgLSB4MFxyXG4gICAgeWQgPSB5MSAtIHkwXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ZCp4ZCkgKyAoeWQqeWQpKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgb25EcmFnUG9zOiAoeCwgeSkgLT5cclxuICAgIEBkcmFnZ2luZyA9IHRydWVcclxuXHJcbiAgICBpZiBAZHJhZ1NsaWNlID09IC0xXHJcbiAgICAgICMgRmlndXJlIG91dCB3aGljaCBwbGF5ZXIgd2Ugc3RhcnRlZCBvblxyXG4gICAgICBjbG9zZXN0SW5kZXggPSAwXHJcbiAgICAgIGNsb3Nlc3RQb3NpdGlvbiA9IEBjYW52YXMuaGVpZ2h0ICogMTAwMFxyXG4gICAgICBmb3IgcGxheWVyLCBpbmRleCBpbiBAcGxheWVyc1xyXG4gICAgICAgIGRpc3QgPSBAZGlzdGFuY2UocGxheWVyLngsIHBsYXllci55LCB4LCB5KVxyXG4gICAgICAgIGlmIGNsb3Nlc3RQb3NpdGlvbiA+IGRpc3RcclxuICAgICAgICAgIGNsb3Nlc3RQb3NpdGlvbiA9IGRpc3RcclxuICAgICAgICAgIGNsb3Nlc3RJbmRleCA9IGluZGV4XHJcbiAgICAgIEBkcmFnUGxheWVySW5kZXggPSBjbG9zZXN0SW5kZXhcclxuXHJcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAjIFRPRE86IGRpc3RyaWJ1dGUgYSBidW5jaCBvZiBtYXRoIG91dFxyXG4gICAgICBAZHJhZ1NsaWNlID0gQHBvc1RvU2xpY2UoeCwgeSlcclxuXHJcbiAgICAgIEBkcmFnRGVsdGEgPSBAZHJhZ1NsaWNlIC0gQHBsYXllcnNbQGRyYWdQbGF5ZXJJbmRleF0uc2xpY2VcclxuICAgICAgaWYgQGRyYWdEZWx0YSA+IEBoYWxmU2xpY2VDb3VudFxyXG4gICAgICAgIEBkcmFnRGVsdGEgLT0gQHNsaWNlQ291bnRcclxuICAgICAgaWYgQGRyYWdEZWx0YSA8IC1AaGFsZlNsaWNlQ291bnRcclxuICAgICAgICBAZHJhZ0RlbHRhICs9IEBzbGljZUNvdW50XHJcbiAgICAgIGNvbnNvbGUubG9nIFwiQGRyYWdEZWx0YSBzdGFydGluZyBhdCAje0BkcmFnRGVsdGF9XCJcclxuICAgIGVsc2VcclxuICAgICAgbmV3RHJhZ1NsaWNlID0gQHBvc1RvU2xpY2UoeCwgeSlcclxuICAgICAgaWYgQGRyYWdTbGljZSAhPSBuZXdEcmFnU2xpY2VcclxuICAgICAgICBzbGljZU9mZnNldCA9IG5ld0RyYWdTbGljZSAtIEBkcmFnU2xpY2VcclxuICAgICAgICBpZiBzbGljZU9mZnNldCA+IEBoYWxmU2xpY2VDb3VudFxyXG4gICAgICAgICAgc2xpY2VPZmZzZXQgLT0gQHNsaWNlQ291bnRcclxuICAgICAgICBpZiBzbGljZU9mZnNldCA8IC1AaGFsZlNsaWNlQ291bnRcclxuICAgICAgICAgIHNsaWNlT2Zmc2V0ICs9IEBzbGljZUNvdW50XHJcbiAgICAgICAgQGRyYWdEZWx0YSArPSBzbGljZU9mZnNldFxyXG4gICAgICAgIGNvbnNvbGUubG9nIFwiQGRyYWdEZWx0YSBub3cgYXQgI3tAZHJhZ0RlbHRhfVwiXHJcblxyXG4gICAgICAgIEBkcmFnU2xpY2UgPSBuZXdEcmFnU2xpY2VcclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBAZHJhZ1ggPSB4XHJcbiAgICBAZHJhZ1kgPSB5XHJcbiAgICAjIEBkcmFnQW5nbGUgPSBNYXRoLmF0YW4yKHkgLSBAY2VudGVyLnksIHggLSBAY2VudGVyLngpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgb25EcmFnUmVzZXQ6IC0+XHJcbiAgICBAZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgQGRyYWdQbGF5ZXJJbmRleCA9IC0xXHJcbiAgICBAZHJhZ1ggPSAtMVxyXG4gICAgQGRyYWdZID0gLTFcclxuICAgIEBkcmFnU2xpY2UgPSAtMVxyXG4gICAgQGRyYWdEZWx0YSA9IDBcclxuXHJcbiAgbW91c2Vkb3duOiAoeCwgeSkgLT5cclxuICAgIGRpc3RhbmNlRnJvbUNlbnRlciA9IEBkaXN0YW5jZSh4LCB5LCBAY2VudGVyLngsIEBjZW50ZXIueSlcclxuICAgIGlmIGRpc3RhbmNlRnJvbUNlbnRlciA8IEBtZW51UmFkaXVzXHJcbiAgICAgIEBhcHAuc3dpdGNoVmlldyhcIm1lbnVcIilcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgIyBjb25zb2xlLmxvZyBcIm1vdXNlZG93biAje3h9LCAje3l9XCJcclxuICAgIEBvbkRyYWdQb3MoeCwgeSlcclxuICAgIEBkcmF3KClcclxuXHJcbiAgbW91c2Vtb3ZlOiAoeCwgeSwgYnV0dG9ucykgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJtb3VzZWRvd24gI3t4fSwgI3t5fVwiXHJcbiAgICBpZiBidXR0b25zID09IDFcclxuICAgICAgQG9uRHJhZ1Bvcyh4LCB5KVxyXG4gICAgICBAZHJhdygpXHJcblxyXG4gIG1vdXNldXA6IC0+XHJcbiAgICBpZiBAZHJhZ2dpbmdcclxuICAgICAgZHJhZ1BsYXllciA9IEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdXHJcbiAgICAgIG5ld0hlYWx0aCA9IGRyYWdQbGF5ZXIuaGVhbHRoXHJcbiAgICAgIGlmIEBkcmFnRGVsdGEgPiAxXHJcbiAgICAgICAgbmV3SGVhbHRoICs9IEBkcmFnRGVsdGEgLSAxXHJcbiAgICAgIGVsc2UgaWYgQGRyYWdEZWx0YSA8IDBcclxuICAgICAgICBuZXdIZWFsdGggKz0gQGRyYWdEZWx0YVxyXG4gICAgICBkcmFnUGxheWVyLmhlYWx0aCA9IG5ld0hlYWx0aFxyXG5cclxuICAgIEBvbkRyYWdSZXNldCgpXHJcbiAgICBAZHJhdygpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBzbGljZU9mZnNldFRvRGVsdGE6IChvZmZzZXQpIC0+XHJcbiAgICBpZiBvZmZzZXQgPT0gMFxyXG4gICAgICByZXR1cm4gMFxyXG5cclxuICAgIGlmIG9mZnNldCA8PSBAaGFsZlNsaWNlQ291bnRcclxuICAgICAgIyB0cnlpbmcgdG8gaW5jcmVtZW50XHJcbiAgICAgIHJldHVybiBvZmZzZXRcclxuICAgIGVsc2VcclxuICAgICAgIyB0cnlpbmcgdG8gZGVjcmVtZW50XHJcbiAgICAgIHJldHVybiAtMSAqIChAc2xpY2VDb3VudCAtIG9mZnNldClcclxuXHJcbiAgZHJhdzogLT5cclxuICAgIGNvbnNvbGUubG9nIFwiZHJhdygpXCJcclxuXHJcbiAgICAjIENsZWFyIHNjcmVlbiB0byBibGFja1xyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgQ29sb3IuYmFja2dyb3VuZClcclxuICAgICMgQGFwcC5kcmF3UmVjdChAY2VudGVyLngsIEBjZW50ZXIueSwgMSwgMSwgXCJ3aGl0ZVwiLCAxKSAjIGRlYnVnIGNlbnRlciBkb3RcclxuXHJcbiAgICBAYXBwLnN0cm9rZUNpcmNsZShAY2VudGVyLngsIEBjZW50ZXIueSwgQG1lbnVSYWRpdXMsIFwid2hpdGVcIiwgNClcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIk1cIiwgQGNlbnRlci54LCBAY2VudGVyLnksIEBmb250cy5tZW51LCBDb2xvci5tZW51LCAwKVxyXG5cclxuICAgIGZvciBwbGF5ZXIsIGluZGV4IGluIEBwbGF5ZXJzXHJcbiAgICAgIGNvbG9yID0gQ29sb3IuaGVhbHRoXHJcbiAgICAgIGlmIEBkcmFnZ2luZyBhbmQgKGluZGV4ID09IEBkcmFnUGxheWVySW5kZXgpXHJcbiAgICAgICAgY29sb3IgPSBDb2xvci5jaGFuZ2luZ0hlYWx0aFxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoICBTdHJpbmcocGxheWVyLmhlYWx0aCksIHBsYXllci54LCBwbGF5ZXIueSwgQGZvbnRzLmhlYWx0aCwgcGxheWVyLmNvbG9yLCBwbGF5ZXIuYW5nbGUpXHJcbiAgICAgIEBhcHAuc3Ryb2tlVGV4dENlbnRlcmVkKFN0cmluZyhwbGF5ZXIuaGVhbHRoKSwgcGxheWVyLngsIHBsYXllci55LCBAZm9udHMuaGVhbHRoLCBcIndoaXRlXCIsIDQsIHBsYXllci5hbmdsZSlcclxuXHJcbiAgICBpZiBAZHJhZ2dpbmdcclxuICAgICAgZHJhZ1BsYXllciA9IEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdXHJcblxyXG4gICAgICBAYXBwLmRyYXdBcmMoQGNlbnRlci54LCBAY2VudGVyLnksIEBkaWFsUmFkaXVzLCAwLCBUV09fUEksIENvbG9yLmRpYWwpXHJcblxyXG4gICAgICBmb3IgaSBpbiBbMC4uLkBoYWxmU2xpY2VDb3VudCsxXVxyXG4gICAgICAgIHNsaWNlID0gKEBkcmFnU2xpY2UgKyBpKSAlIEBzbGljZUNvdW50XHJcbiAgICAgICAgYW5nbGUgPSBzbGljZSAqIEBzbGljZUFuZ2xlXHJcbiAgICAgICAgdmFsdWUgPSBAZHJhZ0RlbHRhICsgaVxyXG4gICAgICAgIGlmIHNsaWNlID09IEBkcmFnU2xpY2VcclxuICAgICAgICAgIEBhcHAuZHJhd0FyYyhAY2VudGVyLngsIEBjZW50ZXIueSwgQGRpYWxSYWRpdXMsIGFuZ2xlLCBhbmdsZSArIEBzbGljZUFuZ2xlLCBDb2xvci5kaWFsSGlnaGxpZ2h0KVxyXG4gICAgICAgIGlmICh2YWx1ZSAhPSAwKSBhbmQgKHZhbHVlICE9IDEpXHJcbiAgICAgICAgICBpZiB2YWx1ZSA+IDBcclxuICAgICAgICAgICAgdGV4dFYgPSBcIisje3ZhbHVlIC0gMX1cIlxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5hZGRUZXh0XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRleHRWID0gXCIje3ZhbHVlfVwiXHJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnN1YnRyYWN0VGV4dFxyXG4gICAgICAgICAgdGV4dFBvcyA9IEB1bnBvbGFyKGFuZ2xlICsgQGhhbGZTbGljZUFuZ2xlLCBAZGlhbEluY3JlbWVudFJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXHJcbiAgICAgICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQodGV4dFYsIHRleHRQb3MueCwgdGV4dFBvcy55LCBAZm9udHMuaW5jcmVtZW50LCB0ZXh0Q29sb3IsIEBmYWNpbmdPdXRBbmdsZSh0ZXh0UG9zLngsIHRleHRQb3MueSkpXHJcblxyXG4gICAgICBmb3IgaSBpbiBbMS4uLkBoYWxmU2xpY2VDb3VudF1cclxuICAgICAgICBzbGljZSA9IChAc2xpY2VDb3VudCArIEBkcmFnU2xpY2UgLSBpKSAlIEBzbGljZUNvdW50XHJcbiAgICAgICAgYW5nbGUgPSBzbGljZSAqIEBzbGljZUFuZ2xlXHJcbiAgICAgICAgdmFsdWUgPSBAZHJhZ0RlbHRhIC0gaVxyXG4gICAgICAgIGlmICh2YWx1ZSAhPSAwKSBhbmQgKHZhbHVlICE9IDEpXHJcbiAgICAgICAgICBpZiB2YWx1ZSA+IDBcclxuICAgICAgICAgICAgdGV4dFYgPSBcIisje3ZhbHVlIC0gMX1cIlxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5hZGRUZXh0XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRleHRWID0gXCIje3ZhbHVlfVwiXHJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLnN1YnRyYWN0VGV4dFxyXG4gICAgICAgICAgdGV4dFBvcyA9IEB1bnBvbGFyKGFuZ2xlICsgQGhhbGZTbGljZUFuZ2xlLCBAZGlhbEluY3JlbWVudFJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXHJcbiAgICAgICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQodGV4dFYsIHRleHRQb3MueCwgdGV4dFBvcy55LCBAZm9udHMuaW5jcmVtZW50LCB0ZXh0Q29sb3IsIEBmYWNpbmdPdXRBbmdsZSh0ZXh0UG9zLngsIHRleHRQb3MueSkpXHJcblxyXG4gICAgICBAYXBwLnN0cm9rZUNpcmNsZShAY2VudGVyLngsIEBjZW50ZXIueSwgQGRpYWxSYWRpdXMsIFwid2hpdGVcIiwgNClcclxuXHJcbiAgICAgIGVzdGltYXRlZEhlYWx0aCA9IGRyYWdQbGF5ZXIuaGVhbHRoXHJcbiAgICAgIGlmIEBkcmFnRGVsdGEgPiAxXHJcbiAgICAgICAgZXN0aW1hdGVkSGVhbHRoICs9IEBkcmFnRGVsdGEgLSAxXHJcbiAgICAgIGVsc2UgaWYgQGRyYWdEZWx0YSA8IDBcclxuICAgICAgICBlc3RpbWF0ZWRIZWFsdGggKz0gQGRyYWdEZWx0YVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoICBlc3RpbWF0ZWRIZWFsdGgsIEBjZW50ZXIueCwgQGNlbnRlci55LCBAZm9udHMuaGVhbHRoLCBkcmFnUGxheWVyLmNvbG9yLCBkcmFnUGxheWVyLmFuZ2xlKVxyXG4gICAgICBAYXBwLnN0cm9rZVRleHRDZW50ZXJlZChlc3RpbWF0ZWRIZWFsdGgsIEBjZW50ZXIueCwgQGNlbnRlci55LCBAZm9udHMuaGVhbHRoLCBcIndoaXRlXCIsIDQsIGRyYWdQbGF5ZXIuYW5nbGUpXHJcblxyXG4gICAgcmV0dXJuXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb3VudGVyVmlld1xyXG4iLCJCVVRUT05fSEVJR0hUID0gMC4wNlxyXG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcclxuQlVUVE9OX1NQQUNJTkcgPSAwLjA4XHJcbkJVVFRPTl9TRVBBUkFUT1IgPSAwLjAzXHJcblxyXG5idXR0b25Qb3MgPSAoaW5kZXgpIC0+XHJcbiAgeSA9IEZJUlNUX0JVVFRPTl9ZICsgKEJVVFRPTl9TUEFDSU5HICogaW5kZXgpXHJcbiAgaWYgaW5kZXggPiAzXHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDRcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNlxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgcmV0dXJuIHlcclxuXHJcbmNsYXNzIExheW91dFZpZXdcclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMsIEBjb3VudGVyKSAtPlxyXG4gICAgQGJ1dHRvbnMgPVxyXG4gICAgICBjYW5jZWw6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDcpXHJcbiAgICAgICAgdGV4dDogXCJDYW5jZWxcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3Nzc3N1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAY2FuY2VsLmJpbmQodGhpcylcclxuXHJcbiAgICAjIG1ha2VzIGZvciBhIEBzY2FsZSB4IEBzY2FsZSBibG9jayBvZiBjaG9pY2VzXHJcbiAgICBAc2NhbGUgPSA1XHJcblxyXG4gICAgQG5hbWVGb250UGl4ZWxzID0gQGNvdW50ZXIuaGVhbHRoRm9udFBpeGVscyAvIEBzY2FsZSAvIDNcclxuICAgIEBmb250cyA9XHJcbiAgICAgIGhlYWx0aDogQGFwcC5yZWdpc3RlckZvbnQoXCJoZWFsdGhcIiwgXCIje0Bjb3VudGVyLmhlYWx0aEZvbnRQaXhlbHMgLyBAc2NhbGV9cHggSW5zdHJ1Y3Rpb24sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBuYW1lOiAgIEBhcHAucmVnaXN0ZXJGb250KFwibmFtZVwiLCAgIFwiI3tAbmFtZUZvbnRQaXhlbHN9cHggSW5zdHJ1Y3Rpb24sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxyXG4gICAgQGJ1dHRvbkhlaWdodCA9IEBjYW52YXMuaGVpZ2h0ICogQlVUVE9OX0hFSUdIVFxyXG4gICAgYnV0dG9uWCA9IChAY2FudmFzLndpZHRoIC0gYnV0dG9uV2lkdGgpIC8gMlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBidXR0b24ueCA9IGJ1dHRvblhcclxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XHJcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcclxuICAgICAgYnV0dG9uLmggPSBAYnV0dG9uSGVpZ2h0XHJcblxyXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcclxuICAgIEBidXR0b25Gb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje2J1dHRvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4xKVxyXG4gICAgQHRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3t0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd0xheW91dDogKGxheW91dCwgb3gsIG95KSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJkcmF3aW5nIGxheW91dFwiLCBsYXlvdXRcclxuICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KG94LCBveSwgQGNhbnZhcy53aWR0aCAvIEBzY2FsZSwgQGNhbnZhcy5oZWlnaHQgLyBAc2NhbGUsIDAsIEBjb3VudGVyLkNvbG9yLmJhY2tncm91bmQsIFwiYmxhY2tcIilcclxuICAgIGZvciBwbGF5ZXIgaW4gbGF5b3V0LnBsYXllcnNcclxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHBsYXllci5oZWFsdGgsIG94ICsgKHBsYXllci54IC8gQHNjYWxlKSwgb3kgKyAocGxheWVyLnkgLyBAc2NhbGUpLCBAZm9udHMuaGVhbHRoLCBwbGF5ZXIuY29sb3IsIHBsYXllci5hbmdsZSlcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChsYXlvdXQubmFtZSwgb3ggKyAoQGNhbnZhcy53aWR0aCAvIEBzY2FsZSAvIDIpLCBveSArIEBuYW1lRm9udFBpeGVscywgQGZvbnRzLm5hbWUsIFwid2hpdGVcIiwgMClcclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMDAwMFwiKVxyXG5cclxuICAgIGZvciBsYXlvdXQsIGkgaW4gQGNvdW50ZXIubGF5b3V0c1xyXG4gICAgICB4ID0gKGkgJSBAc2NhbGUpICogQGNhbnZhcy53aWR0aCAvIEBzY2FsZVxyXG4gICAgICB5ID0gTWF0aC5mbG9vcihpIC8gQHNjYWxlKSAqIEBjYW52YXMuaGVpZ2h0IC8gQHNjYWxlXHJcbiAgICAgIEBkcmF3TGF5b3V0KGxheW91dCwgeCwgeSlcclxuXHJcbiAgICBzaGFkb3dPZmZzZXQgPSBAY2FudmFzLmhlaWdodCAqIDAuMDFcclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLnggKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi55ICsgc2hhZG93T2Zmc2V0LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBcImJsYWNrXCIsIFwiYmxhY2tcIilcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBidXR0b24uYmdDb2xvciwgXCIjOTk5OTk5XCIpXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLncgLyAyKSwgYnV0dG9uLnkgKyAoYnV0dG9uLmggLyAyKSwgQGJ1dHRvbkZvbnQsIGJ1dHRvbi50ZXh0Q29sb3IpXHJcblxyXG4gICAgIyBAYXBwLmRyYXdWZXJzaW9uKClcclxuXHJcbiAgbW91c2Vkb3duOiAoeCwgeSkgLT5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgaWYgKHkgPiBidXR0b24ueSkgJiYgKHkgPCAoYnV0dG9uLnkgKyBAYnV0dG9uSGVpZ2h0KSlcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiYnV0dG9uIHByZXNzZWQ6ICN7YnV0dG9uTmFtZX1cIlxyXG4gICAgICAgIGJ1dHRvbi5jbGljaygpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgY29uc29sZS5sb2cgXCIje3h9LCAje3l9XCJcclxuICAgIGxheW91dEluZGV4ID0gTWF0aC5mbG9vcih4IC8gKEBjYW52YXMud2lkdGggLyBAc2NhbGUpKSArIE1hdGguZmxvb3IoQHNjYWxlICogTWF0aC5mbG9vcih5IC8gKEBjYW52YXMuaGVpZ2h0IC8gQHNjYWxlKSkpXHJcbiAgICBpZiAobGF5b3V0SW5kZXggPj0gMCkgYW5kIChsYXlvdXRJbmRleCA8IEBjb3VudGVyLmxheW91dHMubGVuZ3RoKVxyXG4gICAgICBsYXlvdXQgPSBAY291bnRlci5sYXlvdXRzW2xheW91dEluZGV4XVxyXG4gICAgICBpZihjb25maXJtKFwiUmVzZXQgdG8gdGhlICcje2xheW91dC5uYW1lfScgbGF5b3V0P1wiKSlcclxuICAgICAgICBAY291bnRlci5jaG9vc2VMYXlvdXQobGF5b3V0SW5kZXgpXHJcbiAgICAgICAgQGFwcC5zd2l0Y2hWaWV3KFwiY291bnRlclwiKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG1vdXNlbW92ZTogKHgsIHksIGJ1dHRvbnMpIC0+XHJcbiAgbW91c2V1cDogLT5cclxuXHJcbiAgY2FuY2VsOiAtPlxyXG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwibWVudVwiKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMYXlvdXRWaWV3XHJcbiIsIkJVVFRPTl9IRUlHSFQgPSAwLjA2XHJcbkZJUlNUX0JVVFRPTl9ZID0gMC4yMlxyXG5CVVRUT05fU1BBQ0lORyA9IDAuMDhcclxuQlVUVE9OX1NFUEFSQVRPUiA9IDAuMDNcclxuXHJcbmJ1dHRvblBvcyA9IChpbmRleCkgLT5cclxuICB5ID0gRklSU1RfQlVUVE9OX1kgKyAoQlVUVE9OX1NQQUNJTkcgKiBpbmRleClcclxuICBpZiBpbmRleCA+IDNcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNFxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgaWYgaW5kZXggPiA2XHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICByZXR1cm4geVxyXG5cclxuY2xhc3MgTWVudVZpZXdcclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XHJcbiAgICBAYnV0dG9ucyA9XHJcbiAgICAgIGNob29zZUxheW91dDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMSlcclxuICAgICAgICB0ZXh0OiBcIkNob29zZSBMYXlvdXRcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzU1NTU1NVwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAY2hvb3NlTGF5b3V0LmJpbmQodGhpcylcclxuICAgICAgcmVzZXRBbGxIZWFsdGg6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDIpXHJcbiAgICAgICAgdGV4dDogXCJSZXNldCBBbGwgSGVhbHRoXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM1NTU1NTVcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc2V0QWxsSGVhbHRoLmJpbmQodGhpcylcclxuICAgICAgcmVzdW1lOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg3KVxyXG4gICAgICAgIHRleHQ6IFwiUmVzdW1lXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3NzdcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc3VtZS5iaW5kKHRoaXMpXHJcblxyXG4gICAgYnV0dG9uV2lkdGggPSBAY2FudmFzLndpZHRoICogMC44XHJcbiAgICBAYnV0dG9uSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgKiBCVVRUT05fSEVJR0hUXHJcbiAgICBidXR0b25YID0gKEBjYW52YXMud2lkdGggLSBidXR0b25XaWR0aCkgLyAyXHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGJ1dHRvbi54ID0gYnV0dG9uWFxyXG4gICAgICBidXR0b24ueSA9IEBjYW52YXMuaGVpZ2h0ICogYnV0dG9uLnlcclxuICAgICAgYnV0dG9uLncgPSBidXR0b25XaWR0aFxyXG4gICAgICBidXR0b24uaCA9IEBidXR0b25IZWlnaHRcclxuXHJcbiAgICBidXR0b25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAYnV0dG9uSGVpZ2h0ICogMC40KVxyXG4gICAgQGJ1dHRvbkZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7YnV0dG9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjEpXHJcbiAgICBAdGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3RpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjMzMzMzMzXCIpXHJcblxyXG4gICAgeCA9IEBjYW52YXMud2lkdGggLyAyXHJcbiAgICBzaGFkb3dPZmZzZXQgPSBAY2FudmFzLmhlaWdodCAqIDAuMDFcclxuXHJcbiAgICB5MSA9IEBjYW52YXMuaGVpZ2h0ICogMC4wNVxyXG4gICAgeTIgPSBAY2FudmFzLmhlaWdodCAqIDAuMTVcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIk1UR1wiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJNVEdcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLnggKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi55ICsgc2hhZG93T2Zmc2V0LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBcImJsYWNrXCIsIFwiYmxhY2tcIilcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBidXR0b24uYmdDb2xvciwgXCIjOTk5OTk5XCIpXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLncgLyAyKSwgYnV0dG9uLnkgKyAoYnV0dG9uLmggLyAyKSwgQGJ1dHRvbkZvbnQsIGJ1dHRvbi50ZXh0Q29sb3IpXHJcblxyXG4gICAgQGFwcC5kcmF3VmVyc2lvbigpXHJcblxyXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGlmICh5ID4gYnV0dG9uLnkpICYmICh5IDwgKGJ1dHRvbi55ICsgQGJ1dHRvbkhlaWdodCkpXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImJ1dHRvbiBwcmVzc2VkOiAje2J1dHRvbk5hbWV9XCJcclxuICAgICAgICBidXR0b24uY2xpY2soKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG1vdXNlbW92ZTogKHgsIHksIGJ1dHRvbnMpIC0+XHJcbiAgbW91c2V1cDogLT5cclxuXHJcbiAgY2hvb3NlTGF5b3V0OiAtPlxyXG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwibGF5b3V0XCIpXHJcblxyXG4gIHJlc2V0QWxsSGVhbHRoOiAtPlxyXG4gICAgaWYoY29uZmlybShcIlJlc2V0IGFsbCBoZWFsdGg/XCIpKVxyXG4gICAgICBAYXBwLnJlc2V0QWxsSGVhbHRoKClcclxuXHJcbiAgcmVzdW1lOiAtPlxyXG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwiY291bnRlclwiKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51Vmlld1xyXG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcclxuTm9TbGVlcCA9IHJlcXVpcmUgJ25vc2xlZXAuanMnXHJcblxyXG5pbml0ID0gLT5cclxuICBjb25zb2xlLmxvZyBcImluaXRcIlxyXG4gIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIilcclxuICBjYW52YXMud2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxyXG4gIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGNhbnZhcywgZG9jdW1lbnQuYm9keS5jaGlsZE5vZGVzWzBdKVxyXG4gIGNhbnZhc1JlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuXHJcbiAgbm9TbGVlcCA9IG5ldyBOb1NsZWVwKClcclxuICBub1NsZWVwLmVuYWJsZSgpXHJcblxyXG4gIHdpbmRvdy5hcHAgPSBuZXcgQXBwKGNhbnZhcylcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaHN0YXJ0XCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB4ID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAgIHkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXHJcbiAgICB3aW5kb3cuYXBwLm1vdXNlZG93bih4LCB5KVxyXG5cclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcInRvdWNobW92ZVwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgd2luZG93LmFwcC5tb3VzZW1vdmUoeCwgeSwgMSlcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaGVuZFwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgd2luZG93LmFwcC5tb3VzZXVwKClcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZWRvd25cIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHggPSBlLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAgIHkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgd2luZG93LmFwcC5tb3VzZWRvd24oeCwgeSlcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZW1vdmVcIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHggPSBlLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAgIHkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgYnV0dG9ucyA9IGUuYnV0dG9uc1xyXG4gICAgd2luZG93LmFwcC5tb3VzZW1vdmUoeCwgeSwgYnV0dG9ucylcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZXVwXCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB3aW5kb3cuYXBwLm1vdXNldXAoKVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgLT5cclxuICAgIGluaXQoKVxyXG4sIGZhbHNlKVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiMC4wLjFcIiIsIi8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4wLjEzIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbChhLGIpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYiwhMSk6YS5hdHRhY2hFdmVudChcInNjcm9sbFwiLGIpfWZ1bmN0aW9uIG0oYSl7ZG9jdW1lbnQuYm9keT9hKCk6ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uIGMoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGMpO2EoKX0pOmRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24gaygpe2lmKFwiaW50ZXJhY3RpdmVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8XCJjb21wbGV0ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsayksYSgpfSl9O2Z1bmN0aW9uIHIoYSl7dGhpcy5hPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5hLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpO3RoaXMuYS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSk7dGhpcy5iPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmg9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5mPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZz0tMTt0aGlzLmIuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuYy5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG50aGlzLmYuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaC5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmIuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmMuYXBwZW5kQ2hpbGQodGhpcy5mKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5iKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5jKX1cbmZ1bmN0aW9uIHQoYSxiKXthLmEuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2IrXCI7XCJ9ZnVuY3Rpb24geShhKXt2YXIgYj1hLmEub2Zmc2V0V2lkdGgsYz1iKzEwMDthLmYuc3R5bGUud2lkdGg9YytcInB4XCI7YS5jLnNjcm9sbExlZnQ9YzthLmIuc2Nyb2xsTGVmdD1hLmIuc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmchPT1iPyhhLmc9YiwhMCk6ITF9ZnVuY3Rpb24geihhLGIpe2Z1bmN0aW9uIGMoKXt2YXIgYT1rO3koYSkmJmEuYS5wYXJlbnROb2RlJiZiKGEuZyl9dmFyIGs9YTtsKGEuYixjKTtsKGEuYyxjKTt5KGEpfTtmdW5jdGlvbiBBKGEsYil7dmFyIGM9Ynx8e307dGhpcy5mYW1pbHk9YTt0aGlzLnN0eWxlPWMuc3R5bGV8fFwibm9ybWFsXCI7dGhpcy53ZWlnaHQ9Yy53ZWlnaHR8fFwibm9ybWFsXCI7dGhpcy5zdHJldGNoPWMuc3RyZXRjaHx8XCJub3JtYWxcIn12YXIgQj1udWxsLEM9bnVsbCxFPW51bGwsRj1udWxsO2Z1bmN0aW9uIEcoKXtpZihudWxsPT09QylpZihKKCkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcikpe3ZhciBhPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtDPSEhYSYmNjAzPnBhcnNlSW50KGFbMV0sMTApfWVsc2UgQz0hMTtyZXR1cm4gQ31mdW5jdGlvbiBKKCl7bnVsbD09PUYmJihGPSEhZG9jdW1lbnQuZm9udHMpO3JldHVybiBGfVxuZnVuY3Rpb24gSygpe2lmKG51bGw9PT1FKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXthLnN0eWxlLmZvbnQ9XCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwifWNhdGNoKGIpe31FPVwiXCIhPT1hLnN0eWxlLmZvbnR9cmV0dXJuIEV9ZnVuY3Rpb24gTChhLGIpe3JldHVyblthLnN0eWxlLGEud2VpZ2h0LEsoKT9hLnN0cmV0Y2g6XCJcIixcIjEwMHB4XCIsYl0uam9pbihcIiBcIil9XG5BLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxrPWF8fFwiQkVTYnN3eVwiLHE9MCxEPWJ8fDNFMyxIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2lmKEooKSYmIUcoKSl7dmFyIE09bmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBlKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RD9iKCk6ZG9jdW1lbnQuZm9udHMubG9hZChMKGMsJ1wiJytjLmZhbWlseSsnXCInKSxrKS50aGVuKGZ1bmN0aW9uKGMpezE8PWMubGVuZ3RoP2EoKTpzZXRUaW1lb3V0KGUsMjUpfSxmdW5jdGlvbigpe2IoKX0pfWUoKX0pLE49bmV3IFByb21pc2UoZnVuY3Rpb24oYSxjKXtxPXNldFRpbWVvdXQoYyxEKX0pO1Byb21pc2UucmFjZShbTixNXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChxKTthKGMpfSxmdW5jdGlvbigpe2IoYyl9KX1lbHNlIG0oZnVuY3Rpb24oKXtmdW5jdGlvbiB1KCl7dmFyIGI7aWYoYj0tMSE9XG5mJiYtMSE9Z3x8LTEhPWYmJi0xIT1ofHwtMSE9ZyYmLTEhPWgpKGI9ZiE9ZyYmZiE9aCYmZyE9aCl8fChudWxsPT09QiYmKGI9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEI9ISFiJiYoNTM2PnBhcnNlSW50KGJbMV0sMTApfHw1MzY9PT1wYXJzZUludChiWzFdLDEwKSYmMTE+PXBhcnNlSW50KGJbMl0sMTApKSksYj1CJiYoZj09diYmZz09diYmaD09dnx8Zj09dyYmZz09dyYmaD09d3x8Zj09eCYmZz09eCYmaD09eCkpLGI9IWI7YiYmKGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGNsZWFyVGltZW91dChxKSxhKGMpKX1mdW5jdGlvbiBJKCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RClkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxiKGMpO2Vsc2V7dmFyIGE9ZG9jdW1lbnQuaGlkZGVuO2lmKCEwPT09YXx8dm9pZCAwPT09YSlmPWUuYS5vZmZzZXRXaWR0aCxcbmc9bi5hLm9mZnNldFdpZHRoLGg9cC5hLm9mZnNldFdpZHRoLHUoKTtxPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyByKGspLG49bmV3IHIoaykscD1uZXcgcihrKSxmPS0xLGc9LTEsaD0tMSx2PS0xLHc9LTEseD0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt0KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dChuLEwoYyxcInNlcmlmXCIpKTt0KHAsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChuLmEpO2QuYXBwZW5kQ2hpbGQocC5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3Y9ZS5hLm9mZnNldFdpZHRoO3c9bi5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO0koKTt6KGUsZnVuY3Rpb24oYSl7Zj1hO3UoKX0pO3QoZSxMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2Fucy1zZXJpZicpKTt6KG4sZnVuY3Rpb24oYSl7Zz1hO3UoKX0pO3QobixMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2VyaWYnKSk7XG56KHAsZnVuY3Rpb24oYSl7aD1hO3UoKX0pO3QocCxMKGMsJ1wiJytjLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9QTood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9QSx3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1BLnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIiwiY29uc3QgbWVkaWFGaWxlID0gcmVxdWlyZSgnLi9tZWRpYS5qcycpXG5cbi8vIERldGVjdCBpT1MgYnJvd3NlcnMgPCB2ZXJzaW9uIDEwXG5jb25zdCBvbGRJT1MgPSB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBwYXJzZUZsb2F0KFxuICAoJycgKyAoL0NQVS4qT1MgKFswLTlfXXszLDR9KVswLTlfXXswLDF9fChDUFUgbGlrZSkuKkFwcGxlV2ViS2l0LipNb2JpbGUvaS5leGVjKG5hdmlnYXRvci51c2VyQWdlbnQpIHx8IFswLCAnJ10pWzFdKVxuICAgIC5yZXBsYWNlKCd1bmRlZmluZWQnLCAnM18yJykucmVwbGFjZSgnXycsICcuJykucmVwbGFjZSgnXycsICcnKVxuKSA8IDEwICYmICF3aW5kb3cuTVNTdHJlYW1cblxuY2xhc3MgTm9TbGVlcCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBpZiAob2xkSU9TKSB7XG4gICAgICB0aGlzLm5vU2xlZXBUaW1lciA9IG51bGxcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2V0IHVwIG5vIHNsZWVwIHZpZGVvIGVsZW1lbnRcbiAgICAgIHRoaXMubm9TbGVlcFZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKVxuXG4gICAgICB0aGlzLm5vU2xlZXBWaWRlby5zZXRBdHRyaWJ1dGUoJ3BsYXlzaW5saW5lJywgJycpXG4gICAgICB0aGlzLm5vU2xlZXBWaWRlby5zZXRBdHRyaWJ1dGUoJ3NyYycsIG1lZGlhRmlsZSlcblxuICAgICAgdGhpcy5ub1NsZWVwVmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0aGlzLm5vU2xlZXBWaWRlby5jdXJyZW50VGltZSA+IDAuNSkge1xuICAgICAgICAgIHRoaXMubm9TbGVlcFZpZGVvLmN1cnJlbnRUaW1lID0gTWF0aC5yYW5kb20oKVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpXG4gICAgfVxuICB9XG5cbiAgZW5hYmxlICgpIHtcbiAgICBpZiAob2xkSU9TKSB7XG4gICAgICB0aGlzLmRpc2FibGUoKVxuICAgICAgdGhpcy5ub1NsZWVwVGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJ1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCh3aW5kb3cuc3RvcCwgMClcbiAgICAgIH0sIDE1MDAwKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vU2xlZXBWaWRlby5wbGF5KClcbiAgICB9XG4gIH1cblxuICBkaXNhYmxlICgpIHtcbiAgICBpZiAob2xkSU9TKSB7XG4gICAgICBpZiAodGhpcy5ub1NsZWVwVGltZXIpIHtcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5ub1NsZWVwVGltZXIpXG4gICAgICAgIHRoaXMubm9TbGVlcFRpbWVyID0gbnVsbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vU2xlZXBWaWRlby5wYXVzZSgpXG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5vU2xlZXBcbiIsIm1vZHVsZS5leHBvcnRzID0gJ2RhdGE6dmlkZW8vbXA0O2Jhc2U2NCxBQUFBSUdaMGVYQnRjRFF5QUFBQ0FHbHpiMjFwYzI4eVlYWmpNVzF3TkRFQUFBQUlabkpsWlFBQUNLQnRaR0YwQUFBQzh3WUYvLy92M0VYcHZlYlpTTGVXTE5nZzJTUHU3M2d5TmpRZ0xTQmpiM0psSURFME1pQnlNalEzT1NCa1pEYzVZVFl4SUMwZ1NDNHlOalF2VFZCRlJ5MDBJRUZXUXlCamIyUmxZeUF0SUVOdmNIbHNaV1owSURJd01ETXRNakF4TkNBdElHaDBkSEE2THk5M2QzY3VkbWxrWlc5c1lXNHViM0puTDNneU5qUXVhSFJ0YkNBdElHOXdkR2x2Ym5NNklHTmhZbUZqUFRFZ2NtVm1QVEVnWkdWaWJHOWphejB4T2pBNk1DQmhibUZzZVhObFBUQjRNVG93ZURFeE1TQnRaVDFvWlhnZ2MzVmliV1U5TWlCd2MzazlNU0J3YzNsZmNtUTlNUzR3TURvd0xqQXdJRzFwZUdWa1gzSmxaajB3SUcxbFgzSmhibWRsUFRFMklHTm9jbTl0WVY5dFpUMHhJSFJ5Wld4c2FYTTlNQ0E0ZURoa1kzUTlNQ0JqY1cwOU1DQmtaV0ZrZW05dVpUMHlNU3d4TVNCbVlYTjBYM0J6YTJsd1BURWdZMmh5YjIxaFgzRndYMjltWm5ObGREMHdJSFJvY21WaFpITTlOaUJzYjI5cllXaGxZV1JmZEdoeVpXRmtjejB4SUhOc2FXTmxaRjkwYUhKbFlXUnpQVEFnYm5JOU1DQmtaV05wYldGMFpUMHhJR2x1ZEdWeWJHRmpaV1E5TUNCaWJIVnlZWGxmWTI5dGNHRjBQVEFnWTI5dWMzUnlZV2x1WldSZmFXNTBjbUU5TUNCaVpuSmhiV1Z6UFRNZ1lsOXdlWEpoYldsa1BUSWdZbDloWkdGd2REMHhJR0pmWW1saGN6MHdJR1JwY21WamREMHhJSGRsYVdkb2RHSTlNU0J2Y0dWdVgyZHZjRDB3SUhkbGFXZG9kSEE5TVNCclpYbHBiblE5TXpBd0lHdGxlV2x1ZEY5dGFXNDlNekFnYzJObGJtVmpkWFE5TkRBZ2FXNTBjbUZmY21WbWNtVnphRDB3SUhKalgyeHZiMnRoYUdWaFpEMHhNQ0J5WXoxamNtWWdiV0owY21WbFBURWdZM0ptUFRJd0xqQWdjV052YlhBOU1DNDJNQ0J4Y0cxcGJqMHdJSEZ3YldGNFBUWTVJSEZ3YzNSbGNEMDBJSFppZGw5dFlYaHlZWFJsUFRJd01EQXdJSFppZGw5aWRXWnphWHBsUFRJMU1EQXdJR055Wmw5dFlYZzlNQzR3SUc1aGJGOW9jbVE5Ym05dVpTQm1hV3hzWlhJOU1DQnBjRjl5WVhScGJ6MHhMalF3SUdGeFBURTZNUzR3TUFDQUFBQUFPV1dJaEFBMy8vcCtDN3Y4dEREU1RqZjk3dzU1aTNTYlJQTzRaWStoa2pENWhia0FrTDN6cEo2aC9MUjFDQUFCemdCMWtxcXpVb3JsaFFBQUFBeEJtaVFZaG4vK3FaWUFETGdBQUFBSlFaNUNRaFgvQUFqNUlRQURRR2djSVFBRFFHZ2NBQUFBQ1FHZVlVUW4vd0FMS0NFQUEwQm9IQUFBQUFrQm5tTkVKLzhBQ3lraEFBTkFhQndoQUFOQWFCd0FBQUFOUVpwb05FeERQLzZwbGdBTXVTRUFBMEJvSEFBQUFBdEJub1pGRVN3ci93QUkrU0VBQTBCb0hDRUFBMEJvSEFBQUFBa0JucVZFSi84QUN5a2hBQU5BYUJ3QUFBQUpBWjZuUkNmL0FBc29JUUFEUUdnY0lRQURRR2djQUFBQURVR2FyRFJNUXovK3FaWUFETGdoQUFOQWFCd0FBQUFMUVo3S1JSVXNLLzhBQ1BraEFBTkFhQndBQUFBSkFaN3BSQ2YvQUFzb0lRQURRR2djSVFBRFFHZ2NBQUFBQ1FHZTYwUW4vd0FMS0NFQUEwQm9IQUFBQUExQm12QTBURU0vL3FtV0FBeTVJUUFEUUdnY0lRQURRR2djQUFBQUMwR2ZEa1VWTEN2L0FBajVJUUFEUUdnY0FBQUFDUUdmTFVRbi93QUxLU0VBQTBCb0hDRUFBMEJvSEFBQUFBa0JueTlFSi84QUN5Z2hBQU5BYUJ3QUFBQU5RWnMwTkV4RFAvNnBsZ0FNdUNFQUEwQm9IQUFBQUF0Qm4xSkZGU3dyL3dBSStTRUFBMEJvSENFQUEwQm9IQUFBQUFrQm4zRkVKLzhBQ3lnaEFBTkFhQndBQUFBSkFaOXpSQ2YvQUFzb0lRQURRR2djSVFBRFFHZ2NBQUFBRFVHYmVEUk1Rei8rcVpZQURMa2hBQU5BYUJ3QUFBQUxRWitXUlJVc0svOEFDUGdoQUFOQWFCd2hBQU5BYUJ3QUFBQUpBWisxUkNmL0FBc3BJUUFEUUdnY0FBQUFDUUdmdDBRbi93QUxLU0VBQTBCb0hDRUFBMEJvSEFBQUFBMUJtN3cwVEVNLy9xbVdBQXk0SVFBRFFHZ2NBQUFBQzBHZjJrVVZMQ3YvQUFqNUlRQURRR2djQUFBQUNRR2YrVVFuL3dBTEtDRUFBMEJvSENFQUEwQm9IQUFBQUFrQm4vdEVKLzhBQ3lraEFBTkFhQndBQUFBTlFadmdORXhEUC82cGxnQU11U0VBQTBCb0hDRUFBMEJvSEFBQUFBdEJuaDVGRlN3ci93QUkrQ0VBQTBCb0hBQUFBQWtCbmoxRUovOEFDeWdoQUFOQWFCd2hBQU5BYUJ3QUFBQUpBWjQvUkNmL0FBc3BJUUFEUUdnY0FBQUFEVUdhSkRSTVF6LytxWllBRExnaEFBTkFhQndBQUFBTFFaNUNSUlVzSy84QUNQa2hBQU5BYUJ3aEFBTkFhQndBQUFBSkFaNWhSQ2YvQUFzb0lRQURRR2djQUFBQUNRR2VZMFFuL3dBTEtTRUFBMEJvSENFQUEwQm9IQUFBQUExQm1tZzBURU0vL3FtV0FBeTVJUUFEUUdnY0FBQUFDMEdlaGtVVkxDdi9BQWo1SVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdlcFVRbi93QUxLU0VBQTBCb0hBQUFBQWtCbnFkRUovOEFDeWdoQUFOQWFCd0FBQUFOUVpxc05FeERQLzZwbGdBTXVDRUFBMEJvSENFQUEwQm9IQUFBQUF0Qm5zcEZGU3dyL3dBSStTRUFBMEJvSEFBQUFBa0JudWxFSi84QUN5Z2hBQU5BYUJ3aEFBTkFhQndBQUFBSkFaN3JSQ2YvQUFzb0lRQURRR2djQUFBQURVR2E4RFJNUXovK3FaWUFETGtoQUFOQWFCd2hBQU5BYUJ3QUFBQUxRWjhPUlJVc0svOEFDUGtoQUFOQWFCd0FBQUFKQVo4dFJDZi9BQXNwSVFBRFFHZ2NJUUFEUUdnY0FBQUFDUUdmTDBRbi93QUxLQ0VBQTBCb0hBQUFBQTFCbXpRMFRFTS8vcW1XQUF5NElRQURRR2djQUFBQUMwR2ZVa1VWTEN2L0FBajVJUUFEUUdnY0lRQURRR2djQUFBQUNRR2ZjVVFuL3dBTEtDRUFBMEJvSEFBQUFBa0JuM05FSi84QUN5Z2hBQU5BYUJ3aEFBTkFhQndBQUFBTlFadDRORXhDLy82cGxnQU11U0VBQTBCb0hBQUFBQXRCbjVaRkZTd3Ivd0FJK0NFQUEwQm9IQ0VBQTBCb0hBQUFBQWtCbjdWRUovOEFDeWtoQUFOQWFCd0FBQUFKQVorM1JDZi9BQXNwSVFBRFFHZ2NBQUFBRFVHYnV6Uk1Rbi8rbmhBQVlzQWhBQU5BYUJ3aEFBTkFhQndBQUFBSlFaL2FRaFAvQUFzcElRQURRR2djQUFBQUNRR2YrVVFuL3dBTEtDRUFBMEJvSENFQUEwQm9IQ0VBQTBCb0hDRUFBMEJvSENFQUEwQm9IQ0VBQTBCb0hBQUFDaUZ0YjI5MkFBQUFiRzEyYUdRQUFBQUExWUNDWDlXQWdsOEFBQVBvQUFBSC9BQUJBQUFCQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBREFBQUFHR2x2WkhNQUFBQUFFSUNBZ0FjQVQvLy8vdjcvQUFBRitYUnlZV3NBQUFCY2RHdG9aQUFBQUFQVmdJSmYxWUNDWHdBQUFBRUFBQUFBQUFBSDBBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBRUFBQUFBQXlnQUFBTW9BQUFBQUFDUmxaSFJ6QUFBQUhHVnNjM1FBQUFBQUFBQUFBUUFBQjlBQUFCZHdBQUVBQUFBQUJYRnRaR2xoQUFBQUlHMWthR1FBQUFBQTFZQ0NYOVdBZ2w4QUFWK1FBQUsvSUZYRUFBQUFBQUF0YUdSc2NnQUFBQUFBQUFBQWRtbGtaUUFBQUFBQUFBQUFBQUFBQUZacFpHVnZTR0Z1Wkd4bGNnQUFBQVVjYldsdVpnQUFBQlIyYldoa0FBQUFBUUFBQUFBQUFBQUFBQUFBSkdScGJtWUFBQUFjWkhKbFpnQUFBQUFBQUFBQkFBQUFESFZ5YkNBQUFBQUJBQUFFM0hOMFltd0FBQUNZYzNSelpBQUFBQUFBQUFBQkFBQUFpR0YyWXpFQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBeWdES0FFZ0FBQUJJQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVkvLzhBQUFBeVlYWmpRd0ZOUUNqLzRRQWJaMDFBS095aG8zeVNUVUJBUUZBQUFBTUFFQUFyOGdEeGd4bGdBUUFFYU8rRzhnQUFBQmh6ZEhSekFBQUFBQUFBQUFFQUFBQThBQUFMdUFBQUFCUnpkSE56QUFBQUFBQUFBQUVBQUFBQkFBQUI4R04wZEhNQUFBQUFBQUFBUEFBQUFBRUFBQmR3QUFBQUFRQUFPcGdBQUFBQkFBQVhjQUFBQUFFQUFBQUFBQUFBQVFBQUM3Z0FBQUFCQUFBNm1BQUFBQUVBQUJkd0FBQUFBUUFBQUFBQUFBQUJBQUFMdUFBQUFBRUFBRHFZQUFBQUFRQUFGM0FBQUFBQkFBQUFBQUFBQUFFQUFBdTRBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFEcVlBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQUVBQUF1NEFBQUFBUUFBT3BnQUFBQUJBQUFYY0FBQUFBRUFBQUFBQUFBQUFRQUFDN2dBQUFBQkFBQTZtQUFBQUFFQUFCZHdBQUFBQVFBQUFBQUFBQUFCQUFBTHVBQUFBQUVBQURxWUFBQUFBUUFBRjNBQUFBQUJBQUFBQUFBQUFBRUFBQXU0QUFBQUFRQUFPcGdBQUFBQkFBQVhjQUFBQUFFQUFBQUFBQUFBQVFBQUM3Z0FBQUFCQUFBNm1BQUFBQUVBQUJkd0FBQUFBUUFBQUFBQUFBQUJBQUFMdUFBQUFBRUFBRHFZQUFBQUFRQUFGM0FBQUFBQkFBQUFBQUFBQUFFQUFBdTRBQUFBQVFBQU9wZ0FBQUFCQUFBWGNBQUFBQUVBQUFBQUFBQUFBUUFBQzdnQUFBQUJBQUE2bUFBQUFBRUFBQmR3QUFBQUFRQUFBQUFBQUFBQkFBQUx1QUFBQUFFQUFDN2dBQUFBQVFBQUYzQUFBQUFCQUFBQUFBQUFBQnh6ZEhOakFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFBRUFBQUVFYzNSemVnQUFBQUFBQUFBQUFBQUFQQUFBQXpRQUFBQVFBQUFBRFFBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQVBBQUFBRFFBQUFBMEFBQUFSQUFBQUR3QUFBQTBBQUFBTkFBQUFFUUFBQUE4QUFBQU5BQUFBRFFBQUFCRUFBQUFQQUFBQURRQUFBQTBBQUFBUkFBQUFEd0FBQUEwQUFBQU5BQUFBRVFBQUFBOEFBQUFOQUFBQURRQUFBQkVBQUFBUEFBQUFEUUFBQUEwQUFBQVJBQUFBRHdBQUFBMEFBQUFOQUFBQUVRQUFBQThBQUFBTkFBQUFEUUFBQUJFQUFBQVBBQUFBRFFBQUFBMEFBQUFSQUFBQUR3QUFBQTBBQUFBTkFBQUFFUUFBQUE4QUFBQU5BQUFBRFFBQUFCRUFBQUFOQUFBQURRQUFBUUJ6ZEdOdkFBQUFBQUFBQUR3QUFBQXdBQUFEWkFBQUEzUUFBQU9OQUFBRG9BQUFBN2tBQUFQUUFBQUQ2d0FBQS80QUFBUVhBQUFFTGdBQUJFTUFBQVJjQUFBRWJ3QUFCSXdBQUFTaEFBQUV1Z0FBQk0wQUFBVGtBQUFFL3dBQUJSSUFBQVVyQUFBRlFnQUFCVjBBQUFWd0FBQUZpUUFBQmFBQUFBVzFBQUFGemdBQUJlRUFBQVgrQUFBR0V3QUFCaXdBQUFZL0FBQUdWZ0FBQm5FQUFBYUVBQUFHblFBQUJyUUFBQWJQQUFBRzRnQUFCdlVBQUFjU0FBQUhKd0FBQjBBQUFBZFRBQUFIY0FBQUI0VUFBQWVlQUFBSHNRQUFCOGdBQUFmakFBQUg5Z0FBQ0E4QUFBZ21BQUFJUVFBQUNGUUFBQWhuQUFBSWhBQUFDSmNBQUFNc2RISmhhd0FBQUZ4MGEyaGtBQUFBQTlXQWdsL1ZnSUpmQUFBQUFnQUFBQUFBQUFmOEFBQUFBQUFBQUFBQUFBQUJBUUFBQUFBQkFBQUFBQUFBQUFBQUFBQUFBQUFBQVFBQUFBQUFBQUFBQUFBQUFBQUFRQUFBQUFBQUFBQUFBQUFBQUFBQ3NtMWthV0VBQUFBZ2JXUm9aQUFBQUFEVmdJSmYxWUNDWHdBQXJFUUFBV0FBVmNRQUFBQUFBQ2RvWkd4eUFBQUFBQUFBQUFCemIzVnVBQUFBQUFBQUFBQUFBQUFBVTNSbGNtVnZBQUFBQW1OdGFXNW1BQUFBRUhOdGFHUUFBQUFBQUFBQUFBQUFBQ1JrYVc1bUFBQUFIR1J5WldZQUFBQUFBQUFBQVFBQUFBeDFjbXdnQUFBQUFRQUFBaWR6ZEdKc0FBQUFaM04wYzJRQUFBQUFBQUFBQVFBQUFGZHRjRFJoQUFBQUFBQUFBQUVBQUFBQUFBQUFBQUFDQUJBQUFBQUFyRVFBQUFBQUFETmxjMlJ6QUFBQUFBT0FnSUFpQUFJQUJJQ0FnQlJBRlFBQUFBQUREVUFBQUFBQUJZQ0FnQUlTRUFhQWdJQUJBZ0FBQUJoemRIUnpBQUFBQUFBQUFBRUFBQUJZQUFBRUFBQUFBQnh6ZEhOakFBQUFBQUFBQUFFQUFBQUJBQUFBQVFBQUFBRUFBQUFVYzNSemVnQUFBQUFBQUFBR0FBQUFXQUFBQVhCemRHTnZBQUFBQUFBQUFGZ0FBQU9CQUFBRGh3QUFBNW9BQUFPdEFBQURzd0FBQThvQUFBUGZBQUFENVFBQUEvZ0FBQVFMQUFBRUVRQUFCQ2dBQUFROUFBQUVVQUFBQkZZQUFBUnBBQUFFZ0FBQUJJWUFBQVNiQUFBRXJnQUFCTFFBQUFUSEFBQUUzZ0FBQlBNQUFBVDVBQUFGREFBQUJSOEFBQVVsQUFBRlBBQUFCVkVBQUFWWEFBQUZhZ0FBQlgwQUFBV0RBQUFGbWdBQUJhOEFBQVhDQUFBRnlBQUFCZHNBQUFYeUFBQUYrQUFBQmcwQUFBWWdBQUFHSmdBQUJqa0FBQVpRQUFBR1pRQUFCbXNBQUFaK0FBQUdrUUFBQnBjQUFBYXVBQUFHd3dBQUJza0FBQWJjQUFBRzd3QUFCd1lBQUFjTUFBQUhJUUFBQnpRQUFBYzZBQUFIVFFBQUIyUUFBQWRxQUFBSGZ3QUFCNUlBQUFlWUFBQUhxd0FBQjhJQUFBZlhBQUFIM1FBQUIvQUFBQWdEQUFBSUNRQUFDQ0FBQUFnMUFBQUlPd0FBQ0U0QUFBaGhBQUFJZUFBQUNINEFBQWlSQUFBSXBBQUFDS29BQUFpd0FBQUl0Z0FBQ0x3QUFBakNBQUFBRm5Wa2RHRUFBQUFPYm1GdFpWTjBaWEpsYndBQUFIQjFaSFJoQUFBQWFHMWxkR0VBQUFBQUFBQUFJV2hrYkhJQUFBQUFBQUFBQUcxa2FYSmhjSEJzQUFBQUFBQUFBQUFBQUFBQU8ybHNjM1FBQUFBenFYUnZid0FBQUN0a1lYUmhBQUFBQVFBQUFBQklZVzVrUW5KaGEyVWdNQzR4TUM0eUlESXdNVFV3TmpFeE1EQT0nXG4iXX0=
