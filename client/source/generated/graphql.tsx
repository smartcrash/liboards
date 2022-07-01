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
  favorite: Scalars['Boolean'];
  id: Scalars['Float'];
  slug: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Card = {
  __typename?: 'Card';
  column: Column;
  comments: Array<Comment>;
  description: Scalars['String'];
  id: Scalars['Float'];
  index: Scalars['Float'];
  tasks: Array<Task>;
  title: Scalars['String'];
};

export type Column = {
  __typename?: 'Column';
  cards: Array<Card>;
  id: Scalars['Float'];
  title: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  canDelete: Scalars['Boolean'];
  canUpdate: Scalars['Boolean'];
  card: Card;
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['Float'];
  updatedAt: Scalars['DateTime'];
  user: User;
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
  addComment: Comment;
  addTask?: Maybe<Task>;
  addToFavorites: Scalars['Boolean'];
  createBoard: Board;
  createUser: AuthenticationResponse;
  deleteBoard: Scalars['Int'];
  forceDeleteBoard: Scalars['Int'];
  loginWithPassword: AuthenticationResponse;
  loginWithToken: AuthenticationResponse;
  logout: Scalars['Boolean'];
  moveCard?: Maybe<Card>;
  removeCard?: Maybe<Scalars['Int']>;
  removeColumn?: Maybe<Scalars['Int']>;
  removeComment: Scalars['Int'];
  removeFromFavorites: Scalars['Boolean'];
  removeTask: Scalars['Int'];
  resetPassword: AuthenticationResponse;
  restoreBoard?: Maybe<Scalars['Int']>;
  sendResetPasswordEmail: Scalars['Boolean'];
  updateBoard: Board;
  updateCard?: Maybe<Card>;
  updateColumn?: Maybe<Column>;
  updateComment: Comment;
  updateTask: Task;
};


export type MutationAddCardArgs = {
  columnId: Scalars['Int'];
  description?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};


