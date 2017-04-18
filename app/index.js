import React, { Component } from 'react'
import { render } from 'react-dom'
import UserInput from './UserInput/UserInput.js'

class Root extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <div>
        <App/>
        <UserInput/>
      </div>
    )
  }
}

render(<App />, document.getElementById('main'))
