import styled from 'styled-components';

export const ButtonStyled = styled.button`
  padding: 0;
  margin-top: 4px;
  line-height: 15px;
  color: white;
  width: 15px;
  height: 15px;
  border-radius: 40px;
  font-size: 23px;
  text-align: center;
  background-color: ${(props) => props.inputColor || 'palevioletred'};
  border: none;
  float: right;
`;

export const ButtonEditStatus = styled.button`
  color: white;
  width: 90px;
  height: 40px;
  font-size: 17px;
  text-align: center;
  background-color: #5daf68;
  float: right;
  border: none;
  border-radius: 2em;
`;
