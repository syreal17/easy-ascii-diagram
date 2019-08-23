import React, { Component } from "react";
import PropTypes from "prop-types";
import editable from "./editable";
import { WithBackground } from "./style";
import { TOOLS, DIRECTION, DIRECTION_ARROW } from "../constants";

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

  state = {
    x: this.props.x,
    y: this.props.y,
    length: this.props.length,
    direction: this.props.direction,
    text: ""
  };

  componentDidMount() {
    const { direction, length } = this.state;
    const text = Arrow.convert(direction, length);
    this.setState({ text });
  }

  render() {
    const { x, y, text } = this.state;
    const { zoomLevel, enterEditMode } = this.props;
    return (
      <WithBackground
        x={x}
        y={y}
        zoomLevel={zoomLevel}
        onDoubleClick={enterEditMode}
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
  enterEditMode: PropTypes.func.isRequired
};

export default editable(Arrow);

export const drawArrow = ({ x, y, length, direction, id, ref, zoomLevel }) => (
  <Arrow
    key={id}
    ref={ref}
    x={x}
    y={y}
    length={length}
    direction={direction}
    zoomLevel={zoomLevel}
  />
);

drawArrow.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  direction: PropTypes.oneOf([...Object.values(DIRECTION_ARROW)]).isRequired,
  zoomLevel: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  ref: PropTypes.shape({
    current: PropTypes.any.isRequired
  }).isRequired
};
