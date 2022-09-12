import { css } from '@emotion/react';
import styled from '@emotion/styled';

const Div = styled.div`
  height: 32px;
  display: flex;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #f2f2f2;
  }
  //font-size: 14px;
`;
const HoverWrapper = (props) => {
  return <Div className={props.className}>{props.children}</Div>;
};
export default HoverWrapper;
