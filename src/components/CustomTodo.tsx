/* eslint-disable react-refresh/only-export-components */
import styled from 'styled-components';
import {
  animationState,
  customCategoryState,
  customTodoState,
  ICustomCategory,
  IToDo,
} from '../atom';
import Todo from './Todo';
import CreateTodo from './CreateTodo';
import { FaRegEdit } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Droppable } from '@hello-pangea/dnd';

interface IProps {
  todos: IToDo[];
  category: ICustomCategory;
  cIndex: number;
}
interface IFormData {
  newCategory: ICustomCategory;
}
export interface IColor {
  text: string;
  container: string;
}
const COLOR_REF: IColor[] = [
  { text: '', container: '#afb217' },
  { text: '', container: '#FF81FF' },
  { text: '', container: '#7a8ccc' },
  { text: '', container: '#FF7F50' },
];
const Container = styled.div`
  width: 350px;
  height: 48%;
  display: inline-flex;
  flex-direction: column;
  margin-left: 2rem;
  &.fade-enter {
    transform: scale(0);
    opacity: 0;
  }
  &.fade-enter-active {
    transform: scale(1);
    opacity: 1;
    transition: transform 300ms, opacity 300ms;
  }
  &.fade-exit {
    transform: scale(1);
    opacity: 1;
  }
  &.fade-exit-active {
    transform: scale(0);
    opacity: 0;
    transition: transform 300ms, opacity 300ms;
  }
`;
const Form = styled.form``;
const TitleInput = styled.input<{ length: number }>`
  min-width: 6ch;
  width: ${(props) => props.length * 2}ch;
  max-width: 21ch;
  background-color: transparent;
  color: white;
  font-size: x-large;
  letter-spacing: 0.4rem;
  border: none;
  outline: none;
`;
const TitleContainer = styled.div<{ colors: IColor }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${(props) => props.colors.container};
  height: 70px;
  padding: 1.2rem 1.5rem;
  border-top-right-radius: 1rem;
  border-top-left-radius: 1rem;
  color: white;
`;
const Title = styled.div`
  font-size: x-large;
  letter-spacing: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const EditBtn = styled.button`
  background-color: transparent;
  padding-top: 0.32rem;
  color: white;
`;

const Todos = styled.div`
  flex: 1;
  background-color: white;
  padding: 1.2rem 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
`;
const DeleteBtn = styled(EditBtn)``;
function CustomTodo({ todos, category, cIndex }: IProps) {
  const [colorRef, setColorRef] = useState<IColor>(COLOR_REF[cIndex % 4]);
  const [isEditing, setIsEditing] = useState(false);
  const [length, setLength] = useState(category.length);
  const [categories, setCategories] = useRecoilState(customCategoryState);
  const setCustomTodos = useSetRecoilState(customTodoState);
  const [shouldAnimate, setShouldAnimate] = useRecoilState(animationState);

  const { register, handleSubmit, setValue, reset } = useForm<IFormData>({
    defaultValues: {
      newCategory: category,
    },
  });
  useEffect(() => {
    setTimeout(() => {
      setColorRef(COLOR_REF[cIndex % 4]);
    }, 300);
  }, [cIndex]);
  useEffect(() => {
    reset({ newCategory: category });
    setLength(category.length);
  }, [category, reset]);
  useEffect(() => {
    setShouldAnimate(!isEditing);
  }, [isEditing]);
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    const crrLength = value.length;
    if (crrLength > 12) {
      setValue('newCategory', value.substring(0, 12));
      return;
    }
    setValue('newCategory', value);
    setLength(crrLength);
  };
  const onSubmit = async ({ newCategory }: IFormData) => {
    await updateTodos(newCategory);
    setIsEditing(false);
  };
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    if (!isValidInput(value)) {
      rejectSubmit();
      setIsEditing(false);
      return;
    }

    setValue('newCategory', value);
    handleSubmit(onSubmit)();
  };
  const submit = async ({ newCategory }: IFormData) => {
    if (!isValidInput(newCategory)) {
      setIsEditing(false);
      rejectSubmit();
      return;
    }

    setValue('newCategory', newCategory);
    await updateTodos(newCategory);
    setIsEditing(false);
  };
  const isValidInput = (text: string) => {
    return text !== '' && !categories.includes(text);
  };
  const rejectSubmit = () => {
    setValue('newCategory', category);
    setLength(category.length);
  };
  const updateTodos = async (newCategory: string) => {
    setCustomTodos((oldTodos) => {
      const newTodos = { ...oldTodos };
      const targetTodo = oldTodos[category];
      const editedTodo = targetTodo.map((todo) => {
        return { ...todo, category: newCategory };
      });
      delete newTodos[category];
      return { ...newTodos, [newCategory]: editedTodo };
    });
    setCategories((oldCategories) => {
      const newCategories = [...oldCategories];
      newCategories.splice(cIndex, 1);
      newCategories.splice(cIndex, 0, newCategory);
      return newCategories;
    });
  };
  const deleteCategory = (category: ICustomCategory) => {
    setCategories((oldCategories) =>
      oldCategories.filter((cat) => cat !== category)
    );
    setCustomTodos((oldTodos) => {
      const newTodos = { ...oldTodos };
      delete newTodos[category];
      return newTodos;
    });
  };
  return (
    <Container>
      <TitleContainer colors={colorRef} onSubmit={handleSubmit(submit)}>
        {isEditing ? (
          <Form>
            <TitleInput
              length={length}
              {...register('newCategory')}
              onChange={onChange}
              onBlur={handleBlur}
              autoFocus
            />
          </Form>
        ) : (
          <>
            <Title>{category}</Title>
            <EditBtn onClick={toggleEdit}>
              <FaRegEdit />
            </EditBtn>
            <DeleteBtn onClick={() => deleteCategory(category)}>
              <FaTrashCan />
            </DeleteBtn>
          </>
        )}
      </TitleContainer>
      <Droppable droppableId={category}>
        {(provided, snapshot) => {
          if (snapshot.isDraggingOver) {
            setShouldAnimate(false);
          }
          return (
            <Todos {...provided.droppableProps} ref={provided.innerRef}>
              <TransitionGroup
                enter={shouldAnimate}
                exit={shouldAnimate}
                className='custom-todo-list'
              >
                {todos?.map((todo, index) => (
                  <CSSTransition key={todo.id} timeout={250} classNames='item'>
                    <Todo key={todo.id} {...todo} index={index} />
                  </CSSTransition>
                ))}
              </TransitionGroup>
              {provided.placeholder}
            </Todos>
          );
        }}
      </Droppable>
      <CreateTodo customCategory={category} colorRef={colorRef} />
    </Container>
  );
}

export default React.memo(CustomTodo);
