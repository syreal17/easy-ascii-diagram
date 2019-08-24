import React, { Component, forwardRef } from "react";
import PropTypes from "prop-types";
import Editor from "../components/editor";
import { randomId } from "../util";
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from "../constants";

function editable(WrappedComponent) {
  class Editable extends Component {
    state = {
      editing: false,
      x: null,
      y: null,
      width: null,
      height: null,
      horizontal: false,
      vertical: false,
      id: randomId()
    };

    componentDidMount() {}

    getResizeDirection() {
      const { direction, content } = this.props.forwardedRef.current.state;

      let horizontal;
      let vertical;
      if (Object.values(DIRECTION_HORIZONTAL).includes(direction)) {
        horizontal = true;
        vertical = false;
      } else if (Object.values(DIRECTION_VERTICAL).includes(direction)) {
        horizontal = false;
        vertical = true;
      } else {
        horizontal = true;
        vertical = true;
      }

      if (content != null) {
        horizontal = false;
        vertical = false;
      }
      return { horizontal, vertical };
    }

    handleClickOutside = e => {
      const { id } = this.state;

      if (e.target.closest(`#${id}`)) return;
      const { exitEditMode } = this.props;

      this.setState({ editing: false });
      exitEditMode();
      window.removeEventListener("click", this.handleClickOutside);
    };

    handleOnDoubleClick = e => {
      const { width, height } = e.target.getBoundingClientRect();
      const { x, y, enterEditMode } = this.props;
      const { horizontal, vertical } = this.getResizeDirection();

      this.setState({
        editing: true,
        x,
        y,
        width,
        height,
        horizontal,
        vertical
      });
      enterEditMode();
      window.addEventListener("click", this.handleClickOutside);
    };

    render() {
      const {
        editing,
        x,
        y,
        width,
        height,
        horizontal,
        vertical,
        id
      } = this.state;
      const { forwardedRef, ...rest } = this.props;

      return (
        <>
          <WrappedComponent
            handleOnDoubleClick={this.handleOnDoubleClick}
            ref={forwardedRef}
            {...rest}
          />
          {editing ? (
            <>
              <Editor
                id={id}
                x={x}
                y={y}
                width={width}
                height={height}
                horizontal={horizontal}
                vertical={vertical}
              />
            </>
          ) : null}
        </>
      );
    }
  }

  Editable.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    forwardedRef: PropTypes.shape({
      current: PropTypes.any
    }).isRequired,
    enterEditMode: PropTypes.func.isRequired,
    exitEditMode: PropTypes.func.isRequired
  };

  return forwardRef((props, ref) => <Editable {...props} forwardedRef={ref} />);
}

export default editable;
