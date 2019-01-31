import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
export default class Top extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        ようこそ
        <Link to="canvas">
          <Button variant="contained" color="primary">
            Canvasへ
          </Button>
        </Link>
      </div>
    );
  }
}
