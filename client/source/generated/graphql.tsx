import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AuthenticationResponse = {
  __typename?: 'AuthenticationResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type Board = {
  __typename?: 'Board';
  columns: Array<Column>;
  createdAt: Scalars['DateTime'];
  createdBy: User;
  deletedAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['Float'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Card = {
  __typename?: 'Card';
  description: Scalars['String'];
  id: Scalars['Float'];
  index: Scalars['Float'];
  title: Scalars['String'];
};

export type Column = {
  __typename?: 'Column';
  cards: Array<Card>;
  id: Scalars['Float'];
  index: Scalars['Float'];
  title: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCard: Card;
  addColumn: Column;
  createBoard: Board;
  createUser: AuthenticationResponse;
  deleteBoard?: Maybe<Scalars['Int']>;
  loginWithPassword: AuthenticationResponse;
  logout: Scalars['Boolean'];
  moveCard?: Maybe<Card>;
  removeCard?: Maybe<Scalars['Int']>;
  removeColumn?: Maybe<Scalars['Int']>;
  resetPassword: AuthenticationResponse;
  restoreBoard?: Maybe<Scalars['Int']>;
  sendResetPasswordEmail: Scalars['Boolean'];
  updateBoard?: Maybe<Board>;
  updateCard?: Maybe<Card>;
  updateColumn?: Maybe<Column>;
};


export type MutationAddCardArgs = {
  columnId: Scalars['Int'];
  description?: InputMaybe<Scalars['String']>;
  index?: InputMaybe<Scalars['Int']>;
  title: Scalars['String'];
};


export type MutationAddColumnArgs = {
  boardId: Scalars['Int'];
  index?: InputMaybe<Scalars['Int']>;
  title: Scalars['String'];
};


export type MutationCreateBoardArgs = {
  description?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationDeleteBoardArgs = {
  id: Scalars['Int'];
};


export type MutationLoginWithPasswordArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationMoveCardArgs = {
  id: Scalars['Int'];
  toColumnId: Scalars['Int'];
  toIndex: Scalars['Int'];
};


export type MutationRemoveCardArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveColumnArgs = {
  id: Scalars['Int'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationRestoreBoardArgs = {
  id: Scalars['Int'];
};


export type MutationSendResetPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationUpdateBoardArgs = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateCardArgs = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateColumnArgs = {
  id: Scalars['Int'];
  index?: InputMaybe<Scalars['Int']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  allBoards: Array<Board>;
  allDeletedBoards: Array<Board>;
  currentUser?: Maybe<User>;
  findBoardById?: Maybe<Board>;
};


export type QueryFindBoardByIdArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  boards: Array<Board>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type BoardFragmentFragment = { __typename?: 'Board', id: number, title: string, description: string, createdAt: any, updatedAt: any };

export type CardFragmentFragment = { __typename?: 'Card', id: number, title: string, description: string, index: number };

export type ColumnFragmentFragment = { __typename?: 'Column', id: number, title: string, index: number, cards: Array<{ __typename?: 'Card', id: number, title: string, description: string, index: number }> };

export type UserFragmentFragment = { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string };

export type AddCardMutationVariables = Exact<{
  title: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  index?: InputMaybe<Scalars['Int']>;
  columnId: Scalars['Int'];
}>;


export type AddCardMutation = { __typename?: 'Mutation', card: { __typename?: 'Card', id: number, title: string, description: string, index: number } };

export type AddColumnMutationVariables = Exact<{
  boardId: Scalars['Int'];
  title: Scalars['String'];
  index?: InputMaybe<Scalars['Int']>;
}>;


export type AddColumnMutation = { __typename?: 'Mutation', column: { __typename?: 'Column', id: number, title: string, index: number, cards: Array<{ __typename?: 'Card', id: number, title: string, description: string, index: number }> } };

export type CreateBoardMutationVariables = Exact<{
  title: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
}>;


export type CreateBoardMutation = { __typename?: 'Mutation', board: { __typename?: 'Board', id: number, title: string, description: string, createdAt: any, updatedAt: any } };

export type CreateUserMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null } };

export type DeleteBoardMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteBoardMutation = { __typename?: 'Mutation', id?: number | null };

export type LoginWithPasswordMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginWithPasswordMutation = { __typename?: 'Mutation', loginWithPassword: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type MoveCardMutationVariables = Exact<{
  toIndex: Scalars['Int'];
  toColumnId: Scalars['Int'];
  id: Scalars['Int'];
}>;


export type MoveCardMutation = { __typename?: 'Mutation', card?: { __typename?: 'Card', id: number } | null };

export type ResetPasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  token: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null } };

export type RestoreBoardMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RestoreBoardMutation = { __typename?: 'Mutation', id?: number | null };

export type SendResetPasswordEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendResetPasswordEmailMutation = { __typename?: 'Mutation', sendResetPasswordEmail: boolean };

export type UpdateBoardMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
}>;


export type UpdateBoardMutation = { __typename?: 'Mutation', board?: { __typename?: 'Board', id: number, title: string, description: string, createdAt: any, updatedAt: any } | null };

export type AllBoardsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllBoardsQuery = { __typename?: 'Query', boards: Array<{ __typename?: 'Board', id: number, title: string, description: string, createdAt: any, updatedAt: any }> };

export type AllDeletedBoardsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllDeletedBoardsQuery = { __typename?: 'Query', boards: Array<{ __typename?: 'Board', id: number, title: string, description: string, createdAt: any, updatedAt: any }> };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null };

