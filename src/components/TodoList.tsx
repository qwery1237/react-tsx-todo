import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useRecoilValue } from 'recoil';
import { todoSelector } from '../atom';
import Todo from './Todo';
import styled from 'styled-components';
import { Droppable } from '@hello-pangea/dnd';

const Container = styled.div``;

export default function TodoList() {
  const toDos = useRecoilValue(todoSelector);
  return (
    <Droppable droppableId='mainTodo'>
      {(provided) => (
        <Container {...provided.droppableProps} ref={provided.innerRef}>
          <TransitionGroup className='todo-list'>
            {toDos.map((todo, index) => (
              <CSSTransition key={todo.id} timeout={250} classNames='item'>
                <Todo key={todo.id} {...todo} index={index} />
              </CSSTransition>
            ))}
          </TransitionGroup>
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );
}
