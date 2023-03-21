import { Todo, Todos } from '@/components/Todos';
import { client } from '@/lib/client';
import { GET_TODO_ITEMS_QUERY } from '@/constants/gql';

type MyListPageMetadata = {
  params: { listId: string };
};

export async function generateMetadata({ params }: MyListPageMetadata) {
  return {
    title: `TODO List ${params.listId}`,
  };
}

type MyListPageProps = MyListPageMetadata;

export default async function MyListPage({
  params: { listId },
}: MyListPageProps) {
  const { getTODOs } = await client('GetTODOs').request<{
    getTODOs: Todo[];
  }>(GET_TODO_ITEMS_QUERY, {
    listId: parseInt(listId),
  });

  return (
    <div className="flex align-center justify-center p-16 sm:p-8">
      <Todos listId={parseInt(listId)} list={[...getTODOs]} />
    </div>
  );
}
