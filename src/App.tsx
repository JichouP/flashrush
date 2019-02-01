import React, { Component } from 'react';

import useFonts from './util/useFonts';
import { BrowserRouter as Router } from 'react-router-dom';
import Route from './Route';
useFonts();

const BASE_URL = '/flashrush';

export default class App extends Component {
  render() {
    return (
      <Router basename={BASE_URL}>
        <Route />
      </Router>
    );
  }
}
