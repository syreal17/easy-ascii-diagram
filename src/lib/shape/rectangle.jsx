import React, { Component } from "react";
import PropTypes from "prop-types";
import editable from "../editable";
import { BorderOnly } from "./style";
import { TOOLS } from "../../constants";

class Rectangle extends Component {
  static shape = TOOLS.rectangle;

  static charSet = {
    corner: "+",
    horizontalEdge: "-",
    verticalEdge: "|",
    inner: " "
  };

  static convert(width, height) {
    let text = "";
    for (let j = 0; j < height; j += 1) {
      for (let i = 0; i < width; i += 1) {
        if ((i === 0 || i === width - 1) && (j === 0 || j === height - 1)) {
          text += Rectangle.charSet.corner;
        } else if (i > 0 && i < width - 1 && (j === 0 || j === height - 1)) {
          text += Rectangle.charSet.horizontalEdge;
        } else if ((i === 0 || i === width - 1) && (j > 0 && j < height - 1)) {
          text += Rectangle.charSet.verticalEdge;
        } else {
          text += Rectangle.charSet.inner;
        }
      }
      text += "\n";
    }
    return text;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps !== prevState) {
      const { width, height } = nextProps;
      const state = {
        ...nextProps,
        text: Rectangle.convert(width, height)
      };
      return state;
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { width, height } = this.props;
    this.state = {
      ...this.props,
      text: Rectangle.convert(width, height)
    };
  }

  render() {
    const { x, y, text } = this.state;
    const { zoomLevel, handleOnDoubleClick } = this.props;
    return (
      <BorderOnly
        x={x}
        y={y}
        zoomLevel={zoomLevel}
        onDoubleClick={handleOnDoubleClick}
      >
        {text}
      </BorderOnly>
    );
  }
}

Rectangle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  zoomLevel: PropTypes.number.isRequired,
  handleOnDoubleClick: PropTypes.func.isRequired
};

export default editable(Rectangle);
