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
    this.sliceCount = 16;
    this.halfSliceCount = Math.floor(this.sliceCount / 2);
    this.dialRadius = this.center.x * 0.7;
    this.dialIncrementRadius = this.center.x * 0.6;
    this.layouts = [];
    xstep6 = this.center.x / 2;
    ystep6 = this.center.y / 3;
    this.layouts.push({
      players: [this.playerLayout(2, xstep6 * 3, ystep6 * 5), this.playerLayout(4, xstep6, ystep6 * 5), this.playerLayout(7, xstep6, ystep6 * 3), this.playerLayout(10, xstep6, ystep6), this.playerLayout(12, xstep6 * 3, ystep6), this.playerLayout(15, xstep6 * 3, ystep6 * 3)]
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
    return window.app.mousemove(x, y);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL3NyYy9BcHAuY29mZmVlIiwiZ2FtZS9zcmMvQ291bnRlclZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvTWVudVZpZXcuY29mZmVlIiwiZ2FtZS9zcmMvU3Vkb2t1R2VuZXJhdG9yLmNvZmZlZSIsImdhbWUvc3JjL21haW4uY29mZmVlIiwiZ2FtZS9zcmMvdmVyc2lvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvZm9udGZhY2VvYnNlcnZlci9mb250ZmFjZW9ic2VydmVyLnN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQkFBUjs7QUFFbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUjs7QUFDZCxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0FBRUo7RUFDUyxhQUFDLE1BQUQ7SUFBQyxJQUFDLENBQUEsU0FBRDtJQUNaLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVULElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUNyQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQUE0QixJQUFDLENBQUEsaUJBQUYsR0FBb0IsdUJBQS9DO0lBRWYsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQTVCO0lBQ3hCLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxZQUFELENBQWMsWUFBZCxFQUErQixJQUFDLENBQUEsb0JBQUYsR0FBdUIsdUJBQXJEO0lBRWxCLElBQUMsQ0FBQSxLQUFELEdBQ0U7TUFBQSxJQUFBLEVBQU0sSUFBSSxRQUFKLENBQWEsSUFBYixFQUFtQixJQUFDLENBQUEsTUFBcEIsQ0FBTjtNQUNBLE9BQUEsRUFBUyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBQyxDQUFBLE1BQXZCLENBRFQ7O0lBRUYsSUFBQyxDQUFBLFVBQUQsQ0FBWSxTQUFaO0VBZFc7O2dCQWdCYixZQUFBLEdBQWMsU0FBQTtBQUNaLFFBQUE7QUFBQTtBQUFBLFNBQUEsZUFBQTs7TUFDRSxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsR0FBWSxDQUFDLENBQUM7TUFDZCxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsR0FBaUI7TUFDakIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLEdBQWlCO01BQ2pCLENBQUMsQ0FBQyxNQUFGLEdBQVcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsQ0FBaUIsR0FBakIsQ0FBcUIsQ0FBQyxLQUF0QixHQUE4QixHQUF6QztNQUNYLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBQSxHQUFRLFFBQVIsR0FBaUIsZUFBakIsR0FBZ0MsQ0FBQyxDQUFDLE1BQWxDLEdBQXlDLFNBQXJEO0FBTEY7RUFEWTs7Z0JBU2QsWUFBQSxHQUFjLFNBQUMsSUFBRCxFQUFPLEtBQVA7QUFDWixRQUFBO0lBQUEsSUFBQSxHQUNFO01BQUEsSUFBQSxFQUFNLElBQU47TUFDQSxLQUFBLEVBQU8sS0FEUDtNQUVBLE1BQUEsRUFBUSxDQUZSOztJQUdGLElBQUMsQ0FBQSxLQUFNLENBQUEsSUFBQSxDQUFQLEdBQWU7SUFDZixJQUFDLENBQUEsWUFBRCxDQUFBO0FBQ0EsV0FBTztFQVBLOztnQkFTZCxRQUFBLEdBQVUsU0FBQyxRQUFEO0FBQ1IsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFJLGdCQUFKLENBQXFCLFFBQXJCO1dBQ1AsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFXLENBQUMsSUFBWixDQUFpQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDZixPQUFPLENBQUMsR0FBUixDQUFlLFFBQUQsR0FBVSx1QkFBeEI7UUFDQSxLQUFDLENBQUEsWUFBRCxDQUFBO2VBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBQTtNQUhlO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtFQUZROztnQkFPVixVQUFBLEdBQVksU0FBQyxJQUFEO0lBQ1YsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsS0FBTSxDQUFBLElBQUE7V0FDZixJQUFDLENBQUEsSUFBRCxDQUFBO0VBRlU7O2dCQUlaLE9BQUEsR0FBUyxTQUFDLFVBQUQsR0FBQTs7Z0JBV1QsS0FBQSxHQUFPLFNBQUEsR0FBQTs7aUJBSVAsUUFBQSxHQUFRLFNBQUMsWUFBRCxHQUFBOztpQkFHUixRQUFBLEdBQVEsU0FBQSxHQUFBOztnQkFHUixTQUFBLEdBQVcsU0FBQSxHQUFBOztnQkFHWCxJQUFBLEdBQU0sU0FBQTtXQUNKLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFBO0VBREk7O2dCQUdOLFNBQUEsR0FBVyxTQUFDLENBQUQsRUFBSSxDQUFKO1dBQ1QsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQWdCLENBQWhCLEVBQW1CLENBQW5CO0VBRFM7O2dCQUdYLFNBQUEsR0FBVyxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sT0FBUDtXQUNULElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixDQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixPQUF0QjtFQURTOztnQkFHWCxPQUFBLEdBQVMsU0FBQyxDQUFELEVBQUksQ0FBSjtXQUNQLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFjLENBQWQsRUFBaUIsQ0FBakI7RUFETzs7Z0JBR1QsUUFBQSxHQUFVLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLEtBQWI7SUFDUixJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBQTtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLEdBQWlCO1dBQ2pCLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFBO0VBSlE7O2dCQU1WLGVBQUEsR0FBaUIsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixTQUFoQixFQUFrQyxXQUFsQzs7TUFBZ0IsWUFBWTs7O01BQU0sY0FBYzs7SUFDL0QsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixDQUEzQjtJQUNBLElBQUcsU0FBQSxLQUFhLElBQWhCO01BQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLEdBQWlCO01BQ2pCLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFBLEVBRkY7O0lBR0EsSUFBRyxXQUFBLEtBQWUsSUFBbEI7TUFDRSxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsR0FBbUI7TUFDbkIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLENBQUEsRUFGRjs7RUFMZTs7Z0JBVWpCLFFBQUEsR0FBVSxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxLQUFiLEVBQW9CLFNBQXBCOztNQUFvQixZQUFZOztJQUN4QyxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBQTtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxHQUFtQjtJQUNuQixJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsR0FBaUI7SUFDakIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLENBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkI7V0FDQSxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsQ0FBQTtFQUxROztnQkFPVixRQUFBLEdBQVUsU0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLEtBQWpCLEVBQWtDLFNBQWxDOztNQUFpQixRQUFROzs7TUFBUyxZQUFZOztJQUN0RCxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBQTtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsV0FBTCxHQUFtQjtJQUNuQixJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsR0FBaUI7SUFDakIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLENBQVksRUFBWixFQUFnQixFQUFoQjtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsTUFBTCxDQUFZLEVBQVosRUFBZ0IsRUFBaEI7V0FDQSxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsQ0FBQTtFQU5ROztnQkFRVixPQUFBLEdBQVMsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxVQUFWLEVBQXNCLFFBQXRCLEVBQWdDLEtBQWhDO0lBQ1AsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQUE7SUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsR0FBaUI7SUFDakIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUFMLENBQVksQ0FBWixFQUFlLENBQWY7SUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsRUFBa0IsVUFBbEIsRUFBOEIsUUFBOUI7SUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBQTtXQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxDQUFBO0VBTk87O2dCQVFULGdCQUFBLEdBQWtCLFNBQUMsSUFBRCxFQUFPLEVBQVAsRUFBVyxFQUFYLEVBQWUsSUFBZixFQUFxQixLQUFyQixFQUE0QixHQUE1QjtJQUNoQixJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBQTtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFlLEVBQWYsRUFBbUIsRUFBbkI7SUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLE1BQUwsQ0FBWSxHQUFaO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLEdBQVksSUFBSSxDQUFDO0lBQ2pCLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxHQUFpQjtJQUNqQixJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsR0FBaUI7SUFDakIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxRQUFMLENBQWMsSUFBZCxFQUFvQixDQUFwQixFQUF3QixJQUFJLENBQUMsTUFBTCxHQUFjLENBQXRDO1dBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQUE7RUFSZ0I7O2dCQVVsQixhQUFBLEdBQWUsU0FBQyxJQUFELEVBQU8sS0FBUDs7TUFBTyxRQUFROztJQUM1QixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtJQUNQLElBQUMsQ0FBQSxHQUFHLENBQUMsSUFBTCxHQUFZLElBQUMsQ0FBQSxXQUFXLENBQUM7SUFDekIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLEdBQWlCO0lBQ2pCLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxHQUFpQjtXQUNqQixJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLENBQXBCLEVBQXVCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixDQUFDLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixHQUFzQixDQUF2QixDQUF4QztFQUxhOztnQkFPZixXQUFBLEdBQWEsU0FBQyxLQUFEOztNQUFDLFFBQVE7O0lBQ3BCLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUFMLEdBQVksSUFBQyxDQUFBLFdBQVcsQ0FBQztJQUN6QixJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsR0FBaUI7SUFDakIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLEdBQWlCO1dBQ2pCLElBQUMsQ0FBQSxHQUFHLENBQUMsUUFBTCxDQUFjLEdBQUEsR0FBSSxPQUFsQixFQUE2QixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsQ0FBQyxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsR0FBc0IsQ0FBdkIsQ0FBN0MsRUFBd0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLENBQUMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLEdBQXNCLENBQXZCLENBQXpGO0VBTFc7Ozs7OztBQU9mLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxTQUFuQyxHQUErQyxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiO0VBQzdDLElBQUksQ0FBQSxHQUFJLENBQUEsR0FBSSxDQUFaO0lBQW9CLENBQUEsR0FBSSxDQUFBLEdBQUksRUFBNUI7O0VBQ0EsSUFBSSxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQVo7SUFBb0IsQ0FBQSxHQUFJLENBQUEsR0FBSSxFQUE1Qjs7RUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO0VBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxDQUFBLEdBQUUsQ0FBVixFQUFhLENBQWI7RUFDQSxJQUFDLENBQUEsS0FBRCxDQUFPLENBQUEsR0FBRSxDQUFULEVBQVksQ0FBWixFQUFpQixDQUFBLEdBQUUsQ0FBbkIsRUFBc0IsQ0FBQSxHQUFFLENBQXhCLEVBQTJCLENBQTNCO0VBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFBLEdBQUUsQ0FBVCxFQUFZLENBQUEsR0FBRSxDQUFkLEVBQWlCLENBQWpCLEVBQXNCLENBQUEsR0FBRSxDQUF4QixFQUEyQixDQUEzQjtFQUNBLElBQUMsQ0FBQSxLQUFELENBQU8sQ0FBUCxFQUFZLENBQUEsR0FBRSxDQUFkLEVBQWlCLENBQWpCLEVBQXNCLENBQXRCLEVBQTJCLENBQTNCO0VBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFQLEVBQVksQ0FBWixFQUFpQixDQUFBLEdBQUUsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBMkIsQ0FBM0I7RUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO0FBQ0EsU0FBTztBQVZzQzs7QUFZL0MsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNuS2pCLElBQUE7O0FBQUEsS0FBQSxHQUNFO0VBQUEsTUFBQSxFQUFRLE9BQVI7RUFDQSxjQUFBLEVBQWdCLEtBRGhCO0VBRUEsY0FBQSxFQUFnQixPQUZoQjs7O0FBSUYsTUFBQSxHQUFTLElBQUksQ0FBQyxFQUFMLEdBQVU7O0FBRW5CLEtBQUEsR0FBUSxTQUFDLEdBQUQ7QUFFTixTQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLFNBQUwsQ0FBZSxHQUFmLENBQVg7QUFGRDs7QUFJRjtFQUlTLHFCQUFDLEdBQUQsRUFBTyxNQUFQO0FBQ1gsUUFBQTtJQURZLElBQUMsQ0FBQSxNQUFEO0lBQU0sSUFBQyxDQUFBLFNBQUQ7SUFDbEIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxjQUFBLEdBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUF2QixHQUE2QixHQUE3QixHQUFnQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQXBEO0lBR0EsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsSUFBM0I7SUFDbkIsbUJBQUEsR0FBc0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsSUFBM0I7SUFDdEIsSUFBQyxDQUFBLEtBQUQsR0FDRTtNQUFBLE1BQUEsRUFBVyxJQUFDLENBQUEsR0FBRyxDQUFDLFlBQUwsQ0FBa0IsUUFBbEIsRUFBa0MsZ0JBQUQsR0FBa0IsdUJBQW5ELENBQVg7TUFDQSxTQUFBLEVBQVcsSUFBQyxDQUFBLEdBQUcsQ0FBQyxZQUFMLENBQWtCLFdBQWxCLEVBQWtDLG1CQUFELEdBQXFCLHVCQUF0RCxDQURYOztJQUdGLElBQUMsQ0FBQSxNQUFELEdBQ0U7TUFBQSxDQUFBLEVBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCLENBQW5CO01BQ0EsQ0FBQSxFQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixDQURwQjs7SUFHRixJQUFDLENBQUEsVUFBRCxHQUFjO0lBQ2QsSUFBQyxDQUFBLGNBQUQsR0FBa0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsVUFBRCxHQUFjLENBQXpCO0lBRWxCLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFSLEdBQVk7SUFDMUIsSUFBQyxDQUFBLG1CQUFELEdBQXVCLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBUixHQUFZO0lBRW5DLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFHWCxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFSLEdBQVk7SUFDckIsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBUixHQUFZO0lBQ3JCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjO01BQ1osT0FBQSxFQUFTLENBQ1AsSUFBQyxDQUFBLFlBQUQsQ0FBYyxDQUFkLEVBQWtCLE1BQUEsR0FBUyxDQUEzQixFQUE4QixNQUFBLEdBQVMsQ0FBdkMsQ0FETyxFQUVQLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBZCxFQUFrQixNQUFsQixFQUE4QixNQUFBLEdBQVMsQ0FBdkMsQ0FGTyxFQUdQLElBQUMsQ0FBQSxZQUFELENBQWMsQ0FBZCxFQUFrQixNQUFsQixFQUE4QixNQUFBLEdBQVMsQ0FBdkMsQ0FITyxFQUlQLElBQUMsQ0FBQSxZQUFELENBQWMsRUFBZCxFQUFrQixNQUFsQixFQUE4QixNQUE5QixDQUpPLEVBS1AsSUFBQyxDQUFBLFlBQUQsQ0FBYyxFQUFkLEVBQWtCLE1BQUEsR0FBUyxDQUEzQixFQUE4QixNQUE5QixDQUxPLEVBTVAsSUFBQyxDQUFBLFlBQUQsQ0FBYyxFQUFkLEVBQWtCLE1BQUEsR0FBUyxDQUEzQixFQUE4QixNQUFBLEdBQVMsQ0FBdkMsQ0FOTyxDQURHO0tBQWQ7SUFXQSxJQUFDLENBQUEsWUFBRCxDQUFjLENBQWQ7SUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtFQXRDVzs7d0JBd0NiLFlBQUEsR0FBYyxTQUFDLE1BQUQ7SUFDWixJQUFDLENBQUEsT0FBRCxHQUFXLEtBQUEsQ0FBTSxJQUFDLENBQUEsT0FBUSxDQUFBLE1BQUEsQ0FBTyxDQUFDLE9BQXZCO0VBREM7O3lCQU1kLFFBQUEsR0FBUSxTQUFDLFlBQUQsR0FBQTs7eUJBR1IsUUFBQSxHQUFRLFNBQUE7QUFDTixXQUFPO0VBREQ7O3dCQUtSLGNBQUEsR0FBZ0IsU0FBQyxDQUFELEVBQUksQ0FBSjtBQUNkLFdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUF2QixFQUEwQixDQUFBLEdBQUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUF0QyxDQUFBLEdBQTJDLENBQUMsSUFBSSxDQUFDLEVBQUwsR0FBVSxDQUFYO0VBRHBDOzt3QkFHaEIsT0FBQSxHQUFTLFNBQUMsS0FBRCxFQUFRLENBQVIsRUFBVyxPQUFYLEVBQXdCLE9BQXhCOztNQUFXLFVBQVU7OztNQUFHLFVBQVU7O0FBQ3pDLFdBQU87TUFDTCxDQUFBLEVBQUcsT0FBQSxHQUFVLENBQUMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQUEsR0FBa0IsQ0FBbkIsQ0FEUjtNQUVMLENBQUEsRUFBRyxPQUFBLEdBQVUsQ0FBQyxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBQSxHQUFrQixDQUFuQixDQUZSOztFQURBOzt3QkFNVCxVQUFBLEdBQVksU0FBQyxDQUFELEVBQUksQ0FBSjtBQUNWLFFBQUE7SUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUF2QixFQUEwQixDQUFBLEdBQUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUF0QztJQUNYLElBQUcsUUFBQSxHQUFXLENBQWQ7TUFDRSxRQUFBLElBQVksSUFBSSxDQUFDLEVBQUwsR0FBVSxFQUR4Qjs7SUFFQSxVQUFBLEdBQWEsTUFBQSxHQUFTLElBQUMsQ0FBQTtJQUN2QixLQUFBLEdBQVE7QUFDUixTQUFhLGdHQUFiO01BQ0UsSUFBRyxDQUFDLFFBQUEsSUFBWSxLQUFiLENBQUEsSUFBd0IsQ0FBQyxRQUFBLEdBQVcsQ0FBQyxLQUFBLEdBQVEsVUFBVCxDQUFaLENBQTNCO0FBQ0UsZUFBTyxNQURUOztNQUVBLEtBQUEsSUFBUztBQUhYO0FBSUEsV0FBTztFQVZHOzt3QkFZWixZQUFBLEdBQWMsU0FBQyxLQUFELEVBQVEsQ0FBUixFQUFXLENBQVg7QUFDWixRQUFBO0lBQUEsTUFBQSxHQUNFO01BQUEsQ0FBQSxFQUFHLENBQUg7TUFDQSxDQUFBLEVBQUcsQ0FESDtNQUVBLEtBQUEsRUFBTyxJQUFDLENBQUEsY0FBRCxDQUFnQixDQUFoQixFQUFtQixDQUFuQixDQUZQO01BR0EsS0FBQSxFQUFPLEtBSFA7TUFJQSxNQUFBLEVBQVEsRUFKUjs7QUFLRixXQUFPO0VBUEs7O3dCQVNkLFFBQUEsR0FBVSxTQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsRUFBVCxFQUFhLEVBQWI7QUFDUixRQUFBO0lBQUEsRUFBQSxHQUFLLEVBQUEsR0FBSztJQUNWLEVBQUEsR0FBSyxFQUFBLEdBQUs7QUFDVixXQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBQyxFQUFBLEdBQUcsRUFBSixDQUFBLEdBQVUsQ0FBQyxFQUFBLEdBQUcsRUFBSixDQUFwQjtFQUhDOzt3QkFPVixTQUFBLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSjtBQUNULFFBQUE7SUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZO0lBRVosSUFBRyxJQUFDLENBQUEsU0FBRCxLQUFjLENBQUMsQ0FBbEI7TUFFRSxZQUFBLEdBQWU7TUFDZixlQUFBLEdBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQjtBQUNuQztBQUFBLFdBQUEscURBQUE7O1FBQ0UsSUFBQSxHQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBTSxDQUFDLENBQWpCLEVBQW9CLE1BQU0sQ0FBQyxDQUEzQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQztRQUNQLElBQUcsZUFBQSxHQUFrQixJQUFyQjtVQUNFLGVBQUEsR0FBa0I7VUFDbEIsWUFBQSxHQUFlLE1BRmpCOztBQUZGO01BS0EsSUFBQyxDQUFBLGVBQUQsR0FBbUI7TUFJbkIsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsVUFBRCxDQUFZLENBQVosRUFBZSxDQUFmO01BRWIsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsQ0FBQztNQUNyRCxJQUFHLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLGNBQWpCO1FBQ0UsSUFBQyxDQUFBLFNBQUQsSUFBYyxJQUFDLENBQUEsV0FEakI7O01BRUEsSUFBRyxJQUFDLENBQUEsU0FBRCxHQUFhLENBQUMsSUFBQyxDQUFBLGNBQWxCO1FBQ0UsSUFBQyxDQUFBLFNBQUQsSUFBYyxJQUFDLENBQUEsV0FEakI7O01BRUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSx5QkFBQSxHQUEwQixJQUFDLENBQUEsU0FBdkMsRUFwQkY7S0FBQSxNQUFBO01Bc0JFLFlBQUEsR0FBZSxJQUFDLENBQUEsVUFBRCxDQUFZLENBQVosRUFBZSxDQUFmO01BQ2YsSUFBRyxJQUFDLENBQUEsU0FBRCxLQUFjLFlBQWpCO1FBQ0UsV0FBQSxHQUFjLFlBQUEsR0FBZSxJQUFDLENBQUE7UUFDOUIsSUFBRyxXQUFBLEdBQWMsSUFBQyxDQUFBLGNBQWxCO1VBQ0UsV0FBQSxJQUFlLElBQUMsQ0FBQSxXQURsQjs7UUFFQSxJQUFHLFdBQUEsR0FBYyxDQUFDLElBQUMsQ0FBQSxjQUFuQjtVQUNFLFdBQUEsSUFBZSxJQUFDLENBQUEsV0FEbEI7O1FBRUEsSUFBQyxDQUFBLFNBQUQsSUFBYztRQUNkLE9BQU8sQ0FBQyxHQUFSLENBQVksb0JBQUEsR0FBcUIsSUFBQyxDQUFBLFNBQWxDO1FBRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxhQVRmO09BdkJGOztJQW1DQSxJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLEtBQUQsR0FBUztFQXZDQTs7d0JBMkNYLFdBQUEsR0FBYSxTQUFBO0lBQ1gsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNaLElBQUMsQ0FBQSxlQUFELEdBQW1CLENBQUM7SUFDcEIsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFDO0lBQ1YsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFDO0lBQ1YsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFDO1dBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYTtFQU5GOzt3QkFRYixTQUFBLEdBQVcsU0FBQyxDQUFELEVBQUksQ0FBSjtJQUVULElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWCxFQUFjLENBQWQ7V0FDQSxJQUFDLENBQUEsSUFBRCxDQUFBO0VBSFM7O3dCQUtYLFNBQUEsR0FBVyxTQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sT0FBUDtJQUVULElBQUcsT0FBQSxLQUFXLENBQWQ7TUFDRSxJQUFDLENBQUEsU0FBRCxDQUFXLENBQVgsRUFBYyxDQUFkO2FBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUZGOztFQUZTOzt3QkFNWCxPQUFBLEdBQVMsU0FBQTtBQUdQLFFBQUE7SUFBQSxVQUFBLEdBQWEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFDLENBQUEsZUFBRDtJQUN0QixTQUFBLEdBQVksVUFBVSxDQUFDO0lBQ3ZCLElBQUcsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFoQjtNQUNFLFNBQUEsSUFBYSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBRDVCO0tBQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBaEI7TUFDSCxTQUFBLElBQWEsSUFBQyxDQUFBLFVBRFg7O0lBRUwsVUFBVSxDQUFDLE1BQVgsR0FBb0I7SUFFcEIsSUFBQyxDQUFBLFdBQUQsQ0FBQTtXQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7RUFaTzs7d0JBZ0JULGtCQUFBLEdBQW9CLFNBQUMsTUFBRDtJQUNsQixJQUFHLE1BQUEsS0FBVSxDQUFiO0FBQ0UsYUFBTyxFQURUOztJQUdBLElBQUcsTUFBQSxJQUFVLElBQUMsQ0FBQSxjQUFkO0FBRUUsYUFBTyxPQUZUO0tBQUEsTUFBQTtBQUtFLGFBQU8sQ0FBQyxDQUFELEdBQUssQ0FBQyxJQUFDLENBQUEsVUFBRCxHQUFjLE1BQWYsRUFMZDs7RUFKa0I7O3dCQVdwQixJQUFBLEdBQU0sU0FBQTtBQUNKLFFBQUE7SUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFFBQVo7SUFHQSxJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBNUIsRUFBbUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUEzQyxFQUFtRCxPQUFuRDtBQUdBO0FBQUEsU0FBQSxxREFBQTs7TUFDRSxLQUFBLEdBQVEsS0FBSyxDQUFDO01BQ2QsSUFBRyxJQUFDLENBQUEsUUFBRCxJQUFjLENBQUMsS0FBQSxLQUFTLElBQUMsQ0FBQSxlQUFYLENBQWpCO1FBQ0UsS0FBQSxHQUFRLEtBQUssQ0FBQyxlQURoQjs7TUFFQSxJQUFDLENBQUEsR0FBRyxDQUFDLGdCQUFMLENBQXNCLE1BQUEsQ0FBTyxNQUFNLENBQUMsTUFBZCxDQUF0QixFQUE2QyxNQUFNLENBQUMsQ0FBcEQsRUFBdUQsTUFBTSxDQUFDLENBQTlELEVBQWlFLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBeEUsRUFBZ0YsS0FBaEYsRUFBdUYsTUFBTSxDQUFDLEtBQTlGO0FBSkY7SUFNQSxJQUFHLElBQUMsQ0FBQSxRQUFKO01BQ0UsVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQyxDQUFBLGVBQUQ7TUFDdEIsVUFBQSxHQUFhLE1BQUEsR0FBUyxJQUFDLENBQUE7TUFDdkIsY0FBQSxHQUFpQixVQUFBLEdBQWE7TUFFOUIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFyQixFQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLENBQWhDLEVBQW1DLElBQUMsQ0FBQSxVQUFwQyxFQUFnRCxDQUFoRCxFQUFtRCxNQUFuRCxFQUEyRCxTQUEzRDtBQUVBLFdBQVMscUdBQVQ7UUFDRSxLQUFBLEdBQVEsQ0FBQyxJQUFDLENBQUEsU0FBRCxHQUFhLENBQWQsQ0FBQSxHQUFtQixJQUFDLENBQUE7UUFDNUIsS0FBQSxHQUFRLEtBQUEsR0FBUTtRQUNoQixLQUFBLEdBQVEsSUFBQyxDQUFBLFNBQUQsR0FBYTtRQUNyQixJQUFHLEtBQUEsS0FBUyxJQUFDLENBQUEsU0FBYjtVQUNFLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxDQUFhLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBckIsRUFBd0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFoQyxFQUFtQyxJQUFDLENBQUEsVUFBcEMsRUFBZ0QsS0FBaEQsRUFBdUQsS0FBQSxHQUFRLFVBQS9ELEVBQTJFLFNBQTNFLEVBREY7O1FBRUEsSUFBRyxDQUFDLEtBQUEsS0FBUyxDQUFWLENBQUEsSUFBaUIsQ0FBQyxLQUFBLEtBQVMsQ0FBVixDQUFwQjtVQUNFLElBQUcsS0FBQSxHQUFRLENBQVg7WUFDRSxLQUFBLEdBQVEsR0FBQSxHQUFHLENBQUMsS0FBQSxHQUFRLENBQVQ7WUFDWCxTQUFBLEdBQVksVUFGZDtXQUFBLE1BQUE7WUFJRSxLQUFBLEdBQVEsRUFBQSxHQUFHO1lBQ1gsU0FBQSxHQUFZLFVBTGQ7O1VBTUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFELENBQVMsS0FBQSxHQUFRLGNBQWpCLEVBQWlDLElBQUMsQ0FBQSxtQkFBbEMsRUFBdUQsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUEvRCxFQUFrRSxJQUFDLENBQUEsTUFBTSxDQUFDLENBQTFFO1VBQ1YsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QixPQUFPLENBQUMsQ0FBckMsRUFBd0MsT0FBTyxDQUFDLENBQWhELEVBQW1ELElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBMUQsRUFBcUUsU0FBckUsRUFBZ0YsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBTyxDQUFDLENBQXhCLEVBQTJCLE9BQU8sQ0FBQyxDQUFuQyxDQUFoRixFQVJGOztBQU5GO0FBZ0JBLFdBQVMsaUdBQVQ7UUFDRSxLQUFBLEdBQVEsQ0FBQyxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxTQUFmLEdBQTJCLENBQTVCLENBQUEsR0FBaUMsSUFBQyxDQUFBO1FBQzFDLEtBQUEsR0FBUSxLQUFBLEdBQVE7UUFDaEIsS0FBQSxHQUFRLElBQUMsQ0FBQSxTQUFELEdBQWE7UUFDckIsSUFBRyxDQUFDLEtBQUEsS0FBUyxDQUFWLENBQUEsSUFBaUIsQ0FBQyxLQUFBLEtBQVMsQ0FBVixDQUFwQjtVQUNFLElBQUcsS0FBQSxHQUFRLENBQVg7WUFDRSxLQUFBLEdBQVEsR0FBQSxHQUFHLENBQUMsS0FBQSxHQUFRLENBQVQ7WUFDWCxTQUFBLEdBQVksVUFGZDtXQUFBLE1BQUE7WUFJRSxLQUFBLEdBQVEsRUFBQSxHQUFHO1lBQ1gsU0FBQSxHQUFZLFVBTGQ7O1VBTUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFELENBQVMsS0FBQSxHQUFRLGNBQWpCLEVBQWlDLElBQUMsQ0FBQSxtQkFBbEMsRUFBdUQsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUEvRCxFQUFrRSxJQUFDLENBQUEsTUFBTSxDQUFDLENBQTFFO1VBQ1YsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUFzQixLQUF0QixFQUE2QixPQUFPLENBQUMsQ0FBckMsRUFBd0MsT0FBTyxDQUFDLENBQWhELEVBQW1ELElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBMUQsRUFBcUUsU0FBckUsRUFBZ0YsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsT0FBTyxDQUFDLENBQXhCLEVBQTJCLE9BQU8sQ0FBQyxDQUFuQyxDQUFoRixFQVJGOztBQUpGO01BY0EsZUFBQSxHQUFrQixVQUFVLENBQUM7TUFDN0IsSUFBRyxJQUFDLENBQUEsU0FBRCxHQUFhLENBQWhCO1FBQ0UsZUFBQSxJQUFtQixJQUFDLENBQUEsU0FBRCxHQUFhLEVBRGxDO09BQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBaEI7UUFDSCxlQUFBLElBQW1CLElBQUMsQ0FBQSxVQURqQjs7TUFFTCxJQUFDLENBQUEsR0FBRyxDQUFDLGdCQUFMLENBQXNCLE1BQUEsQ0FBTyxlQUFQLENBQXRCLEVBQStDLElBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBdkQsRUFBMEQsSUFBQyxDQUFBLE1BQU0sQ0FBQyxDQUFsRSxFQUFxRSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQTVFLEVBQW9GLEtBQUssQ0FBQyxjQUExRixFQUEwRyxVQUFVLENBQUMsS0FBckgsRUExQ0Y7O0VBYkk7Ozs7OztBQTZEUixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ2hRakIsSUFBQTs7QUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxtQkFBUjs7QUFFbEIsYUFBQSxHQUFnQjs7QUFDaEIsY0FBQSxHQUFpQjs7QUFDakIsY0FBQSxHQUFpQjs7QUFDakIsZ0JBQUEsR0FBbUI7O0FBRW5CLFNBQUEsR0FBWSxTQUFDLEtBQUQ7QUFDVixNQUFBO0VBQUEsQ0FBQSxHQUFJLGNBQUEsR0FBaUIsQ0FBQyxjQUFBLEdBQWlCLEtBQWxCO0VBQ3JCLElBQUcsS0FBQSxHQUFRLENBQVg7SUFDRSxDQUFBLElBQUssaUJBRFA7O0VBRUEsSUFBRyxLQUFBLEdBQVEsQ0FBWDtJQUNFLENBQUEsSUFBSyxpQkFEUDs7RUFFQSxJQUFHLEtBQUEsR0FBUSxDQUFYO0lBQ0UsQ0FBQSxJQUFLLGlCQURQOztBQUVBLFNBQU87QUFSRzs7QUFVTjtFQUNTLGtCQUFDLEdBQUQsRUFBTyxNQUFQO0FBQ1gsUUFBQTtJQURZLElBQUMsQ0FBQSxNQUFEO0lBQU0sSUFBQyxDQUFBLFNBQUQ7SUFDbEIsSUFBQyxDQUFBLE9BQUQsR0FDRTtNQUFBLE9BQUEsRUFDRTtRQUFBLENBQUEsRUFBRyxTQUFBLENBQVUsQ0FBVixDQUFIO1FBQ0EsSUFBQSxFQUFNLGdCQUROO1FBRUEsT0FBQSxFQUFTLFNBRlQ7UUFHQSxTQUFBLEVBQVcsU0FIWDtRQUlBLEtBQUEsRUFBTyxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxJQUFkLENBSlA7T0FERjtNQU1BLFNBQUEsRUFDRTtRQUFBLENBQUEsRUFBRyxTQUFBLENBQVUsQ0FBVixDQUFIO1FBQ0EsSUFBQSxFQUFNLGtCQUROO1FBRUEsT0FBQSxFQUFTLFNBRlQ7UUFHQSxTQUFBLEVBQVcsU0FIWDtRQUlBLEtBQUEsRUFBTyxJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsSUFBaEIsQ0FKUDtPQVBGO01BWUEsT0FBQSxFQUNFO1FBQUEsQ0FBQSxFQUFHLFNBQUEsQ0FBVSxDQUFWLENBQUg7UUFDQSxJQUFBLEVBQU0sZ0JBRE47UUFFQSxPQUFBLEVBQVMsU0FGVDtRQUdBLFNBQUEsRUFBVyxTQUhYO1FBSUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLElBQWQsQ0FKUDtPQWJGO01Ba0JBLFVBQUEsRUFDRTtRQUFBLENBQUEsRUFBRyxTQUFBLENBQVUsQ0FBVixDQUFIO1FBQ0EsSUFBQSxFQUFNLG1CQUROO1FBRUEsT0FBQSxFQUFTLFNBRlQ7UUFHQSxTQUFBLEVBQVcsU0FIWDtRQUlBLEtBQUEsRUFBTyxJQUFDLENBQUEsVUFBVSxDQUFDLElBQVosQ0FBaUIsSUFBakIsQ0FKUDtPQW5CRjtNQXdCQSxLQUFBLEVBQ0U7UUFBQSxDQUFBLEVBQUcsU0FBQSxDQUFVLENBQVYsQ0FBSDtRQUNBLElBQUEsRUFBTSxjQUROO1FBRUEsT0FBQSxFQUFTLFNBRlQ7UUFHQSxTQUFBLEVBQVcsU0FIWDtRQUlBLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxJQUFaLENBSlA7T0F6QkY7TUE4QkEsQ0FBQSxNQUFBLENBQUEsRUFDRTtRQUFBLENBQUEsRUFBRyxTQUFBLENBQVUsQ0FBVixDQUFIO1FBQ0EsSUFBQSxFQUFNLGFBRE47UUFFQSxPQUFBLEVBQVMsU0FGVDtRQUdBLFNBQUEsRUFBVyxTQUhYO1FBSUEsS0FBQSxFQUFPLElBQUMsRUFBQSxNQUFBLEVBQU0sQ0FBQyxJQUFSLENBQWEsSUFBYixDQUpQO09BL0JGO01Bb0NBLENBQUEsTUFBQSxDQUFBLEVBQ0U7UUFBQSxDQUFBLEVBQUcsU0FBQSxDQUFVLENBQVYsQ0FBSDtRQUNBLElBQUEsRUFBTSxjQUROO1FBRUEsT0FBQSxFQUFTLFNBRlQ7UUFHQSxTQUFBLEVBQVcsU0FIWDtRQUlBLEtBQUEsRUFBTyxJQUFDLEVBQUEsTUFBQSxFQUFNLENBQUMsSUFBUixDQUFhLElBQWIsQ0FKUDtPQXJDRjtNQTBDQSxNQUFBLEVBQ0U7UUFBQSxDQUFBLEVBQUcsU0FBQSxDQUFVLENBQVYsQ0FBSDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsT0FBQSxFQUFTLFNBRlQ7UUFHQSxTQUFBLEVBQVcsU0FIWDtRQUlBLEtBQUEsRUFBTyxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxJQUFiLENBSlA7T0EzQ0Y7O0lBaURGLFdBQUEsR0FBYyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0I7SUFDOUIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCO0lBQ2pDLE9BQUEsR0FBVSxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixXQUFqQixDQUFBLEdBQWdDO0FBQzFDO0FBQUEsU0FBQSxpQkFBQTs7TUFDRSxNQUFNLENBQUMsQ0FBUCxHQUFXO01BQ1gsTUFBTSxDQUFDLENBQVAsR0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsTUFBTSxDQUFDO01BQ25DLE1BQU0sQ0FBQyxDQUFQLEdBQVc7TUFDWCxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQTtBQUpkO0lBTUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsWUFBRCxHQUFnQixHQUEzQjtJQUNuQixJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxHQUFHLENBQUMsWUFBTCxDQUFrQixRQUFsQixFQUErQixnQkFBRCxHQUFrQix1QkFBaEQ7SUFDZCxlQUFBLEdBQWtCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLEdBQTVCO0lBQ2xCLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxZQUFMLENBQWtCLFFBQWxCLEVBQStCLGVBQUQsR0FBaUIsdUJBQS9DO0FBQ2I7RUFoRVc7O3FCQWtFYixJQUFBLEdBQU0sU0FBQTtBQUNKLFFBQUE7SUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBNUIsRUFBbUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUEzQyxFQUFtRCxTQUFuRDtJQUVBLENBQUEsR0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0I7SUFDcEIsWUFBQSxHQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQjtJQUVoQyxFQUFBLEdBQUssSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCO0lBQ3RCLEVBQUEsR0FBSyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUI7SUFDdEIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxnQkFBTCxDQUFzQixTQUF0QixFQUFpQyxDQUFBLEdBQUksWUFBckMsRUFBbUQsRUFBQSxHQUFLLFlBQXhELEVBQXNFLElBQUMsQ0FBQSxTQUF2RSxFQUFrRixTQUFsRjtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsZ0JBQUwsQ0FBc0IsUUFBdEIsRUFBZ0MsQ0FBQSxHQUFJLFlBQXBDLEVBQWtELEVBQUEsR0FBSyxZQUF2RCxFQUFxRSxJQUFDLENBQUEsU0FBdEUsRUFBaUYsU0FBakY7SUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDLENBQWpDLEVBQW9DLEVBQXBDLEVBQXdDLElBQUMsQ0FBQSxTQUF6QyxFQUFvRCxTQUFwRDtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsZ0JBQUwsQ0FBc0IsUUFBdEIsRUFBZ0MsQ0FBaEMsRUFBbUMsRUFBbkMsRUFBdUMsSUFBQyxDQUFBLFNBQXhDLEVBQW1ELFNBQW5EO0FBRUE7QUFBQSxTQUFBLGlCQUFBOztNQUNFLElBQUMsQ0FBQSxHQUFHLENBQUMsZUFBTCxDQUFxQixNQUFNLENBQUMsQ0FBUCxHQUFXLFlBQWhDLEVBQThDLE1BQU0sQ0FBQyxDQUFQLEdBQVcsWUFBekQsRUFBdUUsTUFBTSxDQUFDLENBQTlFLEVBQWlGLE1BQU0sQ0FBQyxDQUF4RixFQUEyRixNQUFNLENBQUMsQ0FBUCxHQUFXLEdBQXRHLEVBQTJHLE9BQTNHLEVBQW9ILE9BQXBIO01BQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxlQUFMLENBQXFCLE1BQU0sQ0FBQyxDQUE1QixFQUErQixNQUFNLENBQUMsQ0FBdEMsRUFBeUMsTUFBTSxDQUFDLENBQWhELEVBQW1ELE1BQU0sQ0FBQyxDQUExRCxFQUE2RCxNQUFNLENBQUMsQ0FBUCxHQUFXLEdBQXhFLEVBQTZFLE1BQU0sQ0FBQyxPQUFwRixFQUE2RixTQUE3RjtNQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsZ0JBQUwsQ0FBc0IsTUFBTSxDQUFDLElBQTdCLEVBQW1DLE1BQU0sQ0FBQyxDQUFQLEdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBUCxHQUFXLENBQVosQ0FBOUMsRUFBOEQsTUFBTSxDQUFDLENBQVAsR0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFQLEdBQVcsQ0FBWixDQUF6RSxFQUF5RixJQUFDLENBQUEsVUFBMUYsRUFBc0csTUFBTSxDQUFDLFNBQTdHO0FBSEY7SUFLQSxJQUFDLENBQUEsR0FBRyxDQUFDLGFBQUwsQ0FBcUIsQ0FBQyxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBQSxDQUFELENBQUEsR0FBa0IsS0FBdkM7V0FDQSxJQUFDLENBQUEsR0FBRyxDQUFDLFdBQUwsQ0FBQTtFQW5CSTs7cUJBcUJOLFNBQUEsR0FBVyxTQUFDLENBQUQsRUFBSSxDQUFKO0FBQ1QsUUFBQTtBQUFBO0FBQUEsU0FBQSxpQkFBQTs7TUFDRSxJQUFHLENBQUMsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxDQUFaLENBQUEsSUFBa0IsQ0FBQyxDQUFBLEdBQUksQ0FBQyxNQUFNLENBQUMsQ0FBUCxHQUFXLElBQUMsQ0FBQSxZQUFiLENBQUwsQ0FBckI7UUFFRSxNQUFNLENBQUMsS0FBUCxDQUFBLEVBRkY7O0FBREY7RUFEUzs7cUJBT1gsU0FBQSxHQUFXLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxPQUFQLEdBQUE7O3FCQUNYLE9BQUEsR0FBUyxTQUFDLENBQUQsRUFBSSxDQUFKLEdBQUE7O3FCQUVULE9BQUEsR0FBUyxTQUFBO1dBQ1AsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUF4QztFQURPOztxQkFHVCxTQUFBLEdBQVcsU0FBQTtXQUNULElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxDQUFhLGVBQWUsQ0FBQyxVQUFVLENBQUMsTUFBeEM7RUFEUzs7cUJBR1gsT0FBQSxHQUFTLFNBQUE7V0FDUCxJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBYSxlQUFlLENBQUMsVUFBVSxDQUFDLElBQXhDO0VBRE87O3FCQUdULFVBQUEsR0FBWSxTQUFBO1dBQ1YsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLENBQWEsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUF4QztFQURVOztxQkFHWixLQUFBLEdBQU8sU0FBQTtXQUNMLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBTCxDQUFBO0VBREs7O3FCQUdQLE1BQUEsR0FBUSxTQUFBO1dBQ04sSUFBQyxDQUFBLEdBQUcsQ0FBQyxVQUFMLENBQWdCLFFBQWhCO0VBRE07O3NCQUdSLFFBQUEsR0FBUSxTQUFBO0lBQ04sSUFBRyxTQUFTLENBQUMsS0FBVixLQUFtQixNQUF0QjtNQUNFLFNBQVMsQ0FBQyxLQUFWLENBQWdCO1FBQ2QsS0FBQSxFQUFPLG9CQURPO1FBRWQsSUFBQSxFQUFNLElBQUMsQ0FBQSxHQUFHLEVBQUMsTUFBRCxFQUFKLENBQUEsQ0FGUTtPQUFoQjtBQUlBLGFBTEY7O1dBTUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxrQ0FBZCxFQUFrRCxJQUFDLENBQUEsR0FBRyxFQUFDLE1BQUQsRUFBSixDQUFBLENBQWxEO0VBUE07O3NCQVNSLFFBQUEsR0FBUSxTQUFBO0FBQ04sUUFBQTtJQUFBLFlBQUEsR0FBZSxNQUFNLENBQUMsTUFBUCxDQUFjLDhCQUFkLEVBQThDLEVBQTlDO0lBQ2YsSUFBRyxZQUFBLEtBQWdCLElBQW5CO0FBQ0UsYUFERjs7SUFFQSxJQUFHLElBQUMsQ0FBQSxHQUFHLEVBQUMsTUFBRCxFQUFKLENBQVksWUFBWixDQUFIO2FBQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxVQUFMLENBQWdCLFFBQWhCLEVBREY7O0VBSk07Ozs7OztBQU9WLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDckpqQixJQUFBOztBQUFBLE9BQUEsR0FBVSxTQUFDLENBQUQ7QUFDTixNQUFBO0VBQUEsQ0FBQSxHQUFJLENBQUMsQ0FBQztBQUNOLFNBQU0sRUFBRSxDQUFGLEdBQU0sQ0FBWjtJQUNJLENBQUEsR0FBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFqQjtJQUNOLENBQUEsR0FBSSxDQUFFLENBQUEsQ0FBQTtJQUNOLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTyxDQUFFLENBQUEsQ0FBQTtJQUNULENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTztFQUpYO0FBS0EsU0FBTztBQVBEOztBQVNKO0VBQ1MsZUFBQyxVQUFEO0FBQ1gsUUFBQTs7TUFEWSxhQUFhOztJQUN6QixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7SUFDUixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7QUFDVixTQUFTLHlCQUFUO01BQ0UsSUFBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQU4sR0FBVyxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLENBQWxCO01BQ1gsSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBLENBQVIsR0FBYSxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLEtBQWxCO0FBRmY7SUFHQSxJQUFHLFVBQUEsS0FBYyxJQUFqQjtBQUNFLFdBQVMseUJBQVQ7QUFDRSxhQUFTLHlCQUFUO1VBQ0UsSUFBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQVQsR0FBYyxVQUFVLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUE7VUFDakMsSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQVgsR0FBZ0IsVUFBVSxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBO0FBRnZDO0FBREYsT0FERjs7QUFLQTtFQVhXOztrQkFhYixPQUFBLEdBQVMsU0FBQyxVQUFEO0FBQ1AsUUFBQTtBQUFBLFNBQVMseUJBQVQ7QUFDRSxXQUFTLHlCQUFUO1FBQ0UsSUFBRyxJQUFDLENBQUEsSUFBSyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBVCxLQUFlLFVBQVUsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFyQztBQUNFLGlCQUFPLE1BRFQ7O0FBREY7QUFERjtBQUlBLFdBQU87RUFMQTs7Ozs7O0FBT0w7RUFDSixlQUFDLENBQUEsVUFBRCxHQUNFO0lBQUEsSUFBQSxFQUFNLENBQU47SUFDQSxNQUFBLEVBQVEsQ0FEUjtJQUVBLElBQUEsRUFBTSxDQUZOO0lBR0EsT0FBQSxFQUFTLENBSFQ7OztFQUtXLHlCQUFBLEdBQUE7OzRCQUViLFdBQUEsR0FBYSxTQUFDLEtBQUQ7QUFDWCxRQUFBO0lBQUEsUUFBQSxHQUFXLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsSUFBbEI7QUFDWCxTQUFTLHlCQUFUO01BQ0UsUUFBUyxDQUFBLENBQUEsQ0FBVCxHQUFjLElBQUksS0FBSixDQUFVLENBQVYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsQ0FBbEI7QUFEaEI7QUFFQSxTQUFTLHlCQUFUO0FBQ0UsV0FBUyx5QkFBVDtRQUNFLElBQUcsS0FBSyxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQW5CO1VBQ0UsUUFBUyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBWixHQUFpQixLQUFLLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsRUFEakM7O0FBREY7QUFERjtBQUlBLFdBQU87RUFSSTs7NEJBVWIsU0FBQSxHQUFXLFNBQUMsS0FBRCxFQUFRLENBQVIsRUFBVyxDQUFYLEVBQWMsQ0FBZDtBQUNULFFBQUE7QUFBQSxTQUFTLHlCQUFUO01BQ0UsSUFBRyxDQUFDLENBQUEsS0FBSyxDQUFOLENBQUEsSUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFkLEtBQW9CLENBQXJCLENBQWhCO0FBQ0ksZUFBTyxNQURYOztNQUVBLElBQUcsQ0FBQyxDQUFBLEtBQUssQ0FBTixDQUFBLElBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBZCxLQUFvQixDQUFyQixDQUFoQjtBQUNJLGVBQU8sTUFEWDs7QUFIRjtJQU1BLEVBQUEsR0FBSyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUEsR0FBSSxDQUFmLENBQUEsR0FBb0I7SUFDekIsRUFBQSxHQUFLLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQSxHQUFJLENBQWYsQ0FBQSxHQUFvQjtBQUN6QixTQUFTLHlCQUFUO0FBQ0UsV0FBUyx5QkFBVDtRQUNFLElBQUcsQ0FBQyxDQUFBLEtBQUssQ0FBQyxFQUFBLEdBQUssQ0FBTixDQUFOLENBQUEsSUFBbUIsQ0FBQyxDQUFBLEtBQUssQ0FBQyxFQUFBLEdBQUssQ0FBTixDQUFOLENBQXRCO1VBQ0UsSUFBRyxLQUFLLENBQUMsSUFBSyxDQUFBLEVBQUEsR0FBSyxDQUFMLENBQVEsQ0FBQSxFQUFBLEdBQUssQ0FBTCxDQUFuQixLQUE4QixDQUFqQztBQUNFLG1CQUFPLE1BRFQ7V0FERjs7QUFERjtBQURGO0FBS0EsV0FBTztFQWRFOzs0QkFnQlgsV0FBQSxHQUFhLFNBQUMsS0FBRCxFQUFRLENBQVIsRUFBVyxDQUFYO0FBQ1gsUUFBQTtJQUFBLEtBQUEsR0FBUTtBQUNSLFNBQVMsMEJBQVQ7TUFDRSxJQUFHLElBQUMsQ0FBQSxTQUFELENBQVcsS0FBWCxFQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QixDQUFIO1FBQ0UsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLEVBREY7O0FBREY7SUFHQSxJQUFHLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBbEI7TUFDRSxPQUFBLENBQVEsS0FBUixFQURGOztBQUVBLFdBQU87RUFQSTs7NEJBU2IsS0FBQSxHQUFPLFNBQUMsS0FBRDtBQUNMLFFBQUE7SUFBQSxNQUFBLEdBQVMsSUFBSSxLQUFKLENBQVUsS0FBVjtJQUNULE1BQUEsR0FBUyxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLElBQWxCO0FBQ1QsU0FBUyx5QkFBVDtNQUNFLE1BQU8sQ0FBQSxDQUFBLENBQVAsR0FBWSxJQUFJLEtBQUosQ0FBVSxDQUFWLENBQVksQ0FBQyxJQUFiLENBQWtCLElBQWxCO0FBRGQ7SUFJQSxTQUFBLEdBQVk7SUFDWixTQUFBLEdBQVk7QUFDWixXQUFNLFNBQUEsR0FBWSxFQUFsQjtNQUNFLENBQUEsR0FBSSxTQUFBLEdBQVk7TUFDaEIsQ0FBQSxHQUFJLElBQUksQ0FBQyxLQUFMLENBQVcsU0FBQSxHQUFZLENBQXZCO01BRUosSUFBRyxDQUFJLE1BQU0sQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUF4QjtRQUNFLElBQUcsQ0FBQyxTQUFBLEtBQWEsQ0FBZCxDQUFBLElBQXFCLENBQUMsQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFWLEtBQWdCLElBQWpCLENBQUEsSUFBMEIsQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBYixLQUF1QixDQUF4QixDQUEzQixDQUF4QjtVQUNFLE1BQU8sQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQVYsR0FBZSxJQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFEakI7O1FBR0EsSUFBRyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBYixLQUF1QixDQUExQjtVQUNFLE1BQU0sQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFmLEdBQW9CO1VBQ3BCLFNBQUEsR0FBWSxDQUFDLEVBRmY7U0FBQSxNQUFBO1VBSUUsTUFBTSxDQUFDLElBQUssQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQWYsR0FBb0IsTUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLEdBQWIsQ0FBQTtVQUNwQixTQUFBLEdBQVksRUFMZDtTQUpGOztNQVdBLFNBQUEsSUFBYTtNQUNiLElBQUcsU0FBQSxHQUFZLENBQWY7QUFDRSxlQUFPLEtBRFQ7O0lBaEJGO0FBbUJBLFdBQU87RUE1QkY7OzRCQThCUCxpQkFBQSxHQUFtQixTQUFDLEtBQUQ7QUFDakIsUUFBQTtJQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsS0FBRCxDQUFPLEtBQVA7QUFDYixTQUFvQiwrQ0FBcEI7TUFDRSxTQUFBLEdBQVksSUFBQyxDQUFBLEtBQUQsQ0FBTyxLQUFQO01BQ1osSUFBRyxDQUFJLFVBQVUsQ0FBQyxPQUFYLENBQW1CLFNBQW5CLENBQVA7QUFDRSxlQUFPLE1BRFQ7O0FBRkY7QUFJQSxXQUFPO0VBTlU7OzRCQVFuQixnQkFBQSxHQUFrQixTQUFDLGNBQUQ7QUFDaEIsUUFBQTtJQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsS0FBRCxDQUFPLElBQUksS0FBSixDQUFBLENBQVA7QUFFUixTQUFTLHlCQUFUO0FBQ0UsV0FBUyx5QkFBVDtRQUNFLEtBQUssQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFoQixHQUFxQjtBQUR2QjtBQURGO0lBSUEsZUFBQSxHQUFrQixPQUFBLENBQVE7Ozs7a0JBQVI7SUFDbEIsT0FBQSxHQUFVO0FBQ1YsV0FBTSxPQUFBLEdBQVUsY0FBaEI7TUFDRSxJQUFHLGVBQWUsQ0FBQyxNQUFoQixLQUEwQixDQUE3QjtBQUNFLGNBREY7O01BR0EsV0FBQSxHQUFjLGVBQWUsQ0FBQyxHQUFoQixDQUFBO01BQ2QsRUFBQSxHQUFLLFdBQUEsR0FBYztNQUNuQixFQUFBLEdBQUssSUFBSSxDQUFDLEtBQUwsQ0FBVyxXQUFBLEdBQWMsQ0FBekI7TUFFTCxTQUFBLEdBQVksSUFBSSxLQUFKLENBQVUsS0FBVjtNQUNaLFNBQVMsQ0FBQyxJQUFLLENBQUEsRUFBQSxDQUFJLENBQUEsRUFBQSxDQUFuQixHQUF5QjtNQUN6QixTQUFTLENBQUMsTUFBTyxDQUFBLEVBQUEsQ0FBSSxDQUFBLEVBQUEsQ0FBckIsR0FBMkI7TUFDM0IsSUFBRyxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsU0FBbkIsQ0FBSDtRQUNFLEtBQUEsR0FBUTtRQUNSLE9BQUEsSUFBVyxFQUZiO09BQUEsTUFBQTtBQUFBOztJQVhGO0FBa0JBLFdBQU87TUFDTCxLQUFBLEVBQU8sS0FERjtNQUVMLE9BQUEsRUFBUyxPQUZKOztFQTNCUzs7NEJBZ0NsQixRQUFBLEdBQVUsU0FBQyxVQUFEO0FBQ1IsUUFBQTtJQUFBLGNBQUE7QUFBaUIsY0FBTyxVQUFQO0FBQUEsYUFDVixlQUFlLENBQUMsVUFBVSxDQUFDLE9BRGpCO2lCQUM4QjtBQUQ5QixhQUVWLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFGakI7aUJBRThCO0FBRjlCLGFBR1YsZUFBZSxDQUFDLFVBQVUsQ0FBQyxNQUhqQjtpQkFHOEI7QUFIOUI7aUJBSVY7QUFKVTs7SUFNakIsSUFBQSxHQUFPO0FBQ1AsU0FBZSxxQ0FBZjtNQUNFLFNBQUEsR0FBWSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsY0FBbEI7TUFDWixJQUFHLFNBQVMsQ0FBQyxPQUFWLEtBQXFCLGNBQXhCO1FBQ0UsT0FBTyxDQUFDLEdBQVIsQ0FBWSx1QkFBQSxHQUF3QixjQUF4QixHQUF1QyxZQUFuRDtRQUNBLElBQUEsR0FBTztBQUNQLGNBSEY7O01BS0EsSUFBRyxJQUFBLEtBQVEsSUFBWDtRQUNFLElBQUEsR0FBTyxVQURUO09BQUEsTUFFSyxJQUFHLElBQUksQ0FBQyxPQUFMLEdBQWUsU0FBUyxDQUFDLE9BQTVCO1FBQ0gsSUFBQSxHQUFPLFVBREo7O01BRUwsT0FBTyxDQUFDLEdBQVIsQ0FBWSxlQUFBLEdBQWdCLElBQUksQ0FBQyxPQUFyQixHQUE2QixLQUE3QixHQUFrQyxjQUE5QztBQVhGO0lBYUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxxQkFBQSxHQUFzQixJQUFJLENBQUMsT0FBM0IsR0FBbUMsS0FBbkMsR0FBd0MsY0FBcEQ7QUFDQSxXQUFPLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBSSxDQUFDLEtBQWxCO0VBdEJDOzs7Ozs7QUF3QlosTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUN4S2pCLElBQUE7O0FBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSOztBQUVOLElBQUEsR0FBTyxTQUFBO0FBQ0wsTUFBQTtFQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWjtFQUNBLE1BQUEsR0FBUyxRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QjtFQUNULE1BQU0sQ0FBQyxLQUFQLEdBQWUsUUFBUSxDQUFDLGVBQWUsQ0FBQztFQUN4QyxNQUFNLENBQUMsTUFBUCxHQUFnQixRQUFRLENBQUMsZUFBZSxDQUFDO0VBQ3pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBZCxDQUEyQixNQUEzQixFQUFtQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVcsQ0FBQSxDQUFBLENBQTVEO0VBQ0EsVUFBQSxHQUFhLE1BQU0sQ0FBQyxxQkFBUCxDQUFBO0VBRWIsTUFBTSxDQUFDLEdBQVAsR0FBYSxJQUFJLEdBQUosQ0FBUSxNQUFSO0VBRWIsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFlBQXhCLEVBQXNDLFNBQUMsQ0FBRDtBQUNwQyxRQUFBO0lBQUEsQ0FBQyxDQUFDLGNBQUYsQ0FBQTtJQUNBLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWIsR0FBdUIsVUFBVSxDQUFDO0lBQ3RDLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWIsR0FBdUIsVUFBVSxDQUFDO1dBQ3RDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBWCxDQUFxQixDQUFyQixFQUF3QixDQUF4QjtFQUpvQyxDQUF0QztFQU1BLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixXQUF4QixFQUFxQyxTQUFDLENBQUQ7QUFDbkMsUUFBQTtJQUFBLENBQUMsQ0FBQyxjQUFGLENBQUE7SUFDQSxDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFiLEdBQXVCLFVBQVUsQ0FBQztJQUN0QyxDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFiLEdBQXVCLFVBQVUsQ0FBQztXQUN0QyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEI7RUFKbUMsQ0FBckM7RUFNQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsVUFBeEIsRUFBb0MsU0FBQyxDQUFEO0lBQ2xDLENBQUMsQ0FBQyxjQUFGLENBQUE7V0FDQSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQVgsQ0FBQTtFQUZrQyxDQUFwQztFQUlBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixXQUF4QixFQUFxQyxTQUFDLENBQUQ7QUFDbkMsUUFBQTtJQUFBLENBQUMsQ0FBQyxjQUFGLENBQUE7SUFDQSxDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsR0FBWSxVQUFVLENBQUM7SUFDM0IsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO1dBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBWCxDQUFxQixDQUFyQixFQUF3QixDQUF4QjtFQUptQyxDQUFyQztFQU1BLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixXQUF4QixFQUFxQyxTQUFDLENBQUQ7QUFDbkMsUUFBQTtJQUFBLENBQUMsQ0FBQyxjQUFGLENBQUE7SUFDQSxDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsR0FBWSxVQUFVLENBQUM7SUFDM0IsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO0lBQzNCLE9BQUEsR0FBVSxDQUFDLENBQUM7V0FDWixNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsT0FBM0I7RUFMbUMsQ0FBckM7U0FPQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsU0FBeEIsRUFBbUMsU0FBQyxDQUFEO0lBQ2pDLENBQUMsQ0FBQyxjQUFGLENBQUE7V0FDQSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQVgsQ0FBQTtFQUZpQyxDQUFuQztBQXZDSzs7QUEyQ1AsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFNBQUMsQ0FBRDtTQUM1QixJQUFBLENBQUE7QUFENEIsQ0FBaEMsRUFFRSxLQUZGOzs7O0FDN0NBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDQWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJGb250RmFjZU9ic2VydmVyID0gcmVxdWlyZSAnZm9udGZhY2VvYnNlcnZlcidcblxuTWVudVZpZXcgPSByZXF1aXJlICcuL01lbnVWaWV3J1xuQ291bnRlclZpZXcgPSByZXF1aXJlICcuL0NvdW50ZXJWaWV3J1xudmVyc2lvbiA9IHJlcXVpcmUgJy4vdmVyc2lvbidcblxuY2xhc3MgQXBwXG4gIGNvbnN0cnVjdG9yOiAoQGNhbnZhcykgLT5cbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBAbG9hZEZvbnQoXCJzYXhNb25vXCIpXG4gICAgQGZvbnRzID0ge31cblxuICAgIEB2ZXJzaW9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxuICAgIEB2ZXJzaW9uRm9udCA9IEByZWdpc3RlckZvbnQoXCJ2ZXJzaW9uXCIsIFwiI3tAdmVyc2lvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG5cbiAgICBAZ2VuZXJhdGluZ0ZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNClcbiAgICBAZ2VuZXJhdGluZ0ZvbnQgPSBAcmVnaXN0ZXJGb250KFwiZ2VuZXJhdGluZ1wiLCBcIiN7QGdlbmVyYXRpbmdGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuXG4gICAgQHZpZXdzID1cbiAgICAgIG1lbnU6IG5ldyBNZW51Vmlldyh0aGlzLCBAY2FudmFzKVxuICAgICAgY291bnRlcjogbmV3IENvdW50ZXJWaWV3KHRoaXMsIEBjYW52YXMpXG4gICAgQHN3aXRjaFZpZXcoXCJjb3VudGVyXCIpXG5cbiAgbWVhc3VyZUZvbnRzOiAtPlxuICAgIGZvciBmb250TmFtZSwgZiBvZiBAZm9udHNcbiAgICAgIEBjdHguZm9udCA9IGYuc3R5bGVcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gXCJibGFja1wiXG4gICAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcbiAgICAgIGYuaGVpZ2h0ID0gTWF0aC5mbG9vcihAY3R4Lm1lYXN1cmVUZXh0KFwibVwiKS53aWR0aCAqIDEuMSkgIyBiZXN0IGhhY2sgZXZlclxuICAgICAgY29uc29sZS5sb2cgXCJGb250ICN7Zm9udE5hbWV9IG1lYXN1cmVkIGF0ICN7Zi5oZWlnaHR9IHBpeGVsc1wiXG4gICAgcmV0dXJuXG5cbiAgcmVnaXN0ZXJGb250OiAobmFtZSwgc3R5bGUpIC0+XG4gICAgZm9udCA9XG4gICAgICBuYW1lOiBuYW1lXG4gICAgICBzdHlsZTogc3R5bGVcbiAgICAgIGhlaWdodDogMFxuICAgIEBmb250c1tuYW1lXSA9IGZvbnRcbiAgICBAbWVhc3VyZUZvbnRzKClcbiAgICByZXR1cm4gZm9udFxuXG4gIGxvYWRGb250OiAoZm9udE5hbWUpIC0+XG4gICAgZm9udCA9IG5ldyBGb250RmFjZU9ic2VydmVyKGZvbnROYW1lKVxuICAgIGZvbnQubG9hZCgpLnRoZW4gPT5cbiAgICAgIGNvbnNvbGUubG9nKFwiI3tmb250TmFtZX0gbG9hZGVkLCByZWRyYXdpbmcuLi5cIilcbiAgICAgIEBtZWFzdXJlRm9udHMoKVxuICAgICAgQGRyYXcoKVxuXG4gIHN3aXRjaFZpZXc6ICh2aWV3KSAtPlxuICAgIEB2aWV3ID0gQHZpZXdzW3ZpZXddXG4gICAgQGRyYXcoKVxuXG4gIG5ld0dhbWU6IChkaWZmaWN1bHR5KSAtPlxuICAgICMgY29uc29sZS5sb2cgXCJhcHAubmV3R2FtZSgje2RpZmZpY3VsdHl9KVwiXG5cbiAgICAjIEBkcmF3RmlsbCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodCwgXCIjNDQ0NDQ0XCIpXG4gICAgIyBAZHJhd1RleHRDZW50ZXJlZChcIkdlbmVyYXRpbmcsIHBsZWFzZSB3YWl0Li4uXCIsIEBjYW52YXMud2lkdGggLyAyLCBAY2FudmFzLmhlaWdodCAvIDIsIEBnZW5lcmF0aW5nRm9udCwgXCIjZmZmZmZmXCIpXG5cbiAgICAjIHdpbmRvdy5zZXRUaW1lb3V0ID0+XG4gICAgIyBAdmlld3Muc3Vkb2t1Lm5ld0dhbWUoZGlmZmljdWx0eSlcbiAgICAjIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXG4gICAgIyAsIDBcblxuICByZXNldDogLT5cbiAgICAjIEB2aWV3cy5zdWRva3UucmVzZXQoKVxuICAgICMgQHN3aXRjaFZpZXcoXCJzdWRva3VcIilcblxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XG4gICAgIyByZXR1cm4gQHZpZXdzLnN1ZG9rdS5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuXG4gIGV4cG9ydDogLT5cbiAgICAjIHJldHVybiBAdmlld3Muc3Vkb2t1LmV4cG9ydCgpXG5cbiAgaG9sZUNvdW50OiAtPlxuICAgICMgcmV0dXJuIEB2aWV3cy5zdWRva3UuaG9sZUNvdW50KClcblxuICBkcmF3OiAtPlxuICAgIEB2aWV3LmRyYXcoKVxuXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XG4gICAgQHZpZXcubW91c2Vkb3duKHgsIHkpXG5cbiAgbW91c2Vtb3ZlOiAoeCwgeSwgYnV0dG9ucykgLT5cbiAgICBAdmlldy5tb3VzZW1vdmUoeCwgeSwgYnV0dG9ucylcblxuICBtb3VzZXVwOiAoeCwgeSkgLT5cbiAgICBAdmlldy5tb3VzZXVwKHgsIHkpXG5cbiAgZHJhd0ZpbGw6ICh4LCB5LCB3LCBoLCBjb2xvcikgLT5cbiAgICBAY3R4LmJlZ2luUGF0aCgpXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHguZmlsbCgpXG5cbiAgZHJhd1JvdW5kZWRSZWN0OiAoeCwgeSwgdywgaCwgciwgZmlsbENvbG9yID0gbnVsbCwgc3Ryb2tlQ29sb3IgPSBudWxsKSAtPlxuICAgIEBjdHgucm91bmRSZWN0KHgsIHksIHcsIGgsIHIpXG4gICAgaWYgZmlsbENvbG9yICE9IG51bGxcbiAgICAgIEBjdHguZmlsbFN0eWxlID0gZmlsbENvbG9yXG4gICAgICBAY3R4LmZpbGwoKVxuICAgIGlmIHN0cm9rZUNvbG9yICE9IG51bGxcbiAgICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBzdHJva2VDb2xvclxuICAgICAgQGN0eC5zdHJva2UoKVxuICAgIHJldHVyblxuXG4gIGRyYXdSZWN0OiAoeCwgeSwgdywgaCwgY29sb3IsIGxpbmVXaWR0aCA9IDEpIC0+XG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvclxuICAgIEBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdMaW5lOiAoeDEsIHkxLCB4MiwgeTIsIGNvbG9yID0gXCJibGFja1wiLCBsaW5lV2lkdGggPSAxKSAtPlxuICAgIEBjdHguYmVnaW5QYXRoKClcbiAgICBAY3R4LnN0cm9rZVN0eWxlID0gY29sb3JcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxuICAgIEBjdHgubW92ZVRvKHgxLCB5MSlcbiAgICBAY3R4LmxpbmVUbyh4MiwgeTIpXG4gICAgQGN0eC5zdHJva2UoKVxuXG4gIGRyYXdBcmM6ICh4LCB5LCByLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgY29sb3IpIC0+XG4gICAgQGN0eC5iZWdpblBhdGgoKVxuICAgIEBjdHguZmlsbFN0eWxlID0gY29sb3JcbiAgICBAY3R4Lm1vdmVUbyh4LCB5KVxuICAgIEBjdHguYXJjKHgsIHksIHIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKVxuICAgIEBjdHguY2xvc2VQYXRoKClcbiAgICBAY3R4LmZpbGwoKVxuXG4gIGRyYXdUZXh0Q2VudGVyZWQ6ICh0ZXh0LCBjeCwgY3ksIGZvbnQsIGNvbG9yLCByb3QpIC0+XG4gICAgQGN0eC5zYXZlKClcbiAgICBAY3R4LnRyYW5zbGF0ZShjeCwgY3kpXG4gICAgQGN0eC5yb3RhdGUocm90KVxuICAgIEBjdHguZm9udCA9IGZvbnQuc3R5bGVcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCAwLCAoZm9udC5oZWlnaHQgLyAyKSlcbiAgICBAY3R4LnJlc3RvcmUoKVxuXG4gIGRyYXdMb3dlckxlZnQ6ICh0ZXh0LCBjb2xvciA9IFwid2hpdGVcIikgLT5cbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBAY3R4LmZvbnQgPSBAdmVyc2lvbkZvbnQuc3R5bGVcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIlxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgMCwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxuXG4gIGRyYXdWZXJzaW9uOiAoY29sb3IgPSBcIndoaXRlXCIpIC0+XG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgQGN0eC5mb250ID0gQHZlcnNpb25Gb250LnN0eWxlXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxuICAgIEBjdHgudGV4dEFsaWduID0gXCJyaWdodFwiXG4gICAgQGN0eC5maWxsVGV4dChcInYje3ZlcnNpb259XCIsIEBjYW52YXMud2lkdGggLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXG5cbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUucm91bmRSZWN0ID0gKHgsIHksIHcsIGgsIHIpIC0+XG4gIGlmICh3IDwgMiAqIHIpIHRoZW4gciA9IHcgLyAyXG4gIGlmIChoIDwgMiAqIHIpIHRoZW4gciA9IGggLyAyXG4gIEBiZWdpblBhdGgoKVxuICBAbW92ZVRvKHgrciwgeSlcbiAgQGFyY1RvKHgrdywgeSwgICB4K3csIHkraCwgcilcbiAgQGFyY1RvKHgrdywgeStoLCB4LCAgIHkraCwgcilcbiAgQGFyY1RvKHgsICAgeStoLCB4LCAgIHksICAgcilcbiAgQGFyY1RvKHgsICAgeSwgICB4K3csIHksICAgcilcbiAgQGNsb3NlUGF0aCgpXG4gIHJldHVybiB0aGlzXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwXG4iLCJDb2xvciA9XG4gIGhlYWx0aDogXCJ3aGl0ZVwiXG4gIGNoYW5naW5nSGVhbHRoOiBcInJlZFwiXG4gIGNlbnRlcmVkSGVhbHRoOiBcIndoaXRlXCJcblxuVFdPX1BJID0gTWF0aC5QSSAqIDJcblxuY2xvbmUgPSAob2JqKSAtPlxuICAjIFRPRE86IGZpbmQgc29tZXRoaW5nIGJldHRlcj9cbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSlcblxuY2xhc3MgQ291bnRlclZpZXdcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgSW5pdFxuXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cbiAgICBjb25zb2xlLmxvZyBcImNhbnZhcyBzaXplICN7QGNhbnZhcy53aWR0aH14I3tAY2FudmFzLmhlaWdodH1cIlxuXG4gICAgIyBpbml0IGZvbnRzXG4gICAgaGVhbHRoRm9udFBpeGVscyA9IE1hdGguZmxvb3IoQGNhbnZhcy53aWR0aCAqIDAuMzUpXG4gICAgaW5jcmVtZW50Rm9udFBpeGVscyA9IE1hdGguZmxvb3IoQGNhbnZhcy53aWR0aCAqIDAuMDUpXG4gICAgQGZvbnRzID1cbiAgICAgIGhlYWx0aDogICAgQGFwcC5yZWdpc3RlckZvbnQoXCJoZWFsdGhcIiwgICAgXCIje2hlYWx0aEZvbnRQaXhlbHN9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG4gICAgICBpbmNyZW1lbnQ6IEBhcHAucmVnaXN0ZXJGb250KFwiaW5jcmVtZW50XCIsIFwiI3tpbmNyZW1lbnRGb250UGl4ZWxzfXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxuXG4gICAgQGNlbnRlciA9XG4gICAgICB4OiBAY2FudmFzLndpZHRoIC8gMlxuICAgICAgeTogQGNhbnZhcy5oZWlnaHQgLyAyXG5cbiAgICBAc2xpY2VDb3VudCA9IDE2XG4gICAgQGhhbGZTbGljZUNvdW50ID0gTWF0aC5mbG9vcihAc2xpY2VDb3VudCAvIDIpXG5cbiAgICBAZGlhbFJhZGl1cyA9IEBjZW50ZXIueCAqIDAuN1xuICAgIEBkaWFsSW5jcmVtZW50UmFkaXVzID0gQGNlbnRlci54ICogMC42XG5cbiAgICBAbGF5b3V0cyA9IFtdXG5cbiAgICAjIDYgcGxheWVyc1xuICAgIHhzdGVwNiA9IEBjZW50ZXIueCAvIDJcbiAgICB5c3RlcDYgPSBAY2VudGVyLnkgLyAzXG4gICAgQGxheW91dHMucHVzaCB7XG4gICAgICBwbGF5ZXJzOiBbXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoMiwgIHhzdGVwNiAqIDMsIHlzdGVwNiAqIDUpXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoNCwgIHhzdGVwNiwgICAgIHlzdGVwNiAqIDUpXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoNywgIHhzdGVwNiwgICAgIHlzdGVwNiAqIDMpXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoMTAsIHhzdGVwNiwgICAgIHlzdGVwNiAgICApXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoMTIsIHhzdGVwNiAqIDMsIHlzdGVwNiAgICApXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoMTUsIHhzdGVwNiAqIDMsIHlzdGVwNiAqIDMpXG4gICAgICBdXG4gICAgfVxuXG4gICAgQGNob29zZUxheW91dCgwKVxuICAgIEBvbkRyYWdSZXNldCgpXG4gICAgQGRyYXcoKVxuXG4gIGNob29zZUxheW91dDogKGxheW91dCkgLT5cbiAgICBAcGxheWVycyA9IGNsb25lKEBsYXlvdXRzW2xheW91dF0ucGxheWVycylcbiAgICByZXR1cm5cblxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XG4gICAgIyByZXR1cm4gQGNvdW50ZXIuaW1wb3J0KGltcG9ydFN0cmluZylcblxuICBleHBvcnQ6IC0+XG4gICAgcmV0dXJuIFwiXCIgI0Bjb3VudGVyLmV4cG9ydCgpXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZmFjaW5nT3V0QW5nbGU6ICh4LCB5KSAtPlxuICAgIHJldHVybiBNYXRoLmF0YW4yKHkgLSBAY2VudGVyLnksIHggLSBAY2VudGVyLngpIC0gKE1hdGguUEkgLyAyKVxuXG4gIHVucG9sYXI6IChhbmdsZSwgciwgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwKSAtPlxuICAgIHJldHVybiB7XG4gICAgICB4OiBvZmZzZXRYICsgKE1hdGguY29zKGFuZ2xlKSAqIHIpXG4gICAgICB5OiBvZmZzZXRZICsgKE1hdGguc2luKGFuZ2xlKSAqIHIpXG4gICAgfVxuXG4gIHBvc1RvU2xpY2U6ICh4LCB5KSAtPlxuICAgIHBvc0FuZ2xlID0gTWF0aC5hdGFuMih5IC0gQGNlbnRlci55LCB4IC0gQGNlbnRlci54KVxuICAgIGlmIHBvc0FuZ2xlIDwgMFxuICAgICAgcG9zQW5nbGUgKz0gTWF0aC5QSSAqIDJcbiAgICBzbGljZUFuZ2xlID0gVFdPX1BJIC8gQHNsaWNlQ291bnRcbiAgICBhbmdsZSA9IDBcbiAgICBmb3Igc2xpY2UgaW4gWzAuLi5Ac2xpY2VDb3VudF1cbiAgICAgIGlmIChwb3NBbmdsZSA+PSBhbmdsZSkgYW5kIChwb3NBbmdsZSA8IChhbmdsZSArIHNsaWNlQW5nbGUpKVxuICAgICAgICByZXR1cm4gc2xpY2VcbiAgICAgIGFuZ2xlICs9IHNsaWNlQW5nbGVcbiAgICByZXR1cm4gMFxuXG4gIHBsYXllckxheW91dDogKHNsaWNlLCB4LCB5KSAtPlxuICAgIHBsYXllciA9XG4gICAgICB4OiB4XG4gICAgICB5OiB5XG4gICAgICBhbmdsZTogQGZhY2luZ091dEFuZ2xlKHgsIHkpXG4gICAgICBzbGljZTogc2xpY2VcbiAgICAgIGhlYWx0aDogMjBcbiAgICByZXR1cm4gcGxheWVyXG5cbiAgZGlzdGFuY2U6ICh4MCwgeTAsIHgxLCB5MSkgLT5cbiAgICB4ZCA9IHgxIC0geDBcbiAgICB5ZCA9IHkxIC0geTBcbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ZCp4ZCkgKyAoeWQqeWQpKVxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIG9uRHJhZ1BvczogKHgsIHkpIC0+XG4gICAgQGRyYWdnaW5nID0gdHJ1ZVxuXG4gICAgaWYgQGRyYWdTbGljZSA9PSAtMVxuICAgICAgIyBGaWd1cmUgb3V0IHdoaWNoIHBsYXllciB3ZSBzdGFydGVkIG9uXG4gICAgICBjbG9zZXN0SW5kZXggPSAwXG4gICAgICBjbG9zZXN0UG9zaXRpb24gPSBAY2FudmFzLmhlaWdodCAqIDEwMDBcbiAgICAgIGZvciBwbGF5ZXIsIGluZGV4IGluIEBwbGF5ZXJzXG4gICAgICAgIGRpc3QgPSBAZGlzdGFuY2UocGxheWVyLngsIHBsYXllci55LCB4LCB5KVxuICAgICAgICBpZiBjbG9zZXN0UG9zaXRpb24gPiBkaXN0XG4gICAgICAgICAgY2xvc2VzdFBvc2l0aW9uID0gZGlzdFxuICAgICAgICAgIGNsb3Nlc3RJbmRleCA9IGluZGV4XG4gICAgICBAZHJhZ1BsYXllckluZGV4ID0gY2xvc2VzdEluZGV4XG5cbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyBUT0RPOiBkaXN0cmlidXRlIGEgYnVuY2ggb2YgbWF0aCBvdXRcbiAgICAgIEBkcmFnU2xpY2UgPSBAcG9zVG9TbGljZSh4LCB5KVxuXG4gICAgICBAZHJhZ0RlbHRhID0gQGRyYWdTbGljZSAtIEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdLnNsaWNlXG4gICAgICBpZiBAZHJhZ0RlbHRhID4gQGhhbGZTbGljZUNvdW50XG4gICAgICAgIEBkcmFnRGVsdGEgLT0gQHNsaWNlQ291bnRcbiAgICAgIGlmIEBkcmFnRGVsdGEgPCAtQGhhbGZTbGljZUNvdW50XG4gICAgICAgIEBkcmFnRGVsdGEgKz0gQHNsaWNlQ291bnRcbiAgICAgIGNvbnNvbGUubG9nIFwiQGRyYWdEZWx0YSBzdGFydGluZyBhdCAje0BkcmFnRGVsdGF9XCJcbiAgICBlbHNlXG4gICAgICBuZXdEcmFnU2xpY2UgPSBAcG9zVG9TbGljZSh4LCB5KVxuICAgICAgaWYgQGRyYWdTbGljZSAhPSBuZXdEcmFnU2xpY2VcbiAgICAgICAgc2xpY2VPZmZzZXQgPSBuZXdEcmFnU2xpY2UgLSBAZHJhZ1NsaWNlXG4gICAgICAgIGlmIHNsaWNlT2Zmc2V0ID4gQGhhbGZTbGljZUNvdW50XG4gICAgICAgICAgc2xpY2VPZmZzZXQgLT0gQHNsaWNlQ291bnRcbiAgICAgICAgaWYgc2xpY2VPZmZzZXQgPCAtQGhhbGZTbGljZUNvdW50XG4gICAgICAgICAgc2xpY2VPZmZzZXQgKz0gQHNsaWNlQ291bnRcbiAgICAgICAgQGRyYWdEZWx0YSArPSBzbGljZU9mZnNldFxuICAgICAgICBjb25zb2xlLmxvZyBcIkBkcmFnRGVsdGEgbm93IGF0ICN7QGRyYWdEZWx0YX1cIlxuXG4gICAgICAgIEBkcmFnU2xpY2UgPSBuZXdEcmFnU2xpY2VcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBAZHJhZ1ggPSB4XG4gICAgQGRyYWdZID0geVxuICAgICMgQGRyYWdBbmdsZSA9IE1hdGguYXRhbjIoeSAtIEBjZW50ZXIueSwgeCAtIEBjZW50ZXIueClcbiAgICByZXR1cm5cblxuICBvbkRyYWdSZXNldDogLT5cbiAgICBAZHJhZ2dpbmcgPSBmYWxzZVxuICAgIEBkcmFnUGxheWVySW5kZXggPSAtMVxuICAgIEBkcmFnWCA9IC0xXG4gICAgQGRyYWdZID0gLTFcbiAgICBAZHJhZ1NsaWNlID0gLTFcbiAgICBAZHJhZ0RlbHRhID0gMFxuXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcIm1vdXNlZG93biAje3h9LCAje3l9XCJcbiAgICBAb25EcmFnUG9zKHgsIHkpXG4gICAgQGRyYXcoKVxuXG4gIG1vdXNlbW92ZTogKHgsIHksIGJ1dHRvbnMpIC0+XG4gICAgIyBjb25zb2xlLmxvZyBcIm1vdXNlZG93biAje3h9LCAje3l9XCJcbiAgICBpZiBidXR0b25zID09IDFcbiAgICAgIEBvbkRyYWdQb3MoeCwgeSlcbiAgICAgIEBkcmF3KClcblxuICBtb3VzZXVwOiAtPlxuICAgICMgY29uc29sZS5sb2cgXCJtb3VzZXVwICN7eH0sICN7eX1cIlxuXG4gICAgZHJhZ1BsYXllciA9IEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdXG4gICAgbmV3SGVhbHRoID0gZHJhZ1BsYXllci5oZWFsdGhcbiAgICBpZiBAZHJhZ0RlbHRhID4gMVxuICAgICAgbmV3SGVhbHRoICs9IEBkcmFnRGVsdGEgLSAxXG4gICAgZWxzZSBpZiBAZHJhZ0RlbHRhIDwgMFxuICAgICAgbmV3SGVhbHRoICs9IEBkcmFnRGVsdGFcbiAgICBkcmFnUGxheWVyLmhlYWx0aCA9IG5ld0hlYWx0aFxuXG4gICAgQG9uRHJhZ1Jlc2V0KClcbiAgICBAZHJhdygpXG5cbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgc2xpY2VPZmZzZXRUb0RlbHRhOiAob2Zmc2V0KSAtPlxuICAgIGlmIG9mZnNldCA9PSAwXG4gICAgICByZXR1cm4gMFxuXG4gICAgaWYgb2Zmc2V0IDw9IEBoYWxmU2xpY2VDb3VudFxuICAgICAgIyB0cnlpbmcgdG8gaW5jcmVtZW50XG4gICAgICByZXR1cm4gb2Zmc2V0XG4gICAgZWxzZVxuICAgICAgIyB0cnlpbmcgdG8gZGVjcmVtZW50XG4gICAgICByZXR1cm4gLTEgKiAoQHNsaWNlQ291bnQgLSBvZmZzZXQpXG5cbiAgZHJhdzogLT5cbiAgICBjb25zb2xlLmxvZyBcImRyYXcoKVwiXG5cbiAgICAjIENsZWFyIHNjcmVlbiB0byBibGFja1xuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiYmxhY2tcIilcbiAgICAjIEBhcHAuZHJhd1JlY3QoQGNlbnRlci54LCBAY2VudGVyLnksIDEsIDEsIFwid2hpdGVcIiwgMSkgIyBkZWJ1ZyBjZW50ZXIgZG90XG5cbiAgICBmb3IgcGxheWVyLCBpbmRleCBpbiBAcGxheWVyc1xuICAgICAgY29sb3IgPSBDb2xvci5oZWFsdGhcbiAgICAgIGlmIEBkcmFnZ2luZyBhbmQgKGluZGV4ID09IEBkcmFnUGxheWVySW5kZXgpXG4gICAgICAgIGNvbG9yID0gQ29sb3IuY2hhbmdpbmdIZWFsdGhcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChTdHJpbmcocGxheWVyLmhlYWx0aCksIHBsYXllci54LCBwbGF5ZXIueSwgQGZvbnRzLmhlYWx0aCwgY29sb3IsIHBsYXllci5hbmdsZSlcblxuICAgIGlmIEBkcmFnZ2luZ1xuICAgICAgZHJhZ1BsYXllciA9IEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdXG4gICAgICBzbGljZUFuZ2xlID0gVFdPX1BJIC8gQHNsaWNlQ291bnRcbiAgICAgIGhhbGZTbGljZUFuZ2xlID0gc2xpY2VBbmdsZSAvIDJcblxuICAgICAgQGFwcC5kcmF3QXJjKEBjZW50ZXIueCwgQGNlbnRlci55LCBAZGlhbFJhZGl1cywgMCwgVFdPX1BJLCBcIiMzMzMzMzNcIilcblxuICAgICAgZm9yIGkgaW4gWzAuLi5AaGFsZlNsaWNlQ291bnQrMV1cbiAgICAgICAgc2xpY2UgPSAoQGRyYWdTbGljZSArIGkpICUgQHNsaWNlQ291bnRcbiAgICAgICAgYW5nbGUgPSBzbGljZSAqIHNsaWNlQW5nbGVcbiAgICAgICAgdmFsdWUgPSBAZHJhZ0RlbHRhICsgaVxuICAgICAgICBpZiBzbGljZSA9PSBAZHJhZ1NsaWNlXG4gICAgICAgICAgQGFwcC5kcmF3QXJjKEBjZW50ZXIueCwgQGNlbnRlci55LCBAZGlhbFJhZGl1cywgYW5nbGUsIGFuZ2xlICsgc2xpY2VBbmdsZSwgXCIjNTU1NTU1XCIpXG4gICAgICAgIGlmICh2YWx1ZSAhPSAwKSBhbmQgKHZhbHVlICE9IDEpXG4gICAgICAgICAgaWYgdmFsdWUgPiAwXG4gICAgICAgICAgICB0ZXh0ViA9IFwiKyN7dmFsdWUgLSAxfVwiXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBcIiNhYWZmYWFcIlxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRleHRWID0gXCIje3ZhbHVlfVwiXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBcIiNmZmFhYWFcIlxuICAgICAgICAgIHRleHRQb3MgPSBAdW5wb2xhcihhbmdsZSArIGhhbGZTbGljZUFuZ2xlLCBAZGlhbEluY3JlbWVudFJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXG4gICAgICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHRleHRWLCB0ZXh0UG9zLngsIHRleHRQb3MueSwgQGZvbnRzLmluY3JlbWVudCwgdGV4dENvbG9yLCBAZmFjaW5nT3V0QW5nbGUodGV4dFBvcy54LCB0ZXh0UG9zLnkpKVxuXG4gICAgICBmb3IgaSBpbiBbMS4uLkBoYWxmU2xpY2VDb3VudF1cbiAgICAgICAgc2xpY2UgPSAoQHNsaWNlQ291bnQgKyBAZHJhZ1NsaWNlIC0gaSkgJSBAc2xpY2VDb3VudFxuICAgICAgICBhbmdsZSA9IHNsaWNlICogc2xpY2VBbmdsZVxuICAgICAgICB2YWx1ZSA9IEBkcmFnRGVsdGEgLSBpXG4gICAgICAgIGlmICh2YWx1ZSAhPSAwKSBhbmQgKHZhbHVlICE9IDEpXG4gICAgICAgICAgaWYgdmFsdWUgPiAwXG4gICAgICAgICAgICB0ZXh0ViA9IFwiKyN7dmFsdWUgLSAxfVwiXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBcIiNhYWZmYWFcIlxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRleHRWID0gXCIje3ZhbHVlfVwiXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBcIiNmZmFhYWFcIlxuICAgICAgICAgIHRleHRQb3MgPSBAdW5wb2xhcihhbmdsZSArIGhhbGZTbGljZUFuZ2xlLCBAZGlhbEluY3JlbWVudFJhZGl1cywgQGNlbnRlci54LCBAY2VudGVyLnkpXG4gICAgICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHRleHRWLCB0ZXh0UG9zLngsIHRleHRQb3MueSwgQGZvbnRzLmluY3JlbWVudCwgdGV4dENvbG9yLCBAZmFjaW5nT3V0QW5nbGUodGV4dFBvcy54LCB0ZXh0UG9zLnkpKVxuXG4gICAgICBlc3RpbWF0ZWRIZWFsdGggPSBkcmFnUGxheWVyLmhlYWx0aFxuICAgICAgaWYgQGRyYWdEZWx0YSA+IDFcbiAgICAgICAgZXN0aW1hdGVkSGVhbHRoICs9IEBkcmFnRGVsdGEgLSAxXG4gICAgICBlbHNlIGlmIEBkcmFnRGVsdGEgPCAwXG4gICAgICAgIGVzdGltYXRlZEhlYWx0aCArPSBAZHJhZ0RlbHRhXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoU3RyaW5nKGVzdGltYXRlZEhlYWx0aCksIEBjZW50ZXIueCwgQGNlbnRlci55LCBAZm9udHMuaGVhbHRoLCBDb2xvci5jZW50ZXJlZEhlYWx0aCwgZHJhZ1BsYXllci5hbmdsZSlcblxuICAgIHJldHVyblxuXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvdW50ZXJWaWV3XG4iLCJTdWRva3VHZW5lcmF0b3IgPSByZXF1aXJlICcuL1N1ZG9rdUdlbmVyYXRvcidcblxuQlVUVE9OX0hFSUdIVCA9IDAuMDZcbkZJUlNUX0JVVFRPTl9ZID0gMC4yMlxuQlVUVE9OX1NQQUNJTkcgPSAwLjA4XG5CVVRUT05fU0VQQVJBVE9SID0gMC4wM1xuXG5idXR0b25Qb3MgPSAoaW5kZXgpIC0+XG4gIHkgPSBGSVJTVF9CVVRUT05fWSArIChCVVRUT05fU1BBQ0lORyAqIGluZGV4KVxuICBpZiBpbmRleCA+IDNcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcbiAgaWYgaW5kZXggPiA0XG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXG4gIGlmIGluZGV4ID4gNlxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxuICByZXR1cm4geVxuXG5jbGFzcyBNZW51Vmlld1xuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XG4gICAgQGJ1dHRvbnMgPVxuICAgICAgbmV3RWFzeTpcbiAgICAgICAgeTogYnV0dG9uUG9zKDApXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEVhc3lcIlxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzc3MzNcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAbmV3RWFzeS5iaW5kKHRoaXMpXG4gICAgICBuZXdNZWRpdW06XG4gICAgICAgIHk6IGJ1dHRvblBvcygxKVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBNZWRpdW1cIlxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3MzNcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAbmV3TWVkaXVtLmJpbmQodGhpcylcbiAgICAgIG5ld0hhcmQ6XG4gICAgICAgIHk6IGJ1dHRvblBvcygyKVxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBIYXJkXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzMzXCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQG5ld0hhcmQuYmluZCh0aGlzKVxuICAgICAgbmV3RXh0cmVtZTpcbiAgICAgICAgeTogYnV0dG9uUG9zKDMpXG4gICAgICAgIHRleHQ6IFwiTmV3IEdhbWU6IEV4dHJlbWVcIlxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzExMTFcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAbmV3RXh0cmVtZS5iaW5kKHRoaXMpXG4gICAgICByZXNldDpcbiAgICAgICAgeTogYnV0dG9uUG9zKDQpXG4gICAgICAgIHRleHQ6IFwiUmVzZXQgUHV6emxlXCJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzc3XCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQHJlc2V0LmJpbmQodGhpcylcbiAgICAgIGltcG9ydDpcbiAgICAgICAgeTogYnV0dG9uUG9zKDUpXG4gICAgICAgIHRleHQ6IFwiTG9hZCBQdXp6bGVcIlxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzY2NjZcIlxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXG4gICAgICAgIGNsaWNrOiBAaW1wb3J0LmJpbmQodGhpcylcbiAgICAgIGV4cG9ydDpcbiAgICAgICAgeTogYnV0dG9uUG9zKDYpXG4gICAgICAgIHRleHQ6IFwiU2hhcmUgUHV6emxlXCJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM2NjY2XCJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxuICAgICAgICBjbGljazogQGV4cG9ydC5iaW5kKHRoaXMpXG4gICAgICByZXN1bWU6XG4gICAgICAgIHk6IGJ1dHRvblBvcyg3KVxuICAgICAgICB0ZXh0OiBcIlJlc3VtZVwiXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3Nzc3N1wiXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcbiAgICAgICAgY2xpY2s6IEByZXN1bWUuYmluZCh0aGlzKVxuXG4gICAgYnV0dG9uV2lkdGggPSBAY2FudmFzLndpZHRoICogMC44XG4gICAgQGJ1dHRvbkhlaWdodCA9IEBjYW52YXMuaGVpZ2h0ICogQlVUVE9OX0hFSUdIVFxuICAgIGJ1dHRvblggPSAoQGNhbnZhcy53aWR0aCAtIGJ1dHRvbldpZHRoKSAvIDJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXG4gICAgICBidXR0b24ueCA9IGJ1dHRvblhcbiAgICAgIGJ1dHRvbi55ID0gQGNhbnZhcy5oZWlnaHQgKiBidXR0b24ueVxuICAgICAgYnV0dG9uLncgPSBidXR0b25XaWR0aFxuICAgICAgYnV0dG9uLmggPSBAYnV0dG9uSGVpZ2h0XG5cbiAgICBidXR0b25Gb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAYnV0dG9uSGVpZ2h0ICogMC40KVxuICAgIEBidXR0b25Gb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje2J1dHRvbkZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXG4gICAgdGl0bGVGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMSlcbiAgICBAdGl0bGVGb250ID0gQGFwcC5yZWdpc3RlckZvbnQoXCJidXR0b25cIiwgXCIje3RpdGxlRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcbiAgICByZXR1cm5cblxuICBkcmF3OiAtPlxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiIzMzMzMzM1wiKVxuXG4gICAgeCA9IEBjYW52YXMud2lkdGggLyAyXG4gICAgc2hhZG93T2Zmc2V0ID0gQGNhbnZhcy5oZWlnaHQgKiAwLjAxXG5cbiAgICB5MSA9IEBjYW52YXMuaGVpZ2h0ICogMC4wNVxuICAgIHkyID0gQGNhbnZhcy5oZWlnaHQgKiAwLjE1XG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MSArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiU3Vkb2t1XCIsIHggKyBzaGFkb3dPZmZzZXQsIHkyICsgc2hhZG93T2Zmc2V0LCBAdGl0bGVGb250LCBcIiMwMDAwMDBcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJCYWQgR3V5XCIsIHgsIHkxLCBAdGl0bGVGb250LCBcIiNmZmZmZmZcIilcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxuXG4gICAgZm9yIGJ1dHRvbk5hbWUsIGJ1dHRvbiBvZiBAYnV0dG9uc1xuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLnggKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi55ICsgc2hhZG93T2Zmc2V0LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBcImJsYWNrXCIsIFwiYmxhY2tcIilcbiAgICAgIEBhcHAuZHJhd1JvdW5kZWRSZWN0KGJ1dHRvbi54LCBidXR0b24ueSwgYnV0dG9uLncsIGJ1dHRvbi5oLCBidXR0b24uaCAqIDAuMywgYnV0dG9uLmJnQ29sb3IsIFwiIzk5OTk5OVwiKVxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKGJ1dHRvbi50ZXh0LCBidXR0b24ueCArIChidXR0b24udyAvIDIpLCBidXR0b24ueSArIChidXR0b24uaCAvIDIpLCBAYnV0dG9uRm9udCwgYnV0dG9uLnRleHRDb2xvcilcblxuICAgIEBhcHAuZHJhd0xvd2VyTGVmdChcIiN7QGFwcC5ob2xlQ291bnQoKX0vODFcIilcbiAgICBAYXBwLmRyYXdWZXJzaW9uKClcblxuICBtb3VzZWRvd246ICh4LCB5KSAtPlxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcbiAgICAgIGlmICh5ID4gYnV0dG9uLnkpICYmICh5IDwgKGJ1dHRvbi55ICsgQGJ1dHRvbkhlaWdodCkpXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJidXR0b24gcHJlc3NlZDogI3tidXR0b25OYW1lfVwiXG4gICAgICAgIGJ1dHRvbi5jbGljaygpXG4gICAgcmV0dXJuXG5cbiAgbW91c2Vtb3ZlOiAoeCwgeSwgYnV0dG9ucykgLT5cbiAgbW91c2V1cDogKHgsIHkpIC0+XG5cbiAgbmV3RWFzeTogLT5cbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcblxuICBuZXdNZWRpdW06IC0+XG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5Lm1lZGl1bSlcblxuICBuZXdIYXJkOiAtPlxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkKVxuXG4gIG5ld0V4dHJlbWU6IC0+XG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUpXG5cbiAgcmVzZXQ6IC0+XG4gICAgQGFwcC5yZXNldCgpXG5cbiAgcmVzdW1lOiAtPlxuICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxuXG4gIGV4cG9ydDogLT5cbiAgICBpZiBuYXZpZ2F0b3Iuc2hhcmUgIT0gdW5kZWZpbmVkXG4gICAgICBuYXZpZ2F0b3Iuc2hhcmUge1xuICAgICAgICB0aXRsZTogXCJTdWRva3UgU2hhcmVkIEdhbWVcIlxuICAgICAgICB0ZXh0OiBAYXBwLmV4cG9ydCgpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB3aW5kb3cucHJvbXB0KFwiQ29weSB0aGlzIGFuZCBwYXN0ZSB0byBhIGZyaWVuZDpcIiwgQGFwcC5leHBvcnQoKSlcblxuICBpbXBvcnQ6IC0+XG4gICAgaW1wb3J0U3RyaW5nID0gd2luZG93LnByb21wdChcIlBhc3RlIGFuIGV4cG9ydGVkIGdhbWUgaGVyZTpcIiwgXCJcIilcbiAgICBpZiBpbXBvcnRTdHJpbmcgPT0gbnVsbFxuICAgICAgcmV0dXJuXG4gICAgaWYgQGFwcC5pbXBvcnQoaW1wb3J0U3RyaW5nKVxuICAgICAgQGFwcC5zd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXdcbiIsInNodWZmbGUgPSAoYSkgLT5cbiAgICBpID0gYS5sZW5ndGhcbiAgICB3aGlsZSAtLWkgPiAwXG4gICAgICAgIGogPSB+fihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSlcbiAgICAgICAgdCA9IGFbal1cbiAgICAgICAgYVtqXSA9IGFbaV1cbiAgICAgICAgYVtpXSA9IHRcbiAgICByZXR1cm4gYVxuXG5jbGFzcyBCb2FyZFxuICBjb25zdHJ1Y3RvcjogKG90aGVyQm9hcmQgPSBudWxsKSAtPlxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBAbG9ja2VkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXG4gICAgICBAbG9ja2VkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoZmFsc2UpXG4gICAgaWYgb3RoZXJCb2FyZCAhPSBudWxsXG4gICAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgICBAZ3JpZFtpXVtqXSA9IG90aGVyQm9hcmQuZ3JpZFtpXVtqXVxuICAgICAgICAgIEBsb2NrZWRbaV1bal0gPSBvdGhlckJvYXJkLmxvY2tlZFtpXVtqXVxuICAgIHJldHVyblxuXG4gIG1hdGNoZXM6IChvdGhlckJvYXJkKSAtPlxuICAgIGZvciBqIGluIFswLi4uOV1cbiAgICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgICAgaWYgQGdyaWRbaV1bal0gIT0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcblxuY2xhc3MgU3Vkb2t1R2VuZXJhdG9yXG4gIEBkaWZmaWN1bHR5OlxuICAgIGVhc3k6IDFcbiAgICBtZWRpdW06IDJcbiAgICBoYXJkOiAzXG4gICAgZXh0cmVtZTogNFxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuXG4gIGJvYXJkVG9HcmlkOiAoYm9hcmQpIC0+XG4gICAgbmV3Qm9hcmQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIG5ld0JvYXJkW2ldID0gbmV3IEFycmF5KDkpLmZpbGwoMClcbiAgICBmb3IgaiBpbiBbMC4uLjldXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICAgIGlmIGJvYXJkLmxvY2tlZFtpXVtqXVxuICAgICAgICAgIG5ld0JvYXJkW2ldW2pdID0gYm9hcmQuZ3JpZFtpXVtqXVxuICAgIHJldHVybiBuZXdCb2FyZFxuXG4gIGNlbGxWYWxpZDogKGJvYXJkLCB4LCB5LCB2KSAtPlxuICAgIGZvciBpIGluIFswLi4uOV1cbiAgICAgIGlmICh4ICE9IGkpIGFuZCAoYm9hcmQuZ3JpZFtpXVt5XSA9PSB2KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgaWYgKHkgIT0gaSkgYW5kIChib2FyZC5ncmlkW3hdW2ldID09IHYpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xuICAgIHN5ID0gTWF0aC5mbG9vcih5IC8gMykgKiAzXG4gICAgZm9yIGogaW4gWzAuLi4zXVxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxuICAgICAgICBpZiAoeCAhPSAoc3ggKyBpKSkgJiYgKHkgIT0gKHN5ICsgaikpXG4gICAgICAgICAgaWYgYm9hcmQuZ3JpZFtzeCArIGldW3N5ICsgal0gPT0gdlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcblxuICBwZW5jaWxNYXJrczogKGJvYXJkLCB4LCB5KSAtPlxuICAgIG1hcmtzID0gW11cbiAgICBmb3IgdiBpbiBbMS4uOV1cbiAgICAgIGlmIEBjZWxsVmFsaWQoYm9hcmQsIHgsIHksIHYpXG4gICAgICAgIG1hcmtzLnB1c2ggdlxuICAgIGlmIG1hcmtzLmxlbmd0aCA+IDFcbiAgICAgIHNodWZmbGUobWFya3MpXG4gICAgcmV0dXJuIG1hcmtzXG5cbiAgc29sdmU6IChib2FyZCkgLT5cbiAgICBzb2x2ZWQgPSBuZXcgQm9hcmQoYm9hcmQpXG4gICAgcGVuY2lsID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcbiAgICBmb3IgaSBpbiBbMC4uLjldXG4gICAgICBwZW5jaWxbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxuICAgICMgZGVidWdnZXI7XG5cbiAgICB3YWxrSW5kZXggPSAwXG4gICAgZGlyZWN0aW9uID0gMVxuICAgIHdoaWxlIHdhbGtJbmRleCA8IDgxXG4gICAgICB4ID0gd2Fsa0luZGV4ICUgOVxuICAgICAgeSA9IE1hdGguZmxvb3Iod2Fsa0luZGV4IC8gOSlcblxuICAgICAgaWYgbm90IHNvbHZlZC5sb2NrZWRbeF1beV1cbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PSAxKSBhbmQgKChwZW5jaWxbeF1beV0gPT0gbnVsbCkgb3IgKHBlbmNpbFt4XVt5XS5sZW5ndGggPT0gMCkpXG4gICAgICAgICAgcGVuY2lsW3hdW3ldID0gQHBlbmNpbE1hcmtzKHNvbHZlZCwgeCwgeSlcblxuICAgICAgICBpZiBwZW5jaWxbeF1beV0ubGVuZ3RoID09IDBcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IDBcbiAgICAgICAgICBkaXJlY3Rpb24gPSAtMVxuICAgICAgICBlbHNlXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSBwZW5jaWxbeF1beV0ucG9wKClcbiAgICAgICAgICBkaXJlY3Rpb24gPSAxXG5cbiAgICAgIHdhbGtJbmRleCArPSBkaXJlY3Rpb25cbiAgICAgIGlmIHdhbGtJbmRleCA8IDBcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgIHJldHVybiBzb2x2ZWRcblxuICBoYXNVbmlxdWVTb2x1dGlvbjogKGJvYXJkKSAtPlxuICAgIGZpcnN0U29sdmUgPSBAc29sdmUoYm9hcmQpXG4gICAgZm9yIHVuaWNpdHlUZXN0cyBpbiBbMC4uLjZdXG4gICAgICBuZXh0U29sdmUgPSBAc29sdmUoYm9hcmQpXG4gICAgICBpZiBub3QgZmlyc3RTb2x2ZS5tYXRjaGVzKG5leHRTb2x2ZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcblxuICBnZW5lcmF0ZUludGVybmFsOiAoYW1vdW50VG9SZW1vdmUpIC0+XG4gICAgYm9hcmQgPSBAc29sdmUobmV3IEJvYXJkKCkpXG4gICAgIyBoYWNrXG4gICAgZm9yIGogaW4gWzAuLi45XVxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxuICAgICAgICBib2FyZC5sb2NrZWRbaV1bal0gPSB0cnVlXG5cbiAgICBpbmRleGVzVG9SZW1vdmUgPSBzaHVmZmxlKFswLi4uODFdKVxuICAgIHJlbW92ZWQgPSAwXG4gICAgd2hpbGUgcmVtb3ZlZCA8IGFtb3VudFRvUmVtb3ZlXG4gICAgICBpZiBpbmRleGVzVG9SZW1vdmUubGVuZ3RoID09IDBcbiAgICAgICAgYnJlYWtcblxuICAgICAgcmVtb3ZlSW5kZXggPSBpbmRleGVzVG9SZW1vdmUucG9wKClcbiAgICAgIHJ4ID0gcmVtb3ZlSW5kZXggJSA5XG4gICAgICByeSA9IE1hdGguZmxvb3IocmVtb3ZlSW5kZXggLyA5KVxuXG4gICAgICBuZXh0Qm9hcmQgPSBuZXcgQm9hcmQoYm9hcmQpXG4gICAgICBuZXh0Qm9hcmQuZ3JpZFtyeF1bcnldID0gMFxuICAgICAgbmV4dEJvYXJkLmxvY2tlZFtyeF1bcnldID0gZmFsc2VcbiAgICAgIGlmIEBoYXNVbmlxdWVTb2x1dGlvbihuZXh0Qm9hcmQpXG4gICAgICAgIGJvYXJkID0gbmV4dEJvYXJkXG4gICAgICAgIHJlbW92ZWQgKz0gMVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwic3VjY2Vzc2Z1bGx5IHJlbW92ZWQgI3tyeH0sI3tyeX1cIlxuICAgICAgZWxzZVxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiZmFpbGVkIHRvIHJlbW92ZSAje3J4fSwje3J5fSwgY3JlYXRlcyBub24tdW5pcXVlIHNvbHV0aW9uXCJcblxuICAgIHJldHVybiB7XG4gICAgICBib2FyZDogYm9hcmRcbiAgICAgIHJlbW92ZWQ6IHJlbW92ZWRcbiAgICB9XG5cbiAgZ2VuZXJhdGU6IChkaWZmaWN1bHR5KSAtPlxuICAgIGFtb3VudFRvUmVtb3ZlID0gc3dpdGNoIGRpZmZpY3VsdHlcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSB0aGVuIDYwXG4gICAgICB3aGVuIFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmhhcmQgICAgdGhlbiA1MlxuICAgICAgd2hlbiBTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5tZWRpdW0gIHRoZW4gNDZcbiAgICAgIGVsc2UgNDAgIyBlYXN5IC8gdW5rbm93blxuXG4gICAgYmVzdCA9IG51bGxcbiAgICBmb3IgYXR0ZW1wdCBpbiBbMC4uLjJdXG4gICAgICBnZW5lcmF0ZWQgPSBAZ2VuZXJhdGVJbnRlcm5hbChhbW91bnRUb1JlbW92ZSlcbiAgICAgIGlmIGdlbmVyYXRlZC5yZW1vdmVkID09IGFtb3VudFRvUmVtb3ZlXG4gICAgICAgIGNvbnNvbGUubG9nIFwiUmVtb3ZlZCBleGFjdCBhbW91bnQgI3thbW91bnRUb1JlbW92ZX0sIHN0b3BwaW5nXCJcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgICBicmVha1xuXG4gICAgICBpZiBiZXN0ID09IG51bGxcbiAgICAgICAgYmVzdCA9IGdlbmVyYXRlZFxuICAgICAgZWxzZSBpZiBiZXN0LnJlbW92ZWQgPCBnZW5lcmF0ZWQucmVtb3ZlZFxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXG4gICAgICBjb25zb2xlLmxvZyBcImN1cnJlbnQgYmVzdCAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXG5cbiAgICBjb25zb2xlLmxvZyBcImdpdmluZyB1c2VyIGJvYXJkOiAje2Jlc3QucmVtb3ZlZH0gLyAje2Ftb3VudFRvUmVtb3ZlfVwiXG4gICAgcmV0dXJuIEBib2FyZFRvR3JpZChiZXN0LmJvYXJkKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN1ZG9rdUdlbmVyYXRvclxuXG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcblxuaW5pdCA9IC0+XG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXG4gIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIilcbiAgY2FudmFzLndpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XG4gIGRvY3VtZW50LmJvZHkuaW5zZXJ0QmVmb3JlKGNhbnZhcywgZG9jdW1lbnQuYm9keS5jaGlsZE5vZGVzWzBdKVxuICBjYW52YXNSZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgd2luZG93LmFwcCA9IG5ldyBBcHAoY2FudmFzKVxuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hzdGFydFwiLCAoZSkgLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB4ID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnRcbiAgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxuICAgIHdpbmRvdy5hcHAubW91c2Vkb3duKHgsIHkpXG5cbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaG1vdmVcIiwgKGUpIC0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XG4gICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcbiAgICB3aW5kb3cuYXBwLm1vdXNlbW92ZSh4LCB5KVxuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hlbmRcIiwgKGUpIC0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgd2luZG93LmFwcC5tb3VzZXVwKClcblxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlZG93blwiLCAoZSkgLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB4ID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XG4gICAgeSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXG4gICAgd2luZG93LmFwcC5tb3VzZWRvd24oeCwgeSlcblxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlbW92ZVwiLCAoZSkgLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICB4ID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XG4gICAgeSA9IGUuY2xpZW50WSAtIGNhbnZhc1JlY3QudG9wXG4gICAgYnV0dG9ucyA9IGUuYnV0dG9uc1xuICAgIHdpbmRvdy5hcHAubW91c2Vtb3ZlKHgsIHksIGJ1dHRvbnMpXG5cbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZXVwXCIsIChlKSAtPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHdpbmRvdy5hcHAubW91c2V1cCgpXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpIC0+XG4gICAgaW5pdCgpXG4sIGZhbHNlKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjAuMC4xXCIiLCIvKiBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMC4xMyAtIMKpIEJyYW0gU3RlaW4uIExpY2Vuc2U6IEJTRC0zLUNsYXVzZSAqLyhmdW5jdGlvbigpe2Z1bmN0aW9uIGwoYSxiKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLGIsITEpOmEuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIixiKX1mdW5jdGlvbiBtKGEpe2RvY3VtZW50LmJvZHk/YSgpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbiBjKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjKTthKCl9KTpkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uIGsoKXtpZihcImludGVyYWN0aXZlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGV8fFwiY29tcGxldGVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZSlkb2N1bWVudC5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGspLGEoKX0pfTtmdW5jdGlvbiByKGEpe3RoaXMuYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RoaXMuYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKTt0aGlzLmEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpO3RoaXMuYj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmc9LTE7dGhpcy5iLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmMuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xudGhpcy5mLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmguc3R5bGUuY3NzVGV4dD1cImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7XCI7dGhpcy5iLmFwcGVuZENoaWxkKHRoaXMuaCk7dGhpcy5jLmFwcGVuZENoaWxkKHRoaXMuZik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYyl9XG5mdW5jdGlvbiB0KGEsYil7YS5hLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDpcIitiK1wiO1wifWZ1bmN0aW9uIHkoYSl7dmFyIGI9YS5hLm9mZnNldFdpZHRoLGM9YisxMDA7YS5mLnN0eWxlLndpZHRoPWMrXCJweFwiO2EuYy5zY3JvbGxMZWZ0PWM7YS5iLnNjcm9sbExlZnQ9YS5iLnNjcm9sbFdpZHRoKzEwMDtyZXR1cm4gYS5nIT09Yj8oYS5nPWIsITApOiExfWZ1bmN0aW9uIHooYSxiKXtmdW5jdGlvbiBjKCl7dmFyIGE9azt5KGEpJiZhLmEucGFyZW50Tm9kZSYmYihhLmcpfXZhciBrPWE7bChhLmIsYyk7bChhLmMsYyk7eShhKX07ZnVuY3Rpb24gQShhLGIpe3ZhciBjPWJ8fHt9O3RoaXMuZmFtaWx5PWE7dGhpcy5zdHlsZT1jLnN0eWxlfHxcIm5vcm1hbFwiO3RoaXMud2VpZ2h0PWMud2VpZ2h0fHxcIm5vcm1hbFwiO3RoaXMuc3RyZXRjaD1jLnN0cmV0Y2h8fFwibm9ybWFsXCJ9dmFyIEI9bnVsbCxDPW51bGwsRT1udWxsLEY9bnVsbDtmdW5jdGlvbiBHKCl7aWYobnVsbD09PUMpaWYoSigpJiYvQXBwbGUvLnRlc3Qod2luZG93Lm5hdmlnYXRvci52ZW5kb3IpKXt2YXIgYT0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7Qz0hIWEmJjYwMz5wYXJzZUludChhWzFdLDEwKX1lbHNlIEM9ITE7cmV0dXJuIEN9ZnVuY3Rpb24gSigpe251bGw9PT1GJiYoRj0hIWRvY3VtZW50LmZvbnRzKTtyZXR1cm4gRn1cbmZ1bmN0aW9uIEsoKXtpZihudWxsPT09RSl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7YS5zdHlsZS5mb250PVwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIn1jYXRjaChiKXt9RT1cIlwiIT09YS5zdHlsZS5mb250fXJldHVybiBFfWZ1bmN0aW9uIEwoYSxiKXtyZXR1cm5bYS5zdHlsZSxhLndlaWdodCxLKCk/YS5zdHJldGNoOlwiXCIsXCIxMDBweFwiLGJdLmpvaW4oXCIgXCIpfVxuQS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMsaz1hfHxcIkJFU2Jzd3lcIixxPTAsRD1ifHwzRTMsSD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtpZihKKCkmJiFHKCkpe3ZhciBNPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gZSgpeyhuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PUQ/YigpOmRvY3VtZW50LmZvbnRzLmxvYWQoTChjLCdcIicrYy5mYW1pbHkrJ1wiJyksaykudGhlbihmdW5jdGlvbihjKXsxPD1jLmxlbmd0aD9hKCk6c2V0VGltZW91dChlLDI1KX0sZnVuY3Rpb24oKXtiKCl9KX1lKCl9KSxOPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYyl7cT1zZXRUaW1lb3V0KGMsRCl9KTtQcm9taXNlLnJhY2UoW04sTV0pLnRoZW4oZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQocSk7YShjKX0sZnVuY3Rpb24oKXtiKGMpfSl9ZWxzZSBtKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gdSgpe3ZhciBiO2lmKGI9LTEhPVxuZiYmLTEhPWd8fC0xIT1mJiYtMSE9aHx8LTEhPWcmJi0xIT1oKShiPWYhPWcmJmYhPWgmJmchPWgpfHwobnVsbD09PUImJihiPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSxCPSEhYiYmKDUzNj5wYXJzZUludChiWzFdLDEwKXx8NTM2PT09cGFyc2VJbnQoYlsxXSwxMCkmJjExPj1wYXJzZUludChiWzJdLDEwKSkpLGI9QiYmKGY9PXYmJmc9PXYmJmg9PXZ8fGY9PXcmJmc9PXcmJmg9PXd8fGY9PXgmJmc9PXgmJmg9PXgpKSxiPSFiO2ImJihkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxjbGVhclRpbWVvdXQocSksYShjKSl9ZnVuY3Rpb24gSSgpe2lmKChuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PUQpZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksYihjKTtlbHNle3ZhciBhPWRvY3VtZW50LmhpZGRlbjtpZighMD09PWF8fHZvaWQgMD09PWEpZj1lLmEub2Zmc2V0V2lkdGgsXG5nPW4uYS5vZmZzZXRXaWR0aCxoPXAuYS5vZmZzZXRXaWR0aCx1KCk7cT1zZXRUaW1lb3V0KEksNTApfX12YXIgZT1uZXcgcihrKSxuPW5ldyByKGspLHA9bmV3IHIoayksZj0tMSxnPS0xLGg9LTEsdj0tMSx3PS0xLHg9LTEsZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2QuZGlyPVwibHRyXCI7dChlLEwoYyxcInNhbnMtc2VyaWZcIikpO3QobixMKGMsXCJzZXJpZlwiKSk7dChwLEwoYyxcIm1vbm9zcGFjZVwiKSk7ZC5hcHBlbmRDaGlsZChlLmEpO2QuYXBwZW5kQ2hpbGQobi5hKTtkLmFwcGVuZENoaWxkKHAuYSk7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkKTt2PWUuYS5vZmZzZXRXaWR0aDt3PW4uYS5vZmZzZXRXaWR0aDt4PXAuYS5vZmZzZXRXaWR0aDtJKCk7eihlLGZ1bmN0aW9uKGEpe2Y9YTt1KCl9KTt0KGUsTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNhbnMtc2VyaWYnKSk7eihuLGZ1bmN0aW9uKGEpe2c9YTt1KCl9KTt0KG4sTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNlcmlmJykpO1xueihwLGZ1bmN0aW9uKGEpe2g9YTt1KCl9KTt0KHAsTChjLCdcIicrYy5mYW1pbHkrJ1wiLG1vbm9zcGFjZScpKX0pfSl9O1wib2JqZWN0XCI9PT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPUE6KHdpbmRvdy5Gb250RmFjZU9ic2VydmVyPUEsd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIucHJvdG90eXBlLmxvYWQ9QS5wcm90b3R5cGUubG9hZCk7fSgpKTtcbiJdfQ==
