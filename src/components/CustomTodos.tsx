import styled from 'styled-components';
import CreateCategory from './CreateCategory';
import { useRecoilState } from 'recoil';
import { animationState, customCategoryState, customTodoState } from '../atom';
import CustomTodo from './CustomTodo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useEffect } from 'react';

const Container = styled.div`
  width: max-content;
  height: 750px;
  max-height: 100vh;
  @media (max-width: 800px) {
    display: none;
  }
`;
const Todos = styled.ul`
  height: 100%;
  & .todos {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`;
export default function CustomTodos() {
  const [categories, setCategories] = useRecoilState(customCategoryState);
  const [todos, setTodos] = useRecoilState(customTodoState);
  const [shouldAnimate, setShouldAnimate] = useRecoilState(animationState);
  const onDragEnd = async (args: DropResult) => {
    await editTodos(args);
    setShouldAnimate(true);
  };
  const editTodos = async (args: DropResult) => {
    const { draggableId, destination, source } = args;
    if (destination === null) return;
    if (destination.droppableId === source.droppableId) {
      setTodos((oldTodos) => {
        const editedTodos = [...oldTodos[source.droppableId]];
        const todoItem = oldTodos[source.droppableId].find(
          (todo) => todo.id === +draggableId
        );
        if (todoItem === undefined) return oldTodos;
        editedTodos.splice(source.index, 1);
        editedTodos.splice(destination.index, 0, todoItem);
        const newTodos = {
          ...oldTodos,
          [destination.droppableId]: editedTodos,
        };
        return newTodos;
      });

      return;
    }
    setTodos((oldTodos) => {
      const todoItem = oldTodos[source.droppableId].find(
        (todo) => todo.id === +draggableId
      );
      if (todoItem === undefined) return oldTodos;
      const sourceTodos = oldTodos[source.droppableId].filter(
        (todo) => todo.id !== +draggableId
      );
      const destinationTodos = [...oldTodos[destination.droppableId]];
      destinationTodos.splice(destination.index, 0, {
        ...todoItem,
        category: destination.droppableId,
      });

      const newTodos = {
        ...oldTodos,
        [source.droppableId]: sourceTodos,
        [destination.droppableId]: destinationTodos,
      };

      return newTodos;
    });
  };
  useEffect(() => {
    if (categories.length !== 0) return;
    setCategories(['Box1', 'Box2', 'Box3']);
    setTodos({
      Box1: [
        {
          id: Date.now(),
          text: 'Drop this to any boxs',
          category: 'Box1',
        },
      ],
      Box2: [],
      Box3: [],
    });
    console.log(todos);
  }, []);
  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Todos>
          <TransitionGroup
            enter={shouldAnimate}
            exit={shouldAnimate}
            className='todos'
          >
            {categories?.map((category, i) => {
              const todosByCategory = todos[category];
              return (
                <CSSTransition key={category} timeout={300} classNames='fade'>
                  <CustomTodo
                    todos={todosByCategory}
                    category={category}
                    cIndex={i}
                  />
                </CSSTransition>
              );
            })}
            <CreateCategory />
          </TransitionGroup>
        </Todos>
      </DragDropContext>
    </Container>
  );
}
