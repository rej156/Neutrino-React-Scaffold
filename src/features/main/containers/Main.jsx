import React, { Component } from 'react';

class Main extends Component {
  render() {
    const { children } = this.props;

    return (
      <div>
        <p>Hello world</p>
        {children}
      </div>
    );
  }
}
export default Main;
