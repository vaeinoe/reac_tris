import React from 'react';
import TileRow from './Tile.jsx';

export default class Board extends React.Component {
  render() {
    const boardRows = this.props.tileRows.map (function(row, idx) {
      return <TileRow row={row} key={"row" + idx} />;
    });

    return (
      <div>
        <div className="status">{status}</div>
        {boardRows}
      </div>
    );
  }
}
