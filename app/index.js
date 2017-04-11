import React, { Component } from 'react'
import { render } from 'react-dom'

class Root extends Component {
  componentDidMount() {
    // INSERT API CALL TO YOUR INTERNAL API
  }

  render() {
    return (
      <div>Enter your text analysis here!!</div>
    )
  }
}

render(<Root />, document.getElementById('main'))