export type MutationAddColumnArgs = {
  boardId: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationAddCommentArgs = {
  cardId: Scalars['Int'];
  content: Scalars['String'];
};


export type MutationAddTaskArgs = {
  cardId: Scalars['Int'];
  content: Scalars['String'];
};


export type MutationAddToFavoritesArgs = {
  id: Scalars['Int'];
};


export type MutationCreateBoardArgs = {
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


export type MutationForceDeleteBoardArgs = {
  id: Scalars['Int'];
};


export type MutationLoginWithPasswordArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginWithTokenArgs = {
  token: Scalars['String'];
  userInfo: UserInfo;
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


export type MutationRemoveCommentArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveFromFavoritesArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveTaskArgs = {
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
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateCommentArgs = {
  content?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};


export type MutationUpdateTaskArgs = {
  completed?: InputMaybe<Scalars['Boolean']>;
  content?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  allBoards: Array<Board>;
  allDeletedBoards: Array<Board>;
  allFavorites: Array<Board>;
  currentUser?: Maybe<User>;
  findBoardById?: Maybe<Board>;
  findCardById?: Maybe<Card>;
};


export type QueryFindBoardByIdArgs = {
  id: Scalars['Int'];
};


export type QueryFindCardByIdArgs = {
  id: Scalars['Int'];
};

export type Task = {
  __typename?: 'Task';
  card: Card;
  completed: Scalars['Boolean'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  createdBy: User;
  id: Scalars['Float'];
  updatedAt: Scalars['DateTime'];
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

export type UserInfo = {
  email: Scalars['String'];
  name: Scalars['String'];
  picture: Scalars['String'];
};

export type BoardFragmentFragment = { __typename?: 'Board', id: number, title: string, slug: string, createdAt: any, updatedAt: any, favorite: boolean };

export type CardFragmentFragment = { __typename?: 'Card', id: number, title: string, description: string, index: number };

export type ColumnFragmentFragment = { __typename?: 'Column', id: number, title: string, cards: Array<{ __typename?: 'Card', id: number, title: string, description: string, index: number }> };

export type CommentFragmentFragment = { __typename?: 'Comment', id: number, content: string, canUpdate: boolean, canDelete: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'User', id: number, username: string } };

export type TaskFragmentFragment = { __typename?: 'Task', id: number, content: string, completed: boolean };

export type UserFragmentFragment = { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string };

export type AddCardMutationVariables = Exact<{
  title: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  columnId: Scalars['Int'];
}>;


export type AddCardMutation = { __typename?: 'Mutation', card: { __typename?: 'Card', id: number, title: string, description: string, index: number } };

export type AddColumnMutationVariables = Exact<{
  boardId: Scalars['Int'];
  title: Scalars['String'];
}>;


export type AddColumnMutation = { __typename?: 'Mutation', column: { __typename?: 'Column', id: number, title: string, cards: Array<{ __typename?: 'Card', id: number, title: string, description: string, index: number }> } };

export type AddCommentMutationVariables = Exact<{
  cardId: Scalars['Int'];
  content: Scalars['String'];
}>;


export type AddCommentMutation = { __typename?: 'Mutation', comment: { __typename?: 'Comment', id: number, content: string, canUpdate: boolean, canDelete: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'User', id: number, username: string } } };

export type AddTaskMutationVariables = Exact<{
  cardId: Scalars['Int'];
  content: Scalars['String'];
}>;


export type AddTaskMutation = { __typename?: 'Mutation', task?: { __typename?: 'Task', id: number, content: string, completed: boolean } | null };

export type AddToFavoritesMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type AddToFavoritesMutation = { __typename?: 'Mutation', addToFavorites: boolean };

export type AllFavoritesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllFavoritesQuery = { __typename?: 'Query', favorites: Array<{ __typename?: 'Board', id: number, title: string, slug: string, createdAt: any, updatedAt: any, favorite: boolean }> };

export type CreateBoardMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type CreateBoardMutation = { __typename?: 'Mutation', board: { __typename?: 'Board', id: number, title: string, slug: string, createdAt: any, updatedAt: any, favorite: boolean } };

export type CreateUserMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null } };

export type DeleteBoardMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteBoardMutation = { __typename?: 'Mutation', id: number };

export type ForceDeleteBoardMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ForceDeleteBoardMutation = { __typename?: 'Mutation', id: number };

export type LoginWithPasswordMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginWithPasswordMutation = { __typename?: 'Mutation', loginWithPassword: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null } };

export type LoginWithTokenMutationVariables = Exact<{
  token: Scalars['String'];
  userInfo: UserInfo;
}>;


export type LoginWithTokenMutation = { __typename?: 'Mutation', loginWithToken: { __typename?: 'AuthenticationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type MoveCardMutationVariables = Exact<{
  toIndex: Scalars['Int'];
  toColumnId: Scalars['Int'];
  id: Scalars['Int'];
}>;


export type MoveCardMutation = { __typename?: 'Mutation', card?: { __typename?: 'Card', id: number } | null };

export type RemoveCardMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RemoveCardMutation = { __typename?: 'Mutation', id?: number | null };

export type RemoveColumnMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RemoveColumnMutation = { __typename?: 'Mutation', id?: number | null };

export type RemoveCommentMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RemoveCommentMutation = { __typename?: 'Mutation', id: number };

export type RemoveFromFavoritesMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RemoveFromFavoritesMutation = { __typename?: 'Mutation', removeFromFavorites: boolean };

export type RemoveTaskMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RemoveTaskMutation = { __typename?: 'Mutation', id: number };

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
}>;


export type UpdateBoardMutation = { __typename?: 'Mutation', board: { __typename?: 'Board', id: number, title: string, slug: string, createdAt: any, updatedAt: any, favorite: boolean } };

export type UpdateCardMutationVariables = Exact<{
  id: Scalars['Int'];
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
}>;


export type UpdateCardMutation = { __typename?: 'Mutation', updateCard?: { __typename?: 'Card', id: number, title: string, description: string, index: number } | null };

export type UpdateColumnMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
}>;


export type UpdateColumnMutation = { __typename?: 'Mutation', column?: { __typename?: 'Column', id: number, title: string, cards: Array<{ __typename?: 'Card', id: number, title: string, description: string, index: number }> } | null };

export type UpdateCommentMutationVariables = Exact<{
  content: Scalars['String'];
  id: Scalars['Int'];
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', comment: { __typename?: 'Comment', id: number, content: string, canUpdate: boolean, canDelete: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'User', id: number, username: string } } };

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars['Int'];
  content?: InputMaybe<Scalars['String']>;
  completed?: InputMaybe<Scalars['Boolean']>;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', task: { __typename?: 'Task', id: number, content: string, completed: boolean } };

export type AllBoardsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllBoardsQuery = { __typename?: 'Query', boards: Array<{ __typename?: 'Board', id: number, title: string, slug: string, createdAt: any, updatedAt: any, favorite: boolean }> };

export type AllDeletedBoardsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllDeletedBoardsQuery = { __typename?: 'Query', boards: Array<{ __typename?: 'Board', id: number, title: string, slug: string, createdAt: any, updatedAt: any, favorite: boolean }> };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string } | null };

