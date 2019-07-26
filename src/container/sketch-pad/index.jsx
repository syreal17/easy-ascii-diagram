import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  GRID_WIDTH, GRID_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT,
} from '../../constants';
import Grid from '../../component/grid';
import ToolBar from '../toolbar';

import { Canvas } from './style';


class SketchPad extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = {
      zoomLevel: 1,
      isDrawing: false,
      content: [],
      tool: '',
      prevPos: { x: null, y: null },
      curPos: { x: null, y: null },
    };
  }


  componentDidMount() {
    console.log(this.canvas);
  }


  handleMouseDown = (e) => {
    this.setState({
      isDrawing: true,
      prevPos: { x: e.clientX, y: e.clientY },
      curPos: { x: e.clientX, y: e.clientY },
    });
  }

  handleMouseMove = (e) => {
    if (this.state.isDrawing === true) {
      this.setState({
        curPos: { x: e.clientX, y: e.clientY },
      });

      this.draw();
    }
  }

  handleMouseUp = (e) => {
    this.setState({
      isDrawing: false,
    });
  }


  calculateGridToFill() {
    const { curPos, zoomLevel } = this.state;
    const { x, y } = curPos;

    const column = Math.floor(x / GRID_WIDTH / zoomLevel);
    const row = Math.floor(y / GRID_HEIGHT / zoomLevel) - 1;
    console.log(column, row);
    const { _, totalColumn } = this.calculateTotalGridNumber();
    const index = row * totalColumn + column;
    return index;
  }

  calculateTotalGridNumber() {
    const { zoomLevel } = this.state;
    const totalRow = Math.floor(window.innerHeight / GRID_HEIGHT / zoomLevel);
    const totalColumn = Math.floor(window.innerWidth / GRID_WIDTH / zoomLevel);
    return { totalRow, totalColumn };
  }


  draw() {
    const index = this.calculateGridToFill();
    console.log(index);
  }

  render() {
    const { prevPos, curPos } = this.state;
    return (
      <React.Fragment>
        <ToolBar />
        <Canvas ref={this.canvas} />
        <Grid
          onMouseMove={this.handleMouseMove}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        />
      </React.Fragment>

    );
  }
}

SketchPad.propTypes = {
};

export default SketchPad;
