import React, { Component } from 'react';

import useFonts from './util/useFonts';
import { BrowserRouter as Router } from 'react-router-dom';
import Route from './Route';
useFonts();
export default class App extends Component {
  render() {
    return (
      <Router>
        <Route />
      </Router>
    );
  }
}