export type FindBoardByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindBoardByIdQuery = { __typename?: 'Query', board?: { __typename?: 'Board', id: number, title: string, slug: string, favorite: boolean, createdAt: any, updatedAt: any, createdBy: { __typename?: 'User', id: number, username: string }, columns: Array<{ __typename?: 'Column', id: number, title: string, cards: Array<{ __typename?: 'Card', id: number, title: string, description: string, index: number }> }> } | null };

export type FindCardByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type FindCardByIdQuery = { __typename?: 'Query', card?: { __typename?: 'Card', id: number, title: string, description: string, column: { __typename?: 'Column', id: number, title: string }, tasks: Array<{ __typename?: 'Task', id: number, content: string, completed: boolean }>, comments: Array<{ __typename?: 'Comment', id: number, content: string, canUpdate: boolean, canDelete: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'User', id: number, username: string } }> } | null };

export const BoardFragmentFragmentDoc = gql`
    fragment BoardFragment on Board {
  id
  title
  slug
  createdAt
  updatedAt
  favorite
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
  cards {
    ...CardFragment
  }
}
    ${CardFragmentFragmentDoc}`;
export const CommentFragmentFragmentDoc = gql`
    fragment CommentFragment on Comment {
  id
  content
  user {
    id
    username
  }
  canUpdate
  canDelete
  createdAt
  updatedAt
}
    `;
