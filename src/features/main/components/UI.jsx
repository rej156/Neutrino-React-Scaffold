import React, { Component } from 'react';

export default class UI extends Component {
  render() {
    return (
      <div>
        <p className="lol">Test123</p>
        <style jsx>
          {
            `
            p {
              color: blue; 
              background-color: red;
            }
          `
          }
        </style>
      </div>
    );
  }
}
