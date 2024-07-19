/* eslint-disable react-refresh/only-export-components */
import styled from 'styled-components';
import { Categories, customTodoState, IToDo, todoState } from '../atom';
import { useSetRecoilState } from 'recoil';
import { AiFillDelete } from 'react-icons/ai';
import { Draggable } from '@hello-pangea/dnd';
import React from 'react';

interface Iprops {
  text: string;
  id: number;
  category: string | Categories;
  index: number;
}
interface IBtnProps {
  status: IToDo['category'];
  isCustomCategory: boolean;
}

const TodoItem = styled.div`
  height: 40px;
  line-height: 40px;
  opacity: 1;
  transform: translateX(0);
  border-bottom: solid #b0b0b0 2px;
  margin-bottom: 5px;
  &.item-enter {
    opacity: 0;
    transform: translateX(-100%);
  }

  &.item-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: all 500ms;
  }

  &.item-exit {
    opacity: 1;
    transform: translateX(0);
  }

  &.item-exit-active {
    opacity: 0;
    transform: translateX(100%);
    transition: all 500ms;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  div {
    display: flex;
    flex: 1;
    justify-content: end;
    margin-right: 1rem;
  }
`;
const Text = styled.span`
  width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 0.5rem;
  padding-left: 1.2rem;
`;
const Btn = styled.button<IBtnProps>`
  display: ${(props) => (props.isCustomCategory ? 'none' : 'flex')};
  padding: 0 0.5rem;
  line-height: 21px;
  border-radius: 10.5px;
  font-size: small;
  height: 21px;
  transition: all ease-in 0.25s;
  background-color: ${(props) => {
    if (props.status === Categories.TO_DO) return '#C8D5FF';
    if (props.status === Categories.DOING) return '#FED5FF';
    return '#E9EC97';
  }};
  color: ${(props) => {
    if (props.status === Categories.TO_DO) return '#7a8ccc';
    if (props.status === Categories.DOING) return '#FF81FF';
    return '#afb217';
  }};
  min-width: ${(props) => props.status === Categories.TO_DO && '50px'};
`;

const DeleteBtn = styled.button`
  color: black;
  background-color: transparent;
  display: flex;
  align-items: center;
  font-size: large;
  transition: all ease-in-out 0.25s;
  &:hover {
    scale: 1.2;
    color: tomato;
    transform: rotate(15deg);
  }
`;
function Todo({ text, category, id, index }: Iprops) {
  const isCustomCategory = !Object.values(Categories).includes(
    category as Categories
  );

  const setTodos = useSetRecoilState(todoState);
  const setCustomTodos = useSetRecoilState(customTodoState);

  const onClick = () => {
    setTodos((oldTodos) => {
      const newTodos = oldTodos.map((todo) => {
        if (todo.id !== id) return todo;

        switch (todo.category) {
          case Categories.TO_DO:
            return { ...todo, category: Categories.DOING };
          case Categories.DOING:
            return { ...todo, category: Categories.DONE };
          default:
            return { ...todo, category: Categories.TO_DO };
        }
      });
      return newTodos;
    });
  };
  const deleteTodo = () => {
    if (isCustomCategory) {
      setCustomTodos((oldTodos) => {
        return {
          ...oldTodos,
          [category]: oldTodos[category].filter((todo) => todo.id !== id),
        };
      });
      return;
    }
    setTodos((oldTodos) => oldTodos.filter((todo) => todo.id !== id));
  };

  return (
    <Draggable draggableId={String(id)} index={index}>
      {(provided) => (
        <TodoItem
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <Container>
            <Text>{text}</Text>
            <div>
              <Btn
                onClick={onClick}
                status={category}
                isCustomCategory={isCustomCategory}
              >
                {category}
              </Btn>
            </div>
            <DeleteBtn onClick={deleteTodo}>
              <AiFillDelete />
            </DeleteBtn>
          </Container>
        </TodoItem>
      )}
    </Draggable>
  );
}
export default React.memo(Todo);