export const TaskFragmentFragmentDoc = gql`
    fragment TaskFragment on Task {
  id
  content
  completed
}
    `;
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
    mutation AddCard($title: String!, $description: String, $columnId: Int!) {
  card: addCard(title: $title, description: $description, columnId: $columnId) {
    ...CardFragment
  }
}
    ${CardFragmentFragmentDoc}`;

export function useAddCardMutation() {
  return Urql.useMutation<AddCardMutation, AddCardMutationVariables>(AddCardDocument);
};
export const AddColumnDocument = gql`
    mutation AddColumn($boardId: Int!, $title: String!) {
  column: addColumn(boardId: $boardId, title: $title) {
    ...ColumnFragment
  }
}
    ${ColumnFragmentFragmentDoc}`;

export function useAddColumnMutation() {
  return Urql.useMutation<AddColumnMutation, AddColumnMutationVariables>(AddColumnDocument);
};
export const AddCommentDocument = gql`
    mutation AddComment($cardId: Int!, $content: String!) {
  comment: addComment(cardId: $cardId, content: $content) {
    ...CommentFragment
  }
}
    ${CommentFragmentFragmentDoc}`;

export function useAddCommentMutation() {
  return Urql.useMutation<AddCommentMutation, AddCommentMutationVariables>(AddCommentDocument);
};
export const AddTaskDocument = gql`
    mutation AddTask($cardId: Int!, $content: String!) {
  task: addTask(cardId: $cardId, content: $content) {
    ...TaskFragment
  }
}
    ${TaskFragmentFragmentDoc}`;

export function useAddTaskMutation() {
  return Urql.useMutation<AddTaskMutation, AddTaskMutationVariables>(AddTaskDocument);
};
export const AddToFavoritesDocument = gql`
    mutation AddToFavorites($id: Int!) {
  addToFavorites(id: $id)
}
    `;

export function useAddToFavoritesMutation() {
  return Urql.useMutation<AddToFavoritesMutation, AddToFavoritesMutationVariables>(AddToFavoritesDocument);
};
export const AllFavoritesDocument = gql`
    query AllFavorites {
  favorites: allFavorites {
    ...BoardFragment
  }
}
    ${BoardFragmentFragmentDoc}`;

export function useAllFavoritesQuery(options?: Omit<Urql.UseQueryArgs<AllFavoritesQueryVariables>, 'query'>) {
  return Urql.useQuery<AllFavoritesQuery>({ query: AllFavoritesDocument, ...options });
};
export const CreateBoardDocument = gql`
    mutation CreateBoard($title: String!) {
  board: createBoard(title: $title) {
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
export const ForceDeleteBoardDocument = gql`
    mutation ForceDeleteBoard($id: Int!) {
  id: forceDeleteBoard(id: $id)
}
    `;

export function useForceDeleteBoardMutation() {
  return Urql.useMutation<ForceDeleteBoardMutation, ForceDeleteBoardMutationVariables>(ForceDeleteBoardDocument);
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
export const LoginWithTokenDocument = gql`
    mutation LoginWithToken($token: String!, $userInfo: UserInfo!) {
  loginWithToken(token: $token, userInfo: $userInfo) {
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

export function useLoginWithTokenMutation() {
  return Urql.useMutation<LoginWithTokenMutation, LoginWithTokenMutationVariables>(LoginWithTokenDocument);
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
export const RemoveCardDocument = gql`
    mutation removeCard($id: Int!) {
  id: removeCard(id: $id)
}
    `;

export function useRemoveCardMutation() {
  return Urql.useMutation<RemoveCardMutation, RemoveCardMutationVariables>(RemoveCardDocument);
};
export const RemoveColumnDocument = gql`
    mutation RemoveColumn($id: Int!) {
  id: removeColumn(id: $id)
}
    `;

export function useRemoveColumnMutation() {
  return Urql.useMutation<RemoveColumnMutation, RemoveColumnMutationVariables>(RemoveColumnDocument);
};
export const RemoveCommentDocument = gql`
    mutation RemoveComment($id: Int!) {
  id: removeComment(id: $id)
}
    `;

export function useRemoveCommentMutation() {
  return Urql.useMutation<RemoveCommentMutation, RemoveCommentMutationVariables>(RemoveCommentDocument);
};
export const RemoveFromFavoritesDocument = gql`
    mutation RemoveFromFavorites($id: Int!) {
  removeFromFavorites(id: $id)
}
    `;

export function useRemoveFromFavoritesMutation() {
  return Urql.useMutation<RemoveFromFavoritesMutation, RemoveFromFavoritesMutationVariables>(RemoveFromFavoritesDocument);
};
export const RemoveTaskDocument = gql`
    mutation RemoveTask($id: Int!) {
  id: removeTask(id: $id)
}
    `;

export function useRemoveTaskMutation() {
  return Urql.useMutation<RemoveTaskMutation, RemoveTaskMutationVariables>(RemoveTaskDocument);
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
    mutation UpdateBoard($id: Int!, $title: String) {
  board: updateBoard(id: $id, title: $title) {
    ...BoardFragment
  }
}
    ${BoardFragmentFragmentDoc}`;

export function useUpdateBoardMutation() {
  return Urql.useMutation<UpdateBoardMutation, UpdateBoardMutationVariables>(UpdateBoardDocument);
};
export const UpdateCardDocument = gql`
    mutation UpdateCard($id: Int!, $description: String, $title: String) {
  updateCard(id: $id, description: $description, title: $title) {
    ...CardFragment
  }
}
    ${CardFragmentFragmentDoc}`;

export function useUpdateCardMutation() {
  return Urql.useMutation<UpdateCardMutation, UpdateCardMutationVariables>(UpdateCardDocument);
};
export const UpdateColumnDocument = gql`
    mutation UpdateColumn($id: Int!, $title: String) {
  column: updateColumn(id: $id, title: $title) {
    ...ColumnFragment
  }
}
    ${ColumnFragmentFragmentDoc}`;

export function useUpdateColumnMutation() {
  return Urql.useMutation<UpdateColumnMutation, UpdateColumnMutationVariables>(UpdateColumnDocument);
};
export const UpdateCommentDocument = gql`
    mutation UpdateComment($content: String!, $id: Int!) {
  comment: updateComment(content: $content, id: $id) {
    ...CommentFragment
  }
}
    ${CommentFragmentFragmentDoc}`;

export function useUpdateCommentMutation() {
  return Urql.useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(UpdateCommentDocument);
};
export const UpdateTaskDocument = gql`
    mutation UpdateTask($id: Int!, $content: String, $completed: Boolean) {
  task: updateTask(id: $id, content: $content, completed: $completed) {
    ...TaskFragment
  }
}
    ${TaskFragmentFragmentDoc}`;

export function useUpdateTaskMutation() {
  return Urql.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument);
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
    slug
    favorite
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
export const FindCardByIdDocument = gql`
    query FindCardById($id: Int!) {
  card: findCardById(id: $id) {
    id
    title
    description
    column {
      id
      title
    }
    tasks {
      ...TaskFragment
    }
    comments {
      ...CommentFragment
    }
  }
}
    ${TaskFragmentFragmentDoc}
${CommentFragmentFragmentDoc}`;

export function useFindCardByIdQuery(options: Omit<Urql.UseQueryArgs<FindCardByIdQueryVariables>, 'query'>) {
  return Urql.useQuery<FindCardByIdQuery>({ query: FindCardByIdDocument, ...options });
};