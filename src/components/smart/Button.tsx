import styled from '@emotion/styled';

const Button = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: black;
  padding: 0;
  margin: 0;
  //font-size: 14px;
`;
const SmartButton = (props) => {
  return <Button>{props.children}</Button>;
};
export default SmartButton;
