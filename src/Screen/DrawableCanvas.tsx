import React, { Component } from 'react';
import styled from 'styled-components';

export default class DrawableCanvas extends Component<
  {
    width: number;
    height: number;
    ink: [number[], number[], number[]][];
    onEnd: () => void;
  },
  { drawing: boolean; beforeX: number; beforeY: number; startTime: Date }
> {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(props) {
    super(props);
    this.state = { drawing: false, beforeX: null, beforeY: null, startTime: null };
  }

  componentDidMount() {
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.ctx = this.canvas.getContext('2d');
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('touchstart', this.onTouchStart, { passive: false });
    document.addEventListener('touchend', this.onTouchEnd, { passive: false });
    document.addEventListener('touchmove', this.onTouchMove, { passive: false });
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('touchmove', this.onTouchMove);
  }

  isOnCanvas = (e: MouseEvent | TouchEvent) => (e.target as HTMLElement).localName === 'canvas';

  onMouseDown = (e: MouseEvent): void => {
    if (!this.isOnCanvas(e)) return;
    const rect = this.canvas.getBoundingClientRect();
    this.props.ink.push([[], [], []]);
    this.setState({
      ...this.state,
      drawing: true,
      beforeX: e.clientX - rect.left,
      beforeY: e.clientY - rect.top,
      startTime: this.state.startTime || new Date(),
    });
  };

  onMouseUp = (e: MouseEvent): void => {
    this.setState({ ...this.state, drawing: false });
    if (!this.isOnCanvas(e)) return;
    this.props.onEnd();
  };

  onMouseMove = (e: MouseEvent) => {
    if (!this.isOnCanvas(e)) return;
    if (!this.state.drawing) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // 描画
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.moveTo(this.state.beforeX, this.state.beforeY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.closePath();
    //inkに追加
    this.props.ink[this.props.ink.length - 1][0].push(x);
    this.props.ink[this.props.ink.length - 1][1].push(y);
    this.props.ink[this.props.ink.length - 1][2].push(new Date().valueOf() - this.state.startTime.valueOf());
    // 描画最後の座標を前回の座標に代入する
    this.setState({ ...this.state, beforeX: x, beforeY: y });
  };

  onTouchStart = (e: TouchEvent) => {
    if (!this.isOnCanvas(e)) return;
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    this.props.ink.push([[], [], []]);
    this.setState({
      ...this.state,
      drawing: true,
      beforeX: e.touches[0].clientX - rect.left,
      beforeY: e.touches[0].clientY - rect.top,
      startTime: this.state.startTime || new Date(),
    });
  };

  onTouchEnd = (e: TouchEvent): void => {
    this.setState({ ...this.state, drawing: false });
    if (!this.isOnCanvas(e)) return;
    e.preventDefault();
    this.props.onEnd();
  };

  onTouchMove = (e: TouchEvent) => {
    if (!this.isOnCanvas(e)) return;
    if (!this.state.drawing) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    // 描画
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.moveTo(this.state.beforeX, this.state.beforeY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.closePath();
    //inkに追加
    this.props.ink[this.props.ink.length - 1][0].push(x);
    this.props.ink[this.props.ink.length - 1][1].push(y);
    this.props.ink[this.props.ink.length - 1][2].push(new Date().valueOf() - this.state.startTime.valueOf());
    // 描画最後の座標を前回の座標に代入する
    this.setState({
      ...this.state,
      beforeX: x,
      beforeY: y,
    });
  };

  render() {
    return <canvas height={this.props.height} width={this.props.width} id="canvas" />;
  }
}
