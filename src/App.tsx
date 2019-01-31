import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Top from './components/Top';
import AutoCorrect from './components/AutoCorrect';
import useFonts from './util/useFonts';
useFonts();
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
