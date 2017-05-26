import React from 'react';

class Tile extends React.Component {
  render() {
    var cname;
    switch(this.props.value) {
      case 0:
        cname = "tile tile-empty";
        break;
      case 1:
      case -1:
        cname = "tile tile-active tile-red";
        break;
      case 2:
      case -2:
        cname = "tile tile-active tile-green";
        break;
      case 3:
      case -3:
        cname = "tile tile-active tile-blue";
        break;
      case 4:
      case -4:
        cname = "tile tile-active tile-cyan";
        break;
      case 5:
      case -5:
        cname = "tile tile-active tile-magenta";
        break;
      case 6:
      case -6:
        cname = "tile tile-active tile-yellow";
        break;
      case 7:
      case -7:
        cname = "tile tile-active tile-key";
        break;
    };

    return (
      <button className={cname}></button>
    );
  }
}

export default class TileRow extends React.Component {
  render() {
    const rowData = this.props.row.map (function(tile, idx) {
        return (<Tile value={tile} key={"tile" + idx} />);
    });

    return (
      <div className="board-row">
      {rowData}
      </div>
    );
  }
}

