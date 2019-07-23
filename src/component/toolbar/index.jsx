import React from 'react';
import PropTypes from 'prop-types';
import {
  Wrapper, Tool, Command, Action, IconButton,
} from './style';

const TOOLS = [
  'RECTANGLE',
  'LINE',
  'ARROW',
  'TEXT',
  'ERASER',
];

const COMMANDS = [
  'ZOOM_IN',
  'ZOOM_OUT',
  'UNDO',
  'REDO',
];

const ACTIONS = [
  'EXPORT',
  'SAVE',
];

const Toolbar = () => (
  <Wrapper>
    <Tool>{TOOLS.map(el => <IconButton key={el}>{el}</IconButton>)}</Tool>
    <Command>{COMMANDS.map(el => <IconButton key={el}>{el}</IconButton>)}</Command>
    <Action>{ACTIONS.map(el => <IconButton key={el}>{el}</IconButton>)}</Action>

  </Wrapper>
);

Toolbar.propTypes = {

};

export default Toolbar;