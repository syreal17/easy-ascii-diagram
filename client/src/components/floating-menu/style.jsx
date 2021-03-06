import styled from "styled-components";
import { styleSettings } from "../../assets/styles/settings";
import { GRID_WIDTH } from "../../constants";

const { blue, zTopMost } = styleSettings;

export const Wrapper = styled.div`
  left: -${GRID_WIDTH * 7}px;
  position: absolute;
  outline: 2px solid ${blue};
  z-index: ${zTopMost};
  cursor: initial;
  display: flex;
  flex-flow: column;
`;
