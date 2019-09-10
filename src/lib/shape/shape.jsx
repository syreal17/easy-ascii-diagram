import React, { Component } from "react";
import PropTypes from "prop-types";
import editable from "../editable";
import { WithBackground } from "./style";
import { TOOLS, DIRECTION, DIRECTION_LINE } from "../../constants";

const convertArrow = (direction, length) => {
  let text = "";
  const charSet = {
    horizontal: "-",
    vertical: "|",
    up: "^",
    down: "v",
    left: "<",
    right: ">",
    end: "+"
  };
  switch (direction) {
    case DIRECTION.left:
      text += charSet.left;
      for (let i = 1; i < length - 1; i += 1) {
        text += charSet.horizontal;
      }
      text += charSet.end;
      break;
    case DIRECTION.right:
      text += charSet.end;
      for (let i = 1; i < length - 1; i += 1) {
        text += charSet.horizontal;
      }
      text += charSet.right;
      break;
    case DIRECTION.up:
      text += `${charSet.up}\n`;
      for (let i = 1; i < length - 1; i += 1) {
        text += `${charSet.vertical}\n`;
      }
      text += charSet.end;
      break;
    case DIRECTION.down:
      text += `${charSet.end}\n`;
      for (let i = 1; i < length - 1; i += 1) {
        text += `${charSet.vertical}\n`;
      }
      text += charSet.down;
      break;
    default:
      break;
  }

  return text;
};

const convertLine = (direction, length) => {
  let text = "";
  const charSet = {
    horizontalEdge: "-",
    verticalEdge: "|"
  };

  if (direction === DIRECTION.horizontal) {
    for (let i = 0; i < length; i += 1) {
      text += charSet.horizontalEdge;
    }
  } else {
    for (let i = 0; i < length; i += 1) {
      text += `${charSet.verticalEdge}\n`;
    }
  }
  return text;
};

const convertEraser = (width, height) => {
  let text = "";
  const charSet = {
    inner: " "
  };
  for (let j = 0; j < height; j += 1) {
    for (let i = 0; i < width; i += 1) {
      text += charSet.inner;
    }
    text += "\n";
  }
  return text;
};

const convertRectangle = (width, height) => {
  const charSet = {
    corner: "+",
    horizontalEdge: "-",
    verticalEdge: "|",
    inner: " "
  };

  let text = "";
  for (let j = 0; j < height; j += 1) {
    for (let i = 0; i < width; i += 1) {
      if ((i === 0 || i === width - 1) && (j === 0 || j === height - 1)) {
        text += charSet.corner;
      } else if (i > 0 && i < width - 1 && (j === 0 || j === height - 1)) {
        text += charSet.horizontalEdge;
      } else if ((i === 0 || i === width - 1) && (j > 0 && j < height - 1)) {
        text += charSet.verticalEdge;
      } else {
        text += charSet.inner;
      }
    }
    text += "\n";
  }
  return text;
};

class Shape extends Component {
  static convert() {}

  static getWidthHeight = (direction, length) => {
    let width;
    let height;
    if (direction === DIRECTION.vertical) {
      width = 1;
      height = length;
    } else {
      width = length;
      height = 1;
    }
    return { width, height };
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { direction, length, ...rest } = nextProps;
    if (prevState.direction === direction && prevState.length === length)
      return { ...nextProps };

    const { width, height } = Line.getWidthHeight(direction, length);

    const state = {
      ...rest,
      width,
      height,
      text: Line.convert(direction, length)
    };
    return state;
  }

  constructor(props) {
    super(props);
    const { width, height, shape } = this.props;
    console.log(Shape.charSet);
    this.state = {
      ...this.props,
      width,
      height,
      text: Line.convert(direction, length)
    };
    this.shape = TOOLS.line;
  }

  render() {
    const { text } = this.state;
    const { x, y, zoomLevel, handleOnDoubleClick, editing } = this.props;

    return (
      <WithBackground
        x={x}
        y={y}
        zoomLevel={zoomLevel}
        onDoubleClick={handleOnDoubleClick}
        editing={editing}
      >
        {text}
      </WithBackground>
    );
  }
}

Shape.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  direction: PropTypes.oneOf([...Object.values(DIRECTION_LINE)]).isRequired,
  zoomLevel: PropTypes.number.isRequired,
  handleOnDoubleClick: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired
};

export default editable(Shape);