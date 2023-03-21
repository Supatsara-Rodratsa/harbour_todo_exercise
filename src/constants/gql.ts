import { gql } from 'graphql-request';

export const GET_TODO_LISTS_QUERY = gql`
  query GetTODOLists($email: String!) {
    getTODOLists(email: $email) {
      id
      name
    }
  }
`;

export const GET_TODO_ITEMS_QUERY = gql`
  query GetTODOs($listId: Int!) {
    getTODOs(listId: $listId) {
      id
      desc
      finished
    }
  }
`;

export const ADD_TODO_MUTATION = gql`
  mutation AddTODO($listId: Int!, $desc: String!) {
    addTODO(listId: $listId, desc: $desc) {
      id
      desc
      finished
      todo_list_id
    }
  }
`;

export const REMOVE_TODO_MUTATION = gql`
  mutation RemoveTODO($removeTodoId: Int!, $listId: Int!) {
    removeTODO(id: $removeTodoId, listId: $listId)
  }
`;

export const FINISH_TODO_MUTATION = gql`
  mutation FinishTODO($finishTodoId: Int!, $listId: Int!) {
    finishTODO(id: $finishTodoId, listId: $listId) {
      id
      created_at
      desc
      todo_list_id
      finished
    }
  }
`;

export const DELETE_TODO_LIST_MUTATION = gql`
  mutation DeleteTODOList($deleteTodoListId: Int!) {
    deleteTODOList(id: $deleteTodoListId)
  }
`;
