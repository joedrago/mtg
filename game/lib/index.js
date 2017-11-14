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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvQ291bnRlclZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvTGF5b3V0Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9NZW51Vmlldy5jb2ZmZWUiLCJnYW1lL3NyYy9tYWluLmNvZmZlZSIsImdhbWUvc3JjL3ZlcnNpb24uY29mZmVlIiwibm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0JBQVI7O0FBRW5CLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7QUFDWCxXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVI7O0FBQ2QsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztBQUNiLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUjs7QUFFSjtFQUNTLGFBQUMsTUFBRDtJQUFDLElBQUMsQ0FBQSxTQUFEO0lBQ1osSUFBQyxDQUFBLEdBQUQsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsSUFBbkI7SUFDUCxJQUFDLENBQUEsUUFBRCxDQUFVLFNBQVY7SUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGFBQVY7SUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTO0lBRVQsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQTVCO0lBQ3JCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxTQUFkLEVBQTRCLElBQUMsQ0FBQSxpQkFBRixHQUFvQix1QkFBL0M7SUFFZixJQUFDLENBQUEsb0JBQUQsR0FBd0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsSUFBNUI7SUFDeEIsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFkLEVBQStCLElBQUMsQ0FBQSxvQkFBRixHQUF1Qix1QkFBckQ7SUFFbEIsSUFBQyxDQUFBLEtBQUQsR0FDRTtNQUFBLElBQUEsRUFBTSxJQUFJLFFBQUosQ0FBYSxJQUFiLEVBQW1CLElBQUMsQ0FBQSxNQUFwQixDQUFOO01BQ0EsT0FBQSxFQUFTLElBQUksV0FBSixDQUFnQixJQUFoQixFQUFzQixJQUFDLENBQUEsTUFBdkIsQ0FEVDs7SUFFRixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsR0FBZ0IsSUFBSSxVQUFKLENBQWUsSUFBZixFQUFxQixJQUFDLENBQUEsTUFBdEIsRUFBOEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFyQztJQUNoQixJQUFDLENBQUEsVUFBRCxDQUFZLFFBQVo7RUFoQlc7O2dCQWtCYixZQUFBLEdBQWMsU0FBQTtBQUNaLFFBQUE7QUFBQTtBQUFBLFNBQUEsZUFBQTs7TUFDRSxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsR0FBWSxDQUFDLENBQUM7TUFDZCxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsR0FBaUI7TUFDakIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLEdBQWlCO01BQ2pCLENBQUMsQ0FBQyxNQUFGLEdBQVcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsQ0FBaUIsR0FBakIsQ0FBcUIsQ0FBQyxLQUF0QixHQUE4QixHQUF6QztNQUNYLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBQSxHQUFRLFFBQVIsR0FBaUIsZUFBakIsR0FBZ0MsQ0FBQyxDQUFDLE1BQWxDLEdBQXlDLFNBQXJEO0FBTEY7RUFEWTs7Z0JBU2QsWUFBQSxHQUFjLFNBQUMsSUFBRCxFQUFPLEtBQVA7QUFDWixRQUFBO0lBQUEsSUFBQSxHQUNFO01BQUEsSUFBQSxFQUFNLElBQU47TUFDQSxLQUFBLEVBQU8sS0FEUDtNQUVBLE1BQUEsRUFBUSxDQUZSOztJQUdGLElBQUMsQ0FBQSxLQUFNLENBQUEsSUFBQSxDQUFQLEdBQWU7SUFDZixJQUFDLENBQUEsWUFBRCxDQUFBO0FBQ0EsV0FBTztFQVBLOztnQkFTZCxRQUFBLEdBQVUsU0FBQyxRQUFEO0FBQ1IsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFJLGdCQUFKLENBQXFCLFFBQXJCO1dBQ1AsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFXLENBQUMsSUFBWixDQUFpQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDZixPQUFPLENBQUMsR0FBUixDQUFlLFFBQUQsR0FBVSx1QkFBeEI7UUFDQSxLQUFDLENBQUEsWUFBRCxDQUFBO2VBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBQTtNQUhlO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtFQUZROztnQkFPVixVQUFBLEdBQVksU0FBQyxJQUFEO0lBQ1YsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsS0FBTSxDQUFBLElBQUE7V0FDZixJQUFDLENBQUEsSUFBRCxDQUFBO0VBRlU7O2dCQUlaLE9BQUEsR0FBUyxTQUFDLFVBQUQsR0FBQTs7Z0JBV1QsY0FBQSxHQUFnQixTQUFBO0lBQ2QsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBZixDQUFBO1dBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxTQUFaO0VBRmM7O2lCQUloQixRQUFBLEdBQVEsU0FBQyxZQUFELEdBQUE7O2lCQUdSLFFBQUEsR0FBUSxTQUFBLEdBQUE7O2dCQUdSLElBQUEsR0FBTSxTQUFBO1dBQ0osSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQUE7RUFESTs7Z0JBR04sU0FBQSxHQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUo7V0FDVCxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkI7RUFEUzs7Z0JBR1gsU0FBQSxHQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxPQUFQO1dBQ1QsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLE9BQXRCO0VBRFM7O2dCQUdYLE9BQUEsR0FBUyxTQUFDLENBQUQsRUFBSSxDQUFKO1dBQ1AsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQWMsQ0FBZCxFQUFpQixDQUFqQjtFQURPOztnQkFHVCxRQUFBLEdBQVUsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsS0FBYjtJQUNSLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFBO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLENBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkI7SUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsR0FBaUI7V0FDakIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLENBQUE7RUFKUTs7Z0JBTVYsZUFBQSxHQUFpQixTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLFNBQWhCLEVBQWtDLFdBQWxDOztNQUFnQixZQUFZOzs7TUFBTSxjQUFjOztJQUMvRCxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLENBQTNCO0lBQ0EsSUFBRyxTQUFBLEtBQWEsSUFBaEI7TUFDRSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsR0FBaUI7TUFDakIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLENBQUEsRUFGRjs7SUFHQSxJQUFHLFdBQUEsS0FBZSxJQUFsQjtNQUNFLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxHQUFtQjtNQUNuQixJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsQ0FBQSxFQUZGOztFQUxlOztnQkFVakIsUUFBQSxHQUFVLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLEtBQWIsRUFBb0IsU0FBcEI7O01BQW9CLFlBQVk7O0lBQ3hDLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFBO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUFMLEdBQW1CO0lBQ25CLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxHQUFpQjtJQUNqQixJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQjtXQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBTCxDQUFBO0VBTFE7O2dCQU9WLFFBQUEsR0FBVSxTQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsS0FBakIsRUFBa0MsU0FBbEM7O01BQWlCLFFBQVE7OztNQUFTLFlBQVk7O0lBQ3RELElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFBO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUFMLEdBQW1CO0lBQ25CLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxHQUFpQjtJQUNqQixJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsQ0FBWSxFQUFaLEVBQWdCLEVBQWhCO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLENBQVksRUFBWixFQUFnQixFQUFoQjtXQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBTCxDQUFBO0VBTlE7O2dCQVFWLE9BQUEsR0FBUyxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLFVBQVYsRUFBc0IsUUFBdEIsRUFBZ0MsS0FBaEM7SUFDUCxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBQTtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxHQUFpQjtJQUNqQixJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsQ0FBWSxDQUFaLEVBQWUsQ0FBZjtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQixVQUFsQixFQUE4QixRQUE5QjtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFBO1dBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLENBQUE7RUFOTzs7Z0JBUVQsWUFBQSxHQUFjLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsS0FBVixFQUFpQixTQUFqQjtJQUNaLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFBO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUFMLEdBQW1CO0lBQ25CLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxHQUFpQjtJQUNqQixJQUFDLENBQUEsR0FBRyxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsSUFBSSxDQUFDLEVBQUwsR0FBVSxDQUEvQjtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFBO1dBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLENBQUE7RUFOWTs7Z0JBUWQsZ0JBQUEsR0FBa0IsU0FBQyxJQUFELEVBQU8sRUFBUCxFQUFXLEVBQVgsRUFBZSxJQUFmLEVBQXFCLEtBQXJCLEVBQTRCLEdBQTVCO0lBQ2hCLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFBO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQWUsRUFBZixFQUFtQixFQUFuQjtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBTCxDQUFZLEdBQVo7SUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsR0FBWSxJQUFJLENBQUM7SUFDakIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLEdBQWlCO0lBRWpCLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxHQUFpQjtJQUNqQixJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLENBQXBCLEVBQXdCLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBdEM7V0FFQSxJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBQTtFQVZnQjs7Z0JBWWxCLGtCQUFBLEdBQW9CLFNBQUMsSUFBRCxFQUFPLEVBQVAsRUFBVyxFQUFYLEVBQWUsSUFBZixFQUFxQixLQUFyQixFQUE0QixTQUE1QixFQUF1QyxHQUF2QztJQUNsQixJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBQTtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFlLEVBQWYsRUFBbUIsRUFBbkI7SUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsQ0FBWSxHQUFaO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLEdBQVksSUFBSSxDQUFDO0lBQ2pCLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxHQUFpQjtJQUNqQixJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsR0FBbUI7SUFDbkIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLEdBQWlCO0lBQ2pCLElBQUMsQ0FBQSxHQUFHLENBQUMsVUFBTCxDQUFnQixJQUFoQixFQUFzQixDQUF0QixFQUEwQixJQUFJLENBQUMsTUFBTCxHQUFjLENBQXhDO1dBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQUE7RUFUa0I7O2dCQVdwQixhQUFBLEdBQWUsU0FBQyxJQUFELEVBQU8sS0FBUDs7TUFBTyxRQUFROztJQUM1QixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtJQUNQLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxHQUFZLElBQUMsQ0FBQSxXQUFXLENBQUM7SUFDekIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLEdBQWlCO0lBQ2pCLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxHQUFpQjtXQUNqQixJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLENBQXBCLEVBQXVCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixDQUFDLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixHQUFzQixDQUF2QixDQUF4QztFQUxhOztnQkFPZixXQUFBLEdBQWEsU0FBQyxLQUFEOztNQUFDLFFBQVE7O0lBQ3BCLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLEdBQVksSUFBQyxDQUFBLFdBQVcsQ0FBQztJQUN6QixJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsR0FBaUI7SUFDakIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLEdBQWlCO1dBQ2pCLElBQUMsQ0FBQSxHQUFHLENBQUMsUUFBTCxDQUFjLEdBQUEsR0FBSSxPQUFsQixFQUE2QixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsQ0FBQyxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsR0FBc0IsQ0FBdkIsQ0FBN0MsRUFBd0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLENBQUMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLEdBQXNCLENBQXZCLENBQXpGO0VBTFc7Ozs7OztBQU9mLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxTQUFuQyxHQUErQyxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiO0VBQzdDLElBQUksQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUFaO0lBQW9CLENBQUEsR0FBSSxDQUFBLEdBQUksRUFBNUI7O0VBQ0EsSUFBSSxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQVo7SUFBb0IsQ0FBQSxHQUFJLENBQUEsR0FBSSxFQUE1Qjs7RUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO0VBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxDQUFBLEdBQUUsQ0FBVixFQUFhLENBQWI7RUFDQSxJQUFDLENBQUEsS0FBRCxDQUFPLENBQUEsR0FBRSxDQUFULEVBQVksQ0FBWixFQUFpQixDQUFBLEdBQUUsQ0FBbkIsRUFBc0IsQ0FBQSxHQUFFLENBQXhCLEVBQTJCLENBQTNCO0VBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFBLEdBQUUsQ0FBVCxFQUFZLENBQUEsR0FBRSxDQUFkLEVBQWlCLENBQWpCLEVBQXNCLENBQUEsR0FBRSxDQUF4QixFQUEyQixDQUEzQjtFQUNBLElBQUMsQ0FBQSxLQUFELENBQU8sQ0FBUCxFQUFZLENBQUEsR0FBRSxDQUFkLEVBQWlCLENBQWpCLEVBQXNCLENBQXRCLEVBQTJCLENBQTNCO0VBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFQLEVBQVksQ0FBWixFQUFpQixDQUFBLEdBQUUsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBMkIsQ0FBM0I7RUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO0FBQ0EsU0FBTztBQVZzQzs7QUFZL0MsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUN4TGpCLElBQUE7O0FBQUEsS0FBQSxHQUNFO0VBQUEsVUFBQSxFQUFZLFNBQVo7RUFDQSxJQUFBLEVBQU0sU0FETjtFQUVBLGFBQUEsRUFBZSxTQUZmO0VBR0EsTUFBQSxFQUFRLE9BSFI7RUFJQSxjQUFBLEVBQWdCLEtBSmhCO0VBS0EsT0FBQSxFQUFTLFNBTFQ7RUFNQSxZQUFBLEVBQWMsU0FOZDtFQU9BLElBQUEsRUFBTSxTQVBOOzs7QUFTRixZQUFBLEdBQWUsQ0FDYixTQURhLEVBRWIsU0FGYSxFQUdiLFNBSGEsRUFJYixTQUphLEVBS2IsU0FMYSxFQU1iLFNBTmE7O0FBU2YsTUFBQSxHQUFTLElBQUksQ0FBQyxFQUFMLEdBQVU7O0FBRW5CLEtBQUEsR0FBUSxTQUFDLEdBQUQ7QUFFTixTQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLFNBQUwsQ0FBZSxHQUFmLENBQVg7QUFGRDs7QUFJRjtFQUlTLHFCQUFDLEdBQUQsRUFBTyxNQUFQO0FBQ1gsUUFBQTtJQURZLElBQUMsQ0FBQSxNQUFEO0lBQU0sSUFBQyxDQUFBLFNBQUQ7SUFDbEIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxjQUFBLEdBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUF2QixHQUE2QixHQUE3QixHQUFnQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQXBEO0lBRUEsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUNULElBQUMsQ0FBQSxZQUFELEdBQWdCO0lBR2hCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixJQUEzQjtJQUNwQixtQkFBQSxHQUFzQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixJQUEzQjtJQUN0QixjQUFBLEdBQWlCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCLElBQTNCO0lBQ2pCLElBQUMsQ0FBQSxLQUFELEdBQ0U7TUFBQSxNQUFBLEVBQVcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxZQUFMLENBQWtCLFFBQWxCLEVBQWtDLElBQUMsQ0FBQSxnQkFBRixHQUFtQiwyQkFBcEQsQ0FBWDtNQUNBLFNBQUEsRUFBVyxJQUFDLENBQUEsR0FBRyxDQUFDLFlBQUwsQ0FBa0IsV0FBbEIsRUFBa0MsbUJBQUQsR0FBcUIsMkJBQXRELENBRFg7TUFFQSxJQUFBLEVBQVcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxZQUFMLENBQWtCLFdBQWxCLEVBQWtDLGNBQUQsR0FBZ0IsMkJBQWpELENBRlg7O0lBSUYsSUFBQyxDQUFBLE1BQUQsR0FDRTtNQUFBLENBQUEsRUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsQ0FBbkI7TUFDQSxDQUFBLEVBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLENBRHBCOztJQUdGLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFDZCxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBekI7SUFDbEIsSUFBQyxDQUFBLFVBQUQsR0FBYyxNQUFBLEdBQVMsSUFBQyxDQUFBO0lBQ3hCLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFFaEMsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLENBQVIsR0FBWTtJQUMxQixJQUFDLENBQUEsbUJBQUQsR0FBdUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFSLEdBQVk7SUFDbkMsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLENBQVIsR0FBWTtJQUUxQixJQUFDLENBQUEsT0FBRCxHQUFXO0lBRVgsUUFBQSxHQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBUixHQUFZO0lBQ3ZCLFFBQUEsR0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLENBQVIsR0FBWTtJQUN2QixRQUFBLEdBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFSLEdBQVk7SUFFdkIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWM7TUFDWixJQUFBLEVBQU0sTUFETTtNQUVaLE9BQUEsRUFBUyxDQUNQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsQ0FBL0IsRUFBa0MsUUFBbEMsRUFBNEMsRUFBNUMsQ0FETyxDQUZHO0tBQWQ7SUFPQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYztNQUNaLElBQUEsRUFBTSxJQURNO01BRVosT0FBQSxFQUFTLENBQ1AsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFhLENBQUEsQ0FBQSxDQUEzQixFQUErQixDQUEvQixFQUFrQyxRQUFsQyxFQUE0QyxFQUE1QyxDQURPLEVBRVAsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFhLENBQUEsQ0FBQSxDQUEzQixFQUErQixFQUEvQixFQUFtQyxRQUFuQyxFQUE2QyxFQUE3QyxDQUZPLENBRkc7S0FBZDtJQVFBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjO01BQ1osSUFBQSxFQUFNLElBRE07TUFFWixPQUFBLEVBQVMsQ0FDUCxJQUFDLENBQUEsWUFBRCxDQUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLEVBQStCLENBQS9CLEVBQWtDLFFBQWxDLEVBQTRDLEVBQTVDLENBRE8sRUFFUCxJQUFDLENBQUEsWUFBRCxDQUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLEVBQStCLENBQS9CLEVBQWtDLFFBQWxDLEVBQTRDLEVBQTVDLENBRk8sRUFHUCxJQUFDLENBQUEsWUFBRCxDQUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLEVBQStCLEVBQS9CLEVBQW1DLFFBQW5DLEVBQTZDLEVBQTdDLENBSE8sQ0FGRztLQUFkO0lBU0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWM7TUFDWixJQUFBLEVBQU0sSUFETTtNQUVaLE9BQUEsRUFBUyxDQUNQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsQ0FBL0IsRUFBa0MsUUFBbEMsRUFBNEMsRUFBNUMsQ0FETyxFQUVQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsQ0FBL0IsRUFBa0MsUUFBbEMsRUFBNEMsRUFBNUMsQ0FGTyxFQUdQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsRUFBL0IsRUFBbUMsUUFBbkMsRUFBNkMsRUFBN0MsQ0FITyxFQUlQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsRUFBL0IsRUFBbUMsUUFBbkMsRUFBNkMsRUFBN0MsQ0FKTyxDQUZHO0tBQWQ7SUFVQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYztNQUNaLElBQUEsRUFBTSxlQURNO01BRVosT0FBQSxFQUFTLENBQ1AsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFhLENBQUEsQ0FBQSxDQUEzQixFQUErQixDQUEvQixFQUFrQyxRQUFsQyxFQUE0QyxFQUE1QyxFQUFnRCxJQUFJLENBQUMsRUFBTCxHQUFVLENBQTFELENBRE8sRUFFUCxJQUFDLENBQUEsWUFBRCxDQUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLEVBQStCLENBQS9CLEVBQWtDLFFBQWxDLEVBQTRDLEVBQTVDLEVBQWdELElBQUksQ0FBQyxFQUFMLEdBQVUsQ0FBMUQsQ0FGTyxFQUdQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsRUFBL0IsRUFBbUMsUUFBbkMsRUFBNkMsRUFBN0MsRUFBaUQsSUFBSSxDQUFDLEVBQUwsR0FBVSxDQUEzRCxDQUhPLEVBSVAsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFhLENBQUEsQ0FBQSxDQUEzQixFQUErQixFQUEvQixFQUFtQyxRQUFuQyxFQUE2QyxFQUE3QyxFQUFpRCxJQUFJLENBQUMsRUFBTCxHQUFVLENBQTNELENBSk8sQ0FGRztLQUFkO0lBVUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWM7TUFDWixJQUFBLEVBQU0sS0FETTtNQUVaLE9BQUEsRUFBUyxDQUNQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBZ0MsQ0FBaEMsRUFBbUMsUUFBbkMsRUFBNkMsRUFBN0MsRUFBaUQsQ0FBQyxJQUFJLENBQUMsRUFBTixHQUFXLENBQTVELENBRE8sRUFFUCxJQUFDLENBQUEsWUFBRCxDQUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLEVBQWdDLENBQWhDLEVBQW1DLFFBQW5DLEVBQTZDLEVBQTdDLEVBQWtELElBQUksQ0FBQyxFQUFMLEdBQVUsQ0FBNUQsQ0FGTyxFQUdQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsRUFBL0IsRUFBbUMsUUFBbkMsRUFBNkMsRUFBN0MsRUFBa0QsSUFBSSxDQUFDLEVBQUwsR0FBVSxDQUE1RCxDQUhPLEVBSVAsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFhLENBQUEsQ0FBQSxDQUEzQixFQUErQixFQUEvQixFQUFtQyxRQUFuQyxFQUE2QyxFQUE3QyxFQUFpRCxDQUFDLElBQUksQ0FBQyxFQUFOLEdBQVcsQ0FBNUQsQ0FKTyxDQUZHO0tBQWQ7SUFVQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYztNQUNaLElBQUEsRUFBTSxVQURNO01BRVosT0FBQSxFQUFTLENBQ1AsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFhLENBQUEsQ0FBQSxDQUEzQixFQUErQixDQUEvQixFQUFrQyxRQUFsQyxFQUE0QyxFQUE1QyxDQURPLEVBRVAsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFhLENBQUEsQ0FBQSxDQUEzQixFQUErQixDQUEvQixFQUFrQyxRQUFsQyxFQUE0QyxFQUE1QyxDQUZPLEVBR1AsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFhLENBQUEsQ0FBQSxDQUEzQixFQUErQixDQUEvQixFQUFrQyxRQUFsQyxFQUE0QyxFQUE1QyxDQUhPLEVBSVAsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFhLENBQUEsQ0FBQSxDQUEzQixFQUErQixFQUEvQixFQUFtQyxRQUFuQyxFQUE2QyxFQUE3QyxDQUpPLEVBS1AsSUFBQyxDQUFBLFlBQUQsQ0FBYyxZQUFhLENBQUEsQ0FBQSxDQUEzQixFQUErQixFQUEvQixFQUFtQyxRQUFuQyxFQUE2QyxFQUE3QyxDQUxPLENBRkc7S0FBZDtJQVdBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjO01BQ1osSUFBQSxFQUFNLElBRE07TUFFWixPQUFBLEVBQVMsQ0FDUCxJQUFDLENBQUEsWUFBRCxDQUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLEVBQStCLENBQS9CLEVBQWtDLFFBQWxDLEVBQTRDLEVBQTVDLENBRE8sRUFFUCxJQUFDLENBQUEsWUFBRCxDQUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLEVBQStCLENBQS9CLEVBQWtDLFFBQWxDLEVBQTRDLEVBQTVDLENBRk8sRUFHUCxJQUFDLENBQUEsWUFBRCxDQUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLEVBQStCLENBQS9CLEVBQWtDLFFBQWxDLEVBQTRDLEVBQTVDLENBSE8sRUFJUCxJQUFDLENBQUEsWUFBRCxDQUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLEVBQStCLEVBQS9CLEVBQW1DLFFBQW5DLEVBQTZDLEVBQTdDLENBSk8sRUFLUCxJQUFDLENBQUEsWUFBRCxDQUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLEVBQStCLEVBQS9CLEVBQW1DLFFBQW5DLEVBQTZDLEVBQTdDLENBTE8sRUFNUCxJQUFDLENBQUEsWUFBRCxDQUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLEVBQStCLEVBQS9CLEVBQW1DLFFBQW5DLEVBQTZDLEVBQTdDLENBTk8sQ0FGRztLQUFkO0lBWUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWM7TUFDWixJQUFBLEVBQU0sY0FETTtNQUVaLE9BQUEsRUFBUyxDQUNQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsQ0FBL0IsRUFBa0MsUUFBbEMsRUFBNEMsRUFBNUMsQ0FETyxFQUVQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsQ0FBL0IsRUFBa0MsUUFBbEMsRUFBNEMsRUFBNUMsQ0FGTyxFQUdQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsQ0FBL0IsRUFBa0MsUUFBbEMsRUFBNEMsRUFBNUMsQ0FITyxFQUlQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsRUFBL0IsRUFBbUMsUUFBbkMsRUFBNkMsRUFBN0MsQ0FKTyxFQUtQLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsRUFBL0IsRUFBbUMsUUFBbkMsRUFBNkMsRUFBN0MsQ0FMTyxFQU1QLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBYSxDQUFBLENBQUEsQ0FBM0IsRUFBK0IsRUFBL0IsRUFBbUMsUUFBbkMsRUFBNkMsRUFBN0MsQ0FOTyxDQUZHO0tBQWQ7SUFZQSxJQUFDLENBQUEsWUFBRCxDQUFjLENBQWQ7SUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtFQTdIVzs7d0JBK0hiLFlBQUEsR0FBYyxTQUFDLE1BQUQ7SUFDWixJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUFBLENBQU0sSUFBQyxDQUFBLE9BQVEsQ0FBQSxNQUFBLENBQU8sQ0FBQyxPQUF2QjtFQUZDOzt3QkFLZCxjQUFBLEdBQWdCLFNBQUE7V0FDZCxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxXQUFmO0VBRGM7O3lCQUtoQixRQUFBLEdBQVEsU0FBQyxZQUFELEdBQUE7O3lCQUdSLFFBQUEsR0FBUSxTQUFBO0FBQ04sV0FBTztFQUREOzt3QkFLUixjQUFBLEdBQWdCLFNBQUMsQ0FBRCxFQUFJLENBQUo7QUFDZCxXQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBdkIsRUFBMEIsQ0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBdEMsQ0FBQSxHQUEyQyxDQUFDLElBQUksQ0FBQyxFQUFMLEdBQVUsQ0FBWDtFQURwQzs7d0JBR2hCLE9BQUEsR0FBUyxTQUFDLEtBQUQsRUFBUSxDQUFSLEVBQVcsT0FBWCxFQUF3QixPQUF4Qjs7TUFBVyxVQUFVOzs7TUFBRyxVQUFVOztBQUN6QyxXQUFPO01BQ0wsQ0FBQSxFQUFHLE9BQUEsR0FBVSxDQUFDLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFBLEdBQWtCLENBQW5CLENBRFI7TUFFTCxDQUFBLEVBQUcsT0FBQSxHQUFVLENBQUMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQUEsR0FBa0IsQ0FBbkIsQ0FGUjs7RUFEQTs7d0JBTVQsVUFBQSxHQUFZLFNBQUMsQ0FBRCxFQUFJLENBQUo7QUFDVixRQUFBO0lBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBdkIsRUFBMEIsQ0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBdEM7SUFDWCxJQUFHLFFBQUEsR0FBVyxDQUFkO01BQ0UsUUFBQSxJQUFZLElBQUksQ0FBQyxFQUFMLEdBQVUsRUFEeEI7O0lBRUEsS0FBQSxHQUFRO0FBQ1IsU0FBYSxnR0FBYjtNQUNFLElBQUcsQ0FBQyxRQUFBLElBQVksS0FBYixDQUFBLElBQXdCLENBQUMsUUFBQSxHQUFXLENBQUMsS0FBQSxHQUFRLElBQUMsQ0FBQSxVQUFWLENBQVosQ0FBM0I7QUFDRSxlQUFPLE1BRFQ7O01BRUEsS0FBQSxJQUFTLElBQUMsQ0FBQTtBQUhaO0FBSUEsV0FBTztFQVRHOzt3QkFXWixZQUFBLEdBQWMsU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLE1BQWYsRUFBdUIsTUFBdkIsRUFBK0IsS0FBL0I7QUFDWixRQUFBOztNQUQyQyxRQUFROztJQUNuRCxDQUFBLEdBQUksSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFDLENBQUMsS0FBQSxHQUFRLENBQVQsQ0FBQSxHQUFjLElBQUMsQ0FBQSxVQUFoQixDQUFBLEdBQThCLElBQUMsQ0FBQSxVQUF4QyxFQUFvRCxNQUFwRCxFQUE0RCxJQUFDLENBQUEsTUFBTSxDQUFDLENBQXBFLEVBQXVFLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBL0U7SUFDSixJQUFHLEtBQUEsS0FBUyxJQUFaO01BQ0UsS0FBQSxHQUFRLElBQUMsQ0FBQSxjQUFELENBQWdCLENBQUMsQ0FBQyxDQUFsQixFQUFxQixDQUFDLENBQUMsQ0FBdkIsRUFEVjs7SUFFQSxNQUFBLEdBQ0U7TUFBQSxDQUFBLEVBQUcsQ0FBQyxDQUFDLENBQUw7TUFDQSxDQUFBLEVBQUcsQ0FBQyxDQUFDLENBREw7TUFFQSxLQUFBLEVBQU8sS0FGUDtNQUdBLEtBQUEsRUFBTyxLQUhQO01BSUEsTUFBQSxFQUFRLE1BSlI7TUFLQSxLQUFBLEVBQU8sS0FMUDs7QUFNRixXQUFPO0VBWEs7O3dCQWFkLFFBQUEsR0FBVSxTQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsRUFBVCxFQUFhLEVBQWI7QUFDUixRQUFBO0lBQUEsRUFBQSxHQUFLLEVBQUEsR0FBSztJQUNWLEVBQUEsR0FBSyxFQUFBLEdBQUs7QUFDVixXQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBQyxFQUFBLEdBQUcsRUFBSixDQUFBLEdBQVUsQ0FBQyxFQUFBLEdBQUcsRUFBSixDQUFwQjtFQUhDOzt3QkFPVixTQUFBLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSjtBQUNULFFBQUE7SUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZO0lBRVosSUFBRyxJQUFDLENBQUEsU0FBRCxLQUFjLENBQUMsQ0FBbEI7TUFFRSxZQUFBLEdBQWU7TUFDZixlQUFBLEdBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQjtBQUNuQztBQUFBLFdBQUEscURBQUE7O1FBQ0UsSUFBQSxHQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBTSxDQUFDLENBQWpCLEVBQW9CLE1BQU0sQ0FBQyxDQUEzQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQztRQUNQLElBQUcsZUFBQSxHQUFrQixJQUFyQjtVQUNFLGVBQUEsR0FBa0I7VUFDbEIsWUFBQSxHQUFlLE1BRmpCOztBQUZGO01BS0EsSUFBQyxDQUFBLGVBQUQsR0FBbUI7TUFJbkIsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsVUFBRCxDQUFZLENBQVosRUFBZSxDQUFmO01BRWIsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsQ0FBQztNQUNyRCxJQUFHLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLGNBQWpCO1FBQ0UsSUFBQyxDQUFBLFNBQUQsSUFBYyxJQUFDLENBQUEsV0FEakI7O01BRUEsSUFBRyxJQUFDLENBQUEsU0FBRCxHQUFhLENBQUMsSUFBQyxDQUFBLGNBQWxCO1FBQ0UsSUFBQyxDQUFBLFNBQUQsSUFBYyxJQUFDLENBQUEsV0FEakI7O01BRUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSx5QkFBQSxHQUEwQixJQUFDLENBQUEsU0FBdkMsRUFwQkY7S0FBQSxNQUFBO01Bc0JFLFlBQUEsR0FBZSxJQUFDLENBQUEsVUFBRCxDQUFZLENBQVosRUFBZSxDQUFmO01BQ2YsSUFBRyxJQUFDLENBQUEsU0FBRCxLQUFjLFlBQWpCO1FBQ0UsV0FBQSxHQUFjLFlBQUEsR0FBZSxJQUFDLENBQUE7UUFDOUIsSUFBRyxXQUFBLEdBQWMsSUFBQyxDQUFBLGNBQWxCO1VBQ0UsV0FBQSxJQUFlLElBQUMsQ0FBQSxXQURsQjs7UUFFQSxJQUFHLFdBQUEsR0FBYyxDQUFDLElBQUMsQ0FBQSxjQUFuQjtVQUNFLFdBQUEsSUFBZSxJQUFDLENBQUEsV0FEbEI7O1FBRUEsSUFBQyxDQUFBLFNBQUQsSUFBYztRQUNkLE9BQU8sQ0FBQyxHQUFSLENBQVksb0JBQUEsR0FBcUIsSUFBQyxDQUFBLFNBQWxDO1FBRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxhQVRmO09BdkJGOztJQW1DQSxJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLEtBQUQsR0FBUztFQXZDQTs7d0JBMkNYLFdBQUEsR0FBYSxTQUFBO0lBQ1gsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNaLElBQUMsQ0FBQSxlQUFELEdBQW1CLENBQUM7SUFDcEIsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFDO0lBQ1YsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFDO0lBQ1YsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFDO1dBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYTtFQU5GOzt3QkFRYixTQUFBLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSjtBQUNULFFBQUE7SUFBQSxrQkFBQSxHQUFxQixJQUFDLENBQUEsUUFBRCxDQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBeEIsRUFBMkIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFuQztJQUNyQixJQUFHLGtCQUFBLEdBQXFCLElBQUMsQ0FBQSxVQUF6QjtNQUNFLElBQUMsQ0FBQSxHQUFHLENBQUMsVUFBTCxDQUFnQixNQUFoQjtBQUNBLGFBRkY7O0lBS0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxDQUFYLEVBQWMsQ0FBZDtXQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7RUFSUzs7d0JBVVgsU0FBQSxHQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxPQUFQO0lBRVQsSUFBRyxPQUFBLEtBQVcsQ0FBZDtNQUNFLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWCxFQUFjLENBQWQ7YUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBRkY7O0VBRlM7O3dCQU1YLE9BQUEsR0FBUyxTQUFBO0FBQ1AsUUFBQTtJQUFBLElBQUcsSUFBQyxDQUFBLFFBQUo7TUFDRSxVQUFBLEdBQWEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFDLENBQUEsZUFBRDtNQUN0QixTQUFBLEdBQVksVUFBVSxDQUFDO01BQ3ZCLElBQUcsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFoQjtRQUNFLFNBQUEsSUFBYSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBRDVCO09BQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBaEI7UUFDSCxTQUFBLElBQWEsSUFBQyxDQUFBLFVBRFg7O01BRUwsVUFBVSxDQUFDLE1BQVgsR0FBb0IsVUFQdEI7O0lBU0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtXQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7RUFYTzs7d0JBZVQsa0JBQUEsR0FBb0IsU0FBQyxNQUFEO0lBQ2xCLElBQUcsTUFBQSxLQUFVLENBQWI7QUFDRSxhQUFPLEVBRFQ7O0lBR0EsSUFBRyxNQUFBLElBQVUsSUFBQyxDQUFBLGNBQWQ7QUFFRSxhQUFPLE9BRlQ7S0FBQSxNQUFBO0FBS0UsYUFBTyxDQUFDLENBQUQsR0FBSyxDQUFDLElBQUMsQ0FBQSxVQUFELEdBQWMsTUFBZixFQUxkOztFQUprQjs7d0JBV3BCLElBQUEsR0FBTSxTQUFBO0FBQ0osUUFBQTtJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWjtJQUdBLElBQUMsQ0FBQSxHQUFHLENBQUMsUUFBTCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUE1QixFQUFtQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQTNDLEVBQW1ELEtBQUssQ0FBQyxVQUF6RDtJQUdBLElBQUMsQ0FBQSxHQUFHLENBQUMsWUFBTCxDQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDLENBQTFCLEVBQTZCLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBckMsRUFBd0MsSUFBQyxDQUFBLFVBQXpDLEVBQXFELE9BQXJELEVBQThELENBQTlEO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUFzQixHQUF0QixFQUEyQixJQUFDLENBQUEsTUFBTSxDQUFDLENBQW5DLEVBQXNDLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBOUMsRUFBaUQsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUF4RCxFQUE4RCxLQUFLLENBQUMsSUFBcEUsRUFBMEUsQ0FBMUU7QUFFQTtBQUFBLFNBQUEscURBQUE7O01BQ0UsS0FBQSxHQUFRLEtBQUssQ0FBQztNQUNkLElBQUcsSUFBQyxDQUFBLFFBQUQsSUFBYyxDQUFDLEtBQUEsS0FBUyxJQUFDLENBQUEsZUFBWCxDQUFqQjtRQUNFLEtBQUEsR0FBUSxLQUFLLENBQUMsZUFEaEI7O01BRUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUF3QixNQUFBLENBQU8sTUFBTSxDQUFDLE1BQWQsQ0FBeEIsRUFBK0MsTUFBTSxDQUFDLENBQXRELEVBQXlELE1BQU0sQ0FBQyxDQUFoRSxFQUFtRSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQTFFLEVBQWtGLE1BQU0sQ0FBQyxLQUF6RixFQUFnRyxNQUFNLENBQUMsS0FBdkc7TUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLGtCQUFMLENBQXdCLE1BQUEsQ0FBTyxNQUFNLENBQUMsTUFBZCxDQUF4QixFQUErQyxNQUFNLENBQUMsQ0FBdEQsRUFBeUQsTUFBTSxDQUFDLENBQWhFLEVBQW1FLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBMUUsRUFBa0YsT0FBbEYsRUFBMkYsQ0FBM0YsRUFBOEYsTUFBTSxDQUFDLEtBQXJHO0FBTEY7SUFPQSxJQUFHLElBQUMsQ0FBQSxRQUFKO01BQ0UsVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQyxDQUFBLGVBQUQ7TUFFdEIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFyQixFQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLENBQWhDLEVBQW1DLElBQUMsQ0FBQSxVQUFwQyxFQUFnRCxDQUFoRCxFQUFtRCxNQUFuRCxFQUEyRCxLQUFLLENBQUMsSUFBakU7QUFFQSxXQUFTLHFHQUFUO1FBQ0UsS0FBQSxHQUFRLENBQUMsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFkLENBQUEsR0FBbUIsSUFBQyxDQUFBO1FBQzVCLEtBQUEsR0FBUSxLQUFBLEdBQVEsSUFBQyxDQUFBO1FBQ2pCLEtBQUEsR0FBUSxJQUFDLENBQUEsU0FBRCxHQUFhO1FBQ3JCLElBQUcsS0FBQSxLQUFTLElBQUMsQ0FBQSxTQUFiO1VBQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFyQixFQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLENBQWhDLEVBQW1DLElBQUMsQ0FBQSxVQUFwQyxFQUFnRCxLQUFoRCxFQUF1RCxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQWhFLEVBQTRFLEtBQUssQ0FBQyxhQUFsRixFQURGOztRQUVBLElBQUcsQ0FBQyxLQUFBLEtBQVMsQ0FBVixDQUFBLElBQWlCLENBQUMsS0FBQSxLQUFTLENBQVYsQ0FBcEI7VUFDRSxJQUFHLEtBQUEsR0FBUSxDQUFYO1lBQ0UsS0FBQSxHQUFRLEdBQUEsR0FBRyxDQUFDLEtBQUEsR0FBUSxDQUFUO1lBQ1gsU0FBQSxHQUFZLEtBQUssQ0FBQyxRQUZwQjtXQUFBLE1BQUE7WUFJRSxLQUFBLEdBQVEsRUFBQSxHQUFHO1lBQ1gsU0FBQSxHQUFZLEtBQUssQ0FBQyxhQUxwQjs7VUFNQSxPQUFBLEdBQVUsSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFBLEdBQVEsSUFBQyxDQUFBLGNBQWxCLEVBQWtDLElBQUMsQ0FBQSxtQkFBbkMsRUFBd0QsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFoRSxFQUFtRSxJQUFDLENBQUEsTUFBTSxDQUFDLENBQTNFO1VBQ1YsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QixPQUFPLENBQUMsQ0FBckMsRUFBd0MsT0FBTyxDQUFDLENBQWhELEVBQW1ELElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBMUQsRUFBcUUsU0FBckUsRUFBZ0YsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBTyxDQUFDLENBQXhCLEVBQTJCLE9BQU8sQ0FBQyxDQUFuQyxDQUFoRixFQVJGOztBQU5GO0FBZ0JBLFdBQVMsaUdBQVQ7UUFDRSxLQUFBLEdBQVEsQ0FBQyxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxTQUFmLEdBQTJCLENBQTVCLENBQUEsR0FBaUMsSUFBQyxDQUFBO1FBQzFDLEtBQUEsR0FBUSxLQUFBLEdBQVEsSUFBQyxDQUFBO1FBQ2pCLEtBQUEsR0FBUSxJQUFDLENBQUEsU0FBRCxHQUFhO1FBQ3JCLElBQUcsQ0FBQyxLQUFBLEtBQVMsQ0FBVixDQUFBLElBQWlCLENBQUMsS0FBQSxLQUFTLENBQVYsQ0FBcEI7VUFDRSxJQUFHLEtBQUEsR0FBUSxDQUFYO1lBQ0UsS0FBQSxHQUFRLEdBQUEsR0FBRyxDQUFDLEtBQUEsR0FBUSxDQUFUO1lBQ1gsU0FBQSxHQUFZLEtBQUssQ0FBQyxRQUZwQjtXQUFBLE1BQUE7WUFJRSxLQUFBLEdBQVEsRUFBQSxHQUFHO1lBQ1gsU0FBQSxHQUFZLEtBQUssQ0FBQyxhQUxwQjs7VUFNQSxPQUFBLEdBQVUsSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFBLEdBQVEsSUFBQyxDQUFBLGNBQWxCLEVBQWtDLElBQUMsQ0FBQSxtQkFBbkMsRUFBd0QsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFoRSxFQUFtRSxJQUFDLENBQUEsTUFBTSxDQUFDLENBQTNFO1VBQ1YsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QixPQUFPLENBQUMsQ0FBckMsRUFBd0MsT0FBTyxDQUFDLENBQWhELEVBQW1ELElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBMUQsRUFBcUUsU0FBckUsRUFBZ0YsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBTyxDQUFDLENBQXhCLEVBQTJCLE9BQU8sQ0FBQyxDQUFuQyxDQUFoRixFQVJGOztBQUpGO01BY0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxZQUFMLENBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBMUIsRUFBNkIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFyQyxFQUF3QyxJQUFDLENBQUEsVUFBekMsRUFBcUQsT0FBckQsRUFBOEQsQ0FBOUQ7TUFFQSxlQUFBLEdBQWtCLFVBQVUsQ0FBQztNQUM3QixJQUFHLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBaEI7UUFDRSxlQUFBLElBQW1CLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFEbEM7T0FBQSxNQUVLLElBQUcsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFoQjtRQUNILGVBQUEsSUFBbUIsSUFBQyxDQUFBLFVBRGpCOztNQUVMLElBQUMsQ0FBQSxHQUFHLENBQUMsZ0JBQUwsQ0FBd0IsZUFBeEIsRUFBeUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFqRCxFQUFvRCxJQUFDLENBQUEsTUFBTSxDQUFDLENBQTVELEVBQStELElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBdEUsRUFBOEUsVUFBVSxDQUFDLEtBQXpGLEVBQWdHLFVBQVUsQ0FBQyxLQUEzRztNQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsa0JBQUwsQ0FBd0IsZUFBeEIsRUFBeUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFqRCxFQUFvRCxJQUFDLENBQUEsTUFBTSxDQUFDLENBQTVELEVBQStELElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBdEUsRUFBOEUsT0FBOUUsRUFBdUYsQ0FBdkYsRUFBMEYsVUFBVSxDQUFDLEtBQXJHLEVBM0NGOztFQWpCSTs7Ozs7O0FBa0VSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDclhqQixJQUFBOztBQUFBLGFBQUEsR0FBZ0I7O0FBQ2hCLGNBQUEsR0FBaUI7O0FBQ2pCLGNBQUEsR0FBaUI7O0FBQ2pCLGdCQUFBLEdBQW1COztBQUVuQixTQUFBLEdBQVksU0FBQyxLQUFEO0FBQ1YsTUFBQTtFQUFBLENBQUEsR0FBSSxjQUFBLEdBQWlCLENBQUMsY0FBQSxHQUFpQixLQUFsQjtFQUNyQixJQUFHLEtBQUEsR0FBUSxDQUFYO0lBQ0UsQ0FBQSxJQUFLLGlCQURQOztFQUVBLElBQUcsS0FBQSxHQUFRLENBQVg7SUFDRSxDQUFBLElBQUssaUJBRFA7O0VBRUEsSUFBRyxLQUFBLEdBQVEsQ0FBWDtJQUNFLENBQUEsSUFBSyxpQkFEUDs7QUFFQSxTQUFPO0FBUkc7O0FBVU47RUFDUyxvQkFBQyxHQUFELEVBQU8sTUFBUCxFQUFnQixPQUFoQjtBQUNYLFFBQUE7SUFEWSxJQUFDLENBQUEsTUFBRDtJQUFNLElBQUMsQ0FBQSxTQUFEO0lBQVMsSUFBQyxDQUFBLFVBQUQ7SUFDM0IsSUFBQyxDQUFBLE9BQUQsR0FDRTtNQUFBLE1BQUEsRUFDRTtRQUFBLENBQUEsRUFBRyxTQUFBLENBQVUsQ0FBVixDQUFIO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxPQUFBLEVBQVMsU0FGVDtRQUdBLFNBQUEsRUFBVyxTQUhYO1FBSUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLElBQWIsQ0FKUDtPQURGOztJQVFGLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFFVCxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFULEdBQTRCLElBQUMsQ0FBQSxLQUE3QixHQUFxQztJQUN2RCxJQUFDLENBQUEsS0FBRCxHQUNFO01BQUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxHQUFHLENBQUMsWUFBTCxDQUFrQixRQUFsQixFQUE4QixDQUFDLElBQUMsQ0FBQSxPQUFPLENBQUMsZ0JBQVQsR0FBNEIsSUFBQyxDQUFBLEtBQTlCLENBQUEsR0FBb0MsMkJBQWxFLENBQVI7TUFDQSxJQUFBLEVBQVEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxZQUFMLENBQWtCLE1BQWxCLEVBQStCLElBQUMsQ0FBQSxjQUFGLEdBQWlCLDJCQUEvQyxDQURSOztJQUdGLFdBQUEsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0I7SUFDOUIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCO0lBQ2pDLE9BQUEsR0FBVSxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixXQUFqQixDQUFBLEdBQWdDO0FBQzFDO0FBQUEsU0FBQSxpQkFBQTs7TUFDRSxNQUFNLENBQUMsQ0FBUCxHQUFXO01BQ1gsTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsTUFBTSxDQUFDO01BQ25DLE1BQU0sQ0FBQyxDQUFQLEdBQVc7TUFDWCxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQTtBQUpkO0lBTUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsWUFBRCxHQUFnQixHQUEzQjtJQUNuQixJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxHQUFHLENBQUMsWUFBTCxDQUFrQixRQUFsQixFQUErQixnQkFBRCxHQUFrQix1QkFBaEQ7SUFDZCxlQUFBLEdBQWtCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLEdBQTVCO0lBQ2xCLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxZQUFMLENBQWtCLFFBQWxCLEVBQStCLGVBQUQsR0FBaUIsdUJBQS9DO0FBQ2I7RUE5Qlc7O3VCQWdDYixVQUFBLEdBQVksU0FBQyxNQUFELEVBQVMsRUFBVCxFQUFhLEVBQWI7QUFDVixRQUFBO0lBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxnQkFBWixFQUE4QixNQUE5QjtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsZUFBTCxDQUFxQixFQUFyQixFQUF5QixFQUF6QixFQUE2QixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsSUFBQyxDQUFBLEtBQTlDLEVBQXFELElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUFDLENBQUEsS0FBdkUsRUFBOEUsQ0FBOUUsRUFBaUYsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBaEcsRUFBNEcsT0FBNUc7QUFDQTtBQUFBLFNBQUEscUNBQUE7O01BQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUFzQixNQUFNLENBQUMsTUFBN0IsRUFBcUMsRUFBQSxHQUFLLENBQUMsTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFDLENBQUEsS0FBYixDQUExQyxFQUErRCxFQUFBLEdBQUssQ0FBQyxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQSxLQUFiLENBQXBFLEVBQXlGLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBaEcsRUFBd0csTUFBTSxDQUFDLEtBQS9HLEVBQXNILE1BQU0sQ0FBQyxLQUE3SDtBQURGO1dBRUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUFzQixNQUFNLENBQUMsSUFBN0IsRUFBbUMsRUFBQSxHQUFLLENBQUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCLElBQUMsQ0FBQSxLQUFqQixHQUF5QixDQUExQixDQUF4QyxFQUFzRSxFQUFBLEdBQUssSUFBQyxDQUFBLGNBQTVFLEVBQTRGLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBbkcsRUFBeUcsT0FBekcsRUFBa0gsQ0FBbEg7RUFMVTs7dUJBT1osSUFBQSxHQUFNLFNBQUE7QUFDSixRQUFBO0lBQUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxRQUFMLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQTVCLEVBQW1DLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBM0MsRUFBbUQsU0FBbkQ7QUFFQTtBQUFBLFNBQUEsNkNBQUE7O01BQ0UsQ0FBQSxHQUFJLENBQUMsQ0FBQSxHQUFJLElBQUMsQ0FBQSxLQUFOLENBQUEsR0FBZSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQXZCLEdBQStCLElBQUMsQ0FBQTtNQUNwQyxDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUksSUFBQyxDQUFBLEtBQWhCLENBQUEsR0FBeUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFqQyxHQUEwQyxJQUFDLENBQUE7TUFDL0MsSUFBQyxDQUFBLFVBQUQsQ0FBWSxNQUFaLEVBQW9CLENBQXBCLEVBQXVCLENBQXZCO0FBSEY7SUFLQSxZQUFBLEdBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCO0FBQ2hDO0FBQUE7U0FBQSxrQkFBQTs7TUFDRSxJQUFDLENBQUEsR0FBRyxDQUFDLGVBQUwsQ0FBcUIsTUFBTSxDQUFDLENBQVAsR0FBVyxZQUFoQyxFQUE4QyxNQUFNLENBQUMsQ0FBUCxHQUFXLFlBQXpELEVBQXVFLE1BQU0sQ0FBQyxDQUE5RSxFQUFpRixNQUFNLENBQUMsQ0FBeEYsRUFBMkYsTUFBTSxDQUFDLENBQVAsR0FBVyxHQUF0RyxFQUEyRyxPQUEzRyxFQUFvSCxPQUFwSDtNQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsZUFBTCxDQUFxQixNQUFNLENBQUMsQ0FBNUIsRUFBK0IsTUFBTSxDQUFDLENBQXRDLEVBQXlDLE1BQU0sQ0FBQyxDQUFoRCxFQUFtRCxNQUFNLENBQUMsQ0FBMUQsRUFBNkQsTUFBTSxDQUFDLENBQVAsR0FBVyxHQUF4RSxFQUE2RSxNQUFNLENBQUMsT0FBcEYsRUFBNkYsU0FBN0Y7bUJBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUFzQixNQUFNLENBQUMsSUFBN0IsRUFBbUMsTUFBTSxDQUFDLENBQVAsR0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFQLEdBQVcsQ0FBWixDQUE5QyxFQUE4RCxNQUFNLENBQUMsQ0FBUCxHQUFXLENBQUMsTUFBTSxDQUFDLENBQVAsR0FBVyxDQUFaLENBQXpFLEVBQXlGLElBQUMsQ0FBQSxVQUExRixFQUFzRyxNQUFNLENBQUMsU0FBN0c7QUFIRjs7RUFUSTs7dUJBZ0JOLFNBQUEsR0FBVyxTQUFDLENBQUQsRUFBSSxDQUFKO0FBQ1QsUUFBQTtBQUFBO0FBQUEsU0FBQSxpQkFBQTs7TUFDRSxJQUFHLENBQUMsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxDQUFaLENBQUEsSUFBa0IsQ0FBQyxDQUFBLEdBQUksQ0FBQyxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQSxZQUFiLENBQUwsQ0FBckI7UUFFRSxNQUFNLENBQUMsS0FBUCxDQUFBO0FBQ0EsZUFIRjs7QUFERjtJQU1BLE9BQU8sQ0FBQyxHQUFSLENBQWUsQ0FBRCxHQUFHLElBQUgsR0FBTyxDQUFyQjtJQUNBLFdBQUEsR0FBYyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUEsR0FBSSxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixJQUFDLENBQUEsS0FBbEIsQ0FBZixDQUFBLEdBQTJDLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUEsR0FBSSxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUFDLENBQUEsS0FBbkIsQ0FBZixDQUFwQjtJQUN6RCxJQUFHLENBQUMsV0FBQSxJQUFlLENBQWhCLENBQUEsSUFBdUIsQ0FBQyxXQUFBLEdBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBaEMsQ0FBMUI7TUFDRSxNQUFBLEdBQVMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFRLENBQUEsV0FBQTtNQUMxQixJQUFHLE9BQUEsQ0FBUSxnQkFBQSxHQUFpQixNQUFNLENBQUMsSUFBeEIsR0FBNkIsV0FBckMsQ0FBSDtRQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixXQUF0QjtRQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsVUFBTCxDQUFnQixTQUFoQixFQUZGO09BRkY7O0VBVFM7O3VCQWdCWCxTQUFBLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLE9BQVAsR0FBQTs7dUJBQ1gsT0FBQSxHQUFTLFNBQUEsR0FBQTs7dUJBRVQsTUFBQSxHQUFRLFNBQUE7V0FDTixJQUFDLENBQUEsR0FBRyxDQUFDLFVBQUwsQ0FBZ0IsTUFBaEI7RUFETTs7Ozs7O0FBR1YsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUM3RmpCLElBQUE7O0FBQUEsYUFBQSxHQUFnQjs7QUFDaEIsY0FBQSxHQUFpQjs7QUFDakIsY0FBQSxHQUFpQjs7QUFDakIsZ0JBQUEsR0FBbUI7O0FBRW5CLFNBQUEsR0FBWSxTQUFDLEtBQUQ7QUFDVixNQUFBO0VBQUEsQ0FBQSxHQUFJLGNBQUEsR0FBaUIsQ0FBQyxjQUFBLEdBQWlCLEtBQWxCO0VBQ3JCLElBQUcsS0FBQSxHQUFRLENBQVg7SUFDRSxDQUFBLElBQUssaUJBRFA7O0VBRUEsSUFBRyxLQUFBLEdBQVEsQ0FBWDtJQUNFLENBQUEsSUFBSyxpQkFEUDs7RUFFQSxJQUFHLEtBQUEsR0FBUSxDQUFYO0lBQ0UsQ0FBQSxJQUFLLGlCQURQOztBQUVBLFNBQU87QUFSRzs7QUFVTjtFQUNTLGtCQUFDLEdBQUQsRUFBTyxNQUFQO0FBQ1gsUUFBQTtJQURZLElBQUMsQ0FBQSxNQUFEO0lBQU0sSUFBQyxDQUFBLFNBQUQ7SUFDbEIsSUFBQyxDQUFBLE9BQUQsR0FDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLENBQUEsRUFBRyxTQUFBLENBQVUsQ0FBVixDQUFIO1FBQ0EsSUFBQSxFQUFNLGVBRE47UUFFQSxPQUFBLEVBQVMsU0FGVDtRQUdBLFNBQUEsRUFBVyxTQUhYO1FBSUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFtQixJQUFuQixDQUpQO09BREY7TUFNQSxjQUFBLEVBQ0U7UUFBQSxDQUFBLEVBQUcsU0FBQSxDQUFVLENBQVYsQ0FBSDtRQUNBLElBQUEsRUFBTSxrQkFETjtRQUVBLE9BQUEsRUFBUyxTQUZUO1FBR0EsU0FBQSxFQUFXLFNBSFg7UUFJQSxLQUFBLEVBQU8sSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUFoQixDQUFxQixJQUFyQixDQUpQO09BUEY7TUFZQSxNQUFBLEVBQ0U7UUFBQSxDQUFBLEVBQUcsU0FBQSxDQUFVLENBQVYsQ0FBSDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsT0FBQSxFQUFTLFNBRlQ7UUFHQSxTQUFBLEVBQVcsU0FIWDtRQUlBLEtBQUEsRUFBTyxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxJQUFiLENBSlA7T0FiRjs7SUFtQkYsV0FBQSxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQjtJQUM5QixJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUI7SUFDakMsT0FBQSxHQUFVLENBQUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCLFdBQWpCLENBQUEsR0FBZ0M7QUFDMUM7QUFBQSxTQUFBLGlCQUFBOztNQUNFLE1BQU0sQ0FBQyxDQUFQLEdBQVc7TUFDWCxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixNQUFNLENBQUM7TUFDbkMsTUFBTSxDQUFDLENBQVAsR0FBVztNQUNYLE1BQU0sQ0FBQyxDQUFQLEdBQVcsSUFBQyxDQUFBO0FBSmQ7SUFNQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxZQUFELEdBQWdCLEdBQTNCO0lBQ25CLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxZQUFMLENBQWtCLFFBQWxCLEVBQStCLGdCQUFELEdBQWtCLHVCQUFoRDtJQUNkLGVBQUEsR0FBa0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsR0FBNUI7SUFDbEIsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsR0FBRyxDQUFDLFlBQUwsQ0FBa0IsUUFBbEIsRUFBK0IsZUFBRCxHQUFpQix1QkFBL0M7QUFDYjtFQWxDVzs7cUJBb0NiLElBQUEsR0FBTSxTQUFBO0FBQ0osUUFBQTtJQUFBLElBQUMsQ0FBQSxHQUFHLENBQUMsUUFBTCxDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUE1QixFQUFtQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQTNDLEVBQW1ELFNBQW5EO0lBRUEsQ0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQjtJQUNwQixZQUFBLEdBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCO0lBRWhDLEVBQUEsR0FBSyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUI7SUFDdEIsRUFBQSxHQUFLLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQjtJQUN0QixJQUFDLENBQUEsR0FBRyxDQUFDLGdCQUFMLENBQXNCLEtBQXRCLEVBQTZCLENBQUEsR0FBSSxZQUFqQyxFQUErQyxFQUFBLEdBQUssWUFBcEQsRUFBa0UsSUFBQyxDQUFBLFNBQW5FLEVBQThFLFNBQTlFO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QixDQUE3QixFQUFnQyxFQUFoQyxFQUFvQyxJQUFDLENBQUEsU0FBckMsRUFBZ0QsU0FBaEQ7QUFFQTtBQUFBLFNBQUEsaUJBQUE7O01BQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxlQUFMLENBQXFCLE1BQU0sQ0FBQyxDQUFQLEdBQVcsWUFBaEMsRUFBOEMsTUFBTSxDQUFDLENBQVAsR0FBVyxZQUF6RCxFQUF1RSxNQUFNLENBQUMsQ0FBOUUsRUFBaUYsTUFBTSxDQUFDLENBQXhGLEVBQTJGLE1BQU0sQ0FBQyxDQUFQLEdBQVcsR0FBdEcsRUFBMkcsT0FBM0csRUFBb0gsT0FBcEg7TUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLGVBQUwsQ0FBcUIsTUFBTSxDQUFDLENBQTVCLEVBQStCLE1BQU0sQ0FBQyxDQUF0QyxFQUF5QyxNQUFNLENBQUMsQ0FBaEQsRUFBbUQsTUFBTSxDQUFDLENBQTFELEVBQTZELE1BQU0sQ0FBQyxDQUFQLEdBQVcsR0FBeEUsRUFBNkUsTUFBTSxDQUFDLE9BQXBGLEVBQTZGLFNBQTdGO01BQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUFzQixNQUFNLENBQUMsSUFBN0IsRUFBbUMsTUFBTSxDQUFDLENBQVAsR0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFQLEdBQVcsQ0FBWixDQUE5QyxFQUE4RCxNQUFNLENBQUMsQ0FBUCxHQUFXLENBQUMsTUFBTSxDQUFDLENBQVAsR0FBVyxDQUFaLENBQXpFLEVBQXlGLElBQUMsQ0FBQSxVQUExRixFQUFzRyxNQUFNLENBQUMsU0FBN0c7QUFIRjtXQUtBLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxDQUFBO0VBaEJJOztxQkFrQk4sU0FBQSxHQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUo7QUFDVCxRQUFBO0FBQUE7QUFBQSxTQUFBLGlCQUFBOztNQUNFLElBQUcsQ0FBQyxDQUFBLEdBQUksTUFBTSxDQUFDLENBQVosQ0FBQSxJQUFrQixDQUFDLENBQUEsR0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFQLEdBQVcsSUFBQyxDQUFBLFlBQWIsQ0FBTCxDQUFyQjtRQUVFLE1BQU0sQ0FBQyxLQUFQLENBQUEsRUFGRjs7QUFERjtFQURTOztxQkFPWCxTQUFBLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLE9BQVAsR0FBQTs7cUJBQ1gsT0FBQSxHQUFTLFNBQUEsR0FBQTs7cUJBRVQsWUFBQSxHQUFjLFNBQUE7V0FDWixJQUFDLENBQUEsR0FBRyxDQUFDLFVBQUwsQ0FBZ0IsUUFBaEI7RUFEWTs7cUJBR2QsY0FBQSxHQUFnQixTQUFBO0lBQ2QsSUFBRyxPQUFBLENBQVEsbUJBQVIsQ0FBSDthQUNFLElBQUMsQ0FBQSxHQUFHLENBQUMsY0FBTCxDQUFBLEVBREY7O0VBRGM7O3FCQUloQixNQUFBLEdBQVEsU0FBQTtXQUNOLElBQUMsQ0FBQSxHQUFHLENBQUMsVUFBTCxDQUFnQixTQUFoQjtFQURNOzs7Ozs7QUFHVixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQzFGakIsSUFBQTs7QUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVI7O0FBRU4sSUFBQSxHQUFPLFNBQUE7QUFDTCxNQUFBO0VBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaO0VBQ0EsTUFBQSxHQUFTLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCO0VBQ1QsTUFBTSxDQUFDLEtBQVAsR0FBZSxRQUFRLENBQUMsZUFBZSxDQUFDO0VBQ3hDLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLFFBQVEsQ0FBQyxlQUFlLENBQUM7RUFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFkLENBQTJCLE1BQTNCLEVBQW1DLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVyxDQUFBLENBQUEsQ0FBNUQ7RUFDQSxVQUFBLEdBQWEsTUFBTSxDQUFDLHFCQUFQLENBQUE7RUFFYixNQUFNLENBQUMsR0FBUCxHQUFhLElBQUksR0FBSixDQUFRLE1BQVI7RUFFYixNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsWUFBeEIsRUFBc0MsU0FBQyxDQUFEO0FBQ3BDLFFBQUE7SUFBQSxDQUFDLENBQUMsY0FBRixDQUFBO0lBQ0EsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBYixHQUF1QixVQUFVLENBQUM7SUFDdEMsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBYixHQUF1QixVQUFVLENBQUM7V0FDdEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFYLENBQXFCLENBQXJCLEVBQXdCLENBQXhCO0VBSm9DLENBQXRDO0VBTUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDLFNBQUMsQ0FBRDtBQUNuQyxRQUFBO0lBQUEsQ0FBQyxDQUFDLGNBQUYsQ0FBQTtJQUNBLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWIsR0FBdUIsVUFBVSxDQUFDO0lBQ3RDLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWIsR0FBdUIsVUFBVSxDQUFDO1dBQ3RDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBWCxDQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixDQUEzQjtFQUptQyxDQUFyQztFQU1BLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixVQUF4QixFQUFvQyxTQUFDLENBQUQ7SUFDbEMsQ0FBQyxDQUFDLGNBQUYsQ0FBQTtXQUNBLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBWCxDQUFBO0VBRmtDLENBQXBDO0VBSUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDLFNBQUMsQ0FBRDtBQUNuQyxRQUFBO0lBQUEsQ0FBQyxDQUFDLGNBQUYsQ0FBQTtJQUNBLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztJQUMzQixDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsR0FBWSxVQUFVLENBQUM7V0FDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFYLENBQXFCLENBQXJCLEVBQXdCLENBQXhCO0VBSm1DLENBQXJDO0VBTUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDLFNBQUMsQ0FBRDtBQUNuQyxRQUFBO0lBQUEsQ0FBQyxDQUFDLGNBQUYsQ0FBQTtJQUNBLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztJQUMzQixDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsR0FBWSxVQUFVLENBQUM7SUFDM0IsT0FBQSxHQUFVLENBQUMsQ0FBQztXQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBWCxDQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixPQUEzQjtFQUxtQyxDQUFyQztTQU9BLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixTQUF4QixFQUFtQyxTQUFDLENBQUQ7SUFDakMsQ0FBQyxDQUFDLGNBQUYsQ0FBQTtXQUNBLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBWCxDQUFBO0VBRmlDLENBQW5DO0FBdkNLOztBQTJDUCxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsU0FBQyxDQUFEO1NBQzVCLElBQUEsQ0FBQTtBQUQ0QixDQUFoQyxFQUVFLEtBRkY7Ozs7QUM3Q0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNBakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkZvbnRGYWNlT2JzZXJ2ZXIgPSByZXF1aXJlICdmb250ZmFjZW9ic2VydmVyJ1xuXG5NZW51VmlldyA9IHJlcXVpcmUgJy4vTWVudVZpZXcnXG5Db3VudGVyVmlldyA9IHJlcXVpcmUgJy4vQ291bnRlclZpZXcnXG5MYXlvdXRWaWV3ID0gcmVxdWlyZSAnLi9MYXlvdXRWaWV3J1xudmVyc2lvbiA9IHJlcXVpcmUgJy4vdmVyc2lvbidcblxuY2xhc3MgQXBwXG4gIGNvbnN0cnVjdG9yOiAoQGNhbnZhcykgLT5cbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBAbG9hZEZvbnQoXCJzYXhNb25vXCIpXG4gICAgQGxvYWRGb250KFwiSW5zdHJ1Y3Rpb25cIilcbiAgICBAZm9udHMgPSB7fVxuXG4gICAgQHZlcnNpb25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDIpXG4gICAgQHZlcnNpb25Gb250ID0gQHJlZ2lzdGVyRm9udChcInZlcnNpb25cIiwgXCIje0B2ZXJzaW9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcblxuICAgIEBnZW5lcmF0aW5nRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjA0KVxuICAgIEBnZW5lcmF0aW5nRm9udCA9IEByZWdpc3RlckZvbnQoXCJnZW5lcmF0aW5nXCIsIFwiI3tAZ2VuZXJhdGluZ0ZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG5cbiAgICBAdmlld3MgPVxuICAgICAgbWVudTogbmV3IE1lbnVWaWV3KHRoaXMsIEBjYW52YXMpXG4gICAgICBjb3VudGVyOiBuZXcgQ291bnRlclZpZXcodGhpcywgQGNhbnZhcylcbiAgICBAdmlld3MubGF5b3V0ID0gbmV3IExheW91dFZpZXcodGhpcywgQGNhbnZhcywgQHZpZXdzLmNvdW50ZXIpXG4gICAgQHN3aXRjaFZpZXcoXCJsYXlvdXRcIilcblxuICBtZWFzdXJlRm9udHM6IC0+XG4gICAgZm9yIGZvbnROYW1lLCBmIG9mIEBmb250c1xuICAgICAgQGN0eC5mb250ID0gZi5zdHlsZVxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcbiAgICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxuICAgICAgZi5oZWlnaHQgPSBNYXRoLmZsb29yKEBjdHgubWVhc3VyZVRleHQoXCJtXCIpLndpZHRoICogMS4xKSAjIGJlc3QgaGFjayBldmVyXG4gICAgICBjb25zb2xlLmxvZyBcIkZvbnQgI3tmb250TmFtZX0gbWVhc3VyZWQgYXQgI3tmLmhlaWdodH0gcGl4ZWxzXCJcbiAgICByZXR1cm5cblxuICByZWdpc3RlckZvbnQ6IChuYW1lLCBzdHlsZSkgLT5cbiAgICBmb250ID1cbiAgICAgIG5hbWU6IG5hbWVcbiAgICAgIHN0eWxlOiBzdHlsZVxuICAgICAgaGVpZ2h0OiAwXG4gICAgQGZvbnRzW25hbWVdID0gZm9udFxuICAgIEBtZWFzdXJlRm9udHMoKVxuICAgIHJldHVybiBmb250XG5cbiAgbG9hZEZvbnQ6IChmb250TmFtZSkgLT5cbiAgICBmb250ID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoZm9udE5hbWUpXG4gICAgZm9udC5sb2FkKCkudGhlbiA9PlxuICAgICAgY29uc29sZS5sb2coXCIje2ZvbnROYW1lfSBsb2FkZWQsIHJlZHJhd2luZy4uLlwiKVxuICAgICAgQG1lYXN1cmVGb250cygpXG4gICAgICBAZHJhdygpXG5cbiAgc3dpdGNoVmlldzogKHZpZXcpIC0+XG4gICAgQHZpZXcgPSBAdmlld3Nbdmlld11cbiAgICBAZHJhdygpXG5cbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcImFwcC5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcblxuICAgICMgQGRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiM0NDQ0NDRcIilcbiAgICAjIEBkcmF3VGV4dENlbnRlcmVkKFwiR2VuZXJhdGluZywgcGxlYXNlIHdhaXQuLi5cIiwgQGNhbnZhcy53aWR0aCAvIDIsIEBjYW52YXMuaGVpZ2h0IC8gMiwgQGdlbmVyYXRpbmdGb250LCBcIiNmZmZmZmZcIilcblxuICAgICMgd2luZG93LnNldFRpbWVvdXQgPT5cbiAgICAjIEB2aWV3cy5zdWRva3UubmV3R2FtZShkaWZmaWN1bHR5KVxuICAgICMgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcbiAgICAjICwgMFxuXG4gIHJlc2V0QWxsSGVhbHRoOiAtPlxuICAgIEB2aWV3cy5jb3VudGVyLnJlc2V0QWxsSGVhbHRoKClcbiAgICBAc3dpdGNoVmlldyhcImNvdW50ZXJcIilcblxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XG4gICAgIyByZXR1cm4gQHZpZXdzLnN1ZG9rdS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuXG4gIGV4cG9ydDogLT5cbiAgICAjIHJldHVybiBAdmlld3Muc3Vkb2t1LmV4cG9ydCgpXG5cbiAgZHJhdzogLT5cbiAgICBAdmlldy5kcmF3KClcblxuICBtb3VzZWRvd246ICh4LCB5KSAtPlxuICAgIEB2aWV3Lm1vdXNlZG93bih4LCB5KVxuXG4gIG1vdXNlbW92ZTogKHgsIHksIGJ1dHRvbnMpIC0+XG4gICAgQHZpZXcubW91c2Vtb3ZlKHgsIHksIGJ1dHRvbnMpXG5cbiAgbW91c2V1cDogKHgsIHkpIC0+XG4gICAgQHZpZXcubW91c2V1cCh4LCB5KVxuXG4gIGRyYXdGaWxsOiAoeCwgeSwgdywgaCwgY29sb3IpIC0+XG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcbiAgICBAY3R4LmZpbGwoKVxuXG4gIGRyYXdSb3VuZGVkUmVjdDogKHgsIHksIHcsIGgsIHIsIGZpbGxDb2xvciA9IG51bGwsIHN0cm9rZUNvbG9yID0gbnVsbCkgLT5cbiAgICBAY3R4LnJvdW5kUmVjdCh4LCB5LCB3LCBoLCByKVxuICAgIGlmIGZpbGxDb2xvciAhPSBudWxsXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IGZpbGxDb2xvclxuICAgICAgQGN0eC5maWxsKClcbiAgICBpZiBzdHJva2VDb2xvciAhPSBudWxsXG4gICAgICBAY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlQ29sb3JcbiAgICAgIEBjdHguc3Ryb2tlKClcbiAgICByZXR1cm5cblxuICBkcmF3UmVjdDogKHgsIHksIHcsIGgsIGNvbG9yLCBsaW5lV2lkdGggPSAxKSAtPlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxuICAgIEBjdHguc3Ryb2tlKClcblxuICBkcmF3TGluZTogKHgxLCB5MSwgeDIsIHkyLCBjb2xvciA9IFwiYmxhY2tcIiwgbGluZVdpZHRoID0gMSkgLT5cbiAgICBAY3R4LmJlZ2luUGF0aCgpXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcbiAgICBAY3R4Lm1vdmVUbyh4MSwgeTEpXG4gICAgQGN0eC5saW5lVG8oeDIsIHkyKVxuICAgIEBjdHguc3Ryb2tlKClcblxuICBkcmF3QXJjOiAoeCwgeSwgciwgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGNvbG9yKSAtPlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC5tb3ZlVG8oeCwgeSlcbiAgICBAY3R4LmFyYyh4LCB5LCByLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSlcbiAgICBAY3R4LmNsb3NlUGF0aCgpXG4gICAgQGN0eC5maWxsKClcblxuICBzdHJva2VDaXJjbGU6ICh4LCB5LCByLCBjb2xvciwgbGluZVdpZHRoKSAtPlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxuICAgIEBjdHguYXJjKHgsIHksIHIsIDAsIE1hdGguUEkgKiAyKVxuICAgIEBjdHguY2xvc2VQYXRoKClcbiAgICBAY3R4LnN0cm9rZSgpXG5cbiAgZHJhd1RleHRDZW50ZXJlZDogKHRleHQsIGN4LCBjeSwgZm9udCwgY29sb3IsIHJvdCkgLT5cbiAgICBAY3R4LnNhdmUoKVxuICAgIEBjdHgudHJhbnNsYXRlKGN4LCBjeSlcbiAgICBAY3R4LnJvdGF0ZShyb3QpXG4gICAgQGN0eC5mb250ID0gZm9udC5zdHlsZVxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcblxuICAgIEBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgMCwgKGZvbnQuaGVpZ2h0IC8gMikpXG5cbiAgICBAY3R4LnJlc3RvcmUoKVxuXG4gIHN0cm9rZVRleHRDZW50ZXJlZDogKHRleHQsIGN4LCBjeSwgZm9udCwgY29sb3IsIGxpbmVXaWR0aCwgcm90KSAtPlxuICAgIEBjdHguc2F2ZSgpXG4gICAgQGN0eC50cmFuc2xhdGUoY3gsIGN5KVxuICAgIEBjdHgucm90YXRlKHJvdClcbiAgICBAY3R4LmZvbnQgPSBmb250LnN0eWxlXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcbiAgICBAY3R4LnN0cm9rZVRleHQodGV4dCwgMCwgKGZvbnQuaGVpZ2h0IC8gMikpXG4gICAgQGN0eC5yZXN0b3JlKClcblxuICBkcmF3TG93ZXJMZWZ0OiAodGV4dCwgY29sb3IgPSBcIndoaXRlXCIpIC0+XG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIDAsIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcblxuICBkcmF3VmVyc2lvbjogKGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwicmlnaHRcIlxuICAgIEBjdHguZmlsbFRleHQoXCJ2I3t2ZXJzaW9ufVwiLCBAY2FudmFzLndpZHRoIC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxuXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLnJvdW5kUmVjdCA9ICh4LCB5LCB3LCBoLCByKSAtPlxuICBpZiAodyA8IDIgKiByKSB0aGVuIHIgPSB3IC8gMlxuICBpZiAoaCA8IDIgKiByKSB0aGVuIHIgPSBoIC8gMlxuICBAYmVnaW5QYXRoKClcbiAgQG1vdmVUbyh4K3IsIHkpXG4gIEBhcmNUbyh4K3csIHksICAgeCt3LCB5K2gsIHIpXG4gIEBhcmNUbyh4K3csIHkraCwgeCwgICB5K2gsIHIpXG4gIEBhcmNUbyh4LCAgIHkraCwgeCwgICB5LCAgIHIpXG4gIEBhcmNUbyh4LCAgIHksICAgeCt3LCB5LCAgIHIpXG4gIEBjbG9zZVBhdGgoKVxuICByZXR1cm4gdGhpc1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcFxuIiwiQ29sb3IgPVxuICBiYWNrZ3JvdW5kOiBcIiMzMzMzMzNcIlxuICBkaWFsOiBcIiMzMzMzMzNcIlxuICBkaWFsSGlnaGxpZ2h0OiBcIiM2NjY2NjZcIlxuICBoZWFsdGg6IFwid2hpdGVcIlxuICBjaGFuZ2luZ0hlYWx0aDogXCJyZWRcIlxuICBhZGRUZXh0OiBcIiMwMGZmMDBcIlxuICBzdWJ0cmFjdFRleHQ6IFwiI2ZmMDAwMFwiXG4gIG1lbnU6IFwiI2ZmZmZmZlwiXG5cblBsYXllckNvbG9ycyA9IFtcbiAgXCIjZmZhYWFhXCJcbiAgXCIjYWFmZmFhXCJcbiAgXCIjYWFhYWZmXCJcbiAgXCIjZmZmZmFhXCJcbiAgXCIjZmZhYWZmXCJcbiAgXCIjYWFmZmZmXCJcbl1cblxuVFdPX1BJID0gTWF0aC5QSSAqIDJcblxuY2xvbmUgPSAob2JqKSAtPlxuICAjIFRPRE86IGZpbmQgc29tZXRoaW5nIGJldHRlcj9cbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSlcblxuY2xhc3MgQ291bnRlclZpZXdcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgSW5pdFxuXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cbiAgICBjb25zb2xlLmxvZyBcImNhbnZhcyBzaXplICN7QGNhbnZhcy53aWR0aH14I3tAY2FudmFzLmhlaWdodH1cIlxuXG4gICAgQENvbG9yID0gQ29sb3JcbiAgICBAUGxheWVyQ29sb3JzID0gUGxheWVyQ29sb3JzXG5cbiAgICAjIGluaXQgZm9udHNcbiAgICBAaGVhbHRoRm9udFBpeGVscyA9IE1hdGguZmxvb3IoQGNhbnZhcy53aWR0aCAqIDAuMzApXG4gICAgaW5jcmVtZW50Rm9udFBpeGVscyA9IE1hdGguZmxvb3IoQGNhbnZhcy53aWR0aCAqIDAuMDUpXG4gICAgbWVudUZvbnRQaXhlbHMgPSBNYXRoLmZsb29yKEBjYW52YXMud2lkdGggKiAwLjA1KVxuICAgIEBmb250cyA9XG4gICAgICBoZWFsdGg6ICAgIEBhcHAucmVnaXN0ZXJGb250KFwiaGVhbHRoXCIsICAgIFwiI3tAaGVhbHRoRm9udFBpeGVsc31weCBJbnN0cnVjdGlvbiwgbW9ub3NwYWNlXCIpXG4gICAgICBpbmNyZW1lbnQ6IEBhcHAucmVnaXN0ZXJGb250KFwiaW5jcmVtZW50XCIsIFwiI3tpbmNyZW1lbnRGb250UGl4ZWxzfXB4IEluc3RydWN0aW9uLCBtb25vc3BhY2VcIilcbiAgICAgIG1lbnU6ICAgICAgQGFwcC5yZWdpc3RlckZvbnQoXCJpbmNyZW1lbnRcIiwgXCIje21lbnVGb250UGl4ZWxzfXB4IEluc3RydWN0aW9uLCBtb25vc3BhY2VcIilcblxuICAgIEBjZW50ZXIgPVxuICAgICAgeDogQGNhbnZhcy53aWR0aCAvIDJcbiAgICAgIHk6IEBjYW52YXMuaGVpZ2h0IC8gMlxuXG4gICAgQHNsaWNlQ291bnQgPSAyMFxuICAgIEBoYWxmU2xpY2VDb3VudCA9IE1hdGguZmxvb3IoQHNsaWNlQ291bnQgLyAyKVxuICAgIEBzbGljZUFuZ2xlID0gVFdPX1BJIC8gQHNsaWNlQ291bnRcbiAgICBAaGFsZlNsaWNlQW5nbGUgPSBAc2xpY2VBbmdsZSAvIDJcblxuICAgIEBkaWFsUmFkaXVzID0gQGNlbnRlci54ICogMC44XG4gICAgQGRpYWxJbmNyZW1lbnRSYWRpdXMgPSBAY2VudGVyLnggKiAwLjdcbiAgICBAbWVudVJhZGl1cyA9IEBjZW50ZXIueCAqIDAuMVxuXG4gICAgQGxheW91dHMgPSBbXVxuXG4gICAgZlJhZGl1czIgPSBAY2VudGVyLnkgKiAwLjZcbiAgICBjUmFkaXVzNiA9IEBjZW50ZXIueCAqIDAuN1xuICAgIGZSYWRpdXM2ID0gQGNlbnRlci54ICogMS4xXG5cbiAgICBAbGF5b3V0cy5wdXNoIHtcbiAgICAgIG5hbWU6IFwiU29sb1wiXG4gICAgICBwbGF5ZXJzOiBbXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCA0LCBmUmFkaXVzMiwgMjApXG4gICAgICBdXG4gICAgfVxuXG4gICAgQGxheW91dHMucHVzaCB7XG4gICAgICBuYW1lOiBcIjJQXCJcbiAgICAgIHBsYXllcnM6IFtcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDQsIGZSYWRpdXMyLCAyMClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDE0LCBmUmFkaXVzMiwgMjApXG4gICAgICBdXG4gICAgfVxuXG4gICAgQGxheW91dHMucHVzaCB7XG4gICAgICBuYW1lOiBcIjNQXCJcbiAgICAgIHBsYXllcnM6IFtcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDQsIGZSYWRpdXMyLCAyMClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDksIGNSYWRpdXM2LCAyMClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMl0sIDE0LCBmUmFkaXVzMiwgMjApXG4gICAgICBdXG4gICAgfVxuXG4gICAgQGxheW91dHMucHVzaCB7XG4gICAgICBuYW1lOiBcIjRQXCJcbiAgICAgIHBsYXllcnM6IFtcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDQsIGZSYWRpdXMyLCAyMClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDksIGNSYWRpdXM2LCAyMClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMl0sIDE0LCBmUmFkaXVzMiwgMjApXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzNdLCAxOSwgY1JhZGl1czYsIDIwKVxuICAgICAgXVxuICAgIH1cblxuICAgIEBsYXlvdXRzLnB1c2gge1xuICAgICAgbmFtZTogXCJTY29yZWJvYXJkIDRQXCJcbiAgICAgIHBsYXllcnM6IFtcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDIsIGNSYWRpdXM2LCAyMCwgTWF0aC5QSSAvIDIpXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzFdLCA2LCBjUmFkaXVzNiwgMjAsIE1hdGguUEkgLyAyKVxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1syXSwgMTIsIGNSYWRpdXM2LCAyMCwgTWF0aC5QSSAvIDIpXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzNdLCAxNiwgY1JhZGl1czYsIDIwLCBNYXRoLlBJIC8gMilcbiAgICAgIF1cbiAgICB9XG5cbiAgICBAbGF5b3V0cy5wdXNoIHtcbiAgICAgIG5hbWU6IFwiMnYyXCJcbiAgICAgIHBsYXllcnM6IFtcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sICAyLCBjUmFkaXVzNiwgMjAsIC1NYXRoLlBJIC8gMilcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sICA2LCBjUmFkaXVzNiwgMjAsICBNYXRoLlBJIC8gMilcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDEyLCBjUmFkaXVzNiwgMjAsICBNYXRoLlBJIC8gMilcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDE2LCBjUmFkaXVzNiwgMjAsIC1NYXRoLlBJIC8gMilcbiAgICAgIF1cbiAgICB9XG5cbiAgICBAbGF5b3V0cy5wdXNoIHtcbiAgICAgIG5hbWU6IFwiNSBQbGF5ZXJcIlxuICAgICAgcGxheWVyczogW1xuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgMiwgZlJhZGl1czYsIDIwKVxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1sxXSwgNiwgZlJhZGl1czYsIDIwKVxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1syXSwgOSwgY1JhZGl1czYsIDIwKVxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1szXSwgMTIsIGZSYWRpdXM2LCAyMClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbNF0sIDE2LCBmUmFkaXVzNiwgMjApXG4gICAgICBdXG4gICAgfVxuXG4gICAgQGxheW91dHMucHVzaCB7XG4gICAgICBuYW1lOiBcIjZQXCJcbiAgICAgIHBsYXllcnM6IFtcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDIsIGZSYWRpdXM2LCAyMClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDYsIGZSYWRpdXM2LCAyMClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMl0sIDksIGNSYWRpdXM2LCAyMClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbM10sIDEyLCBmUmFkaXVzNiwgMjApXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzRdLCAxNiwgZlJhZGl1czYsIDIwKVxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1s1XSwgMTksIGNSYWRpdXM2LCAyMClcbiAgICAgIF1cbiAgICB9XG5cbiAgICBAbGF5b3V0cy5wdXNoIHtcbiAgICAgIG5hbWU6IFwiQ29tbWFuZGVyIDZQXCJcbiAgICAgIHBsYXllcnM6IFtcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMF0sIDIsIGZSYWRpdXM2LCA0MClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDYsIGZSYWRpdXM2LCA0MClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDksIGNSYWRpdXM2LCA0MClcbiAgICAgICAgQHBsYXllckxheW91dChQbGF5ZXJDb2xvcnNbMV0sIDEyLCBmUmFkaXVzNiwgNDApXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoUGxheWVyQ29sb3JzWzBdLCAxNiwgZlJhZGl1czYsIDQwKVxuICAgICAgICBAcGxheWVyTGF5b3V0KFBsYXllckNvbG9yc1swXSwgMTksIGNSYWRpdXM2LCA0MClcbiAgICAgIF1cbiAgICB9XG5cbiAgICBAY2hvb3NlTGF5b3V0KDApXG4gICAgQG9uRHJhZ1Jlc2V0KClcbiAgICBAZHJhdygpXG5cbiAgY2hvb3NlTGF5b3V0OiAobGF5b3V0KSAtPlxuICAgIEBsYXlvdXRJbmRleCA9IGxheW91dFxuICAgIEBwbGF5ZXJzID0gY2xvbmUoQGxheW91dHNbbGF5b3V0XS5wbGF5ZXJzKVxuICAgIHJldHVyblxuXG4gIHJlc2V0QWxsSGVhbHRoOiAtPlxuICAgIEBjaG9vc2VMYXlvdXQoQGxheW91dEluZGV4KVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cbiAgICAjIHJldHVybiBAY291bnRlci5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuXG4gIGV4cG9ydDogLT5cbiAgICByZXR1cm4gXCJcIiAjQGNvdW50ZXIuZXhwb3J0KClcblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBmYWNpbmdPdXRBbmdsZTogKHgsIHkpIC0+XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSAtIEBjZW50ZXIueSwgeCAtIEBjZW50ZXIueCkgLSAoTWF0aC5QSSAvIDIpXG5cbiAgdW5wb2xhcjogKGFuZ2xlLCByLCBvZmZzZXRYID0gMCwgb2Zmc2V0WSA9IDApIC0+XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IG9mZnNldFggKyAoTWF0aC5jb3MoYW5nbGUpICogcilcbiAgICAgIHk6IG9mZnNldFkgKyAoTWF0aC5zaW4oYW5nbGUpICogcilcbiAgICB9XG5cbiAgcG9zVG9TbGljZTogKHgsIHkpIC0+XG4gICAgcG9zQW5nbGUgPSBNYXRoLmF0YW4yKHkgLSBAY2VudGVyLnksIHggLSBAY2VudGVyLngpXG4gICAgaWYgcG9zQW5nbGUgPCAwXG4gICAgICBwb3NBbmdsZSArPSBNYXRoLlBJICogMlxuICAgIGFuZ2xlID0gMFxuICAgIGZvciBzbGljZSBpbiBbMC4uLkBzbGljZUNvdW50XVxuICAgICAgaWYgKHBvc0FuZ2xlID49IGFuZ2xlKSBhbmQgKHBvc0FuZ2xlIDwgKGFuZ2xlICsgQHNsaWNlQW5nbGUpKVxuICAgICAgICByZXR1cm4gc2xpY2VcbiAgICAgIGFuZ2xlICs9IEBzbGljZUFuZ2xlXG4gICAgcmV0dXJuIDBcblxuICBwbGF5ZXJMYXlvdXQ6IChjb2xvciwgc2xpY2UsIHJhZGl1cywgaGVhbHRoLCBhbmdsZSA9IG51bGwpIC0+XG4gICAgYyA9IEB1bnBvbGFyKCgoc2xpY2UgKyAxKSAlIEBzbGljZUNvdW50KSAqIEBzbGljZUFuZ2xlLCByYWRpdXMsIEBjZW50ZXIueCwgQGNlbnRlci55KVxuICAgIGlmIGFuZ2xlID09IG51bGxcbiAgICAgIGFuZ2xlID0gQGZhY2luZ091dEFuZ2xlKGMueCwgYy55KVxuICAgIHBsYXllciA9XG4gICAgICB4OiBjLnhcbiAgICAgIHk6IGMueVxuICAgICAgYW5nbGU6IGFuZ2xlXG4gICAgICBzbGljZTogc2xpY2VcbiAgICAgIGhlYWx0aDogaGVhbHRoXG4gICAgICBjb2xvcjogY29sb3JcbiAgICByZXR1cm4gcGxheWVyXG5cbiAgZGlzdGFuY2U6ICh4MCwgeTAsIHgxLCB5MSkgLT5cbiAgICB4ZCA9IHgxIC0geDBcbiAgICB5ZCA9IHkxIC0geTBcbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ZCp4ZCkgKyAoeWQqeWQpKVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIG9uRHJhZ1BvczogKHgsIHkpIC0+XG4gICAgQGRyYWdnaW5nID0gdHJ1ZVxuXG4gICAgaWYgQGRyYWdTbGljZSA9PSAtMVxuICAgICAgIyBGaWd1cmUgb3V0IHdoaWNoIHBsYXllciB3ZSBzdGFydGVkIG9uXG4gICAgICBjbG9zZXN0SW5kZXggPSAwXG4gICAgICBjbG9zZXN0UG9zaXRpb24gPSBAY2FudmFzLmhlaWdodCAqIDEwMDBcbiAgICAgIGZvciBwbGF5ZXIsIGluZGV4IGluIEBwbGF5ZXJzXG4gICAgICAgIGRpc3QgPSBAZGlzdGFuY2UocGxheWVyLngsIHBsYXllci55LCB4LCB5KVxuICAgICAgICBpZiBjbG9zZXN0UG9zaXRpb24gPiBkaXN0XG4gICAgICAgICAgY2xvc2VzdFBvc2l0aW9uID0gZGlzdFxuICAgICAgICAgIGNsb3Nlc3RJbmRleCA9IGluZGV4XG4gICAgICBAZHJhZ1BsYXllckluZGV4ID0gY2xvc2VzdEluZGV4XG5cbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyBUT0RPOiBkaXN0cmlidXRlIGEgYnVuY2ggb2YgbWF0aCBvdXRcbiAgICAgIEBkcmFnU2xpY2UgPSBAcG9zVG9TbGljZSh4LCB5KVxuXG4gICAgICBAZHJhZ0RlbHRhID0gQGRyYWdTbGljZSAtIEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdLnNsaWNlXG4gICAgICBpZiBAZHJhZ0RlbHRhID4gQGhhbGZTbGljZUNvdW50XG4gICAgICAgIEBkcmFnRGVsdGEgLT0gQHNsaWNlQ291bnRcbiAgICAgIGlmIEBkcmFnRGVsdGEgPCAtQGhhbGZTbGljZUNvdW50XG4gICAgICAgIEBkcmFnRGVsdGEgKz0gQHNsaWNlQ291bnRcbiAgICAgIGNvbnNvbGUubG9nIFwiQGRyYWdEZWx0YSBzdGFydGluZyBhdCAje0BkcmFnRGVsdGF9XCJcbiAgICBlbHNlXG4gICAgICBuZXdEcmFnU2xpY2UgPSBAcG9zVG9TbGljZSh4LCB5KVxuICAgICAgaWYgQGRyYWdTbGljZSAhPSBuZXdEcmFnU2xpY2VcbiAgICAgICAgc2xpY2VPZmZzZXQgPSBuZXdEcmFnU2xpY2UgLSBAZHJhZ1NsaWNlXG4gICAgICAgIGlmIHNsaWNlT2Zmc2V0ID4gQGhhbGZTbGljZUNvdW50XG4gICAgICAgICAgc2xpY2VPZmZzZXQgLT0gQHNsaWNlQ291bnRcbiAgICAgICAgaWYgc2xpY2VPZmZzZXQgPCAtQGhhbGZTbGljZUNvdW50XG4gICAgICAgICAgc2xpY2VPZmZzZXQgKz0gQHNsaWNlQ291bnRcbiAgICAgICAgQGRyYWdEZWx0YSArPSBzbGljZU9mZnNldFxuICAgICAgICBjb25zb2xlLmxvZyBcIkBkcmFnRGVsdGEgbm93IGF0ICN7QGRyYWdEZWx0YX1cIlxuXG4gICAgICAgIEBkcmFnU2xpY2UgPSBuZXdEcmFnU2xpY2VcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBAZHJhZ1ggPSB4XG4gICAgQGRyYWdZID0geVxuICAgICMgQGRyYWdBbmdsZSA9IE1hdGguYXRhbjIoeSAtIEBjZW50ZXIueSwgeCAtIEBjZW50ZXIueClcbiAgICByZXR1cm5cblxuICBvbkRyYWdSZXNldDogLT5cbiAgICBAZHJhZ2dpbmcgPSBmYWxzZVxuICAgIEBkcmFnUGxheWVySW5kZXggPSAtMVxuICAgIEBkcmFnWCA9IC0xXG4gICAgQGRyYWdZID0gLTFcbiAgICBAZHJhZ1NsaWNlID0gLTFcbiAgICBAZHJhZ0RlbHRhID0gMFxuXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XG4gICAgZGlzdGFuY2VGcm9tQ2VudGVyID0gQGRpc3RhbmNlKHgsIHksIEBjZW50ZXIueCwgQGNlbnRlci55KVxuICAgIGlmIGRpc3RhbmNlRnJvbUNlbnRlciA8IEBtZW51UmFkaXVzXG4gICAgICBAYXBwLnN3aXRjaFZpZXcoXCJtZW51XCIpXG4gICAgICByZXR1cm5cblxuICAgICMgY29uc29sZS5sb2cgXCJtb3VzZWRvd24gI3t4fSwgI3t5fVwiXG4gICAgQG9uRHJhZ1Bvcyh4LCB5KVxuICAgIEBkcmF3KClcblxuICBtb3VzZW1vdmU6ICh4LCB5LCBidXR0b25zKSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJtb3VzZWRvd24gI3t4fSwgI3t5fVwiXG4gICAgaWYgYnV0dG9ucyA9PSAxXG4gICAgICBAb25EcmFnUG9zKHgsIHkpXG4gICAgICBAZHJhdygpXG5cbiAgbW91c2V1cDogLT5cbiAgICBpZiBAZHJhZ2dpbmdcbiAgICAgIGRyYWdQbGF5ZXIgPSBAcGxheWVyc1tAZHJhZ1BsYXllckluZGV4XVxuICAgICAgbmV3SGVhbHRoID0gZHJhZ1BsYXllci5oZWFsdGhcbiAgICAgIGlmIEBkcmFnRGVsdGEgPiAxXG4gICAgICAgIG5ld0hlYWx0aCArPSBAZHJhZ0RlbHRhIC0gMVxuICAgICAgZWxzZSBpZiBAZHJhZ0RlbHRhIDwgMFxuICAgICAgICBuZXdIZWFsdGggKz0gQGRyYWdEZWx0YVxuICAgICAgZHJhZ1BsYXllci5oZWFsdGggPSBuZXdIZWFsdGhcblxuICAgIEBvbkRyYWdSZXNldCgpXG4gICAgQGRyYXcoKVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHNsaWNlT2Zmc2V0VG9EZWx0YTogKG9mZnNldCkgLT5cbiAgICBpZiBvZmZzZXQgPT0gMFxuICAgICAgcmV0dXJuIDBcblxuICAgIGlmIG9mZnNldCA8PSBAaGFsZlNsaWNlQ291bnRcbiAgICAgICMgdHJ5aW5nIHRvIGluY3JlbWVudFxuICAgICAgcmV0dXJuIG9mZnNldFxuICAgIGVsc2VcbiAgICAgICMgdHJ5aW5nIHRvIGRlY3JlbWVudFxuICAgICAgcmV0dXJuIC0xICogKEBzbGljZUNvdW50IC0gb2Zmc2V0KVxuXG4gIGRyYXc6IC0+XG4gICAgY29uc29sZS5sb2cgXCJkcmF3KClcIlxuXG4gICAgIyBDbGVhciBzY3JlZW4gdG8gYmxhY2tcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBDb2xvci5iYWNrZ3JvdW5kKVxuICAgICMgQGFwcC5kcmF3UmVjdChAY2VudGVyLngsIEBjZW50ZXIueSwgMSwgMSwgXCJ3aGl0ZVwiLCAxKSAjIGRlYnVnIGNlbnRlciBkb3RcblxuICAgIEBhcHAuc3Ryb2tlQ2lyY2xlKEBjZW50ZXIueCwgQGNlbnRlci55LCBAbWVudVJhZGl1cywgXCJ3aGl0ZVwiLCA0KVxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIk1cIiwgQGNlbnRlci54LCBAY2VudGVyLnksIEBmb250cy5tZW51LCBDb2xvci5tZW51LCAwKVxuXG4gICAgZm9yIHBsYXllciwgaW5kZXggaW4gQHBsYXllcnNcbiAgICAgIGNvbG9yID0gQ29sb3IuaGVhbHRoXG4gICAgICBpZiBAZHJhZ2dpbmcgYW5kIChpbmRleCA9PSBAZHJhZ1BsYXllckluZGV4KVxuICAgICAgICBjb2xvciA9IENvbG9yLmNoYW5naW5nSGVhbHRoXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoICBTdHJpbmcocGxheWVyLmhlYWx0aCksIHBsYXllci54LCBwbGF5ZXIueSwgQGZvbnRzLmhlYWx0aCwgcGxheWVyLmNvbG9yLCBwbGF5ZXIuYW5nbGUpXG4gICAgICBAYXBwLnN0cm9rZVRleHRDZW50ZXJlZChTdHJpbmcocGxheWVyLmhlYWx0aCksIHBsYXllci54LCBwbGF5ZXIueSwgQGZvbnRzLmhlYWx0aCwgXCJ3aGl0ZVwiLCA0LCBwbGF5ZXIuYW5nbGUpXG5cbiAgICBpZiBAZHJhZ2dpbmdcbiAgICAgIGRyYWdQbGF5ZXIgPSBAcGxheWVyc1tAZHJhZ1BsYXllckluZGV4XVxuXG4gICAgICBAYXBwLmRyYXdBcmMoQGNlbnRlci54LCBAY2VudGVyLnksIEBkaWFsUmFkaXVzLCAwLCBUV09fUEksIENvbG9yLmRpYWwpXG5cbiAgICAgIGZvciBpIGluIFswLi4uQGhhbGZTbGljZUNvdW50KzFdXG4gICAgICAgIHNsaWNlID0gKEBkcmFnU2xpY2UgKyBpKSAlIEBzbGljZUNvdW50XG4gICAgICAgIGFuZ2xlID0gc2xpY2UgKiBAc2xpY2VBbmdsZVxuICAgICAgICB2YWx1ZSA9IEBkcmFnRGVsdGEgKyBpXG4gICAgICAgIGlmIHNsaWNlID09IEBkcmFnU2xpY2VcbiAgICAgICAgICBAYXBwLmRyYXdBcmMoQGNlbnRlci54LCBAY2VudGVyLnksIEBkaWFsUmFkaXVzLCBhbmdsZSwgYW5nbGUgKyBAc2xpY2VBbmdsZSwgQ29sb3IuZGlhbEhpZ2hsaWdodClcbiAgICAgICAgaWYgKHZhbHVlICE9IDApIGFuZCAodmFsdWUgIT0gMSlcbiAgICAgICAgICBpZiB2YWx1ZSA+IDBcbiAgICAgICAgICAgIHRleHRWID0gXCIrI3t2YWx1ZSAtIDF9XCJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IENvbG9yLmFkZFRleHRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB0ZXh0ViA9IFwiI3t2YWx1ZX1cIlxuICAgICAgICAgICAgdGV4dENvbG9yID0gQ29sb3Iuc3VidHJhY3RUZXh0XG4gICAgICAgICAgdGV4dFBvcyA9IEB1bnBvbGFyKGFuZ2xlICsgQGhhbGZTbGljZUFuZ2xlLCBAZGlhbEluY3JlbWVudFJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXG4gICAgICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHRleHRWLCB0ZXh0UG9zLngsIHRleHRQb3MueSwgQGZvbnRzLmluY3JlbWVudCwgdGV4dENvbG9yLCBAZmFjaW5nT3V0QW5nbGUodGV4dFBvcy54LCB0ZXh0UG9zLnkpKVxuXG4gICAgICBmb3IgaSBpbiBbMS4uLkBoYWxmU2xpY2VDb3VudF1cbiAgICAgICAgc2xpY2UgPSAoQHNsaWNlQ291bnQgKyBAZHJhZ1NsaWNlIC0gaSkgJSBAc2xpY2VDb3VudFxuICAgICAgICBhbmdsZSA9IHNsaWNlICogQHNsaWNlQW5nbGVcbiAgICAgICAgdmFsdWUgPSBAZHJhZ0RlbHRhIC0gaVxuICAgICAgICBpZiAodmFsdWUgIT0gMCkgYW5kICh2YWx1ZSAhPSAxKVxuICAgICAgICAgIGlmIHZhbHVlID4gMFxuICAgICAgICAgICAgdGV4dFYgPSBcIisje3ZhbHVlIC0gMX1cIlxuICAgICAgICAgICAgdGV4dENvbG9yID0gQ29sb3IuYWRkVGV4dFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRleHRWID0gXCIje3ZhbHVlfVwiXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBDb2xvci5zdWJ0cmFjdFRleHRcbiAgICAgICAgICB0ZXh0UG9zID0gQHVucG9sYXIoYW5nbGUgKyBAaGFsZlNsaWNlQW5nbGUsIEBkaWFsSW5jcmVtZW50UmFkaXVzLCBAY2VudGVyLngsIEBjZW50ZXIueSlcbiAgICAgICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQodGV4dFYsIHRleHRQb3MueCwgdGV4dFBvcy55LCBAZm9udHMuaW5jcmVtZW50LCB0ZXh0Q29sb3IsIEBmYWNpbmdPdXRBbmdsZSh0ZXh0UG9zLngsIHRleHRQb3MueSkpXG5cbiAgICAgIEBhcHAuc3Ryb2tlQ2lyY2xlKEBjZW50ZXIueCwgQGNlbnRlci55LCBAZGlhbFJhZGl1cywgXCJ3aGl0ZVwiLCA0KVxuXG4gICAgICBlc3RpbWF0ZWRIZWFsdGggPSBkcmFnUGxheWVyLmhlYWx0aFxuICAgICAgaWYgQGRyYWdEZWx0YSA+IDFcbiAgICAgICAgZXN0aW1hdGVkSGVhbHRoICs9IEBkcmFnRGVsdGEgLSAxXG4gICAgICBlbHNlIGlmIEBkcmFnRGVsdGEgPCAwXG4gICAgICAgIGVzdGltYXRlZEhlYWx0aCArPSBAZHJhZ0RlbHRhXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoICBlc3RpbWF0ZWRIZWFsdGgsIEBjZW50ZXIueCwgQGNlbnRlci55LCBAZm9udHMuaGVhbHRoLCBkcmFnUGxheWVyLmNvbG9yLCBkcmFnUGxheWVyLmFuZ2xlKVxuICAgICAgQGFwcC5zdHJva2VUZXh0Q2VudGVyZWQoZXN0aW1hdGVkSGVhbHRoLCBAY2VudGVyLngsIEBjZW50ZXIueSwgQGZvbnRzLmhlYWx0aCwgXCJ3aGl0ZVwiLCA0LCBkcmFnUGxheWVyLmFuZ2xlKVxuXG4gICAgcmV0dXJuXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gQ291bnRlclZpZXdcbiIsIkJVVFRPTl9IRUlHSFQgPSAwLjA2XG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcbkJVVFRPTl9TUEFDSU5HID0gMC4wOFxuQlVUVE9OX1NFUEFSQVRPUiA9IDAuMDNcblxuYnV0dG9uUG9zID0gKGluZGV4KSAtPlxuICB5ID0gRklSU1RfQlVUVE9OX1kgKyAoQlVUVE9OX1NQQUNJTkcgKiBpbmRleClcbiAgaWYgaW5kZXggPiAzXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXG4gIGlmIGluZGV4ID4gNFxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxuICBpZiBpbmRleCA+IDZcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcbiAgcmV0dXJuIHlcblxuY2xhc3MgTGF5b3V0Vmlld1xuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMsIEBjb3VudGVyKSAtPlxuICAgIEBidXR0b25zID1cbiAgICAgIGNhbmNlbDpcbiAgICAgICAgeTogYnV0dG9uUG9zKDcpXG4gICAgICAgIHRleHQ6IFwiQ2FuY2VsXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3Nzc3XCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQGNhbmNlbC5iaW5kKHRoaXMpXG5cbiAgICAjIG1ha2VzIGZvciBhIEBzY2FsZSB4IEBzY2FsZSBibG9jayBvZiBjaG9pY2VzXG4gICAgQHNjYWxlID0gNVxuXG4gICAgQG5hbWVGb250UGl4ZWxzID0gQGNvdW50ZXIuaGVhbHRoRm9udFBpeGVscyAvIEBzY2FsZSAvIDNcbiAgICBAZm9udHMgPVxuICAgICAgaGVhbHRoOiBAYXBwLnJlZ2lzdGVyRm9udChcImhlYWx0aFwiLCBcIiN7QGNvdW50ZXIuaGVhbHRoRm9udFBpeGVscyAvIEBzY2FsZX1weCBJbnN0cnVjdGlvbiwgbW9ub3NwYWNlXCIpXG4gICAgICBuYW1lOiAgIEBhcHAucmVnaXN0ZXJGb250KFwibmFtZVwiLCAgIFwiI3tAbmFtZUZvbnRQaXhlbHN9cHggSW5zdHJ1Y3Rpb24sIG1vbm9zcGFjZVwiKVxuXG4gICAgYnV0dG9uV2lkdGggPSBAY2FudmFzLndpZHRoICogMC44XG4gICAgQGJ1dHRvbkhlaWdodCA9IEBjYW52YXMuaGVpZ2h0ICogQlVUVE9OX0hFSUdIVFxuICAgIGJ1dHRvblggPSAoQGNhbnZhcy53aWR0aCAtIGJ1dHRvbldpZHRoKSAvIDJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXG4gICAgICBidXR0b24ueCA9IGJ1dHRvblhcbiAgICAgIGJ1dHRvbi55ID0gQGNhbnZhcy5oZWlnaHQgKiBidXR0b24ueVxuICAgICAgYnV0dG9uLncgPSBidXR0b25XaWR0aFxuICAgICAgYnV0dG9uLmggPSBAYnV0dG9uSGVpZ2h0XG5cbiAgICBidXR0b25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAYnV0dG9uSGVpZ2h0ICogMC40KVxuICAgIEBidXR0b25Gb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje2J1dHRvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG4gICAgdGl0bGVGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMSlcbiAgICBAdGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3RpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICByZXR1cm5cblxuICBkcmF3TGF5b3V0OiAobGF5b3V0LCBveCwgb3kpIC0+XG4gICAgY29uc29sZS5sb2cgXCJkcmF3aW5nIGxheW91dFwiLCBsYXlvdXRcbiAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChveCwgb3ksIEBjYW52YXMud2lkdGggLyBAc2NhbGUsIEBjYW52YXMuaGVpZ2h0IC8gQHNjYWxlLCAwLCBAY291bnRlci5Db2xvci5iYWNrZ3JvdW5kLCBcImJsYWNrXCIpXG4gICAgZm9yIHBsYXllciBpbiBsYXlvdXQucGxheWVyc1xuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHBsYXllci5oZWFsdGgsIG94ICsgKHBsYXllci54IC8gQHNjYWxlKSwgb3kgKyAocGxheWVyLnkgLyBAc2NhbGUpLCBAZm9udHMuaGVhbHRoLCBwbGF5ZXIuY29sb3IsIHBsYXllci5hbmdsZSlcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQobGF5b3V0Lm5hbWUsIG94ICsgKEBjYW52YXMud2lkdGggLyBAc2NhbGUgLyAyKSwgb3kgKyBAbmFtZUZvbnRQaXhlbHMsIEBmb250cy5uYW1lLCBcIndoaXRlXCIsIDApXG5cbiAgZHJhdzogLT5cbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiMzMzAwMDBcIilcblxuICAgIGZvciBsYXlvdXQsIGkgaW4gQGNvdW50ZXIubGF5b3V0c1xuICAgICAgeCA9IChpICUgQHNjYWxlKSAqIEBjYW52YXMud2lkdGggLyBAc2NhbGVcbiAgICAgIHkgPSBNYXRoLmZsb29yKGkgLyBAc2NhbGUpICogQGNhbnZhcy5oZWlnaHQgLyBAc2NhbGVcbiAgICAgIEBkcmF3TGF5b3V0KGxheW91dCwgeCwgeSlcblxuICAgIHNoYWRvd09mZnNldCA9IEBjYW52YXMuaGVpZ2h0ICogMC4wMVxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54ICsgc2hhZG93T2Zmc2V0LCBidXR0b24ueSArIHNoYWRvd09mZnNldCwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgXCJibGFja1wiLCBcImJsYWNrXCIpXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCwgYnV0dG9uLnksIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIGJ1dHRvbi5iZ0NvbG9yLCBcIiM5OTk5OTlcIilcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLncgLyAyKSwgYnV0dG9uLnkgKyAoYnV0dG9uLmggLyAyKSwgQGJ1dHRvbkZvbnQsIGJ1dHRvbi50ZXh0Q29sb3IpXG5cbiAgICAjIEBhcHAuZHJhd1ZlcnNpb24oKVxuXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgaWYgKHkgPiBidXR0b24ueSkgJiYgKHkgPCAoYnV0dG9uLnkgKyBAYnV0dG9uSGVpZ2h0KSlcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImJ1dHRvbiBwcmVzc2VkOiAje2J1dHRvbk5hbWV9XCJcbiAgICAgICAgYnV0dG9uLmNsaWNrKClcbiAgICAgICAgcmV0dXJuXG5cbiAgICBjb25zb2xlLmxvZyBcIiN7eH0sICN7eX1cIlxuICAgIGxheW91dEluZGV4ID0gTWF0aC5mbG9vcih4IC8gKEBjYW52YXMud2lkdGggLyBAc2NhbGUpKSArIE1hdGguZmxvb3IoQHNjYWxlICogTWF0aC5mbG9vcih5IC8gKEBjYW52YXMuaGVpZ2h0IC8gQHNjYWxlKSkpXG4gICAgaWYgKGxheW91dEluZGV4ID49IDApIGFuZCAobGF5b3V0SW5kZXggPCBAY291bnRlci5sYXlvdXRzLmxlbmd0aClcbiAgICAgIGxheW91dCA9IEBjb3VudGVyLmxheW91dHNbbGF5b3V0SW5kZXhdXG4gICAgICBpZihjb25maXJtKFwiUmVzZXQgdG8gdGhlICcje2xheW91dC5uYW1lfScgbGF5b3V0P1wiKSlcbiAgICAgICAgQGNvdW50ZXIuY2hvb3NlTGF5b3V0KGxheW91dEluZGV4KVxuICAgICAgICBAYXBwLnN3aXRjaFZpZXcoXCJjb3VudGVyXCIpXG4gICAgcmV0dXJuXG5cbiAgbW91c2Vtb3ZlOiAoeCwgeSwgYnV0dG9ucykgLT5cbiAgbW91c2V1cDogLT5cblxuICBjYW5jZWw6IC0+XG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwibWVudVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dFZpZXdcbiIsIkJVVFRPTl9IRUlHSFQgPSAwLjA2XG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcbkJVVFRPTl9TUEFDSU5HID0gMC4wOFxuQlVUVE9OX1NFUEFSQVRPUiA9IDAuMDNcblxuYnV0dG9uUG9zID0gKGluZGV4KSAtPlxuICB5ID0gRklSU1RfQlVUVE9OX1kgKyAoQlVUVE9OX1NQQUNJTkcgKiBpbmRleClcbiAgaWYgaW5kZXggPiAzXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXG4gIGlmIGluZGV4ID4gNFxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxuICBpZiBpbmRleCA+IDZcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcbiAgcmV0dXJuIHlcblxuY2xhc3MgTWVudVZpZXdcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxuICAgIEBidXR0b25zID1cbiAgICAgIGNob29zZUxheW91dDpcbiAgICAgICAgeTogYnV0dG9uUG9zKDEpXG4gICAgICAgIHRleHQ6IFwiQ2hvb3NlIExheW91dFwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzU1NTU1NVwiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEBjaG9vc2VMYXlvdXQuYmluZCh0aGlzKVxuICAgICAgcmVzZXRBbGxIZWFsdGg6XG4gICAgICAgIHk6IGJ1dHRvblBvcygyKVxuICAgICAgICB0ZXh0OiBcIlJlc2V0IEFsbCBIZWFsdGhcIlxuICAgICAgICBiZ0NvbG9yOiBcIiM1NTU1NTVcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAcmVzZXRBbGxIZWFsdGguYmluZCh0aGlzKVxuICAgICAgcmVzdW1lOlxuICAgICAgICB5OiBidXR0b25Qb3MoNylcbiAgICAgICAgdGV4dDogXCJSZXN1bWVcIlxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3NzdcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAcmVzdW1lLmJpbmQodGhpcylcblxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxuICAgIEBidXR0b25IZWlnaHQgPSBAY2FudmFzLmhlaWdodCAqIEJVVFRPTl9IRUlHSFRcbiAgICBidXR0b25YID0gKEBjYW52YXMud2lkdGggLSBidXR0b25XaWR0aCkgLyAyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgYnV0dG9uLnggPSBidXR0b25YXG4gICAgICBidXR0b24ueSA9IEBjYW52YXMuaGVpZ2h0ICogYnV0dG9uLnlcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcbiAgICAgIGJ1dHRvbi5oID0gQGJ1dHRvbkhlaWdodFxuXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcbiAgICBAYnV0dG9uRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tidXR0b25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuICAgIHRpdGxlRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjEpXG4gICAgQHRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3t0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG4gICAgcmV0dXJuXG5cbiAgZHJhdzogLT5cbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiMzMzMzMzNcIilcblxuICAgIHggPSBAY2FudmFzLndpZHRoIC8gMlxuICAgIHNoYWRvd09mZnNldCA9IEBjYW52YXMuaGVpZ2h0ICogMC4wMVxuXG4gICAgeTEgPSBAY2FudmFzLmhlaWdodCAqIDAuMDVcbiAgICB5MiA9IEBjYW52YXMuaGVpZ2h0ICogMC4xNVxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIk1UR1wiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiTVRHXCIsIHgsIHkyLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcblxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54ICsgc2hhZG93T2Zmc2V0LCBidXR0b24ueSArIHNoYWRvd09mZnNldCwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgXCJibGFja1wiLCBcImJsYWNrXCIpXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCwgYnV0dG9uLnksIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIGJ1dHRvbi5iZ0NvbG9yLCBcIiM5OTk5OTlcIilcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLncgLyAyKSwgYnV0dG9uLnkgKyAoYnV0dG9uLmggLyAyKSwgQGJ1dHRvbkZvbnQsIGJ1dHRvbi50ZXh0Q29sb3IpXG5cbiAgICBAYXBwLmRyYXdWZXJzaW9uKClcblxuICBtb3VzZWRvd246ICh4LCB5KSAtPlxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcbiAgICAgIGlmICh5ID4gYnV0dG9uLnkpICYmICh5IDwgKGJ1dHRvbi55ICsgQGJ1dHRvbkhlaWdodCkpXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJidXR0b24gcHJlc3NlZDogI3tidXR0b25OYW1lfVwiXG4gICAgICAgIGJ1dHRvbi5jbGljaygpXG4gICAgcmV0dXJuXG5cbiAgbW91c2Vtb3ZlOiAoeCwgeSwgYnV0dG9ucykgLT5cbiAgbW91c2V1cDogLT5cblxuICBjaG9vc2VMYXlvdXQ6IC0+XG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwibGF5b3V0XCIpXG5cbiAgcmVzZXRBbGxIZWFsdGg6IC0+XG4gICAgaWYoY29uZmlybShcIlJlc2V0IGFsbCBoZWFsdGg/XCIpKVxuICAgICAgQGFwcC5yZXNldEFsbEhlYWx0aCgpXG5cbiAgcmVzdW1lOiAtPlxuICAgIEBhcHAuc3dpdGNoVmlldyhcImNvdW50ZXJcIilcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51Vmlld1xuIiwiQXBwID0gcmVxdWlyZSAnLi9BcHAnXG5cbmluaXQgPSAtPlxuICBjb25zb2xlLmxvZyBcImluaXRcIlxuICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxuICBjYW52YXMuaGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShjYW52YXMsIGRvY3VtZW50LmJvZHkuY2hpbGROb2Rlc1swXSlcbiAgY2FudmFzUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gIHdpbmRvdy5hcHAgPSBuZXcgQXBwKGNhbnZhcylcblxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcInRvdWNoc3RhcnRcIiwgKGUpIC0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XG4gICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcbiAgICB3aW5kb3cuYXBwLm1vdXNlZG93bih4LCB5KVxuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2htb3ZlXCIsIChlKSAtPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxuICAgIHkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXG4gICAgd2luZG93LmFwcC5tb3VzZW1vdmUoeCwgeSwgMSlcblxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcInRvdWNoZW5kXCIsIChlKSAtPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHdpbmRvdy5hcHAubW91c2V1cCgpXG5cbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZWRvd25cIiwgKGUpIC0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgeCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxuICAgIHkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxuICAgIHdpbmRvdy5hcHAubW91c2Vkb3duKHgsIHkpXG5cbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZW1vdmVcIiwgKGUpIC0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgeCA9IGUuY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxuICAgIHkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxuICAgIGJ1dHRvbnMgPSBlLmJ1dHRvbnNcbiAgICB3aW5kb3cuYXBwLm1vdXNlbW92ZSh4LCB5LCBidXR0b25zKVxuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2V1cFwiLCAoZSkgLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB3aW5kb3cuYXBwLm1vdXNldXAoKVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSAtPlxuICAgIGluaXQoKVxuLCBmYWxzZSlcbiIsIm1vZHVsZS5leHBvcnRzID0gXCIwLjAuMVwiIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjAuMTMgLSDCqSBCcmFtIFN0ZWluLiBMaWNlbnNlOiBCU0QtMy1DbGF1c2UgKi8oZnVuY3Rpb24oKXtmdW5jdGlvbiBsKGEsYil7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9hLmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIixiLCExKTphLmF0dGFjaEV2ZW50KFwic2Nyb2xsXCIsYil9ZnVuY3Rpb24gbShhKXtkb2N1bWVudC5ib2R5P2EoKTpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZnVuY3Rpb24gYygpe2RvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYyk7YSgpfSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbiBrKCl7aWYoXCJpbnRlcmFjdGl2ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlfHxcImNvbXBsZXRlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGUpZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixrKSxhKCl9KX07ZnVuY3Rpb24gcihhKXt0aGlzLmE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0aGlzLmEuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIixcInRydWVcIik7dGhpcy5hLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpKTt0aGlzLmI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5jPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuaD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmY9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5nPS0xO3RoaXMuYi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5jLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjtcbnRoaXMuZi5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7dGhpcy5oLnN0eWxlLmNzc1RleHQ9XCJkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDoyMDAlO2hlaWdodDoyMDAlO2ZvbnQtc2l6ZToxNnB4O21heC13aWR0aDpub25lO1wiO3RoaXMuYi5hcHBlbmRDaGlsZCh0aGlzLmgpO3RoaXMuYy5hcHBlbmRDaGlsZCh0aGlzLmYpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmIpO3RoaXMuYS5hcHBlbmRDaGlsZCh0aGlzLmMpfVxuZnVuY3Rpb24gdChhLGIpe2EuYS5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7bWluLXdpZHRoOjIwcHg7bWluLWhlaWdodDoyMHB4O2Rpc3BsYXk6aW5saW5lLWJsb2NrO292ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjphYnNvbHV0ZTt3aWR0aDphdXRvO21hcmdpbjowO3BhZGRpbmc6MDt0b3A6LTk5OXB4O3doaXRlLXNwYWNlOm5vd3JhcDtmb250LXN5bnRoZXNpczpub25lO2ZvbnQ6XCIrYitcIjtcIn1mdW5jdGlvbiB5KGEpe3ZhciBiPWEuYS5vZmZzZXRXaWR0aCxjPWIrMTAwO2EuZi5zdHlsZS53aWR0aD1jK1wicHhcIjthLmMuc2Nyb2xsTGVmdD1jO2EuYi5zY3JvbGxMZWZ0PWEuYi5zY3JvbGxXaWR0aCsxMDA7cmV0dXJuIGEuZyE9PWI/KGEuZz1iLCEwKTohMX1mdW5jdGlvbiB6KGEsYil7ZnVuY3Rpb24gYygpe3ZhciBhPWs7eShhKSYmYS5hLnBhcmVudE5vZGUmJmIoYS5nKX12YXIgaz1hO2woYS5iLGMpO2woYS5jLGMpO3koYSl9O2Z1bmN0aW9uIEEoYSxiKXt2YXIgYz1ifHx7fTt0aGlzLmZhbWlseT1hO3RoaXMuc3R5bGU9Yy5zdHlsZXx8XCJub3JtYWxcIjt0aGlzLndlaWdodD1jLndlaWdodHx8XCJub3JtYWxcIjt0aGlzLnN0cmV0Y2g9Yy5zdHJldGNofHxcIm5vcm1hbFwifXZhciBCPW51bGwsQz1udWxsLEU9bnVsbCxGPW51bGw7ZnVuY3Rpb24gRygpe2lmKG51bGw9PT1DKWlmKEooKSYmL0FwcGxlLy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudmVuZG9yKSl7dmFyIGE9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO0M9ISFhJiY2MDM+cGFyc2VJbnQoYVsxXSwxMCl9ZWxzZSBDPSExO3JldHVybiBDfWZ1bmN0aW9uIEooKXtudWxsPT09RiYmKEY9ISFkb2N1bWVudC5mb250cyk7cmV0dXJuIEZ9XG5mdW5jdGlvbiBLKCl7aWYobnVsbD09PUUpe3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dHJ5e2Euc3R5bGUuZm9udD1cImNvbmRlbnNlZCAxMDBweCBzYW5zLXNlcmlmXCJ9Y2F0Y2goYil7fUU9XCJcIiE9PWEuc3R5bGUuZm9udH1yZXR1cm4gRX1mdW5jdGlvbiBMKGEsYil7cmV0dXJuW2Euc3R5bGUsYS53ZWlnaHQsSygpP2Euc3RyZXRjaDpcIlwiLFwiMTAwcHhcIixiXS5qb2luKFwiIFwiKX1cbkEucHJvdG90eXBlLmxvYWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGs9YXx8XCJCRVNic3d5XCIscT0wLEQ9Ynx8M0UzLEg9KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7aWYoSigpJiYhRygpKXt2YXIgTT1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGUoKXsobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EP2IoKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGZ1bmN0aW9uKCl7YigpfSl9ZSgpfSksTj1uZXcgUHJvbWlzZShmdW5jdGlvbihhLGMpe3E9c2V0VGltZW91dChjLEQpfSk7UHJvbWlzZS5yYWNlKFtOLE1dKS50aGVuKGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHEpO2EoYyl9LGZ1bmN0aW9uKCl7YihjKX0pfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHUoKXt2YXIgYjtpZihiPS0xIT1cbmYmJi0xIT1nfHwtMSE9ZiYmLTEhPWh8fC0xIT1nJiYtMSE9aCkoYj1mIT1nJiZmIT1oJiZnIT1oKXx8KG51bGw9PT1CJiYoYj0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCksQj0hIWImJig1MzY+cGFyc2VJbnQoYlsxXSwxMCl8fDUzNj09PXBhcnNlSW50KGJbMV0sMTApJiYxMT49cGFyc2VJbnQoYlsyXSwxMCkpKSxiPUImJihmPT12JiZnPT12JiZoPT12fHxmPT13JiZnPT13JiZoPT13fHxmPT14JiZnPT14JiZoPT14KSksYj0hYjtiJiYoZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksY2xlYXJUaW1lb3V0KHEpLGEoYykpfWZ1bmN0aW9uIEkoKXtpZigobmV3IERhdGUpLmdldFRpbWUoKS1IPj1EKWQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGIoYyk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLFxuZz1uLmEub2Zmc2V0V2lkdGgsaD1wLmEub2Zmc2V0V2lkdGgsdSgpO3E9c2V0VGltZW91dChJLDUwKX19dmFyIGU9bmV3IHIoayksbj1uZXcgcihrKSxwPW5ldyByKGspLGY9LTEsZz0tMSxoPS0xLHY9LTEsdz0tMSx4PS0xLGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtkLmRpcj1cImx0clwiO3QoZSxMKGMsXCJzYW5zLXNlcmlmXCIpKTt0KG4sTChjLFwic2VyaWZcIikpO3QocCxMKGMsXCJtb25vc3BhY2VcIikpO2QuYXBwZW5kQ2hpbGQoZS5hKTtkLmFwcGVuZENoaWxkKG4uYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZCk7dj1lLmEub2Zmc2V0V2lkdGg7dz1uLmEub2Zmc2V0V2lkdGg7eD1wLmEub2Zmc2V0V2lkdGg7SSgpO3ooZSxmdW5jdGlvbihhKXtmPWE7dSgpfSk7dChlLEwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO3oobixmdW5jdGlvbihhKXtnPWE7dSgpfSk7dChuLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtcbnoocCxmdW5jdGlvbihhKXtoPWE7dSgpfSk7dChwLEwoYywnXCInK2MuZmFtaWx5KydcIixtb25vc3BhY2UnKSl9KX0pfTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1BOih3aW5kb3cuRm9udEZhY2VPYnNlcnZlcj1BLHdpbmRvdy5Gb250RmFjZU9ic2VydmVyLnByb3RvdHlwZS5sb2FkPUEucHJvdG90eXBlLmxvYWQpO30oKSk7XG4iXX0=
