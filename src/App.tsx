import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Top from './Top';
import DrawableCanvas from './DrawableCanvas';
import AutoCorrect from './AutoCorrect';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Top} />
          <Route path="/canvas" component={AutoCorrect} />
        </Switch>
      </Router>
    );
  }
}
