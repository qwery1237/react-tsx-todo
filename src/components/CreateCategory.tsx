import { MdPostAdd } from 'react-icons/md';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { customCategoryState, customTodoState } from '../atom';
const Container = styled.button`
  width: 350px;
  max-width: 100%;
  height: 48%;
  margin-left: 2rem;
  background-color: transparent;
  border-radius: 1rem;
  border: solid 3px white;
  color: white;
  font-size: xx-large;
  transition: all ease-in-out 0.25s;
  &:hover {
    border-color: #ff7f50;
    color: #ff7f50;
  }
`;
export default function CreateCategory() {
  const [categories, setCategories] = useRecoilState(customCategoryState);
  const setTodos = useSetRecoilState(customTodoState);
  const onClick = () => {
    let newCategory = 'Todo' + (categories.length + 1);
    while (categories.includes(newCategory)) {
      newCategory = newCategory + '_(1)';
    }
    setCategories((prevCategories) => [...prevCategories, newCategory]);
    setTodos((prevTodos) => {
      return { ...prevTodos, [newCategory]: [] };
    });
  };
  return (
    <Container onClick={onClick}>
      <MdPostAdd />
    </Container>
  );
}
