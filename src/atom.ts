import { atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const mainTodoAtom = recoilPersist({
  key: 'mainTodo',
  storage: localStorage,
}).persistAtom;
const customTodoAtom = recoilPersist({
  key: 'customTodo',
  storage: localStorage,
}).persistAtom;
const customCategoriesAtom = recoilPersist({
  key: 'customCategories',
  storage: localStorage,
}).persistAtom;
export enum Categories {
  'TO_DO' = 'To-do',
  'DOING' = 'Doing',
  'DONE' = 'Done',
}
export interface IToDo {
  id: number;
  text: string;
  category: Categories | string;
}
export const animationState = atom({ key: 'animation', default: true });
export const categoryState = atom<Categories | null>({
  key: 'category',
  default: null,
});
export const todoState = atom<IToDo[]>({
  key: 'toDo',
  default: [],
  effects_UNSTABLE: [mainTodoAtom],
});
export const todoSelector = selector({
  key: 'toDoSelector',
  get: ({ get }) => {
    const todos = get(todoState);
    const filter = get(categoryState);

    const todoFilterd = todos.filter((todo) => {
      if (filter === null) return true;
      return filter === todo.category;
    });

    return todoFilterd;
  },
});

export type ICustomCategory = string;

export interface ICustomCToDos {
  [key: ICustomCategory]: IToDo[];
}

export const customCategoryState = atom<ICustomCategory[]>({
  key: 'customCategory',
  default: [],
  effects_UNSTABLE: [customCategoriesAtom],
});
export const customTodoState = atom<ICustomCToDos>({
  key: 'customTodo',
  default: {},
  effects_UNSTABLE: [customTodoAtom],
});
