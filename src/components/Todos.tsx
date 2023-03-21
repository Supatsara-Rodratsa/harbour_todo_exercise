'use client';

import { useState } from 'react';
import { Heart } from '@/components/icons/Heart';
import { Close } from '@/components/icons/Close';
import { AddTodo } from '@/components/AddTodo';
import { client } from '@/lib/client';
import {
  ADD_TODO_MUTATION,
  FINISH_TODO_MUTATION,
  REMOVE_TODO_MUTATION,
} from '@/constants/gql';
import { Reorder } from 'framer-motion';

export type Todo = {
  id: number;
  desc: string;
  finished: boolean;
  todo_list_id: number;
};

type TodosProps = {
  listId: number;
  list: Todo[];
};

export const Todos = ({ list = [], listId }: TodosProps) => {
  const [todos, setTodos] = useState<Todo[]>(list);

  const onAddHandler = async (desc: string) => {
    const { addTODO } = await client('AddTODO').request<{
      addTODO: Todo;
    }>(ADD_TODO_MUTATION, {
      listId: listId,
      desc: desc,
    });

    if (addTODO) {
      todos.push(addTODO);
      setTodos([...todos]);
    }
  };

  const onRemoveHandler = async (id: number) => {
    const { removeTODO } = await client('RemoveTODO').request<{
      removeTODO: boolean;
    }>(REMOVE_TODO_MUTATION, {
      removeTodoId: id,
      listId: listId,
    });

    if (removeTODO) {
      const index = todos.findIndex((todo: Todo) => todo.id === id);
      if (index !== -1) {
        todos.splice(index, 1);
        setTodos([...todos]);
      }
    }
  };

  const onFinishHandler = async (id: number) => {
    const { finishTODO } = await client('FinishTODO').request<{
      finishTODO: Todo;
    }>(FINISH_TODO_MUTATION, {
      finishTodoId: id,
      listId: listId,
    });

    if (finishTODO) {
      const index = todos.findIndex((todo: Todo) => todo.id === id);
      if (index !== -1) {
        todos.splice(index, 1);
        setTodos([...todos, finishTODO]);
      }
    }
  };

  return (
    <div>
      <h2 className="text-center text-5xl mb-10 text-blue-300">My TODO list</h2>
      <Reorder.Group values={todos} onReorder={setTodos}>
        {todos.map((item) => (
          <Reorder.Item
            value={item}
            key={item.id}
            className="py-2 pl-4 pr-2 bg-gray-900 text-white rounded-lg mb-4 flex justify-between items-center min-h-16 cursor-grab"
          >
            <p className={item.finished ? 'line-through' : ''}>{item.desc}</p>
            {!item.finished && (
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-accent"
                  onClick={() => onFinishHandler(item.id)}
                >
                  <Heart />
                </button>
                <button
                  className="btn btn-square btn-error"
                  onClick={() => onRemoveHandler(item.id)}
                >
                  <Close />
                </button>
              </div>
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <AddTodo onAdd={onAddHandler} />
    </div>
  );
};
