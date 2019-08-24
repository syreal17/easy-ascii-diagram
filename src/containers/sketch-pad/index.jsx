import React, { Component } from "react";
import { debounce } from "lodash";

import { TOOLS, COMMANDS, ACTIONS, TOOLBAR_HEIGHT } from "../../constants";

import Grid from "../../components/grid";
import Diagram from "../../components/diagram";
import PopUp from "../../components/pop-up";
import ToolBar from "../toolbar";

import { TextArea, Border } from "./style";

const calculateTotalGridNumber = zoomLevel => {
  const totalRow = Math.floor(
    (window.innerHeight - TOOLBAR_HEIGHT) / zoomLevel
  );
  const totalColumn = Math.floor(window.innerWidth / zoomLevel);
  return { totalRow, totalColumn };
};

const selectAndCopy = e => {
  e.target.focus();
  e.target.select();
  document.execCommand("copy");
};

class SketchPad extends Component {
  constructor(props) {
    super(props);

    const zoomLevel = 1;
    const { totalRow, totalColumn } = calculateTotalGridNumber(zoomLevel);

    this.state = {
      zoomLevel,
      tool: TOOLS.arrow,
      content: [],
      future: [],
      showPopUp: false,
      resultText: "",
      border: {
        up: totalRow,
        down: 0,
        left: totalColumn,
        right: 0
      }
    };
    this.result = null;
    this.nodes = new Map();
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  addToResult = (x, y, text) => {
    const { border } = this.state;
    let curX = x - border.left;
    let curY = y - border.up;
    let index = 0;
    while (index < text.length) {
      if (text[index] === "\n") {
        curY += 1;
        curX = x - border.left;
      } else {
        curX += 1;
        this.result[curY][curX] = text[index];
      }
      index += 1;
    }
  };

  closePopUp = e => {
    this.setState({ showPopUp: false });
  };

  setZoomLevel = zoom => {
    this.setState({ zoomLevel: zoom });
  };

  commitDrawing = shape => {
    const { content } = this.state;
    this.setState({
      content: [...content, shape]
    });
  };

  updateBorder = borderBuffer => {
    const { border } = this.state;
    const newUp = borderBuffer.up < border.up ? borderBuffer.up : border.up;
    const newLeft =
      borderBuffer.left < border.left ? borderBuffer.left : border.left;
    const newDown =
      borderBuffer.down > border.down ? borderBuffer.down : border.down;
    const newRight =
      borderBuffer.right > border.right ? borderBuffer.right : border.right;
    const newBorder = {
      up: newUp,
      down: newDown,
      left: newLeft,
      right: newRight
    };
    this.setState({
      border: newBorder
    });
  };

  handleResize = () =>
    debounce(() => {
      const { zoomLevel } = this.state;
      const { totalRow, totalColumn } = calculateTotalGridNumber(zoomLevel);
    }, 500);

  handleAction = e => {
    switch (e.target.value) {
      case ACTIONS.export:
        this.export();
        break;
      case ACTIONS.save:
        break;
      default:
        break;
    }
  };

  handleCommand = e => {
    const { content, future } = this.state;
    let present;
    switch (e.target.value) {
      case COMMANDS.undo:
        present = content.pop();
        future.unshift(present);
        this.setState({
          content,
          future
        });
        break;
      case COMMANDS.redo:
        present = future.shift();
        content.push(present);
        this.setState({
          content,
          future
        });
        break;
      case COMMANDS.moveUp:
        break;
      case COMMANDS.moveDown:
        break;
      case COMMANDS.zoomIn:
        break;
      case COMMANDS.zoomOut:
        break;
      default:
        break;
    }
  };

  handleTool = e => {
    this.setState({ tool: e.target.value });
  };

  export() {
    const { content, border } = this.state;
    this.result = Array(border.down - border.up)
      .fill(" ")
      .map(() => Array(border.right - border.left).fill(" "));

    content.forEach(el => {
      const { state } = el.ref.current;
      this.addToResult(state.x, state.y, state.text);
    });
    const resultText = this.result.map(arr => arr.join("")).join("\n");

    this.setState({ showPopUp: true, resultText });
  }

  render() {
    const {
      tool,
      zoomLevel,
      content,
      showPopUp,
      resultText,
      border
    } = this.state;
    return (
      <React.Fragment>
        <ToolBar
          currentTool={tool}
          currentZoom={zoomLevel}
          handleAction={this.handleAction}
          handleCommand={this.handleCommand}
          handleTool={this.handleTool}
        />
        <Grid zoomLevel={zoomLevel} />
        {/* <Border
          up={border.up}
          left={border.left}
          right={border.right}
          down={border.down}
        /> */}
        <Diagram
          tool={tool}
          zoomLevel={zoomLevel}
          content={content}
          commitDrawing={this.commitDrawing}
          updateBorder={this.updateBorder}
          setRef={(key, ref) => this.nodes.set(key, ref)}
        />

        {showPopUp ? (
          <PopUp
            closePopUp={this.closePopUp}
            header="Click to copy, paste it into doc with a monospace font"
          >
            <TextArea
              onClick={selectAndCopy}
              readOnly
              rows="20"
              cols="80"
              value={resultText}
            />
          </PopUp>
        ) : null}
      </React.Fragment>
    );
  }
}

export default SketchPad;
