import React, { Component } from "react";
import PropTypes from "prop-types";
import editable from "../editable";
import { WithBackground } from "./style";
import { TOOLS, DIRECTION, DIRECTION_ARROW } from "../../constants";

class Arrow extends Component {
  static shape = TOOLS.arrow;

  static charSet = {
    horizontal: "-",
    vertical: "|",
    up: "^",
    down: "v",
    left: "<",
    right: ">",
    end: "+"
  };

  static convert(direction, length) {
    let text = "";
    switch (direction) {
      case DIRECTION.left:
        text += Arrow.charSet.left;
        for (let i = 1; i < length - 1; i += 1) {
          text += Arrow.charSet.horizontal;
        }
        text += Arrow.charSet.end;
        break;

      case DIRECTION.right:
        text += Arrow.charSet.end;
        for (let i = 1; i < length - 1; i += 1) {
          text += Arrow.charSet.horizontal;
        }
        text += Arrow.charSet.right;
        break;

      case DIRECTION.up:
        text += `${Arrow.charSet.up}\n`;
        for (let i = 1; i < length - 1; i += 1) {
          text += `${Arrow.charSet.vertical}\n`;
        }
        text += Arrow.charSet.end;
        break;

      case DIRECTION.down:
        text += `${Arrow.charSet.end}\n`;
        for (let i = 1; i < length - 1; i += 1) {
          text += `${Arrow.charSet.vertical}\n`;
        }
        text += Arrow.charSet.down;
        break;

      default:
        break;
    }
    return text;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps !== prevState) {
      const { direction, length } = nextProps;
      const state = {
        ...nextProps,
        text: Arrow.convert(direction, length)
      };
      return state;
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { direction, length } = this.props;
    this.state = {
      ...this.props,
      text: Arrow.convert(direction, length)
    };
  }

  render() {
    const { text } = this.state;
    const { zoomLevel, handleOnDoubleClick, x, y } = this.props;
    return (
      <WithBackground
        x={x}
        y={y}
        zoomLevel={zoomLevel}
        onDoubleClick={handleOnDoubleClick}
      >
        {text}
      </WithBackground>
    );
  }
}

Arrow.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  direction: PropTypes.oneOf([...Object.values(DIRECTION_ARROW)]).isRequired,
  zoomLevel: PropTypes.number.isRequired,
  handleOnDoubleClick: PropTypes.func.isRequired
};

export default editable(Arrow);
