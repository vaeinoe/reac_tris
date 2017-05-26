import React from 'react';
import ReactInterval from 'react-interval';

export default class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
    	tick: 0
    }
  }

  nextTick() {
  	this.setState({ tick: this.state.tick + 1 });
  	this.props.callback();
  }

  render() {
  	return ( 
  		<div>
        	<ReactInterval timeout={this.props.timeout} enabled={true} 
        				   callback={() => this.nextTick()} />
  		</div>
  	)
  }
}
