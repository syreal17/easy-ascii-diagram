/* eslint-disable no-case-declarations */
import React, { Component } from "react";
import { debounce } from "lodash";

import {
  TOOLS,
  COMMANDS,
  ACTIONS,
  TOOLBAR_HEIGHT,
  EDITOR_COMMAND,
  TRANSACTION,
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL
} from "../../constants";

import Grid from "../../components/grid";
import Diagram from "../../components/diagram";
import PopUp from "../../components/pop-up";
import ToolBar from "../toolbar";
import Transaction from "../../lib/transaction";
// import Shape from "../../lib/shape/shape";

import { TextArea, Border, Debug } from "./style";

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

const isOverlapped = (targetNode, otherNode) => {
  const { state: target } = targetNode.ref.current;
  const { state: other } = otherNode.ref.current;
  if (
    target.x + target.width >= other.x &&
    target.x <= other.x + other.width &&
    target.y + target.height >= other.y &&
    target.y <= other.y + other.height
  ) {
    return true;
  }

  return false;
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
      past: [],
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

  commitDrawing = drawing => {
    const { content, past } = this.state;
    console.log(drawing);
    const { shape, id, ref } = drawing;
    const { props } = shape;
    this.nodes.set(id, ref);

    const tx = new Transaction(
      TRANSACTION.create,
      id,
      props.shape,
      null,
      props
    );

    this.updateBorder(props);
    console.log(tx);

    this.setState({
      content: [...content, shape],
      past: [...past, tx]
    });
  };

  commitEditing = (target, oldProps, newProps) => {
    const { id } = newProps;
    const { past } = this.state;

    const tx = new Transaction(
      TRANSACTION.edit,
      id,
      target.shape,
      oldProps,
      newProps
    );

    this.updateBorder(newProps);
    console.log(tx);
    this.setState({
      past: [...past, tx]
    });
  };

  commitDeleting = targetIndex => {
    const { past, content } = this.state;
    const shape = content[targetIndex];
    const { props } = shape;

    const tx = new Transaction(
      TRANSACTION.delete,
      props.id,
      props.shape,
      props,
      null
    );

    this.nodes.delete(props.id);
    this.updateBorder(props);
    console.log(tx);

    this.setState({
      content: [
        ...content.slice(0, targetIndex),
        ...content.slice(targetIndex + 1, content.length)
      ],
      past: [...past, tx]
    });
  };

  updateBorder = ({ x, y, height, width, length, direction }) => {
    let calHeight;
    let calWidth;
    if (direction) {
      if (Object.values(DIRECTION_HORIZONTAL).includes(direction)) {
        calHeight = 1;
        calWidth = length;
      } else {
        calHeight = length;
        calWidth = 1;
      }
    }

    const borderBuffer = {
      up: y,
      down: y + height || y + calHeight,
      left: x,
      right: x + width || x + calWidth
    };

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
    const { content, future, past } = this.state;
    let present;
    let tx;
    let target;
    switch (e.target.value) {
      case COMMANDS.undo:
        tx = past.pop();
        if (tx) {
          switch (tx.type) {
            case TRANSACTION.create:
              present = content.pop();
              future.unshift(present);
              this.setState({
                content,
                future
              });
              break;
            case TRANSACTION.edit:
              target = this.nodes.get(tx.id);
              console.log(target.current, tx.oldState);

              break;
            default:
              break;
          }
        }

        break;
      case COMMANDS.redo:
        present = future.shift();
        content.push(present);
        this.setState({
          content,
          future
        });
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

  handleFloatingMenu = (e, id) => {
    const { content } = this.state;
    const targetIndex = content.findIndex(el => el.key === id);
    const target = content[targetIndex];

    switch (e.target.value) {
      case EDITOR_COMMAND.moveUp:
        for (let i = targetIndex + 1; i < content.length; i++) {
          if (isOverlapped(target, content[i])) {
            content.splice(targetIndex, 1);
            content.splice(i, 0, target);
            this.setState({
              content
            });
            break;
          }
        }
        break;
      case EDITOR_COMMAND.moveDown:
        for (let i = targetIndex - 1; i >= 0; i--) {
          if (isOverlapped(target, content[i])) {
            content.splice(targetIndex, 1);
            content.splice(i, 0, target);
            this.setState({
              content
            });
            break;
          }
        }
        break;
      case EDITOR_COMMAND.delete:
        this.commitDeleting(targetIndex);
        break;
      default:
        break;
    }
  };

  export() {
    const { content, border } = this.state;
    const rows = border.down - border.up <= 0 ? 0 : border.down - border.up;
    const cols =
      border.right - border.left <= 0 ? 0 : border.right - border.left;
    this.result = Array(rows)
      .fill(" ")
      .map(() => Array(cols).fill(" "));

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
        <Border
          up={border.up}
          left={border.left}
          right={border.right}
          down={border.down}
        />
        <Diagram
          tool={tool}
          zoomLevel={zoomLevel}
          content={content}
          commitDrawing={this.commitDrawing}
          commitEditing={this.commitEditing}
          updateBorder={this.updateBorder}
          handleFloatingMenu={this.handleFloatingMenu}
        />
        {/* <Debug>
          {content.map(el =>
            Object.keys(el.props).map(key => (
              <p>
                {key} : {el.props[key]}
              </p>
            ))
          )}
        </Debug> */}

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
