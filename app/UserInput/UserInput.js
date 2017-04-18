import React, { Component } from 'react';

export default class UserInput extends Component {
  constructor(){
    super()
      this.state = {
        text : ''
      }
  }
  render(){
    return(
      <div>
        <h1>Harlan the Tone Analyzer</h1>
        <input type='text' placeholder='Insert your text for analysis'/>
      </div>
    )
  }
}
