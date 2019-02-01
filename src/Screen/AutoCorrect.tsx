import React, { Component } from 'react';
import DrawableCanvas from '../Screen/DrawableCanvas';
import axios from 'axios';
import styled, { StyledComponent } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@material-ui/core/Button';
import { resetButtonColor } from '../constant/color';

const TextWrapper = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  border-right: solid black 1px;
`;

const ResultText = styled.p`
  font-size: 2rem;
`;

type Language = 'English' | 'Japanese' | 'Chinese';

export default class AutoCorrect extends Component<
  {},
  { lang: Language; res: string; canvasSize: { height: number; width: number } }
> {
  ink: [number[], number[], number[]][];
  url: { [lang in Language]: string };
  CanvasWrapper: StyledComponent<'div', any, {}, never>;
  ResultContainer: StyledComponent<'div', any, {}, never>;
  constructor(props) {
    super(props);
    this.ink = [];
    this.state = { lang: 'Chinese', res: '', canvasSize: { height: null, width: null } };
    this.CanvasWrapper = styled.div`
      height: ${this.state.canvasSize.height}px;
      width: ${this.state.canvasSize.width}px;
      margin: 0 auto;
      border: solid black 1px;
      text-align: center;
    `;

    this.ResultContainer = styled.div`
      display: flex;
      margin: 0 auto;
      height: 4rem;
      width: ${this.state.canvasSize.width}px;
      border: solid black 1px;
      border-top: 0px;
    `;
  }

  componentDidMount() {
    const main = document.getElementById('main');
    const height = Math.min(400, main.clientWidth - 100);
    const width = Math.min(1000, main.clientWidth - 100);
    this.setState({ ...this.state, canvasSize: { width, height } });
  }

  post = () => {
    const url = {
      English: 'https://inputtools.google.com/request?itc=en-t-i0-handwrit',
      Japanese: 'https://inputtools.google.com/request?itc=ja-t-i0-handwrit',
      Chinese: 'https://inputtools.google.com/request?itc=zh-hans-t-i0-handwrit',
    };
    const data = {
      app_version: 0.4,
      api_level: '537.36',
      device: window.navigator.userAgent,
      input_type: 0, // ?
      options: 'enable_pre_space', // ?
      requests: [
        {
          writing_guide: {
            writing_area_width: this.state.canvasSize.width, // canvas width
            writing_area_height: this.state.canvasSize.height, // canvas height
          },
          pre_context: '', // confirmed preceding chars
          max_num_results: 1,
          max_completions: 0,
          ink: this.ink,
        },
      ],
    };
    axios.post(url[this.state.lang], data).then(res => {
      if (!res.data[1]) return;
      this.setState({ ...this.state, res: res.data[1][0][1][0] });
    });
  };

  reset = () => {
    this.ink.splice(0);
    const cvs = document.getElementsByTagName('canvas')[0];
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    this.setState({ ...this.state, res: '' });
  };

  render() {
    return (
      <div>
        <div
          style={{
            height: this.state.canvasSize.height,
            width: this.state.canvasSize.width,
            margin: '0 auto',
            border: 'solid black 1px',
            textAlign: 'center',
          }}
        >
          <DrawableCanvas
            height={this.state.canvasSize.height}
            width={this.state.canvasSize.width}
            ink={this.ink}
            onEnd={this.post}
          />
        </div>
        <div
          style={{
            display: 'flex',
            margin: '0 auto',
            height: '4rem',
            width: this.state.canvasSize.width,
            border: 'solid black 1px',
            borderTop: 0,
          }}
        >
          <TextWrapper>
            <ResultText>{this.state.res}</ResultText>
          </TextWrapper>
          <Button
            onClick={this.reset}
            style={{
              flex: 1,
              maxWidth: 300,
              minWidth: 100,
              background: resetButtonColor,
              padding: 0,
              borderRadius: 0,
            }}
          >
            <FontAwesomeIcon icon="backspace" style={{ padding: 0, fontSize: '2.5rem' }} />
          </Button>
        </div>
      </div>
    );
  }
}
