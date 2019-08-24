import React from "react";
import PropTypes from "prop-types";
import Rectangle from "./shape/rectangle";
import Line from "./shape/line";
import Arrow from "./shape/arrow";
import Text from "./shape/text";
import Eraser from "./shape/eraser";
import { randomId } from "../util";

import { DIRECTION_LINE, DIRECTION_ARROW } from "../constants";

const sharedProps = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  zoomLevel: PropTypes.number.isRequired,
  key: PropTypes.string.isRequired,
  ref: PropTypes.shape({
    current: PropTypes.any.isRequired
  }).isRequired,
  enterEditMode: PropTypes.func.isRequired,
  exitEditMode: PropTypes.func.isRequired
};

export const drawRectangle = props => <Rectangle {...props} />;

drawRectangle.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  ...sharedProps
};

export const drawLine = props => <Line {...props} />;

drawLine.propTypes = {
  length: PropTypes.number.isRequired,
  direction: PropTypes.oneOf([...Object.values(DIRECTION_LINE)]).isRequired,
  ...sharedProps
};

export const drawArrow = props => <Arrow {...props} />;

drawArrow.propTypes = {
  length: PropTypes.number.isRequired,
  direction: PropTypes.oneOf([...Object.values(DIRECTION_ARROW)]).isRequired,
  ...sharedProps
};

export const drawText = props => {
  return <Text {...props} />;
};

drawText.propTypes = {
  content: PropTypes.string.isRequired,
  ...sharedProps
};

export const erase = props => <Eraser key={randomId()} {...props} />;

erase.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  zoomLevel: PropTypes.number.isRequired
};