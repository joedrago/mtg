(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App, CounterView, FontFaceObserver, MenuView, version;

FontFaceObserver = require('fontfaceobserver');

MenuView = require('./MenuView');

CounterView = require('./CounterView');

version = require('./version');

App = (function() {
  function App(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.loadFont("saxMono");
    this.fonts = {};
    this.versionFontHeight = Math.floor(this.canvas.height * 0.02);
    this.versionFont = this.registerFont("version", this.versionFontHeight + "px saxMono, monospace");
    this.generatingFontHeight = Math.floor(this.canvas.height * 0.04);
    this.generatingFont = this.registerFont("generating", this.generatingFontHeight + "px saxMono, monospace");
    this.views = {
      menu: new MenuView(this, this.canvas),
      counter: new CounterView(this, this.canvas)
    };
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


},{"./CounterView":2,"./MenuView":3,"./version":6,"fontfaceobserver":7}],2:[function(require,module,exports){
var Color, CounterView, TWO_PI, clone;

Color = {
  health: "white",
  changingHealth: "red",
  centeredHealth: "white"
};

TWO_PI = Math.PI * 2;

clone = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

CounterView = (function() {
  function CounterView(app, canvas) {
    var healthFontPixels, incrementFontPixels, xstep6, ystep6;
    this.app = app;
    this.canvas = canvas;
    console.log("canvas size " + this.canvas.width + "x" + this.canvas.height);
    healthFontPixels = Math.floor(this.canvas.width * 0.35);
    incrementFontPixels = Math.floor(this.canvas.width * 0.05);
    this.fonts = {
      health: this.app.registerFont("health", healthFontPixels + "px saxMono, monospace"),
      increment: this.app.registerFont("increment", incrementFontPixels + "px saxMono, monospace")
    };
    this.center = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    };
    this.sliceCount = 20;
    this.halfSliceCount = Math.floor(this.sliceCount / 2);
    this.dialRadius = this.center.x * 0.7;
    this.dialIncrementRadius = this.center.x * 0.6;
    this.layouts = [];
    xstep6 = this.center.x / 2;
    ystep6 = this.center.y / 3;
    this.layouts.push({
      players: [this.playerLayout(2, xstep6 * 3, ystep6 * 5), this.playerLayout(5, xstep6, ystep6 * 5), this.playerLayout(9, xstep6, ystep6 * 3), this.playerLayout(12, xstep6, ystep6), this.playerLayout(15, xstep6 * 3, ystep6), this.playerLayout(19, xstep6 * 3, ystep6 * 3)]
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
    var angle, j, posAngle, ref, slice, sliceAngle;
    posAngle = Math.atan2(y - this.center.y, x - this.center.x);
    if (posAngle < 0) {
      posAngle += Math.PI * 2;
    }
    sliceAngle = TWO_PI / this.sliceCount;
    angle = 0;
    for (slice = j = 0, ref = this.sliceCount; 0 <= ref ? j < ref : j > ref; slice = 0 <= ref ? ++j : --j) {
      if ((posAngle >= angle) && (posAngle < (angle + sliceAngle))) {
        return slice;
      }
      angle += sliceAngle;
    }
    return 0;
  };

  CounterView.prototype.playerLayout = function(slice, x, y) {
    var player;
    player = {
      x: x,
      y: y,
      angle: this.facingOutAngle(x, y),
      slice: slice,
      health: 20
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
    dragPlayer = this.players[this.dragPlayerIndex];
    newHealth = dragPlayer.health;
    if (this.dragDelta > 1) {
      newHealth += this.dragDelta - 1;
    } else if (this.dragDelta < 0) {
      newHealth += this.dragDelta;
    }
    dragPlayer.health = newHealth;
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
    var angle, color, dragPlayer, estimatedHealth, halfSliceAngle, i, index, j, k, l, len, player, ref, ref1, ref2, slice, sliceAngle, textColor, textPos, textV, value;
    console.log("draw()");
    this.app.drawFill(0, 0, this.canvas.width, this.canvas.height, "black");
    ref = this.players;
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      player = ref[index];
      color = Color.health;
      if (this.dragging && (index === this.dragPlayerIndex)) {
        color = Color.changingHealth;
      }
      this.app.drawTextCentered(String(player.health), player.x, player.y, this.fonts.health, color, player.angle);
    }
    if (this.dragging) {
      dragPlayer = this.players[this.dragPlayerIndex];
      sliceAngle = TWO_PI / this.sliceCount;
      halfSliceAngle = sliceAngle / 2;
      this.app.drawArc(this.center.x, this.center.y, this.dialRadius, 0, TWO_PI, "#333333");
      for (i = k = 0, ref1 = this.halfSliceCount + 1; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        slice = (this.dragSlice + i) % this.sliceCount;
        angle = slice * sliceAngle;
        value = this.dragDelta + i;
        if (slice === this.dragSlice) {
          this.app.drawArc(this.center.x, this.center.y, this.dialRadius, angle, angle + sliceAngle, "#555555");
        }
        if ((value !== 0) && (value !== 1)) {
          if (value > 0) {
            textV = "+" + (value - 1);
            textColor = "#aaffaa";
          } else {
            textV = "" + value;
            textColor = "#ffaaaa";
          }
          textPos = this.unpolar(angle + halfSliceAngle, this.dialIncrementRadius, this.center.x, this.center.y);
          this.app.drawTextCentered(textV, textPos.x, textPos.y, this.fonts.increment, textColor, this.facingOutAngle(textPos.x, textPos.y));
        }
      }
      for (i = l = 1, ref2 = this.halfSliceCount; 1 <= ref2 ? l < ref2 : l > ref2; i = 1 <= ref2 ? ++l : --l) {
        slice = (this.sliceCount + this.dragSlice - i) % this.sliceCount;
        angle = slice * sliceAngle;
        value = this.dragDelta - i;
        if ((value !== 0) && (value !== 1)) {
          if (value > 0) {
            textV = "+" + (value - 1);
            textColor = "#aaffaa";
          } else {
            textV = "" + value;
            textColor = "#ffaaaa";
          }
          textPos = this.unpolar(angle + halfSliceAngle, this.dialIncrementRadius, this.center.x, this.center.y);
          this.app.drawTextCentered(textV, textPos.x, textPos.y, this.fonts.increment, textColor, this.facingOutAngle(textPos.x, textPos.y));
        }
      }
      estimatedHealth = dragPlayer.health;
      if (this.dragDelta > 1) {
        estimatedHealth += this.dragDelta - 1;
      } else if (this.dragDelta < 0) {
        estimatedHealth += this.dragDelta;
      }
      this.app.drawTextCentered(String(estimatedHealth), this.center.x, this.center.y, this.fonts.health, Color.centeredHealth, dragPlayer.angle);
    }
  };

  return CounterView;

})();

module.exports = CounterView;


},{}],3:[function(require,module,exports){
var BUTTON_HEIGHT, BUTTON_SEPARATOR, BUTTON_SPACING, FIRST_BUTTON_Y, MenuView, SudokuGenerator, buttonPos;

SudokuGenerator = require('./SudokuGenerator');

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
      newEasy: {
        y: buttonPos(0),
        text: "New Game: Easy",
        bgColor: "#337733",
        textColor: "#ffffff",
        click: this.newEasy.bind(this)
      },
      newMedium: {
        y: buttonPos(1),
        text: "New Game: Medium",
        bgColor: "#777733",
        textColor: "#ffffff",
        click: this.newMedium.bind(this)
      },
      newHard: {
        y: buttonPos(2),
        text: "New Game: Hard",
        bgColor: "#773333",
        textColor: "#ffffff",
        click: this.newHard.bind(this)
      },
      newExtreme: {
        y: buttonPos(3),
        text: "New Game: Extreme",
        bgColor: "#771111",
        textColor: "#ffffff",
        click: this.newExtreme.bind(this)
      },
      reset: {
        y: buttonPos(4),
        text: "Reset Puzzle",
        bgColor: "#773377",
        textColor: "#ffffff",
        click: this.reset.bind(this)
      },
      "import": {
        y: buttonPos(5),
        text: "Load Puzzle",
        bgColor: "#336666",
        textColor: "#ffffff",
        click: this["import"].bind(this)
      },
      "export": {
        y: buttonPos(6),
        text: "Share Puzzle",
        bgColor: "#336666",
        textColor: "#ffffff",
        click: this["export"].bind(this)
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
    this.app.drawTextCentered("Bad Guy", x + shadowOffset, y1 + shadowOffset, this.titleFont, "#000000");
    this.app.drawTextCentered("Sudoku", x + shadowOffset, y2 + shadowOffset, this.titleFont, "#000000");
    this.app.drawTextCentered("Bad Guy", x, y1, this.titleFont, "#ffffff");
    this.app.drawTextCentered("Sudoku", x, y2, this.titleFont, "#ffffff");
    ref = this.buttons;
    for (buttonName in ref) {
      button = ref[buttonName];
      this.app.drawRoundedRect(button.x + shadowOffset, button.y + shadowOffset, button.w, button.h, button.h * 0.3, "black", "black");
      this.app.drawRoundedRect(button.x, button.y, button.w, button.h, button.h * 0.3, button.bgColor, "#999999");
      this.app.drawTextCentered(button.text, button.x + (button.w / 2), button.y + (button.h / 2), this.buttonFont, button.textColor);
    }
    this.app.drawLowerLeft((this.app.holeCount()) + "/81");
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

  MenuView.prototype.mouseup = function(x, y) {};

  MenuView.prototype.newEasy = function() {
    return this.app.newGame(SudokuGenerator.difficulty.easy);
  };

  MenuView.prototype.newMedium = function() {
    return this.app.newGame(SudokuGenerator.difficulty.medium);
  };

  MenuView.prototype.newHard = function() {
    return this.app.newGame(SudokuGenerator.difficulty.hard);
  };

  MenuView.prototype.newExtreme = function() {
    return this.app.newGame(SudokuGenerator.difficulty.extreme);
  };

  MenuView.prototype.reset = function() {
    return this.app.reset();
  };

  MenuView.prototype.resume = function() {
    return this.app.switchView("sudoku");
  };

  MenuView.prototype["export"] = function() {
    if (navigator.share !== void 0) {
      navigator.share({
        title: "Sudoku Shared Game",
        text: this.app["export"]()
      });
      return;
    }
    return window.prompt("Copy this and paste to a friend:", this.app["export"]());
  };

  MenuView.prototype["import"] = function() {
    var importString;
    importString = window.prompt("Paste an exported game here:", "");
    if (importString === null) {
      return;
    }
    if (this.app["import"](importString)) {
      return this.app.switchView("sudoku");
    }
  };

  return MenuView;

})();

module.exports = MenuView;


},{"./SudokuGenerator":4}],4:[function(require,module,exports){
var Board, SudokuGenerator, shuffle;

shuffle = function(a) {
  var i, j, t;
  i = a.length;
  while (--i > 0) {
    j = ~~(Math.random() * (i + 1));
    t = a[j];
    a[j] = a[i];
    a[i] = t;
  }
  return a;
};

Board = (function() {
  function Board(otherBoard) {
    var i, j, k, l, m;
    if (otherBoard == null) {
      otherBoard = null;
    }
    this.grid = new Array(9).fill(null);
    this.locked = new Array(9).fill(null);
    for (i = k = 0; k < 9; i = ++k) {
      this.grid[i] = new Array(9).fill(0);
      this.locked[i] = new Array(9).fill(false);
    }
    if (otherBoard !== null) {
      for (j = l = 0; l < 9; j = ++l) {
        for (i = m = 0; m < 9; i = ++m) {
          this.grid[i][j] = otherBoard.grid[i][j];
          this.locked[i][j] = otherBoard.locked[i][j];
        }
      }
    }
    return;
  }

  Board.prototype.matches = function(otherBoard) {
    var i, j, k, l;
    for (j = k = 0; k < 9; j = ++k) {
      for (i = l = 0; l < 9; i = ++l) {
        if (this.grid[i][j] !== otherBoard.grid[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  return Board;

})();

SudokuGenerator = (function() {
  SudokuGenerator.difficulty = {
    easy: 1,
    medium: 2,
    hard: 3,
    extreme: 4
  };

  function SudokuGenerator() {}

  SudokuGenerator.prototype.boardToGrid = function(board) {
    var i, j, k, l, m, newBoard;
    newBoard = new Array(9).fill(null);
    for (i = k = 0; k < 9; i = ++k) {
      newBoard[i] = new Array(9).fill(0);
    }
    for (j = l = 0; l < 9; j = ++l) {
      for (i = m = 0; m < 9; i = ++m) {
        if (board.locked[i][j]) {
          newBoard[i][j] = board.grid[i][j];
        }
      }
    }
    return newBoard;
  };

  SudokuGenerator.prototype.cellValid = function(board, x, y, v) {
    var i, j, k, l, m, sx, sy;
    for (i = k = 0; k < 9; i = ++k) {
      if ((x !== i) && (board.grid[i][y] === v)) {
        return false;
      }
      if ((y !== i) && (board.grid[x][i] === v)) {
        return false;
      }
    }
    sx = Math.floor(x / 3) * 3;
    sy = Math.floor(y / 3) * 3;
    for (j = l = 0; l < 3; j = ++l) {
      for (i = m = 0; m < 3; i = ++m) {
        if ((x !== (sx + i)) && (y !== (sy + j))) {
          if (board.grid[sx + i][sy + j] === v) {
            return false;
          }
        }
      }
    }
    return true;
  };

  SudokuGenerator.prototype.pencilMarks = function(board, x, y) {
    var k, marks, v;
    marks = [];
    for (v = k = 1; k <= 9; v = ++k) {
      if (this.cellValid(board, x, y, v)) {
        marks.push(v);
      }
    }
    if (marks.length > 1) {
      shuffle(marks);
    }
    return marks;
  };

  SudokuGenerator.prototype.solve = function(board) {
    var direction, i, k, pencil, solved, walkIndex, x, y;
    solved = new Board(board);
    pencil = new Array(9).fill(null);
    for (i = k = 0; k < 9; i = ++k) {
      pencil[i] = new Array(9).fill(null);
    }
    walkIndex = 0;
    direction = 1;
    while (walkIndex < 81) {
      x = walkIndex % 9;
      y = Math.floor(walkIndex / 9);
      if (!solved.locked[x][y]) {
        if ((direction === 1) && ((pencil[x][y] === null) || (pencil[x][y].length === 0))) {
          pencil[x][y] = this.pencilMarks(solved, x, y);
        }
        if (pencil[x][y].length === 0) {
          solved.grid[x][y] = 0;
          direction = -1;
        } else {
          solved.grid[x][y] = pencil[x][y].pop();
          direction = 1;
        }
      }
      walkIndex += direction;
      if (walkIndex < 0) {
        return null;
      }
    }
    return solved;
  };

  SudokuGenerator.prototype.hasUniqueSolution = function(board) {
    var firstSolve, k, nextSolve, unicityTests;
    firstSolve = this.solve(board);
    for (unicityTests = k = 0; k < 6; unicityTests = ++k) {
      nextSolve = this.solve(board);
      if (!firstSolve.matches(nextSolve)) {
        return false;
      }
    }
    return true;
  };

  SudokuGenerator.prototype.generateInternal = function(amountToRemove) {
    var board, i, indexesToRemove, j, k, l, m, nextBoard, removeIndex, removed, results, rx, ry;
    board = this.solve(new Board());
    for (j = k = 0; k < 9; j = ++k) {
      for (i = l = 0; l < 9; i = ++l) {
        board.locked[i][j] = true;
      }
    }
    indexesToRemove = shuffle((function() {
      results = [];
      for (m = 0; m < 81; m++){ results.push(m); }
      return results;
    }).apply(this));
    removed = 0;
    while (removed < amountToRemove) {
      if (indexesToRemove.length === 0) {
        break;
      }
      removeIndex = indexesToRemove.pop();
      rx = removeIndex % 9;
      ry = Math.floor(removeIndex / 9);
      nextBoard = new Board(board);
      nextBoard.grid[rx][ry] = 0;
      nextBoard.locked[rx][ry] = false;
      if (this.hasUniqueSolution(nextBoard)) {
        board = nextBoard;
        removed += 1;
      } else {

      }
    }
    return {
      board: board,
      removed: removed
    };
  };

  SudokuGenerator.prototype.generate = function(difficulty) {
    var amountToRemove, attempt, best, generated, k;
    amountToRemove = (function() {
      switch (difficulty) {
        case SudokuGenerator.difficulty.extreme:
          return 60;
        case SudokuGenerator.difficulty.hard:
          return 52;
        case SudokuGenerator.difficulty.medium:
          return 46;
        default:
          return 40;
      }
    })();
    best = null;
    for (attempt = k = 0; k < 2; attempt = ++k) {
      generated = this.generateInternal(amountToRemove);
      if (generated.removed === amountToRemove) {
        console.log("Removed exact amount " + amountToRemove + ", stopping");
        best = generated;
        break;
      }
      if (best === null) {
        best = generated;
      } else if (best.removed < generated.removed) {
        best = generated;
      }
      console.log("current best " + best.removed + " / " + amountToRemove);
    }
    console.log("giving user board: " + best.removed + " / " + amountToRemove);
    return this.boardToGrid(best.board);
  };

  return SudokuGenerator;

})();

module.exports = SudokuGenerator;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXENvdW50ZXJWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcTWVudVZpZXcuY29mZmVlIiwiZ2FtZVxcc3JjXFxTdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZVxcc3JjXFxtYWluLmNvZmZlZSIsImdhbWVcXHNyY1xcdmVyc2lvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvZm9udGZhY2VvYnNlcnZlci9mb250ZmFjZW9ic2VydmVyLnN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQkFBUjs7QUFFbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUjs7QUFDZCxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0FBRUo7RUFDUyxhQUFDLE1BQUQ7SUFBQyxJQUFDLENBQUEsU0FBRDtJQUNaLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVULElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUNyQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQUE0QixJQUFDLENBQUEsaUJBQUYsR0FBb0IsdUJBQS9DO0lBRWYsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQTVCO0lBQ3hCLElBQUMsQ0FBQSxjQUFE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O0lBQ0EsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO0lBQzNCLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztXQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7RUFKbUMsQ0FBckM7RUFNQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsV0FBeEIsRUFBcUMsU0FBQyxDQUFEO0FBQ25DLFFBQUE7SUFBQSxDQUFDLENBQUMsY0FBRixDQUFBO0lBQ0EsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO0lBQzNCLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixHQUFZLFVBQVUsQ0FBQztJQUMzQixPQUFBLEdBQVUsQ0FBQyxDQUFDO1dBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFYLENBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLE9BQTNCO0VBTG1DLENBQXJDO1NBT0EsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFNBQUMsQ0FBRDtJQUNqQyxDQUFDLENBQUMsY0FBRixDQUFBO1dBQ0EsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFYLENBQUE7RUFGaUMsQ0FBbkM7QUF2Q0s7O0FBMkNQLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxTQUFDLENBQUQ7U0FDNUIsSUFBQSxDQUFBO0FBRDRCLENBQWhDLEVBRUUsS0FGRjs7OztBQzdDQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ0FqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiRm9udEZhY2VPYnNlcnZlciA9IHJlcXVpcmUgJ2ZvbnRmYWNlb2JzZXJ2ZXInXHJcblxyXG5NZW51VmlldyA9IHJlcXVpcmUgJy4vTWVudVZpZXcnXHJcbkNvdW50ZXJWaWV3ID0gcmVxdWlyZSAnLi9Db3VudGVyVmlldydcclxudmVyc2lvbiA9IHJlcXVpcmUgJy4vdmVyc2lvbidcclxuXHJcbmNsYXNzIEFwcFxyXG4gIGNvbnN0cnVjdG9yOiAoQGNhbnZhcykgLT5cclxuICAgIEBjdHggPSBAY2FudmFzLmdldENvbnRleHQoXCIyZFwiKVxyXG4gICAgQGxvYWRGb250KFwic2F4TW9ub1wiKVxyXG4gICAgQGZvbnRzID0ge31cclxuXHJcbiAgICBAdmVyc2lvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wMilcclxuICAgIEB2ZXJzaW9uRm9udCA9IEByZWdpc3RlckZvbnQoXCJ2ZXJzaW9uXCIsIFwiI3tAdmVyc2lvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQGdlbmVyYXRpbmdGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMDQpXHJcbiAgICBAZ2VuZXJhdGluZ0ZvbnQgPSBAcmVnaXN0ZXJGb250KFwiZ2VuZXJhdGluZ1wiLCBcIiN7QGdlbmVyYXRpbmdGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEB2aWV3cyA9XHJcbiAgICAgIG1lbnU6IG5ldyBNZW51Vmlldyh0aGlzLCBAY2FudmFzKVxyXG4gICAgICBjb3VudGVyOiBuZXcgQ291bnRlclZpZXcodGhpcywgQGNhbnZhcylcclxuICAgIEBzd2l0Y2hWaWV3KFwiY291bnRlclwiKVxyXG5cclxuICBtZWFzdXJlRm9udHM6IC0+XHJcbiAgICBmb3IgZm9udE5hbWUsIGYgb2YgQGZvbnRzXHJcbiAgICAgIEBjdHguZm9udCA9IGYuc3R5bGVcclxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcclxuICAgICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICAgIGYuaGVpZ2h0ID0gTWF0aC5mbG9vcihAY3R4Lm1lYXN1cmVUZXh0KFwibVwiKS53aWR0aCAqIDEuMSkgIyBiZXN0IGhhY2sgZXZlclxyXG4gICAgICBjb25zb2xlLmxvZyBcIkZvbnQgI3tmb250TmFtZX0gbWVhc3VyZWQgYXQgI3tmLmhlaWdodH0gcGl4ZWxzXCJcclxuICAgIHJldHVyblxyXG5cclxuICByZWdpc3RlckZvbnQ6IChuYW1lLCBzdHlsZSkgLT5cclxuICAgIGZvbnQgPVxyXG4gICAgICBuYW1lOiBuYW1lXHJcbiAgICAgIHN0eWxlOiBzdHlsZVxyXG4gICAgICBoZWlnaHQ6IDBcclxuICAgIEBmb250c1tuYW1lXSA9IGZvbnRcclxuICAgIEBtZWFzdXJlRm9udHMoKVxyXG4gICAgcmV0dXJuIGZvbnRcclxuXHJcbiAgbG9hZEZvbnQ6IChmb250TmFtZSkgLT5cclxuICAgIGZvbnQgPSBuZXcgRm9udEZhY2VPYnNlcnZlcihmb250TmFtZSlcclxuICAgIGZvbnQubG9hZCgpLnRoZW4gPT5cclxuICAgICAgY29uc29sZS5sb2coXCIje2ZvbnROYW1lfSBsb2FkZWQsIHJlZHJhd2luZy4uLlwiKVxyXG4gICAgICBAbWVhc3VyZUZvbnRzKClcclxuICAgICAgQGRyYXcoKVxyXG5cclxuICBzd2l0Y2hWaWV3OiAodmlldykgLT5cclxuICAgIEB2aWV3ID0gQHZpZXdzW3ZpZXddXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcImFwcC5uZXdHYW1lKCN7ZGlmZmljdWx0eX0pXCJcclxuXHJcbiAgICAjIEBkcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjNDQ0NDQ0XCIpXHJcbiAgICAjIEBkcmF3VGV4dENlbnRlcmVkKFwiR2VuZXJhdGluZywgcGxlYXNlIHdhaXQuLi5cIiwgQGNhbnZhcy53aWR0aCAvIDIsIEBjYW52YXMuaGVpZ2h0IC8gMiwgQGdlbmVyYXRpbmdGb250LCBcIiNmZmZmZmZcIilcclxuXHJcbiAgICAjIHdpbmRvdy5zZXRUaW1lb3V0ID0+XHJcbiAgICAjIEB2aWV3cy5zdWRva3UubmV3R2FtZShkaWZmaWN1bHR5KVxyXG4gICAgIyBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG4gICAgIyAsIDBcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICAjIEB2aWV3cy5zdWRva3UucmVzZXQoKVxyXG4gICAgIyBAc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICAjIHJldHVybiBAdmlld3Muc3Vkb2t1LmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgICMgcmV0dXJuIEB2aWV3cy5zdWRva3UuZXhwb3J0KClcclxuXHJcbiAgaG9sZUNvdW50OiAtPlxyXG4gICAgIyByZXR1cm4gQHZpZXdzLnN1ZG9rdS5ob2xlQ291bnQoKVxyXG5cclxuICBkcmF3OiAtPlxyXG4gICAgQHZpZXcuZHJhdygpXHJcblxyXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XHJcbiAgICBAdmlldy5tb3VzZWRvd24oeCwgeSlcclxuXHJcbiAgbW91c2Vtb3ZlOiAoeCwgeSwgYnV0dG9ucykgLT5cclxuICAgIEB2aWV3Lm1vdXNlbW92ZSh4LCB5LCBidXR0b25zKVxyXG5cclxuICBtb3VzZXVwOiAoeCwgeSkgLT5cclxuICAgIEB2aWV3Lm1vdXNldXAoeCwgeSlcclxuXHJcbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5maWxsKClcclxuXHJcbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxyXG4gICAgQGN0eC5yb3VuZFJlY3QoeCwgeSwgdywgaCwgcilcclxuICAgIGlmIGZpbGxDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXHJcbiAgICAgIEBjdHguZmlsbCgpXHJcbiAgICBpZiBzdHJva2VDb2xvciAhPSBudWxsXHJcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxyXG4gICAgICBAY3R4LnN0cm9rZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhd1JlY3Q6ICh4LCB5LCB3LCBoLCBjb2xvciwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgucmVjdCh4LCB5LCB3LCBoKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3TGluZTogKHgxLCB5MSwgeDIsIHkyLCBjb2xvciA9IFwiYmxhY2tcIiwgbGluZVdpZHRoID0gMSkgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGhcclxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcclxuICAgIEBjdHgubGluZVRvKHgyLCB5MilcclxuICAgIEBjdHguc3Ryb2tlKClcclxuXHJcbiAgZHJhd0FyYzogKHgsIHksIHIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBjb2xvcikgLT5cclxuICAgIEBjdHguYmVnaW5QYXRoKClcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgubW92ZVRvKHgsIHkpXHJcbiAgICBAY3R4LmFyYyh4LCB5LCByLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSlcclxuICAgIEBjdHguY2xvc2VQYXRoKClcclxuICAgIEBjdHguZmlsbCgpXHJcblxyXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yLCByb3QpIC0+XHJcbiAgICBAY3R4LnNhdmUoKVxyXG4gICAgQGN0eC50cmFuc2xhdGUoY3gsIGN5KVxyXG4gICAgQGN0eC5yb3RhdGUocm90KVxyXG4gICAgQGN0eC5mb250ID0gZm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KHRleHQsIDAsIChmb250LmhlaWdodCAvIDIpKVxyXG4gICAgQGN0eC5yZXN0b3JlKClcclxuXHJcbiAgZHJhd0xvd2VyTGVmdDogKHRleHQsIGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJsZWZ0XCJcclxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgMCwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuICBkcmF3VmVyc2lvbjogKGNvbG9yID0gXCJ3aGl0ZVwiKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcclxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiXHJcbiAgICBAY3R4LmZpbGxUZXh0KFwidiN7dmVyc2lvbn1cIiwgQGNhbnZhcy53aWR0aCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMiksIEBjYW52YXMuaGVpZ2h0IC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSlcclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUucm91bmRSZWN0ID0gKHgsIHksIHcsIGgsIHIpIC0+XHJcbiAgaWYgKHcgPCAyICogcikgdGhlbiByID0gdyAvIDJcclxuICBpZiAoaCA8IDIgKiByKSB0aGVuIHIgPSBoIC8gMlxyXG4gIEBiZWdpblBhdGgoKVxyXG4gIEBtb3ZlVG8oeCtyLCB5KVxyXG4gIEBhcmNUbyh4K3csIHksICAgeCt3LCB5K2gsIHIpXHJcbiAgQGFyY1RvKHgrdywgeStoLCB4LCAgIHkraCwgcilcclxuICBAYXJjVG8oeCwgICB5K2gsIHgsICAgeSwgICByKVxyXG4gIEBhcmNUbyh4LCAgIHksICAgeCt3LCB5LCAgIHIpXHJcbiAgQGNsb3NlUGF0aCgpXHJcbiAgcmV0dXJuIHRoaXNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXBwXHJcbiIsIkNvbG9yID1cclxuICBoZWFsdGg6IFwid2hpdGVcIlxyXG4gIGNoYW5naW5nSGVhbHRoOiBcInJlZFwiXHJcbiAgY2VudGVyZWRIZWFsdGg6IFwid2hpdGVcIlxyXG5cclxuVFdPX1BJID0gTWF0aC5QSSAqIDJcclxuXHJcbmNsb25lID0gKG9iaikgLT5cclxuICAjIFRPRE86IGZpbmQgc29tZXRoaW5nIGJldHRlcj9cclxuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKVxyXG5cclxuY2xhc3MgQ291bnRlclZpZXdcclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAjIEluaXRcclxuXHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJjYW52YXMgc2l6ZSAje0BjYW52YXMud2lkdGh9eCN7QGNhbnZhcy5oZWlnaHR9XCJcclxuXHJcbiAgICAjIGluaXQgZm9udHNcclxuICAgIGhlYWx0aEZvbnRQaXhlbHMgPSBNYXRoLmZsb29yKEBjYW52YXMud2lkdGggKiAwLjM1KVxyXG4gICAgaW5jcmVtZW50Rm9udFBpeGVscyA9IE1hdGguZmxvb3IoQGNhbnZhcy53aWR0aCAqIDAuMDUpXHJcbiAgICBAZm9udHMgPVxyXG4gICAgICBoZWFsdGg6ICAgIEBhcHAucmVnaXN0ZXJGb250KFwiaGVhbHRoXCIsICAgIFwiI3toZWFsdGhGb250UGl4ZWxzfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgICBpbmNyZW1lbnQ6IEBhcHAucmVnaXN0ZXJGb250KFwiaW5jcmVtZW50XCIsIFwiI3tpbmNyZW1lbnRGb250UGl4ZWxzfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG5cclxuICAgIEBjZW50ZXIgPVxyXG4gICAgICB4OiBAY2FudmFzLndpZHRoIC8gMlxyXG4gICAgICB5OiBAY2FudmFzLmhlaWdodCAvIDJcclxuXHJcbiAgICBAc2xpY2VDb3VudCA9IDIwXHJcbiAgICBAaGFsZlNsaWNlQ291bnQgPSBNYXRoLmZsb29yKEBzbGljZUNvdW50IC8gMilcclxuXHJcbiAgICBAZGlhbFJhZGl1cyA9IEBjZW50ZXIueCAqIDAuN1xyXG4gICAgQGRpYWxJbmNyZW1lbnRSYWRpdXMgPSBAY2VudGVyLnggKiAwLjZcclxuXHJcbiAgICBAbGF5b3V0cyA9IFtdXHJcblxyXG4gICAgIyA2IHBsYXllcnNcclxuICAgIHhzdGVwNiA9IEBjZW50ZXIueCAvIDJcclxuICAgIHlzdGVwNiA9IEBjZW50ZXIueSAvIDNcclxuICAgIEBsYXlvdXRzLnB1c2gge1xyXG4gICAgICBwbGF5ZXJzOiBbXHJcbiAgICAgICAgQHBsYXllckxheW91dCgyLCAgeHN0ZXA2ICogMywgeXN0ZXA2ICogNSlcclxuICAgICAgICBAcGxheWVyTGF5b3V0KDUsICB4c3RlcDYsICAgICB5c3RlcDYgKiA1KVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoOSwgIHhzdGVwNiwgICAgIHlzdGVwNiAqIDMpXHJcbiAgICAgICAgQHBsYXllckxheW91dCgxMiwgeHN0ZXA2LCAgICAgeXN0ZXA2ICAgIClcclxuICAgICAgICBAcGxheWVyTGF5b3V0KDE1LCB4c3RlcDYgKiAzLCB5c3RlcDYgICAgKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoMTksIHhzdGVwNiAqIDMsIHlzdGVwNiAqIDMpXHJcblxyXG4gICAgICAgICMgQHBsYXllckxheW91dCgyLCAgeHN0ZXA2ICogMywgeXN0ZXA2ICogNSlcclxuICAgICAgICAjIEBwbGF5ZXJMYXlvdXQoNCwgIHhzdGVwNiwgICAgIHlzdGVwNiAqIDUpXHJcbiAgICAgICAgIyBAcGxheWVyTGF5b3V0KDcsICB4c3RlcDYsICAgICB5c3RlcDYgKiAzKVxyXG4gICAgICAgICMgQHBsYXllckxheW91dCgxMCwgeHN0ZXA2LCAgICAgeXN0ZXA2ICAgIClcclxuICAgICAgICAjIEBwbGF5ZXJMYXlvdXQoMTIsIHhzdGVwNiAqIDMsIHlzdGVwNiAgICApXHJcbiAgICAgICAgIyBAcGxheWVyTGF5b3V0KDE1LCB4c3RlcDYgKiAzLCB5c3RlcDYgKiAzKVxyXG4gICAgICBdXHJcbiAgICB9XHJcblxyXG4gICAgQGNob29zZUxheW91dCgwKVxyXG4gICAgQG9uRHJhZ1Jlc2V0KClcclxuICAgIEBkcmF3KClcclxuXHJcbiAgY2hvb3NlTGF5b3V0OiAobGF5b3V0KSAtPlxyXG4gICAgQHBsYXllcnMgPSBjbG9uZShAbGF5b3V0c1tsYXlvdXRdLnBsYXllcnMpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cclxuICAgICMgcmV0dXJuIEBjb3VudGVyLmltcG9ydChpbXBvcnRTdHJpbmcpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIHJldHVybiBcIlwiICNAY291bnRlci5leHBvcnQoKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgZmFjaW5nT3V0QW5nbGU6ICh4LCB5KSAtPlxyXG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSAtIEBjZW50ZXIueSwgeCAtIEBjZW50ZXIueCkgLSAoTWF0aC5QSSAvIDIpXHJcblxyXG4gIHVucG9sYXI6IChhbmdsZSwgciwgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwKSAtPlxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogb2Zmc2V0WCArIChNYXRoLmNvcyhhbmdsZSkgKiByKVxyXG4gICAgICB5OiBvZmZzZXRZICsgKE1hdGguc2luKGFuZ2xlKSAqIHIpXHJcbiAgICB9XHJcblxyXG4gIHBvc1RvU2xpY2U6ICh4LCB5KSAtPlxyXG4gICAgcG9zQW5nbGUgPSBNYXRoLmF0YW4yKHkgLSBAY2VudGVyLnksIHggLSBAY2VudGVyLngpXHJcbiAgICBpZiBwb3NBbmdsZSA8IDBcclxuICAgICAgcG9zQW5nbGUgKz0gTWF0aC5QSSAqIDJcclxuICAgIHNsaWNlQW5nbGUgPSBUV09fUEkgLyBAc2xpY2VDb3VudFxyXG4gICAgYW5nbGUgPSAwXHJcbiAgICBmb3Igc2xpY2UgaW4gWzAuLi5Ac2xpY2VDb3VudF1cclxuICAgICAgaWYgKHBvc0FuZ2xlID49IGFuZ2xlKSBhbmQgKHBvc0FuZ2xlIDwgKGFuZ2xlICsgc2xpY2VBbmdsZSkpXHJcbiAgICAgICAgcmV0dXJuIHNsaWNlXHJcbiAgICAgIGFuZ2xlICs9IHNsaWNlQW5nbGVcclxuICAgIHJldHVybiAwXHJcblxyXG4gIHBsYXllckxheW91dDogKHNsaWNlLCB4LCB5KSAtPlxyXG4gICAgcGxheWVyID1cclxuICAgICAgeDogeFxyXG4gICAgICB5OiB5XHJcbiAgICAgIGFuZ2xlOiBAZmFjaW5nT3V0QW5nbGUoeCwgeSlcclxuICAgICAgc2xpY2U6IHNsaWNlXHJcbiAgICAgIGhlYWx0aDogMjBcclxuICAgIHJldHVybiBwbGF5ZXJcclxuXHJcbiAgZGlzdGFuY2U6ICh4MCwgeTAsIHgxLCB5MSkgLT5cclxuICAgIHhkID0geDEgLSB4MFxyXG4gICAgeWQgPSB5MSAtIHkwXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ZCp4ZCkgKyAoeWQqeWQpKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgb25EcmFnUG9zOiAoeCwgeSkgLT5cclxuICAgIEBkcmFnZ2luZyA9IHRydWVcclxuXHJcbiAgICBpZiBAZHJhZ1NsaWNlID09IC0xXHJcbiAgICAgICMgRmlndXJlIG91dCB3aGljaCBwbGF5ZXIgd2Ugc3RhcnRlZCBvblxyXG4gICAgICBjbG9zZXN0SW5kZXggPSAwXHJcbiAgICAgIGNsb3Nlc3RQb3NpdGlvbiA9IEBjYW52YXMuaGVpZ2h0ICogMTAwMFxyXG4gICAgICBmb3IgcGxheWVyLCBpbmRleCBpbiBAcGxheWVyc1xyXG4gICAgICAgIGRpc3QgPSBAZGlzdGFuY2UocGxheWVyLngsIHBsYXllci55LCB4LCB5KVxyXG4gICAgICAgIGlmIGNsb3Nlc3RQb3NpdGlvbiA+IGRpc3RcclxuICAgICAgICAgIGNsb3Nlc3RQb3NpdGlvbiA9IGRpc3RcclxuICAgICAgICAgIGNsb3Nlc3RJbmRleCA9IGluZGV4XHJcbiAgICAgIEBkcmFnUGxheWVySW5kZXggPSBjbG9zZXN0SW5kZXhcclxuXHJcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAjIFRPRE86IGRpc3RyaWJ1dGUgYSBidW5jaCBvZiBtYXRoIG91dFxyXG4gICAgICBAZHJhZ1NsaWNlID0gQHBvc1RvU2xpY2UoeCwgeSlcclxuXHJcbiAgICAgIEBkcmFnRGVsdGEgPSBAZHJhZ1NsaWNlIC0gQHBsYXllcnNbQGRyYWdQbGF5ZXJJbmRleF0uc2xpY2VcclxuICAgICAgaWYgQGRyYWdEZWx0YSA+IEBoYWxmU2xpY2VDb3VudFxyXG4gICAgICAgIEBkcmFnRGVsdGEgLT0gQHNsaWNlQ291bnRcclxuICAgICAgaWYgQGRyYWdEZWx0YSA8IC1AaGFsZlNsaWNlQ291bnRcclxuICAgICAgICBAZHJhZ0RlbHRhICs9IEBzbGljZUNvdW50XHJcbiAgICAgIGNvbnNvbGUubG9nIFwiQGRyYWdEZWx0YSBzdGFydGluZyBhdCAje0BkcmFnRGVsdGF9XCJcclxuICAgIGVsc2VcclxuICAgICAgbmV3RHJhZ1NsaWNlID0gQHBvc1RvU2xpY2UoeCwgeSlcclxuICAgICAgaWYgQGRyYWdTbGljZSAhPSBuZXdEcmFnU2xpY2VcclxuICAgICAgICBzbGljZU9mZnNldCA9IG5ld0RyYWdTbGljZSAtIEBkcmFnU2xpY2VcclxuICAgICAgICBpZiBzbGljZU9mZnNldCA+IEBoYWxmU2xpY2VDb3VudFxyXG4gICAgICAgICAgc2xpY2VPZmZzZXQgLT0gQHNsaWNlQ291bnRcclxuICAgICAgICBpZiBzbGljZU9mZnNldCA8IC1AaGFsZlNsaWNlQ291bnRcclxuICAgICAgICAgIHNsaWNlT2Zmc2V0ICs9IEBzbGljZUNvdW50XHJcbiAgICAgICAgQGRyYWdEZWx0YSArPSBzbGljZU9mZnNldFxyXG4gICAgICAgIGNvbnNvbGUubG9nIFwiQGRyYWdEZWx0YSBub3cgYXQgI3tAZHJhZ0RlbHRhfVwiXHJcblxyXG4gICAgICAgIEBkcmFnU2xpY2UgPSBuZXdEcmFnU2xpY2VcclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBAZHJhZ1ggPSB4XHJcbiAgICBAZHJhZ1kgPSB5XHJcbiAgICAjIEBkcmFnQW5nbGUgPSBNYXRoLmF0YW4yKHkgLSBAY2VudGVyLnksIHggLSBAY2VudGVyLngpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgb25EcmFnUmVzZXQ6IC0+XHJcbiAgICBAZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgQGRyYWdQbGF5ZXJJbmRleCA9IC0xXHJcbiAgICBAZHJhZ1ggPSAtMVxyXG4gICAgQGRyYWdZID0gLTFcclxuICAgIEBkcmFnU2xpY2UgPSAtMVxyXG4gICAgQGRyYWdEZWx0YSA9IDBcclxuXHJcbiAgbW91c2Vkb3duOiAoeCwgeSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJtb3VzZWRvd24gI3t4fSwgI3t5fVwiXHJcbiAgICBAb25EcmFnUG9zKHgsIHkpXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIG1vdXNlbW92ZTogKHgsIHksIGJ1dHRvbnMpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwibW91c2Vkb3duICN7eH0sICN7eX1cIlxyXG4gICAgaWYgYnV0dG9ucyA9PSAxXHJcbiAgICAgIEBvbkRyYWdQb3MoeCwgeSlcclxuICAgICAgQGRyYXcoKVxyXG5cclxuICBtb3VzZXVwOiAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcIm1vdXNldXAgI3t4fSwgI3t5fVwiXHJcblxyXG4gICAgZHJhZ1BsYXllciA9IEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdXHJcbiAgICBuZXdIZWFsdGggPSBkcmFnUGxheWVyLmhlYWx0aFxyXG4gICAgaWYgQGRyYWdEZWx0YSA+IDFcclxuICAgICAgbmV3SGVhbHRoICs9IEBkcmFnRGVsdGEgLSAxXHJcbiAgICBlbHNlIGlmIEBkcmFnRGVsdGEgPCAwXHJcbiAgICAgIG5ld0hlYWx0aCArPSBAZHJhZ0RlbHRhXHJcbiAgICBkcmFnUGxheWVyLmhlYWx0aCA9IG5ld0hlYWx0aFxyXG5cclxuICAgIEBvbkRyYWdSZXNldCgpXHJcbiAgICBAZHJhdygpXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBzbGljZU9mZnNldFRvRGVsdGE6IChvZmZzZXQpIC0+XHJcbiAgICBpZiBvZmZzZXQgPT0gMFxyXG4gICAgICByZXR1cm4gMFxyXG5cclxuICAgIGlmIG9mZnNldCA8PSBAaGFsZlNsaWNlQ291bnRcclxuICAgICAgIyB0cnlpbmcgdG8gaW5jcmVtZW50XHJcbiAgICAgIHJldHVybiBvZmZzZXRcclxuICAgIGVsc2VcclxuICAgICAgIyB0cnlpbmcgdG8gZGVjcmVtZW50XHJcbiAgICAgIHJldHVybiAtMSAqIChAc2xpY2VDb3VudCAtIG9mZnNldClcclxuXHJcbiAgZHJhdzogLT5cclxuICAgIGNvbnNvbGUubG9nIFwiZHJhdygpXCJcclxuXHJcbiAgICAjIENsZWFyIHNjcmVlbiB0byBibGFja1xyXG4gICAgQGFwcC5kcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCJibGFja1wiKVxyXG4gICAgIyBAYXBwLmRyYXdSZWN0KEBjZW50ZXIueCwgQGNlbnRlci55LCAxLCAxLCBcIndoaXRlXCIsIDEpICMgZGVidWcgY2VudGVyIGRvdFxyXG5cclxuICAgIGZvciBwbGF5ZXIsIGluZGV4IGluIEBwbGF5ZXJzXHJcbiAgICAgIGNvbG9yID0gQ29sb3IuaGVhbHRoXHJcbiAgICAgIGlmIEBkcmFnZ2luZyBhbmQgKGluZGV4ID09IEBkcmFnUGxheWVySW5kZXgpXHJcbiAgICAgICAgY29sb3IgPSBDb2xvci5jaGFuZ2luZ0hlYWx0aFxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoU3RyaW5nKHBsYXllci5oZWFsdGgpLCBwbGF5ZXIueCwgcGxheWVyLnksIEBmb250cy5oZWFsdGgsIGNvbG9yLCBwbGF5ZXIuYW5nbGUpXHJcblxyXG4gICAgaWYgQGRyYWdnaW5nXHJcbiAgICAgIGRyYWdQbGF5ZXIgPSBAcGxheWVyc1tAZHJhZ1BsYXllckluZGV4XVxyXG4gICAgICBzbGljZUFuZ2xlID0gVFdPX1BJIC8gQHNsaWNlQ291bnRcclxuICAgICAgaGFsZlNsaWNlQW5nbGUgPSBzbGljZUFuZ2xlIC8gMlxyXG5cclxuICAgICAgQGFwcC5kcmF3QXJjKEBjZW50ZXIueCwgQGNlbnRlci55LCBAZGlhbFJhZGl1cywgMCwgVFdPX1BJLCBcIiMzMzMzMzNcIilcclxuXHJcbiAgICAgIGZvciBpIGluIFswLi4uQGhhbGZTbGljZUNvdW50KzFdXHJcbiAgICAgICAgc2xpY2UgPSAoQGRyYWdTbGljZSArIGkpICUgQHNsaWNlQ291bnRcclxuICAgICAgICBhbmdsZSA9IHNsaWNlICogc2xpY2VBbmdsZVxyXG4gICAgICAgIHZhbHVlID0gQGRyYWdEZWx0YSArIGlcclxuICAgICAgICBpZiBzbGljZSA9PSBAZHJhZ1NsaWNlXHJcbiAgICAgICAgICBAYXBwLmRyYXdBcmMoQGNlbnRlci54LCBAY2VudGVyLnksIEBkaWFsUmFkaXVzLCBhbmdsZSwgYW5nbGUgKyBzbGljZUFuZ2xlLCBcIiM1NTU1NTVcIilcclxuICAgICAgICBpZiAodmFsdWUgIT0gMCkgYW5kICh2YWx1ZSAhPSAxKVxyXG4gICAgICAgICAgaWYgdmFsdWUgPiAwXHJcbiAgICAgICAgICAgIHRleHRWID0gXCIrI3t2YWx1ZSAtIDF9XCJcclxuICAgICAgICAgICAgdGV4dENvbG9yID0gXCIjYWFmZmFhXCJcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGV4dFYgPSBcIiN7dmFsdWV9XCJcclxuICAgICAgICAgICAgdGV4dENvbG9yID0gXCIjZmZhYWFhXCJcclxuICAgICAgICAgIHRleHRQb3MgPSBAdW5wb2xhcihhbmdsZSArIGhhbGZTbGljZUFuZ2xlLCBAZGlhbEluY3JlbWVudFJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXHJcbiAgICAgICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQodGV4dFYsIHRleHRQb3MueCwgdGV4dFBvcy55LCBAZm9udHMuaW5jcmVtZW50LCB0ZXh0Q29sb3IsIEBmYWNpbmdPdXRBbmdsZSh0ZXh0UG9zLngsIHRleHRQb3MueSkpXHJcblxyXG4gICAgICBmb3IgaSBpbiBbMS4uLkBoYWxmU2xpY2VDb3VudF1cclxuICAgICAgICBzbGljZSA9IChAc2xpY2VDb3VudCArIEBkcmFnU2xpY2UgLSBpKSAlIEBzbGljZUNvdW50XHJcbiAgICAgICAgYW5nbGUgPSBzbGljZSAqIHNsaWNlQW5nbGVcclxuICAgICAgICB2YWx1ZSA9IEBkcmFnRGVsdGEgLSBpXHJcbiAgICAgICAgaWYgKHZhbHVlICE9IDApIGFuZCAodmFsdWUgIT0gMSlcclxuICAgICAgICAgIGlmIHZhbHVlID4gMFxyXG4gICAgICAgICAgICB0ZXh0ViA9IFwiKyN7dmFsdWUgLSAxfVwiXHJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IFwiI2FhZmZhYVwiXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRleHRWID0gXCIje3ZhbHVlfVwiXHJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IFwiI2ZmYWFhYVwiXHJcbiAgICAgICAgICB0ZXh0UG9zID0gQHVucG9sYXIoYW5nbGUgKyBoYWxmU2xpY2VBbmdsZSwgQGRpYWxJbmNyZW1lbnRSYWRpdXMsIEBjZW50ZXIueCwgQGNlbnRlci55KVxyXG4gICAgICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHRleHRWLCB0ZXh0UG9zLngsIHRleHRQb3MueSwgQGZvbnRzLmluY3JlbWVudCwgdGV4dENvbG9yLCBAZmFjaW5nT3V0QW5nbGUodGV4dFBvcy54LCB0ZXh0UG9zLnkpKVxyXG5cclxuICAgICAgZXN0aW1hdGVkSGVhbHRoID0gZHJhZ1BsYXllci5oZWFsdGhcclxuICAgICAgaWYgQGRyYWdEZWx0YSA+IDFcclxuICAgICAgICBlc3RpbWF0ZWRIZWFsdGggKz0gQGRyYWdEZWx0YSAtIDFcclxuICAgICAgZWxzZSBpZiBAZHJhZ0RlbHRhIDwgMFxyXG4gICAgICAgIGVzdGltYXRlZEhlYWx0aCArPSBAZHJhZ0RlbHRhXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChTdHJpbmcoZXN0aW1hdGVkSGVhbHRoKSwgQGNlbnRlci54LCBAY2VudGVyLnksIEBmb250cy5oZWFsdGgsIENvbG9yLmNlbnRlcmVkSGVhbHRoLCBkcmFnUGxheWVyLmFuZ2xlKVxyXG5cclxuICAgIHJldHVyblxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ291bnRlclZpZXdcclxuIiwiU3Vkb2t1R2VuZXJhdG9yID0gcmVxdWlyZSAnLi9TdWRva3VHZW5lcmF0b3InXHJcblxyXG5CVVRUT05fSEVJR0hUID0gMC4wNlxyXG5GSVJTVF9CVVRUT05fWSA9IDAuMjJcclxuQlVUVE9OX1NQQUNJTkcgPSAwLjA4XHJcbkJVVFRPTl9TRVBBUkFUT1IgPSAwLjAzXHJcblxyXG5idXR0b25Qb3MgPSAoaW5kZXgpIC0+XHJcbiAgeSA9IEZJUlNUX0JVVFRPTl9ZICsgKEJVVFRPTl9TUEFDSU5HICogaW5kZXgpXHJcbiAgaWYgaW5kZXggPiAzXHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDRcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIGlmIGluZGV4ID4gNlxyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgcmV0dXJuIHlcclxuXHJcbmNsYXNzIE1lbnVWaWV3XHJcbiAgY29uc3RydWN0b3I6IChAYXBwLCBAY2FudmFzKSAtPlxyXG4gICAgQGJ1dHRvbnMgPVxyXG4gICAgICBuZXdFYXN5OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygwKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEVhc3lcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNzczM1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3RWFzeS5iaW5kKHRoaXMpXHJcbiAgICAgIG5ld01lZGl1bTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMSlcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBNZWRpdW1cIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3NzczM1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3TWVkaXVtLmJpbmQodGhpcylcclxuICAgICAgbmV3SGFyZDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMilcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBIYXJkXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzMzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0hhcmQuYmluZCh0aGlzKVxyXG4gICAgICBuZXdFeHRyZW1lOlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcygzKVxyXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEV4dHJlbWVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3MTExMVwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAbmV3RXh0cmVtZS5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc2V0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg0KVxyXG4gICAgICAgIHRleHQ6IFwiUmVzZXQgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzMzNzdcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQHJlc2V0LmJpbmQodGhpcylcclxuICAgICAgaW1wb3J0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg1KVxyXG4gICAgICAgIHRleHQ6IFwiTG9hZCBQdXp6bGVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzMzNjY2NlwiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAaW1wb3J0LmJpbmQodGhpcylcclxuICAgICAgZXhwb3J0OlxyXG4gICAgICAgIHk6IGJ1dHRvblBvcyg2KVxyXG4gICAgICAgIHRleHQ6IFwiU2hhcmUgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzY2NjZcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQGV4cG9ydC5iaW5kKHRoaXMpXHJcbiAgICAgIHJlc3VtZTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNylcclxuICAgICAgICB0ZXh0OiBcIlJlc3VtZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzc3Nzc3XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXN1bWUuYmluZCh0aGlzKVxyXG5cclxuICAgIGJ1dHRvbldpZHRoID0gQGNhbnZhcy53aWR0aCAqIDAuOFxyXG4gICAgQGJ1dHRvbkhlaWdodCA9IEBjYW52YXMuaGVpZ2h0ICogQlVUVE9OX0hFSUdIVFxyXG4gICAgYnV0dG9uWCA9IChAY2FudmFzLndpZHRoIC0gYnV0dG9uV2lkdGgpIC8gMlxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBidXR0b24ueCA9IGJ1dHRvblhcclxuICAgICAgYnV0dG9uLnkgPSBAY2FudmFzLmhlaWdodCAqIGJ1dHRvbi55XHJcbiAgICAgIGJ1dHRvbi53ID0gYnV0dG9uV2lkdGhcclxuICAgICAgYnV0dG9uLmggPSBAYnV0dG9uSGVpZ2h0XHJcblxyXG4gICAgYnV0dG9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGJ1dHRvbkhlaWdodCAqIDAuNClcclxuICAgIEBidXR0b25Gb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje2J1dHRvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICB0aXRsZUZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4xKVxyXG4gICAgQHRpdGxlRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3t0aXRsZUZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZHJhdzogLT5cclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMzMzM1wiKVxyXG5cclxuICAgIHggPSBAY2FudmFzLndpZHRoIC8gMlxyXG4gICAgc2hhZG93T2Zmc2V0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjAxXHJcblxyXG4gICAgeTEgPSBAY2FudmFzLmhlaWdodCAqIDAuMDVcclxuICAgIHkyID0gQGNhbnZhcy5oZWlnaHQgKiAwLjE1XHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkxICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MiArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHgsIHkxLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcclxuICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChcIlN1ZG9rdVwiLCB4LCB5MiwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXHJcblxyXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xyXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCArIHNoYWRvd09mZnNldCwgYnV0dG9uLnkgKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIFwiYmxhY2tcIiwgXCJibGFja1wiKVxyXG4gICAgICBAYXBwLmRyYXdSb3VuZGVkUmVjdChidXR0b24ueCwgYnV0dG9uLnksIGJ1dHRvbi53LCBidXR0b24uaCwgYnV0dG9uLmggKiAwLjMsIGJ1dHRvbi5iZ0NvbG9yLCBcIiM5OTk5OTlcIilcclxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKGJ1dHRvbi50ZXh0LCBidXR0b24ueCArIChidXR0b24udyAvIDIpLCBidXR0b24ueSArIChidXR0b24uaCAvIDIpLCBAYnV0dG9uRm9udCwgYnV0dG9uLnRleHRDb2xvcilcclxuXHJcbiAgICBAYXBwLmRyYXdMb3dlckxlZnQoXCIje0BhcHAuaG9sZUNvdW50KCl9LzgxXCIpXHJcbiAgICBAYXBwLmRyYXdWZXJzaW9uKClcclxuXHJcbiAgbW91c2Vkb3duOiAoeCwgeSkgLT5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgaWYgKHkgPiBidXR0b24ueSkgJiYgKHkgPCAoYnV0dG9uLnkgKyBAYnV0dG9uSGVpZ2h0KSlcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiYnV0dG9uIHByZXNzZWQ6ICN7YnV0dG9uTmFtZX1cIlxyXG4gICAgICAgIGJ1dHRvbi5jbGljaygpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbW91c2Vtb3ZlOiAoeCwgeSwgYnV0dG9ucykgLT5cclxuICBtb3VzZXVwOiAoeCwgeSkgLT5cclxuXHJcbiAgbmV3RWFzeTogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5lYXN5KVxyXG5cclxuICBuZXdNZWRpdW06IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtKVxyXG5cclxuICBuZXdIYXJkOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQpXHJcblxyXG4gIG5ld0V4dHJlbWU6IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSlcclxuXHJcbiAgcmVzZXQ6IC0+XHJcbiAgICBAYXBwLnJlc2V0KClcclxuXHJcbiAgcmVzdW1lOiAtPlxyXG4gICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIGV4cG9ydDogLT5cclxuICAgIGlmIG5hdmlnYXRvci5zaGFyZSAhPSB1bmRlZmluZWRcclxuICAgICAgbmF2aWdhdG9yLnNoYXJlIHtcclxuICAgICAgICB0aXRsZTogXCJTdWRva3UgU2hhcmVkIEdhbWVcIlxyXG4gICAgICAgIHRleHQ6IEBhcHAuZXhwb3J0KClcclxuICAgICAgfVxyXG4gICAgICByZXR1cm5cclxuICAgIHdpbmRvdy5wcm9tcHQoXCJDb3B5IHRoaXMgYW5kIHBhc3RlIHRvIGEgZnJpZW5kOlwiLCBAYXBwLmV4cG9ydCgpKVxyXG5cclxuICBpbXBvcnQ6IC0+XHJcbiAgICBpbXBvcnRTdHJpbmcgPSB3aW5kb3cucHJvbXB0KFwiUGFzdGUgYW4gZXhwb3J0ZWQgZ2FtZSBoZXJlOlwiLCBcIlwiKVxyXG4gICAgaWYgaW1wb3J0U3RyaW5nID09IG51bGxcclxuICAgICAgcmV0dXJuXHJcbiAgICBpZiBAYXBwLmltcG9ydChpbXBvcnRTdHJpbmcpXHJcbiAgICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51Vmlld1xyXG4iLCJzaHVmZmxlID0gKGEpIC0+XHJcbiAgICBpID0gYS5sZW5ndGhcclxuICAgIHdoaWxlIC0taSA+IDBcclxuICAgICAgICBqID0gfn4oTWF0aC5yYW5kb20oKSAqIChpICsgMSkpXHJcbiAgICAgICAgdCA9IGFbal1cclxuICAgICAgICBhW2pdID0gYVtpXVxyXG4gICAgICAgIGFbaV0gPSB0XHJcbiAgICByZXR1cm4gYVxyXG5cclxuY2xhc3MgQm9hcmRcclxuICBjb25zdHJ1Y3RvcjogKG90aGVyQm9hcmQgPSBudWxsKSAtPlxyXG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgQGxvY2tlZCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcclxuICAgICAgQGxvY2tlZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKGZhbHNlKVxyXG4gICAgaWYgb3RoZXJCb2FyZCAhPSBudWxsXHJcbiAgICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgICBAZ3JpZFtpXVtqXSA9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgICAgICAgQGxvY2tlZFtpXVtqXSA9IG90aGVyQm9hcmQubG9ja2VkW2ldW2pdXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbWF0Y2hlczogKG90aGVyQm9hcmQpIC0+XHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBAZ3JpZFtpXVtqXSAhPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbmNsYXNzIFN1ZG9rdUdlbmVyYXRvclxyXG4gIEBkaWZmaWN1bHR5OlxyXG4gICAgZWFzeTogMVxyXG4gICAgbWVkaXVtOiAyXHJcbiAgICBoYXJkOiAzXHJcbiAgICBleHRyZW1lOiA0XHJcblxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG5cclxuICBib2FyZFRvR3JpZDogKGJvYXJkKSAtPlxyXG4gICAgbmV3Qm9hcmQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBuZXdCb2FyZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgICBpZiBib2FyZC5sb2NrZWRbaV1bal1cclxuICAgICAgICAgIG5ld0JvYXJkW2ldW2pdID0gYm9hcmQuZ3JpZFtpXVtqXVxyXG4gICAgcmV0dXJuIG5ld0JvYXJkXHJcblxyXG4gIGNlbGxWYWxpZDogKGJvYXJkLCB4LCB5LCB2KSAtPlxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBpZiAoeCAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbaV1beV0gPT0gdilcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICBpZiAoeSAhPSBpKSBhbmQgKGJvYXJkLmdyaWRbeF1baV0gPT0gdilcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIHN4ID0gTWF0aC5mbG9vcih4IC8gMykgKiAzXHJcbiAgICBzeSA9IE1hdGguZmxvb3IoeSAvIDMpICogM1xyXG4gICAgZm9yIGogaW4gWzAuLi4zXVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjNdXHJcbiAgICAgICAgaWYgKHggIT0gKHN4ICsgaSkpICYmICh5ICE9IChzeSArIGopKVxyXG4gICAgICAgICAgaWYgYm9hcmQuZ3JpZFtzeCArIGldW3N5ICsgal0gPT0gdlxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHBlbmNpbE1hcmtzOiAoYm9hcmQsIHgsIHkpIC0+XHJcbiAgICBtYXJrcyA9IFtdXHJcbiAgICBmb3IgdiBpbiBbMS4uOV1cclxuICAgICAgaWYgQGNlbGxWYWxpZChib2FyZCwgeCwgeSwgdilcclxuICAgICAgICBtYXJrcy5wdXNoIHZcclxuICAgIGlmIG1hcmtzLmxlbmd0aCA+IDFcclxuICAgICAgc2h1ZmZsZShtYXJrcylcclxuICAgIHJldHVybiBtYXJrc1xyXG5cclxuICBzb2x2ZTogKGJvYXJkKSAtPlxyXG4gICAgc29sdmVkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgcGVuY2lsID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgcGVuY2lsW2ldID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgICMgZGVidWdnZXI7XHJcblxyXG4gICAgd2Fsa0luZGV4ID0gMFxyXG4gICAgZGlyZWN0aW9uID0gMVxyXG4gICAgd2hpbGUgd2Fsa0luZGV4IDwgODFcclxuICAgICAgeCA9IHdhbGtJbmRleCAlIDlcclxuICAgICAgeSA9IE1hdGguZmxvb3Iod2Fsa0luZGV4IC8gOSlcclxuXHJcbiAgICAgIGlmIG5vdCBzb2x2ZWQubG9ja2VkW3hdW3ldXHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PSAxKSBhbmQgKChwZW5jaWxbeF1beV0gPT0gbnVsbCkgb3IgKHBlbmNpbFt4XVt5XS5sZW5ndGggPT0gMCkpXHJcbiAgICAgICAgICBwZW5jaWxbeF1beV0gPSBAcGVuY2lsTWFya3Moc29sdmVkLCB4LCB5KVxyXG5cclxuICAgICAgICBpZiBwZW5jaWxbeF1beV0ubGVuZ3RoID09IDBcclxuICAgICAgICAgIHNvbHZlZC5ncmlkW3hdW3ldID0gMFxyXG4gICAgICAgICAgZGlyZWN0aW9uID0gLTFcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IHBlbmNpbFt4XVt5XS5wb3AoKVxyXG4gICAgICAgICAgZGlyZWN0aW9uID0gMVxyXG5cclxuICAgICAgd2Fsa0luZGV4ICs9IGRpcmVjdGlvblxyXG4gICAgICBpZiB3YWxrSW5kZXggPCAwXHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuXHJcbiAgICByZXR1cm4gc29sdmVkXHJcblxyXG4gIGhhc1VuaXF1ZVNvbHV0aW9uOiAoYm9hcmQpIC0+XHJcbiAgICBmaXJzdFNvbHZlID0gQHNvbHZlKGJvYXJkKVxyXG4gICAgZm9yIHVuaWNpdHlUZXN0cyBpbiBbMC4uLjZdXHJcbiAgICAgIG5leHRTb2x2ZSA9IEBzb2x2ZShib2FyZClcclxuICAgICAgaWYgbm90IGZpcnN0U29sdmUubWF0Y2hlcyhuZXh0U29sdmUpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBnZW5lcmF0ZUludGVybmFsOiAoYW1vdW50VG9SZW1vdmUpIC0+XHJcbiAgICBib2FyZCA9IEBzb2x2ZShuZXcgQm9hcmQoKSlcclxuICAgICMgaGFja1xyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgYm9hcmQubG9ja2VkW2ldW2pdID0gdHJ1ZVxyXG5cclxuICAgIGluZGV4ZXNUb1JlbW92ZSA9IHNodWZmbGUoWzAuLi44MV0pXHJcbiAgICByZW1vdmVkID0gMFxyXG4gICAgd2hpbGUgcmVtb3ZlZCA8IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgIGlmIGluZGV4ZXNUb1JlbW92ZS5sZW5ndGggPT0gMFxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICByZW1vdmVJbmRleCA9IGluZGV4ZXNUb1JlbW92ZS5wb3AoKVxyXG4gICAgICByeCA9IHJlbW92ZUluZGV4ICUgOVxyXG4gICAgICByeSA9IE1hdGguZmxvb3IocmVtb3ZlSW5kZXggLyA5KVxyXG5cclxuICAgICAgbmV4dEJvYXJkID0gbmV3IEJvYXJkKGJvYXJkKVxyXG4gICAgICBuZXh0Qm9hcmQuZ3JpZFtyeF1bcnldID0gMFxyXG4gICAgICBuZXh0Qm9hcmQubG9ja2VkW3J4XVtyeV0gPSBmYWxzZVxyXG4gICAgICBpZiBAaGFzVW5pcXVlU29sdXRpb24obmV4dEJvYXJkKVxyXG4gICAgICAgIGJvYXJkID0gbmV4dEJvYXJkXHJcbiAgICAgICAgcmVtb3ZlZCArPSAxXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcInN1Y2Nlc3NmdWxseSByZW1vdmVkICN7cnh9LCN7cnl9XCJcclxuICAgICAgZWxzZVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJmYWlsZWQgdG8gcmVtb3ZlICN7cnh9LCN7cnl9LCBjcmVhdGVzIG5vbi11bmlxdWUgc29sdXRpb25cIlxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJvYXJkOiBib2FyZFxyXG4gICAgICByZW1vdmVkOiByZW1vdmVkXHJcbiAgICB9XHJcblxyXG4gIGdlbmVyYXRlOiAoZGlmZmljdWx0eSkgLT5cclxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5leHRyZW1lIHRoZW4gNjBcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkICAgIHRoZW4gNTJcclxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcclxuICAgICAgZWxzZSA0MCAjIGVhc3kgLyB1bmtub3duXHJcblxyXG4gICAgYmVzdCA9IG51bGxcclxuICAgIGZvciBhdHRlbXB0IGluIFswLi4uMl1cclxuICAgICAgZ2VuZXJhdGVkID0gQGdlbmVyYXRlSW50ZXJuYWwoYW1vdW50VG9SZW1vdmUpXHJcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXHJcbiAgICAgICAgY29uc29sZS5sb2cgXCJSZW1vdmVkIGV4YWN0IGFtb3VudCAje2Ftb3VudFRvUmVtb3ZlfSwgc3RvcHBpbmdcIlxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgaWYgYmVzdCA9PSBudWxsXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBlbHNlIGlmIGJlc3QucmVtb3ZlZCA8IGdlbmVyYXRlZC5yZW1vdmVkXHJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxyXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXHJcblxyXG4gICAgY29uc29sZS5sb2cgXCJnaXZpbmcgdXNlciBib2FyZDogI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxyXG4gICAgcmV0dXJuIEBib2FyZFRvR3JpZChiZXN0LmJvYXJkKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTdWRva3VHZW5lcmF0b3JcclxuXHJcbiIsIkFwcCA9IHJlcXVpcmUgJy4vQXBwJ1xyXG5cclxuaW5pdCA9IC0+XHJcbiAgY29uc29sZS5sb2cgXCJpbml0XCJcclxuICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXHJcbiAgY2FudmFzLndpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXHJcbiAgY2FudmFzLmhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcclxuICBkb2N1bWVudC5ib2R5Lmluc2VydEJlZm9yZShjYW52YXMsIGRvY3VtZW50LmJvZHkuY2hpbGROb2Rlc1swXSlcclxuICBjYW52YXNSZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblxyXG4gIHdpbmRvdy5hcHAgPSBuZXcgQXBwKGNhbnZhcylcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaHN0YXJ0XCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB4ID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAgIHkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXHJcbiAgICB3aW5kb3cuYXBwLm1vdXNlZG93bih4LCB5KVxyXG5cclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcInRvdWNobW92ZVwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgd2luZG93LmFwcC5tb3VzZW1vdmUoeCwgeSwgMSlcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaGVuZFwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgd2luZG93LmFwcC5tb3VzZXVwKClcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZWRvd25cIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHggPSBlLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAgIHkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgd2luZG93LmFwcC5tb3VzZWRvd24oeCwgeSlcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZW1vdmVcIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHggPSBlLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcclxuICAgIHkgPSBlLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgYnV0dG9ucyA9IGUuYnV0dG9uc1xyXG4gICAgd2luZG93LmFwcC5tb3VzZW1vdmUoeCwgeSwgYnV0dG9ucylcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZXVwXCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB3aW5kb3cuYXBwLm1vdXNldXAoKVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgLT5cclxuICAgIGluaXQoKVxyXG4sIGZhbHNlKVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFwiMC4wLjFcIiIsIi8qIEZvbnQgRmFjZSBPYnNlcnZlciB2Mi4wLjEzIC0gwqkgQnJhbSBTdGVpbi4gTGljZW5zZTogQlNELTMtQ2xhdXNlICovKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbChhLGIpe2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/YS5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsYiwhMSk6YS5hdHRhY2hFdmVudChcInNjcm9sbFwiLGIpfWZ1bmN0aW9uIG0oYSl7ZG9jdW1lbnQuYm9keT9hKCk6ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGZ1bmN0aW9uIGMoKXtkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGMpO2EoKX0pOmRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24gaygpe2lmKFwiaW50ZXJhY3RpdmVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZXx8XCJjb21wbGV0ZVwiPT1kb2N1bWVudC5yZWFkeVN0YXRlKWRvY3VtZW50LmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsayksYSgpfSl9O2Z1bmN0aW9uIHIoYSl7dGhpcy5hPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7dGhpcy5hLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsXCJ0cnVlXCIpO3RoaXMuYS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKSk7dGhpcy5iPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmg9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5mPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZz0tMTt0aGlzLmIuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuYy5zdHlsZS5jc3NUZXh0PVwibWF4LXdpZHRoOm5vbmU7ZGlzcGxheTppbmxpbmUtYmxvY2s7cG9zaXRpb246YWJzb2x1dGU7aGVpZ2h0OjEwMCU7d2lkdGg6MTAwJTtvdmVyZmxvdzpzY3JvbGw7Zm9udC1zaXplOjE2cHg7XCI7XG50aGlzLmYuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO3RoaXMuaC5zdHlsZS5jc3NUZXh0PVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MjAwJTtoZWlnaHQ6MjAwJTtmb250LXNpemU6MTZweDttYXgtd2lkdGg6bm9uZTtcIjt0aGlzLmIuYXBwZW5kQ2hpbGQodGhpcy5oKTt0aGlzLmMuYXBwZW5kQ2hpbGQodGhpcy5mKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5iKTt0aGlzLmEuYXBwZW5kQ2hpbGQodGhpcy5jKX1cbmZ1bmN0aW9uIHQoYSxiKXthLmEuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO21pbi13aWR0aDoyMHB4O21pbi1oZWlnaHQ6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztvdmVyZmxvdzpoaWRkZW47cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6YXV0bzttYXJnaW46MDtwYWRkaW5nOjA7dG9wOi05OTlweDt3aGl0ZS1zcGFjZTpub3dyYXA7Zm9udC1zeW50aGVzaXM6bm9uZTtmb250OlwiK2IrXCI7XCJ9ZnVuY3Rpb24geShhKXt2YXIgYj1hLmEub2Zmc2V0V2lkdGgsYz1iKzEwMDthLmYuc3R5bGUud2lkdGg9YytcInB4XCI7YS5jLnNjcm9sbExlZnQ9YzthLmIuc2Nyb2xsTGVmdD1hLmIuc2Nyb2xsV2lkdGgrMTAwO3JldHVybiBhLmchPT1iPyhhLmc9YiwhMCk6ITF9ZnVuY3Rpb24geihhLGIpe2Z1bmN0aW9uIGMoKXt2YXIgYT1rO3koYSkmJmEuYS5wYXJlbnROb2RlJiZiKGEuZyl9dmFyIGs9YTtsKGEuYixjKTtsKGEuYyxjKTt5KGEpfTtmdW5jdGlvbiBBKGEsYil7dmFyIGM9Ynx8e307dGhpcy5mYW1pbHk9YTt0aGlzLnN0eWxlPWMuc3R5bGV8fFwibm9ybWFsXCI7dGhpcy53ZWlnaHQ9Yy53ZWlnaHR8fFwibm9ybWFsXCI7dGhpcy5zdHJldGNoPWMuc3RyZXRjaHx8XCJub3JtYWxcIn12YXIgQj1udWxsLEM9bnVsbCxFPW51bGwsRj1udWxsO2Z1bmN0aW9uIEcoKXtpZihudWxsPT09QylpZihKKCkmJi9BcHBsZS8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnZlbmRvcikpe3ZhciBhPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtDPSEhYSYmNjAzPnBhcnNlSW50KGFbMV0sMTApfWVsc2UgQz0hMTtyZXR1cm4gQ31mdW5jdGlvbiBKKCl7bnVsbD09PUYmJihGPSEhZG9jdW1lbnQuZm9udHMpO3JldHVybiBGfVxuZnVuY3Rpb24gSygpe2lmKG51bGw9PT1FKXt2YXIgYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXthLnN0eWxlLmZvbnQ9XCJjb25kZW5zZWQgMTAwcHggc2Fucy1zZXJpZlwifWNhdGNoKGIpe31FPVwiXCIhPT1hLnN0eWxlLmZvbnR9cmV0dXJuIEV9ZnVuY3Rpb24gTChhLGIpe3JldHVyblthLnN0eWxlLGEud2VpZ2h0LEsoKT9hLnN0cmV0Y2g6XCJcIixcIjEwMHB4XCIsYl0uam9pbihcIiBcIil9XG5BLnByb3RvdHlwZS5sb2FkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxrPWF8fFwiQkVTYnN3eVwiLHE9MCxEPWJ8fDNFMyxIPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihhLGIpe2lmKEooKSYmIUcoKSl7dmFyIE09bmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBlKCl7KG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RD9iKCk6ZG9jdW1lbnQuZm9udHMubG9hZChMKGMsJ1wiJytjLmZhbWlseSsnXCInKSxrKS50aGVuKGZ1bmN0aW9uKGMpezE8PWMubGVuZ3RoP2EoKTpzZXRUaW1lb3V0KGUsMjUpfSxmdW5jdGlvbigpe2IoKX0pfWUoKX0pLE49bmV3IFByb21pc2UoZnVuY3Rpb24oYSxjKXtxPXNldFRpbWVvdXQoYyxEKX0pO1Byb21pc2UucmFjZShbTixNXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChxKTthKGMpfSxmdW5jdGlvbigpe2IoYyl9KX1lbHNlIG0oZnVuY3Rpb24oKXtmdW5jdGlvbiB1KCl7dmFyIGI7aWYoYj0tMSE9XG5mJiYtMSE9Z3x8LTEhPWYmJi0xIT1ofHwtMSE9ZyYmLTEhPWgpKGI9ZiE9ZyYmZiE9aCYmZyE9aCl8fChudWxsPT09QiYmKGI9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEI9ISFiJiYoNTM2PnBhcnNlSW50KGJbMV0sMTApfHw1MzY9PT1wYXJzZUludChiWzFdLDEwKSYmMTE+PXBhcnNlSW50KGJbMl0sMTApKSksYj1CJiYoZj09diYmZz09diYmaD09dnx8Zj09dyYmZz09dyYmaD09d3x8Zj09eCYmZz09eCYmaD09eCkpLGI9IWI7YiYmKGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGNsZWFyVGltZW91dChxKSxhKGMpKX1mdW5jdGlvbiBJKCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSD49RClkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxiKGMpO2Vsc2V7dmFyIGE9ZG9jdW1lbnQuaGlkZGVuO2lmKCEwPT09YXx8dm9pZCAwPT09YSlmPWUuYS5vZmZzZXRXaWR0aCxcbmc9bi5hLm9mZnNldFdpZHRoLGg9cC5hLm9mZnNldFdpZHRoLHUoKTtxPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyByKGspLG49bmV3IHIoaykscD1uZXcgcihrKSxmPS0xLGc9LTEsaD0tMSx2PS0xLHc9LTEseD0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt0KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dChuLEwoYyxcInNlcmlmXCIpKTt0KHAsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChuLmEpO2QuYXBwZW5kQ2hpbGQocC5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3Y9ZS5hLm9mZnNldFdpZHRoO3c9bi5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO0koKTt6KGUsZnVuY3Rpb24oYSl7Zj1hO3UoKX0pO3QoZSxMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2Fucy1zZXJpZicpKTt6KG4sZnVuY3Rpb24oYSl7Zz1hO3UoKX0pO3QobixMKGMsJ1wiJytjLmZhbWlseSsnXCIsc2VyaWYnKSk7XG56KHAsZnVuY3Rpb24oYSl7aD1hO3UoKX0pO3QocCxMKGMsJ1wiJytjLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9QTood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9QSx3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1BLnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIl19
