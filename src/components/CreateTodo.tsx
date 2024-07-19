import { useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  Categories,
  categoryState,
  customTodoState,
  ICustomCategory,
  todoState,
} from '../atom';
import styled from 'styled-components';
import { IColor } from './CustomTodo';
interface IProps {
  customCategory?: ICustomCategory;
  colorRef?: IColor;
}
interface IFormData {
  toDo: string;
}
const Container = styled.div<{ colors: IColor | undefined }>`
  height: 70px;
  background-color: ${(props) =>
    props.colors ? props.colors.container : props.theme.bgContainer};
  padding: 1rem 1.5rem;
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
  @media (max-width: 800px) {
    border-radius: 0;
  }
`;
const Form = styled.form`
  display: flex;
  height: 100%;
`;
const Input = styled.input`
  border: 0;
  flex: 1;
  border-top-left-radius: 19px;
  border-bottom-left-radius: 19px;
  padding-left: 1rem;
`;
const Btn = styled.button`
  border-top-right-radius: 19px;
  border-bottom-right-radius: 19px;
  padding-left: 0.75rem;
  padding-right: 1rem;
  background-color: #757575;
  color: white;
  transition: all 0.7s;

  &:hover {
    background-color: #b0b0b0;
    color: black;
  }
`;
export default function CreateTodo({ customCategory, colorRef }: IProps) {
  const { register, handleSubmit, setValue } = useForm<IFormData>();
  const setTodos = useSetRecoilState(todoState);
  const setCustomTodos = useSetRecoilState(customTodoState);
  const isCustomTodo = !!customCategory;
  const category = isCustomTodo
    ? customCategory
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useRecoilValue(categoryState);

  const onSubmit = ({ toDo }: IFormData) => {
    if (isCustomTodo) {
      setCustomTodos((allTodos) => {
        const targetTodos = allTodos[customCategory];
        const newTodos = [
          { id: Date.now(), text: toDo, category: customCategory },
          ...targetTodos,
        ];

        return { ...allTodos, [customCategory]: newTodos };
      });
      setValue('toDo', '');

      return;
    }
    setTodos((prev) => [
      { id: Date.now(), text: toDo, category: category || Categories.TO_DO },
      ...prev,
    ]);
    setValue('toDo', '');
  };
  return (
    <Container colors={colorRef}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('toDo', { required: 'Please write a to do' })}
          type='text'
          placeholder='Write a to do'
        />
        <Btn>Add</Btn>
      </Form>
    </Container>
  );
}
