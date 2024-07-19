import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { Categories, categoryState } from '../atom';
import React from 'react';

const Container = styled.header`
  background-color: ${(props) => props.theme.bgContainer};
  height: 70px;
  padding: 1.2rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-right-radius: 1rem;
  border-top-left-radius: 1rem;
  @media (max-width: 800px) {
    border-radius: 0;
  }
`;
const Filters = styled.div`
  display: flex;
  gap: 0.5rem;
  color: white;
`;
const Icon = styled.button<{ activated: boolean; accentColor: string }>`
  background-color: inherit;
  color: white;
  color: ${(props) => (props.activated ? props.accentColor : 'white')};
  transition: color ease-in-out 0.25s;
`;
const Title = styled.button<{ activated: boolean }>`
  background-color: inherit;
  margin-right: 1rem;
  font-size: x-large;
  color: ${(props) => (props.activated ? '#FF7F50' : 'white')};
  letter-spacing: 0.4rem;
  transition: color ease-in-out 0.25s;
`;
export default function Header() {
  const [category, setCategory] = useRecoilState(categoryState);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    if (name === '') {
      setCategory(null);
      return;
    }
    setCategory(name as Categories);
  };
  return (
    <Container>
      <Title onClick={onClick} activated={category === null}>
        Todos
      </Title>
      <Filters>
        <Icon
          onClick={onClick}
          name={Categories.TO_DO}
          activated={category === Categories.TO_DO}
          accentColor='#C8D5FF'
        >
          Todo
        </Icon>
        <Icon
          onClick={onClick}
          name={Categories.DOING}
          activated={category === Categories.DOING}
          accentColor='#FED5FF'
        >
          Doing
        </Icon>
        <Icon
          onClick={onClick}
          name={Categories.DONE}
          activated={category === Categories.DONE}
          accentColor='#E9EC97'
        >
          Done
        </Icon>
      </Filters>
    </Container>
  );
}
