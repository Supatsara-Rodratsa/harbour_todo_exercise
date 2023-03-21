'use client';

// import Link from 'next/link';
import classNames from 'classnames';
import { CreateList } from '@/components/CreateList';
import { Close } from '@/components/icons/Close';
import { randomColor } from '@/utils/randomColor';
import { useState, useEffect } from 'react';
import { client } from '@/lib/client';
import { DELETE_TODO_LIST_MUTATION } from '@/constants/gql';
import { Edit } from './icons/Edit';
import { Reorder, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Drag } from './icons/Drag';

export type TodoList = {
  id: number;
  created_at: string;
  name: string;
  email: string;
};

type MyListsProps = {
  list: TodoList[];
};

export const MyLists = ({ list = [] }: MyListsProps) => {
  const router = useRouter();
  const [todoLists, setTodoLists] = useState<TodoList[]>(list);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number[]>();

  useEffect(() => {
    if (todoLists.length == 0) {
      setShowButton(false);
    }
    if (showButton) {
      const interval = setInterval(() => {
        const random: number[] = [];
        todoLists.forEach(() => {
          const randomRotation = Math.floor(Math.random() * 50) - 10;
          random.push(randomRotation);
        });
        setRotation([...random]);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [todoLists, showButton]);

  const onCreateHandler = (newTodoList: TodoList) => {
    setTodoLists([...todoLists, newTodoList]);
  };

  const onDeletedHandler = async (id: string) => {
    const { deleteTODOList } = await client('DeleteTODOList').request<{
      deleteTODOList: boolean;
    }>(DELETE_TODO_LIST_MUTATION, {
      deleteTodoListId: parseInt(id),
    });

    if (deleteTODOList) {
      const index = todoLists.findIndex(
        (todoList: TodoList) => todoList.id.toString() === id,
      );
      if (index !== -1) {
        todoLists.splice(index, 1);
        setTodoLists([...todoLists]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 text-center">
      <div className="flex gap-2 w-full justify-center items-center">
        <h1 className="text-4xl text-blue-300">
          {todoLists.length > 0 ? 'My TODO lists' : 'No lists yet!'}
        </h1>
        {todoLists.length > 0 && (
          <div
            className="cursor-pointer"
            onClick={() => setShowButton(!showButton)}
          >
            <Edit />
          </div>
        )}
      </div>
      <Reorder.Group values={todoLists} onReorder={setTodoLists}>
        {todoLists.map((item, i) => (
          <Reorder.Item
            key={item.id}
            initial={{ x: 50 }}
            animate={{
              x: 0,
            }}
            exit={{
              x: 0,
            }}
            transition={{ duration: 1 }}
            value={item}
            className="flex w-full gap-4 items-center"
          >
            <motion.div
              animate={{
                rotate: [0, (showButton && rotation?.at(i)) || 0, 0, 0],
              }}
              transition={{
                duration: Math.random() * 0.07 + 0.23,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className={classNames(
                'w-full bg-gray-900 pr-2 rounded-lg mb-4 flex justify-between items-center text-black hover:scale-[1.02] transform transition duration-300 ease-in-out',
                randomColor(),
              )}
            >
              <div
                className="w-full h-full min-h-16 py-2 pl-4 flex items-center cursor-pointer"
                onClick={() => router.push(item.id.toString())}
              >
                {item.name}
              </div>

              <div className="cursor-grab">
                <Drag />
              </div>
            </motion.div>

            {showButton && (
              <button
                className="btn btn-square btn-error mb-4"
                onClick={() => onDeletedHandler(item.id.toString())}
              >
                <Close />
              </button>
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <CreateList onCreate={onCreateHandler} />
    </div>
  );
};