export type FindBoardByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindBoardByIdQuery = { __typename?: 'Query', board?: { __typename?: 'Board', id: number, title: string, description: string, createdAt: any, updatedAt: any, createdBy: { __typename?: 'User', id: number, username: string }, columns: Array<{ __typename?: 'Column', id: number, title: string, index: number, cards: Array<{ __typename?: 'Card', id: number, title: string, description: string, index: number }> }> } | null };

export const BoardFragmentFragmentDoc = gql`
    fragment BoardFragment on Board {
  id
  title
  description
  createdAt
  updatedAt
}
    `;
export const CardFragmentFragmentDoc = gql`
    fragment CardFragment on Card {
  id
  title
  description
  index
}
    `;
export const ColumnFragmentFragmentDoc = gql`
    fragment ColumnFragment on Column {
  id
  title
  index
  cards {
    ...CardFragment
  }
}
    ${CardFragmentFragmentDoc}`;
export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  username
  email
  createdAt
  updatedAt
}
    `;
export const AddCardDocument = gql`
    mutation AddCard($title: String!, $description: String, $index: Int, $columnId: Int!) {
  card: addCard(
    title: $title
    description: $description
    index: $index
    columnId: $columnId
  ) {
    ...CardFragment
  }
}
    ${CardFragmentFragmentDoc}`;

export function useAddCardMutation() {
  return Urql.useMutation<AddCardMutation, AddCardMutationVariables>(AddCardDocument);
};
export const AddColumnDocument = gql`
    mutation AddColumn($boardId: Int!, $title: String!, $index: Int) {
  column: addColumn(boardId: $boardId, title: $title, index: $index) {
    ...ColumnFragment
  }
}
    ${ColumnFragmentFragmentDoc}`;

export function useAddColumnMutation() {
  return Urql.useMutation<AddColumnMutation, AddColumnMutationVariables>(AddColumnDocument);
};
export const CreateBoardDocument = gql`
    mutation CreateBoard($title: String!, $description: String) {
  board: createBoard(title: $title, description: $description) {
    ...BoardFragment
  }
}
    ${BoardFragmentFragmentDoc}`;

export function useCreateBoardMutation() {
  return Urql.useMutation<CreateBoardMutation, CreateBoardMutationVariables>(CreateBoardDocument);
};
export const CreateUserDocument = gql`
    mutation CreateUser($password: String!, $email: String!, $username: String!) {
  createUser(password: $password, email: $email, username: $username) {
    errors {
      field
      message
    }
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;

export function useCreateUserMutation() {
  return Urql.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument);
};
export const DeleteBoardDocument = gql`
    mutation DeleteBoard($id: Int!) {
  id: deleteBoard(id: $id)
}
    `;

export function useDeleteBoardMutation() {
  return Urql.useMutation<DeleteBoardMutation, DeleteBoardMutationVariables>(DeleteBoardDocument);
};
export const LoginWithPasswordDocument = gql`
    mutation LoginWithPassword($password: String!, $email: String!) {
  loginWithPassword(password: $password, email: $email) {
    errors {
      field
      message
    }
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;

export function useLoginWithPasswordMutation() {
  return Urql.useMutation<LoginWithPasswordMutation, LoginWithPasswordMutationVariables>(LoginWithPasswordDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const MoveCardDocument = gql`
    mutation MoveCard($toIndex: Int!, $toColumnId: Int!, $id: Int!) {
  card: moveCard(toIndex: $toIndex, toColumnId: $toColumnId, id: $id) {
    id
  }
}
    `;

export function useMoveCardMutation() {
  return Urql.useMutation<MoveCardMutation, MoveCardMutationVariables>(MoveCardDocument);
};
export const ResetPasswordDocument = gql`
    mutation ResetPassword($newPassword: String!, $token: String!) {
  resetPassword(newPassword: $newPassword, token: $token) {
    errors {
      field
      message
    }
    user {
      ...UserFragment
    }
  }
}
    ${UserFragmentFragmentDoc}`;

export function useResetPasswordMutation() {
  return Urql.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument);
};
export const RestoreBoardDocument = gql`
    mutation RestoreBoard($id: Int!) {
  id: restoreBoard(id: $id)
}
    `;

export function useRestoreBoardMutation() {
  return Urql.useMutation<RestoreBoardMutation, RestoreBoardMutationVariables>(RestoreBoardDocument);
};
export const SendResetPasswordEmailDocument = gql`
    mutation SendResetPasswordEmail($email: String!) {
  sendResetPasswordEmail(email: $email)
}
    `;

export function useSendResetPasswordEmailMutation() {
  return Urql.useMutation<SendResetPasswordEmailMutation, SendResetPasswordEmailMutationVariables>(SendResetPasswordEmailDocument);
};
export const UpdateBoardDocument = gql`
    mutation UpdateBoard($id: Int!, $title: String, $description: String) {
  board: updateBoard(id: $id, title: $title, description: $description) {
    ...BoardFragment
  }
}
    ${BoardFragmentFragmentDoc}`;

export function useUpdateBoardMutation() {
  return Urql.useMutation<UpdateBoardMutation, UpdateBoardMutationVariables>(UpdateBoardDocument);
};
export const AllBoardsDocument = gql`
    query AllBoards {
  boards: allBoards {
    ...BoardFragment
  }
}
    ${BoardFragmentFragmentDoc}`;

export function useAllBoardsQuery(options?: Omit<Urql.UseQueryArgs<AllBoardsQueryVariables>, 'query'>) {
  return Urql.useQuery<AllBoardsQuery>({ query: AllBoardsDocument, ...options });
};
export const AllDeletedBoardsDocument = gql`
    query AllDeletedBoards {
  boards: allDeletedBoards {
    ...BoardFragment
  }
}
    ${BoardFragmentFragmentDoc}`;

export function useAllDeletedBoardsQuery(options?: Omit<Urql.UseQueryArgs<AllDeletedBoardsQueryVariables>, 'query'>) {
  return Urql.useQuery<AllDeletedBoardsQuery>({ query: AllDeletedBoardsDocument, ...options });
};
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

export function useCurrentUserQuery(options?: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'>) {
  return Urql.useQuery<CurrentUserQuery>({ query: CurrentUserDocument, ...options });
};
export const FindBoardByIdDocument = gql`
    query FindBoardById($id: Int!) {
  board: findBoardById(id: $id) {
    id
    title
    description
    createdBy {
      id
      username
    }
    columns {
      ...ColumnFragment
    }
    createdAt
    updatedAt
  }
}
    ${ColumnFragmentFragmentDoc}`;

export function useFindBoardByIdQuery(options: Omit<Urql.UseQueryArgs<FindBoardByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<FindBoardByIdQuery>({ query: FindBoardByIdDocument, ...options });
};