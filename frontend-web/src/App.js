import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import './App.css';

import NewGame from './Components/NewGame'
import LoginForm from './Components/LoginForm'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/login" component={LoginForm} />
          <Route path ="/newgame" component={NewGame} />
        </div>
      </Router>
    );
  }
}

export default App;
