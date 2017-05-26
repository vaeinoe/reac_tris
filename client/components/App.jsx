import React from 'react';
import update from 'immutability-helper';
import Counter from './Counter.jsx';
import Board from './Board.jsx';
import * as helpers from './helpers.jsx';

export default class App extends React.Component {

  constructor() {
    super();

    this.state = {
      rows: 22, 
      columns: 12, 
      tileRows: null,
      blockOriginX: null,
      blockOriginY: null,
      blockHeight: 0,
      blockRotation: 0,
      blockIdx: null,
      gameOver: false,
      lock: false,
      score: 0,
      pause: false
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillMount() {
    this.reset();
    window.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    switch(event.keyCode) {
      case 37:
        this.performLocking(() => this.moveLeft());
        break;
      case 39:
        this.performLocking(() => this.moveRight());
        break;
      case 38:
        this.performLocking(() => this.rotate());
        break;
      case 40:
        this.performLocking(() => this.tick());
        break;
      case 32:
        this.performLocking(() => this.drop());
        break;
      case 80:
        this.performLocking(() => this.togglePause());
    }
  }

  reset() {
    var tileRows = Array(this.state.rows);
    for (var i = 0; i < this.state.rows; i++) {
      tileRows[i] = Array(this.state.columns);
      for (var j = 0; j < this.state.columns; j++) {
        tileRows[i][j] = 0;
      }
    }

    this.setState({
      tileRows: tileRows,
      rows:     this.state.rows,
      columns:  this.state.columns,
      blockOriginX: null,
      blockOriginY: null,
      blockHeight: 0,
      blockRotation: 0,
      blockIdx: null,
      gameOver: false,
      lock: false,
      score: 0,
      pause: false
    });
  }

  // False peace of mind for parallel operations
  performLocking(func_call) {
    if (this.state.lock == true) { return; }

    const lockState = update(this.state, {
      lock: { $set: true }
    });
    this.setState(lockState);

    func_call();

    const unlockState = update(this.state, {
      lock: { $set: false }
    });
    this.setState(unlockState);
  }

  rotate() {
    if (this.state.gameOver || this.state.blockOriginY == null || this.state.pause ) {
      return;
    }

    var newArray = this.state.tileRows.slice(0);

    const blockdata = helpers.getBlock(this.state.blockIdx, (this.state.blockRotation + 1) % 4);
    const block     = blockdata[0];
    const idx       = blockdata[1];

    const originX = this.state.blockOriginX;
    const originY = this.state.blockOriginY;

    // Check collision with new state
    for (var i = 0; i < block.length; i++) { // Block rows
      for (var j = 0; j < block[i].length; j++) { // Block columns
        if (block[i][j] != 0) {
          if ((i + originY) >= (this.state.rows - 1) || i + originY < 0) {
            return;            
          }

          else if ((j + originX) > (this.state.columns - 1) || j + originX < 0) {
            return;
          }

          else if (newArray[i + originY][j + originX] < 0) {
            return;
          }
        }
      }
    }

    // Extra clear pass to make sure the rotation doesn't leave any 
    // "traces" if the user whacks brutally on keys
    for (var i = this.state.rows - 1; i >= 0; i--) {
      for (var j = 0; j < this.state.columns; j++) {
        if (newArray[i][j] > 0) {
          newArray[i][j] = 0;
        }
      }
    }

    for (var i = 0; i < block.length; i++) {
      for (var j = 0; j < block[i].length; j++) {
        if (block[i][j] != 0) {
          newArray[i + originY][j + originX] = block[i][j];
        }
      }
    }

    const newState = update(this.state, {
      tileRows:      { $set: newArray },
      blockRotation: { $set: ((this.state.blockRotation + 1) % 4) }
    })
    this.setState(newState);
  }

  moveLeft() {
    this.moveX(-1);
  }

  moveRight() {
    this.moveX(1);
  }

  moveX(dir) {
    if (this.state.gameOver || this.collide(dir, 0) || 
        this.state.blockOriginY == null || dir == 0 || this.state.pause) {
      return;
    }

    var newArray = this.state.tileRows.slice(0);

    // Collisions already checked, free to move
    // Silly: two cases for moving either left or right
    for (var i = this.state.rows - 1; i >= 0; i--) {
      if (dir > 0) {
        for (var j = this.state.columns - 1; j >= 0; j--) {
          if (newArray[i][j] > 0) {
            newArray[i][j + dir] = newArray[i][j];
            newArray[i][j] = 0;
          }
        }
      }
      else {
        for (var j = 1; j < this.state.columns; j++) {
          if (newArray[i][j] > 0) {
            newArray[i][j + dir] = newArray[i][j];
            newArray[i][j] = 0;
          }
        }
      }

    }

    const newState = update(this.state, {
      tileRows:     { $set: newArray },
      blockOriginX: { $set: this.state.blockOriginX + dir }
    });
    this.setState(newState);
  }

  togglePause() {
    const newState = update(this.state, {
      pause: { $set: !this.state.pause }
    });
    this.setState(newState);    
  }

  drop() {
    if (this.state.pause) { return 0; }

    var status = 0;
    while (status == 0) {
      status = this.tick();
    }
  }

  tick() {
    if (this.state.pause) { return -2; }

    if (this.collide(0, 1)) {
      if (this.state.blockOriginY == 0) {
        const newState = update(this.state, {
          blockOriginY: { $set: this.state.blockOriginY + 1 },
          gameOver:     { $set: true }
        });
        this.setState(newState);
      }

      this.freezeBlocks();
    }

    if (this.state.gameOver) {
      return -1;
    }

    if (this.state.blockOriginY == null) {
      this.addBlock();
      if (this.state.gameOver) {
        return -1;
      }
      return 1;
    }

    var newArray = this.state.tileRows.slice(0);

    for (var i = this.state.rows - 1; i > 0; i--) {
      for (var j = this.state.columns - 1; j >= 0; j--) {
        // We've already checked for vertical collisions at this point
        if (newArray[i][j] == 0 && newArray[i-1][j] > 0) {
          newArray[i][j] = newArray[i-1][j];
          newArray[i-1][j] = 0;
        }
      }
    }

    const newState = update(this.state, {
      tileRows:     { $set: newArray },
      blockOriginY: { $set: this.state.blockOriginY + 1 }
    });
    this.setState(newState);

    return 0;
  }

  collide(xDir, yDir) { // Called before updating rows
    for (var i = 0; i < this.state.rows; i++) {
      for (var j = 0; j < this.state.columns; j++) {
        if (this.state.tileRows[i][j] > 0) {
          if (i >= this.state.rows - 1 && yDir > 0) {
            return true;
          }
          else if (j >= this.state.columns - 1 && xDir > 0) {
            return true;
          }
          else if (j <= 0 && xDir < 0) {
            return true;
          }
          else if (this.state.tileRows[i+yDir][j+xDir] < 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  freezeBlocks() {
    var newArray = this.state.tileRows.slice(0);

    for (var i = 0; i < this.state.rows; i++) {
      for (var j = 0; j < this.state.columns; j++) {
        if (newArray[i][j] > 0) {
          newArray[i][j] = -1 * newArray[i][j];
        }
      }
    }

    var rowsComplete = 0;

    // Find rows to destroy
    var complete;
    for (var i = 0; i < this.state.rows; i++) {
      complete = true;

      for (var j = 0; j < this.state.columns; j++) {
        if (newArray[i][j] >= 0) {
          complete = false;
          break;
        }
      }

      if (complete) { // Wipe row
        newArray.splice(i, 1);
        var newRow = Array(this.state.columns);
        for (var col = 0; col < this.state.columns; col++) {
          newRow[col] = 0;
        }
        newArray.unshift(newRow);
        rowsComplete += 1;
      }
    }

    var addScore;
    switch(rowsComplete) {
      case 0:
        addScore = 0;
        break;
      case 1:
        addScore = 1;
        break;
      case 2:
        addScore = 3;
        break;
      case 3:
        addScore = 5;
        break;
      case 4:
        addScore = 8;
        break;
    }

    const newState = update(this.state, {
      tileRows:      { $set: newArray },
      blockOriginX:  { $set: null },
      blockOriginY:  { $set: null },
      blockHeight:   { $set: 0 },
      blockIdx:      { $set: null },
      blockRotation: { $set: 0 },
      score:         { $set: this.state.score + addScore }
    });
    this.setState(newState);
  }

  addBlock() {
    var newArray = this.state.tileRows.slice(0);

    const blockdata = helpers.spawnBlock(0);
    const block     = blockdata[0];
    const idx       = blockdata[1];

    var newOriginX = Math.floor(Math.random() * (this.state.columns - block.length - 2));

    var gameOver = this.state.gameOver;

    for (var i = 0; i < block.length; i++) {
      for (var j = 0; j < block[i].length; j++) {
        if (newArray[i][j + newOriginX] != 0 && block[i][j] != 0) {
          gameOver = true;
        }
        if (block[i][j] != 0) {
          newArray[i][j + newOriginX] = block[i][j];
        }
      }
    }

    const newState = update(this.state, {
      tileRows:      { $set: newArray },
      blockOriginX:  { $set: newOriginX },
      blockOriginY:  { $set: 0 },
      blockHeight:   { $set: block.length },
      blockIdx:      { $set: idx },
      blockRotation: { $set: 0 },
      gameOver:      { $set: gameOver }
    })
    this.setState(newState);
  }

  render() {
    const over = this.state.gameOver ? "[OVER]" : ""
    var score = ("000" + this.state.score);
    score = score.substr(score.length - 4);
    const paused = this.state.pause ? "[PAUSE]" : ""

    return (
      <div className="mainContainer">
        <div className="game-info">
          <div>
          <Counter callback={() => (this.performLocking(() => this.tick()))} timeout={500} />
          [{score}] <b>{paused}</b> {over}
          </div>
        </div>
        <div className="game">
          <div className="game-board">
            <Board tileRows={this.state.tileRows} />
          </div>
        </div>
      </div>
    );    
  }


}
