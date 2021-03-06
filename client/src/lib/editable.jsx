import React, { Component, forwardRef } from "react";
import PropTypes from "prop-types";
import Editor from "../components/editor";
import { randomId, getX, getY } from "../util";
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL, TOOLS } from "../constants";

function editable(WrappedComponent) {
  class Editable extends Component {
    constructor(props) {
      super(props);
      const { forwardedRef, ...rest } = this.props;
      this.state = {
        editing: false,
        x: null,
        y: null,
        width: null,
        height: null,
        horizontal: false,
        vertical: false,
        id: randomId(),
        originalProps: rest,
        newProps: rest
      };
    }

    componentWillUnmount() {
      window.removeEventListener("click", this.handleClickOutside);
      const { exitEditMode } = this.props;
      exitEditMode();
    }

    getResizeDirection() {
      const { direction, content } = this.props.forwardedRef.current.state;

      let horizontal;
      let vertical;

      if (content != null) {
        horizontal = false;
        vertical = false;
      } else if (Object.values(DIRECTION_HORIZONTAL).includes(direction)) {
        horizontal = true;
        vertical = false;
      } else if (Object.values(DIRECTION_VERTICAL).includes(direction)) {
        horizontal = false;
        vertical = true;
      } else {
        horizontal = true;
        vertical = true;
      }

      return { horizontal, vertical };
    }

    handleClickOutside = e => {
      const { id } = this.state;

      if (e.target.closest(`#${id}`)) return;
      const { exitEditMode } = this.props;

      this.setState({ editing: false });

      exitEditMode();
      this.commit();
      window.removeEventListener("click", this.handleClickOutside);
    };

    handleOnDoubleClick = e => {
      e.stopPropagation();
      const { x, y, width, height } = e.target.getBoundingClientRect();
      const { enterEditMode } = this.props;
      const { horizontal, vertical } = this.getResizeDirection();
      this.setState({
        editing: true,
        x: getX(x),
        y: getY(y),
        width: getX(width),
        height: getY(height) + 1,
        horizontal,
        vertical
      });

      enterEditMode();
      window.addEventListener("click", this.handleClickOutside);
    };

    edit = newProps => {
      const { forwardedRef, ...rest } = this.props;
      const { x, y, width, height, content } = newProps;
      const length = width !== 1 ? width : height;

      switch (WrappedComponent.name.toUpperCase()) {
        case TOOLS.rectangle:
          this.setState({ newProps: { ...rest, x, y, width, height } });
          break;
        case TOOLS.arrow:
          this.setState({ newProps: { ...rest, x, y, length } });
          break;
        case TOOLS.line:
          this.setState({ newProps: { ...rest, x, y, length } });
          break;
        case TOOLS.text:
          this.setState({ newProps: { ...rest, x, y } });
          break;
        default:
          break;
      }
    };

    update = props => {
      // TODO: fix - when user undo an edit and then edit again, it is not updating the original prop
      const { newProps } = this.state;
      this.setState({ newProps: props, originalProps: newProps });
    };

    commit() {
      const { newProps, originalProps } = this.state;
      if (newProps === originalProps) {
        return;
      }
      const { commitEditing, forwardedRef } = this.props;
      commitEditing(forwardedRef.current, originalProps, newProps);
      this.setState({ originalProps: newProps });
    }

    render() {
      const {
        editing,
        x,
        y,
        width,
        height,
        horizontal,
        vertical,
        id,
        newProps
      } = this.state;
      const { forwardedRef, handleFloatingMenu, id: target } = this.props;

      return (
        <>
          <WrappedComponent
            handleOnDoubleClick={this.handleOnDoubleClick}
            update={this.update}
            ref={forwardedRef}
            editing={editing}
            {...newProps}
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
                edit={this.edit}
                handleFloatingMenu={handleFloatingMenu}
                target={target}
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
    id: PropTypes.string.isRequired,
    forwardedRef: PropTypes.shape({
      current: PropTypes.any
    }).isRequired,
    commitEditing: PropTypes.func.isRequired,
    enterEditMode: PropTypes.func.isRequired,
    exitEditMode: PropTypes.func.isRequired,
    handleFloatingMenu: PropTypes.func.isRequired
  };

  return forwardRef((props, ref) => <Editable {...props} forwardedRef={ref} />);
}

export default editable;
