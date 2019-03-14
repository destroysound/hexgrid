import BoardPlugin from '../plugins/board-plugin.js';

export class Demo extends Phaser.Scene {
  constructor() {
    super({
      key: 'examples'
    })
  }

  preload() {}

  create() {
    // create board
    var config = {
      grid: getHexagonGrid(this),
      // grid: getQuadGrid(this),
      width: 18,
      height: 18,
      // wrap: true
    }
    this.board = new Board(this, config);

    // add chess
    this.tiles = [];
    for (var i = 0; i < 10; i++) {
      this.tiles.push(new ChessA(this.board, undefined));
    }
    for (var i = 0; i < 10; i++) {
      this.tiles[i].attachOtherTiles(this.tiles);
    }

    // add some blockers
    for (var i = 0; i < 80; i++) {
      new Blocker(this.board);
    }

    //this.chessA.showMoveableArea();
    //this.chessB.showMoveableArea();
  }
}

var getQuadGrid = function (scene) {
  var grid = scene.rexBoard.add.quadGrid({
    x: 400,
    y: 100,
    cellWidth: 100,
    cellHeight: 50,
    type: 1
  });
  return grid;
}

var getHexagonGrid = function (scene) {
  var staggeraxis = 'x';
  var staggerindex = 'odd';
  var grid = scene.rexBoard.add.hexagonGrid({
    x: 20,
    y: 20,
    size: 20,
    staggeraxis: staggeraxis,
    staggerindex: staggerindex
  })
  return grid;
};

class Board extends RexPlugins.Board.Board {
  constructor(scene, config) {
    // create board
    super(scene, config);
    // draw grid
    var graphics = scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 0xffffff,
        alpha: 1
      }
    });
    this.forEachTileXY(function (tileXY, board) {
      var points = board.getGridPoints(tileXY.x, tileXY.y, true);
      graphics.strokePoints(points, true);
    });
    // enable touch events
    this.setInteractive();
  }
}

class Blocker extends RexPlugins.Board.Shape {
  constructor(board, tileXY) {
    var scene = board.scene;
    if (tileXY === undefined) {
      tileXY = board.getRandomEmptyTileXY(0);
    }
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, 0, 0x555555);
    scene.add.existing(this);
  }
}

class ChessA extends RexPlugins.Board.Shape {
  constructor(board, tileXY) {
    var scene = board.scene;
    if (tileXY === undefined) {
      tileXY = board.getRandomEmptyTileXY(0);
    }
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, 0, 0x0000CC);
    scene.add.existing(this);
    this.setDepth(1);

    // add behaviors
    this.moveTo = scene.rexBoard.add.moveTo(this);
    this.pathFinder = scene.rexBoard.add.pathFinder(this, {
      occupiedTest: true
    });

    // private members
    this._movingPoints = 4;
    this._markers = [];
    this._selected = false;
    this._otherTiles = [];
    this.on('board.pointerdown', function () {
      this.showMoveableArea();
      for (var i = 0, cnt = this._otherTiles.length; i < cnt; i++) {
        if (this._otherTiles[i] !== this) {
          this._otherTiles[i].hideMoveableArea();
        }
      }
    });
  }

  attachOtherTiles(tiles) {
    this._otherTiles = tiles;
  }

  isSelected() {
    return this._selected;
  }

  showMoveableArea() {
    this.hideMoveableArea();
    this._selected = true;
    this.setFillStyle(0x00CC00);
    var tileXYArray = this.pathFinder.findArea(this._movingPoints);
    for (var i = 0, cnt = tileXYArray.length; i < cnt; i++) {
      this._markers.push(
        new MoveableMarker(this, tileXYArray[i])
      );
    }
    return this;
  }

  hideMoveableArea() {
    this._selected = false;
    this.setFillStyle(0x0000CC);
    for (var i = 0, cnt = this._markers.length; i < cnt; i++) {
      this._markers[i].destroy();
    }
    this._markers.length = 0;
    return this;
  }

  moveToTile(endTile) {
    if (this.moveTo.isRunning) {
      return false;
    }
    var tileXYArray = this.pathFinder.getPath(endTile.rexChess.tileXYZ);
    this.moveAlongPath(tileXYArray);
    return true;
  }

  moveAlongPath(path) {
    if (path.length === 0) {
      this.hideMoveableArea();
      return;
    }

    this.moveTo.once('complete', function () {
      this.moveAlongPath(path);
    }, this);
    this.moveTo.moveTo(path.shift());
    return this;
  }


}

class MoveableMarker extends RexPlugins.Board.Shape {
  constructor(chess, tileXY) {
    var board = chess.rexChess.board;
    var scene = board.scene;
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, -1, 0x330000);
    scene.add.existing(this);
    this.setScale(0.5);

    // on pointer down, move to this tile
    this.on('board.pointerdown', function () {
      if (!chess.moveToTile(this)) {
        return;
      }
      this.setFillStyle(0xff0000);
    }, this);
  }
}
