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
    console.log(e);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lXFxzcmNcXEFwcC5jb2ZmZWUiLCJnYW1lXFxzcmNcXENvdW50ZXJWaWV3LmNvZmZlZSIsImdhbWVcXHNyY1xcTWVudVZpZXcuY29mZmVlIiwiZ2FtZVxcc3JjXFxTdWRva3VHZW5lcmF0b3IuY29mZmVlIiwiZ2FtZVxcc3JjXFxtYWluLmNvZmZlZSIsImdhbWVcXHNyY1xcdmVyc2lvbi5jb2ZmZWUiLCJub2RlX21vZHVsZXMvZm9udGZhY2VvYnNlcnZlci9mb250ZmFjZW9ic2VydmVyLnN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQkFBUjs7QUFFbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUjs7QUFDZCxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVI7O0FBRUo7RUFDUyxhQUFDLE1BQUQ7SUFBQyxJQUFDLENBQUEsU0FBRDtJQUNaLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQW1CLElBQW5CO0lBQ1AsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFWO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVULElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUE1QjtJQUNyQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQUE0QixJQUFDLENBQUEsaUJBQUYsR0FBb0IsdUJBQS9DO0lBRWYsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQTVCO0lBQ3hCLElBQUMsQ0FBQSxjQUFE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UUFBQTtJQUFBLENBQUMsQ0FBQyxjQUFGLENBQUE7SUFDQSxDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsR0FBWSxVQUFVLENBQUM7SUFDM0IsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO1dBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBWCxDQUFxQixDQUFyQixFQUF3QixDQUF4QjtFQUptQyxDQUFyQztFQU1BLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixXQUF4QixFQUFxQyxTQUFDLENBQUQ7QUFDbkMsUUFBQTtJQUFBLENBQUMsQ0FBQyxjQUFGLENBQUE7SUFDQSxDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsR0FBWSxVQUFVLENBQUM7SUFDM0IsQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLEdBQVksVUFBVSxDQUFDO0lBQzNCLE9BQUEsR0FBVSxDQUFDLENBQUM7V0FDWixNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsT0FBM0I7RUFMbUMsQ0FBckM7U0FPQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsU0FBeEIsRUFBbUMsU0FBQyxDQUFEO0lBQ2pDLENBQUMsQ0FBQyxjQUFGLENBQUE7V0FDQSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQVgsQ0FBQTtFQUZpQyxDQUFuQztBQXhDSzs7QUE0Q1AsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFNBQUMsQ0FBRDtTQUM1QixJQUFBLENBQUE7QUFENEIsQ0FBaEMsRUFFRSxLQUZGOzs7O0FDOUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDQWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJGb250RmFjZU9ic2VydmVyID0gcmVxdWlyZSAnZm9udGZhY2VvYnNlcnZlcidcclxuXHJcbk1lbnVWaWV3ID0gcmVxdWlyZSAnLi9NZW51VmlldydcclxuQ291bnRlclZpZXcgPSByZXF1aXJlICcuL0NvdW50ZXJWaWV3J1xyXG52ZXJzaW9uID0gcmVxdWlyZSAnLi92ZXJzaW9uJ1xyXG5cclxuY2xhc3MgQXBwXHJcbiAgY29uc3RydWN0b3I6IChAY2FudmFzKSAtPlxyXG4gICAgQGN0eCA9IEBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpXHJcbiAgICBAbG9hZEZvbnQoXCJzYXhNb25vXCIpXHJcbiAgICBAZm9udHMgPSB7fVxyXG5cclxuICAgIEB2ZXJzaW9uRm9udEhlaWdodCA9IE1hdGguZmxvb3IoQGNhbnZhcy5oZWlnaHQgKiAwLjAyKVxyXG4gICAgQHZlcnNpb25Gb250ID0gQHJlZ2lzdGVyRm9udChcInZlcnNpb25cIiwgXCIje0B2ZXJzaW9uRm9udEhlaWdodH1weCBzYXhNb25vLCBtb25vc3BhY2VcIilcclxuXHJcbiAgICBAZ2VuZXJhdGluZ0ZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBjYW52YXMuaGVpZ2h0ICogMC4wNClcclxuICAgIEBnZW5lcmF0aW5nRm9udCA9IEByZWdpc3RlckZvbnQoXCJnZW5lcmF0aW5nXCIsIFwiI3tAZ2VuZXJhdGluZ0ZvbnRIZWlnaHR9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQHZpZXdzID1cclxuICAgICAgbWVudTogbmV3IE1lbnVWaWV3KHRoaXMsIEBjYW52YXMpXHJcbiAgICAgIGNvdW50ZXI6IG5ldyBDb3VudGVyVmlldyh0aGlzLCBAY2FudmFzKVxyXG4gICAgQHN3aXRjaFZpZXcoXCJjb3VudGVyXCIpXHJcblxyXG4gIG1lYXN1cmVGb250czogLT5cclxuICAgIGZvciBmb250TmFtZSwgZiBvZiBAZm9udHNcclxuICAgICAgQGN0eC5mb250ID0gZi5zdHlsZVxyXG4gICAgICBAY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIlxyXG4gICAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgICAgZi5oZWlnaHQgPSBNYXRoLmZsb29yKEBjdHgubWVhc3VyZVRleHQoXCJtXCIpLndpZHRoICogMS4xKSAjIGJlc3QgaGFjayBldmVyXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiRm9udCAje2ZvbnROYW1lfSBtZWFzdXJlZCBhdCAje2YuaGVpZ2h0fSBwaXhlbHNcIlxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHJlZ2lzdGVyRm9udDogKG5hbWUsIHN0eWxlKSAtPlxyXG4gICAgZm9udCA9XHJcbiAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgc3R5bGU6IHN0eWxlXHJcbiAgICAgIGhlaWdodDogMFxyXG4gICAgQGZvbnRzW25hbWVdID0gZm9udFxyXG4gICAgQG1lYXN1cmVGb250cygpXHJcbiAgICByZXR1cm4gZm9udFxyXG5cclxuICBsb2FkRm9udDogKGZvbnROYW1lKSAtPlxyXG4gICAgZm9udCA9IG5ldyBGb250RmFjZU9ic2VydmVyKGZvbnROYW1lKVxyXG4gICAgZm9udC5sb2FkKCkudGhlbiA9PlxyXG4gICAgICBjb25zb2xlLmxvZyhcIiN7Zm9udE5hbWV9IGxvYWRlZCwgcmVkcmF3aW5nLi4uXCIpXHJcbiAgICAgIEBtZWFzdXJlRm9udHMoKVxyXG4gICAgICBAZHJhdygpXHJcblxyXG4gIHN3aXRjaFZpZXc6ICh2aWV3KSAtPlxyXG4gICAgQHZpZXcgPSBAdmlld3Nbdmlld11cclxuICAgIEBkcmF3KClcclxuXHJcbiAgbmV3R2FtZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiYXBwLm5ld0dhbWUoI3tkaWZmaWN1bHR5fSlcIlxyXG5cclxuICAgICMgQGRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiM0NDQ0NDRcIilcclxuICAgICMgQGRyYXdUZXh0Q2VudGVyZWQoXCJHZW5lcmF0aW5nLCBwbGVhc2Ugd2FpdC4uLlwiLCBAY2FudmFzLndpZHRoIC8gMiwgQGNhbnZhcy5oZWlnaHQgLyAyLCBAZ2VuZXJhdGluZ0ZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgICMgd2luZG93LnNldFRpbWVvdXQgPT5cclxuICAgICMgQHZpZXdzLnN1ZG9rdS5uZXdHYW1lKGRpZmZpY3VsdHkpXHJcbiAgICAjIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcbiAgICAjICwgMFxyXG5cclxuICByZXNldDogLT5cclxuICAgICMgQHZpZXdzLnN1ZG9rdS5yZXNldCgpXHJcbiAgICAjIEBzd2l0Y2hWaWV3KFwic3Vkb2t1XCIpXHJcblxyXG4gIGltcG9ydDogKGltcG9ydFN0cmluZykgLT5cclxuICAgICMgcmV0dXJuIEB2aWV3cy5zdWRva3UuaW1wb3J0KGltcG9ydFN0cmluZylcclxuXHJcbiAgZXhwb3J0OiAtPlxyXG4gICAgIyByZXR1cm4gQHZpZXdzLnN1ZG9rdS5leHBvcnQoKVxyXG5cclxuICBob2xlQ291bnQ6IC0+XHJcbiAgICAjIHJldHVybiBAdmlld3Muc3Vkb2t1LmhvbGVDb3VudCgpXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBAdmlldy5kcmF3KClcclxuXHJcbiAgbW91c2Vkb3duOiAoeCwgeSkgLT5cclxuICAgIEB2aWV3Lm1vdXNlZG93bih4LCB5KVxyXG5cclxuICBtb3VzZW1vdmU6ICh4LCB5LCBidXR0b25zKSAtPlxyXG4gICAgQHZpZXcubW91c2Vtb3ZlKHgsIHksIGJ1dHRvbnMpXHJcblxyXG4gIG1vdXNldXA6ICh4LCB5KSAtPlxyXG4gICAgQHZpZXcubW91c2V1cCh4LCB5KVxyXG5cclxuICBkcmF3RmlsbDogKHgsIHksIHcsIGgsIGNvbG9yKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmZpbGwoKVxyXG5cclxuICBkcmF3Um91bmRlZFJlY3Q6ICh4LCB5LCB3LCBoLCByLCBmaWxsQ29sb3IgPSBudWxsLCBzdHJva2VDb2xvciA9IG51bGwpIC0+XHJcbiAgICBAY3R4LnJvdW5kUmVjdCh4LCB5LCB3LCBoLCByKVxyXG4gICAgaWYgZmlsbENvbG9yICE9IG51bGxcclxuICAgICAgQGN0eC5maWxsU3R5bGUgPSBmaWxsQ29sb3JcclxuICAgICAgQGN0eC5maWxsKClcclxuICAgIGlmIHN0cm9rZUNvbG9yICE9IG51bGxcclxuICAgICAgQGN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZUNvbG9yXHJcbiAgICAgIEBjdHguc3Ryb2tlKClcclxuICAgIHJldHVyblxyXG5cclxuICBkcmF3UmVjdDogKHgsIHksIHcsIGgsIGNvbG9yLCBsaW5lV2lkdGggPSAxKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxyXG4gICAgQGN0eC5yZWN0KHgsIHksIHcsIGgpXHJcbiAgICBAY3R4LnN0cm9rZSgpXHJcblxyXG4gIGRyYXdMaW5lOiAoeDEsIHkxLCB4MiwgeTIsIGNvbG9yID0gXCJibGFja1wiLCBsaW5lV2lkdGggPSAxKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aFxyXG4gICAgQGN0eC5tb3ZlVG8oeDEsIHkxKVxyXG4gICAgQGN0eC5saW5lVG8oeDIsIHkyKVxyXG4gICAgQGN0eC5zdHJva2UoKVxyXG5cclxuICBkcmF3QXJjOiAoeCwgeSwgciwgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGNvbG9yKSAtPlxyXG4gICAgQGN0eC5iZWdpblBhdGgoKVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC5tb3ZlVG8oeCwgeSlcclxuICAgIEBjdHguYXJjKHgsIHksIHIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKVxyXG4gICAgQGN0eC5jbG9zZVBhdGgoKVxyXG4gICAgQGN0eC5maWxsKClcclxuXHJcbiAgZHJhd1RleHRDZW50ZXJlZDogKHRleHQsIGN4LCBjeSwgZm9udCwgY29sb3IsIHJvdCkgLT5cclxuICAgIEBjdHguc2F2ZSgpXHJcbiAgICBAY3R4LnRyYW5zbGF0ZShjeCwgY3kpXHJcbiAgICBAY3R4LnJvdGF0ZShyb3QpXHJcbiAgICBAY3R4LmZvbnQgPSBmb250LnN0eWxlXHJcbiAgICBAY3R4LmZpbGxTdHlsZSA9IGNvbG9yXHJcbiAgICBAY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIEBjdHguZmlsbFRleHQodGV4dCwgMCwgKGZvbnQuaGVpZ2h0IC8gMikpXHJcbiAgICBAY3R4LnJlc3RvcmUoKVxyXG5cclxuICBkcmF3TG93ZXJMZWZ0OiAodGV4dCwgY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcImxlZnRcIlxyXG4gICAgQGN0eC5maWxsVGV4dCh0ZXh0LCAwLCBAY2FudmFzLmhlaWdodCAtIChAdmVyc2lvbkZvbnQuaGVpZ2h0IC8gMikpXHJcblxyXG4gIGRyYXdWZXJzaW9uOiAoY29sb3IgPSBcIndoaXRlXCIpIC0+XHJcbiAgICBAY3R4ID0gQGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcclxuICAgIEBjdHguZm9udCA9IEB2ZXJzaW9uRm9udC5zdHlsZVxyXG4gICAgQGN0eC5maWxsU3R5bGUgPSBjb2xvclxyXG4gICAgQGN0eC50ZXh0QWxpZ24gPSBcInJpZ2h0XCJcclxuICAgIEBjdHguZmlsbFRleHQoXCJ2I3t2ZXJzaW9ufVwiLCBAY2FudmFzLndpZHRoIC0gKEB2ZXJzaW9uRm9udC5oZWlnaHQgLyAyKSwgQGNhbnZhcy5oZWlnaHQgLSAoQHZlcnNpb25Gb250LmhlaWdodCAvIDIpKVxyXG5cclxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5yb3VuZFJlY3QgPSAoeCwgeSwgdywgaCwgcikgLT5cclxuICBpZiAodyA8IDIgKiByKSB0aGVuIHIgPSB3IC8gMlxyXG4gIGlmIChoIDwgMiAqIHIpIHRoZW4gciA9IGggLyAyXHJcbiAgQGJlZ2luUGF0aCgpXHJcbiAgQG1vdmVUbyh4K3IsIHkpXHJcbiAgQGFyY1RvKHgrdywgeSwgICB4K3csIHkraCwgcilcclxuICBAYXJjVG8oeCt3LCB5K2gsIHgsICAgeStoLCByKVxyXG4gIEBhcmNUbyh4LCAgIHkraCwgeCwgICB5LCAgIHIpXHJcbiAgQGFyY1RvKHgsICAgeSwgICB4K3csIHksICAgcilcclxuICBAY2xvc2VQYXRoKClcclxuICByZXR1cm4gdGhpc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBcHBcclxuIiwiQ29sb3IgPVxyXG4gIGhlYWx0aDogXCJ3aGl0ZVwiXHJcbiAgY2hhbmdpbmdIZWFsdGg6IFwicmVkXCJcclxuICBjZW50ZXJlZEhlYWx0aDogXCJ3aGl0ZVwiXHJcblxyXG5UV09fUEkgPSBNYXRoLlBJICogMlxyXG5cclxuY2xvbmUgPSAob2JqKSAtPlxyXG4gICMgVE9ETzogZmluZCBzb21ldGhpbmcgYmV0dGVyP1xyXG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpXHJcblxyXG5jbGFzcyBDb3VudGVyVmlld1xyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICMgSW5pdFxyXG5cclxuICBjb25zdHJ1Y3RvcjogKEBhcHAsIEBjYW52YXMpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcImNhbnZhcyBzaXplICN7QGNhbnZhcy53aWR0aH14I3tAY2FudmFzLmhlaWdodH1cIlxyXG5cclxuICAgICMgaW5pdCBmb250c1xyXG4gICAgaGVhbHRoRm9udFBpeGVscyA9IE1hdGguZmxvb3IoQGNhbnZhcy53aWR0aCAqIDAuMzUpXHJcbiAgICBpbmNyZW1lbnRGb250UGl4ZWxzID0gTWF0aC5mbG9vcihAY2FudmFzLndpZHRoICogMC4wNSlcclxuICAgIEBmb250cyA9XHJcbiAgICAgIGhlYWx0aDogICAgQGFwcC5yZWdpc3RlckZvbnQoXCJoZWFsdGhcIiwgICAgXCIje2hlYWx0aEZvbnRQaXhlbHN9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcbiAgICAgIGluY3JlbWVudDogQGFwcC5yZWdpc3RlckZvbnQoXCJpbmNyZW1lbnRcIiwgXCIje2luY3JlbWVudEZvbnRQaXhlbHN9cHggc2F4TW9ubywgbW9ub3NwYWNlXCIpXHJcblxyXG4gICAgQGNlbnRlciA9XHJcbiAgICAgIHg6IEBjYW52YXMud2lkdGggLyAyXHJcbiAgICAgIHk6IEBjYW52YXMuaGVpZ2h0IC8gMlxyXG5cclxuICAgIEBzbGljZUNvdW50ID0gMTZcclxuICAgIEBoYWxmU2xpY2VDb3VudCA9IE1hdGguZmxvb3IoQHNsaWNlQ291bnQgLyAyKVxyXG5cclxuICAgIEBkaWFsUmFkaXVzID0gQGNlbnRlci54ICogMC43XHJcbiAgICBAZGlhbEluY3JlbWVudFJhZGl1cyA9IEBjZW50ZXIueCAqIDAuNlxyXG5cclxuICAgIEBsYXlvdXRzID0gW11cclxuXHJcbiAgICAjIDYgcGxheWVyc1xyXG4gICAgeHN0ZXA2ID0gQGNlbnRlci54IC8gMlxyXG4gICAgeXN0ZXA2ID0gQGNlbnRlci55IC8gM1xyXG4gICAgQGxheW91dHMucHVzaCB7XHJcbiAgICAgIHBsYXllcnM6IFtcclxuICAgICAgICBAcGxheWVyTGF5b3V0KDIsICB4c3RlcDYgKiAzLCB5c3RlcDYgKiA1KVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoNCwgIHhzdGVwNiwgICAgIHlzdGVwNiAqIDUpXHJcbiAgICAgICAgQHBsYXllckxheW91dCg3LCAgeHN0ZXA2LCAgICAgeXN0ZXA2ICogMylcclxuICAgICAgICBAcGxheWVyTGF5b3V0KDEwLCB4c3RlcDYsICAgICB5c3RlcDYgICAgKVxyXG4gICAgICAgIEBwbGF5ZXJMYXlvdXQoMTIsIHhzdGVwNiAqIDMsIHlzdGVwNiAgICApXHJcbiAgICAgICAgQHBsYXllckxheW91dCgxNSwgeHN0ZXA2ICogMywgeXN0ZXA2ICogMylcclxuICAgICAgXVxyXG4gICAgfVxyXG5cclxuICAgIEBjaG9vc2VMYXlvdXQoMClcclxuICAgIEBvbkRyYWdSZXNldCgpXHJcbiAgICBAZHJhdygpXHJcblxyXG4gIGNob29zZUxheW91dDogKGxheW91dCkgLT5cclxuICAgIEBwbGF5ZXJzID0gY2xvbmUoQGxheW91dHNbbGF5b3V0XS5wbGF5ZXJzKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBpbXBvcnQ6IChpbXBvcnRTdHJpbmcpIC0+XHJcbiAgICAjIHJldHVybiBAY291bnRlci5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICByZXR1cm4gXCJcIiAjQGNvdW50ZXIuZXhwb3J0KClcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIGZhY2luZ091dEFuZ2xlOiAoeCwgeSkgLT5cclxuICAgIHJldHVybiBNYXRoLmF0YW4yKHkgLSBAY2VudGVyLnksIHggLSBAY2VudGVyLngpIC0gKE1hdGguUEkgLyAyKVxyXG5cclxuICB1bnBvbGFyOiAoYW5nbGUsIHIsIG9mZnNldFggPSAwLCBvZmZzZXRZID0gMCkgLT5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IG9mZnNldFggKyAoTWF0aC5jb3MoYW5nbGUpICogcilcclxuICAgICAgeTogb2Zmc2V0WSArIChNYXRoLnNpbihhbmdsZSkgKiByKVxyXG4gICAgfVxyXG5cclxuICBwb3NUb1NsaWNlOiAoeCwgeSkgLT5cclxuICAgIHBvc0FuZ2xlID0gTWF0aC5hdGFuMih5IC0gQGNlbnRlci55LCB4IC0gQGNlbnRlci54KVxyXG4gICAgaWYgcG9zQW5nbGUgPCAwXHJcbiAgICAgIHBvc0FuZ2xlICs9IE1hdGguUEkgKiAyXHJcbiAgICBzbGljZUFuZ2xlID0gVFdPX1BJIC8gQHNsaWNlQ291bnRcclxuICAgIGFuZ2xlID0gMFxyXG4gICAgZm9yIHNsaWNlIGluIFswLi4uQHNsaWNlQ291bnRdXHJcbiAgICAgIGlmIChwb3NBbmdsZSA+PSBhbmdsZSkgYW5kIChwb3NBbmdsZSA8IChhbmdsZSArIHNsaWNlQW5nbGUpKVxyXG4gICAgICAgIHJldHVybiBzbGljZVxyXG4gICAgICBhbmdsZSArPSBzbGljZUFuZ2xlXHJcbiAgICByZXR1cm4gMFxyXG5cclxuICBwbGF5ZXJMYXlvdXQ6IChzbGljZSwgeCwgeSkgLT5cclxuICAgIHBsYXllciA9XHJcbiAgICAgIHg6IHhcclxuICAgICAgeTogeVxyXG4gICAgICBhbmdsZTogQGZhY2luZ091dEFuZ2xlKHgsIHkpXHJcbiAgICAgIHNsaWNlOiBzbGljZVxyXG4gICAgICBoZWFsdGg6IDIwXHJcbiAgICByZXR1cm4gcGxheWVyXHJcblxyXG4gIGRpc3RhbmNlOiAoeDAsIHkwLCB4MSwgeTEpIC0+XHJcbiAgICB4ZCA9IHgxIC0geDBcclxuICAgIHlkID0geTEgLSB5MFxyXG4gICAgcmV0dXJuIE1hdGguc3FydCgoeGQqeGQpICsgKHlkKnlkKSlcclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIG9uRHJhZ1BvczogKHgsIHkpIC0+XHJcbiAgICBAZHJhZ2dpbmcgPSB0cnVlXHJcblxyXG4gICAgaWYgQGRyYWdTbGljZSA9PSAtMVxyXG4gICAgICAjIEZpZ3VyZSBvdXQgd2hpY2ggcGxheWVyIHdlIHN0YXJ0ZWQgb25cclxuICAgICAgY2xvc2VzdEluZGV4ID0gMFxyXG4gICAgICBjbG9zZXN0UG9zaXRpb24gPSBAY2FudmFzLmhlaWdodCAqIDEwMDBcclxuICAgICAgZm9yIHBsYXllciwgaW5kZXggaW4gQHBsYXllcnNcclxuICAgICAgICBkaXN0ID0gQGRpc3RhbmNlKHBsYXllci54LCBwbGF5ZXIueSwgeCwgeSlcclxuICAgICAgICBpZiBjbG9zZXN0UG9zaXRpb24gPiBkaXN0XHJcbiAgICAgICAgICBjbG9zZXN0UG9zaXRpb24gPSBkaXN0XHJcbiAgICAgICAgICBjbG9zZXN0SW5kZXggPSBpbmRleFxyXG4gICAgICBAZHJhZ1BsYXllckluZGV4ID0gY2xvc2VzdEluZGV4XHJcblxyXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgIyBUT0RPOiBkaXN0cmlidXRlIGEgYnVuY2ggb2YgbWF0aCBvdXRcclxuICAgICAgQGRyYWdTbGljZSA9IEBwb3NUb1NsaWNlKHgsIHkpXHJcblxyXG4gICAgICBAZHJhZ0RlbHRhID0gQGRyYWdTbGljZSAtIEBwbGF5ZXJzW0BkcmFnUGxheWVySW5kZXhdLnNsaWNlXHJcbiAgICAgIGlmIEBkcmFnRGVsdGEgPiBAaGFsZlNsaWNlQ291bnRcclxuICAgICAgICBAZHJhZ0RlbHRhIC09IEBzbGljZUNvdW50XHJcbiAgICAgIGlmIEBkcmFnRGVsdGEgPCAtQGhhbGZTbGljZUNvdW50XHJcbiAgICAgICAgQGRyYWdEZWx0YSArPSBAc2xpY2VDb3VudFxyXG4gICAgICBjb25zb2xlLmxvZyBcIkBkcmFnRGVsdGEgc3RhcnRpbmcgYXQgI3tAZHJhZ0RlbHRhfVwiXHJcbiAgICBlbHNlXHJcbiAgICAgIG5ld0RyYWdTbGljZSA9IEBwb3NUb1NsaWNlKHgsIHkpXHJcbiAgICAgIGlmIEBkcmFnU2xpY2UgIT0gbmV3RHJhZ1NsaWNlXHJcbiAgICAgICAgc2xpY2VPZmZzZXQgPSBuZXdEcmFnU2xpY2UgLSBAZHJhZ1NsaWNlXHJcbiAgICAgICAgaWYgc2xpY2VPZmZzZXQgPiBAaGFsZlNsaWNlQ291bnRcclxuICAgICAgICAgIHNsaWNlT2Zmc2V0IC09IEBzbGljZUNvdW50XHJcbiAgICAgICAgaWYgc2xpY2VPZmZzZXQgPCAtQGhhbGZTbGljZUNvdW50XHJcbiAgICAgICAgICBzbGljZU9mZnNldCArPSBAc2xpY2VDb3VudFxyXG4gICAgICAgIEBkcmFnRGVsdGEgKz0gc2xpY2VPZmZzZXRcclxuICAgICAgICBjb25zb2xlLmxvZyBcIkBkcmFnRGVsdGEgbm93IGF0ICN7QGRyYWdEZWx0YX1cIlxyXG5cclxuICAgICAgICBAZHJhZ1NsaWNlID0gbmV3RHJhZ1NsaWNlXHJcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgQGRyYWdYID0geFxyXG4gICAgQGRyYWdZID0geVxyXG4gICAgIyBAZHJhZ0FuZ2xlID0gTWF0aC5hdGFuMih5IC0gQGNlbnRlci55LCB4IC0gQGNlbnRlci54KVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG9uRHJhZ1Jlc2V0OiAtPlxyXG4gICAgQGRyYWdnaW5nID0gZmFsc2VcclxuICAgIEBkcmFnUGxheWVySW5kZXggPSAtMVxyXG4gICAgQGRyYWdYID0gLTFcclxuICAgIEBkcmFnWSA9IC0xXHJcbiAgICBAZHJhZ1NsaWNlID0gLTFcclxuICAgIEBkcmFnRGVsdGEgPSAwXHJcblxyXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwibW91c2Vkb3duICN7eH0sICN7eX1cIlxyXG4gICAgQG9uRHJhZ1Bvcyh4LCB5KVxyXG4gICAgQGRyYXcoKVxyXG5cclxuICBtb3VzZW1vdmU6ICh4LCB5LCBidXR0b25zKSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcIm1vdXNlZG93biAje3h9LCAje3l9XCJcclxuICAgIGlmIGJ1dHRvbnMgPT0gMVxyXG4gICAgICBAb25EcmFnUG9zKHgsIHkpXHJcbiAgICAgIEBkcmF3KClcclxuXHJcbiAgbW91c2V1cDogLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJtb3VzZXVwICN7eH0sICN7eX1cIlxyXG5cclxuICAgIGRyYWdQbGF5ZXIgPSBAcGxheWVyc1tAZHJhZ1BsYXllckluZGV4XVxyXG4gICAgbmV3SGVhbHRoID0gZHJhZ1BsYXllci5oZWFsdGhcclxuICAgIGlmIEBkcmFnRGVsdGEgPiAxXHJcbiAgICAgIG5ld0hlYWx0aCArPSBAZHJhZ0RlbHRhIC0gMVxyXG4gICAgZWxzZSBpZiBAZHJhZ0RlbHRhIDwgMFxyXG4gICAgICBuZXdIZWFsdGggKz0gQGRyYWdEZWx0YVxyXG4gICAgZHJhZ1BsYXllci5oZWFsdGggPSBuZXdIZWFsdGhcclxuXHJcbiAgICBAb25EcmFnUmVzZXQoKVxyXG4gICAgQGRyYXcoKVxyXG5cclxuICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgc2xpY2VPZmZzZXRUb0RlbHRhOiAob2Zmc2V0KSAtPlxyXG4gICAgaWYgb2Zmc2V0ID09IDBcclxuICAgICAgcmV0dXJuIDBcclxuXHJcbiAgICBpZiBvZmZzZXQgPD0gQGhhbGZTbGljZUNvdW50XHJcbiAgICAgICMgdHJ5aW5nIHRvIGluY3JlbWVudFxyXG4gICAgICByZXR1cm4gb2Zmc2V0XHJcbiAgICBlbHNlXHJcbiAgICAgICMgdHJ5aW5nIHRvIGRlY3JlbWVudFxyXG4gICAgICByZXR1cm4gLTEgKiAoQHNsaWNlQ291bnQgLSBvZmZzZXQpXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBjb25zb2xlLmxvZyBcImRyYXcoKVwiXHJcblxyXG4gICAgIyBDbGVhciBzY3JlZW4gdG8gYmxhY2tcclxuICAgIEBhcHAuZHJhd0ZpbGwoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQsIFwiYmxhY2tcIilcclxuICAgICMgQGFwcC5kcmF3UmVjdChAY2VudGVyLngsIEBjZW50ZXIueSwgMSwgMSwgXCJ3aGl0ZVwiLCAxKSAjIGRlYnVnIGNlbnRlciBkb3RcclxuXHJcbiAgICBmb3IgcGxheWVyLCBpbmRleCBpbiBAcGxheWVyc1xyXG4gICAgICBjb2xvciA9IENvbG9yLmhlYWx0aFxyXG4gICAgICBpZiBAZHJhZ2dpbmcgYW5kIChpbmRleCA9PSBAZHJhZ1BsYXllckluZGV4KVxyXG4gICAgICAgIGNvbG9yID0gQ29sb3IuY2hhbmdpbmdIZWFsdGhcclxuICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFN0cmluZyhwbGF5ZXIuaGVhbHRoKSwgcGxheWVyLngsIHBsYXllci55LCBAZm9udHMuaGVhbHRoLCBjb2xvciwgcGxheWVyLmFuZ2xlKVxyXG5cclxuICAgIGlmIEBkcmFnZ2luZ1xyXG4gICAgICBkcmFnUGxheWVyID0gQHBsYXllcnNbQGRyYWdQbGF5ZXJJbmRleF1cclxuICAgICAgc2xpY2VBbmdsZSA9IFRXT19QSSAvIEBzbGljZUNvdW50XHJcbiAgICAgIGhhbGZTbGljZUFuZ2xlID0gc2xpY2VBbmdsZSAvIDJcclxuXHJcbiAgICAgIEBhcHAuZHJhd0FyYyhAY2VudGVyLngsIEBjZW50ZXIueSwgQGRpYWxSYWRpdXMsIDAsIFRXT19QSSwgXCIjMzMzMzMzXCIpXHJcblxyXG4gICAgICBmb3IgaSBpbiBbMC4uLkBoYWxmU2xpY2VDb3VudCsxXVxyXG4gICAgICAgIHNsaWNlID0gKEBkcmFnU2xpY2UgKyBpKSAlIEBzbGljZUNvdW50XHJcbiAgICAgICAgYW5nbGUgPSBzbGljZSAqIHNsaWNlQW5nbGVcclxuICAgICAgICB2YWx1ZSA9IEBkcmFnRGVsdGEgKyBpXHJcbiAgICAgICAgaWYgc2xpY2UgPT0gQGRyYWdTbGljZVxyXG4gICAgICAgICAgQGFwcC5kcmF3QXJjKEBjZW50ZXIueCwgQGNlbnRlci55LCBAZGlhbFJhZGl1cywgYW5nbGUsIGFuZ2xlICsgc2xpY2VBbmdsZSwgXCIjNTU1NTU1XCIpXHJcbiAgICAgICAgaWYgKHZhbHVlICE9IDApIGFuZCAodmFsdWUgIT0gMSlcclxuICAgICAgICAgIGlmIHZhbHVlID4gMFxyXG4gICAgICAgICAgICB0ZXh0ViA9IFwiKyN7dmFsdWUgLSAxfVwiXHJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IFwiI2FhZmZhYVwiXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRleHRWID0gXCIje3ZhbHVlfVwiXHJcbiAgICAgICAgICAgIHRleHRDb2xvciA9IFwiI2ZmYWFhYVwiXHJcbiAgICAgICAgICB0ZXh0UG9zID0gQHVucG9sYXIoYW5nbGUgKyBoYWxmU2xpY2VBbmdsZSwgQGRpYWxJbmNyZW1lbnRSYWRpdXMsIEBjZW50ZXIueCwgQGNlbnRlci55KVxyXG4gICAgICAgICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKHRleHRWLCB0ZXh0UG9zLngsIHRleHRQb3MueSwgQGZvbnRzLmluY3JlbWVudCwgdGV4dENvbG9yLCBAZmFjaW5nT3V0QW5nbGUodGV4dFBvcy54LCB0ZXh0UG9zLnkpKVxyXG5cclxuICAgICAgZm9yIGkgaW4gWzEuLi5AaGFsZlNsaWNlQ291bnRdXHJcbiAgICAgICAgc2xpY2UgPSAoQHNsaWNlQ291bnQgKyBAZHJhZ1NsaWNlIC0gaSkgJSBAc2xpY2VDb3VudFxyXG4gICAgICAgIGFuZ2xlID0gc2xpY2UgKiBzbGljZUFuZ2xlXHJcbiAgICAgICAgdmFsdWUgPSBAZHJhZ0RlbHRhIC0gaVxyXG4gICAgICAgIGlmICh2YWx1ZSAhPSAwKSBhbmQgKHZhbHVlICE9IDEpXHJcbiAgICAgICAgICBpZiB2YWx1ZSA+IDBcclxuICAgICAgICAgICAgdGV4dFYgPSBcIisje3ZhbHVlIC0gMX1cIlxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBcIiNhYWZmYWFcIlxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0ZXh0ViA9IFwiI3t2YWx1ZX1cIlxyXG4gICAgICAgICAgICB0ZXh0Q29sb3IgPSBcIiNmZmFhYWFcIlxyXG4gICAgICAgICAgdGV4dFBvcyA9IEB1bnBvbGFyKGFuZ2xlICsgaGFsZlNsaWNlQW5nbGUsIEBkaWFsSW5jcmVtZW50UmFkaXVzLCBAY2VudGVyLngsIEBjZW50ZXIueSlcclxuICAgICAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZCh0ZXh0ViwgdGV4dFBvcy54LCB0ZXh0UG9zLnksIEBmb250cy5pbmNyZW1lbnQsIHRleHRDb2xvciwgQGZhY2luZ091dEFuZ2xlKHRleHRQb3MueCwgdGV4dFBvcy55KSlcclxuXHJcbiAgICAgIGVzdGltYXRlZEhlYWx0aCA9IGRyYWdQbGF5ZXIuaGVhbHRoXHJcbiAgICAgIGlmIEBkcmFnRGVsdGEgPiAxXHJcbiAgICAgICAgZXN0aW1hdGVkSGVhbHRoICs9IEBkcmFnRGVsdGEgLSAxXHJcbiAgICAgIGVsc2UgaWYgQGRyYWdEZWx0YSA8IDBcclxuICAgICAgICBlc3RpbWF0ZWRIZWFsdGggKz0gQGRyYWdEZWx0YVxyXG4gICAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoU3RyaW5nKGVzdGltYXRlZEhlYWx0aCksIEBjZW50ZXIueCwgQGNlbnRlci55LCBAZm9udHMuaGVhbHRoLCBDb2xvci5jZW50ZXJlZEhlYWx0aCwgZHJhZ1BsYXllci5hbmdsZSlcclxuXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvdW50ZXJWaWV3XHJcbiIsIlN1ZG9rdUdlbmVyYXRvciA9IHJlcXVpcmUgJy4vU3Vkb2t1R2VuZXJhdG9yJ1xyXG5cclxuQlVUVE9OX0hFSUdIVCA9IDAuMDZcclxuRklSU1RfQlVUVE9OX1kgPSAwLjIyXHJcbkJVVFRPTl9TUEFDSU5HID0gMC4wOFxyXG5CVVRUT05fU0VQQVJBVE9SID0gMC4wM1xyXG5cclxuYnV0dG9uUG9zID0gKGluZGV4KSAtPlxyXG4gIHkgPSBGSVJTVF9CVVRUT05fWSArIChCVVRUT05fU1BBQ0lORyAqIGluZGV4KVxyXG4gIGlmIGluZGV4ID4gM1xyXG4gICAgeSArPSBCVVRUT05fU0VQQVJBVE9SXHJcbiAgaWYgaW5kZXggPiA0XHJcbiAgICB5ICs9IEJVVFRPTl9TRVBBUkFUT1JcclxuICBpZiBpbmRleCA+IDZcclxuICAgIHkgKz0gQlVUVE9OX1NFUEFSQVRPUlxyXG4gIHJldHVybiB5XHJcblxyXG5jbGFzcyBNZW51Vmlld1xyXG4gIGNvbnN0cnVjdG9yOiAoQGFwcCwgQGNhbnZhcykgLT5cclxuICAgIEBidXR0b25zID1cclxuICAgICAgbmV3RWFzeTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMClcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFYXN5XCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzc3MzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0Vhc3kuYmluZCh0aGlzKVxyXG4gICAgICBuZXdNZWRpdW06XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDEpXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogTWVkaXVtXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3Nzc3MzNcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld01lZGl1bS5iaW5kKHRoaXMpXHJcbiAgICAgIG5ld0hhcmQ6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDIpXHJcbiAgICAgICAgdGV4dDogXCJOZXcgR2FtZTogSGFyZFwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzMzXCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBuZXdIYXJkLmJpbmQodGhpcylcclxuICAgICAgbmV3RXh0cmVtZTpcclxuICAgICAgICB5OiBidXR0b25Qb3MoMylcclxuICAgICAgICB0ZXh0OiBcIk5ldyBHYW1lOiBFeHRyZW1lXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiM3NzExMTFcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQG5ld0V4dHJlbWUuYmluZCh0aGlzKVxyXG4gICAgICByZXNldDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNClcclxuICAgICAgICB0ZXh0OiBcIlJlc2V0IFB1enpsZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjNzczMzc3XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEByZXNldC5iaW5kKHRoaXMpXHJcbiAgICAgIGltcG9ydDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNSlcclxuICAgICAgICB0ZXh0OiBcIkxvYWQgUHV6emxlXCJcclxuICAgICAgICBiZ0NvbG9yOiBcIiMzMzY2NjZcIlxyXG4gICAgICAgIHRleHRDb2xvcjogXCIjZmZmZmZmXCJcclxuICAgICAgICBjbGljazogQGltcG9ydC5iaW5kKHRoaXMpXHJcbiAgICAgIGV4cG9ydDpcclxuICAgICAgICB5OiBidXR0b25Qb3MoNilcclxuICAgICAgICB0ZXh0OiBcIlNoYXJlIFB1enpsZVwiXHJcbiAgICAgICAgYmdDb2xvcjogXCIjMzM2NjY2XCJcclxuICAgICAgICB0ZXh0Q29sb3I6IFwiI2ZmZmZmZlwiXHJcbiAgICAgICAgY2xpY2s6IEBleHBvcnQuYmluZCh0aGlzKVxyXG4gICAgICByZXN1bWU6XHJcbiAgICAgICAgeTogYnV0dG9uUG9zKDcpXHJcbiAgICAgICAgdGV4dDogXCJSZXN1bWVcIlxyXG4gICAgICAgIGJnQ29sb3I6IFwiIzc3Nzc3N1wiXHJcbiAgICAgICAgdGV4dENvbG9yOiBcIiNmZmZmZmZcIlxyXG4gICAgICAgIGNsaWNrOiBAcmVzdW1lLmJpbmQodGhpcylcclxuXHJcbiAgICBidXR0b25XaWR0aCA9IEBjYW52YXMud2lkdGggKiAwLjhcclxuICAgIEBidXR0b25IZWlnaHQgPSBAY2FudmFzLmhlaWdodCAqIEJVVFRPTl9IRUlHSFRcclxuICAgIGJ1dHRvblggPSAoQGNhbnZhcy53aWR0aCAtIGJ1dHRvbldpZHRoKSAvIDJcclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgYnV0dG9uLnggPSBidXR0b25YXHJcbiAgICAgIGJ1dHRvbi55ID0gQGNhbnZhcy5oZWlnaHQgKiBidXR0b24ueVxyXG4gICAgICBidXR0b24udyA9IGJ1dHRvbldpZHRoXHJcbiAgICAgIGJ1dHRvbi5oID0gQGJ1dHRvbkhlaWdodFxyXG5cclxuICAgIGJ1dHRvbkZvbnRIZWlnaHQgPSBNYXRoLmZsb29yKEBidXR0b25IZWlnaHQgKiAwLjQpXHJcbiAgICBAYnV0dG9uRm9udCA9IEBhcHAucmVnaXN0ZXJGb250KFwiYnV0dG9uXCIsIFwiI3tidXR0b25Gb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgdGl0bGVGb250SGVpZ2h0ID0gTWF0aC5mbG9vcihAY2FudmFzLmhlaWdodCAqIDAuMSlcclxuICAgIEB0aXRsZUZvbnQgPSBAYXBwLnJlZ2lzdGVyRm9udChcImJ1dHRvblwiLCBcIiN7dGl0bGVGb250SGVpZ2h0fXB4IHNheE1vbm8sIG1vbm9zcGFjZVwiKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGRyYXc6IC0+XHJcbiAgICBAYXBwLmRyYXdGaWxsKDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0LCBcIiMzMzMzMzNcIilcclxuXHJcbiAgICB4ID0gQGNhbnZhcy53aWR0aCAvIDJcclxuICAgIHNoYWRvd09mZnNldCA9IEBjYW52YXMuaGVpZ2h0ICogMC4wMVxyXG5cclxuICAgIHkxID0gQGNhbnZhcy5oZWlnaHQgKiAwLjA1XHJcbiAgICB5MiA9IEBjYW52YXMuaGVpZ2h0ICogMC4xNVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4ICsgc2hhZG93T2Zmc2V0LCB5MSArIHNoYWRvd09mZnNldCwgQHRpdGxlRm9udCwgXCIjMDAwMDAwXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCArIHNoYWRvd09mZnNldCwgeTIgKyBzaGFkb3dPZmZzZXQsIEB0aXRsZUZvbnQsIFwiIzAwMDAwMFwiKVxyXG4gICAgQGFwcC5kcmF3VGV4dENlbnRlcmVkKFwiQmFkIEd1eVwiLCB4LCB5MSwgQHRpdGxlRm9udCwgXCIjZmZmZmZmXCIpXHJcbiAgICBAYXBwLmRyYXdUZXh0Q2VudGVyZWQoXCJTdWRva3VcIiwgeCwgeTIsIEB0aXRsZUZvbnQsIFwiI2ZmZmZmZlwiKVxyXG5cclxuICAgIGZvciBidXR0b25OYW1lLCBidXR0b24gb2YgQGJ1dHRvbnNcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLnggKyBzaGFkb3dPZmZzZXQsIGJ1dHRvbi55ICsgc2hhZG93T2Zmc2V0LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBcImJsYWNrXCIsIFwiYmxhY2tcIilcclxuICAgICAgQGFwcC5kcmF3Um91bmRlZFJlY3QoYnV0dG9uLngsIGJ1dHRvbi55LCBidXR0b24udywgYnV0dG9uLmgsIGJ1dHRvbi5oICogMC4zLCBidXR0b24uYmdDb2xvciwgXCIjOTk5OTk5XCIpXHJcbiAgICAgIEBhcHAuZHJhd1RleHRDZW50ZXJlZChidXR0b24udGV4dCwgYnV0dG9uLnggKyAoYnV0dG9uLncgLyAyKSwgYnV0dG9uLnkgKyAoYnV0dG9uLmggLyAyKSwgQGJ1dHRvbkZvbnQsIGJ1dHRvbi50ZXh0Q29sb3IpXHJcblxyXG4gICAgQGFwcC5kcmF3TG93ZXJMZWZ0KFwiI3tAYXBwLmhvbGVDb3VudCgpfS84MVwiKVxyXG4gICAgQGFwcC5kcmF3VmVyc2lvbigpXHJcblxyXG4gIG1vdXNlZG93bjogKHgsIHkpIC0+XHJcbiAgICBmb3IgYnV0dG9uTmFtZSwgYnV0dG9uIG9mIEBidXR0b25zXHJcbiAgICAgIGlmICh5ID4gYnV0dG9uLnkpICYmICh5IDwgKGJ1dHRvbi55ICsgQGJ1dHRvbkhlaWdodCkpXHJcbiAgICAgICAgIyBjb25zb2xlLmxvZyBcImJ1dHRvbiBwcmVzc2VkOiAje2J1dHRvbk5hbWV9XCJcclxuICAgICAgICBidXR0b24uY2xpY2soKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG1vdXNlbW92ZTogKHgsIHksIGJ1dHRvbnMpIC0+XHJcbiAgbW91c2V1cDogKHgsIHkpIC0+XHJcblxyXG4gIG5ld0Vhc3k6IC0+XHJcbiAgICBAYXBwLm5ld0dhbWUoU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZWFzeSlcclxuXHJcbiAgbmV3TWVkaXVtOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5Lm1lZGl1bSlcclxuXHJcbiAgbmV3SGFyZDogLT5cclxuICAgIEBhcHAubmV3R2FtZShTdWRva3VHZW5lcmF0b3IuZGlmZmljdWx0eS5oYXJkKVxyXG5cclxuICBuZXdFeHRyZW1lOiAtPlxyXG4gICAgQGFwcC5uZXdHYW1lKFN1ZG9rdUdlbmVyYXRvci5kaWZmaWN1bHR5LmV4dHJlbWUpXHJcblxyXG4gIHJlc2V0OiAtPlxyXG4gICAgQGFwcC5yZXNldCgpXHJcblxyXG4gIHJlc3VtZTogLT5cclxuICAgIEBhcHAuc3dpdGNoVmlldyhcInN1ZG9rdVwiKVxyXG5cclxuICBleHBvcnQ6IC0+XHJcbiAgICBpZiBuYXZpZ2F0b3Iuc2hhcmUgIT0gdW5kZWZpbmVkXHJcbiAgICAgIG5hdmlnYXRvci5zaGFyZSB7XHJcbiAgICAgICAgdGl0bGU6IFwiU3Vkb2t1IFNoYXJlZCBHYW1lXCJcclxuICAgICAgICB0ZXh0OiBAYXBwLmV4cG9ydCgpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuXHJcbiAgICB3aW5kb3cucHJvbXB0KFwiQ29weSB0aGlzIGFuZCBwYXN0ZSB0byBhIGZyaWVuZDpcIiwgQGFwcC5leHBvcnQoKSlcclxuXHJcbiAgaW1wb3J0OiAtPlxyXG4gICAgaW1wb3J0U3RyaW5nID0gd2luZG93LnByb21wdChcIlBhc3RlIGFuIGV4cG9ydGVkIGdhbWUgaGVyZTpcIiwgXCJcIilcclxuICAgIGlmIGltcG9ydFN0cmluZyA9PSBudWxsXHJcbiAgICAgIHJldHVyblxyXG4gICAgaWYgQGFwcC5pbXBvcnQoaW1wb3J0U3RyaW5nKVxyXG4gICAgICBAYXBwLnN3aXRjaFZpZXcoXCJzdWRva3VcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVudVZpZXdcclxuIiwic2h1ZmZsZSA9IChhKSAtPlxyXG4gICAgaSA9IGEubGVuZ3RoXHJcbiAgICB3aGlsZSAtLWkgPiAwXHJcbiAgICAgICAgaiA9IH5+KE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKVxyXG4gICAgICAgIHQgPSBhW2pdXHJcbiAgICAgICAgYVtqXSA9IGFbaV1cclxuICAgICAgICBhW2ldID0gdFxyXG4gICAgcmV0dXJuIGFcclxuXHJcbmNsYXNzIEJvYXJkXHJcbiAgY29uc3RydWN0b3I6IChvdGhlckJvYXJkID0gbnVsbCkgLT5cclxuICAgIEBncmlkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIEBsb2NrZWQgPSBuZXcgQXJyYXkoOSkuZmlsbChudWxsKVxyXG4gICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKDApXHJcbiAgICAgIEBsb2NrZWRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbChmYWxzZSlcclxuICAgIGlmIG90aGVyQm9hcmQgIT0gbnVsbFxyXG4gICAgICBmb3IgaiBpbiBbMC4uLjldXHJcbiAgICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgICAgQGdyaWRbaV1bal0gPSBvdGhlckJvYXJkLmdyaWRbaV1bal1cclxuICAgICAgICAgIEBsb2NrZWRbaV1bal0gPSBvdGhlckJvYXJkLmxvY2tlZFtpXVtqXVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIG1hdGNoZXM6IChvdGhlckJvYXJkKSAtPlxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgQGdyaWRbaV1bal0gIT0gb3RoZXJCb2FyZC5ncmlkW2ldW2pdXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG5jbGFzcyBTdWRva3VHZW5lcmF0b3JcclxuICBAZGlmZmljdWx0eTpcclxuICAgIGVhc3k6IDFcclxuICAgIG1lZGl1bTogMlxyXG4gICAgaGFyZDogM1xyXG4gICAgZXh0cmVtZTogNFxyXG5cclxuICBjb25zdHJ1Y3RvcjogLT5cclxuXHJcbiAgYm9hcmRUb0dyaWQ6IChib2FyZCkgLT5cclxuICAgIG5ld0JvYXJkID0gbmV3IEFycmF5KDkpLmZpbGwobnVsbClcclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgbmV3Qm9hcmRbaV0gPSBuZXcgQXJyYXkoOSkuZmlsbCgwKVxyXG4gICAgZm9yIGogaW4gWzAuLi45XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgICAgaWYgYm9hcmQubG9ja2VkW2ldW2pdXHJcbiAgICAgICAgICBuZXdCb2FyZFtpXVtqXSA9IGJvYXJkLmdyaWRbaV1bal1cclxuICAgIHJldHVybiBuZXdCb2FyZFxyXG5cclxuICBjZWxsVmFsaWQ6IChib2FyZCwgeCwgeSwgdikgLT5cclxuICAgIGZvciBpIGluIFswLi4uOV1cclxuICAgICAgaWYgKHggIT0gaSkgYW5kIChib2FyZC5ncmlkW2ldW3ldID09IHYpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgaWYgKHkgIT0gaSkgYW5kIChib2FyZC5ncmlkW3hdW2ldID09IHYpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBzeCA9IE1hdGguZmxvb3IoeCAvIDMpICogM1xyXG4gICAgc3kgPSBNYXRoLmZsb29yKHkgLyAzKSAqIDNcclxuICAgIGZvciBqIGluIFswLi4uM11cclxuICAgICAgZm9yIGkgaW4gWzAuLi4zXVxyXG4gICAgICAgIGlmICh4ICE9IChzeCArIGkpKSAmJiAoeSAhPSAoc3kgKyBqKSlcclxuICAgICAgICAgIGlmIGJvYXJkLmdyaWRbc3ggKyBpXVtzeSArIGpdID09IHZcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBwZW5jaWxNYXJrczogKGJvYXJkLCB4LCB5KSAtPlxyXG4gICAgbWFya3MgPSBbXVxyXG4gICAgZm9yIHYgaW4gWzEuLjldXHJcbiAgICAgIGlmIEBjZWxsVmFsaWQoYm9hcmQsIHgsIHksIHYpXHJcbiAgICAgICAgbWFya3MucHVzaCB2XHJcbiAgICBpZiBtYXJrcy5sZW5ndGggPiAxXHJcbiAgICAgIHNodWZmbGUobWFya3MpXHJcbiAgICByZXR1cm4gbWFya3NcclxuXHJcbiAgc29sdmU6IChib2FyZCkgLT5cclxuICAgIHNvbHZlZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgIHBlbmNpbCA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICBmb3IgaSBpbiBbMC4uLjldXHJcbiAgICAgIHBlbmNpbFtpXSA9IG5ldyBBcnJheSg5KS5maWxsKG51bGwpXHJcbiAgICAjIGRlYnVnZ2VyO1xyXG5cclxuICAgIHdhbGtJbmRleCA9IDBcclxuICAgIGRpcmVjdGlvbiA9IDFcclxuICAgIHdoaWxlIHdhbGtJbmRleCA8IDgxXHJcbiAgICAgIHggPSB3YWxrSW5kZXggJSA5XHJcbiAgICAgIHkgPSBNYXRoLmZsb29yKHdhbGtJbmRleCAvIDkpXHJcblxyXG4gICAgICBpZiBub3Qgc29sdmVkLmxvY2tlZFt4XVt5XVxyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT0gMSkgYW5kICgocGVuY2lsW3hdW3ldID09IG51bGwpIG9yIChwZW5jaWxbeF1beV0ubGVuZ3RoID09IDApKVxyXG4gICAgICAgICAgcGVuY2lsW3hdW3ldID0gQHBlbmNpbE1hcmtzKHNvbHZlZCwgeCwgeSlcclxuXHJcbiAgICAgICAgaWYgcGVuY2lsW3hdW3ldLmxlbmd0aCA9PSAwXHJcbiAgICAgICAgICBzb2x2ZWQuZ3JpZFt4XVt5XSA9IDBcclxuICAgICAgICAgIGRpcmVjdGlvbiA9IC0xXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgc29sdmVkLmdyaWRbeF1beV0gPSBwZW5jaWxbeF1beV0ucG9wKClcclxuICAgICAgICAgIGRpcmVjdGlvbiA9IDFcclxuXHJcbiAgICAgIHdhbGtJbmRleCArPSBkaXJlY3Rpb25cclxuICAgICAgaWYgd2Fsa0luZGV4IDwgMFxyXG4gICAgICAgIHJldHVybiBudWxsXHJcblxyXG4gICAgcmV0dXJuIHNvbHZlZFxyXG5cclxuICBoYXNVbmlxdWVTb2x1dGlvbjogKGJvYXJkKSAtPlxyXG4gICAgZmlyc3RTb2x2ZSA9IEBzb2x2ZShib2FyZClcclxuICAgIGZvciB1bmljaXR5VGVzdHMgaW4gWzAuLi42XVxyXG4gICAgICBuZXh0U29sdmUgPSBAc29sdmUoYm9hcmQpXHJcbiAgICAgIGlmIG5vdCBmaXJzdFNvbHZlLm1hdGNoZXMobmV4dFNvbHZlKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgZ2VuZXJhdGVJbnRlcm5hbDogKGFtb3VudFRvUmVtb3ZlKSAtPlxyXG4gICAgYm9hcmQgPSBAc29sdmUobmV3IEJvYXJkKCkpXHJcbiAgICAjIGhhY2tcclxuICAgIGZvciBqIGluIFswLi4uOV1cclxuICAgICAgZm9yIGkgaW4gWzAuLi45XVxyXG4gICAgICAgIGJvYXJkLmxvY2tlZFtpXVtqXSA9IHRydWVcclxuXHJcbiAgICBpbmRleGVzVG9SZW1vdmUgPSBzaHVmZmxlKFswLi4uODFdKVxyXG4gICAgcmVtb3ZlZCA9IDBcclxuICAgIHdoaWxlIHJlbW92ZWQgPCBhbW91bnRUb1JlbW92ZVxyXG4gICAgICBpZiBpbmRleGVzVG9SZW1vdmUubGVuZ3RoID09IDBcclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgcmVtb3ZlSW5kZXggPSBpbmRleGVzVG9SZW1vdmUucG9wKClcclxuICAgICAgcnggPSByZW1vdmVJbmRleCAlIDlcclxuICAgICAgcnkgPSBNYXRoLmZsb29yKHJlbW92ZUluZGV4IC8gOSlcclxuXHJcbiAgICAgIG5leHRCb2FyZCA9IG5ldyBCb2FyZChib2FyZClcclxuICAgICAgbmV4dEJvYXJkLmdyaWRbcnhdW3J5XSA9IDBcclxuICAgICAgbmV4dEJvYXJkLmxvY2tlZFtyeF1bcnldID0gZmFsc2VcclxuICAgICAgaWYgQGhhc1VuaXF1ZVNvbHV0aW9uKG5leHRCb2FyZClcclxuICAgICAgICBib2FyZCA9IG5leHRCb2FyZFxyXG4gICAgICAgIHJlbW92ZWQgKz0gMVxyXG4gICAgICAgICMgY29uc29sZS5sb2cgXCJzdWNjZXNzZnVsbHkgcmVtb3ZlZCAje3J4fSwje3J5fVwiXHJcbiAgICAgIGVsc2VcclxuICAgICAgICAjIGNvbnNvbGUubG9nIFwiZmFpbGVkIHRvIHJlbW92ZSAje3J4fSwje3J5fSwgY3JlYXRlcyBub24tdW5pcXVlIHNvbHV0aW9uXCJcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBib2FyZDogYm9hcmRcclxuICAgICAgcmVtb3ZlZDogcmVtb3ZlZFxyXG4gICAgfVxyXG5cclxuICBnZW5lcmF0ZTogKGRpZmZpY3VsdHkpIC0+XHJcbiAgICBhbW91bnRUb1JlbW92ZSA9IHN3aXRjaCBkaWZmaWN1bHR5XHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuZXh0cmVtZSB0aGVuIDYwXHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkuaGFyZCAgICB0aGVuIDUyXHJcbiAgICAgIHdoZW4gU3Vkb2t1R2VuZXJhdG9yLmRpZmZpY3VsdHkubWVkaXVtICB0aGVuIDQ2XHJcbiAgICAgIGVsc2UgNDAgIyBlYXN5IC8gdW5rbm93blxyXG5cclxuICAgIGJlc3QgPSBudWxsXHJcbiAgICBmb3IgYXR0ZW1wdCBpbiBbMC4uLjJdXHJcbiAgICAgIGdlbmVyYXRlZCA9IEBnZW5lcmF0ZUludGVybmFsKGFtb3VudFRvUmVtb3ZlKVxyXG4gICAgICBpZiBnZW5lcmF0ZWQucmVtb3ZlZCA9PSBhbW91bnRUb1JlbW92ZVxyXG4gICAgICAgIGNvbnNvbGUubG9nIFwiUmVtb3ZlZCBleGFjdCBhbW91bnQgI3thbW91bnRUb1JlbW92ZX0sIHN0b3BwaW5nXCJcclxuICAgICAgICBiZXN0ID0gZ2VuZXJhdGVkXHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIGlmIGJlc3QgPT0gbnVsbFxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgZWxzZSBpZiBiZXN0LnJlbW92ZWQgPCBnZW5lcmF0ZWQucmVtb3ZlZFxyXG4gICAgICAgIGJlc3QgPSBnZW5lcmF0ZWRcclxuICAgICAgY29uc29sZS5sb2cgXCJjdXJyZW50IGJlc3QgI3tiZXN0LnJlbW92ZWR9IC8gI3thbW91bnRUb1JlbW92ZX1cIlxyXG5cclxuICAgIGNvbnNvbGUubG9nIFwiZ2l2aW5nIHVzZXIgYm9hcmQ6ICN7YmVzdC5yZW1vdmVkfSAvICN7YW1vdW50VG9SZW1vdmV9XCJcclxuICAgIHJldHVybiBAYm9hcmRUb0dyaWQoYmVzdC5ib2FyZClcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vkb2t1R2VuZXJhdG9yXHJcblxyXG4iLCJBcHAgPSByZXF1aXJlICcuL0FwcCdcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiaW5pdFwiXHJcbiAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxyXG4gIGNhbnZhcy53aWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG4gIGNhbnZhcy5oZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUoY2FudmFzLCBkb2N1bWVudC5ib2R5LmNoaWxkTm9kZXNbMF0pXHJcbiAgY2FudmFzUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICB3aW5kb3cuYXBwID0gbmV3IEFwcChjYW52YXMpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hzdGFydFwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFkgLSBjYW52YXNSZWN0LnRvcFxyXG4gICAgd2luZG93LmFwcC5tb3VzZWRvd24oeCwgeSlcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIgXCJ0b3VjaG1vdmVcIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIGNvbnNvbGUubG9nIGVcclxuICAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIGNhbnZhc1JlY3QubGVmdFxyXG4gICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAgIHdpbmRvdy5hcHAubW91c2Vtb3ZlKHgsIHksIDEpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwidG91Y2hlbmRcIiwgKGUpIC0+XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIHdpbmRvdy5hcHAubW91c2V1cCgpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB4ID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAgIHdpbmRvdy5hcHAubW91c2Vkb3duKHgsIHkpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vtb3ZlXCIsIChlKSAtPlxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB4ID0gZS5jbGllbnRYIC0gY2FudmFzUmVjdC5sZWZ0XHJcbiAgICB5ID0gZS5jbGllbnRZIC0gY2FudmFzUmVjdC50b3BcclxuICAgIGJ1dHRvbnMgPSBlLmJ1dHRvbnNcclxuICAgIHdpbmRvdy5hcHAubW91c2Vtb3ZlKHgsIHksIGJ1dHRvbnMpXHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyIFwibW91c2V1cFwiLCAoZSkgLT5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgd2luZG93LmFwcC5tb3VzZXVwKClcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpIC0+XHJcbiAgICBpbml0KClcclxuLCBmYWxzZSlcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBcIjAuMC4xXCIiLCIvKiBGb250IEZhY2UgT2JzZXJ2ZXIgdjIuMC4xMyAtIMKpIEJyYW0gU3RlaW4uIExpY2Vuc2U6IEJTRC0zLUNsYXVzZSAqLyhmdW5jdGlvbigpe2Z1bmN0aW9uIGwoYSxiKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLGIsITEpOmEuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIixiKX1mdW5jdGlvbiBtKGEpe2RvY3VtZW50LmJvZHk/YSgpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbiBjKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjKTthKCl9KTpkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uIGsoKXtpZihcImludGVyYWN0aXZlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGV8fFwiY29tcGxldGVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZSlkb2N1bWVudC5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGspLGEoKX0pfTtmdW5jdGlvbiByKGEpe3RoaXMuYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RoaXMuYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKTt0aGlzLmEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpO3RoaXMuYj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmc9LTE7dGhpcy5iLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmMuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xudGhpcy5mLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmguc3R5bGUuY3NzVGV4dD1cImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7XCI7dGhpcy5iLmFwcGVuZENoaWxkKHRoaXMuaCk7dGhpcy5jLmFwcGVuZENoaWxkKHRoaXMuZik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYyl9XG5mdW5jdGlvbiB0KGEsYil7YS5hLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDpcIitiK1wiO1wifWZ1bmN0aW9uIHkoYSl7dmFyIGI9YS5hLm9mZnNldFdpZHRoLGM9YisxMDA7YS5mLnN0eWxlLndpZHRoPWMrXCJweFwiO2EuYy5zY3JvbGxMZWZ0PWM7YS5iLnNjcm9sbExlZnQ9YS5iLnNjcm9sbFdpZHRoKzEwMDtyZXR1cm4gYS5nIT09Yj8oYS5nPWIsITApOiExfWZ1bmN0aW9uIHooYSxiKXtmdW5jdGlvbiBjKCl7dmFyIGE9azt5KGEpJiZhLmEucGFyZW50Tm9kZSYmYihhLmcpfXZhciBrPWE7bChhLmIsYyk7bChhLmMsYyk7eShhKX07ZnVuY3Rpb24gQShhLGIpe3ZhciBjPWJ8fHt9O3RoaXMuZmFtaWx5PWE7dGhpcy5zdHlsZT1jLnN0eWxlfHxcIm5vcm1hbFwiO3RoaXMud2VpZ2h0PWMud2VpZ2h0fHxcIm5vcm1hbFwiO3RoaXMuc3RyZXRjaD1jLnN0cmV0Y2h8fFwibm9ybWFsXCJ9dmFyIEI9bnVsbCxDPW51bGwsRT1udWxsLEY9bnVsbDtmdW5jdGlvbiBHKCl7aWYobnVsbD09PUMpaWYoSigpJiYvQXBwbGUvLnRlc3Qod2luZG93Lm5hdmlnYXRvci52ZW5kb3IpKXt2YXIgYT0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7Qz0hIWEmJjYwMz5wYXJzZUludChhWzFdLDEwKX1lbHNlIEM9ITE7cmV0dXJuIEN9ZnVuY3Rpb24gSigpe251bGw9PT1GJiYoRj0hIWRvY3VtZW50LmZvbnRzKTtyZXR1cm4gRn1cbmZ1bmN0aW9uIEsoKXtpZihudWxsPT09RSl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7YS5zdHlsZS5mb250PVwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIn1jYXRjaChiKXt9RT1cIlwiIT09YS5zdHlsZS5mb250fXJldHVybiBFfWZ1bmN0aW9uIEwoYSxiKXtyZXR1cm5bYS5zdHlsZSxhLndlaWdodCxLKCk/YS5zdHJldGNoOlwiXCIsXCIxMDBweFwiLGJdLmpvaW4oXCIgXCIpfVxuQS5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMsaz1hfHxcIkJFU2Jzd3lcIixxPTAsRD1ifHwzRTMsSD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtpZihKKCkmJiFHKCkpe3ZhciBNPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gZSgpeyhuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PUQ/YigpOmRvY3VtZW50LmZvbnRzLmxvYWQoTChjLCdcIicrYy5mYW1pbHkrJ1wiJyksaykudGhlbihmdW5jdGlvbihjKXsxPD1jLmxlbmd0aD9hKCk6c2V0VGltZW91dChlLDI1KX0sZnVuY3Rpb24oKXtiKCl9KX1lKCl9KSxOPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYyl7cT1zZXRUaW1lb3V0KGMsRCl9KTtQcm9taXNlLnJhY2UoW04sTV0pLnRoZW4oZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQocSk7YShjKX0sZnVuY3Rpb24oKXtiKGMpfSl9ZWxzZSBtKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gdSgpe3ZhciBiO2lmKGI9LTEhPVxuZiYmLTEhPWd8fC0xIT1mJiYtMSE9aHx8LTEhPWcmJi0xIT1oKShiPWYhPWcmJmYhPWgmJmchPWgpfHwobnVsbD09PUImJihiPS9BcHBsZVdlYktpdFxcLyhbMC05XSspKD86XFwuKFswLTldKykpLy5leGVjKHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KSxCPSEhYiYmKDUzNj5wYXJzZUludChiWzFdLDEwKXx8NTM2PT09cGFyc2VJbnQoYlsxXSwxMCkmJjExPj1wYXJzZUludChiWzJdLDEwKSkpLGI9QiYmKGY9PXYmJmc9PXYmJmg9PXZ8fGY9PXcmJmc9PXcmJmg9PXd8fGY9PXgmJmc9PXgmJmg9PXgpKSxiPSFiO2ImJihkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxjbGVhclRpbWVvdXQocSksYShjKSl9ZnVuY3Rpb24gSSgpe2lmKChuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PUQpZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksYihjKTtlbHNle3ZhciBhPWRvY3VtZW50LmhpZGRlbjtpZighMD09PWF8fHZvaWQgMD09PWEpZj1lLmEub2Zmc2V0V2lkdGgsXG5nPW4uYS5vZmZzZXRXaWR0aCxoPXAuYS5vZmZzZXRXaWR0aCx1KCk7cT1zZXRUaW1lb3V0KEksNTApfX12YXIgZT1uZXcgcihrKSxuPW5ldyByKGspLHA9bmV3IHIoayksZj0tMSxnPS0xLGg9LTEsdj0tMSx3PS0xLHg9LTEsZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2QuZGlyPVwibHRyXCI7dChlLEwoYyxcInNhbnMtc2VyaWZcIikpO3QobixMKGMsXCJzZXJpZlwiKSk7dChwLEwoYyxcIm1vbm9zcGFjZVwiKSk7ZC5hcHBlbmRDaGlsZChlLmEpO2QuYXBwZW5kQ2hpbGQobi5hKTtkLmFwcGVuZENoaWxkKHAuYSk7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkKTt2PWUuYS5vZmZzZXRXaWR0aDt3PW4uYS5vZmZzZXRXaWR0aDt4PXAuYS5vZmZzZXRXaWR0aDtJKCk7eihlLGZ1bmN0aW9uKGEpe2Y9YTt1KCl9KTt0KGUsTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNhbnMtc2VyaWYnKSk7eihuLGZ1bmN0aW9uKGEpe2c9YTt1KCl9KTt0KG4sTChjLCdcIicrYy5mYW1pbHkrJ1wiLHNlcmlmJykpO1xueihwLGZ1bmN0aW9uKGEpe2g9YTt1KCl9KTt0KHAsTChjLCdcIicrYy5mYW1pbHkrJ1wiLG1vbm9zcGFjZScpKX0pfSl9O1wib2JqZWN0XCI9PT10eXBlb2YgbW9kdWxlP21vZHVsZS5leHBvcnRzPUE6KHdpbmRvdy5Gb250RmFjZU9ic2VydmVyPUEsd2luZG93LkZvbnRGYWNlT2JzZXJ2ZXIucHJvdG90eXBlLmxvYWQ9QS5wcm90b3R5cGUubG9hZCk7fSgpKTtcbiJdfQ==
