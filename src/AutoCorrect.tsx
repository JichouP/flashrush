import React, { Component } from 'react';
import DrawableCanvas from './DrawableCanvas';
import axios from 'axios';
import styled from 'styled-components';

const canvasSize = {
  height: Math.min(400, window.innerWidth - 100),
  width: Math.min(500, window.innerWidth - 50),
};

const CanvasWrapper = styled.div`
  height: ${canvasSize.height}px;
  width: ${canvasSize.width}px;
  margin: 0 auto;
  border: solid black 1px;
  text-align: center;
`;

const ResultContainer = styled.div`
  margin: 0 auto;
  height: ${Math.max((canvasSize.width - canvasSize.height) / 2, 50)}px;
  width: ${canvasSize.width}px;
  display: flex;
  border: solid black 1px;
  border-top: 0px;
`;

const TextWrapper = styled.div`
  width: ${(canvasSize.width - canvasSize.height) / 2}px;
  text-align: center;
  border-right: solid black 1px;
`;

const ResultText = styled.p`
  font-size: 2rem;
`;

const ResetButton = styled.button`
  width: ${canvasSize.width - canvasSize.height}px;
  background-color: #8ad;
  padding: 10px;
  font-size: 1rem;
`;

type Language = 'English' | 'Japanese' | 'Chinese';

export default class AutoCorrect extends Component<{}, { lang: Language; res: string }> {
  ink: [number[], number[], number[]][];
  url: { [lang in Language]: string };
  constructor(props) {
    super(props);
    this.ink = [];
    this.state = { lang: 'Chinese', res: '' };
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
            writing_area_width: canvasSize.width, // canvas width
            writing_area_height: canvasSize.height, // canvas height
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
        <CanvasWrapper>
          <DrawableCanvas height={canvasSize.height} width={canvasSize.width} ink={this.ink} onEnd={this.post} />
        </CanvasWrapper>
        <ResultContainer>
          <TextWrapper>
            <ResultText>{this.state.res}</ResultText>
          </TextWrapper>
          <ResetButton onClick={this.reset}>リセット</ResetButton>
        </ResultContainer>
      </div>
    );
  }
}
