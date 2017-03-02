import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(state => ({ lol: state.myReducer }))
class Main extends Component {
  render() {
    const { children } = this.props;

    return (
      <div>
        <p>Hello world!</p>
        {children}
      </div>
    );
  }
}
export default Main;
