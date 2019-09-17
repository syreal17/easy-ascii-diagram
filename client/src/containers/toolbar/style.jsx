import styled from "styled-components";
import { TOOLBAR_HEIGHT } from "../../constants";
import { styleSettings } from "../../assets/styles/settings";

const { spacerXs, spacerSm, radiusSm, gray, yellow, pink } = styleSettings;

export const Wrapper = styled.nav`
  z-index: 100;
  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  height: ${TOOLBAR_HEIGHT}px;
  width: 100%;
  background: ${gray};
`;

const Container = styled.div`
  text-align: center;
`;

export const Tool = styled(Container)`
  flex: 30%;
`;
export const Command = styled(Container)`
  flex: 50%;
`;
export const Action = styled(Container)`
  flex: 20%;
`;

const Button = styled.button`
  padding: ${spacerSm};
  margin: ${spacerXs};
  border-radius: ${radiusSm};
  background: ${props => (props.active ? pink : "auto")};

  &:focus {
    outline: 1px solid ${yellow};
  }

  &:hover {
    background: ${pink};
    cursor: pointer;
  }
`;

export const IconButton = styled(Button)``;
