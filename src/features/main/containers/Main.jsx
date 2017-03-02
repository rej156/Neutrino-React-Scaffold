import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(state => ({ lol: state.myReducer }))
class Main extends Component {
  render() {
    const { children, lol } = this.props;
    console.log(lol);

    return (
      <div>
        <p>Hello </p>
        {children}
      </div>
    );
  }
}
export default Main;
