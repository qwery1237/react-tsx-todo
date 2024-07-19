import styled from 'styled-components';
import Header from './Header';
import CreateTodo from './CreateTodo';
import TodoList from './TodoList';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Categories, categoryState, todoSelector, todoState } from '../atom';
import { useEffect } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  min-width: 350px;
  height: 100vh;
  max-height: 750px;

  @media (max-width: 800px) {
    width: 100vw;
    min-width: 300px;
    max-height: 100vh;
  }
`;
const MainBoard = styled.div`
  overflow-y: auto;
  padding: 1.2rem 1.5rem;
  flex: 1;
  background-color: white;
  hr {
    border: none;
    height: 2px;
    background-color: #b0b0b0;
    margin: 10px 0;
  }
`;
const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  span {
    margin: 0 2rem;
  }
`;
export default function MainTodos() {
  const todoByCategory = useRecoilValue(todoSelector);
  const setTodos = useSetRecoilState(todoState);
  const crrCategory = useRecoilValue(categoryState);
  const onDragEnd = (args: DropResult) => {
    const { draggableId, destination, source } = args;

    if (destination === null || destination?.index === source.index) return;

    if (crrCategory !== null) {
      setTodos((oldTodos) => {
        const newTodos = [...oldTodos];
        const todoItem = todoByCategory[source.index];
        const targetId = todoByCategory[destination.index].id;
        const oldIndex = newTodos.findIndex((todo) => todo.id === +draggableId);
        const newIndex = newTodos.findIndex((todo) => todo.id === targetId);
        newTodos.splice(oldIndex, 1);
        newTodos.splice(newIndex, 0, todoItem);

        return newTodos;
      });
      return;
    }

    setTodos((oldTodos) => {
      const newTodos = [...oldTodos];
      const todoItem = oldTodos[source.index];
      newTodos.splice(source.index, 1);
      newTodos.splice(destination.index, 0, todoItem);
      return newTodos;
    });
  };
  useEffect(() => {
    setTodos((todos) =>
      todos.length === 0
        ? [
            {
              id: Date.now(),
              text: 'Drag and drop this',
              category: Categories.TO_DO,
            },
          ]
        : todos
    );
  }, []);
  return (
    <Container>
      <Header />
      <MainBoard>
        <ListHeader>
          <span>Tasks</span>
          <span>Status</span>
        </ListHeader>
        <hr />
        <DragDropContext onDragEnd={onDragEnd}>
          <TodoList />
        </DragDropContext>
      </MainBoard>
      <CreateTodo />
    </Container>
  );
}
