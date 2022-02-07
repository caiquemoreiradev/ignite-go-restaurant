import styled from 'styled-components';

export const FoodsContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px;
  margin-top: -140px;

  display: grid;

  grid-template-columns: repeat(3, 1fr);
  grid-gap: 32px;
`;
