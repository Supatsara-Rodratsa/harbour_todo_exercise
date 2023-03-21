import { MyLists, TodoList } from '@/components/MyLists';
import { client } from '@/lib/client';
import { MY_EMAIL_KEY } from '../constants/email';
import { GET_TODO_LISTS_QUERY } from '@/constants/gql';

export default async function Home() {
  const { getTODOLists } = await client('getTODOLists').request<{
    getTODOLists: TodoList[];
  }>(GET_TODO_LISTS_QUERY, {
    email: MY_EMAIL_KEY,
  });

  return (
    <div className="p-8 flex items-center flex-col">
      <div className="w-full max-w-[500px]">
        <MyLists list={getTODOLists ?? []} />
      </div>
    </div>
  );
}
